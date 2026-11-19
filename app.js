// ===== CONFIGURAÇÃO: CUSTO PADRÃO POR PRODUTO =====
const COST_MAP = {
    "Bola De Futebol Campo South Team Star Tamanho 5 Adulto PU Treino Jogo Resistente": 42.00,
    "Luva De Boxe South Team Classic - Ideal para Treino De Impacto Muay Thai e Kickboxing Resistente": 130.00,
    "Luva MMA Profissional PU Boxing Shooter Treino Combate": 84.00,
    "Kimono Jiu Jitsu Adulto Premium Calça + Jaqueta Gi Forte Durável Treino e Competição": 240.00,
    "Luva MMA South Team Preta Profissional Treino Artes Marciais Muay Thai Jiu Jitsu Alta Resistência": 79.00,
    "Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Vermelha Treino Sparring": 99.00,
    "Luva de Boxe Profissional Gold Pro Azul South Team Velcro Treino Sparring": 109.00,
    "Escudo de Chute Grande Profissional PU Muay Thai Karatê MMA Treino South Team": 240.00,
    "Protetor de Canela Profissional MMA Muay Thai Kickboxing – South Team": 170.00,
    "KIT Luva de Boxe Profissional Fantasy 2K25 + Bucal + Bandagem 3m – South Team": 132.00,
    "Bolsa Treino Academia South Team Porta Equipamentos Boxe Gym": 75.00,
    "Luva De Goleiro Profissional Force South Team Alta Grip Treino Jogo": 59.90,
    "Bastão de Treino Boxe 53cm South Team Par Profissional Reflexo": 99.00,
    "Luva de Goleiro Adulto Futebol Profissional SOUTH TEAM para Jogo e Treino": 54.90,
    "Bermuda Muay Thai Boxe Profissional South Team Shorts Treino Luta Academia - Preto Tribal": 55.00,
    "Bermuda Muay Thai Boxe Profissional South Team Shorts Treino Luta Academia - Preto Vulcano": 55.00,
    "Bermuda Muay Thai Boxe Profissional South Team Shorts Treino Luta Academia - Azul Camuflado": 55.00,
    "Bermuda Muay Thai Boxe Profissional South Team Shorts Treino Luta Academia - Preto Shadow": 55.00,
    "Bermuda Muay Thai Boxe Profissional South Team Shorts Treino Luta Academia - Azul Fênix": 55.00,
    "Luva de Boxe Profissional Gold Pro Vermelho South Team Velcro Treino Sparring": 109.00,
    "Luva de Boxe Profissional Gold Pro Dourado South Team Velcro Treino Sparring": 109.00,
    "Luva de Boxe Profissional Gold Pro Rosa South Team Velcro Treino Sparring": 109.00,
    "Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Rosa Treino Sparring": 99.00,
    "Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Preta Treino Sparring": 99.00,
    "Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Amarela Treino Sparring": 99.00,
    "Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Azul Treino Sparring": 99.00,
    "Luva de Boxe Profissional Pro10 South Team Treino Muay Thai Kickboxing": 109.00,
    "Luva de Boxe Profissional Muay Thai Alta Absorção Impacto Treino Sparring South Team": 94.00,
    "Luva de Boxe Profissional Muay Thai Alta Absorção Impacto South Team Mex Tec Pro Impact": 114.00,
    "PROTETOR DE CANELA CANELEIRA MMM PRO SHIN- SOUTH TEAM": 155.00,
    "Luva de Boxe Profissional PRO10 South Team Treino Muay Thai Kickboxing Medidas": 109.00,
    "LUVA BOXE GOLD PRO KICKBOXING TREINO LUTA - SOUTH TEAM": 109.00,
    "Protetor Bucal Profissional Esportes Mma - South Team": 30.00,
    "Par Bandagem Elástica 5 Metros Artes Marciais - South Team": 28.00,
    "Aparador Manopla de Chute Luta Profissional - South Team": 299.00,
    "Par Bandagem Elástica 3 Metros Artes Marciais - South Team": 23.00,
    "Luva Goleiro Infantil Juvenil South Team Futebol Campo Society Futsal Alta Aderência Conforto": 38.00,
    "Luva de Boxe Fantasy para Treino Kickboxing e Luta – South Team": 94.00,
    "Protetor Bucal Profissional para Luta MMA Boxe e Artes Marciais – South Team": 30.00,
    "Manopla de Foco Profissional para Treino e Artes Marciais – South Team": 110.00,
    "Luva de Goleiro Profissional Adulto Futebol Campo Society Treino SOUTH TEAM": 51.90,
    "PROTETOR CABEÇA CAPACETE LUTA TREINO BOXE MUAY THAI MMA": 130.00
};

const DEFAULT_SPREADSHEETS = [
    'Relatorio de Vendas 2026 SHP/Order.all.order_creation_date.20260901_20260930.xlsx',
    'Relatorio de Vendas 2026 ML/collection-20261111165939-f4cd.xlsx',
    'Relatorios de desempenho ML/Relatorio_desempenho_publicacoes_2026_09_01-2026_09_30.xlsx'
];
const STORAGE_KEYS = {
    COSTS: 'shopee_custom_costs',
    TAX_RATE: 'shopee_tax_rate',
    TARGET_MARGIN: 'calc_target_margin',
    EXPENSES: 'calc_extra_expenses',
    SKU_RULES: 'calc_custom_sku_rules',
    INITIALIZED: 'calc_idb_initialized',
    ML_QTY_OVERRIDES: 'ml_order_qty_overrides',
    GROUP_MODE: 'calc_group_mode'
};
const DEFAULT_TAX_RATE = 9;
const DEFAULT_TARGET_MARGIN = 20;
const MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Regras de agrupamento canônico por SKU / título para unificar variações entre Shopee e ML
const SKU_MODEL_RULES = [
    { modelKey: 'BAND3M', canonicalName: 'Par Bandagem Elástica 3 Metros Artes Marciais - South Team', defaultCost: 23.00, skuPrefixes: ['BAND3M'], titleTest: t => !t.includes('kit') && !t.includes('luva') && t.includes('bandagem') && (t.includes('3m') || t.includes('3 metro')) },
    { modelKey: 'BAND5M', canonicalName: 'Par Bandagem Elástica 5 Metros Artes Marciais - South Team', defaultCost: 28.00, skuPrefixes: ['BAND5M'], titleTest: t => !t.includes('kit') && !t.includes('luva') && t.includes('bandagem') && (t.includes('5m') || t.includes('5 metro')) },
    { modelKey: 'BERM-MT', canonicalName: 'Bermuda Muay Thai Boxe Profissional South Team', defaultCost: 55.00, skuPrefixes: ['BERM-MT'], titleTest: t => t.includes('bermuda') && t.includes('muay thai') },
    { modelKey: 'BOLSA-GYM', canonicalName: 'Bolsa Treino Academia South Team Porta Equipamentos Boxe Gym', defaultCost: 75.00, skuPrefixes: ['BOLSA-GYM', 'ST-BAG-FIGHT'], titleTest: t => t.includes('bolsa') && (t.includes('treino') || t.includes('academia') || t.includes('south team')) },
    { modelKey: 'BUC-ESP', canonicalName: 'Protetor Bucal Profissional Esportes Mma - South Team', defaultCost: 30.00, skuPrefixes: ['BUC-ESP'] },
    { modelKey: 'BUCTRAS', canonicalName: 'Protetor Bucal Profissional para Luta MMA Boxe e Artes Marciais – South Team', defaultCost: 30.00, skuPrefixes: ['BUCTRAS', 'MLB3994362945'], titleTest: t => !t.includes('kit') && !t.includes('luva') && !t.includes('esporte') && t.includes('bucal') && (t.includes('luta') || t.includes('artes') || t.includes('boxe')) },
    { modelKey: 'CAN-ANTIGO', canonicalName: 'PROTETOR DE CANELA CANELEIRA MMM PRO SHIN- SOUTH TEAM', defaultCost: 155.00, skuPrefixes: ['CAN-ANTIGO', 'MODELO ANTIGO', 'ANTIGO-'], titleTest: t => t.includes('caneleira') || (t.includes('canela') && t.includes('pro shin')) },
    { modelKey: 'CAN-NOVO', canonicalName: 'Protetor de Canela Profissional MMA Muay Thai Kickboxing – South Team', defaultCost: 170.00, skuPrefixes: ['CAN-NOVO', 'MODELO-NOVO'], titleTest: t => t.includes('protetor de canela') && !t.includes('pro shin') },
    { modelKey: 'CAP-MT', canonicalName: 'PROTETOR CABEÇA CAPACETE LUTA TREINO BOXE MUAY THAI MMA', defaultCost: 130.00, skuPrefixes: ['CAP-MT', 'ST-1201', 'ST-1202'], titleTest: t => t.includes('protetor') && (t.includes('cabeca') || t.includes('capacete')) },
    { modelKey: 'ESC-CHUTE', canonicalName: 'Escudo de Chute Grande Profissional PU Muay Thai Karatê MMA Treino South Team', defaultCost: 240.00, skuPrefixes: ['ESC-CHUTE', 'ST-1401', 'ST-1402', 'ST-1403', 'ST-1404'], titleTest: t => t.includes('escudo') && t.includes('chute') },
    { modelKey: 'KIM-GIFORTE', canonicalName: 'Kimono Jiu Jitsu Adulto Premium Calça + Jaqueta Gi Forte Durável Treino e Competição', defaultCost: 240.00, skuPrefixes: ['KIM-GIFORTE', 'KIMONO'], titleTest: t => !t.includes('faixa') && t.includes('kimono') && (t.includes('gi forte') || t.includes('jiu')) },
    { modelKey: 'LBX-CLASSIC', canonicalName: 'Luva De Boxe South Team Classic - Ideal para Treino De Impacto Muay Thai e Kickboxing Resistente', defaultCost: 130.00, skuPrefixes: ['LBX-CLASSIC', 'CLASSIC-'] },
    { modelKey: 'KIT-FAN25', canonicalName: 'KIT Luva de Boxe Profissional Fantasy 2K25 + Bucal + Bandagem 3m – South Team', defaultCost: 132.00, skuPrefixes: [], titleTest: t => t.includes('kit') && (t.includes('fantasy') || t.includes('fantasia')) },
    { modelKey: 'LBX-FAN25', canonicalName: 'Luva de Boxe Fantasy para Treino Kickboxing e Luta – South Team', defaultCost: 94.00, skuPrefixes: ['LBX-FAN25', '10OZ', '12OZ', '14OZ', '16OZ'], titleTest: t => !t.includes('kit') && (t.includes('fantasy') || t.includes('fantasia')) },
    { modelKey: 'LBX-GOLDVEL', canonicalName: 'Luva de Boxe Profissional Gold Pro South Team Velcro Treino Sparring', defaultCost: 109.00, skuPrefixes: ['LBX-GOLDVEL', 'GOLDP-', 'GPV-'], titleTest: t => !t.includes('kit') && t.includes('gold pro') },
    { modelKey: 'LBX-MEXTEC', canonicalName: 'Luva de Boxe Profissional Muay Thai Alta Absorção Impacto South Team Mex Tec Pro Impact', defaultCost: 114.00, skuPrefixes: ['LBX-MEXTEC', 'MEXTEC', 'ST-1001', 'ST-1002', 'ST-1003', 'ST-1004'], titleTest: t => !t.includes('kit') && (t.includes('mex tec') || t.includes('mextec')) },
    { modelKey: 'LBX-PRO10', canonicalName: 'Luva de Boxe Profissional PRO10 South Team Treino Muay Thai Kickboxing', defaultCost: 109.00, skuPrefixes: ['LBX-PRO10', 'PRO10'], titleTest: t => !t.includes('kit') && (t.includes('pro10') || t.includes('pro 10')) },
    { modelKey: 'LBX-TOP10', canonicalName: 'Luva de Boxe MMA Muay Thai Profissional TOP 10 South Team Treino Sparring', defaultCost: 99.00, skuPrefixes: ['LBX-TOP10', 'ST-10', 'ST-16', '14AZ', '16AZ'], titleTest: t => !t.includes('kit') && (t.includes('top 10') || t.includes('top10')) },
    { modelKey: 'LGOL-FORCE', canonicalName: 'Luva De Goleiro Profissional Force South Team Alta Grip Treino Jogo', defaultCost: 59.90, skuPrefixes: ['LGOL-FORCE'], titleTest: t => t.includes('goleiro') && t.includes('force') },
    { modelKey: 'LGOL-JUV', canonicalName: 'Luva Goleiro Infantil Juvenil South Team Futebol Campo Society Futsal Alta Aderência Conforto', defaultCost: 38.00, skuPrefixes: ['LGOL-JUV', 'LUVAJUVENIL'], titleTest: t => t.includes('goleiro') && (t.includes('juvenil') || t.includes('infantil')) },
    { modelKey: 'LGOL-PROF', canonicalName: 'Luva de Goleiro Adulto Futebol Profissional SOUTH TEAM para Jogo e Treino', defaultCost: 54.90, skuPrefixes: ['LGOL-PROF', 'LUVAMODELO2'] },
    { modelKey: 'LGOL-SIMPL', canonicalName: 'Luva de Goleiro Profissional Adulto Futebol Campo Society Treino SOUTH TEAM', defaultCost: 51.90, skuPrefixes: ['LGOL-SIMPL', 'SIMPLES'] },
    { modelKey: 'LMMA-SHOOTER', canonicalName: 'Luva MMA Profissional PU Boxing Shooter Treino Combate', defaultCost: 84.00, skuPrefixes: ['LMMA-SHOOTER', 'SHOOTER'], titleTest: t => t.includes('shooter') },
    { modelKey: 'LMMA-ST', canonicalName: 'Luva MMA South Team Preta Profissional Treino Artes Marciais Muay Thai Jiu Jitsu Alta Resistência', defaultCost: 79.00, skuPrefixes: ['LMMA-ST', 'LUVAMMA'], titleTest: t => t.includes('luva') && t.includes('mma') && !t.includes('shooter') },
    { modelKey: 'MAN-GOV', canonicalName: 'Manopla de Foco Profissional para Treino e Artes Marciais – South Team', defaultCost: 110.00, skuPrefixes: ['MAN-GOV', 'ST-1301', 'ST-1302', 'ST-1303', 'ST-1304', 'GOVERNADORA'], titleTest: t => t.includes('manopla') && !t.includes('antiga') && !t.includes('aparador') }
];

let dbFullDataset = null;
let availableMonthKeys = [];
let monthSelection = { mode: 'all', single: '', from: '', to: '' };
let monthlyEvolutionList = [];
let previousMonthAutoBaseline = null;
let dbSyncPaused = false;

let activeWorkspaceTab = 'history'; // 'history' | 'current'
let activeSubTab = 'overview'; // 'overview' | 'products' | 'sales' | 'audit' | 'financial'
let activeFocusView = 'overview'; // espelho legado para compatibilidade
let activeProductQuickFilter = 'all'; // 'all' | 'A' | 'B' | 'C' | 'low' | 'uncosted'
let latestSourcesStatus = null;
let currentWorkspaceData = {
    shopee: null,
    mercadolivre: null,
    mlPerf: null,
    updatedAt: 0
};
let historyFallbackData = {
    shopee: null,
    mercadolivre: null,
    mlPerf: null
};

let channelData = {
    shopee: null,
    mercadolivre: null,
    mlPerf: null
};
let activeChannel = 'all';
let groupingMode = 'model';
let mlQtyOverrides = {};
let targetMarginPct = DEFAULT_TARGET_MARGIN;
let extraExpenses = { packagingPerUnit: 0, adsShopee: 0, adsML: 0 };
let customSkuRules = [];
let dateFilter = { from: '', to: '' };
let costModalView = 'model';

let rawOrders = [];
let validOrdersSet = new Set();
let cancelledCount = 0;
let activeCancelledOrders = [];
let productSummary = {};
let customCosts = {};
let editingProduct = null;
let currentDetailKey = null;
let currentPeriodText = 'Período Importado';
let renderedTableKeys = [];
let renderedCostKeys = [];
let latestBaselineSnapshot = null;
let lastGrandTotals = {
    validOrders: 0, cancelledOrders: 0, totalUnits: 0,
    revenue: 0, cost: 0, fees: 0, shipping: 0, tax: 0,
    packaging: 0, ads: 0, extras: 0, profit: 0, margin: 0,
    channels: {},
    abc: {
        A: { count: 0, revenue: 0, profit: 0 },
        B: { count: 0, revenue: 0, profit: 0 },
        C: { count: 0, revenue: 0, profit: 0 }
    }
};

async function refreshBaselineSnapshotCache() {
    if (typeof idbListSnapshots !== 'function') return;
    try {
        const list = await idbListSnapshots();
        latestBaselineSnapshot = Array.isArray(list) && list.length > 0 ? list[0] : null;
    } catch {
        latestBaselineSnapshot = null;
    }
}

function parseDateTimeMs(rawStr) {
    const s = String(rawStr || '').trim();
    if (!s) return NaN;
    let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (m) {
        return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime();
    }
    m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (m) {
        return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime();
    }
    return NaN;
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    loadCustomCosts();
    loadTaxRate();
    loadTargetMargin();
    loadExtraExpenses();
    loadCustomSkuRules();
    loadMLQtyOverrides();
    loadGroupingMode();
    setupEventListeners();
    loadInitialChannels();
});

function setupEventListeners() {
    const taxInput = document.getElementById('tax-rate');
    taxInput?.addEventListener('input', () => {
        const taxPct = getTaxRatePercent();
        document.getElementById('tax-pct-label').textContent = taxPct;
        saveTaxRate(taxPct);
        if (hasPrimaryChannelData()) {
            recalcAll();
        }
    });

    const marginInput = document.getElementById('target-margin-input');
    marginInput?.addEventListener('input', () => {
        targetMarginPct = getTargetMarginPercent();
        saveTargetMargin(targetMarginPct);
        if (hasPrimaryChannelData()) {
            recalcAll();
        }
    });

    ['exp-packaging', 'exp-ads-shopee', 'exp-ads-ml'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateExpensesFromInputs);
    });

    // Delegação segura para tabela principal (evita injeção em atributos onclick)
    document.getElementById('products-body').addEventListener('click', (e) => {
        const costTrigger = e.target.closest('.cost-editable[data-idx]');
        if (costTrigger) {
            e.stopPropagation();
            const key = renderedTableKeys[Number(costTrigger.dataset.idx)];
            if (key !== undefined) openCostEdit(key);
            return;
        }
        const row = e.target.closest('tr[data-idx]');
        if (row) {
            const key = renderedTableKeys[Number(row.dataset.idx)];
            if (key !== undefined) showDetail(key);
        }
    });

    // Delegação segura para edição manual de quantidade ML e simulador no modal de detalhes
    const modalBody = document.getElementById('modal-body');
    modalBody.addEventListener('change', (e) => {
        const qtyInput = e.target.closest('.qty-edit-input[data-order-id]');
        if (!qtyInput) return;
        const orderId = qtyInput.dataset.orderId;
        const parsed = parseInt(qtyInput.value, 10);
        if (!Number.isFinite(parsed) || parsed < 1) {
            qtyInput.value = 1;
            setMLOrderQtyOverride(orderId, 1);
            return;
        }
        setMLOrderQtyOverride(orderId, parsed);
    });
    modalBody.addEventListener('input', (e) => {
        const slider = e.target.closest('.sim-margin-slider');
        if (slider && typeof updateDetailSimulator === 'function') {
            updateDetailSimulator(Number(slider.value));
        }
    });

    // Delegação segura para modal de custos gerais e regras customizadas de SKU
    document.getElementById('all-costs-list').addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit-cost-idx]');
        if (!editBtn) return;
        const key = renderedCostKeys[Number(editBtn.dataset.editCostIdx)];
        if (key !== undefined) openCostEdit(key);
    });
    document.getElementById('custom-sku-rules-bar')?.addEventListener('click', (e) => {
        const delBtn = e.target.closest('[data-del-rule-id]');
        if (delBtn) deleteCustomSkuRule(delBtn.dataset.delRuleId);
    });

    // Fechar modais ao clicar fora do conteúdo (backdrop)
    const modalClosers = [
        ['detail-modal', closeModal],
        ['cost-modal', closeCostModal],
        ['all-costs-modal', closeAllCostsModal],
        ['cancelled-modal', () => typeof closeCancelledModal === 'function' && closeCancelledModal()],
        ['snapshots-modal', () => typeof closeSnapshotsModal === 'function' && closeSnapshotsModal()],
        ['info-modal', closeInfoModal]
    ];
    modalClosers.forEach(([id, closer]) => {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closer();
            });
        }
    });

    // Drag and drop na área inicial e na janela inteira
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer?.files?.length) {
                if (activeWorkspaceTab === 'current') {
                    importCurrentMonthFiles(e.dataTransfer.files);
                } else {
                    importSpreadsheetFiles(e.dataTransfer.files);
                }
            }
        });
    }

    document.addEventListener('dragover', (e) => {
        if (e.dataTransfer?.types?.includes('Files')) {
            e.preventDefault();
        }
    });
    document.addEventListener('drop', (e) => {
        if (e.target.closest('#dropzone')) return;
        if (e.dataTransfer?.files?.length) {
            e.preventDefault();
            if (activeWorkspaceTab === 'current') {
                importCurrentMonthFiles(e.dataTransfer.files);
            } else {
                importSpreadsheetFiles(e.dataTransfer.files);
            }
        }
    });
}

function loadCustomCosts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.COSTS);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            customCosts = parsed;
        }
    } catch (err) {
        console.warn('Falha ao carregar custos salvos:', err);
        customCosts = {};
    }
}

function saveCustomCosts() {
    localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(customCosts));
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveCustomCosts === 'function') {
        dbSaveCustomCosts(customCosts, true);
    }
}

function loadTaxRate() {
    const taxInput = document.getElementById('tax-rate');
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.TAX_RATE);
        if (saved !== null) {
            const parsed = parseFloat(saved);
            if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
                taxInput.value = parsed;
            }
        }
    } catch (err) {
        console.warn('Falha ao carregar alíquota de imposto:', err);
    }
    document.getElementById('tax-pct-label').textContent = getTaxRatePercent();
}

function saveTaxRate(taxPct) {
    try {
        localStorage.setItem(STORAGE_KEYS.TAX_RATE, String(taxPct));
    } catch (err) {
        console.warn('Falha ao salvar alíquota de imposto:', err);
    }
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveSettings === 'function') {
        dbSaveSettings({ taxRate: taxPct });
    }
}

function parseNumberField(raw, fallback = 0, min = 0, max = Infinity) {
    if (raw === '' || raw === null || raw === undefined) return fallback;
    const parsed = parseFloat(String(raw).replace(',', '.'));
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

function getTaxRatePercent() {
    const el = document.getElementById('tax-rate');
    return parseNumberField(el?.value, 0, 0, 100);
}

function loadTargetMargin() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.TARGET_MARGIN);
        if (saved !== null) {
            targetMarginPct = parseNumberField(saved, DEFAULT_TARGET_MARGIN, 0, 80);
        }
    } catch (err) {
        console.warn('Falha ao carregar margem alvo:', err);
    }
    const input = document.getElementById('target-margin-input');
    if (input) input.value = targetMarginPct;
}

function saveTargetMargin(val) {
    try {
        localStorage.setItem(STORAGE_KEYS.TARGET_MARGIN, String(val));
    } catch (err) {
        console.warn('Falha ao salvar margem alvo:', err);
    }
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveSettings === 'function') {
        dbSaveSettings({ targetMargin: val });
    }
}

function getTargetMarginPercent() {
    const el = document.getElementById('target-margin-input');
    return el ? parseNumberField(el.value, 0, 0, 80) : targetMarginPct;
}

function loadExtraExpenses() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                extraExpenses = {
                    packagingPerUnit: parseNumberField(parsed.packagingPerUnit, 0, 0),
                    adsShopee: parseNumberField(parsed.adsShopee, 0, 0),
                    adsML: parseNumberField(parsed.adsML, 0, 0)
                };
            }
        }
    } catch (err) {
        console.warn('Falha ao carregar despesas extras:', err);
    }
    syncExpensesInputsUI();
}

function saveExtraExpenses() {
    try {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(extraExpenses));
    } catch (err) {
        console.warn('Falha ao salvar despesas extras:', err);
    }
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveSettings === 'function') {
        dbSaveSettings({ extraExpenses });
    }
}

