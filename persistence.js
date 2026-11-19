// ===== PERSISTÊNCIA DUAL: SQLITE LOCAL (VIA SERVIDOR NODE) + FALLBACK INDEXEDDB =====
const IDB_NAME = 'SouthTeamCalcDB';
const IDB_VERSION = 1;
const STORE_CHANNELS = 'channels';
const STORE_SNAPSHOTS = 'snapshots';

let _idbPromise = null;
let dbBackendActive = false;
let dbHealthSummary = null;
let isViewerMode = false;
let publishedSnapshotData = null;

async function dbRequestJson(url, options = {}) {
    const resp = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });
    const text = await resp.text();
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : {}; } catch {}
    if (!resp.ok) {
        throw new Error(parsed?.error || `HTTP ${resp.status} em ${url}`);
    }
    return parsed || {};
}

async function initPersistenceBackend(maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let timer = null;
        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            timer = controller ? setTimeout(() => controller.abort(), 1500) : null;
            const data = await dbRequestJson('/api/health', {
                method: 'GET',
                signal: controller ? controller.signal : undefined
            });
            if (timer) clearTimeout(timer);
            if (data && data.ok && data.engine === 'sqlite') {
                dbBackendActive = true;
                dbHealthSummary = data;
                isViewerMode = false;
                publishedSnapshotData = null;
                return true;
            }
        } catch {
            if (timer) clearTimeout(timer);
        }
        if (attempt < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 450));
        }
    }

    // Modo Visualizador estático (Nuvem 24h no GitHub Pages / Vercel sem servidor Node local)
    try {
        const snapResp = await fetch('./data/published_snapshot.json', { cache: 'no-cache' });
        if (snapResp.ok) {
            const snap = await snapResp.json();
            if (snap && snap.dataset && Array.isArray(snap.dataset.orders)) {
                publishedSnapshotData = snap;
                isViewerMode = true;
                dbBackendActive = true;
                dbHealthSummary = {
                    ok: true,
                    engine: 'static-snapshot',
                    publishedAt: snap.publishedAt || '',
                    filesCount: snap.summary?.filesCount || (snap.files?.length || 30),
                    ordersCount: snap.dataset.orders.length,
                    cancelledCount: snap.dataset.cancelledOrders?.length || 0,
                    mlPerfCount: snap.dataset.mlPerfRows?.length || 0,
                    availableMonths: snap.summary?.availableMonths || (snap.dataset.availableMonths || [])
                };
                return true;
            }
        }
    } catch (err) {
        console.warn('Modo estático: snapshot não encontrado:', err);
    }

    dbBackendActive = false;
    dbHealthSummary = null;
    isViewerMode = false;
    publishedSnapshotData = null;
    return false;
}

async function dbFetchBootstrap() {
    if (isViewerMode && publishedSnapshotData?.bootstrap) {
        return publishedSnapshotData.bootstrap;
    }
    return dbRequestJson('/api/bootstrap', { method: 'GET' });
}

async function dbFetchSourcesStatus() {
    if (isViewerMode) {
        const months = publishedSnapshotData?.summary?.availableMonths || publishedSnapshotData?.dataset?.availableMonths || [];
        return {
            totalLocalFiles: publishedSnapshotData?.files?.length || 30,
            ingestedCount: publishedSnapshotData?.files?.length || 30,
            pendingCount: 0,
            pendingFiles: [],
            availableMonths: months
        };
    }
    return dbRequestJson('/api/sources/status', { method: 'GET' });
}

