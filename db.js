'use strict';

const path = require('node:path');
const { DatabaseSync, backup } = require('node:sqlite');

const DEFAULT_DB_PATH = path.join(__dirname, 'south_team_bi.db');

/**
 * Inicializa e encapsula o banco relacional SQLite (`node:sqlite`)
 * para armazenar 10+ meses de pedidos, cancelamentos, desempenho ML,
 * custos customizados, regras de SKU, snapshots e configurações.
 */
class SouthTeamDB {
    constructor(dbPath = DEFAULT_DB_PATH) {
        this.dbPath = dbPath;
        this._txDepth = 0;
        this.db = new DatabaseSync(dbPath);
        this.db.exec('PRAGMA journal_mode = WAL;');
        this.db.exec('PRAGMA synchronous = NORMAL;');
        this.db.exec('PRAGMA foreign_keys = ON;');
        this.initSchema();
        this.prepareStatements();
    }

    initSchema() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS import_files (
                rel_path TEXT PRIMARY KEY,
                source_type TEXT NOT NULL,
                month_key TEXT NOT NULL,
                period_text TEXT DEFAULT '',
                file_size INTEGER DEFAULT 0,
                mtime_ms REAL DEFAULT 0,
                row_count INTEGER DEFAULT 0,
                valid_order_count INTEGER DEFAULT 0,
                cancelled_count INTEGER DEFAULT 0,
                imported_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_file TEXT NOT NULL REFERENCES import_files(rel_path) ON DELETE CASCADE,
                channel TEXT NOT NULL,
                month_key TEXT NOT NULL,
                order_id TEXT NOT NULL,
                item_id TEXT DEFAULT '',
                date TEXT DEFAULT '',
                iso_date TEXT DEFAULT '',
                product_name TEXT NOT NULL,
                sku TEXT DEFAULT '',
                variation TEXT DEFAULT '',
                qty INTEGER NOT NULL DEFAULT 1,
                qty_source TEXT DEFAULT '',
                needs_qty_check INTEGER DEFAULT 0,
                subtotal REAL NOT NULL DEFAULT 0,
                item_commission REAL NOT NULL DEFAULT 0,
                item_service_fee REAL NOT NULL DEFAULT 0,
                item_fees REAL NOT NULL DEFAULT 0,
                item_shipping REAL NOT NULL DEFAULT 0,
                seller_discount REAL NOT NULL DEFAULT 0,
                seller_coupon REAL NOT NULL DEFAULT 0,
                pix_adj REAL NOT NULL DEFAULT 0,
                action_adj REAL NOT NULL DEFAULT 0,
                net_received REAL NOT NULL DEFAULT 0,
                financing_fee REAL NOT NULL DEFAULT 0,
                coupon_fee REAL NOT NULL DEFAULT 0,
                release_date TEXT DEFAULT '',
                release_iso_date TEXT DEFAULT '',
                release_days REAL,
                payment_type TEXT DEFAULT '',
                installments INTEGER DEFAULT 1,
                model_key TEXT DEFAULT '',
                canonical_name TEXT DEFAULT '',
                default_model_cost REAL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS cancelled_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_file TEXT NOT NULL REFERENCES import_files(rel_path) ON DELETE CASCADE,
                channel TEXT NOT NULL,
                month_key TEXT NOT NULL,
                order_id TEXT NOT NULL,
                date TEXT DEFAULT '',
                iso_date TEXT DEFAULT '',
                product_name TEXT DEFAULT '',
                sku TEXT DEFAULT '',
                status TEXT DEFAULT '',
                reason TEXT DEFAULT '',
                amount REAL DEFAULT 0,
                amount_refunded REAL DEFAULT 0,
                claim_id TEXT DEFAULT '',
                chargeback_id TEXT DEFAULT ''
            );