function syncExpensesInputsUI() {
    const map = [
        ['exp-packaging', extraExpenses.packagingPerUnit],
        ['exp-ads-shopee', extraExpenses.adsShopee],
        ['exp-ads-ml', extraExpenses.adsML]
    ];
    map.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
}

function updateExpensesFromInputs() {
    extraExpenses = {
        packagingPerUnit: parseNumberField(document.getElementById('exp-packaging')?.value, 0, 0),
        adsShopee: parseNumberField(document.getElementById('exp-ads-shopee')?.value, 0, 0),
        adsML: parseNumberField(document.getElementById('exp-ads-ml')?.value, 0, 0)
    };
    saveExtraExpenses();
    if (hasPrimaryChannelData()) recalcAll();
}

function loadCustomSkuRules() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SKU_RULES);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                customSkuRules = parsed
                    .filter(r => r && r.prefix && r.canonicalName)
                    .map(r => ({
                        id: String(r.id || `sku-${Date.now()}`),
                        prefix: String(r.prefix).trim().toUpperCase(),
                        canonicalName: String(r.canonicalName).trim(),
                        defaultCost: parseNumberField(r.defaultCost, 0, 0)
                    }));
            }
        }
    } catch (err) {
        console.warn('Falha ao carregar regras de SKU:', err);
        customSkuRules = [];
    }
    renderCustomSkuRulesBar();
}

function saveCustomSkuRules() {
    try {
        localStorage.setItem(STORAGE_KEYS.SKU_RULES, JSON.stringify(customSkuRules));
    } catch (err) {
        console.warn('Falha ao salvar regras de SKU:', err);
    }
}

function toggleSkuRuleForm() {
    const form = document.getElementById('sku-rule-form');
    if (!form) return;
    const isHidden = form.style.display === 'none';
    form.style.display = isHidden ? 'grid' : 'none';
    if (isHidden) {
        document.getElementById('new-sku-prefix')?.focus();
    }
}

function handleAddSkuRule(e) {
    e.preventDefault();
    const prefix = String(document.getElementById('new-sku-prefix')?.value || '').trim().toUpperCase();
    const canonicalName = String(document.getElementById('new-sku-name')?.value || '').trim();
    const defaultCost = parseNumberField(document.getElementById('new-sku-cost')?.value, -1, 0);

    if (!prefix || !canonicalName || defaultCost < 0) {
        showToast('Preencha prefixo de SKU, nome do modelo e custo válido.', 'error');
        return;
    }

    let savedRule;
    const existing = customSkuRules.find(r => r.prefix === prefix);
    if (existing) {
        existing.canonicalName = canonicalName;
        existing.defaultCost = defaultCost;
        savedRule = existing;
    } else {
        savedRule = { id: `sku-${Date.now()}`, prefix, canonicalName, defaultCost };
        customSkuRules.push(savedRule);
    }

    saveCustomSkuRules();
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbUpsertSkuRule === 'function') {
        dbUpsertSkuRule(savedRule);
    }
    recomputeAfterMetadataChange({ persistCurrent: true });
    renderAllCostsTable();

    e.target.reset();
    document.getElementById('sku-rule-form').style.display = 'none';
    showToast(`Regra SKU "${prefix}" vinculada ao modelo "${canonicalName}"!`, 'success');
}

function deleteCustomSkuRule(id) {
    customSkuRules = customSkuRules.filter(r => r.id !== id);
    saveCustomSkuRules();
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbDeleteSkuRule === 'function') {
        dbDeleteSkuRule(id);
    }
    recomputeAfterMetadataChange({ persistCurrent: true });
    renderAllCostsTable();
    showToast('Regra de SKU removida.', 'info');
}

function renderCustomSkuRulesBar() {
    const bar = document.getElementById('custom-sku-rules-bar');
    if (!bar) return;
    if (customSkuRules.length === 0) {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = customSkuRules.map(r => `
        <span class="sku-rule-pill">
            <strong>${escapeHtml(r.prefix)}</strong> → ${escapeHtml(r.canonicalName)} (${fmt(r.defaultCost)})
            <button type="button" data-del-rule-id="${escapeHtml(r.id)}" title="Remover regra">✕</button>
        </span>
    `).join('');
}

function refreshAllChannelsModels() {
    const applyOrderList = (list) => {
        (list || []).forEach(o => {
            const model = resolveCanonicalModel(o.sku, o.productName);
            o.modelKey = model.modelKey;
            o.canonicalName = model.canonicalName;
            o.defaultModelCost = model.defaultCost;
        });
    };
    ['shopee', 'mercadolivre'].forEach(chKey => {
        if (channelData[chKey]?.orders) applyOrderList(channelData[chKey].orders);
        if (currentWorkspaceData[chKey]?.orders) applyOrderList(currentWorkspaceData[chKey].orders);
        if (historyFallbackData[chKey]?.orders) applyOrderList(historyFallbackData[chKey].orders);
    });
    if (dbFullDataset && Array.isArray(dbFullDataset.orders)) {
        applyOrderList(dbFullDataset.orders);
    }
}

function recomputeAfterMetadataChange(options = { persistCurrent: true }) {
    refreshAllChannelsModels();
    if (activeWorkspaceTab === 'current') {
        syncCurrentWorkspaceInference();
        channelData.shopee = currentWorkspaceData.shopee;
        channelData.mercadolivre = currentWorkspaceData.mercadolivre;
        channelData.mlPerf = currentWorkspaceData.mlPerf;
        rebuildActiveOrders();
        if (options.persistCurrent && typeof dbSaveCurrentMonthDraft === 'function') {
            currentWorkspaceData.updatedAt = Date.now();
            dbSaveCurrentMonthDraft(currentWorkspaceData);
        }
    } else if (typeof dbBackendActive !== 'undefined' && dbBackendActive && dbFullDataset) {
        rebuildDbActiveView();
    } else {
        if (channelData.mercadolivre) {
            applyMLQuantityInference(channelData.mercadolivre);
            if (typeof idbSaveChannel === 'function') idbSaveChannel('mercadolivre', channelData.mercadolivre);
        }
        rebuildActiveOrders();
    }
    if (hasPrimaryChannelData()) recalcAll();
    updateWorkspaceChromeUI();
}

function extractISODate(rawDate) {
    const str = String(rawDate || '').trim();
    if (!str) return '';
    let m = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) {
        return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    }
    m = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (m) {
        return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }
    return '';
}

function matchesDateFilter(isoDate) {
    if (!dateFilter.from && !dateFilter.to) return true;
    if (!isoDate) return false;
    if (dateFilter.from && isoDate < dateFilter.from) return false;
    if (dateFilter.to && isoDate > dateFilter.to) return false;
    return true;
}

function setDateFilter() {
    let from = document.getElementById('date-from')?.value || '';
    let to = document.getElementById('date-to')?.value || '';
    if (from && to && from > to) {
        [from, to] = [to, from];
        document.getElementById('date-from').value = from;
        document.getElementById('date-to').value = to;
    }
    dateFilter = { from, to };
    const clearBtn = document.getElementById('btn-clear-dates');
    if (clearBtn) clearBtn.style.display = (from || to) ? '' : 'none';
    rebuildActiveOrders();
    if (hasPrimaryChannelData()) recalcAll();
}

function clearDateFilter() {
    const fromEl = document.getElementById('date-from');
    const toEl = document.getElementById('date-to');
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    setDateFilter();
}

function loadMLQtyOverrides() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.ML_QTY_OVERRIDES);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            mlQtyOverrides = parsed;
        }
    } catch (err) {
        console.warn('Falha ao carregar quantidades manuais ML:', err);
        mlQtyOverrides = {};
    }
}

function saveMLQtyOverrides() {
    try {
        localStorage.setItem(STORAGE_KEYS.ML_QTY_OVERRIDES, JSON.stringify(mlQtyOverrides));
    } catch (err) {
        console.warn('Falha ao salvar quantidades manuais ML:', err);
    }
}

function loadGroupingMode() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GROUP_MODE);
        if (saved === 'model' || saved === 'listing') {
            groupingMode = saved;
        }
    } catch (err) {
        console.warn('Falha ao carregar modo de agrupamento:', err);
    }
    const sel = document.getElementById('group-mode');
    if (sel) sel.value = groupingMode;
}

function saveGroupingMode() {
    try {
        localStorage.setItem(STORAGE_KEYS.GROUP_MODE, groupingMode);
    } catch (err) {
        console.warn('Falha ao salvar modo de agrupamento:', err);
    }
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveSettings === 'function') {
        dbSaveSettings({ groupingMode });
    }
}

// ===== HELPER DE PARSE NUMÉRICO ROBUSTO =====
function parseNum(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
    let str = String(val).replace(/R\$\s?/gi, '').trim();
    if (!str) return 0;

    const lastComma = str.lastIndexOf(',');
    const lastDot = str.lastIndexOf('.');

    if (lastComma !== -1 && lastDot !== -1) {
        if (lastComma > lastDot) {
            str = str.replace(/\./g, '').replace(',', '.');
        } else {
            str = str.replace(/,/g, '');
        }
    } else if (lastComma !== -1) {
        if (/^-?\d{1,3}(,\d{3})+$/.test(str)) {
            str = str.replace(/,/g, '');
        } else {
            str = str.replace(',', '.');
        }
    }

    const num = parseFloat(str);
    return Number.isFinite(num) ? num : 0;
}

function normalizeText(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// ===== INTERPRETAR PERÍODO PELO NOME DO ARQUIVO OU DATAS =====
function extractPeriodFromFilename(filename) {
    if (!filename) return null;

    // 1. Padrão YYYYMMDD_YYYYMMDD ou YYYY_MM_DD-YYYY_MM_DD no nome do arquivo
    const matchDates = filename.match(/(20\d{2})[-_]?(0[1-9]|1[0-2])[-_]?(?:0[1-9]|[12]\d|3[01])[_-](20\d{2})[-_]?(0[1-9]|1[0-2])[-_]?(?:0[1-9]|[12]\d|3[01])/);
    if (matchDates) {
        const startYear = matchDates[1];
        const startMonthIdx = parseInt(matchDates[2], 10) - 1;
        const endYear = matchDates[3];
        const endMonthIdx = parseInt(matchDates[4], 10) - 1;

        if (MONTHS_PT[startMonthIdx] && MONTHS_PT[endMonthIdx]) {
            if (startMonthIdx === endMonthIdx && startYear === endYear) {
                return `${MONTHS_PT[startMonthIdx]} ${startYear}`;
            }
            return `${MONTHS_PT[startMonthIdx]} ${startYear} a ${MONTHS_PT[endMonthIdx]} ${endYear}`;
        }
    }

    // 2. Nome do mês explícito no nome do arquivo com delimitador de palavra
    const fnNorm = normalizeText(filename);
    for (let i = 0; i < MONTHS_PT.length; i++) {
        const mNorm = normalizeText(MONTHS_PT[i]);
        const wordRegex = new RegExp(`(^|[^a-z])${mNorm}([^a-z]|$)`);
        if (wordRegex.test(fnNorm)) {
            const yearMatch = filename.match(/20\d{2}/);
            const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
            return `${MONTHS_PT[i]} ${year}`;
        }
    }

    return null;
}

function parseOrderMonthYear(rawDate) {
    if (rawDate === null || rawDate === undefined || rawDate === '') return null;

    if (typeof rawDate === 'number' || /^\d{5}(\.\d+)?$/.test(String(rawDate).trim())) {
        const serial = Number(rawDate);
        if (Number.isFinite(serial) && serial > 20000) {
            if (typeof XLSX !== 'undefined' && XLSX.SSF?.parse_date_code) {
                const parsed = XLSX.SSF.parse_date_code(serial);
                if (parsed && parsed.y && parsed.m >= 1 && parsed.m <= 12) {
                    return { year: parsed.y, monthIdx: parsed.m - 1 };
                }
            }
            const utcDate = new Date((serial - 25569) * 86400 * 1000);
            if (!isNaN(utcDate.getTime())) {
                return { year: utcDate.getUTCFullYear(), monthIdx: utcDate.getUTCMonth() };
            }
        }
    }

    const str = String(rawDate).trim();
    const isoMatch = str.match(/(\d{4})-(\d{2})/);
    if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const monthIdx = parseInt(isoMatch[2], 10) - 1;
        if (MONTHS_PT[monthIdx]) return { year, monthIdx };
    }

    const brMatch = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (brMatch) {
        const year = parseInt(brMatch[3], 10);
        const monthIdx = parseInt(brMatch[2], 10) - 1;
        if (MONTHS_PT[monthIdx]) return { year, monthIdx };
    }

    return null;
}

function resolvePeriodText(datesList, filename = '') {
    const fromFilename = extractPeriodFromFilename(filename);
    if (fromFilename) return fromFilename;

    if (datesList && datesList.length > 0) {
        const monthSet = new Map();
        datesList.forEach(d => {
            const parsed = parseOrderMonthYear(d);
            if (parsed) {
                const sortKey = parsed.year * 12 + parsed.monthIdx;
                monthSet.set(sortKey, parsed);
            }
        });

        const sorted = [...monthSet.entries()].sort((a, b) => a[0] - b[0]).map(([, val]) => val);
        if (sorted.length === 1) {
            return `${MONTHS_PT[sorted[0].monthIdx]} ${sorted[0].year}`;
        }
        if (sorted.length > 1) {
            const first = sorted[0];
            const last = sorted[sorted.length - 1];
            return `${MONTHS_PT[first.monthIdx]} ${first.year} a ${MONTHS_PT[last.monthIdx]} ${last.year}`;
        }
    }
    return 'Período Importado';
}

function formatMonthKeyPt(monthKey) {
    const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
    if (!m) return monthKey || 'Desconhecido';
    const idx = parseInt(m[2], 10) - 1;
    return MONTHS_PT[idx] ? `${MONTHS_PT[idx]} ${m[1]}` : monthKey;
}

function inferMonthKey(datesList, filename = '') {
    const mFile = String(filename || '').match(/(20\d{2})[-_]?(0[1-9]|1[0-2])[-_]?(?:0[1-9]|[12]\d|3[01])[_-](20\d{2})[-_]?(0[1-9]|1[0-2])/);
    if (mFile && mFile[1] === mFile[3] && mFile[2] === mFile[4]) {
        return `${mFile[1]}-${mFile[2]}`;
    }
    const counts = new Map();
    (datesList || []).forEach(d => {
        const parsed = parseOrderMonthYear(d);
        if (parsed) {
            const mk = `${parsed.year}-${String(parsed.monthIdx + 1).padStart(2, '0')}`;
            counts.set(mk, (counts.get(mk) || 0) + 1);
        }
    });
    if (counts.size > 0) {
        return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }
    return 'undated';
}

function applyPeriodText(text) {
    currentPeriodText = text || 'Período Importado';
    const periodElem = document.getElementById('period-text');
    const headerPeriodElem = document.getElementById('header-period-text');
    if (periodElem) periodElem.textContent = currentPeriodText;
    if (headerPeriodElem) headerPeriodElem.textContent = currentPeriodText;
}

function updatePeriodDisplay(datesList, filename = '') {
    applyPeriodText(resolvePeriodText(datesList, filename));
}

// ===== RESOLUÇÃO CANÔNICA DE MODELO E SKU =====
function resolveCanonicalModel(sku, productName) {
    const skuUpper = String(sku || '').trim().toUpperCase();
    const normTitle = normalizeText(productName);

    if (skuUpper && customSkuRules.length > 0) {
        const sortedCustom = [...customSkuRules].sort((a, b) => b.prefix.length - a.prefix.length);
        for (const rule of sortedCustom) {
            const pfx = String(rule.prefix || '').toUpperCase();
            if (pfx && skuUpper.startsWith(pfx)) {
                return { modelKey: pfx, canonicalName: rule.canonicalName, defaultCost: rule.defaultCost };
            }
        }
    }

    if (skuUpper) {
        for (const rule of SKU_MODEL_RULES) {
            if (rule.skuPrefixes.some(prefix => skuUpper.startsWith(prefix))) {
                return { modelKey: rule.modelKey, canonicalName: rule.canonicalName, defaultCost: rule.defaultCost };
            }
        }
    }

    for (const rule of SKU_MODEL_RULES) {
        if (rule.titleTest && rule.titleTest(normTitle)) {
            return { modelKey: rule.modelKey, canonicalName: rule.canonicalName, defaultCost: rule.defaultCost };
        }
    }

    const mapped = findMappedCostEntry(productName);
    if (mapped) {
        return { modelKey: '', canonicalName: mapped.key, defaultCost: mapped.cost };
    }

    return { modelKey: '', canonicalName: String(productName || '').trim(), defaultCost: 0 };
}

function findModelRuleByName(name) {
    const targetNorm = normalizeCostKey(name);
    const customMatch = customSkuRules.find(r => normalizeCostKey(r.canonicalName) === targetNorm);
    if (customMatch) return customMatch;
    return SKU_MODEL_RULES.find(r => normalizeCostKey(r.canonicalName) === targetNorm) || null;
}

// ===== DETECÇÃO DINÂMICA DE COLUNAS E FORMATO DE PLANILHA =====
const SHOPEE_COLUMN_SPECS = [
    { key: 'ORDER_ID', fallbackIdx: 0, patterns: [/^(id do pedido|order id|n[º°]? do pedido|numero do pedido)$/i, /id do pedido|order id/i] },
    { key: 'STATUS', fallbackIdx: 1, patterns: [/^(status do pedido|order status|status)$/i] },
    { key: 'CANCEL_REASON', fallbackIdx: 3, patterns: [/cancelar motivo|motivo do cancelamento|cancel reason/i] },
    { key: 'RETURN_STATUS', fallbackIdx: 4, patterns: [/status da devolu[çc][ãa]o|return status/i, /devolu[çc][ãa]o.*reembolso/i] },
    { key: 'ORDER_DATE', fallbackIdx: 8, patterns: [/^(data de cria[çc][ãa]o do pedido|order creation date|data do pedido)$/i, /cria[çc][ãa]o do pedido|order creation/i] },
    { key: 'PARENT_SKU', fallbackIdx: 16, patterns: [/sku principal|parent sku/i] },
    { key: 'PRODUCT_NAME', fallbackIdx: 17, patterns: [/^(nome do produto|product name|nome do an[úu]ncio|item name)$/i, /nome do produto|nome do an[úu]ncio|product name|item name/i] },
    { key: 'SKU', fallbackIdx: 18, patterns: [/^(n[úu]mero de refer[êe]ncia sku|sku reference|sku)$/i, /refer[êe]ncia sku/i], exclude: /principal|parent/i },
    { key: 'VARIATION', fallbackIdx: 19, patterns: [/^(nome da varia[çc][ãa]o|variation name|varia[çc][ãa]o|variation)$/i] },
    { key: 'QTY', fallbackIdx: 23, patterns: [/^(quantidade|quantity|qtd)$/i] },
    { key: 'SUBTOTAL', fallbackIdx: 24, patterns: [/^(subtotal do produto|product subtotal|subtotal)$/i] },
    { key: 'SELLER_DISCOUNT', fallbackIdx: 25, patterns: [/^desconto do vendedor$/i, /seller discount/i] },
    { key: 'ACTION_ADJ', fallbackIdx: 28, patterns: [/ajuste por participa[çc][ãa]o em a[çc][ãa]o comercial/i] },
    { key: 'SELLER_COUPON', fallbackIdx: 33, patterns: [/^cupom do vendedor$/i, /seller voucher/i] },
    { key: 'PIX_ADJ', fallbackIdx: 37, patterns: [/ajuste por pagamento via pix/i] },
    { key: 'COMMISSION_NET', fallbackIdx: 49, patterns: [/^(taxa de comiss[ãa]o l[íi]quida|comiss[ãa]o l[íi]quida|net commission)$/i, /comiss[ãa]o/i], exclude: /bruta|gross/i },
    { key: 'SERVICE_FEE_NET', fallbackIdx: 51, patterns: [/^(taxa de servi[çc]o l[íi]quida|servi[çc]o l[íi]quida|net service fee|net service)$/i, /taxa de servi[çc]o/i], exclude: /bruta|gross|comprador|buyer|instant/i },
    { key: 'SHIPPING_EST', fallbackIdx: 53, patterns: [/^(valor estimado do frete|estimado do frete|frete estimado|estimated shipping)$/i, /estimado do frete|frete estimado|estimated shipping/i] }
];

const MP_COLUMN_SPECS = [
    { key: 'DATE', fallbackIdx: 0, patterns: [/data da compra|\(date_created\)|^date_created$/i] },
    { key: 'RELEASE_DATE', fallbackIdx: 2, patterns: [/data de libera[çc][ãa]o|\(date_released\)|^date_released$/i] },
    { key: 'ITEM_ID', fallbackIdx: 8, patterns: [/c[óo]digo do produto|\(item_id\)|^item_id$/i] },
    { key: 'REASON', fallbackIdx: 9, patterns: [/descri[çc][ãa]o da opera[çc][ãa]o|\(reason\)|^reason$/i] },
    { key: 'EXT_REF', fallbackIdx: 10, patterns: [/c[óo]digo de refer[êe]ncia|\(external_reference\)/i] },
    { key: 'SKU', fallbackIdx: 11, patterns: [/sku do produto|\(seller_custom_field\)|^seller_custom_field$/i] },
    { key: 'OP_ID', fallbackIdx: 12, patterns: [/n[úu]mero da transa[çc][ãa]o|\(operation_id\)|^operation_id$/i] },
    { key: 'STATUS', fallbackIdx: 13, patterns: [/status da opera[çc][ãa]o|\(status\)|^status$/i] },
    { key: 'STATUS_DETAIL', fallbackIdx: 14, patterns: [/detalhe do status|\(status_detail\)|^status_detail$/i] },
    { key: 'GROSS', fallbackIdx: 16, patterns: [/valor do produto|\(transaction_amount\)|^transaction_amount$/i] },
    { key: 'MP_FEE', fallbackIdx: 17, patterns: [/tarifa do mercado pago|\(mercadopago_fee\)|^mercadopago_fee$/i] },
    { key: 'ML_FEE', fallbackIdx: 18, patterns: [/tarifa pelo uso da plataforma|\(marketplace_fee\)|^marketplace_fee$/i] },
    { key: 'SHIPPING', fallbackIdx: 19, patterns: [/^frete\b|\(shipping_cost\)|^shipping_cost$/i] },
    { key: 'COUPON_FEE', fallbackIdx: 20, patterns: [/desconto para a sua contraparte|\(coupon_fee\)|^coupon_fee$/i] },
    { key: 'NET', fallbackIdx: 21, patterns: [/valor total recebido|\(net_received_amount\)|^net_received_amount$/i] },
    { key: 'INSTALLMENTS', fallbackIdx: 22, patterns: [/^parcelas\b|\(installments\)|^installments$/i] },
    { key: 'PAYMENT_TYPE', fallbackIdx: 23, patterns: [/meio de pagamento|\(payment_type\)|^payment_type$/i] },
    { key: 'AMOUNT_REFUNDED', fallbackIdx: 24, patterns: [/valor devolvido|\(amount_refunded\)|^amount_refunded$/i] },
    { key: 'CLAIM_ID', fallbackIdx: 26, patterns: [/reclama[çc][ãa]o|\(claim_id\)|^claim_id$/i] },
    { key: 'CHARGEBACK_ID', fallbackIdx: 27, patterns: [/contesta[çc][ãa]o|\(chargeback_id\)|^chargeback_id$/i] },
    { key: 'ORDER_ID', fallbackIdx: 29, patterns: [/n[úu]mero da venda no mercado livre|\(order_id\)|^order_id$/i] },
    { key: 'FIN_FEE', fallbackIdx: 43, patterns: [/custos de parcelamento|\(financing_fee\)|^financing_fee$/i] },
    { key: 'REJECTION_CAUSES', fallbackIdx: 47, patterns: [/motivos de recusa|\(rejection_causes\)|^rejection_causes$/i] }
];