async function dbFetchLocalSourceBuffer(relPath) {
    if (isViewerMode) throw new Error('Download de planilha local não disponível no modo visualizador');
    const resp = await fetch(`/api/local-sources/file?path=${encodeURIComponent(relPath)}`, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Falha ao baixar planilha local: ${relPath}`);
    return resp.arrayBuffer();
}

async function dbSyncIngestFile(payload) {
    if (isViewerMode) throw new Error('Ingestão não disponível no modo visualizador');
    const res = await dbRequestJson('/api/sync/import', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    if (res?.health) dbHealthSummary = res.health;
    return res;
}

async function dbFetchDataset(fromMonth = '', toMonth = '') {
    if (isViewerMode && publishedSnapshotData?.dataset) {
        const full = publishedSnapshotData.dataset;
        const filterFn = (item) => {
            if (fromMonth && item.monthKey < fromMonth) return false;
            if (toMonth && item.monthKey > toMonth) return false;
            return true;
        };
        const orders = (full.orders || []).filter(filterFn);
        const cancelledOrders = (full.cancelledOrders || []).filter(filterFn);
        const mlPerfRows = (full.mlPerfRows || []).filter(filterFn);
        return {
            fromMonth,
            toMonth,
            availableMonths: full.availableMonths || publishedSnapshotData.bootstrap?.availableMonths || [],
            orders,
            cancelledOrders,
            mlPerfRows,
            filesCount: publishedSnapshotData.files?.length || 30
        };
    }
    const params = new URLSearchParams();
    if (fromMonth) params.set('from', fromMonth);
    if (toMonth) params.set('to', toMonth);
    const qs = params.toString();
    return dbRequestJson(`/api/dataset${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

async function dbPublishToCloud() {
    if (isViewerMode) throw new Error('Publicação não disponível no modo visualizador');
    return dbRequestJson('/api/publish', { method: 'POST' });
}

async function dbSaveSettings(partial) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson('/api/settings', { method: 'PUT', body: JSON.stringify(partial) });
        return true;
    } catch (err) {
        console.warn('Falha ao salvar configurações no SQLite:', err);
        return false;
    }
}

async function dbSaveCustomCosts(costsObj, replaceAll = false) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson('/api/costs', {
            method: 'PUT',
            body: JSON.stringify({ customCosts: costsObj || {}, replaceAll })
        });
        return true;
    } catch (err) {
        console.warn('Falha ao salvar custos no SQLite:', err);
        return false;
    }
}

async function dbResetCustomCosts() {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson('/api/costs', { method: 'DELETE' });
        return true;
    } catch (err) {
        console.warn('Falha ao resetar custos no SQLite:', err);
        return false;
    }
}

async function dbUpsertSkuRule(rule) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson('/api/sku-rules', { method: 'POST', body: JSON.stringify(rule) });
        return true;
    } catch (err) {
        console.warn('Falha ao salvar regra de SKU no SQLite:', err);
        return false;
    }
}

async function dbDeleteSkuRule(id) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson(`/api/sku-rules/${encodeURIComponent(id)}`, { method: 'DELETE' });
        return true;
    } catch (err) {
        console.warn('Falha ao excluir regra de SKU no SQLite:', err);
        return false;
    }
}

async function dbSaveMlQtyOverride(orderId, qty) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        await dbRequestJson('/api/ml-qty-override', {
            method: 'PUT',
            body: JSON.stringify({ orderId, qty })
        });
        return true;
    } catch (err) {
        console.warn('Falha ao salvar quantidade ML no SQLite:', err);
        return false;
    }
}

async function dbClearChannel(ch) {
    if (isViewerMode) return false;
    if (!dbBackendActive) return false;
    try {
        const res = await dbRequestJson(`/api/channels/${encodeURIComponent(ch)}`, { method: 'DELETE' });
        if (res?.health) dbHealthSummary = res.health;
        return true;
    } catch (err) {
        console.warn('Falha ao remover canal no SQLite:', err);
        return false;
    }
}

function downloadSqliteBackup() {
    if (!dbBackendActive) {
        showToast('Backup .db disponível somente com o servidor SQLite ativo.', 'warn');
        return;
    }
    const a = document.createElement('a');
    a.href = '/api/db/download';
    a.download = `south_team_bi_${new Date().toISOString().slice(0, 10)}.db`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download do banco SQLite (.db) iniciado!', 'success');
}

function serializeCurrentMonthDraft(workspaceObj) {
    if (!workspaceObj || (!workspaceObj.shopee && !workspaceObj.mercadolivre && !workspaceObj.mlPerf)) {
        return null;
    }
    return {
        updatedAt: workspaceObj.updatedAt || Date.now(),
        shopee: serializeChannelData('shopee', workspaceObj.shopee),
        mercadolivre: serializeChannelData('mercadolivre', workspaceObj.mercadolivre),
        mlPerf: serializeChannelData('mlPerf', workspaceObj.mlPerf)
    };
}

