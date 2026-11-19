'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { URL } = require('node:url');
const { SouthTeamDB, DEFAULT_DB_PATH } = require('./db');

const SPREADSHEET_FOLDERS = [
    { dir: 'Relatorio de Vendas 2026 SHP', defaultType: 'shopee' },
    { dir: 'Relatorio de Vendas 2026 ML', defaultType: 'mercadolivre' },
    { dir: 'Relatorios de desempenho ML', defaultType: 'mlPerf' }
];

const PUBLIC_WEB_FILES = new Set([
    'index.html',
    'app.js',
    'analytics.js',
    'persistence.js',
    'styles.css',
    'vendor/chart.umd.min.js',
    'vendor/xlsx.full.min.js',
    'vendor/html2pdf.bundle.min.js',
    'data/published_snapshot.json'
]);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function inferMonthKeyFromFilename(filename) {
    const m = String(filename || '').match(/(20\d{2})[_-]?(\d{2})[_-]?(\d{2})/);
    if (!m) return '';
    const month = Number(m[2]);
    if (month < 1 || month > 12) return '';
    return `${m[1]}-${m[2]}`;
}

function scanLocalSpreadsheets(rootDir) {
    const found = [];

    SPREADSHEET_FOLDERS.forEach(({ dir, defaultType }) => {
        const fullDir = path.join(rootDir, dir);
        if (!fs.existsSync(fullDir)) return;
        const entries = fs.readdirSync(fullDir, { withFileTypes: true });
        entries
            .filter(e => e.isFile() && /\.(xlsx|xls|csv)$/i.test(e.name) && !e.name.startsWith('~$'))
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(entry => {
                const absPath = path.join(fullDir, entry.name);
                const stat = fs.statSync(absPath);
                const relPath = path.posix.join(dir, entry.name);
                found.push({
                    relPath,
                    filename: entry.name,
                    folder: dir,
                    defaultType,
                    inferredMonth: inferMonthKeyFromFilename(entry.name),
                    fileSize: stat.size,
                    mtimeMs: Math.round(stat.mtimeMs)
                });
            });
    });

    // Fallback para arquivos .xlsx reconhecíveis soltos na raiz (caso existam)
    if (fs.existsSync(rootDir)) {
        fs.readdirSync(rootDir, { withFileTypes: true })
            .filter(e => e.isFile() && /\.(xlsx|xls|csv)$/i.test(e.name) && !e.name.startsWith('~$'))
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(entry => {
                const lower = entry.name.toLowerCase();
                let defaultType = '';
                if (lower.includes('order.all')) defaultType = 'shopee';
                else if (lower.includes('collection')) defaultType = 'mercadolivre';
                else if (lower.includes('desempenho')) defaultType = 'mlPerf';
                if (!defaultType) return;

                const absPath = path.join(rootDir, entry.name);
                const stat = fs.statSync(absPath);
                found.push({
                    relPath: entry.name,
                    filename: entry.name,
                    folder: '',
                    defaultType,
                    inferredMonth: inferMonthKeyFromFilename(entry.name),
                    fileSize: stat.size,
                    mtimeMs: Math.round(stat.mtimeMs)
                });
            });
    }

    return found;
}

function sendJson(res, statusCode, data) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    res.end(body);
}