const ML_PERF_COLUMN_SPECS = [
    { key: 'AD_ID', fallbackIdx: 0, patterns: [/id do an[úu]ncio/i] },
    { key: 'TITLE', fallbackIdx: 1, patterns: [/^publica[çc][ãa]o$/i, /publica[çc][ãa]o|t[íi]tulo/i] },
    { key: 'STATUS', fallbackIdx: 2, patterns: [/^status atual$/i, /^status$/i] },
    { key: 'VARIATION', fallbackIdx: 3, patterns: [/^varia[çc][ãa]o$/i] },
    { key: 'SKU', fallbackIdx: 4, patterns: [/^sku$/i] },
    { key: 'VISITS', fallbackIdx: 5, patterns: [/visitas [úu]nicas|visitas/i] },
    { key: 'SALES_COUNT', fallbackIdx: 6, patterns: [/quantidade de vendas/i] },
    { key: 'BUYERS', fallbackIdx: 7, patterns: [/compradores [úu]nicos/i] },
    { key: 'UNITS_SOLD', fallbackIdx: 8, patterns: [/unidades vendidas/i] },
    { key: 'CONV_PCT', fallbackIdx: 11, patterns: [/convers[ãa]o de visitas em vendas/i] }
];

function detectColumnsBySpecs(headerRow, specs) {
    const map = {};
    specs.forEach(spec => { map[spec.key] = spec.fallbackIdx; });
    if (!headerRow || !Array.isArray(headerRow)) return map;

    const normalizedHeaders = headerRow.map(col => (col ? String(col).trim() : ''));
    specs.forEach(spec => {
        for (const pattern of spec.patterns) {
            const matchedIdx = normalizedHeaders.findIndex(name => {
                if (!name) return false;
                if (spec.exclude && spec.exclude.test(name)) return false;
                return pattern.test(name);
            });
            if (matchedIdx !== -1) {
                map[spec.key] = matchedIdx;
                break;
            }
        }
    });
    return map;
}

function detectSpreadsheetType(wb) {
    if (!wb.SheetNames || wb.SheetNames.length === 0) return { type: 'unknown' };

    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        const limit = Math.min(12, rows.length);

        for (let rIdx = 0; rIdx < limit; rIdx++) {
            const normCells = (rows[rIdx] || []).map(c => normalizeText(c));
            const rowStr = normCells.join(' | ');

            if (normCells.some(c => c.includes('id do anuncio')) &&
                normCells.some(c => c.includes('unidades vendidas')) &&
                !normCells.some(c => c === 'loja')) {
                return { type: 'mercadolivre_perf', ws, rows, headerRowIdx: rIdx };
            }
            if ((rowStr.includes('order_id') || rowStr.includes('numero da venda no mercado livre')) &&
                (rowStr.includes('transaction_amount') || rowStr.includes('valor do produto')) &&
                (rowStr.includes('net_received_amount') || rowStr.includes('valor total recebido'))) {
                return { type: 'mercadolivre_mp', ws, rows, headerRowIdx: rIdx };
            }
            if (normCells.some(c => c === 'id do pedido' || c === 'order id' || c.includes('id do pedido')) &&
                (rowStr.includes('subtotal') || rowStr.includes('comissao') || rowStr.includes('produto'))) {
                return { type: 'shopee', ws, rows, headerRowIdx: rIdx };
            }
        }
    }
    return { type: 'unknown' };
}

function hasPrimaryChannelData() {
    return Boolean(channelData.shopee || channelData.mercadolivre);
}

function hasCurrentWorkspacePrimaryData() {
    return Boolean(currentWorkspaceData.shopee || currentWorkspaceData.mercadolivre);
}

function syncCurrentWorkspaceInference() {
    backfillChannelDates(currentWorkspaceData.shopee);
    backfillChannelDates(currentWorkspaceData.mercadolivre);
    if (currentWorkspaceData.mercadolivre) {
        applyMLQuantityInference(
            currentWorkspaceData.mercadolivre,
            currentWorkspaceData.mlPerf?.hints || null
        );
    }
}

function buildChannelObjectFromPayload(payload, filename = '') {
    if (!payload) return null;
    if (payload.sourceType === 'mlPerf') {
        const rows = Array.isArray(payload.mlPerfRows) ? payload.mlPerfRows : [];
        const hints = buildMlPerfHintsFromRows(rows);
        let multiUnitAdsCount = 0;
        hints.forEach(h => {
            if (h.unidades > h.vendas) multiUnitAdsCount++;
        });
        return {
            hints,
            rows,
            multiUnitAdsCount,
            filename: filename || payload.relPath || '',
            periodText: payload.periodText || 'Período Atual'
        };
    }

    const orders = Array.isArray(payload.orders) ? payload.orders : [];
    const cancelledOrders = Array.isArray(payload.cancelledOrders) ? payload.cancelledOrders : [];
    const dates = orders.map(o => o.date).filter(Boolean);
    const ch = {
        orders,
        cancelledOrders,
        validOrdersSet: new Set(orders.map(o => o.orderId)),
        cancelledCount: payload.cancelledCount ?? cancelledOrders.length,
        dates,
        filename: filename || payload.relPath || '',
        periodText: payload.periodText || 'Período Atual',
        inferredMultiCount: 0,
        perfMatchedCount: 0,
        warnCount: 0
    };
    backfillChannelDates(ch);
    return ch;
}

function updateWorkspaceChromeUI() {
    document.querySelectorAll('.workspace-tab[data-workspace-tab]').forEach(btn => {
        const isActive = btn.dataset.workspaceTab === activeWorkspaceTab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const histBadge = document.getElementById('tab-badge-history');
    if (histBadge) {
        if (typeof dbBackendActive !== 'undefined' && dbBackendActive && availableMonthKeys.length > 0) {
            histBadge.textContent = `${availableMonthKeys.length} ${availableMonthKeys.length === 1 ? 'mês' : 'meses'}`;
            histBadge.classList.remove('neutral');
        } else if (historyFallbackData.shopee || historyFallbackData.mercadolivre) {
            histBadge.textContent = 'Ativo';
            histBadge.classList.remove('neutral');
        } else {
            histBadge.textContent = 'Vazio';
            histBadge.classList.add('neutral');
        }
    }

    const curBadge = document.getElementById('tab-badge-current');
    if (curBadge) {
        const shOrd = currentWorkspaceData.shopee?.validOrdersSet?.size || 0;
        const mlOrd = currentWorkspaceData.mercadolivre?.validOrdersSet?.size || 0;
        const totalOrd = shOrd + mlOrd;
        if (totalOrd > 0) {
            curBadge.textContent = `${totalOrd} ped.`;
            curBadge.classList.remove('neutral');
        } else if (currentWorkspaceData.mlPerf) {
            curBadge.textContent = 'ML Perf';
            curBadge.classList.remove('neutral');
        } else {
            curBadge.textContent = 'Aguardando';
            curBadge.classList.add('neutral');
        }
    }

    const histBar = document.getElementById('history-workspace-bar');
    const curBar = document.getElementById('current-workspace-bar');
    if (histBar) histBar.style.display = activeWorkspaceTab === 'history' ? '' : 'none';
    if (curBar) curBar.style.display = activeWorkspaceTab === 'current' ? '' : 'none';

    const curMeta = document.getElementById('current-draft-meta');
    const promoteBtn = document.getElementById('btn-promote-current');
    const clearCurBtn = document.getElementById('btn-clear-current');
    const hasAnyCur = Boolean(currentWorkspaceData.shopee || currentWorkspaceData.mercadolivre || currentWorkspaceData.mlPerf);
    if (promoteBtn) promoteBtn.style.display = hasCurrentWorkspacePrimaryData() ? '' : 'none';
    if (clearCurBtn) clearCurBtn.style.display = hasAnyCur ? '' : 'none';
    if (curMeta) {
        if (hasAnyCur) {
            const parts = [];
            if (currentWorkspaceData.shopee) parts.push(`Shopee (${currentWorkspaceData.shopee.validOrdersSet.size} ped.)`);
            if (currentWorkspaceData.mercadolivre) parts.push(`ML (${currentWorkspaceData.mercadolivre.validOrdersSet.size} ped.)`);
            if (currentWorkspaceData.mlPerf) parts.push(`Desemp. ML (${currentWorkspaceData.mlPerf.multiUnitAdsCount} combos)`);
            const dtStr = currentWorkspaceData.updatedAt
                ? ` · Atualizado ${new Date(currentWorkspaceData.updatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`
                : '';
            curMeta.textContent = `Parcial carregada: ${parts.join(' + ')}${dtStr}`;
        } else {
            curMeta.textContent = 'Importe os relatórios parciais desta semana (Shopee, Mercado Pago e Desempenho ML) para acompanhar o ritmo do mês.';
        }
    }

    const importLabel = document.getElementById('btn-import-label');
    if (importLabel) {
        importLabel.textContent = activeWorkspaceTab === 'current' ? 'Importar Semanal' : 'Importar p/ Banco';
    }

    const kicker = document.getElementById('period-context-kicker');
    if (kicker) {
        kicker.textContent = activeWorkspaceTab === 'current'
            ? '⚡ ACOMPANHAMENTO SEMANAL · ISOLADO DO BANCO HISTÓRICO'
            : '📅 RECORTE HISTÓRICO ANALISADO · BANCO SQLITE';
    }

    if (typeof isViewerMode !== 'undefined' && isViewerMode) {
        document.documentElement.classList.add('viewer-mode');
        document.body.classList.add('viewer-mode');
        const mainImportBtn = document.getElementById('btn-import');
        if (mainImportBtn) mainImportBtn.style.display = 'none';
        if (promoteBtn) promoteBtn.style.display = 'none';
        if (clearCurBtn) clearCurBtn.style.display = 'none';
        const clearHistBtn = document.getElementById('btn-clear-history');
        if (clearHistBtn) clearHistBtn.style.display = 'none';
        document.querySelectorAll('.upload-zone, .upload-card-wrapper, .import-history-row, .upload-box, .pill-btn, .link-btn').forEach(el => {
            el.style.display = 'none';
        });
        if (kicker) {
            kicker.textContent = activeWorkspaceTab === 'current'
                ? '⚡ ACOMPANHAMENTO DO MÊS ATUAL · VISUALIZADOR NUVEM 24H'
                : '📅 HISTÓRICO ANALISADO · VISUALIZADOR NUVEM 24H';
        }
    }
}

function switchSubTab(tab) {
    if (!['overview', 'products', 'sales', 'audit', 'financial'].includes(tab)) {
        tab = 'overview';
    }
    activeSubTab = tab;
    activeFocusView = tab === 'products' ? 'products' : (tab === 'audit' ? 'audit' : 'overview');
    applyFocusFilterToDOM();
    if (hasPrimaryChannelData()) {
        if (tab === 'products') {
            renderTable();
        }
        if (typeof renderCurrentPacePanel === 'function') {
            renderCurrentPacePanel();
        }
        if (typeof renderAnalyticsSection === 'function') {
            renderAnalyticsSection();
        }
    }
}

function setProductQuickFilter(filter) {
    if (!['all', 'A', 'B', 'C', 'low', 'uncosted'].includes(filter)) {
        filter = 'all';
    }
    activeProductQuickFilter = filter;
    document.querySelectorAll('.qfilter-pill[data-qfilter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.qfilter === filter);
    });
    if (hasPrimaryChannelData()) {
        renderTable();
    }
}

function openCostsInfoShortcut() {
    if (typeof openAllCostsModal === 'function') {
        openAllCostsModal();
    } else if (typeof openInfoModal === 'function') {
        openInfoModal();
    }
}

function updateSubnavSummary() {
    const labelEl = document.getElementById('subnav-channels-label');
    if (!labelEl) return;
    const parts = [];
    if (channelData.shopee) parts.push(`Shopee (${channelData.shopee.validOrdersSet.size})`);
    if (channelData.mercadolivre) parts.push(`ML (${channelData.mercadolivre.validOrdersSet.size})`);
    if (channelData.mlPerf) parts.push(`Perf (${channelData.mlPerf.multiUnitAdsCount})`);
    labelEl.textContent = parts.length > 0 ? parts.join(' · ') : 'Nenhuma carregada';
}

function applyFocusFilterToDOM() {
    document.querySelectorAll('.subnav-tab[data-subtab]').forEach(btn => {
        const isActive = btn.dataset.subtab === activeSubTab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('.qfilter-pill[data-qfilter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.qfilter === activeProductQuickFilter);
    });

    const visible = hasPrimaryChannelData();
    const overviewCockpit = document.getElementById('overview-cockpit');
    const analyticsSection = document.getElementById('analytics-section');
    const controls = document.getElementById('controls');
    const productsSection = document.getElementById('products-section');
    const pacePanel = document.getElementById('current-pace-panel');

    if (!visible) return;

    if (pacePanel) {
        const showPace = activeWorkspaceTab === 'current' && (activeSubTab === 'overview' || activeSubTab === 'sales');
        pacePanel.style.display = showPace ? '' : 'none';
    }
    if (overviewCockpit) {
        overviewCockpit.style.display = activeSubTab === 'overview' ? '' : 'none';
    }
    if (controls) {
        controls.style.display = activeSubTab === 'products' ? '' : 'none';
    }
    if (productsSection) {
        productsSection.style.display = activeSubTab === 'products' ? '' : 'none';
    }
    if (analyticsSection) {
        const showAnalytics = ['sales', 'audit', 'financial'].includes(activeSubTab);
        analyticsSection.style.display = showAnalytics ? '' : 'none';
    }
}

function setAnalyticsFocusView(focus) {
    const map = {
        all: 'overview',
        overview: 'overview',
        products: 'products',
        audit: 'audit',
        sales: 'sales',
        financial: 'financial'
    };
    switchSubTab(map[focus] || 'overview');
}

function triggerActiveWorkspaceImport() {
    const inputId = activeWorkspaceTab === 'current' ? 'current-file-input' : 'file-input';
    document.getElementById(inputId)?.click();
}

function switchWorkspaceTab(tab) {
    if (tab !== 'history' && tab !== 'current') return;
    if (activeWorkspaceTab === tab) {
        updateWorkspaceChromeUI();
        return;
    }
    activeWorkspaceTab = tab;

    if (tab === 'current') {
        syncCurrentWorkspaceInference();
        channelData.shopee = currentWorkspaceData.shopee;
        channelData.mercadolivre = currentWorkspaceData.mercadolivre;
        channelData.mlPerf = currentWorkspaceData.mlPerf;
        activeChannel = 'all';
        rebuildActiveOrders();
        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
        } else {
            setReportVisible(false);
        }
    } else {
        activeChannel = 'all';
        if (typeof dbBackendActive !== 'undefined' && dbBackendActive && dbFullDataset) {
            rebuildDbActiveView();
        } else {
            channelData.shopee = historyFallbackData.shopee;
            channelData.mercadolivre = historyFallbackData.mercadolivre;
            channelData.mlPerf = historyFallbackData.mlPerf;
            backfillChannelDates(channelData.shopee);
            backfillChannelDates(channelData.mercadolivre);
            if (channelData.mercadolivre) applyMLQuantityInference(channelData.mercadolivre);
            rebuildActiveOrders();
        }
        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
        } else {
            setReportVisible(false);
        }
    }
    updateWorkspaceChromeUI();
}

function setReportVisible(visible) {
    document.getElementById('empty-state').style.display = visible ? 'none' : '';
    document.getElementById('dashboard').style.display = visible ? '' : 'none';
    document.getElementById('controls').style.display = visible ? '' : 'none';
    document.getElementById('products-section').style.display = visible ? '' : 'none';
    document.getElementById('btn-pdf').style.display = visible ? '' : 'none';
    const xlsxBtn = document.getElementById('btn-xlsx');
    if (xlsxBtn) xlsxBtn.style.display = visible ? '' : 'none';

    if (!visible) {
        const emptyTitle = document.getElementById('empty-title');
        const emptySub = document.getElementById('empty-subtitle');
        const emptyPrimLabel = document.getElementById('empty-primary-btn-label');
        const emptySecBtn = document.getElementById('empty-secondary-btn');
        if (activeWorkspaceTab === 'current') {
            if (emptyTitle) emptyTitle.textContent = 'Acompanhe o mês atual sem alterar o banco histórico';
            if (emptySub) emptySub.textContent = 'Importe aqui as planilhas semanais (Shopee, Mercado Pago e Desempenho ML) para acompanhar ritmo diário e projeção de fechamento sem contaminar os meses anteriores.';
            if (emptyPrimLabel) emptyPrimLabel.textContent = 'Importar Planilha Semanal';
            if (emptySecBtn) emptySecBtn.style.display = 'none';
        } else {
            if (emptyTitle) emptyTitle.textContent = 'Importe planilhas de meses fechados para o Banco SQLite';
            if (emptySub) emptySub.textContent = 'Arraste arquivos .xlsx, .xls ou .csv aqui (Pedidos Shopee, Mercado Pago ou Desempenho ML) ou sincronize as pastas locais configuradas.';
            if (emptyPrimLabel) emptyPrimLabel.textContent = 'Importar p/ Banco SQLite';
            if (emptySecBtn) emptySecBtn.style.display = '';
        }
    }

    const pacePanel = document.getElementById('current-pace-panel');
    if (pacePanel) {
        if (visible && activeWorkspaceTab === 'current') {
            pacePanel.style.display = '';
            if (typeof renderCurrentPacePanel === 'function') renderCurrentPacePanel();
        } else {
            pacePanel.style.display = 'none';
            pacePanel.innerHTML = '';
        }
    }

    if (visible) applyFocusFilterToDOM();

    const analyticsSection = document.getElementById('analytics-section');
    if (!visible && analyticsSection) {
        analyticsSection.style.display = 'none';
    }
    if (typeof renderAnalyticsSection === 'function') renderAnalyticsSection();

    updateWorkspaceChromeUI();
}

function backfillChannelDates(ch) {
    if (!ch) return;
    (ch.orders || []).forEach(o => { if (!o.isoDate && o.date) o.isoDate = extractISODate(o.date); });
    (ch.cancelledOrders || []).forEach(o => { if (!o.isoDate && o.date) o.isoDate = extractISODate(o.date); });
}

function updateDbStatusPill(text, tone = '') {
    const el = document.getElementById('db-status-pill');
    if (!el) return;
    el.textContent = text;
    el.className = `db-status-pill${tone ? ' ' + tone : ''}`;
}

function applyBootstrapState(bootstrap) {
    if (!bootstrap || typeof bootstrap !== 'object') return;
    const { settings = {}, customCosts: dbCosts, customSkuRules: dbRules, mlQtyOverrides: dbOverrides, snapshots } = bootstrap;

    if (dbCosts && typeof dbCosts === 'object' && Object.keys(dbCosts).length > 0) {
        customCosts = dbCosts;
        try { localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(customCosts)); } catch {}
    } else if (Object.keys(customCosts).length > 0 && typeof dbSaveCustomCosts === 'function') {
        dbSaveCustomCosts(customCosts, true);
    }

    if (Array.isArray(dbRules) && dbRules.length > 0) {
        customSkuRules = dbRules;
        saveCustomSkuRules();
        renderCustomSkuRulesBar();
    } else if (customSkuRules.length > 0 && typeof dbUpsertSkuRule === 'function') {
        customSkuRules.forEach(r => dbUpsertSkuRule(r));
    }

    if (dbOverrides && typeof dbOverrides === 'object' && Object.keys(dbOverrides).length > 0) {
        mlQtyOverrides = dbOverrides;
        saveMLQtyOverrides();
    } else if (Object.keys(mlQtyOverrides).length > 0 && typeof dbSaveMlQtyOverride === 'function') {
        Object.entries(mlQtyOverrides).forEach(([oid, q]) => dbSaveMlQtyOverride(oid, q));
    }

    if (settings.taxRate !== undefined) {
        const taxInput = document.getElementById('tax-rate');
        const t = parseNumberField(settings.taxRate, DEFAULT_TAX_RATE, 0, 100);
        if (taxInput) taxInput.value = t;
        try { localStorage.setItem(STORAGE_KEYS.TAX_RATE, String(t)); } catch {}
    }
    const savedMargin = settings.targetMargin ?? settings.targetMarginPct;
    if (savedMargin !== undefined) {
        targetMarginPct = parseNumberField(savedMargin, DEFAULT_TARGET_MARGIN, 0, 80);
        const marginInput = document.getElementById('target-margin-input');
        if (marginInput) marginInput.value = targetMarginPct;
        try { localStorage.setItem(STORAGE_KEYS.TARGET_MARGIN, String(targetMarginPct)); } catch {}
    }
    if (settings.extraExpenses && typeof settings.extraExpenses === 'object') {
        extraExpenses = {
            packagingPerUnit: parseNumberField(settings.extraExpenses.packagingPerUnit, 0, 0),
            adsShopee: parseNumberField(settings.extraExpenses.adsShopee, 0, 0),
            adsML: parseNumberField(settings.extraExpenses.adsML, 0, 0)
        };
        try { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(extraExpenses)); } catch {}
        syncExpensesInputsUI();
    }
    if (settings.groupingMode === 'model' || settings.groupingMode === 'listing') {
        groupingMode = settings.groupingMode;
        const gSel = document.getElementById('group-mode');
        if (gSel) gSel.value = groupingMode;
        try { localStorage.setItem(STORAGE_KEYS.GROUP_MODE, groupingMode); } catch {}
    }
    if (settings.dbSyncPaused !== undefined) {
        dbSyncPaused = Boolean(settings.dbSyncPaused);
    }
    if (settings.monthSelection && typeof settings.monthSelection === 'object') {
        monthSelection = {
            mode: ['all', 'single', 'range'].includes(settings.monthSelection.mode) ? settings.monthSelection.mode : 'all',
            single: String(settings.monthSelection.single || ''),
            from: String(settings.monthSelection.from || ''),
            to: String(settings.monthSelection.to || '')
        };
    }
    if (Array.isArray(snapshots)) {
        latestBaselineSnapshot = snapshots[0] || null;
    }
    if (bootstrap.currentMonthDraft && typeof hydrateCurrentMonthDraft === 'function') {
        currentWorkspaceData = hydrateCurrentMonthDraft(bootstrap.currentMonthDraft);
        syncCurrentWorkspaceInference();
    }
    updateWorkspaceChromeUI();
}

function populateMonthSelectors() {
    const wrap = document.getElementById('month-filter-wrap');
    const modeSel = document.getElementById('month-mode-select');
    const singleSel = document.getElementById('month-single-select');
    const rangeWrap = document.getElementById('month-range-wrap');
    const fromSel = document.getElementById('month-from-select');
    const toSel = document.getElementById('month-to-select');
    if (!wrap || !modeSel || !singleSel || !rangeWrap || !fromSel || !toSel) return;

    if (!availableMonthKeys || availableMonthKeys.length === 0) {
        wrap.style.display = 'none';
        return;
    }

    wrap.style.display = 'flex';
    const optionsHtml = availableMonthKeys
        .map(mk => `<option value="${escapeHtml(mk)}">${escapeHtml(formatMonthKeyPt(mk))}</option>`)
        .join('');

    singleSel.innerHTML = optionsHtml;
    fromSel.innerHTML = optionsHtml;
    toSel.innerHTML = optionsHtml;

    const firstMk = availableMonthKeys[0];
    const lastMk = availableMonthKeys[availableMonthKeys.length - 1];
    if (!availableMonthKeys.includes(monthSelection.single)) monthSelection.single = lastMk;
    if (!availableMonthKeys.includes(monthSelection.from)) monthSelection.from = firstMk;
    if (!availableMonthKeys.includes(monthSelection.to)) monthSelection.to = lastMk;
    if (monthSelection.from > monthSelection.to) {
        [monthSelection.from, monthSelection.to] = [monthSelection.to, monthSelection.from];
    }

    modeSel.value = monthSelection.mode;
    singleSel.value = monthSelection.single;
    fromSel.value = monthSelection.from;
    toSel.value = monthSelection.to;

    singleSel.style.display = monthSelection.mode === 'single' ? '' : 'none';
    rangeWrap.style.display = monthSelection.mode === 'range' ? 'inline-flex' : 'none';
}

function getMonthSelectionLabel() {
    if (!availableMonthKeys || availableMonthKeys.length === 0) return 'Sem períodos';
    if (monthSelection.mode === 'single' && monthSelection.single) {
        return formatMonthKeyPt(monthSelection.single);
    }
    if (monthSelection.mode === 'range') {
        const fromLabel = formatMonthKeyPt(monthSelection.from || availableMonthKeys[0]);
        const toLabel = formatMonthKeyPt(monthSelection.to || availableMonthKeys[availableMonthKeys.length - 1]);
        return fromLabel === toLabel ? fromLabel : `${fromLabel} a ${toLabel}`;
    }
    if (availableMonthKeys.length === 1) return formatMonthKeyPt(availableMonthKeys[0]);
    return `${formatMonthKeyPt(availableMonthKeys[0])} a ${formatMonthKeyPt(availableMonthKeys[availableMonthKeys.length - 1])}`;
}