            CREATE TABLE IF NOT EXISTS ml_perf_rows (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_file TEXT NOT NULL REFERENCES import_files(rel_path) ON DELETE CASCADE,
                month_key TEXT NOT NULL,
                item_id TEXT DEFAULT '',
                title TEXT DEFAULT '',
                status TEXT DEFAULT '',
                variation TEXT DEFAULT '',
                sku TEXT DEFAULT '',
                visits INTEGER DEFAULT 0,
                sales INTEGER DEFAULT 0,
                buyers INTEGER DEFAULT 0,
                units INTEGER DEFAULT 0,
                conv_pct REAL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS custom_costs (
                product_name TEXT PRIMARY KEY,
                cost REAL NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sku_rules (
                id TEXT PRIMARY KEY,
                prefix TEXT NOT NULL,
                canonical_name TEXT NOT NULL,
                default_cost REAL NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS ml_qty_overrides (
                order_id TEXT PRIMARY KEY,
                qty INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS snapshots (
                id TEXT PRIMARY KEY,
                created_at INTEGER NOT NULL,
                label TEXT NOT NULL,
                payload_json TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS staging_state (
                id TEXT PRIMARY KEY,
                payload_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_orders_month_channel ON orders(month_key, channel);
            CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source_file);
            CREATE INDEX IF NOT EXISTS idx_orders_order ON orders(channel, order_id);
            CREATE INDEX IF NOT EXISTS idx_cancelled_month_channel ON cancelled_orders(month_key, channel);
            CREATE INDEX IF NOT EXISTS idx_cancelled_source ON cancelled_orders(source_file);
            CREATE INDEX IF NOT EXISTS idx_perf_month ON ml_perf_rows(month_key);
            CREATE INDEX IF NOT EXISTS idx_perf_source ON ml_perf_rows(source_file);
        `);
    }

    prepareStatements() {
        this.stmtUpsertFile = this.db.prepare(`
            INSERT INTO import_files (
                rel_path, source_type, month_key, period_text,
                file_size, mtime_ms, row_count, valid_order_count, cancelled_count, imported_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(rel_path) DO UPDATE SET
                source_type = excluded.source_type,
                month_key = excluded.month_key,
                period_text = excluded.period_text,
                file_size = excluded.file_size,
                mtime_ms = excluded.mtime_ms,
                row_count = excluded.row_count,
                valid_order_count = excluded.valid_order_count,
                cancelled_count = excluded.cancelled_count,
                imported_at = excluded.imported_at
        `);

        this.stmtInsertOrder = this.db.prepare(`
            INSERT INTO orders (
                source_file, channel, month_key, order_id, item_id, date, iso_date,
                product_name, sku, variation, qty, qty_source, needs_qty_check,
                subtotal, item_commission, item_service_fee, item_fees, item_shipping,
                seller_discount, seller_coupon, pix_adj, action_adj, net_received,
                financing_fee, coupon_fee, release_date, release_iso_date, release_days,
                payment_type, installments, model_key, canonical_name, default_model_cost
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            )
        `);

        this.stmtInsertCancelled = this.db.prepare(`
            INSERT INTO cancelled_orders (
                source_file, channel, month_key, order_id, date, iso_date,
                product_name, sku, status, reason, amount, amount_refunded,
                claim_id, chargeback_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        this.stmtInsertPerf = this.db.prepare(`
            INSERT INTO ml_perf_rows (
                source_file, month_key, item_id, title, status, variation, sku,
                visits, sales, buyers, units, conv_pct
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
    }

    runInTransaction(fn) {
        if (this._txDepth > 0) return fn();
        this.db.exec('BEGIN IMMEDIATE;');
        this._txDepth++;
        try {
            const res = fn();
            this._txDepth--;
            this.db.exec('COMMIT;');
            return res;
        } catch (err) {
            this._txDepth--;
            try { this.db.exec('ROLLBACK;'); } catch {}
            throw err;
        }
    }

    ingestParsedFile(payload) {
        const {
            relPath,
            sourceType,
            monthKey,
            periodText = '',
            fileSize = 0,
            mtimeMs = 0,
            validOrderCount = 0,
            cancelledCount = 0,
            orders = [],
            cancelledOrders = [],
            mlPerfRows = []
        } = payload || {};

        if (!relPath || !sourceType) {
            throw new Error('relPath e sourceType são obrigatórios para gravação no banco.');
        }

        const safeMonth = String(monthKey || 'undated');
        const rowCount = sourceType === 'mlPerf' ? mlPerfRows.length : (orders.length + cancelledOrders.length);
        const now = Date.now();

        this.runInTransaction(() => {
            this.db.prepare('DELETE FROM orders WHERE source_file = ?').run(relPath);
            this.db.prepare('DELETE FROM cancelled_orders WHERE source_file = ?').run(relPath);
            this.db.prepare('DELETE FROM ml_perf_rows WHERE source_file = ?').run(relPath);

            this.stmtUpsertFile.run(
                relPath,
                sourceType,
                safeMonth,
                String(periodText || ''),
                Number(fileSize) || 0,
                Number(mtimeMs) || 0,
                rowCount,
                Number(validOrderCount) || 0,
                Number(cancelledCount) || 0,
                now
            );

            orders.forEach(o => {
                const rowMonth = o.isoDate && /^\d{4}-\d{2}/.test(o.isoDate) ? o.isoDate.slice(0, 7) : safeMonth;
                const relDays = Number.isFinite(Number(o.releaseDays)) ? Number(o.releaseDays) : null;
                this.stmtInsertOrder.run(
                    relPath,
                    o.channel || sourceType,
                    o.monthKey || rowMonth,
                    String(o.orderId || ''),
                    String(o.itemId || ''),
                    String(o.date || ''),
                    String(o.isoDate || ''),
                    String(o.productName || ''),
                    String(o.sku || ''),
                    String(o.variation || ''),
                    Math.max(1, Math.round(Number(o.qty) || 1)),
                    String(o.qtySource || ''),
                    o.needsQtyCheck ? 1 : 0,
                    Number(o.subtotal) || 0,
                    Number(o.itemCommission) || 0,
                    Number(o.itemServiceFee) || 0,
                    Number(o.itemFees) || 0,
                    Number(o.itemShipping) || 0,
                    Number(o.sellerDiscount) || 0,
                    Number(o.sellerCoupon) || 0,
                    Number(o.pixAdj) || 0,
                    Number(o.actionAdj) || 0,
                    Number(o.netReceived) || 0,
                    Number(o.financingFee) || 0,
                    Number(o.couponFee) || 0,
                    String(o.releaseDate || ''),
                    String(o.releaseIsoDate || ''),
                    relDays,
                    String(o.paymentType || ''),
                    Math.max(1, Math.round(Number(o.installments) || 1)),
                    String(o.modelKey || ''),
                    String(o.canonicalName || ''),
                    Number(o.defaultModelCost) || 0
                );
            });

            cancelledOrders.forEach(c => {
                const rowMonth = c.isoDate && /^\d{4}-\d{2}/.test(c.isoDate) ? c.isoDate.slice(0, 7) : safeMonth;
                this.stmtInsertCancelled.run(
                    relPath,
                    c.channel || sourceType,
                    c.monthKey || rowMonth,
                    String(c.orderId || ''),
                    String(c.date || ''),
                    String(c.isoDate || ''),
                    String(c.productName || ''),
                    String(c.sku || ''),
                    String(c.status || ''),
                    String(c.reason || ''),
                    Number(c.amount) || 0,
                    Number(c.amountRefunded) || 0,
                    String(c.claimId || ''),
                    String(c.chargebackId || '')
                );
            });

            mlPerfRows.forEach(r => {
                this.stmtInsertPerf.run(
                    relPath,
                    r.monthKey || safeMonth,
                    String(r.itemId || ''),
                    String(r.title || ''),
                    String(r.status || ''),
                    String(r.variation || ''),
                    String(r.sku || ''),
                    Math.max(0, Math.round(Number(r.visits) || 0)),
                    Math.max(0, Math.round(Number(r.sales) || 0)),
                    Math.max(0, Math.round(Number(r.buyers) || 0)),
                    Math.max(0, Math.round(Number(r.units) || 0)),
                    Number(r.convPct) || 0
                );
            });
        });

        return { ok: true, relPath, rowCount };
    }

    listImportedFiles() {
        return this.db.prepare(`
            SELECT rel_path AS relPath, source_type AS sourceType, month_key AS monthKey,
                   period_text AS periodText, file_size AS fileSize, mtime_ms AS mtimeMs,
                   row_count AS rowCount, valid_order_count AS validOrderCount,
                   cancelled_count AS cancelledCount, imported_at AS importedAt
            FROM import_files
            ORDER BY month_key ASC, source_type ASC, rel_path ASC
        `).all().map(r => ({ ...r }));
    }

    getAvailableMonths() {
        const rows = this.db.prepare(`
            SELECT DISTINCT month_key AS mk FROM (
                SELECT month_key FROM orders
                UNION
                SELECT month_key FROM cancelled_orders
                UNION
                SELECT month_key FROM ml_perf_rows
            )
            WHERE month_key GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]'
            ORDER BY mk ASC
        `).all();
        return rows.map(r => r.mk);
    }

    getHealthSummary() {
        const counts = this.db.prepare(`
            SELECT
                (SELECT COUNT(*) FROM import_files) AS filesCount,
                (SELECT COUNT(*) FROM orders) AS ordersCount,
                (SELECT COUNT(*) FROM cancelled_orders) AS cancelledCount,
                (SELECT COUNT(*) FROM ml_perf_rows) AS mlPerfCount
        `).get();
        return {
            dbPath: path.basename(this.dbPath),
            filesCount: counts.filesCount,
            ordersCount: counts.ordersCount,
            cancelledCount: counts.cancelledCount,
            mlPerfCount: counts.mlPerfCount,
            availableMonths: this.getAvailableMonths()
        };
    }

    queryDataset({ fromMonth = '', toMonth = '' } = {}) {
        const clauses = [];
        const params = [];
        if (fromMonth && /^\d{4}-\d{2}$/.test(fromMonth)) {
            clauses.push('month_key >= ?');
            params.push(fromMonth);
        }
        if (toMonth && /^\d{4}-\d{2}$/.test(toMonth)) {
            clauses.push('month_key <= ?');
            params.push(toMonth);
        }
        const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

        const orders = this.db.prepare(`
            SELECT channel, month_key AS monthKey, source_file AS sourceFile,
                   order_id AS orderId, item_id AS itemId, date, iso_date AS isoDate,
                   product_name AS productName, sku, variation, qty, qty_source AS qtySource,
                   needs_qty_check AS needsQtyCheck, subtotal,
                   item_commission AS itemCommission, item_service_fee AS itemServiceFee,
                   item_fees AS itemFees, item_shipping AS itemShipping,
                   seller_discount AS sellerDiscount, seller_coupon AS sellerCoupon,
                   pix_adj AS pixAdj, action_adj AS actionAdj, net_received AS netReceived,
                   financing_fee AS financingFee, coupon_fee AS couponFee,
                   release_date AS releaseDate, release_iso_date AS releaseIsoDate,
                   release_days AS releaseDays, payment_type AS paymentType, installments,
                   model_key AS modelKey, canonical_name AS canonicalName,
                   default_model_cost AS defaultModelCost
            FROM orders
            ${whereSql}
            ORDER BY iso_date ASC, id ASC
        `).all(...params).map(r => ({ ...r, needsQtyCheck: Boolean(r.needsQtyCheck) }));

        const cancelledOrders = this.db.prepare(`
            SELECT channel, month_key AS monthKey, source_file AS sourceFile,
                   order_id AS orderId, date, iso_date AS isoDate,
                   product_name AS productName, sku, status, reason, amount,
                   amount_refunded AS amountRefunded, claim_id AS claimId, chargeback_id AS chargebackId
            FROM cancelled_orders
            ${whereSql}
            ORDER BY iso_date ASC, id ASC
        `).all(...params).map(r => ({ ...r }));

        const mlPerfRows = this.db.prepare(`
            SELECT month_key AS monthKey, source_file AS sourceFile,
                   item_id AS itemId, title, status, variation, sku,
                   visits, sales, buyers, units, conv_pct AS convPct
            FROM ml_perf_rows
            ${whereSql}
            ORDER BY month_key ASC, id ASC
        `).all(...params).map(r => ({ ...r }));

        return {
            fromMonth,
            toMonth,
            availableMonths: this.getAvailableMonths(),
            orders,
            cancelledOrders,
            mlPerfRows
        };
    }

    getAllSettings() {
        const rows = this.db.prepare('SELECT key, value FROM settings').all();
        const out = {};
        rows.forEach(r => {
            try {
                out[r.key] = JSON.parse(r.value);
            } catch {
                out[r.key] = r.value;
            }
        });
        return out;
    }

    saveSettings(partial) {
        if (!partial || typeof partial !== 'object') return;
        const stmt = this.db.prepare(`
            INSERT INTO settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);
        this.runInTransaction(() => {
            for (const [k, v] of Object.entries(partial)) {
                if (v === undefined) continue;
                stmt.run(String(k), JSON.stringify(v));
            }
        });
    }

    getCustomCosts() {
        const rows = this.db.prepare('SELECT product_name, cost FROM custom_costs').all();
        const out = {};
        rows.forEach(r => { out[r.product_name] = r.cost; });
        return out;
    }

    setCustomCostsMap(costsObj, replaceAll = false) {
        const now = Date.now();
        const stmt = this.db.prepare(`
            INSERT INTO custom_costs (product_name, cost, updated_at) VALUES (?, ?, ?)
            ON CONFLICT(product_name) DO UPDATE SET cost = excluded.cost, updated_at = excluded.updated_at
        `);
        this.runInTransaction(() => {
            if (replaceAll) this.db.prepare('DELETE FROM custom_costs').run();
            for (const [k, v] of Object.entries(costsObj || {})) {
                if (!k) continue;
                stmt.run(String(k), Number(v) || 0, now);
            }
        });
    }

    clearCustomCosts() {
        this.db.prepare('DELETE FROM custom_costs').run();
    }

    getSkuRules() {
        return this.db.prepare(`
            SELECT id, prefix, canonical_name AS canonicalName, default_cost AS defaultCost
            FROM sku_rules
            ORDER BY created_at ASC
        `).all().map(r => ({ ...r }));
    }

    upsertSkuRule(rule) {
        this.db.prepare(`
            INSERT INTO sku_rules (id, prefix, canonical_name, default_cost, created_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                prefix = excluded.prefix,
                canonical_name = excluded.canonical_name,
                default_cost = excluded.default_cost
        `).run(
            String(rule.id),
            String(rule.prefix).trim().toUpperCase(),
            String(rule.canonicalName).trim(),
            Number(rule.defaultCost) || 0,
            Number(rule.createdAt) || Date.now()
        );
    }

    deleteSkuRule(id) {
        this.db.prepare('DELETE FROM sku_rules WHERE id = ?').run(String(id));
    }

    getMlQtyOverrides() {
        const rows = this.db.prepare('SELECT order_id, qty FROM ml_qty_overrides').all();
        const out = {};
        rows.forEach(r => { out[r.order_id] = r.qty; });
        return out;
    }

    setMlQtyOverride(orderId, qty) {
        this.db.prepare(`
            INSERT INTO ml_qty_overrides (order_id, qty, updated_at) VALUES (?, ?, ?)
            ON CONFLICT(order_id) DO UPDATE SET qty = excluded.qty, updated_at = excluded.updated_at
        `).run(String(orderId), Math.max(1, Math.round(Number(qty) || 1)), Date.now());
    }

    listSnapshots() {
        return this.db.prepare('SELECT payload_json FROM snapshots ORDER BY created_at DESC')
            .all()
            .map(r => {
                try { return JSON.parse(r.payload_json); } catch { return null; }
            })
            .filter(Boolean);
    }

    saveSnapshot(snapshot) {
        if (!snapshot || !snapshot.id) return;
        this.db.prepare(`
            INSERT INTO snapshots (id, created_at, label, payload_json) VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                created_at = excluded.created_at,
                label = excluded.label,
                payload_json = excluded.payload_json
        `).run(
            String(snapshot.id),
            Number(snapshot.createdAt) || Date.now(),
            String(snapshot.label || ''),
            JSON.stringify(snapshot)
        );
    }

    deleteSnapshot(id) {
        this.db.prepare('DELETE FROM snapshots WHERE id = ?').run(String(id));
    }

    clearChannel(channel) {
        this.runInTransaction(() => {
            if (channel === 'shopee' || channel === 'mercadolivre' || channel === 'mlPerf') {
                this.db.prepare('DELETE FROM import_files WHERE source_type = ?').run(channel);
            }
            if (channel === 'shopee' || channel === 'mercadolivre') {
                this.db.prepare('DELETE FROM orders WHERE channel = ?').run(channel);
                this.db.prepare('DELETE FROM cancelled_orders WHERE channel = ?').run(channel);
            } else if (channel === 'mlPerf') {
                this.db.prepare('DELETE FROM ml_perf_rows').run();
            }
        });
    }

    applyBackup(parsed) {
        const now = Date.now();
        this.runInTransaction(() => {
            if (parsed.customCosts && typeof parsed.customCosts === 'object' && !Array.isArray(parsed.customCosts)) {
                this.setCustomCostsMap(parsed.customCosts, true);
            }
            if (Array.isArray(parsed.customSkuRules)) {
                this.db.prepare('DELETE FROM sku_rules').run();
                parsed.customSkuRules.forEach(r => {
                    if (r && r.prefix && r.canonicalName) {
                        this.upsertSkuRule({ ...r, id: r.id || `sku-${now}` });
                    }
                });
            }
            if (parsed.mlQtyOverrides && typeof parsed.mlQtyOverrides === 'object' && !Array.isArray(parsed.mlQtyOverrides)) {
                this.db.prepare('DELETE FROM ml_qty_overrides').run();
                const stmt = this.db.prepare('INSERT INTO ml_qty_overrides (order_id, qty, updated_at) VALUES (?, ?, ?)');
                for (const [oid, q] of Object.entries(parsed.mlQtyOverrides)) {
                    stmt.run(String(oid), Math.max(1, Math.round(Number(q) || 1)), now);
                }
            }
            const settingsUpdate = {};
            if (parsed.taxRate !== undefined) settingsUpdate.taxRate = Number(parsed.taxRate) || 0;
            if (parsed.targetMargin !== undefined) settingsUpdate.targetMargin = Number(parsed.targetMargin) || 20;
            if (parsed.extraExpenses && typeof parsed.extraExpenses === 'object') {
                settingsUpdate.extraExpenses = parsed.extraExpenses;
            }
            if (parsed.groupingMode === 'model' || parsed.groupingMode === 'listing') {
                settingsUpdate.groupingMode = parsed.groupingMode;
            }
            if (Object.keys(settingsUpdate).length > 0) {
                this.saveSettings(settingsUpdate);
            }
        });
    }

    getCurrentMonthDraft() {
        const row = this.db.prepare('SELECT payload_json FROM staging_state WHERE id = ?').get('current_month');
        if (!row) return null;
        try {
            return JSON.parse(row.payload_json);
        } catch {
            return null;
        }
    }

    saveCurrentMonthDraft(payload) {
        if (!payload || typeof payload !== 'object') return;
        this.db.prepare(`
            INSERT INTO staging_state (id, payload_json, updated_at) VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at
        `).run('current_month', JSON.stringify(payload), Date.now());
    }

    clearCurrentMonthDraft() {
        this.db.prepare('DELETE FROM staging_state WHERE id = ?').run('current_month');
    }

    getBootstrapState() {
        return {
            health: this.getHealthSummary(),
            settings: this.getAllSettings(),
            customCosts: this.getCustomCosts(),
            customSkuRules: this.getSkuRules(),
            mlQtyOverrides: this.getMlQtyOverrides(),
            snapshots: this.listSnapshots(),
            importFiles: this.listImportedFiles(),
            currentMonthDraft: this.getCurrentMonthDraft()
        };
    }

    async createBackupFile(destPath) {
        await backup(this.db, destPath);
    }

    close() {
        try { this.db.close(); } catch {}
    }
}

module.exports = { SouthTeamDB, DEFAULT_DB_PATH };