function readJsonBody(req, maxBytes = 64 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let total = 0;
        req.on('data', (chunk) => {
            total += chunk.length;
            if (total > maxBytes) {
                reject(new Error('Corpo da requisição excede o limite permitido.'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            try {
                const raw = Buffer.concat(chunks).toString('utf8');
                resolve(raw ? JSON.parse(raw) : {});
            } catch (err) {
                reject(new Error('JSON inválido no corpo da requisição.'));
            }
        });
        req.on('error', reject);
    });
}

function isAllowedSourceSpreadsheetPath(rootDir, relPath) {
    if (!relPath || typeof relPath !== 'string') return null;
    const normalized = path.posix.normalize(relPath.replace(/\\/g, '/'));
    if (normalized.startsWith('/') || normalized.startsWith('..') || normalized.includes('/../')) return null;

    const abs = path.resolve(rootDir, normalized);
    if (!abs.startsWith(path.resolve(rootDir) + path.sep)) return null;
    if (!/\.(xlsx|xls|csv)$/i.test(abs)) return null;

    const firstSegment = normalized.includes('/') ? normalized.split('/')[0] : '';
    const allowedFolders = new Set(SPREADSHEET_FOLDERS.map(f => f.dir));
    if (firstSegment && !allowedFolders.has(firstSegment)) return null;

    return fs.existsSync(abs) ? abs : null;
}

function createAppServer(options = {}) {
    const rootDir = options.rootDir || __dirname;
    const dbPath = options.dbPath || DEFAULT_DB_PATH;
    const db = new SouthTeamDB(dbPath);

    const server = http.createServer(async (req, res) => {
        const urlObj = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
        let pathname;
        try {
            pathname = decodeURIComponent(urlObj.pathname);
        } catch {
            return sendJson(res, 400, { ok: false, error: 'Malformed request URL' });
        }
        const method = req.method || 'GET';

        try {
            if (method === 'GET' && pathname === '/api/health') {
                return sendJson(res, 200, { ok: true, engine: 'sqlite', ...db.getHealthSummary() });
            }

            if (method === 'GET' && pathname === '/api/bootstrap') {
                return sendJson(res, 200, db.getBootstrapState());
            }

            if (method === 'GET' && pathname === '/api/sources/status') {
                const localFiles = scanLocalSpreadsheets(rootDir);
                const importedList = db.listImportedFiles();
                const importedMap = new Map(importedList.map(f => [f.relPath, f]));

                const files = localFiles.map(lf => {
                    const existing = importedMap.get(lf.relPath);
                    const upToDate = Boolean(
                        existing &&
                        Number(existing.fileSize) === lf.fileSize &&
                        Math.round(Number(existing.mtimeMs)) === lf.mtimeMs
                    );
                    return {
                        ...lf,
                        imported: Boolean(existing),
                        upToDate,
                        storedMonthKey: existing?.monthKey || lf.inferredMonth,
                        storedRows: existing?.rowCount || 0
                    };
                });

                const pendingFiles = files.filter(f => !f.upToDate);
                return sendJson(res, 200, {
                    totalLocalFiles: files.length,
                    ingestedCount: importedList.length,
                    pendingCount: pendingFiles.length,
                    pendingFiles,
                    files,
                    availableMonths: db.getAvailableMonths()
                });
            }

            if (method === 'GET' && pathname === '/api/local-sources/file') {
                const relPath = urlObj.searchParams.get('path') || '';
                const abs = isAllowedSourceSpreadsheetPath(rootDir, relPath);
                if (!abs) {
                    return sendJson(res, 404, { error: 'Arquivo de planilha não encontrado ou fora das pastas permitidas.' });
                }
                const stat = fs.statSync(abs);
                res.writeHead(200, {
                    'Content-Type': MIME_TYPES['.xlsx'],
                    'Content-Length': stat.size,
                    'Cache-Control': 'no-store'
                });
                fs.createReadStream(abs).pipe(res);
                return;
            }

            if (method === 'POST' && pathname === '/api/sync/import') {
                const body = await readJsonBody(req);
                const result = db.ingestParsedFile(body);
                return sendJson(res, 200, { ...result, health: db.getHealthSummary() });
            }

            if (method === 'GET' && pathname === '/api/dataset') {
                const fromMonth = urlObj.searchParams.get('from') || '';
                const toMonth = urlObj.searchParams.get('to') || '';
                const dataset = db.queryDataset({ fromMonth, toMonth });
                return sendJson(res, 200, dataset);
            }

            if (method === 'PUT' && pathname === '/api/settings') {
                const body = await readJsonBody(req);
                db.saveSettings(body);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'PUT' && pathname === '/api/costs') {
                const body = await readJsonBody(req);
                db.setCustomCostsMap(body.customCosts || {}, Boolean(body.replaceAll));
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'DELETE' && pathname === '/api/costs') {
                db.clearCustomCosts();
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'POST' && pathname === '/api/sku-rules') {
                const body = await readJsonBody(req);
                db.upsertSkuRule(body);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'DELETE' && pathname.startsWith('/api/sku-rules/')) {
                const id = pathname.slice('/api/sku-rules/'.length);
                db.deleteSkuRule(id);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'PUT' && pathname === '/api/ml-qty-override') {
                const body = await readJsonBody(req);
                if (body.orderId) db.setMlQtyOverride(body.orderId, body.qty);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'POST' && pathname === '/api/snapshots') {
                const body = await readJsonBody(req);
                db.saveSnapshot(body);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'DELETE' && pathname.startsWith('/api/snapshots/')) {
                const id = pathname.slice('/api/snapshots/'.length);
                db.deleteSnapshot(id);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'DELETE' && pathname.startsWith('/api/channels/')) {
                const ch = pathname.slice('/api/channels/'.length);
                db.clearChannel(ch);
                return sendJson(res, 200, { ok: true, health: db.getHealthSummary() });
            }

            if (method === 'POST' && pathname === '/api/backup/restore') {
                const body = await readJsonBody(req);
                db.applyBackup(body);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'GET' && pathname === '/api/current-month') {
                return sendJson(res, 200, { ok: true, draft: db.getCurrentMonthDraft() });
            }

            if (method === 'PUT' && pathname === '/api/current-month') {
                const body = await readJsonBody(req);
                db.saveCurrentMonthDraft(body);
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'DELETE' && pathname === '/api/current-month') {
                db.clearCurrentMonthDraft();
                return sendJson(res, 200, { ok: true });
            }

            if (method === 'POST' && pathname === '/api/publish') {
                try {
                    const { publishToGit } = require('./publish');
                    const result = publishToGit();
                    return sendJson(res, 200, { ok: true, result });
                } catch (err) {
                    return sendJson(res, 500, { ok: false, error: err.message });
                }
            }

            if (method === 'GET' && pathname === '/api/db/download') {
                const tmpFile = path.join(os.tmpdir(), `south_team_bi_backup_${Date.now()}.db`);
                await db.createBackupFile(tmpFile);
                const buf = fs.readFileSync(tmpFile);
                fs.rmSync(tmpFile, { force: true });
                const stamp = new Date().toISOString().slice(0, 10);
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="south_team_bi_${stamp}.db"`,
                    'Content-Length': buf.length
                });
                res.end(buf);
                return;
            }

            // Arquivos estáticos públicos da interface
            if (method === 'GET') {
                const cleanPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
                if (!PUBLIC_WEB_FILES.has(cleanPath)) {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Not found');
                    return;
                }
                const abs = path.join(rootDir, cleanPath);
                const ext = path.extname(abs).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
                fs.createReadStream(abs).pipe(res);
                return;
            }

            sendJson(res, 405, { error: 'Método não permitido.' });
        } catch (err) {
            console.error('[server error]', method, pathname, err);
            sendJson(res, 500, { error: err.message || 'Erro interno no servidor' });
        }
    });

    server.on('close', () => db.close());
    return { server, db };
}

if (require.main === module) {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '127.0.0.1';
    const { server } = createAppServer();
    server.listen(port, host, () => {
        console.log(`Calculadora South Team BI + SQLite rodando em http://${host}:${port}`);
    });
}

module.exports = { createAppServer, scanLocalSpreadsheets, inferMonthKeyFromFilename };