function setMonthSelection(mode, single = '', from = '', to = '') {
    if (activeWorkspaceTab !== 'history') {
        activeWorkspaceTab = 'history';
    }
    if (!['all', 'single', 'range'].includes(mode)) mode = 'all';
    monthSelection.mode = mode;
    if (single && availableMonthKeys.includes(single)) monthSelection.single = single;
    if (from && availableMonthKeys.includes(from)) monthSelection.from = from;
    if (to && availableMonthKeys.includes(to)) monthSelection.to = to;
    if (monthSelection.from && monthSelection.to && monthSelection.from > monthSelection.to) {
        [monthSelection.from, monthSelection.to] = [monthSelection.to, monthSelection.from];
    }

    populateMonthSelectors();
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveSettings === 'function') {
        dbSaveSettings({ monthSelection });
    }
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && dbFullDataset) {
        rebuildDbActiveView();
        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
        }
    }
}

function onMonthModeChange() {
    const mode = document.getElementById('month-mode-select')?.value || 'all';
    setMonthSelection(mode, monthSelection.single, monthSelection.from, monthSelection.to);
}

function onMonthValueChange() {
    const mode = document.getElementById('month-mode-select')?.value || monthSelection.mode;
    const single = document.getElementById('month-single-select')?.value || monthSelection.single;
    const from = document.getElementById('month-from-select')?.value || monthSelection.from;
    const to = document.getElementById('month-to-select')?.value || monthSelection.to;
    setMonthSelection(mode, single, from, to);
}

function buildMlPerfHintsFromRows(rows) {
    const hints = new Map();
    (rows || []).forEach(r => {
        if (!r.itemId) return;
        if (!hints.has(r.itemId)) {
            hints.set(r.itemId, { itemId: r.itemId, vendas: 0, unidades: 0, title: r.title || '' });
        }
        const entry = hints.get(r.itemId);
        entry.vendas += Number(r.sales) || 0;
        entry.unidades += Number(r.units) || 0;
        if (!entry.title && r.title) entry.title = r.title;
    });
    return hints;
}

function applyMLQuantityInferenceByMonth(mlOrders, mlPerfRows) {
    const perfByMonth = new Map();
    (mlPerfRows || []).forEach(r => {
        const mk = r.monthKey || 'undated';
        if (!perfByMonth.has(mk)) perfByMonth.set(mk, []);
        perfByMonth.get(mk).push(r);
    });

    const ordersByMonth = new Map();
    (mlOrders || []).forEach(o => {
        const mk = o.monthKey || (o.isoDate ? o.isoDate.slice(0, 7) : 'undated');
        if (!ordersByMonth.has(mk)) ordersByMonth.set(mk, []);
        ordersByMonth.get(mk).push(o);
    });

    for (const [mk, list] of ordersByMonth.entries()) {
        const hints = perfByMonth.has(mk) ? buildMlPerfHintsFromRows(perfByMonth.get(mk)) : null;
        applyMLQuantityInference({ orders: list }, hints);
    }
}

function aggregateMlPerfRowsForSelection(perfRows) {
    const grouped = new Map();
    (perfRows || []).forEach(r => {
        const key = `${r.itemId}||${r.variation || ''}`;
        if (!grouped.has(key)) {
            grouped.set(key, {
                itemId: r.itemId,
                title: r.title || '',
                status: r.status || '',
                variation: r.variation || '',
                sku: r.sku || '',
                visits: 0,
                sales: 0,
                buyers: 0,
                units: 0,
                convPct: 0
            });
        }
        const g = grouped.get(key);
        g.visits += Number(r.visits) || 0;
        g.sales += Number(r.sales) || 0;
        g.buyers += Number(r.buyers) || 0;
        g.units += Number(r.units) || 0;
        if (!g.title && r.title) g.title = r.title;
        if (!g.sku && r.sku) g.sku = r.sku;
    });

    const rows = [...grouped.values()].map(g => ({
        ...g,
        convPct: g.visits > 0 ? (g.sales / g.visits) * 100 : 0
    }));
    const hints = buildMlPerfHintsFromRows(rows);
    let multiUnitAdsCount = 0;
    hints.forEach(h => { if (h.unidades > h.vendas) multiUnitAdsCount++; });
    return { rows, hints, multiUnitAdsCount };
}

function matchesMonthSelection(monthKey) {
    const mk = String(monthKey || 'undated');
    if (monthSelection.mode === 'single' && monthSelection.single) {
        return mk === monthSelection.single;
    }
    if (monthSelection.mode === 'range') {
        if (monthSelection.from && mk < monthSelection.from) return false;
        if (monthSelection.to && mk > monthSelection.to) return false;
    }
    return true;
}

function rebuildDbActiveView() {
    if (!dbFullDataset) return;
    applyMLQuantityInferenceByMonth(
        dbFullDataset.orders.filter(o => o.channel === 'mercadolivre'),
        dbFullDataset.mlPerfRows
    );

    const periodText = getMonthSelectionLabel();
    const shOrders = dbFullDataset.orders.filter(o => o.channel === 'shopee' && matchesMonthSelection(o.monthKey));
    const shCancelled = (dbFullDataset.cancelledOrders || []).filter(c => c.channel === 'shopee' && matchesMonthSelection(c.monthKey));
    const mlOrders = dbFullDataset.orders.filter(o => o.channel === 'mercadolivre' && matchesMonthSelection(o.monthKey));
    const mlCancelled = (dbFullDataset.cancelledOrders || []).filter(c => c.channel === 'mercadolivre' && matchesMonthSelection(c.monthKey));
    const perfRows = (dbFullDataset.mlPerfRows || []).filter(r => matchesMonthSelection(r.monthKey));

    channelData.shopee = (shOrders.length > 0 || shCancelled.length > 0)
        ? {
            orders: shOrders,
            cancelledOrders: shCancelled,
            validOrdersSet: new Set(shOrders.map(o => o.orderId)),
            cancelledCount: shCancelled.length,
            periodText
        }
        : null;

    if (mlOrders.length > 0 || mlCancelled.length > 0) {
        let inferredMultiCount = 0;
        let perfMatchedCount = 0;
        let warnCount = 0;
        mlOrders.forEach(o => {
            if (o.qtySource === 'auto') inferredMultiCount++;
            else if (o.qtySource === 'perf') perfMatchedCount++;
            if (o.needsQtyCheck) warnCount++;
        });
        channelData.mercadolivre = {
            orders: mlOrders,
            cancelledOrders: mlCancelled,
            validOrdersSet: new Set(mlOrders.map(o => o.orderId)),
            cancelledCount: mlCancelled.length,
            periodText,
            inferredMultiCount,
            perfMatchedCount,
            warnCount
        };
    } else {
        channelData.mercadolivre = null;
    }

    if (perfRows.length > 0) {
        const perfAgg = aggregateMlPerfRowsForSelection(perfRows);
        channelData.mlPerf = {
            hints: perfAgg.hints,
            rows: perfAgg.rows,
            multiUnitAdsCount: perfAgg.multiUnitAdsCount,
            periodText
        };
    } else {
        channelData.mlPerf = null;
    }

    rebuildActiveOrders();
}

function refreshDbStatusPillFromState(uniqueOrders = 0) {
    if (typeof isViewerMode !== 'undefined' && isViewerMode) {
        updateDbStatusPill(`☁️ Nuvem 24h · ${availableMonthKeys.length}m (${uniqueOrders} ped.)`, 'ok');
        return;
    }
    if (!dbBackendActive) {
        updateDbStatusPill('💾 IndexedDB Local', 'fallback');
        return;
    }
    const total = Number(latestSourcesStatus?.totalLocalFiles) || 0;
    const pending = Number(latestSourcesStatus?.pendingCount) || 0;
    const synced = Math.max(0, total - pending);
    if (total > 0) {
        if (pending === 0) {
            updateDbStatusPill(`🗄️ SQLite · ${synced}/${total} pastas · ${availableMonthKeys.length}m`, 'ok');
        } else {
            updateDbStatusPill(`⚠️ SQLite · ${synced}/${total} (${pending} pend.)`, 'warn');
        }
        return;
    }
    updateDbStatusPill(
        availableMonthKeys.length > 0
            ? `🗄️ SQLite · ${availableMonthKeys.length} ${availableMonthKeys.length === 1 ? 'mês' : 'meses'} · ${uniqueOrders} ped.`
            : '🗄️ SQLite · Vazio',
        availableMonthKeys.length > 0 ? 'ok' : ''
    );
}

async function reloadDatasetFromDb(options = {}) {
    if (typeof dbFetchDataset !== 'function') return;
    const ds = await dbFetchDataset();
    dbFullDataset = ds;

    const derivedMonths = new Set(ds.availableMonths || []);
    (ds.orders || []).forEach(o => { if (/^\d{4}-\d{2}$/.test(o.monthKey)) derivedMonths.add(o.monthKey); });
    availableMonthKeys = [...derivedMonths].filter(m => /^\d{4}-\d{2}$/.test(m)).sort();

    if (typeof dbFetchSourcesStatus === 'function') {
        try {
            latestSourcesStatus = await dbFetchSourcesStatus();
        } catch {}
    }

    refreshAllChannelsModels();
    populateMonthSelectors();
    if (activeWorkspaceTab === 'history') {
        rebuildDbActiveView();
    }

    const uniqueOrders = new Set((ds.orders || []).map(o => `${o.channel}:${o.orderId}`)).size;
    refreshDbStatusPillFromState(uniqueOrders);

    if (activeWorkspaceTab === 'history') {
        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
            if (options.toastSummary) {
                showToast(`Banco SQLite atualizado (${availableMonthKeys.length} meses · ${uniqueOrders} pedidos).`, 'success');
            }
        } else {
            setReportVisible(false);
        }
    } else {
        updateWorkspaceChromeUI();
        if (options.toastSummary) {
            showToast(`Banco SQLite atualizado (${availableMonthKeys.length} meses · ${uniqueOrders} pedidos).`, 'success');
        }
    }
}

async function syncPendingLocalFiles(pendingFiles, options = {}) {
    if (!Array.isArray(pendingFiles) || pendingFiles.length === 0) return 0;
    let imported = 0;
    for (let i = 0; i < pendingFiles.length; i++) {
        const f = pendingFiles[i];
        updateDbStatusPill(`⏳ Importando ${i + 1}/${pendingFiles.length}...`, 'syncing');
        const buf = await dbFetchLocalSourceBuffer(f.relPath);
        const payload = processWorkbook(buf, f.fileName || f.relPath, {
            silent: true,
            returnPayloadOnly: true,
            relPath: f.relPath,
            fileSize: f.fileSize,
            mtimeMs: f.mtimeMs
        });
        if (payload) {
            await dbSyncIngestFile(payload);
            imported++;
        }
    }
    return imported;
}

async function syncLocalFoldersAction(options = {}) {
    if (!dbBackendActive) {
        loadExampleSpreadsheets();
        return;
    }
    showLoading(true);
    try {
        dbSyncPaused = false;
        await dbSaveSettings({ dbSyncPaused: false });
        const status = await dbFetchSourcesStatus();
        latestSourcesStatus = status;
        const targets = options.force ? (status.files || []) : (status.pendingFiles || []);
        if (targets.length === 0) {
            await reloadDatasetFromDb();
            const synced = Math.max(0, (status.totalLocalFiles || 0) - (status.pendingCount || 0));
            showToast(`Todas as ${status.totalLocalFiles || 0} planilhas das 3 pastas já estão no SQLite (${synced}/${status.totalLocalFiles || 0})!`, 'success');
            return;
        }
        const imported = await syncPendingLocalFiles(targets, { silent: true });
        await reloadDatasetFromDb({ toastSummary: imported > 0 });
    } catch (err) {
        console.error('Erro ao sincronizar pastas:', err);
        showToast('Falha ao sincronizar pastas locais: ' + err.message, 'error');
        updateDbStatusPill('⚠️ Erro SQLite', 'fallback');
    } finally {
        showLoading(false);
    }
}

async function loadInitialChannels() {
    dbBackendActive = typeof initPersistenceBackend === 'function' ? await initPersistenceBackend() : false;

    if (dbBackendActive) {
        showLoading(true);
        if (typeof isViewerMode !== 'undefined' && isViewerMode) {
            updateDbStatusPill('☁️ Carregando Nuvem 24h...', 'syncing');
            const syncBtn = document.getElementById('btn-sync-folders');
            if (syncBtn) syncBtn.style.display = 'none';
            const dlBtn = document.getElementById('btn-download-db');
            if (dlBtn) dlBtn.style.display = 'none';
            const pubBtn = document.getElementById('btn-publish-cloud');
            if (pubBtn) pubBtn.style.display = 'none';
            const pubBtnModal = document.getElementById('btn-modal-publish-cloud');
            if (pubBtnModal) pubBtnModal.style.display = 'none';
        } else {
            updateDbStatusPill('⏳ Conectando SQLite...', 'syncing');
            const dlBtn = document.getElementById('btn-download-db');
            if (dlBtn) dlBtn.style.display = '';
            const pubBtn = document.getElementById('btn-publish-cloud');
            if (pubBtn) pubBtn.style.display = '';
            const pubBtnModal = document.getElementById('btn-modal-publish-cloud');
            if (pubBtnModal) pubBtnModal.style.display = '';
        }
        try {
            const bootstrap = await dbFetchBootstrap();
            applyBootstrapState(bootstrap);
            const status = await dbFetchSourcesStatus();
            latestSourcesStatus = status;
            if (!isViewerMode && !dbSyncPaused && status?.pendingCount > 0) {
                const imported = await syncPendingLocalFiles(status.pendingFiles, { silent: true });
                await reloadDatasetFromDb({ toastSummary: imported > 0 });
            } else {
                await reloadDatasetFromDb();
                if (!hasPrimaryChannelData()) {
                    showToast(isViewerMode ? 'Nenhum dado publicado no momento.' : 'Clique em Sincronizar (↻) ou importe planilhas para iniciar.', 'info');
                }
            }
            return;
        } catch (err) {
            console.warn('Falha no carregamento dos dados, alternando para IndexedDB:', err);
            dbBackendActive = false;
        } finally {
            showLoading(false);
        }
    }

    updateDbStatusPill('💾 IndexedDB Local', 'fallback');
    await refreshBaselineSnapshotCache();
    if (typeof dbFetchCurrentMonthDraft === 'function') {
        try {
            currentWorkspaceData = await dbFetchCurrentMonthDraft();
            syncCurrentWorkspaceInference();
        } catch {}
    }
    if (typeof idbLoadAllChannels === 'function') {
        showLoading(true);
        try {
            const stored = await idbLoadAllChannels();
            if (stored && (stored.shopee || stored.mercadolivre)) {
                historyFallbackData.shopee = stored.shopee || null;
                historyFallbackData.mercadolivre = stored.mercadolivre || null;
                historyFallbackData.mlPerf = stored.mlPerf || null;
                channelData.shopee = historyFallbackData.shopee;
                channelData.mercadolivre = historyFallbackData.mercadolivre;
                channelData.mlPerf = historyFallbackData.mlPerf;
                backfillChannelDates(channelData.shopee);
                backfillChannelDates(channelData.mercadolivre);
                refreshAllChannelsModels();
                if (channelData.mercadolivre) applyMLQuantityInference(channelData.mercadolivre);
                rebuildActiveOrders();
                if (hasPrimaryChannelData()) {
                    recalcAll();
                    setReportVisible(true);
                    showLoading(false);
                    return;
                }
            }
        } catch (err) {
            console.warn('Falha ao restaurar dados do IndexedDB:', err);
        }
    }
    updateWorkspaceChromeUI();

    let initialized = false;
    try { initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED) === '1'; } catch {}
    if (!initialized) {
        await loadDefaultSpreadsheets();
    } else {
        setReportVisible(false);
        showLoading(false);
    }
}

function loadExampleSpreadsheets() {
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive) {
        syncLocalFoldersAction({ force: true });
        return;
    }
    loadDefaultSpreadsheets();
}

// ===== LEITURA E PROCESSAMENTO DAS PLANILHAS =====
async function loadDefaultSpreadsheets() {
    showLoading(true);
    try {
        const results = await Promise.allSettled(
            DEFAULT_SPREADSHEETS.map(async (filename) => {
                const resp = await fetch(filename);
                if (!resp.ok) throw new Error(`Arquivo ${filename} não encontrado`);
                const data = await resp.arrayBuffer();
                return { filename, data };
            })
        );

        let loadedCount = 0;
        results.forEach(res => {
            if (res.status === 'fulfilled') {
                const ok = processWorkbook(res.value.data, res.value.filename, { silent: true });
                if (ok) loadedCount++;
            }
        });

        try {
            if (loadedCount > 0) localStorage.setItem(STORAGE_KEYS.INITIALIZED, '1');
        } catch {}

        rebuildActiveOrders();
        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
            showToast(`Planilhas carregadas! (${loadedCount} fontes · ${currentPeriodText})`, 'success');
        } else {
            setReportVisible(false);
            showToast('Importe as planilhas da Shopee e/ou Mercado Pago para iniciar.', 'info');
        }
    } catch (e) {
        console.warn('Falha no carregamento automático:', e);
        setReportVisible(false);
    } finally {
        showLoading(false);
    }
}

function handleFileImport(event, targetTab = null) {
    const files = event.target.files;
    const dest = targetTab || activeWorkspaceTab;
    if (files && files.length > 0) {
        if (dest === 'current') {
            importCurrentMonthFiles(files);
        } else {
            importSpreadsheetFiles(files);
        }
    }
    event.target.value = '';
}