function hydrateCurrentMonthDraft(raw) {
    if (!raw || typeof raw !== 'object') return { shopee: null, mercadolivre: null, mlPerf: null, updatedAt: 0 };
    return {
        updatedAt: raw.updatedAt || 0,
        shopee: raw.shopee ? hydrateChannelData({ ...raw.shopee, key: 'shopee' }) : null,
        mercadolivre: raw.mercadolivre ? hydrateChannelData({ ...raw.mercadolivre, key: 'mercadolivre' }) : null,
        mlPerf: raw.mlPerf ? hydrateChannelData({ ...raw.mlPerf, key: 'mlPerf' }) : null
    };
}

async function dbSaveCurrentMonthDraft(workspaceObj) {
    if (isViewerMode) return false;
    const serialized = serializeCurrentMonthDraft(workspaceObj);
    if (!serialized) return dbClearCurrentMonthDraft();

    if (dbBackendActive) {
        try {
            await dbRequestJson('/api/current-month', {
                method: 'PUT',
                body: JSON.stringify(serialized)
            });
            return true;
        } catch (err) {
            console.warn('Falha ao salvar parcial do mês atual no SQLite:', err);
            return false;
        }
    }

    const db = await openCalcDB();
    if (!db) return false;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_CHANNELS, 'readwrite');
            tx.objectStore(STORE_CHANNELS).put({ key: '__current_month__', ...serialized });
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        } catch {
            resolve(false);
        }
    });
}

async function dbFetchCurrentMonthDraft() {
    if (isViewerMode) {
        return hydrateCurrentMonthDraft(publishedSnapshotData?.bootstrap?.currentMonthDraft || null);
    }

    if (dbBackendActive) {
        try {
            const res = await dbRequestJson('/api/current-month', { method: 'GET' });
            return hydrateCurrentMonthDraft(res?.draft);
        } catch {
            return hydrateCurrentMonthDraft(null);
        }
    }

    const db = await openCalcDB();
    if (!db) return hydrateCurrentMonthDraft(null);
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_CHANNELS, 'readonly');
            const req = tx.objectStore(STORE_CHANNELS).get('__current_month__');
            req.onsuccess = () => resolve(hydrateCurrentMonthDraft(req.result || null));
            req.onerror = () => resolve(hydrateCurrentMonthDraft(null));
        } catch {
            resolve(hydrateCurrentMonthDraft(null));
        }
    });
}

async function dbClearCurrentMonthDraft() {
    if (isViewerMode) return false;
    if (dbBackendActive) {
        try {
            await dbRequestJson('/api/current-month', { method: 'DELETE' });
            return true;
        } catch (err) {
            console.warn('Falha ao limpar rascunho do mês atual:', err);
            return false;
        }
    }
    return idbDeleteChannel('__current_month__');
}