async function importCurrentMonthFiles(fileList) {
    const files = Array.from(fileList || []).filter(f => /\.(xlsx|xls|csv)$/i.test(f.name));
    if (files.length === 0) {
        showToast('Formato inválido. Selecione arquivos .xlsx, .xls ou .csv.', 'error');
        return;
    }

    activeWorkspaceTab = 'current';
    showLoading(true);
    let importedCount = 0;
    const loadedLabels = [];

    try {
        for (const file of files) {
            const buf = await file.arrayBuffer();
            const payload = processWorkbook(buf, file.name, {
                silent: true,
                returnPayloadOnly: true,
                relPath: `current/${file.name}`,
                fileSize: file.size || 0,
                mtimeMs: file.lastModified || Date.now()
            });
            if (!payload || !payload.sourceType) continue;

            const chObj = buildChannelObjectFromPayload(payload, file.name);
            if (!chObj) continue;

            if (payload.sourceType === 'shopee') {
                currentWorkspaceData.shopee = chObj;
                loadedLabels.push(`Shopee (${chObj.validOrdersSet.size} ped.)`);
                importedCount++;
            } else if (payload.sourceType === 'mercadolivre') {
                currentWorkspaceData.mercadolivre = chObj;
                loadedLabels.push(`Mercado Livre (${chObj.validOrdersSet.size} ped.)`);
                importedCount++;
            } else if (payload.sourceType === 'mlPerf') {
                currentWorkspaceData.mlPerf = chObj;
                loadedLabels.push(`Desempenho ML (${chObj.multiUnitAdsCount} combos)`);
                importedCount++;
            }
        }

        if (importedCount === 0) {
            showToast('Nenhuma planilha reconhecida foi importada para o mês atual.', 'warn');
            updateWorkspaceChromeUI();
            return;
        }

        currentWorkspaceData.updatedAt = Date.now();
        syncCurrentWorkspaceInference();
        if (typeof dbSaveCurrentMonthDraft === 'function') {
            await dbSaveCurrentMonthDraft(currentWorkspaceData);
        }

        channelData.shopee = currentWorkspaceData.shopee;
        channelData.mercadolivre = currentWorkspaceData.mercadolivre;
        channelData.mlPerf = currentWorkspaceData.mlPerf;
        activeChannel = 'all';
        rebuildActiveOrders();

        if (hasPrimaryChannelData()) {
            recalcAll();
            setReportVisible(true);
            showToast(`Parcial semanal atualizada: ${loadedLabels.join(' · ')} (histórico SQLite preservado).`, 'success');
        } else {
            setReportVisible(false);
            showToast(`Desempenho ML carregado na aba Mês Atual. Agora importe Shopee e/ou Mercado Pago.`, 'info');
        }
    } catch (err) {
        console.error('Erro ao importar planilha semanal:', err);
        showToast(`Erro ao processar parcial semanal: ${err.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function importSpreadsheetFiles(fileList) {
    const files = Array.from(fileList || []).filter(f => /\.(xlsx|xls|csv)$/i.test(f.name));
    if (files.length === 0) {
        showToast('Formato inválido. Selecione arquivos .xlsx, .xls ou .csv.', 'error');
        return;
    }
    activeWorkspaceTab = 'history';

    if (typeof dbBackendActive !== 'undefined' && dbBackendActive) {
        showLoading(true);
        let importedCount = 0;
        let lastMonth = '';
        try {
            dbSyncPaused = false;
            await dbSaveSettings({ dbSyncPaused: false });
            for (const file of files) {
                const buf = await file.arrayBuffer();
                const payload = processWorkbook(buf, file.name, {
                    returnPayloadOnly: true,
                    relPath: `upload/${file.name}`,
                    fileSize: file.size || 0,
                    mtimeMs: file.lastModified || Date.now()
                });
                if (payload) {
                    await dbSyncIngestFile(payload);
                    importedCount++;
                    if (payload.monthKey && /^\d{4}-\d{2}$/.test(payload.monthKey)) {
                        lastMonth = payload.monthKey;
                    }
                }
            }
            if (importedCount > 0) {
                if (lastMonth && monthSelection.mode === 'single') {
                    monthSelection.single = lastMonth;
                    await dbSaveSettings({ monthSelection });
                }
                await reloadDatasetFromDb({ toastSummary: true });
            } else {
                showToast('Nenhuma planilha reconhecida foi importada.', 'warn');
            }
        } catch (err) {
            console.error('Erro ao gravar planilhas no SQLite:', err);
            showToast(`Erro ao importar para SQLite: ${err.message}`, 'error');
        } finally {
            showLoading(false);
        }
        return;
    }

    showLoading(true);
    let pending = files.length;
    const finishOne = () => {
        pending--;
        if (pending <= 0) {
            if (!hasPrimaryChannelData()) setReportVisible(false);
            showLoading(false);
        }
    };

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                processWorkbook(e.target.result, file.name);
            } catch (err) {
                console.error('Erro ao processar planilha:', err);
                showToast(`Erro ao importar ${file.name}: ${err.message}`, 'error');
            } finally {
                finishOne();
            }
        };
        reader.onerror = () => {
            showToast(`Falha na leitura do arquivo ${file.name}.`, 'error');
            finishOne();
        };
        reader.readAsArrayBuffer(file);
    });
}

function isCancelledOrReturned(status, returnStatus) {
    const st = String(status || '').toLowerCase().trim();
    const ret = String(returnStatus || '').toLowerCase().trim();
    if (st === 'cancelado' || st === 'cancelled' || st === 'canceled') return true;
    return /aprovada|reembolso|devolvido|approved|refund/.test(ret);
}

function formatCellDate(rawVal) {
    if (rawVal === null || rawVal === undefined || rawVal === '') return '';
    if (typeof rawVal === 'number' || /^\d{5}(\.\d+)?$/.test(String(rawVal).trim())) {
        const serial = Number(rawVal);
        if (Number.isFinite(serial) && serial > 20000 && typeof XLSX !== 'undefined' && XLSX.SSF?.parse_date_code) {
            const p = XLSX.SSF.parse_date_code(serial);
            if (p && p.y && p.m && p.d) {
                const pad = n => String(n).padStart(2, '0');
                return `${p.y}-${pad(p.m)}-${pad(p.d)} ${pad(p.H || 0)}:${pad(p.M || 0)}`;
            }
        }
    }
    return String(rawVal).trim();
}

function processWorkbook(data, filename = '', options = {}) {
    const wb = XLSX.read(data, { type: 'array' });
    const detected = detectSpreadsheetType(wb);

    if (detected.type === 'shopee') {
        return parseShopeeWorkbook(detected.rows, detected.headerRowIdx, filename, options);
    }
    if (detected.type === 'mercadolivre_mp') {
        return parseMercadoPagoWorkbook(detected.rows, detected.headerRowIdx, filename, options);
    }
    if (detected.type === 'mercadolivre_perf') {
        return parseMLPerfWorkbook(detected.rows, detected.headerRowIdx, filename, options);
    }

    if (!options.silent) {
        showToast(`Formato de planilha não reconhecido em "${filename}". Use pedidos Shopee, recebimentos Mercado Pago ou Desempenho ML.`, 'error');
    }
    return false;
}

function parseShopeeWorkbook(rows, headerRowIdx, filename, options = {}) {
    const colMap = detectColumnsBySpecs(rows[headerRowIdx], SHOPEE_COLUMN_SPECS);
    const ordersMap = {};
    const cancelledOrdersSet = new Set();
    const cancelledDetailsMap = new Map();
    const validSet = new Set();
    const datesList = [];

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const orderId = String(row[colMap.ORDER_ID] || '').trim();
        if (!orderId) continue;

        const date = formatCellDate(row[colMap.ORDER_DATE]);
        const isoDate = extractISODate(date);
        const productName = String(row[colMap.PRODUCT_NAME] || '').trim();
        const sku = String(row[colMap.SKU] || row[colMap.PARENT_SKU] || '').trim();
        const subtotal = parseNum(row[colMap.SUBTOTAL]);

        if (isCancelledOrReturned(row[colMap.STATUS], row[colMap.RETURN_STATUS])) {
            cancelledOrdersSet.add(orderId);
            const statusText = String(row[colMap.STATUS] || '').trim() || 'Cancelado';
            const reasonText = String(row[colMap.CANCEL_REASON] || row[colMap.RETURN_STATUS] || statusText).trim();
            if (!cancelledDetailsMap.has(orderId)) {
                cancelledDetailsMap.set(orderId, {
                    channel: 'shopee',
                    orderId,
                    date,
                    isoDate,
                    productName: productName || 'Pedido Shopee cancelado',
                    sku,
                    status: statusText,
                    reason: reasonText,
                    amount: subtotal
                });
            } else {
                cancelledDetailsMap.get(orderId).amount += subtotal;
            }
            continue;
        }

        if (!productName) continue;

        const variation = String(row[colMap.VARIATION] || '').trim();
        const rawQty = row[colMap.QTY];
        const qty = (rawQty === '' || rawQty === null || rawQty === undefined) ? 1 : Math.max(0, parseNum(rawQty));
        const commissionNet = parseNum(row[colMap.COMMISSION_NET]);
        const serviceFeeNet = parseNum(row[colMap.SERVICE_FEE_NET]);
        const shippingEst = parseNum(row[colMap.SHIPPING_EST]);
        const sellerDiscount = Math.abs(parseNum(row[colMap.SELLER_DISCOUNT]));
        const actionAdj = Math.abs(parseNum(row[colMap.ACTION_ADJ]));
        const sellerCoupon = Math.abs(parseNum(row[colMap.SELLER_COUPON]));
        const pixAdj = Math.abs(parseNum(row[colMap.PIX_ADJ]));
        if (date) datesList.push(date);

        if (!ordersMap[orderId]) ordersMap[orderId] = [];
        ordersMap[orderId].push({
            orderId, productName, sku, variation, qty, subtotal,
            commissionNet, serviceFeeNet, shippingEst,
            sellerDiscount, actionAdj, sellerCoupon, pixAdj,
            date, isoDate
        });
    }

    for (const orderId of Object.keys(ordersMap)) {
        cancelledOrdersSet.delete(orderId);
        cancelledDetailsMap.delete(orderId);
    }

    const pickOrderFee = (items, field) => {
        const nonZero = items.find(it => it[field] !== 0);
        const raw = nonZero ? nonZero[field] : (items[0]?.[field] ?? 0);
        return Math.abs(raw);
    };

    const parsedOrders = [];
    for (const [orderId, items] of Object.entries(ordersMap)) {
        validSet.add(orderId);
        const orderSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const orderCommission = pickOrderFee(items, 'commissionNet');
        const orderService = pickOrderFee(items, 'serviceFeeNet');
        const orderShipping = pickOrderFee(items, 'shippingEst');
        const orderFees = orderCommission + orderService;
        const orderCoupon = pickOrderFee(items, 'sellerCoupon');
        const orderPixAdj = pickOrderFee(items, 'pixAdj');
        const orderActionAdj = pickOrderFee(items, 'actionAdj');

        items.forEach(item => {
            const prop = orderSubtotal > 0 ? (item.subtotal / orderSubtotal) : (1 / items.length);
            const model = resolveCanonicalModel(item.sku, item.productName);
            parsedOrders.push({
                channel: 'shopee',
                orderId: item.orderId,
                date: item.date,
                isoDate: item.isoDate,
                productName: item.productName,
                sku: item.sku,
                itemId: '',
                variation: item.variation || item.sku,
                qty: item.qty,
                qtySource: 'sheet',
                needsQtyCheck: false,
                subtotal: item.subtotal,
                itemCommission: orderCommission * prop,
                itemServiceFee: orderService * prop,
                itemFees: orderFees * prop,
                itemShipping: orderShipping * prop,
                sellerDiscount: item.sellerDiscount,
                sellerCoupon: orderCoupon * prop,
                pixAdj: orderPixAdj * prop,
                actionAdj: orderActionAdj * prop,
                modelKey: model.modelKey,
                canonicalName: model.canonicalName,
                defaultModelCost: model.defaultCost
            });
        });
    }

    const cancelledList = [...cancelledDetailsMap.values()];
    const periodText = resolvePeriodText(datesList, filename);
    const monthKey = inferMonthKey(datesList, filename);

    if (options.returnPayloadOnly) {
        parsedOrders.forEach(o => {
            o.channel = 'shopee';
            o.monthKey = o.isoDate && /^\d{4}-\d{2}/.test(o.isoDate) ? o.isoDate.slice(0, 7) : monthKey;
        });
        cancelledList.forEach(c => {
            c.channel = 'shopee';
            c.monthKey = c.isoDate && /^\d{4}-\d{2}/.test(c.isoDate) ? c.isoDate.slice(0, 7) : monthKey;
        });
        return {
            relPath: options.relPath || filename,
            sourceType: 'shopee',
            monthKey,
            periodText,
            fileSize: options.fileSize || 0,
            mtimeMs: options.mtimeMs || 0,
            validOrderCount: validSet.size,
            cancelledCount: cancelledOrdersSet.size,
            orders: parsedOrders,
            cancelledOrders: cancelledList,
            mlPerfRows: []
        };
    }

    channelData.shopee = {
        orders: parsedOrders,
        cancelledOrders: cancelledList,
        validOrdersSet: validSet,
        cancelledCount: cancelledOrdersSet.size,
        dates: datesList,
        filename,
        periodText
    };
    historyFallbackData.shopee = channelData.shopee;
    if (typeof idbSaveChannel === 'function') idbSaveChannel('shopee', channelData.shopee);

    if (!options.silent) {
        try { localStorage.setItem(STORAGE_KEYS.INITIALIZED, '1'); } catch {}
        if (activeChannel === 'mercadolivre' && !channelData.mercadolivre) activeChannel = 'all';
        rebuildActiveOrders();
        if (parsedOrders.length === 0) {
            showToast('Nenhum pedido válido encontrado na planilha Shopee.', 'warn');
            setReportVisible(hasPrimaryChannelData() && (validSet.size > 0 || cancelledOrdersSet.size > 0 || Boolean(channelData.mercadolivre)));
        } else {
            recalcAll();
            setReportVisible(true);
            showToast(`Shopee importada! (${validSet.size} pedidos · ${periodText})`, 'success');
        }
    }
    return true;
}

function normalizeMLItemId(rawId) {
    const clean = String(rawId || '').trim().toUpperCase();
    if (!clean) return '';
    return clean.startsWith('MLB') ? clean : `MLB${clean}`;
}

function getEffectiveItemCost(orderItem) {
    const directCustom = findCustomCostKey(orderItem.productName);
    if (directCustom !== null) return customCosts[directCustom];
    if (orderItem.canonicalName) {
        const modelCustom = findCustomCostKey(orderItem.canonicalName);
        if (modelCustom !== null) return customCosts[modelCustom];
    }
    const mapped = findMappedCostEntry(orderItem.productName);
    if (mapped) return mapped.cost;
    return orderItem.defaultModelCost || 0;
}

function parseMercadoPagoWorkbook(rows, headerRowIdx, filename, options = {}) {
    const colMap = detectColumnsBySpecs(rows[headerRowIdx], MP_COLUMN_SPECS);
    const approvedByOrder = new Map();
    const nonApprovedSet = new Set();
    const nonApprovedDetailsMap = new Map();
    const validSet = new Set();
    const datesList = [];

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const status = normalizeText(row[colMap.STATUS]);
        if (!status) continue;

        const rawOrderId = String(row[colMap.ORDER_ID] || '').trim();
        const rawOpId = String(row[colMap.OP_ID] || '').trim();
        const orderId = rawOrderId || rawOpId || `MP-${i}`;
        const date = formatCellDate(row[colMap.DATE]);
        const isoDate = extractISODate(date);
        const productName = String(row[colMap.REASON] || '').trim() || 'Produto Mercado Livre';
        const sku = String(row[colMap.SKU] || '').trim();
        const gross = Math.max(0, parseNum(row[colMap.GROSS]));

        if (status !== 'approved') {
            nonApprovedSet.add(orderId);
            const rawDetail = String(row[colMap.STATUS_DETAIL] || '').trim();
            const rawRejection = String(row[colMap.REJECTION_CAUSES] || '').trim();
            const reasonText = [rawDetail, rawRejection].filter(Boolean).join(' · ') || status;
            const refundedAmt = Math.max(0, parseNum(row[colMap.AMOUNT_REFUNDED]));
            const claimId = String(row[colMap.CLAIM_ID] || '').trim();
            const chargebackId = String(row[colMap.CHARGEBACK_ID] || '').trim();
            if (!nonApprovedDetailsMap.has(orderId)) {
                nonApprovedDetailsMap.set(orderId, {
                    channel: 'mercadolivre',
                    orderId,
                    date,
                    isoDate,
                    productName,
                    sku,
                    status,
                    reason: reasonText,
                    amount: gross,
                    amountRefunded: refundedAmt,
                    claimId,
                    chargebackId
                });
            } else {
                const prev = nonApprovedDetailsMap.get(orderId);
                prev.amount += gross;
                prev.amountRefunded = (prev.amountRefunded || 0) + refundedAmt;
            }
            continue;
        }

        const net = Math.max(0, parseNum(row[colMap.NET]));
        if (gross <= 0) continue;

        const mpFee = Math.abs(parseNum(row[colMap.MP_FEE]));
        const mlFee = Math.abs(parseNum(row[colMap.ML_FEE]));
        const shippingCol = Math.abs(parseNum(row[colMap.SHIPPING]));
        const couponFee = Math.abs(parseNum(row[colMap.COUPON_FEE]));
        const finFee = Math.abs(parseNum(row[colMap.FIN_FEE]));
        const paymentType = String(row[colMap.PAYMENT_TYPE] || '').trim().toLowerCase();
        const installments = Math.max(1, Math.round(parseNum(row[colMap.INSTALLMENTS]) || 1));
        const releaseDate = formatCellDate(row[colMap.RELEASE_DATE]);
        const releaseIsoDate = extractISODate(releaseDate);
        const createdMs = parseDateTimeMs(date);
        const releasedMs = parseDateTimeMs(releaseDate);
        const releaseDays = (Number.isFinite(createdMs) && Number.isFinite(releasedMs))
            ? Math.max(0, (releasedMs - createdMs) / 86400000)
            : null;

        // Reconcilia taxas + descontos + frete diretamente contra Valor do produto - Valor total recebido
        const retained = Math.max(0, gross - net);
        let shippingReal = 0;
        if (shippingCol > 0) {
            const noShipWithCoupon = gross - mpFee - mlFee - couponFee - finFee;
            const noShipNoCoupon = gross - mpFee - mlFee - finFee;
            const withShipWithCoupon = noShipWithCoupon - shippingCol;
            const shippingExcludedFromNet =
                (Math.abs(noShipWithCoupon - net) < 0.05 || Math.abs(noShipNoCoupon - net) < 0.05) &&
                Math.abs(withShipWithCoupon - net) > 0.05;
            if (!shippingExcludedFromNet) {
                shippingReal = Math.min(shippingCol, Math.max(0, retained - (mpFee + mlFee)));
            }
        }
        const feesAndDiscounts = Math.max(0, retained - shippingReal);
        const marketplaceTariff = Math.min(feesAndDiscounts, mlFee + mpFee);
        const extraFeesDiscounts = Math.max(0, feesAndDiscounts - marketplaceTariff);

        const itemId = normalizeMLItemId(row[colMap.ITEM_ID]);
        if (date) datesList.push(date);

        if (!approvedByOrder.has(orderId)) {
            approvedByOrder.set(orderId, {
                channel: 'mercadolivre',
                orderId,
                date,
                isoDate,
                releaseDate,
                releaseIsoDate,
                releaseDays,
                paymentType,
                installments,
                financingFee: 0,
                couponFee: 0,
                productName,
                sku,
                itemId,
                variation: sku || itemId || '—',
                qty: 1,
                qtySource: 'default',
                needsQtyCheck: false,
                subtotal: 0,
                netReceived: 0,
                itemCommission: 0,
                itemServiceFee: 0,
                itemFees: 0,
                itemShipping: 0
            });
        }

        const agg = approvedByOrder.get(orderId);
        agg.subtotal += gross;
        agg.netReceived += net;
        agg.itemCommission += marketplaceTariff;
        agg.itemServiceFee += extraFeesDiscounts;
        agg.itemFees += feesAndDiscounts;
        agg.itemShipping += shippingReal;
        agg.financingFee += finFee;
        agg.couponFee += couponFee;
        if (!agg.paymentType && paymentType) agg.paymentType = paymentType;
        if (installments > agg.installments) agg.installments = installments;
        if (!agg.releaseDate && releaseDate) {
            agg.releaseDate = releaseDate;
            agg.releaseIsoDate = releaseIsoDate;
            agg.releaseDays = releaseDays;
        }
        if (!agg.sku && sku) {
            agg.sku = sku;
            agg.variation = sku;
        }
    }

    for (const orderId of approvedByOrder.keys()) {
        nonApprovedSet.delete(orderId);
        nonApprovedDetailsMap.delete(orderId);
        validSet.add(orderId);
    }

    const mergedOrders = [...approvedByOrder.values()].map(o => {
        const model = resolveCanonicalModel(o.sku, o.productName);
        return {
            ...o,
            modelKey: model.modelKey,
            canonicalName: model.canonicalName,
            defaultModelCost: model.defaultCost
        };
    });

    const nonApprovedList = [...nonApprovedDetailsMap.values()];
    const periodText = resolvePeriodText(datesList, filename);
    const monthKey = inferMonthKey(datesList, filename);

    if (options.returnPayloadOnly) {
        mergedOrders.forEach(o => {
            o.channel = 'mercadolivre';
            o.monthKey = o.isoDate && /^\d{4}-\d{2}/.test(o.isoDate) ? o.isoDate.slice(0, 7) : monthKey;
        });
        nonApprovedList.forEach(c => {
            c.channel = 'mercadolivre';
            c.monthKey = c.isoDate && /^\d{4}-\d{2}/.test(c.isoDate) ? c.isoDate.slice(0, 7) : monthKey;
        });
        return {
            relPath: options.relPath || filename,
            sourceType: 'mercadolivre',
            monthKey,
            periodText,
            fileSize: options.fileSize || 0,
            mtimeMs: options.mtimeMs || 0,
            validOrderCount: validSet.size,
            cancelledCount: nonApprovedSet.size,
            orders: mergedOrders,
            cancelledOrders: nonApprovedList,
            mlPerfRows: []
        };
    }

    channelData.mercadolivre = {
        orders: mergedOrders,
        cancelledOrders: nonApprovedList,
        validOrdersSet: validSet,
        cancelledCount: nonApprovedSet.size,
        dates: datesList,
        filename,
        periodText,
        inferredMultiCount: 0,
        perfMatchedCount: 0,
        warnCount: 0
    };
    historyFallbackData.mercadolivre = channelData.mercadolivre;

    applyMLQuantityInference(channelData.mercadolivre);
    if (typeof idbSaveChannel === 'function') idbSaveChannel('mercadolivre', channelData.mercadolivre);

    if (!options.silent) {
        try { localStorage.setItem(STORAGE_KEYS.INITIALIZED, '1'); } catch {}
        if (activeChannel === 'shopee' && !channelData.shopee) activeChannel = 'all';
        rebuildActiveOrders();
        if (mergedOrders.length === 0) {
            showToast('Nenhum pagamento aprovado encontrado na planilha Mercado Pago.', 'warn');
            setReportVisible(hasPrimaryChannelData());
        } else {
            recalcAll();
            setReportVisible(true);
            showToast(`Mercado Livre importado! (${validSet.size} pedidos · ${periodText})`, 'success');
        }
    }
    return true;
}

function applyMLQuantityInference(mlChannel, perfHintsOverride = undefined) {
    if (!mlChannel || !mlChannel.orders) return;

    mlChannel.inferredMultiCount = 0;
    mlChannel.perfMatchedCount = 0;
    mlChannel.warnCount = 0;

    // Agrupa preços unitários de referência por modelo/SKU canônico
    const modelBuckets = new Map();
    mlChannel.orders.forEach(o => {
        const bucketKey = o.modelKey || normalizeCostKey(o.canonicalName || o.productName);
        if (!modelBuckets.has(bucketKey)) modelBuckets.set(bucketKey, []);
        modelBuckets.get(bucketKey).push(o);
    });

    const singlesByBucket = new Map();
    for (const [bucketKey, list] of modelBuckets.entries()) {
        const sorted = list.map(o => o.subtotal).filter(v => v > 0).sort((a, b) => a - b);
        const minAmt = sorted[0] || 0;
        const singles = minAmt > 0
            ? [...new Set(sorted.filter(v => v < minAmt * 1.75).map(v => Number(v.toFixed(2))))]
            : [];
        singlesByBucket.set(bucketKey, { minAmt, singles, count: list.length });
    }

    // Camada 1 (Manual) e Camada 3 (Múltiplos de preço no modelo)
    mlChannel.orders.forEach(o => {
        o.qty = 1;
        o.qtySource = 'default';
        o.needsQtyCheck = false;

        const manual = mlQtyOverrides[o.orderId];
        if (Number.isInteger(manual) && manual >= 1) {
            o.qty = manual;
            o.qtySource = 'manual';
            return;
        }

        const bucketKey = o.modelKey || normalizeCostKey(o.canonicalName || o.productName);
        const info = singlesByBucket.get(bucketKey);
        if (info && info.singles.length > 0 && o.subtotal >= info.minAmt * 1.75) {
            let bestK = 1;
            let bestErr = 1;
            for (const p of info.singles) {
                const k = Math.round(o.subtotal / p);
                if (k < 2) continue;
                const err = Math.abs(o.subtotal - k * p) / (k * p);
                if (err < bestErr) {
                    bestErr = err;
                    bestK = k;
                }
            }
            if (bestK >= 2 && bestErr <= 0.11) {
                o.qty = bestK;
                o.qtySource = 'auto';
                mlChannel.inferredMultiCount++;
            }
        }
    });

    // Camada 2 (Opcional: Relatório de Desempenho ML por ID do anúncio)
    const activePerfHints = perfHintsOverride !== undefined ? perfHintsOverride : channelData.mlPerf?.hints;
    if (activePerfHints) {
        const byItem = new Map();
        mlChannel.orders.forEach(o => {
            if (!o.itemId) return;
            if (!byItem.has(o.itemId)) byItem.set(o.itemId, []);
            byItem.get(o.itemId).push(o);
        });

        for (const [itemId, hint] of activePerfHints.entries()) {
            if (hint.unidades <= hint.vendas) continue;
            const list = byItem.get(itemId);
            if (!list || list.length === 0) continue;

            const extraFromPerf = hint.unidades - hint.vendas;
            const alreadyExplained = list.reduce((sum, o) => sum + Math.max(0, o.qty - 1), 0);
            const remainingExtra = extraFromPerf - alreadyExplained;
            if (remainingExtra <= 0) continue;

            const sortedOrders = [...list].sort((a, b) => b.subtotal - a.subtotal);
            const minOrderAmt = sortedOrders[sortedOrders.length - 1]?.subtotal || 0;
            const candidate = sortedOrders.find(o => o.qtySource !== 'manual' && o.qty === 1);
            if (!candidate) continue;

            const effCost = getEffectiveItemCost(candidate);
            const isSingleSaleAd = list.length === 1 && hint.vendas === 1;
            const isHighTicketSingleOrder = list.length === 1 && effCost > 0 && (candidate.subtotal / effCost) >= 2.8;
            const isOutlierInAd = list.length > 1 && minOrderAmt > 0 && candidate.subtotal >= minOrderAmt * 1.75;

            if (isSingleSaleAd || isHighTicketSingleOrder || isOutlierInAd) {
                candidate.qty = 1 + remainingExtra;
                candidate.qtySource = 'perf';
                candidate.needsQtyCheck = false;
                mlChannel.perfMatchedCount++;
            }
        }
    }

    // Marca pedidos suspeitos com ticket alto para conferência manual quando permanecem com Qtd = 1
    mlChannel.orders.forEach(o => {
        if (o.qtySource === 'default' && o.qty === 1) {
            const bucketKey = o.modelKey || normalizeCostKey(o.canonicalName || o.productName);
            const info = singlesByBucket.get(bucketKey);
            const effCost = getEffectiveItemCost(o);
            if (info && info.count <= 1 && effCost > 0 && (o.subtotal / effCost) >= 2.8) {
                o.needsQtyCheck = true;
                mlChannel.warnCount++;
            }
        }
    });
}

function parseMLPerfWorkbook(rows, headerRowIdx, filename, options = {}) {
    const colMap = detectColumnsBySpecs(rows[headerRowIdx], ML_PERF_COLUMN_SPECS);
    const hints = new Map();
    const perfRows = [];

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        const rawAdId = String(row[colMap.AD_ID] || '').trim();
        if (!rawAdId) continue;

        const itemId = normalizeMLItemId(rawAdId);
        const vendas = Math.max(0, Math.round(parseNum(row[colMap.SALES_COUNT])));
        const unidades = Math.max(0, Math.round(parseNum(row[colMap.UNITS_SOLD])));
        const visits = Math.max(0, Math.round(parseNum(row[colMap.VISITS])));
        const buyers = Math.max(0, Math.round(parseNum(row[colMap.BUYERS])));
        const convPct = parseNum(String(row[colMap.CONV_PCT] || '0').replace('%', ''));
        const status = String(row[colMap.STATUS] || '').trim();
        const variation = String(row[colMap.VARIATION] || '').trim();
        const sku = String(row[colMap.SKU] || '').trim();
        const title = String(row[colMap.TITLE] || '').trim();

        perfRows.push({
            itemId,
            title,
            status,
            variation,
            sku,
            visits,
            sales: vendas,
            buyers,
            units: unidades,
            convPct: visits > 0 && convPct === 0 ? (vendas / visits) * 100 : convPct
        });

        if (!hints.has(itemId)) {
            hints.set(itemId, { itemId, vendas: 0, unidades: 0, title });
        }
        const entry = hints.get(itemId);
        entry.vendas += vendas;
        entry.unidades += unidades;
        if (!entry.title && title) entry.title = title;
    }

    let multiUnitAdsCount = 0;
    hints.forEach(h => {
        if (h.unidades > h.vendas) multiUnitAdsCount++;
    });

    const periodText = resolvePeriodText([], filename);
    const monthKey = inferMonthKey([], filename);
    if (options.returnPayloadOnly) {
        perfRows.forEach(r => { r.monthKey = monthKey; });
        return {
            relPath: options.relPath || filename,
            sourceType: 'mlPerf',
            monthKey,
            periodText,
            fileSize: options.fileSize || 0,
            mtimeMs: options.mtimeMs || 0,
            validOrderCount: 0,
            cancelledCount: 0,
            orders: [],
            cancelledOrders: [],
            mlPerfRows: perfRows
        };
    }

    channelData.mlPerf = {
        hints,
        rows: perfRows,
        multiUnitAdsCount,
        filename,
        periodText
    };
    historyFallbackData.mlPerf = channelData.mlPerf;
    if (typeof idbSaveChannel === 'function') idbSaveChannel('mlPerf', channelData.mlPerf);

    if (channelData.mercadolivre) {
        applyMLQuantityInference(channelData.mercadolivre);
        if (typeof idbSaveChannel === 'function') idbSaveChannel('mercadolivre', channelData.mercadolivre);
        rebuildActiveOrders();
        if (!options.silent) {
            recalcAll();
            setReportVisible(true);
            showToast(`Desempenho ML aplicado! (${multiUnitAdsCount} anúncios multi-unidade identificados)`, 'success');
        }
    } else {
        updateChannelUI();
        if (!options.silent) {
            showToast(`Desempenho ML carregado (${multiUnitAdsCount} anúncios multi-unidade). Agora importe a planilha Mercado Pago.`, 'info');
        }
    }
    return true;
}

function rebuildActiveOrders() {
    if (activeChannel === 'shopee' && !channelData.shopee && channelData.mercadolivre) {
        activeChannel = 'all';
    }
    if (activeChannel === 'mercadolivre' && !channelData.mercadolivre && channelData.shopee) {
        activeChannel = 'all';
    }

    const includeShopee = (activeChannel === 'all' || activeChannel === 'shopee') && Boolean(channelData.shopee);
    const includeML = (activeChannel === 'all' || activeChannel === 'mercadolivre') && Boolean(channelData.mercadolivre);
    const hasDateFilter = Boolean(dateFilter.from || dateFilter.to);

    rawOrders = [];
    validOrdersSet = new Set();
    cancelledCount = 0;
    activeCancelledOrders = [];

    const activePeriods = [];
    const appendChannelOrders = (idPrefix, chData, label) => {
        const filteredOrders = hasDateFilter
            ? chData.orders.filter(o => matchesDateFilter(o.isoDate))
            : chData.orders;
        filteredOrders.forEach(o => {
            rawOrders.push(o);
            validOrdersSet.add(`${idPrefix}:${o.orderId}`);
        });

        const cancelledList = Array.isArray(chData.cancelledOrders) ? chData.cancelledOrders : [];
        const filteredCancelled = hasDateFilter
            ? cancelledList.filter(c => matchesDateFilter(c.isoDate))
            : cancelledList;
        filteredCancelled.forEach(c => activeCancelledOrders.push(c));
        cancelledCount += hasDateFilter ? filteredCancelled.length : (chData.cancelledCount ?? filteredCancelled.length);
        activePeriods.push({ label, text: chData.periodText });
    };

    if (includeShopee) appendChannelOrders('sh', channelData.shopee, 'Shopee');
    if (includeML) appendChannelOrders('ml', channelData.mercadolivre, 'ML');

    if (activePeriods.length > 0) {
        const uniquePeriods = [...new Set(activePeriods.map(p => p.text))];
        let periodLabel = uniquePeriods.length === 1
            ? uniquePeriods[0]
            : activePeriods.map(p => `${p.label}: ${p.text}`).join(' · ');
        if (hasDateFilter) {
            periodLabel += ` · Filtro: ${dateFilter.from || '...'} → ${dateFilter.to || '...'}`;
        }
        applyPeriodText(periodLabel);
    } else {
        applyPeriodText('Aguardando planilha');
    }

    groupByProduct();
    updateChannelUI();
}

function updateChannelUI() {
    const shCard = document.getElementById('channel-card-shopee');
    const shStatus = document.getElementById('channel-status-shopee');
    const shClear = document.getElementById('channel-clear-shopee');
    if (shCard && shStatus && shClear) {
        if (channelData.shopee) {
            shCard.classList.add('loaded');
            shStatus.textContent = `${channelData.shopee.validOrdersSet.size} pedidos · ${channelData.shopee.periodText}`;
            shClear.style.display = '';
        } else {
            shCard.classList.remove('loaded');
            shStatus.textContent = 'Não importado';
            shClear.style.display = 'none';
        }
    }

    const mlCard = document.getElementById('channel-card-ml');
    const mlStatus = document.getElementById('channel-status-ml');
    const mlClear = document.getElementById('channel-clear-ml');
    if (mlCard && mlStatus && mlClear) {
        if (channelData.mercadolivre) {
            const ml = channelData.mercadolivre;
            mlCard.classList.add('loaded');
            mlStatus.textContent = `${ml.validOrdersSet.size} pedidos (${ml.inferredMultiCount + ml.perfMatchedCount} multi-unid.) · ${ml.periodText}`;
            mlClear.style.display = '';
        } else {
            mlCard.classList.remove('loaded');
            mlStatus.textContent = 'Não importado (planilha Mercado Pago)';
            mlClear.style.display = 'none';
        }
    }

    const perfCard = document.getElementById('channel-card-mlperf');
    const perfStatus = document.getElementById('channel-status-mlperf');
    const perfClear = document.getElementById('channel-clear-mlperf');
    if (perfCard && perfStatus && perfClear) {
        if (channelData.mlPerf) {
            perfCard.classList.add('loaded');
            perfStatus.textContent = `${channelData.mlPerf.multiUnitAdsCount} anúncios multi-unidade mapeados`;
            perfClear.style.display = '';
        } else {
            perfCard.classList.remove('loaded');
            perfStatus.textContent = 'Opcional · melhora Qtd multi-unidade';
            perfClear.style.display = 'none';
        }
    }

    document.querySelectorAll('.channel-tab[data-channel]').forEach(btn => {
        const ch = btn.dataset.channel;
        btn.classList.toggle('active', ch === activeChannel);
        if (ch === 'shopee') btn.disabled = !channelData.shopee;
        else if (ch === 'mercadolivre') btn.disabled = !channelData.mercadolivre;
        else btn.disabled = !hasPrimaryChannelData();
    });

    const groupSel = document.getElementById('group-mode');
    if (groupSel) groupSel.value = groupingMode;
    updateSubnavSummary();
}

function setActiveChannel(ch) {
    if (ch !== 'all' && ch !== 'shopee' && ch !== 'mercadolivre') return;
    if (ch === 'shopee' && !channelData.shopee) return;
    if (ch === 'mercadolivre' && !channelData.mercadolivre) return;
    activeChannel = ch;
    rebuildActiveOrders();
    recalcAll();
}

function setGroupingMode(mode) {
    if (mode !== 'model' && mode !== 'listing') return;
    groupingMode = mode;
    saveGroupingMode();
    rebuildActiveOrders();
    recalcAll();
}

async function handleClearChannelClick(ch) {
    if (activeWorkspaceTab === 'current') {
        await clearCurrentChannel(ch);
        return;
    }
    await clearChannel(ch);
}

async function clearCurrentChannel(ch) {
    if (!['shopee', 'mercadolivre', 'mlPerf'].includes(ch)) return;
    currentWorkspaceData[ch] = null;
    currentWorkspaceData.updatedAt = Date.now();
    syncCurrentWorkspaceInference();
    if (typeof dbSaveCurrentMonthDraft === 'function') {
        await dbSaveCurrentMonthDraft(currentWorkspaceData);
    }
    channelData.shopee = currentWorkspaceData.shopee;
    channelData.mercadolivre = currentWorkspaceData.mercadolivre;
    channelData.mlPerf = currentWorkspaceData.mlPerf;
    rebuildActiveOrders();
    recalcAll();
    setReportVisible(hasCurrentWorkspacePrimaryData());
    showToast('Canal removido da parcial do mês atual (histórico preservado).', 'info');
}

async function clearCurrentMonthWorkspace() {
    currentWorkspaceData = { shopee: null, mercadolivre: null, mlPerf: null, updatedAt: 0 };
    if (typeof dbClearCurrentMonthDraft === 'function') {
        await dbClearCurrentMonthDraft();
    }
    if (activeWorkspaceTab === 'current') {
        channelData.shopee = null;
        channelData.mercadolivre = null;
        channelData.mlPerf = null;
        rebuildActiveOrders();
        recalcAll();
        setReportVisible(false);
    } else {
        updateWorkspaceChromeUI();
    }
    showToast('Parcial do mês atual limpa. Histórico SQLite intacto.', 'info');
}

async function promoteCurrentMonthToHistory() {
    if (!hasCurrentWorkspacePrimaryData()) {
        showToast('Importe Shopee e/ou Mercado Pago na aba Mês Atual antes de gravar no histórico.', 'warn');
        return;
    }
    const ok = typeof confirm === 'function'
        ? confirm('Deseja gravar definitivamente estes dados do mês atual no Banco SQLite Histórico e limpar a área semanal?')
        : true;
    if (!ok) return;

    showLoading(true);
    try {
        if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSyncIngestFile === 'function') {
            let inferredPrimaryMonth = '';
            const payloads = [];
            for (const src of ['shopee', 'mercadolivre']) {
                const ch = currentWorkspaceData[src];
                if (!ch) continue;
                const mk = inferMonthKey(ch.dates || [], ch.filename || '');
                if (/^\d{4}-\d{2}$/.test(mk)) inferredPrimaryMonth = mk;
                (ch.orders || []).forEach(o => {
                    o.channel = src;
                    o.monthKey = o.isoDate && /^\d{4}-\d{2}/.test(o.isoDate) ? o.isoDate.slice(0, 7) : mk;
                });
                (ch.cancelledOrders || []).forEach(c => {
                    c.channel = src;
                    c.monthKey = c.isoDate && /^\d{4}-\d{2}/.test(c.isoDate) ? c.isoDate.slice(0, 7) : mk;
                });
                payloads.push({
                    relPath: `promoted/${ch.filename || `${src}_${mk}.xlsx`}`,
                    sourceType: src,
                    monthKey: mk,
                    periodText: ch.periodText || mk,
                    fileSize: 0,
                    mtimeMs: Date.now(),
                    validOrderCount: ch.validOrdersSet?.size || (ch.orders || []).length,
                    cancelledCount: ch.cancelledCount || 0,
                    orders: ch.orders || [],
                    cancelledOrders: ch.cancelledOrders || [],
                    mlPerfRows: []
                });
            }
            if (currentWorkspaceData.mlPerf) {
                const perf = currentWorkspaceData.mlPerf;
                const rawMk = inferMonthKey([], perf.filename || '');
                const mk = /^\d{4}-\d{2}$/.test(rawMk) ? rawMk : (inferredPrimaryMonth || rawMk);
                const rows = (perf.rows || []).map(r => ({ ...r, monthKey: mk }));
                payloads.push({
                    relPath: `promoted/${perf.filename || `mlPerf_${mk}.xlsx`}`,
                    sourceType: 'mlPerf',
                    monthKey: mk,
                    periodText: perf.periodText || mk,
                    fileSize: 0,
                    mtimeMs: Date.now(),
                    validOrderCount: 0,
                    cancelledCount: 0,
                    orders: [],
                    cancelledOrders: [],
                    mlPerfRows: rows
                });
            }
            for (const p of payloads) {
                await dbSyncIngestFile(p);
            }
            currentWorkspaceData = { shopee: null, mercadolivre: null, mlPerf: null, updatedAt: 0 };
            if (typeof dbClearCurrentMonthDraft === 'function') await dbClearCurrentMonthDraft();
            activeWorkspaceTab = 'history';
            if (inferredPrimaryMonth) {
                monthSelection.mode = 'single';
                monthSelection.single = inferredPrimaryMonth;
                await dbSaveSettings({ monthSelection });
            }
            await reloadDatasetFromDb({ toastSummary: true });
        } else {
            historyFallbackData.shopee = currentWorkspaceData.shopee;
            historyFallbackData.mercadolivre = currentWorkspaceData.mercadolivre;
            historyFallbackData.mlPerf = currentWorkspaceData.mlPerf;
            if (typeof idbSaveChannel === 'function') {
                if (historyFallbackData.shopee) await idbSaveChannel('shopee', historyFallbackData.shopee);
                if (historyFallbackData.mercadolivre) await idbSaveChannel('mercadolivre', historyFallbackData.mercadolivre);
                if (historyFallbackData.mlPerf) await idbSaveChannel('mlPerf', historyFallbackData.mlPerf);
            }
            currentWorkspaceData = { shopee: null, mercadolivre: null, mlPerf: null, updatedAt: 0 };
            if (typeof dbClearCurrentMonthDraft === 'function') await dbClearCurrentMonthDraft();
            switchWorkspaceTab('history');
            showToast('Mês gravado no histórico local!', 'success');
        }
    } catch (err) {
        console.error('Erro ao fechar mês no histórico:', err);
        showToast('Falha ao gravar mês no SQLite: ' + err.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function clearChannel(ch) {
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbClearChannel === 'function') {
        try {
            dbSyncPaused = true;
            await dbSaveSettings({ dbSyncPaused: true });
            await dbClearChannel(ch);
            await reloadDatasetFromDb();
            if (!hasPrimaryChannelData()) recalcAll();
            showToast('Dados do canal removidos do SQLite.', 'info');
            return;
        } catch (err) {
            showToast('Falha ao limpar canal no SQLite: ' + err.message, 'error');
            return;
        }
    }

    if (ch === 'shopee') {
        channelData.shopee = null;
        historyFallbackData.shopee = null;
    } else if (ch === 'mercadolivre') {
        channelData.mercadolivre = null;
        historyFallbackData.mercadolivre = null;
    } else if (ch === 'mlPerf') {
        channelData.mlPerf = null;
        historyFallbackData.mlPerf = null;
    }

    if (typeof idbDeleteChannel === 'function') idbDeleteChannel(ch);

    if (ch === 'mlPerf' && channelData.mercadolivre) {
        applyMLQuantityInference(channelData.mercadolivre);
        if (typeof idbSaveChannel === 'function') idbSaveChannel('mercadolivre', channelData.mercadolivre);
    }

    rebuildActiveOrders();
    if (hasPrimaryChannelData()) {
        recalcAll();
        setReportVisible(true);
    } else {
        recalcAll();
        setReportVisible(false);
    }
    showToast('Dados do canal removidos.', 'info');
}

function setMLOrderQtyOverride(orderId, newQty) {
    if (!orderId) return;
    const qty = Math.max(1, Math.round(Number(newQty) || 1));
    mlQtyOverrides[orderId] = qty;
    saveMLQtyOverrides();
    if (typeof dbBackendActive !== 'undefined' && dbBackendActive && typeof dbSaveMlQtyOverride === 'function') {
        dbSaveMlQtyOverride(orderId, qty);
    }

    recomputeAfterMetadataChange({ persistCurrent: true });
    if (currentDetailKey && document.getElementById('detail-modal').style.display !== 'none') {
        showDetail(currentDetailKey);
    }
    showToast(`Pedido ${orderId}: quantidade atualizada para ${qty}.`, 'success');
}

// ===== AGRUPAMENTO POR PRODUTO E RESOLUÇÃO DE CUSTOS =====
function normalizeCostKey(name) {
    return String(name || '').trim().toLowerCase();
}

function findMappedCostEntry(productName) {
    const trimmed = String(productName || '').trim();
    if (!trimmed) return null;
    if (COST_MAP[trimmed] !== undefined) {
        return { key: trimmed, cost: COST_MAP[trimmed] };
    }
    const targetNorm = normalizeCostKey(trimmed);
    for (const [mapKey, mapCost] of Object.entries(COST_MAP)) {
        if (normalizeCostKey(mapKey) === targetNorm) {
            return { key: mapKey, cost: mapCost };
        }
    }
    return null;
}

function findCustomCostKey(productName) {
    const trimmed = String(productName || '').trim();
    if (!trimmed) return null;
    if (customCosts[productName] !== undefined) return productName;
    if (customCosts[trimmed] !== undefined) return trimmed;
    const targetNorm = normalizeCostKey(trimmed);
    for (const key of Object.keys(customCosts)) {
        if (normalizeCostKey(key) === targetNorm) return key;
    }
    return null;
}

function findProductSummaryEntry(productName) {
    if (productSummary[productName]) return productSummary[productName];
    const targetNorm = normalizeCostKey(productName);
    for (const entry of Object.values(productSummary)) {
        if (normalizeCostKey(entry.productName) === targetNorm) return entry;
    }
    return null;
}

function getMappedCost(productName, canonicalName = '', fallbackDefault = 0) {
    const direct = findMappedCostEntry(productName);
    if (direct) return direct.cost;
    const directRule = findModelRuleByName(productName);
    if (directRule) return directRule.defaultCost;
    if (fallbackDefault > 0) return fallbackDefault;
    if (canonicalName) {
        const canonMapped = findMappedCostEntry(canonicalName);
        if (canonMapped) return canonMapped.cost;
        const canonRule = findModelRuleByName(canonicalName);
        if (canonRule) return canonRule.defaultCost;
    }
    return 0;
}

function getCost(productName, canonicalName = '', fallbackDefault = 0) {
    const customKey = findCustomCostKey(productName);
    if (customKey !== null) return customCosts[customKey];
    if (canonicalName) {
        const canonCustomKey = findCustomCostKey(canonicalName);
        if (canonCustomKey !== null) return customCosts[canonCustomKey];
    }
    return getMappedCost(productName, canonicalName, fallbackDefault);
}

function setCustomCostValue(productName, value) {
    const targetNorm = normalizeCostKey(productName);
    for (const existingKey of Object.keys(customCosts)) {
        if (normalizeCostKey(existingKey) === targetNorm) {
            delete customCosts[existingKey];
        }
    }
    const summaryEntry = findProductSummaryEntry(productName);
    const mappedEntry = findMappedCostEntry(productName);
    const modelRule = findModelRuleByName(productName);
    const canonicalKey = summaryEntry?.productName || mappedEntry?.key || modelRule?.canonicalName || String(productName || '').trim();
    customCosts[canonicalKey] = value;
}

function createEmptyChannelStats() {
    return { orders: new Set(), qty: 0, revenue: 0, fees: 0, shipping: 0 };
}

function groupByProduct() {
    productSummary = {};

    rawOrders.forEach(item => {
        const key = groupingMode === 'model'
            ? (item.canonicalName || item.productName)
            : item.productName;

        if (!productSummary[key]) {
            const defaultCost = getMappedCost(key, item.canonicalName, item.defaultModelCost);
            productSummary[key] = {
                productName: key,
                canonicalName: item.canonicalName || key,
                modelKey: item.modelKey || '',
                defaultCost,
                channels: new Set(),
                channelStats: {
                    shopee: createEmptyChannelStats(),
                    mercadolivre: createEmptyChannelStats()
                },
                skus: new Set(),
                listingNames: new Set(),
                qtyWarnCount: 0,
                totalQty: 0,
                totalRevenue: 0,
                totalCommission: 0,
                totalServiceFee: 0,
                totalFees: 0,
                totalShipping: 0,
                orders: []
            };
        }

        const p = productSummary[key];
        p.channels.add(item.channel);
        if (item.sku) p.skus.add(item.sku);
        if (item.productName) p.listingNames.add(item.productName);
        if (item.needsQtyCheck) p.qtyWarnCount++;
        p.totalQty += item.qty;
        p.totalRevenue += item.subtotal;
        p.totalCommission += item.itemCommission;
        p.totalServiceFee += item.itemServiceFee;
        p.totalFees += item.itemFees;
        p.totalShipping += item.itemShipping;
        p.orders.push(item);

        const chStats = p.channelStats[item.channel];
        if (chStats) {
            chStats.orders.add(item.orderId);
            chStats.qty += item.qty;
            chStats.revenue += item.subtotal;
            chStats.fees += item.itemFees;
            chStats.shipping += item.itemShipping;
        }
    });
}

function computeRecommendedPrice({
    unitCost,
    shippingPerUnit = 0,
    packagingPerUnit = 0,
    taxRate = 0,
    feeRate = 0,
    adsRate = 0,
    targetMarginRate = 0.20
}) {
    const denominator = 1 - taxRate - feeRate - adsRate - targetMarginRate;
    if (unitCost <= 0 || denominator <= 0.05) return 0;
    return (unitCost + shippingPerUnit + packagingPerUnit) / denominator;
}

function assignABCCurveClasses(summaryMap, totalRevenue) {
    const groups = {
        A: { count: 0, revenue: 0, profit: 0, revPct: 0 },
        B: { count: 0, revenue: 0, profit: 0, revPct: 0 },
        C: { count: 0, revenue: 0, profit: 0, revPct: 0 }
    };
    const sorted = Object.values(summaryMap).sort((a, b) =>
        (b.totalRevenue - a.totalRevenue) || (b._profit - a._profit)
    );

    let cumRev = 0;
    sorted.forEach(p => {
        const rev = Math.max(0, p.totalRevenue || 0);
        const prevCumPct = totalRevenue > 0 ? cumRev / totalRevenue : 0;
        const cls = totalRevenue <= 0 ? 'C' : (prevCumPct < 0.80 ? 'A' : (prevCumPct < 0.95 ? 'B' : 'C'));
        cumRev += rev;

        p._abcClass = cls;
        p._revSharePct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
        p._cumRevPct = totalRevenue > 0 ? (cumRev / totalRevenue) * 100 : 0;

        groups[cls].count += 1;
        groups[cls].revenue += rev;
        groups[cls].profit += p._profit || 0;
    });

    ['A', 'B', 'C'].forEach(cls => {
        groups[cls].revPct = totalRevenue > 0 ? (groups[cls].revenue / totalRevenue) * 100 : 0;
    });
    return groups;
}

function formatMomDeltaPill(currentVal, baseVal, invertPolarity = false, baseMeta = null) {
    const activeBase = baseMeta
        || (typeof previousMonthAutoBaseline !== 'undefined' && previousMonthAutoBaseline)
        || latestBaselineSnapshot;
    if (!activeBase || !Number.isFinite(baseVal) || Math.abs(baseVal) < 0.01) return '';
    const pct = ((currentVal - baseVal) / Math.abs(baseVal)) * 100;
    const labelSuffix = activeBase.label ? escapeHtml(activeBase.label) : 'Base';
    if (Math.abs(pct) < 0.05) {
        return `<span class="meta-pill neutral" title="Comparado a ${labelSuffix}">0,0% MoM</span>`;
    }
    const favorable = invertPolarity ? pct < 0 : pct > 0;
    const tone = favorable ? 'ok' : 'bad';
    const sign = pct >= 0 ? '+' : '';
    return `<span class="meta-pill ${tone}" title="Comparado a ${labelSuffix}">${sign}${pct.toFixed(1).replace('.', ',')}% MoM</span>`;
}

function updateKPIScorecardMeta(totals, taxPct, targetMargin) {
    const rev = Math.max(0, totals.revenue || 0);
    const setMeta = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    if (rev <= 0) {
        ['kpi-meta-revenue', 'kpi-meta-cost', 'kpi-meta-fees', 'kpi-meta-shipping', 'kpi-meta-tax', 'kpi-meta-extras', 'kpi-meta-profit']
            .forEach(id => setMeta(id, ''));
        return;
    }

    const avgTicket = totals.validOrders > 0 ? rev / totals.validOrders : 0;
    const cmvPct = (totals.cost / rev) * 100;
    const feePct = (totals.fees / rev) * 100;
    const shipPct = (totals.shipping / rev) * 100;
    const adsPct = (totals.ads / rev) * 100;
    const roas = totals.ads > 0 ? rev / totals.ads : 0;
    const base = (typeof previousMonthAutoBaseline !== 'undefined' && previousMonthAutoBaseline)
        || latestBaselineSnapshot
        || null;

    setMeta('kpi-meta-revenue',
        `<span class="meta-pill neutral">Ticket ${fmt(avgTicket)}</span>${base ? formatMomDeltaPill(totals.revenue, base.revenue, false, base) : ''}`
    );
    setMeta('kpi-meta-cost',
        `<span class="meta-pill ${cmvPct <= 45 ? 'ok' : (cmvPct <= 60 ? 'warn' : 'bad')}">CMV ${fmtPct(cmvPct)}</span>${base ? formatMomDeltaPill(totals.cost, base.cost, true, base) : ''}`
    );
    setMeta('kpi-meta-fees',
        `<span class="meta-pill ${feePct <= 22 ? 'ok' : (feePct <= 28 ? 'warn' : 'bad')}">Taxa ${fmtPct(feePct)}</span>${base ? formatMomDeltaPill(totals.fees, base.fees, true, base) : ''}`
    );
    setMeta('kpi-meta-shipping',
        `<span class="meta-pill ${shipPct <= 10 ? 'ok' : (shipPct <= 16 ? 'warn' : 'bad')}">Frete ${fmtPct(shipPct)}</span>${base ? formatMomDeltaPill(totals.shipping, base.shipping, true, base) : ''}`
    );
    setMeta('kpi-meta-tax',
        `<span class="meta-pill neutral">Alíq. ${fmtPct(taxPct)}</span>${base ? formatMomDeltaPill(totals.tax, base.tax, true, base) : ''}`
    );
    const extrasBadge = totals.ads > 0
        ? `<span class="meta-pill ${roas >= 8 ? 'ok' : (roas >= 4 ? 'warn' : 'bad')}">ROAS ${roas.toFixed(1).replace('.', ',')}x (${fmtPct(adsPct)})</span>`
        : `<span class="meta-pill neutral">${totals.extras > 0 ? 'Somente Emb.' : 'Sem extras'}</span>`;
    setMeta('kpi-meta-extras',
        `${extrasBadge}${base && base.extras > 0 ? formatMomDeltaPill(totals.extras, base.extras, true, base) : ''}`
    );

    const diffMeta = totals.margin - targetMargin;
    const metaTone = totals.profit < 0 ? 'bad' : (diffMeta >= 0 ? 'ok' : 'warn');
    const metaLabel = totals.profit < 0
        ? 'Prejuízo'
        : (diffMeta >= 0 ? `✓ Meta ${fmtPct(targetMargin)}` : `${diffMeta.toFixed(1).replace('.', ',')} pp da meta`);
    setMeta('kpi-meta-profit',
        `<span class="meta-pill ${metaTone}">${metaLabel}</span>${base ? formatMomDeltaPill(totals.profit, base.profit, false, base) : ''}`
    );
}

// ===== CÁLCULOS FINANCEIROS =====
function recalcAll() {
    const taxPct = getTaxRatePercent();
    const taxRate = taxPct / 100;
    const targetMargin = getTargetMarginPercent();
    const targetMarginRate = targetMargin / 100;
    document.getElementById('tax-pct-label').textContent = taxPct;

    let grandShopeeRevenue = 0;
    let grandMLRevenue = 0;
    Object.values(productSummary).forEach(p => {
        grandShopeeRevenue += p.channelStats.shopee.revenue;
        grandMLRevenue += p.channelStats.mercadolivre.revenue;
    });

    const activeAdsShopee = grandShopeeRevenue > 0 ? extraExpenses.adsShopee : 0;
    const activeAdsML = grandMLRevenue > 0 ? extraExpenses.adsML : 0;

    let grandRevenue = 0, grandCost = 0, grandFees = 0, grandShipping = 0, grandTax = 0;
    let grandPackaging = 0, grandAds = 0, grandExtras = 0, grandProfit = 0;
    let totalQty = 0;

    const initChAgg = () => ({
        orders: new Set(), units: 0, revenue: 0, cost: 0, fees: 0,
        shipping: 0, tax: 0, packaging: 0, ads: 0, extras: 0, profit: 0
    });
    const chTotals = { shopee: initChAgg(), mercadolivre: initChAgg() };

    for (const [key, p] of Object.entries(productSummary)) {
        const cost = getCost(key, p.canonicalName, p.defaultCost);
        p._costUnit = cost;
        p._costTotal = cost * p.totalQty;
        p._fees = p.totalFees;
        p._tax = p.totalRevenue * taxRate;

        p._packaging = extraExpenses.packagingPerUnit * p.totalQty;
        const shShare = grandShopeeRevenue > 0 ? p.channelStats.shopee.revenue / grandShopeeRevenue : 0;
        const mlShare = grandMLRevenue > 0 ? p.channelStats.mercadolivre.revenue / grandMLRevenue : 0;
        p._ads = (activeAdsShopee * shShare) + (activeAdsML * mlShare);
        p._extras = p._packaging + p._ads;

        p._profit = p.totalRevenue - p._costTotal - p._fees - p.totalShipping - p._tax - p._extras;
        p._margin = p.totalRevenue > 0 ? (p._profit / p.totalRevenue) * 100 : 0;

        const feeRate = p.totalRevenue > 0 ? p._fees / p.totalRevenue : 0;
        const adsRate = p.totalRevenue > 0 ? p._ads / p.totalRevenue : 0;
        const avgShippingPerUnit = p.totalQty > 0 ? p.totalShipping / p.totalQty : 0;
        p._recommendedPrice = computeRecommendedPrice({
            unitCost: cost,
            shippingPerUnit: avgShippingPerUnit,
            packagingPerUnit: extraExpenses.packagingPerUnit,
            taxRate,
            feeRate,
            adsRate,
            targetMarginRate
        });
        p._avgSellingPrice = p.totalQty > 0 ? p.totalRevenue / p.totalQty : 0;
        p._insight = generateInsight(p, targetMargin);

        ['shopee', 'mercadolivre'].forEach(chKey => {
            const cs = p.channelStats[chKey];
            if (cs.revenue <= 0 && cs.qty <= 0) return;
            const chTax = cs.revenue * taxRate;
            const chCost = cost * cs.qty;
            const chPkg = extraExpenses.packagingPerUnit * cs.qty;
            const chAds = chKey === 'shopee' ? activeAdsShopee * shShare : activeAdsML * mlShare;
            const chExtras = chPkg + chAds;
            const chProfit = cs.revenue - chCost - cs.fees - cs.shipping - chTax - chExtras;

            const t = chTotals[chKey];
            cs.orders.forEach(oid => t.orders.add(oid));
            t.units += cs.qty;
            t.revenue += cs.revenue;
            t.cost += chCost;
            t.fees += cs.fees;
            t.shipping += cs.shipping;
            t.tax += chTax;
            t.packaging += chPkg;
            t.ads += chAds;
            t.extras += chExtras;
            t.profit += chProfit;
        });

        grandRevenue += p.totalRevenue;
        grandCost += p._costTotal;
        grandFees += p._fees;
        grandShipping += p.totalShipping;
        grandTax += p._tax;
        grandPackaging += p._packaging;
        grandAds += p._ads;
        grandExtras += p._extras;
        grandProfit += p._profit;
        totalQty += p.totalQty;
    }

    const grandMargin = grandRevenue > 0 ? (grandProfit / grandRevenue) * 100 : 0;
    const serializeCh = (t) => ({
        orders: t.orders.size,
        units: t.units,
        revenue: t.revenue,
        cost: t.cost,
        fees: t.fees,
        shipping: t.shipping,
        tax: t.tax,
        packaging: t.packaging,
        ads: t.ads,
        extras: t.extras,
        profit: t.profit,
        margin: t.revenue > 0 ? (t.profit / t.revenue) * 100 : 0
    });

    const abc = assignABCCurveClasses(productSummary, grandRevenue);

    lastGrandTotals = {
        validOrders: validOrdersSet.size,
        cancelledOrders: cancelledCount,
        totalUnits: totalQty,
        revenue: grandRevenue,
        cost: grandCost,
        fees: grandFees,
        shipping: grandShipping,
        tax: grandTax,
        packaging: grandPackaging,
        ads: grandAds,
        extras: grandExtras,
        profit: grandProfit,
        margin: grandMargin,
        abc,
        channels: {
            shopee: serializeCh(chTotals.shopee),
            mercadolivre: serializeCh(chTotals.mercadolivre)
        }
    };

    document.getElementById('total-orders').textContent = validOrdersSet.size;
    document.getElementById('cancelled-orders').textContent = cancelledCount;
    document.getElementById('total-units').textContent = totalQty;
    document.getElementById('dash-revenue').textContent = fmt(grandRevenue);
    document.getElementById('dash-cost').textContent = fmt(grandCost);
    document.getElementById('dash-fees').textContent = fmt(grandFees);
    document.getElementById('dash-shipping').textContent = fmt(grandShipping);
    document.getElementById('dash-tax').textContent = fmt(grandTax);
    const extrasEl = document.getElementById('dash-extras');
    if (extrasEl) extrasEl.textContent = fmt(grandExtras);
    const extrasSubEl = document.getElementById('dash-extras-sub');
    if (extrasSubEl) extrasSubEl.textContent = `Emb: ${fmt(grandPackaging)} · Ads: ${fmt(grandAds)}`;
    document.getElementById('dash-profit').textContent = fmt(grandProfit);
    document.getElementById('dash-margin').textContent = `Margem: ${grandRevenue > 0 ? fmtPct(grandMargin) : '0%'}`;

    const profitCard = document.getElementById('stat-profit-card');
    if (profitCard) {
        profitCard.classList.remove('highlight', 'negative');
        profitCard.classList.add(grandProfit >= 0 ? 'highlight' : 'negative');
    }

    if (typeof computeMonthlyEvolution === 'function') computeMonthlyEvolution();
    updateKPIScorecardMeta(lastGrandTotals, taxPct, targetMargin);
    renderTable();
    if (typeof renderCurrentPacePanel === 'function' && activeWorkspaceTab === 'current') {
        renderCurrentPacePanel();
    }
    if (typeof renderAnalyticsSection === 'function') renderAnalyticsSection();
    if (hasPrimaryChannelData()) applyFocusFilterToDOM();
    updateWorkspaceChromeUI();
}

// ===== RENDERIZAR TABELA =====
function renderTable() {
    const tbody = document.getElementById('products-body');
    const tfoot = document.getElementById('products-footer');
    if (!tbody || !tfoot) return;
    const searchNorm = normalizeText(document.getElementById('search-input')?.value || '');
    const sort = document.getElementById('sort-filter')?.value || 'profit-desc';

    let items = Object.entries(productSummary).map(([key, p]) => ({ key, ...p }));

    if (activeProductQuickFilter === 'A' || activeProductQuickFilter === 'B' || activeProductQuickFilter === 'C') {
        items = items.filter(p => (p._abcClass || 'C') === activeProductQuickFilter);
    } else if (activeProductQuickFilter === 'low') {
        const tm = getTargetMarginPercent();
        items = items.filter(p => p._profit < 0 || (p._costUnit > 0 && p._margin < tm));
    } else if (activeProductQuickFilter === 'uncosted') {
        items = items.filter(p => (p._costUnit || 0) <= 0);
    }

    if (searchNorm) {
        items = items.filter(p =>
            normalizeText(p.productName).includes(searchNorm) ||
            normalizeText(p.modelKey).includes(searchNorm) ||
            [...p.skus].some(s => normalizeText(s).includes(searchNorm)) ||
            [...p.listingNames].some(n => normalizeText(n).includes(searchNorm))
        );
    }

    items.sort((a, b) => {
        switch (sort) {
            case 'profit-desc': return b._profit - a._profit;
            case 'revenue-desc': return b.totalRevenue - a.totalRevenue;
            case 'qty-desc': return b.totalQty - a.totalQty;
            case 'margin-desc': return b._margin - a._margin;
            case 'name': return a.productName.localeCompare(b.productName, 'pt-BR');
            case 'cost-desc': return b._costTotal - a._costTotal;
            default: return 0;
        }
    });

    renderedTableKeys = items.map(p => p.key);

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;color:var(--text-muted);padding:24px;">Nenhum produto encontrado.</td></tr>`;
    } else {
        tbody.innerHTML = items.map((p, i) => {
            const profitClass = p._profit >= 0 ? 'positive' : 'negative';
            const hasCost = p._costUnit > 0;
            const costDisplay = hasCost ? fmt(p._costUnit) : '⚠️ Definir';
            const ins = p._insight;
            const metaTags = [];
            const abcCls = p._abcClass || 'C';
            metaTags.push(`<span class="abc-badge abc-${abcCls}" title="Curva ${abcCls} (Pareto 80/20): ${fmtPct(p._revSharePct || 0)} da receita · Acum. ${fmtPct(p._cumRevPct || 0)}">Curva ${abcCls}</span>`);
            if (p.channels.has('shopee')) metaTags.push('<span class="channel-tag shopee">Shopee</span>');
            if (p.channels.has('mercadolivre')) metaTags.push('<span class="channel-tag ml">ML</span>');
            if (p.modelKey) metaTags.push(`<span style="font-size:0.7rem;color:var(--text-muted)">${escapeHtml(p.modelKey)}</span>`);
            if (groupingMode === 'model' && p.listingNames.size > 1) {
                metaTags.push(`<span style="font-size:0.7rem;color:var(--text-muted)">· ${p.listingNames.size} anúncios</span>`);
            }
            if (p.qtyWarnCount > 0) {
                metaTags.push(`<span class="badge-qty-warn" title="Pedido ML com valor alto em relação ao custo — clique na linha para conferir ou editar a Qtd">⚠️ Conferir Qtd (${p.qtyWarnCount})</span>`);
            }

            return `
            <tr data-idx="${i}" style="animation-delay:${i * 0.025}s">
                <td>
                    <div class="product-cell">
                        <span class="product-name">${escapeHtml(p.productName)}</span>
                        ${metaTags.length > 0 ? `<div class="product-meta-row">${metaTags.join('')}</div>` : ''}
                    </div>
                </td>
                <td class="td-num">${p.totalQty}</td>
                <td class="td-money td-revenue">${fmt(p.totalRevenue)}</td>
                <td class="td-money td-cost">
                    <span class="cost-editable" data-idx="${i}">
                        ${costDisplay} <span class="edit-icon">✏️</span>
                    </span>
                </td>
                <td class="td-money td-cost">${fmt(p._costTotal)}</td>
                <td class="td-money td-fees">${fmt(p._fees)}</td>
                <td class="td-money td-shipping">${fmt(p.totalShipping)}</td>
                <td class="td-money td-tax-val">${fmt(p._tax)}</td>
                <td class="td-money td-extras">${fmt(p._extras)}</td>
                <td class="td-money td-profit ${profitClass}">${fmt(p._profit)}</td>
                <td class="td-money"><span class="margin-badge ${profitClass}">${fmtPct(p._margin)}</span></td>
                <td class="td-insight">
                    <div class="insight-cell">
                        <span class="insight-badge ${ins.badgeClass}" title="${escapeHtml(ins.text)}">${ins.icon} ${ins.label}</span>
                        ${ins.recommended ? `<span class="insight-rec">Sugerido: <strong>${fmt(ins.recommended)}</strong></span>` : ''}
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    const totals = items.reduce((acc, p) => {
        acc.qty += p.totalQty;
        acc.revenue += p.totalRevenue;
        acc.cost += p._costTotal;
        acc.fees += p._fees;
        acc.shipping += p.totalShipping;
        acc.tax += p._tax;
        acc.extras += p._extras;
        acc.profit += p._profit;
        return acc;
    }, { qty: 0, revenue: 0, cost: 0, fees: 0, shipping: 0, tax: 0, extras: 0, profit: 0 });

    const totalMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;
    const profitClass = totals.profit >= 0 ? 'positive' : 'negative';

    tfoot.innerHTML = `
        <tr>
            <td>TOTAL (${items.length} produtos)</td>
            <td class="td-num">${totals.qty}</td>
            <td class="td-money td-revenue">${fmt(totals.revenue)}</td>
            <td class="td-money">—</td>
            <td class="td-money td-cost">${fmt(totals.cost)}</td>
            <td class="td-money td-fees">${fmt(totals.fees)}</td>
            <td class="td-money td-shipping">${fmt(totals.shipping)}</td>
            <td class="td-money td-tax-val">${fmt(totals.tax)}</td>
            <td class="td-money td-extras">${fmt(totals.extras)}</td>
            <td class="td-money td-profit ${profitClass}">${fmt(totals.profit)}</td>
            <td class="td-money"><span class="margin-badge ${profitClass}">${fmtPct(totalMargin)}</span></td>
            <td></td>
        </tr>`;
}

// ===== MOTOR DE INSIGHTS =====
function generateInsight(p, targetMargin = getTargetMarginPercent()) {
    const cost = p._costUnit;

    if (cost <= 0) {
        return { label: 'Sem custo', icon: '⚠️', badgeClass: 'warn', recommended: 0, text: 'Defina o custo do produto para calcular o lucro real' };
    }

    const margin = p._margin;
    const rec = p._recommendedPrice;
    const targetLabel = fmtPct(targetMargin);

    if (margin >= targetMargin) {
        return {
            label: 'Saudável',
            icon: '✅',
            badgeClass: 'ok',
            recommended: 0,
            text: `Margem ${fmtPct(margin)} atingiu a meta de ${targetLabel}`
        };
    }

    if (margin >= 0) {
        return {
            label: 'Ajustar preço',
            icon: '⬆️',
            badgeClass: 'warn',
            recommended: rec > 0 ? rec : 0,
            text: rec > 0
                ? `Aumentar preço para obter ${targetLabel} de margem líquida`
                : `Meta de ${targetLabel} inviável com as taxas e impostos atuais`
        };
    }

    return {
        label: 'Prejuízo',
        icon: '🔴',
        badgeClass: 'up',
        recommended: rec > 0 ? rec : 0,
        text: rec > 0
            ? 'Revisar preço urgentemente para eliminar prejuízo'
            : `Meta de ${targetLabel} inviável com as taxas e impostos atuais`
    };
}

// ===== MODAL DE DETALHES DO PRODUTO =====
function renderOrderQtyCell(o) {
    if (o.channel !== 'mercadolivre') {
        return `<td style="text-align:center;font-weight:700">${o.qty}</td>`;
    }
    let badgeHtml = '';
    if (o.qtySource === 'manual') {
        badgeHtml = '<span class="badge-qty-src manual" title="Editado manualmente (salvo no navegador)">Manual</span>';
    } else if (o.qtySource === 'perf') {
        badgeHtml = '<span class="badge-qty-src perf" title="Confirmado pelo Relatório de Desempenho ML">Desempenho</span>';
    } else if (o.qtySource === 'auto') {
        badgeHtml = '<span class="badge-qty-src auto" title="Detectado por múltiplo de preço no modelo">Auto</span>';
    } else if (o.needsQtyCheck) {
        badgeHtml = '<span class="badge-qty-src warn" title="Valor alto em relação ao custo unitário — confira a quantidade">?</span>';
    }
    return `<td style="text-align:center;white-space:nowrap;">
        <input type="number" class="qty-edit-input" data-order-id="${escapeHtml(o.orderId)}" value="${o.qty}" min="1" step="1" aria-label="Quantidade do pedido ${escapeHtml(o.orderId)}">
        ${badgeHtml}
    </td>`;
}

let currentDetailSimChannels = [];

function buildChannelSimEntry(channelKey, label, badgeClass, cs, p, taxRate) {
    const chTotalRev = lastGrandTotals?.channels?.[channelKey]?.revenue || 0;
    const chAdsBudget = channelKey === 'shopee' ? extraExpenses.adsShopee : extraExpenses.adsML;
    const adsAllocated = chTotalRev > 0 ? chAdsBudget * (cs.revenue / chTotalRev) : 0;
    return {
        key: channelKey,
        label,
        badgeClass,
        unitCost: p._costUnit,
        shippingPerUnit: cs.qty > 0 ? cs.shipping / cs.qty : 0,
        packagingPerUnit: extraExpenses.packagingPerUnit,
        taxRate,
        feeRate: cs.revenue > 0 ? cs.fees / cs.revenue : 0,
        adsRate: cs.revenue > 0 ? adsAllocated / cs.revenue : 0,
        avgPrice: cs.qty > 0 ? cs.revenue / cs.qty : 0
    };
}

function renderDetailSimulatorPanel(p, simEntries, initialMarginPct) {
    if (p._costUnit <= 0) {
        return `<div class="sim-panel"><p style="font-size:0.8rem;color:var(--yellow);">⚠️ Defina o custo unitário deste produto para habilitar o simulador de preço ideal por canal.</p></div>`;
    }
    const targetRate = initialMarginPct / 100;
    const cardsHtml = simEntries.map(ch => {
        const breakeven = computeRecommendedPrice({ ...ch, targetMarginRate: 0 });
        const ideal = computeRecommendedPrice({ ...ch, targetMarginRate: targetRate });
        const profitPerUnit = ideal > 0 ? ideal * targetRate : 0;
        const pctTotal = (ch.feeRate + ch.adsRate + ch.taxRate) * 100;
        return `
            <div class="sim-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span class="channel-tag ${ch.badgeClass}">${ch.label}</span>
                    <span style="font-size:0.74rem;color:var(--text-muted);">Atual: <strong>${fmt(ch.avgPrice)}</strong></span>
                </div>
                <div style="font-size:0.74rem;color:var(--text-secondary);margin-bottom:6px;">
                    Var. (${fmtPct(pctTotal)}) · Frete/un: ${fmt(ch.shippingPerUnit)} · Equilíbrio: <strong>${breakeven > 0 ? fmt(breakeven) : 'Inviável'}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--border-color);padding-top:6px;">
                    <span style="font-size:0.76rem;color:var(--text-secondary);">Preço Ideal:</span>
                    <span data-sim-price="${ch.key}" style="font-size:1.05rem;font-weight:800;color:${ideal > 0 ? 'var(--green)' : 'var(--red)'};">
                        ${ideal > 0 ? fmt(ideal) : 'Inviável'}
                    </span>
                </div>
                <div style="text-align:right;font-size:0.72rem;color:var(--text-muted);" data-sim-profit="${ch.key}">
                    ${ideal > 0 ? `Lucro estimado/un: ${fmt(profitPerUnit)}` : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="sim-panel">
            <div class="sim-header">
                <strong style="font-size:0.86rem;">🎯 Simulador de Preço Ideal por Canal</strong>
                <div class="sim-slider-wrap">
                    <label for="sim-margin-range">Margem desejada:</label>
                    <input id="sim-margin-range" type="range" class="sim-margin-slider" min="1" max="60" step="1" value="${Math.round(initialMarginPct)}">
                    <strong id="sim-margin-label" style="min-width:36px;color:var(--shopee-orange);">${Math.round(initialMarginPct)}%</strong>
                </div>
            </div>
            <div class="sim-cards">${cardsHtml}</div>
        </div>
    `;
}

function updateDetailSimulator(marginPct) {
    const labelEl = document.getElementById('sim-margin-label');
    if (labelEl) labelEl.textContent = `${marginPct}%`;
    const targetRate = marginPct / 100;
    currentDetailSimChannels.forEach(ch => {
        const ideal = computeRecommendedPrice({ ...ch, targetMarginRate: targetRate });
        const priceEl = document.querySelector(`[data-sim-price="${ch.key}"]`);
        const profitEl = document.querySelector(`[data-sim-profit="${ch.key}"]`);
        if (priceEl) {
            priceEl.textContent = ideal > 0 ? fmt(ideal) : 'Inviável';
            priceEl.style.color = ideal > 0 ? 'var(--green)' : 'var(--red)';
        }
        if (profitEl) {
            profitEl.textContent = ideal > 0 ? `Lucro estimado/un: ${fmt(ideal * targetRate)}` : '';
        }
    });
}

function showDetail(key) {
    const p = findProductSummaryEntry(key);
    if (!p) return;

    currentDetailKey = p.productName;
    document.getElementById('modal-title').textContent = p.productName;

    const listingsHtml = (groupingMode === 'model' && p.listingNames.size > 1)
        ? `<p style="font-size:0.76rem;color:var(--text-muted);margin-bottom:14px;">Anúncios agrupados (${p.listingNames.size}): ${[...p.listingNames].map(n => escapeHtml(n)).join(' · ')}</p>`
        : '';

    const taxRate = getTaxRatePercent() / 100;
    currentDetailSimChannels = [];
    if (p.channelStats?.shopee?.qty > 0) {
        currentDetailSimChannels.push(buildChannelSimEntry('shopee', 'Shopee', 'shopee', p.channelStats.shopee, p, taxRate));
    }
    if (p.channelStats?.mercadolivre?.qty > 0) {
        currentDetailSimChannels.push(buildChannelSimEntry('mercadolivre', 'Mercado Livre', 'ml', p.channelStats.mercadolivre, p, taxRate));
    }
    const simHtml = renderDetailSimulatorPanel(p, currentDetailSimChannels, getTargetMarginPercent());

    document.getElementById('modal-body').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px">
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Receita</div>
                <div style="font-size:1.2rem;font-weight:800;color:var(--yellow)">${fmt(p.totalRevenue)}</div>
            </div>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Lucro (${p.totalQty} unid.)</div>
                <div style="font-size:1.2rem;font-weight:800;color:${p._profit >= 0 ? 'var(--green)' : 'var(--red)'}">${fmt(p._profit)}</div>
                ${p._extras > 0 ? `<div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px;">Já deduz ${fmt(p._extras)} de Emb. + Ads</div>` : ''}
            </div>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Margem</div>
                <div style="font-size:1.2rem;font-weight:800;color:${p._margin >= 0 ? 'var(--green)' : 'var(--red)'}">${fmtPct(p._margin)}</div>
            </div>
        </div>
        ${listingsHtml}
        ${simHtml}
        <h3 style="font-size:0.85rem;margin-bottom:12px;color:var(--text-secondary)">Pedidos (${p.orders.length})</h3>
        <table class="detail-table">
            <thead><tr>
                <th>Canal</th><th>Pedido</th><th>Data</th><th>Variação / SKU</th><th style="text-align:center">Qtd</th>
                <th style="text-align:right">Receita</th><th style="text-align:right">Com./Tarifa</th>
                <th style="text-align:right">Serv./Desc.</th><th style="text-align:right">Frete</th>
            </tr></thead>
            <tbody>
                ${p.orders.map(o => `
                    <tr>
                        <td><span class="channel-tag ${o.channel === 'shopee' ? 'shopee' : 'ml'}">${o.channel === 'shopee' ? 'Shopee' : 'ML'}</span></td>
                        <td style="font-size:0.75rem;color:var(--text-muted)">${escapeHtml(o.orderId)}</td>
                        <td style="font-size:0.8rem">${escapeHtml(o.date)}</td>
                        <td style="font-size:0.8rem" title="${escapeHtml(o.productName)}">${escapeHtml(o.variation || o.sku || '—')}</td>
                        ${renderOrderQtyCell(o)}
                        <td style="text-align:right;color:var(--yellow)">${fmt(o.subtotal)}</td>
                        <td style="text-align:right;color:var(--purple)">${fmt(o.itemCommission)}</td>
                        <td style="text-align:right;color:var(--purple)">${fmt(o.itemServiceFee)}</td>
                        <td style="text-align:right;color:var(--blue)">${fmt(o.itemShipping)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;

    document.getElementById('detail-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detail-modal').style.display = 'none';
    currentDetailKey = null;
}

// ===== MODAL DE EDIÇÃO DE CUSTO =====
function openCostEdit(key) {
    const summaryEntry = findProductSummaryEntry(key);
    const mappedEntry = findMappedCostEntry(key);
    const modelRule = findModelRuleByName(key);
    const displayName = summaryEntry?.productName || mappedEntry?.key || modelRule?.canonicalName || String(key || '').trim();
    const defaultCost = getMappedCost(displayName, summaryEntry?.canonicalName, summaryEntry?.defaultCost || 0);
    const currentCost = getCost(displayName, summaryEntry?.canonicalName, summaryEntry?.defaultCost || 0);

    editingProduct = displayName;

    document.getElementById('cost-modal-body').innerHTML = `
        <p style="color:var(--text-secondary);margin-bottom:12px;font-size:0.88rem;font-weight:600">${escapeHtml(displayName)}</p>
        <label for="cost-edit-input" style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:8px;font-weight:600">
            Custo unitário (R$)
        </label>
        <input type="number" id="cost-edit-input" class="cost-input" value="${currentCost.toFixed(2)}" step="0.01" min="0" autofocus>
        <p style="color:var(--text-muted);font-size:0.72rem;margin-top:8px">
            Custo padrão cadastrado: ${fmt(defaultCost)}
        </p>`;

    const inputEl = document.getElementById('cost-edit-input');
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveCost();
        }
    });

    document.getElementById('cost-modal').style.display = 'flex';
    setTimeout(() => inputEl.select(), 100);
}

function closeCostModal() {
    document.getElementById('cost-modal').style.display = 'none';
    editingProduct = null;
}

function saveCost() {
    if (!editingProduct) return;
    const raw = document.getElementById('cost-edit-input').value;
    const val = parseFloat(String(raw).replace(',', '.'));
    if (!Number.isFinite(val) || val < 0) {
        showToast('Informe um custo unitário válido (maior ou igual a zero).', 'warn');
        return;
    }

    setCustomCostValue(editingProduct, val);
    saveCustomCosts();
    recomputeAfterMetadataChange({ persistCurrent: false });
    closeCostModal();

    if (document.getElementById('all-costs-modal').style.display !== 'none') {
        renderAllCostsTable();
    }
    showToast('Custo atualizado com sucesso!', 'success');
}

// ===== EXPORTAÇÃO PDF RELATÓRIO COMPLETO COM KPIS =====
function exportPDF() {
    showToast('Gerando PDF do relatório...', 'info');

    if (typeof html2pdf === 'undefined') {
        window.print();
        return;
    }

    const container = document.createElement('div');
    container.id = 'pdf-render-wrapper';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '1100px';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.style.background = '#ffffff';
    container.style.padding = '0';

    const taxRate = getTaxRatePercent();
    const targetMargin = getTargetMarginPercent();
    const now = new Date().toLocaleDateString('pt-BR');

    const totalOrders = document.getElementById('total-orders').textContent;
    const cancelledOrders = document.getElementById('cancelled-orders').textContent;
    const totalUnits = document.getElementById('total-units').textContent;
    const rev = document.getElementById('dash-revenue').textContent;
    const cost = document.getElementById('dash-cost').textContent;
    const fees = document.getElementById('dash-fees').textContent;
    const shipping = document.getElementById('dash-shipping').textContent;
    const tax = document.getElementById('dash-tax').textContent;
    const extras = document.getElementById('dash-extras')?.textContent || fmt(0);
    const extrasSub = document.getElementById('dash-extras-sub')?.textContent || '';
    const profit = document.getElementById('dash-profit').textContent;
    const margin = document.getElementById('dash-margin').textContent;

    const isNegativeProfit = profit.includes('-');
    const channelLabel = activeChannel === 'shopee'
        ? 'Shopee'
        : (activeChannel === 'mercadolivre' ? 'Mercado Livre' : 'Shopee + Mercado Livre');
    const groupLabel = groupingMode === 'model' ? 'Por Modelo' : 'Por Anúncio';
    const items = Object.values(productSummary).sort((a, b) => b._profit - a._profit);
    const pdfTotals = items.reduce((acc, p) => {
        acc.qty += p.totalQty;
        acc.revenue += p.totalRevenue;
        acc.cost += p._costTotal;
        acc.fees += p._fees;
        acc.shipping += p.totalShipping;
        acc.tax += p._tax;
        acc.extras += p._extras;
        acc.profit += p._profit;
        return acc;
    }, { qty: 0, revenue: 0, cost: 0, fees: 0, shipping: 0, tax: 0, extras: 0, profit: 0 });
    const pdfTotalMargin = pdfTotals.revenue > 0 ? (pdfTotals.profit / pdfTotals.revenue) * 100 : 0;
    const pdfTotalProfitClass = pdfTotals.profit >= 0 ? 'txt-green' : 'txt-red';

    let html = `
        <div id="pdf-export-scope" style="background:#ffffff; color:#111111; padding:20px; font-family:Arial, sans-serif; width:1060px;">
            <style>
                #pdf-export-scope, #pdf-export-scope * {
                    box-sizing: border-box !important;
                    font-family: Arial, Helvetica, sans-serif !important;
                    color: #111111;
                }
                #pdf-export-scope h1 { color: #DC2626 !important; margin: 0 !important; font-size: 20px !important; font-weight: bold !important; }
                #pdf-export-scope .pdf-badge { background: #FEF2F2 !important; border: 1px solid #FECACA !important; color: #B91C1C !important; padding: 4px 10px !important; border-radius: 4px !important; font-size: 11px !important; font-weight: bold !important; display: inline-block !important; margin-top: 4px !important; }
                #pdf-export-scope .pdf-meta { color: #52525B !important; font-size: 11px !important; text-align: right !important; }
                #pdf-export-scope .pdf-meta strong { color: #111113 !important; }
                #pdf-export-scope .pdf-summary-bar { display: flex !important; gap: 16px !important; margin-bottom: 14px !important; background: #F4F5F7 !important; border: 1px solid #D4D4D8 !important; padding: 8px 16px !important; border-radius: 6px !important; font-size: 11px !important; justify-content: space-around !important; font-weight: bold !important; }
                #pdf-export-scope .pdf-kpi-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; margin-bottom: 16px !important; }
                #pdf-export-scope .pdf-kpi-card { background: #FAFAFA !important; border: 1px solid #E4E4E7 !important; border-radius: 6px !important; padding: 10px !important; }
                #pdf-export-scope .pdf-kpi-title { font-size: 9px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: bold !important; }
                #pdf-export-scope .pdf-kpi-val { font-size: 16px !important; font-weight: bold !important; margin-top: 2px !important; }
                #pdf-export-scope table { width: 100% !important; border-collapse: collapse !important; margin-top: 8px !important; font-size: 9px !important; }
                #pdf-export-scope thead { display: table-header-group !important; }
                #pdf-export-scope tr { page-break-inside: avoid !important; break-inside: avoid !important; }
                #pdf-export-scope th { background-color: #111113 !important; color: #ffffff !important; padding: 6px 5px !important; font-weight: bold !important; text-align: left !important; border: 1px solid #111113 !important; }
                #pdf-export-scope th.num { text-align: center !important; }
                #pdf-export-scope th.right { text-align: right !important; }
                #pdf-export-scope td { padding: 5px 5px !important; border-bottom: 1px solid #E4E4E7 !important; color: #18181B !important; font-size: 9px !important; background: transparent !important; }
                #pdf-export-scope tbody tr:nth-child(even) td { background-color: #FAFAFA !important; }
                #pdf-export-scope tfoot td { background-color: #F4F5F7 !important; border-top: 2px solid #A1A1AA !important; font-weight: bold !important; color: #111113 !important; }
                #pdf-export-scope .txt-green { color: #059669 !important; font-weight: bold !important; }
                #pdf-export-scope .txt-red { color: #DC2626 !important; font-weight: bold !important; }
                #pdf-export-scope .txt-purple { color: #7C3AED !important; }
                #pdf-export-scope .txt-blue { color: #2563EB !important; }
                #pdf-export-scope .txt-orange { color: #111113 !important; }
            </style>

            <div style="border-bottom:2px solid #DC2626; padding-bottom:10px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h1>Calculadora de Lucro Real — South Team</h1>
                    <div class="pdf-badge">
                        📅 ${escapeHtml(currentPeriodText.toUpperCase())} · ${escapeHtml(channelLabel.toUpperCase())} · ${escapeHtml(groupLabel.toUpperCase())}
                    </div>
                </div>
                <div class="pdf-meta">
                    <div>Data de Emissão: <strong>${escapeHtml(now)}</strong></div>
                    <div style="margin-top:2px;">Imposto: <strong>${taxRate}%</strong> · Margem Alvo: <strong>${targetMargin}%</strong></div>
                </div>
            </div>

            <!-- Resumo de Pedidos -->
            <div class="pdf-summary-bar">
                <div>Pedidos Válidos: <span class="txt-green">${escapeHtml(totalOrders)}</span></div>
                <div>Cancelados/Devolvidos: <span class="txt-red">${escapeHtml(cancelledOrders)}</span></div>
                <div>Unidades Vendidas: <span class="txt-blue">${escapeHtml(totalUnits)}</span></div>
            </div>

            <!-- KPIs Financeiros -->
            <div class="pdf-kpi-grid">
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Receita Bruta</div>
                    <div class="pdf-kpi-val txt-orange">${escapeHtml(rev)}</div>
                </div>
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Custo Produtos</div>
                    <div class="pdf-kpi-val txt-red">${escapeHtml(cost)}</div>
                </div>
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Taxas Marketplace</div>
                    <div class="pdf-kpi-val txt-purple">${escapeHtml(fees)}</div>
                </div>
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Frete Vendedor</div>
                    <div class="pdf-kpi-val txt-blue">${escapeHtml(shipping)}</div>
                </div>
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Imposto (${taxRate}%)</div>
                    <div class="pdf-kpi-val txt-orange">${escapeHtml(tax)}</div>
                </div>
                <div class="pdf-kpi-card">
                    <div class="pdf-kpi-title">Despesas Extras (Emb. + Ads)</div>
                    <div class="pdf-kpi-val txt-orange">${escapeHtml(extras)}</div>
                    <div style="font-size:8px; color:#64748b; margin-top:2px;">${escapeHtml(extrasSub)}</div>
                </div>
                <div class="pdf-kpi-card" style="grid-column: 1 / -1; background:${isNegativeProfit ? '#fef2f2' : '#f0fdf4'} !important; border-color:${isNegativeProfit ? '#fecaca' : '#bbf7d0'} !important;">
                    <div class="pdf-kpi-title" style="color:${isNegativeProfit ? '#991b1b' : '#166534'} !important;">Lucro Líquido Real (${escapeHtml(margin)})</div>
                    <div class="pdf-kpi-val ${isNegativeProfit ? 'txt-red' : 'txt-green'}">${escapeHtml(profit)}</div>
                </div>
            </div>

            <h3 style="font-size:12px; font-weight:bold; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px; color:#0f172a;">Detalhamento por Produto</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width:24%;">Produto</th>
                        <th class="num" style="width:4%;">Qtd</th>
                        <th class="right" style="width:9%;">Receita</th>
                        <th class="right" style="width:7%;">Custo Un.</th>
                        <th class="right" style="width:9%;">Custo Tot.</th>
                        <th class="right" style="width:8%;">Taxas</th>
                        <th class="right" style="width:7%;">Frete</th>
                        <th class="right" style="width:7%;">Imposto</th>
                        <th class="right" style="width:7%;">Emb.+Ads</th>
                        <th class="right" style="width:8%;">Lucro</th>
                        <th class="num" style="width:6%;">Margem</th>
                        <th class="num" style="width:14%;">Insight</th>
                    </tr>
                </thead>
                <tbody>
    `;

    items.forEach((p) => {
        const profitClass = p._profit >= 0 ? 'txt-green' : 'txt-red';
        const ins = p._insight;
        const insText = ins.label + (ins.recommended ? ` (${fmt(ins.recommended)})` : '');
        const chTag = p.channels
            ? [p.channels.has('shopee') ? 'Shopee' : '', p.channels.has('mercadolivre') ? 'ML' : ''].filter(Boolean).join('+')
            : '';

        html += `
            <tr>
                <td style="font-weight:600; color:#0f172a;">${escapeHtml(p.productName)}${chTag ? ` <span style="font-size:7px; color:#64748b; font-weight:normal;">[${escapeHtml(chTag)}]</span>` : ''}</td>
                <td style="text-align:center; font-weight:bold;">${p.totalQty}</td>
                <td style="text-align:right;">${fmt(p.totalRevenue)}</td>
                <td style="text-align:right;">${fmt(p._costUnit)}</td>
                <td style="text-align:right;">${fmt(p._costTotal)}</td>
                <td style="text-align:right; color:#9333ea;">${fmt(p._fees)}</td>
                <td style="text-align:right; color:#2563eb;">${fmt(p.totalShipping)}</td>
                <td style="text-align:right; color:#ea580c;">${fmt(p._tax)}</td>
                <td style="text-align:right; color:#b45309;">${fmt(p._extras)}</td>
                <td style="text-align:right;" class="${profitClass}">${fmt(p._profit)}</td>
                <td style="text-align:center;" class="${profitClass}">${fmtPct(p._margin)}</td>
                <td style="text-align:center; font-size:8px;">${escapeHtml(insText)}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
                <tfoot>
                    <tr>
                        <td>TOTAL (${items.length} produtos)</td>
                        <td style="text-align:center;">${pdfTotals.qty}</td>
                        <td style="text-align:right;">${fmt(pdfTotals.revenue)}</td>
                        <td style="text-align:right;">—</td>
                        <td style="text-align:right;">${fmt(pdfTotals.cost)}</td>
                        <td style="text-align:right; color:#9333ea;">${fmt(pdfTotals.fees)}</td>
                        <td style="text-align:right; color:#2563eb;">${fmt(pdfTotals.shipping)}</td>
                        <td style="text-align:right; color:#ea580c;">${fmt(pdfTotals.tax)}</td>
                        <td style="text-align:right; color:#b45309;">${fmt(pdfTotals.extras)}</td>
                        <td style="text-align:right;" class="${pdfTotalProfitClass}">${fmt(pdfTotals.profit)}</td>
                        <td style="text-align:center;" class="${pdfTotalProfitClass}">${fmtPct(pdfTotalMargin)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    container.innerHTML = html;
    document.body.appendChild(container);

    const safePeriodFilename = currentPeriodText.replace(/[^\w\u00C0-\u00FF-]+/g, '_');
    const channelSlug = activeChannel === 'all' ? 'Consolidado' : (activeChannel === 'shopee' ? 'Shopee' : 'MercadoLivre');
    const opt = {
        margin: [6, 6, 6, 6],
        filename: `Relatorio_Lucro_${channelSlug}_${safePeriodFilename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    requestAnimationFrame(() => requestAnimationFrame(() => {
        html2pdf().set(opt).from(container.firstElementChild).save().then(() => {
            showToast('PDF gerado com sucesso!', 'success');
            if (document.body.contains(container)) document.body.removeChild(container);
        }).catch(err => {
            console.error('Erro html2pdf:', err);
            if (document.body.contains(container)) document.body.removeChild(container);
            window.print();
        });
    }));
}

// ===== FUNÇÕES AUXILIARES =====
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function fmtPct(v) { return v.toFixed(1).replace('.', ',') + '%'; }

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showLoading(show) {
    document.getElementById('loading-screen').style.display = show ? 'flex' : 'none';
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✗', info: 'ℹ', warn: '⚠️' };
    toast.innerHTML = `<span style="font-size:1.1rem">${icons[type] || 'ℹ'}</span> <span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== MODAL DE TABELA GERAL DE CUSTOS =====
function setCostModalView(view) {
    costModalView = view === 'all' ? 'all' : 'model';
    document.getElementById('cost-view-model')?.classList.toggle('active', costModalView === 'model');
    document.getElementById('cost-view-all')?.classList.toggle('active', costModalView === 'all');
    renderAllCostsTable();
}

function getAllCostEntries(viewMode = costModalView) {
    const map = new Map();
    const upsertEntry = (name, canonicalName, defaultCost, inCatalog, skuPrefix = '') => {
        const norm = normalizeCostKey(name);
        if (!norm) return;
        const prev = map.get(norm);
        if (!prev) {
            map.set(norm, { name, canonicalName, defaultCost, inCatalog, skuPrefix });
        } else if (skuPrefix && !prev.skuPrefix) {
            prev.skuPrefix = skuPrefix;
        }
    };

    // 1. Regras customizadas de SKU (prioritárias) e Modelos canônicos
    customSkuRules.forEach(rule => {
        upsertEntry(rule.canonicalName, rule.canonicalName, rule.defaultCost, true, rule.prefix);
    });
    SKU_MODEL_RULES.forEach(rule => {
        upsertEntry(rule.canonicalName, rule.canonicalName, rule.defaultCost, true, rule.skuPrefixes.join(', '));
    });

    // 2. Produtos ou modelos carregados na visão atual
    Object.values(productSummary).forEach(p => {
        const displayName = viewMode === 'model' ? (p.canonicalName || p.productName) : p.productName;
        const defaultCost = getMappedCost(displayName, p.canonicalName, p.defaultCost);
        const inCatalog = Boolean(
            findMappedCostEntry(displayName) ||
            findModelRuleByName(displayName) ||
            p.defaultCost > 0
        );
        const skuHint = p.modelKey || [...p.skus].slice(0, 3).join(', ');
        upsertEntry(displayName, p.canonicalName, defaultCost, inCatalog, skuHint);
    });

    // 3. No modo "Todos / Variações", inclui também todas as variações do COST_MAP e custos personalizados soltos
    if (viewMode === 'all') {
        Object.entries(COST_MAP).forEach(([name, defaultCost]) => {
            upsertEntry(name, '', defaultCost, true);
        });
        Object.keys(customCosts).forEach(name => {
            upsertEntry(name, '', 0, false);
        });
    }

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function openAllCostsModal() {
    document.getElementById('all-costs-modal').style.display = 'flex';
    document.getElementById('all-costs-search').value = '';
    document.getElementById('cost-view-model')?.classList.toggle('active', costModalView === 'model');
    document.getElementById('cost-view-all')?.classList.toggle('active', costModalView === 'all');
    renderAllCostsTable();
}

function closeAllCostsModal() {
    document.getElementById('all-costs-modal').style.display = 'none';
}

function renderAllCostsTable() {
    const search = normalizeText(document.getElementById('all-costs-search').value || '');
    const container = document.getElementById('all-costs-list');
    renderCustomSkuRulesBar();

    const allEntries = getAllCostEntries(costModalView);
    const titleElem = document.getElementById('all-costs-title');
    if (titleElem) {
        const modeLabel = costModalView === 'model' ? 'Modelos' : 'Todos / Variações';
        titleElem.textContent = `🏷️ Tabela de Custos — ${modeLabel} (${allEntries.length})`;
    }

    const entries = search
        ? allEntries.filter(e =>
            normalizeText(e.name).includes(search) ||
            normalizeText(e.skuPrefix || '').includes(search)
        )
        : allEntries;

    if (entries.length === 0) {
        renderedCostKeys = [];
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">Nenhum produto encontrado.</p>`;
        return;
    }

    renderedCostKeys = entries.map(e => e.name);

    let html = `
        <table class="detail-table" style="font-size:0.82rem;">
            <thead>
                <tr>
                    <th style="text-align:left;">Produto / Modelo</th>
                    <th style="text-align:right; width:120px;">Custo Padrão</th>
                    <th style="text-align:right; width:140px;">Custo Atual</th>
                    <th style="text-align:center; width:90px;">Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    entries.forEach((entry, idx) => {
        const currentCost = getCost(entry.name, entry.canonicalName, entry.defaultCost);
        const isCustom = findCustomCostKey(entry.name) !== null ||
            (entry.canonicalName && findCustomCostKey(entry.canonicalName) !== null);

        html += `
            <tr>
                <td style="font-weight:500;">
                    <div>${escapeHtml(entry.name)} ${!entry.inCatalog ? '<span class="badge-unlisted">Novo</span>' : ''}</div>
                    ${entry.skuPrefix ? `<div style="font-size:0.71rem;color:var(--text-muted);margin-top:2px;">SKU: ${escapeHtml(entry.skuPrefix)}</div>` : ''}
                </td>
                <td style="text-align:right; color:var(--text-muted);">${fmt(entry.defaultCost)}</td>
                <td style="text-align:right; font-weight:700; color:${isCustom ? 'var(--yellow)' : 'var(--text-primary)'};">
                    ${fmt(currentCost)} ${isCustom ? '⭐' : ''}
                </td>
                <td style="text-align:center;">
                    <button type="button" class="btn btn-outline" data-edit-cost-idx="${idx}" style="padding:4px 8px; font-size:0.75rem;">
                        ✏️ Editar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function resetAllCostsToDefault() {
    if (confirm('Deseja realmente restaurar todos os custos para o padrão cadastrado?')) {
        customCosts = {};
        saveCustomCosts();
        recomputeAfterMetadataChange({ persistCurrent: false });
        renderAllCostsTable();
        showToast('Custos restaurados para o padrão!', 'success');
    }
}

// ===== MODAL DE INFORMAÇÕES E REGRAS DE CÁLCULO =====
function openInfoModal() {
    document.getElementById('info-modal').style.display = 'flex';
}

function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

// ===== PUBLICAÇÃO EM NUVEM (SNAPSHOT 24H) =====
async function publishToCloudAction() {
    if (typeof isViewerMode !== 'undefined' && isViewerMode) return;
    if (typeof dbPublishToCloud !== 'function') return;

    const btn1 = document.getElementById('btn-publish-cloud');
    const btn2 = document.getElementById('btn-modal-publish-cloud');
    if (btn1) btn1.disabled = true;
    if (btn2) btn2.disabled = true;

    showToast('☁️ Gerando snapshot e publicando no GitHub...', 'info');
    try {
        const res = await dbPublishToCloud();
        if (res && res.ok) {
            showToast(`🎉 Publicação concluída! ${res.result?.ordersCount || ''} pedidos online 24h no GitHub.`, 'success');
        } else {
            showToast('Erro ao publicar: ' + (res?.error || 'falha desconhecida'), 'error');
        }
    } catch (err) {
        showToast('Falha na publicação: ' + err.message, 'error');
    } finally {
        if (btn1) btn1.disabled = false;
        if (btn2) btn2.disabled = false;
    }
}

// Fechar modais com a tecla ESC (prioriza fechar o modal de edição caso esteja sobreposto)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('cost-modal').style.display !== 'none') {
            closeCostModal();
            return;
        }
        closeModal();
        closeAllCostsModal();
        closeInfoModal();
        if (typeof closeCancelledModal === 'function') closeCancelledModal();
        if (typeof closeSnapshotsModal === 'function') closeSnapshotsModal();
    }
});