// ===== FALLBACK INDEXEDDB (MODO ESTÁTICO SEM SERVIDOR) =====
function openCalcDB() {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    if (_idbPromise) return _idbPromise;

    _idbPromise = new Promise((resolve) => {
        try {
            const req = indexedDB.open(IDB_NAME, IDB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_CHANNELS)) {
                    db.createObjectStore(STORE_CHANNELS, { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
                    db.createObjectStore(STORE_SNAPSHOTS, { keyPath: 'id' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => {
                console.warn('IndexedDB indisponível:', req.error);
                resolve(null);
            };
        } catch (err) {
            console.warn('Falha ao abrir IndexedDB:', err);
            resolve(null);
        }
    });
    return _idbPromise;
}

function serializeChannelData(key, data) {
    if (!data) return null;
    if (key === 'mlPerf') {
        return {
            key,
            savedAt: Date.now(),
            multiUnitAdsCount: data.multiUnitAdsCount || 0,
            filename: data.filename || '',
            periodText: data.periodText || '',
            hintsEntries: data.hints instanceof Map ? [...data.hints.entries()] : [],
            rows: Array.isArray(data.rows) ? data.rows : []
        };
    }
    return {
        key,
        savedAt: Date.now(),
        orders: data.orders || [],
        cancelledOrders: data.cancelledOrders || [],
        validOrderIds: data.validOrdersSet instanceof Set ? [...data.validOrdersSet] : [],
        cancelledCount: data.cancelledCount || 0,
        dates: data.dates || [],
        filename: data.filename || '',
        periodText: data.periodText || ''
    };
}

function hydrateChannelData(record) {
    if (!record || !record.key) return null;
    if (record.key === 'mlPerf') {
        return {
            hints: new Map(record.hintsEntries || []),
            rows: Array.isArray(record.rows) ? record.rows : [],
            multiUnitAdsCount: record.multiUnitAdsCount || 0,
            filename: record.filename || '',
            periodText: record.periodText || ''
        };
    }
    return {
        orders: Array.isArray(record.orders) ? record.orders : [],
        cancelledOrders: Array.isArray(record.cancelledOrders) ? record.cancelledOrders : [],
        validOrdersSet: new Set(record.validOrderIds || []),
        cancelledCount: record.cancelledCount || 0,
        dates: Array.isArray(record.dates) ? record.dates : [],
        filename: record.filename || '',
        periodText: record.periodText || ''
    };
}

async function idbSaveChannel(key, data) {
    const db = await openCalcDB();
    if (!db) return false;
    const payload = serializeChannelData(key, data);
    if (!payload) return idbDeleteChannel(key);

    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_CHANNELS, 'readwrite');
            tx.objectStore(STORE_CHANNELS).put(payload);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        } catch (err) {
            console.warn('Erro ao salvar canal no IndexedDB:', err);
            resolve(false);
        }
    });
}

async function idbDeleteChannel(key) {
    const db = await openCalcDB();
    if (!db) return false;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_CHANNELS, 'readwrite');
            tx.objectStore(STORE_CHANNELS).delete(key);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        } catch (err) {
            resolve(false);
        }
    });
}

async function idbLoadAllChannels() {
    const db = await openCalcDB();
    if (!db) return {};
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_CHANNELS, 'readonly');
            const req = tx.objectStore(STORE_CHANNELS).getAll();
            req.onsuccess = () => {
                const map = {};
                (req.result || []).forEach(rec => {
                    if (!rec || !rec.key || String(rec.key).startsWith('__')) return;
                    const hydrated = hydrateChannelData(rec);
                    if (hydrated) map[rec.key] = hydrated;
                });
                resolve(map);
            };
            req.onerror = () => resolve({});
        } catch (err) {
            resolve({});
        }
    });
}

async function idbSaveSnapshot(snapshot) {
    if (dbBackendActive && snapshot?.id) {
        try {
            await dbRequestJson('/api/snapshots', { method: 'POST', body: JSON.stringify(snapshot) });
            return true;
        } catch (err) {
            console.warn('Falha ao salvar snapshot no SQLite:', err);
            return false;
        }
    }
    const db = await openCalcDB();
    if (!db || !snapshot?.id) return false;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_SNAPSHOTS, 'readwrite');
            tx.objectStore(STORE_SNAPSHOTS).put(snapshot);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        } catch (err) {
            resolve(false);
        }
    });
}

async function idbListSnapshots() {
    if (dbBackendActive) {
        try {
            const boot = await dbFetchBootstrap();
            return Array.isArray(boot.snapshots) ? boot.snapshots : [];
        } catch {
            return [];
        }
    }
    const db = await openCalcDB();
    if (!db) return [];
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_SNAPSHOTS, 'readonly');
            const req = tx.objectStore(STORE_SNAPSHOTS).getAll();
            req.onsuccess = () => {
                const list = (req.result || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                resolve(list);
            };
            req.onerror = () => resolve([]);
        } catch (err) {
            resolve([]);
        }
    });
}

async function idbDeleteSnapshot(id) {
    if (dbBackendActive) {
        try {
            await dbRequestJson(`/api/snapshots/${encodeURIComponent(id)}`, { method: 'DELETE' });
            return true;
        } catch {
            return false;
        }
    }
    const db = await openCalcDB();
    if (!db) return false;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_SNAPSHOTS, 'readwrite');
            tx.objectStore(STORE_SNAPSHOTS).delete(id);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        } catch (err) {
            resolve(false);
        }
    });
}

function downloadBlobFile(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBackupJSON() {
    const payload = {
        app: 'SouthTeam-ProfitCalculator',
        version: 3,
        exportedAt: new Date().toISOString(),
        customCosts: customCosts || {},
        customSkuRules: customSkuRules || [],
        mlQtyOverrides: mlQtyOverrides || {},
        taxRate: getTaxRatePercent(),
        targetMargin: getTargetMarginPercent(),
        extraExpenses: extraExpenses || { packagingPerUnit: 0, adsShopee: 0, adsML: 0 },
        groupingMode: groupingMode || 'model'
    };
    const dateStamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    downloadBlobFile(`Backup_Calculadora_SouthTeam_${dateStamp}.json`, blob);
    showToast('Backup JSON exportado com sucesso!', 'success');
}

function handleBackupFileImport(event) {
    const file = event.target?.files?.[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!parsed || typeof parsed !== 'object' || (!parsed.customCosts && !parsed.extraExpenses && !parsed.mlQtyOverrides)) {
                throw new Error('Arquivo JSON incompatível com o backup da calculadora.');
            }
            await applyBackupPayload(parsed);
            showToast('Configurações e custos restaurados do backup!', 'success');
        } catch (err) {
            showToast('Falha ao importar backup: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
}

async function applyBackupPayload(parsed) {
    if (parsed.customCosts && typeof parsed.customCosts === 'object' && !Array.isArray(parsed.customCosts)) {
        customCosts = parsed.customCosts;
        saveCustomCosts();
    }
    if (Array.isArray(parsed.customSkuRules)) {
        customSkuRules = parsed.customSkuRules.filter(r => r && r.prefix && r.canonicalName);
        saveCustomSkuRules();
    }
    if (parsed.mlQtyOverrides && typeof parsed.mlQtyOverrides === 'object' && !Array.isArray(parsed.mlQtyOverrides)) {
        mlQtyOverrides = parsed.mlQtyOverrides;
        saveMLQtyOverrides();
    }
    if (parsed.taxRate !== undefined) {
        const taxInput = document.getElementById('tax-rate');
        const t = Math.max(0, Math.min(100, Number(parsed.taxRate) || 0));
        if (taxInput) taxInput.value = t;
        saveTaxRate(t);
    }
    if (parsed.targetMargin !== undefined) {
        const m = Math.max(1, Math.min(80, Number(parsed.targetMargin) || 20));
        targetMarginPct = m;
        saveTargetMargin(m);
        const marginInput = document.getElementById('target-margin-input');
        if (marginInput) marginInput.value = m;
    }
    if (parsed.extraExpenses && typeof parsed.extraExpenses === 'object') {
        extraExpenses = {
            packagingPerUnit: Math.max(0, Number(parsed.extraExpenses.packagingPerUnit) || 0),
            adsShopee: Math.max(0, Number(parsed.extraExpenses.adsShopee) || 0),
            adsML: Math.max(0, Number(parsed.extraExpenses.adsML) || 0)
        };
        saveExtraExpenses();
        syncExpensesInputsUI();
    }
    if (parsed.groupingMode === 'model' || parsed.groupingMode === 'listing') {
        groupingMode = parsed.groupingMode;
        saveGroupingMode();
    }

    if (dbBackendActive) {
        try {
            await dbRequestJson('/api/backup/restore', { method: 'POST', body: JSON.stringify(parsed) });
        } catch (err) {
            console.warn('Falha ao restaurar backup no SQLite:', err);
        }
    }

    if (typeof refreshAllChannelsModels === 'function') {
        refreshAllChannelsModels();
    }
    if (typeof rebuildDbActiveView === 'function' && dbBackendActive) {
        rebuildDbActiveView();
    } else {
        if (channelData.mercadolivre) {
            applyMLQuantityInference(channelData.mercadolivre);
            idbSaveChannel('mercadolivre', channelData.mercadolivre);
        }
        if (channelData.shopee) {
            idbSaveChannel('shopee', channelData.shopee);
        }
        rebuildActiveOrders();
    }
    if (hasPrimaryChannelData()) recalcAll();
    if (document.getElementById('all-costs-modal')?.style.display !== 'none') {
        renderAllCostsTable();
    }
}
