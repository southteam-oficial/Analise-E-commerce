// ===== ANALYTICS, MOTOR DE AUDITORIA, CURVA ABC, INTELIGÊNCIA FINANCEIRA & EXCEL =====

let analyticsCollapsed = false;
let analyticsProductKeys = [];
let overviewProductKeys = [];
let auditActionTargets = [];
let activeAuditSeverity = 'ALL';
let selectedTrendMetrics = ['revenue', 'profit'];
let activeOverviewTopTab = 'profit';

const TREND_METRICS_CONFIG = {
    revenue: { label: 'Receita Bruta', kind: 'money', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)' },
    profit: { label: 'Lucro Líquido', kind: 'money', color: '#111113', bg: 'rgba(17, 17, 19, 0.06)' },
    orders: { label: 'Pedidos Pagos', kind: 'count', color: '#059669', bg: 'rgba(5, 150, 105, 0.08)' },
    cancelled: { label: 'Cancel./Retidos', kind: 'count', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)' }
};

const analyticsChartRegistry = {};

function destroyAnalyticsChart(canvasId) {
    if (analyticsChartRegistry[canvasId]) {
        try { analyticsChartRegistry[canvasId].destroy(); } catch {}
        delete analyticsChartRegistry[canvasId];
    }
    if (typeof Chart !== 'undefined' && typeof Chart.getChart === 'function') {
        const existing = Chart.getChart(canvasId);
        if (existing) {
            try { existing.destroy(); } catch {}
        }
    }
}

function formatCompactBrlTick(value) {
    const n = Number(value) || 0;
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    if (abs >= 1000) {
        return `${sign}R$ ${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1).replace('.', ',')}k`;
    }
    return `${sign}R$ ${Math.round(abs)}`;
}

const SEVERITY_META = {
    CRITICO: { label: 'Crítico', rank: 0 },
    ALTO: { label: 'Alto', rank: 1 },
    MEDIO: { label: 'Médio', rank: 2 },
    BAIXO: { label: 'Baixo', rank: 3 }
};

const MP_PAYMENT_LABELS = {
    credit_card: 'Cartão de Crédito',
    bank_transfer: 'Pix / Transferência',
    account_money: 'Saldo Mercado Pago',
    debit_card: 'Cartão de Débito',
    digital_currency: 'Crédito / Linha MP',
    ticket: 'Boleto Bancário',
    other: 'Outros'
};

function toggleAnalyticsSection() {
    analyticsCollapsed = !analyticsCollapsed;
    const content = document.getElementById('analytics-content');
    const btn = document.getElementById('btn-toggle-analytics');
    if (content) content.style.display = analyticsCollapsed ? 'none' : '';
    if (btn) btn.textContent = analyticsCollapsed ? 'Mostrar' : 'Ocultar';
}

function classifyMLCancelledStatus(rawStatus) {
    const norm = normalizeText(rawStatus || '');
    if (norm.includes('refunded') || norm.includes('reembols') || norm.includes('devolv')) return 'refunded';
    if (norm.includes('rejected') || norm.includes('recus')) return 'rejected';
    return 'cancelled';
}

function computeFinancialIntelligence() {
    const shOrders = (rawOrders || []).filter(o => o.channel === 'shopee');
    const mlOrders = (rawOrders || []).filter(o => o.channel === 'mercadolivre');
    const cancelled = activeCancelledOrders || [];

    // 1. Shopee Receita & Subsídios Comerciais
    const shOrderIds = new Set();
    const shopee = {
        orders: 0,
        revenue: 0,
        commission: 0,
        serviceFee: 0,
        fees: 0,
        shipping: 0,
        sellerCoupon: 0,
        sellerDiscount: 0,
        pixAdj: 0,
        actionAdj: 0
    };
    shOrders.forEach(o => {
        shOrderIds.add(o.orderId);
        shopee.revenue += o.subtotal || 0;
        shopee.commission += o.itemCommission || 0;
        shopee.serviceFee += o.itemServiceFee || 0;
        shopee.fees += o.itemFees || 0;
        shopee.shipping += o.itemShipping || 0;
        shopee.sellerCoupon += o.sellerCoupon || 0;
        shopee.sellerDiscount += o.sellerDiscount || 0;
        shopee.pixAdj += o.pixAdj || 0;
        shopee.actionAdj += o.actionAdj || 0;
    });
    shopee.orders = shOrderIds.size;

    // 2. Mercado Pago: Meios de Pagamento, Parcelamento e Prazo de Liberação (D+)
    const mlOrderIds = new Set();
    const mpPayMap = new Map();
    const mp = {
        orders: 0,
        revenue: 0,
        netReceived: 0,
        fees: 0,
        shipping: 0,
        financingFee: 0,
        couponFee: 0,
        inst1xCount: 0,
        inst1xRev: 0,
        instMultiCount: 0,
        instMultiRev: 0,
        maxInstallments: 0,
        releaseCount: 0,
        releaseSum: 0,
        releaseMin: Infinity,
        releaseMax: 0,
        releaseAvg: 0,
        paymentMethods: []
    };

    mlOrders.forEach(o => {
        mlOrderIds.add(o.orderId);
        const rev = o.subtotal || 0;
        const payKey = (o.paymentType || 'other').trim() || 'other';
        const inst = Math.max(1, Math.round(o.installments || 1));

        mp.revenue += rev;
        mp.netReceived += o.netReceived || 0;
        mp.fees += o.itemFees || 0;
        mp.shipping += o.itemShipping || 0;
        mp.financingFee += o.financingFee || 0;
        mp.couponFee += o.couponFee || 0;

        if (inst > mp.maxInstallments) mp.maxInstallments = inst;
        if (inst === 1) {
            mp.inst1xCount += 1;
            mp.inst1xRev += rev;
        } else {
            mp.instMultiCount += 1;
            mp.instMultiRev += rev;
        }

        if (Number.isFinite(o.releaseDays) && o.releaseDays >= 0) {
            mp.releaseCount += 1;
            mp.releaseSum += o.releaseDays;
            if (o.releaseDays < mp.releaseMin) mp.releaseMin = o.releaseDays;
            if (o.releaseDays > mp.releaseMax) mp.releaseMax = o.releaseDays;
        }

        if (!mpPayMap.has(payKey)) {
            mpPayMap.set(payKey, {
                key: payKey,
                label: MP_PAYMENT_LABELS[payKey] || payKey,
                count: 0,
                revenue: 0,
                revPct: 0,
                instSum: 0
            });
        }
        const entry = mpPayMap.get(payKey);
        entry.count += 1;
        entry.revenue += rev;
        entry.instSum += inst;
    });

    mp.orders = mlOrderIds.size;
    mp.releaseAvg = mp.releaseCount > 0 ? mp.releaseSum / mp.releaseCount : 0;
    if (!Number.isFinite(mp.releaseMin)) mp.releaseMin = 0;

    mp.paymentMethods = [...mpPayMap.values()]
        .map(m => ({
            ...m,
            revPct: mp.revenue > 0 ? (m.revenue / mp.revenue) * 100 : 0,
            avgInstallments: m.count > 0 ? m.instSum / m.count : 1
        }))
        .sort((a, b) => b.revenue - a.revenue);

    // 3. Reembolsos, Recusas e Cancelamentos (Shopee vs MP)
    const retention = {
        mlRefundedCount: 0,
        mlRefundedAmount: 0,
        mlRejectedCount: 0,
        mlRejectedAmount: 0,
        mlCancelledCount: 0,
        mlCancelledAmount: 0,
        mlClaimsCount: 0,
        mlChargebacksCount: 0,
        shCancelledCount: 0,
        shCancelledAmount: 0
    };

    cancelled.forEach(c => {
        const amt = c.amount || 0;
        if (c.channel === 'shopee') {
            retention.shCancelledCount += 1;
            retention.shCancelledAmount += amt;
            return;
        }
        if (c.claimId) retention.mlClaimsCount += 1;
        if (c.chargebackId) retention.mlChargebacksCount += 1;

        const kind = classifyMLCancelledStatus(c.status);
        if (kind === 'refunded') {
            retention.mlRefundedCount += 1;
            retention.mlRefundedAmount += (c.amountRefunded > 0 ? c.amountRefunded : amt);
        } else if (kind === 'rejected') {
            retention.mlRejectedCount += 1;
            retention.mlRejectedAmount += amt;
        } else {
            retention.mlCancelledCount += 1;
            retention.mlCancelledAmount += amt;
        }
    });

    return { shopee, mp, retention };
}

function computeAuditFindings() {
    const findings = [];
    const products = Object.values(productSummary || {});
    const targetMargin = getTargetMarginPercent();
    const fin = computeFinancialIntelligence();
    const includeML = activeChannel !== 'shopee';
    const includeShopee = activeChannel !== 'mercadolivre';

    // 1. CRITICO: Produtos vendidos sem custo cadastrado
    products
        .filter(p => p._costUnit <= 0 && p.totalRevenue > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .forEach(p => {
            findings.push({
                severity: 'CRITICO',
                category: 'Custos / CMV',
                source: p.channels.has('shopee') && p.channels.has('mercadolivre') ? 'Shopee + ML' : (p.channels.has('mercadolivre') ? 'Mercado Livre' : 'Shopee'),
                title: `Produto sem custo unitário: ${p.productName}`,
                detail: `${p.totalQty} un. vendidas (${fmt(p.totalRevenue)}) sem CMV cadastrado — margem aparenta acima do real.`,
                impactVal: p.totalRevenue,
                impactText: `${fmt(p.totalRevenue)} sem CMV`,
                recommendation: 'Clique para definir o custo unitário real deste item.',
                actionType: 'cost',
                actionTarget: p.productName
            });
        });

    // 2. CRITICO: Produtos operando em prejuízo líquido
    products
        .filter(p => p._costUnit > 0 && p._profit < -0.01)
        .sort((a, b) => a._profit - b._profit)
        .forEach(p => {
            findings.push({
                severity: 'CRITICO',
                category: 'Rentabilidade',
                source: p.channels.has('shopee') && p.channels.has('mercadolivre') ? 'Shopee + ML' : (p.channels.has('mercadolivre') ? 'Mercado Livre' : 'Shopee'),
                title: `Prejuízo líquido em ${p.productName}`,
                detail: `${p.totalQty} un. · Receita ${fmt(p.totalRevenue)} · Margem ${fmtPct(p._margin)} · Preço médio ${fmt(p._avgSellingPrice)}`,
                impactVal: Math.abs(p._profit),
                impactText: fmt(p._profit),
                recommendation: p._recommendedPrice > 0
                    ? `Elevar preço para ${fmt(p._recommendedPrice)} (meta ${fmtPct(targetMargin)}) ou negociar custo.`
                    : 'Com as taxas/impostos atuais a meta é inviável — revisar custo de compra ou frete.',
                actionType: 'detail',
                actionTarget: p.productName
            });
        });

    // 3. ALTO: Anúncios ML Inativos com tráfego/vendas no Relatório de Desempenho
    const perfRows = (includeML && channelData.mlPerf?.rows) ? channelData.mlPerf.rows : [];
    const inactiveTraffic = perfRows
        .filter(r => normalizeText(r.status).includes('inativ') && (r.visits >= 200 || r.sales >= 3))
        .sort((a, b) => (b.sales - a.sales) || (b.visits - a.visits));

    inactiveTraffic.slice(0, 3).forEach(r => {
        findings.push({
            severity: 'ALTO',
            category: 'Catálogo / Ruptura',
            source: 'ML Desempenho',
            title: `Anúncio ML Inativo com demanda histórica: ${r.title}`,
            detail: `${r.visits.toLocaleString('pt-BR')} visitas e ${r.sales} venda(s) no período · Var.: ${r.variation || r.sku || 'Padrão'}`,
            impactVal: r.visits,
            impactText: `${r.visits.toLocaleString('pt-BR')} visitas · ${r.sales} vds`,
            recommendation: 'Verificar se o anúncio pausado reflete falta de estoque ou migração de publicação.',
            actionType: '',
            actionTarget: ''
        });
    });

    if (inactiveTraffic.length > 3) {
        const rest = inactiveTraffic.slice(3);
        const restVisits = rest.reduce((s, r) => s + r.visits, 0);
        const restSales = rest.reduce((s, r) => s + r.sales, 0);
        findings.push({
            severity: 'ALTO',
            category: 'Catálogo / Ruptura',
            source: 'ML Desempenho',
            title: `+${rest.length} anúncio(s) ML inativo(s) com visitas/vendas`,
            detail: `Somam ${restVisits.toLocaleString('pt-BR')} visitas e ${restSales} venda(s) no relatório de publicações.`,
            impactVal: restVisits,
            impactText: `${restVisits.toLocaleString('pt-BR')} visitas`,
            recommendation: 'Revisar estoque dos anúncios inativos no painel do Mercado Livre.',
            actionType: '',
            actionTarget: ''
        });
    }

    // 4. ALTO: Pedidos ML pendentes de conferência manual de quantidade (?)
    const pendingQtyOrders = includeML ? (rawOrders || []).filter(o => o.channel === 'mercadolivre' && o.needsQtyCheck) : [];
    if (pendingQtyOrders.length > 0) {
        const affectedRev = pendingQtyOrders.reduce((s, o) => s + (o.subtotal || 0), 0);
        const firstOrder = pendingQtyOrders[0];
        const firstTargetKey = groupingMode === 'model'
            ? (firstOrder.canonicalName || firstOrder.productName)
            : firstOrder.productName;
        const uniqueProds = [...new Set(pendingQtyOrders.map(o => o.canonicalName || o.productName))];
        findings.push({
            severity: 'ALTO',
            category: 'Qualidade de Dados',
            source: 'Mercado Pago',
            title: `${pendingQtyOrders.length} pedido(s) ML com quantidade suspeita (?)`,
            detail: `Ticket incompatível com 1 unidade em: ${uniqueProds.slice(0, 2).join(', ')}${uniqueProds.length > 2 ? ` (+${uniqueProds.length - 2})` : ''}.`,
            impactVal: affectedRev,
            impactText: `${fmt(affectedRev)} sob revisão`,
            recommendation: 'Clique para abrir o produto, confirmar a Qtd real vendida e ajustar o CMV exato.',
            actionType: 'detail',
            actionTarget: firstTargetKey
        });
    }

    // 5. ALTO: Reembolsos reais (Mercado Pago refunded / estornos)
    if (includeML && fin.retention.mlRefundedCount > 0) {
        findings.push({
            severity: 'ALTO',
            category: 'Reembolsos / Pós-venda',
            source: 'Mercado Pago',
            title: `${fin.retention.mlRefundedCount} reembolso(s) efetivado(s) no Mercado Pago`,
            detail: `Valor real estornado (refunded): ${fmt(fin.retention.mlRefundedAmount)}${fin.retention.mlClaimsCount > 0 ? ` · ${fin.retention.mlClaimsCount} reclamação(ões)` : ''}${fin.retention.mlChargebacksCount > 0 ? ` · ${fin.retention.mlChargebacksCount} chargeback(s)` : ''}.`,
            impactVal: fin.retention.mlRefundedAmount,
            impactText: fmt(fin.retention.mlRefundedAmount),
            recommendation: 'Clique para inspecionar os pedidos estornados e identificar produtos com maior taxa de devolução.',
            actionType: 'cancelled',
            actionTarget: ''
        });
    }

    // 6. MEDIO: Anúncios ML Ativos com alto tráfego e baixa conversão (< 0,8%)
    perfRows
        .filter(r => normalizeText(r.status) === 'ativa' && r.visits >= 300 && r.convPct < 0.8)
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 3)
        .forEach(r => {
            findings.push({
                severity: 'MEDIO',
                category: 'Conversão / Tráfego',
                source: 'ML Desempenho',
                title: `Alto tráfego e baixa conversão ML: ${r.title}`,
                detail: `${r.visits.toLocaleString('pt-BR')} visitas geraram apenas ${r.sales} venda(s) (${r.convPct.toFixed(2).replace('.', ',')}% de conversão).`,
                impactVal: r.visits,
                impactText: `${r.convPct.toFixed(2).replace('.', ',')}% conv.`,
                recommendation: 'Melhorar fotos, título, preço ou prazo de envio para aproveitar o tráfego existente.',
                actionType: '',
                actionTarget: ''
            });
        });

    // 7. MEDIO: Produtos lucrativos mas abaixo da Meta de Margem (top 3 maiores gaps em R$)
    const lowMarginRanked = products
        .filter(p => p._costUnit > 0 && p._profit >= 0 && p._margin < targetMargin)
        .map(p => ({
            product: p,
            gapProfit: Math.max(0, (p.totalRevenue * (targetMargin / 100)) - p._profit)
        }))
        .sort((a, b) => b.gapProfit - a.gapProfit);

    lowMarginRanked.slice(0, 3).forEach(({ product: p, gapProfit }) => {
        findings.push({
            severity: 'MEDIO',
            category: 'Margem abaixo da Meta',
            source: p._abcClass ? `Curva ${p._abcClass}` : 'Produtos',
            title: `${p.productName} com margem ${fmtPct(p._margin)} (meta ${fmtPct(targetMargin)})`,
            detail: `${p.totalQty} un. · Receita ${fmt(p.totalRevenue)} · Lucro atual ${fmt(p._profit)} (gap de ${fmt(gapProfit)} p/ atingir a meta).`,
            impactVal: gapProfit,
            impactText: `-${fmt(gapProfit)} vs meta`,
            recommendation: p._recommendedPrice > 0
                ? `Simulador aponta preço sugerido de ${fmt(p._recommendedPrice)} (atual ${fmt(p._avgSellingPrice)}).`
                : 'Simular novo preço ou reduzir despesas extras no detalhe do produto.',
            actionType: 'detail',
            actionTarget: p.productName
        });
    });

    // 8. MEDIO: Subsídios Comerciais Shopee (Cupom do Vendedor + Desconto + Ajuste PIX)
    if (includeShopee && (fin.shopee.sellerCoupon > 0 || fin.shopee.sellerDiscount > 0 || fin.shopee.pixAdj > 0)) {
        const promoTotal = fin.shopee.sellerCoupon + fin.shopee.sellerDiscount;
        const promoPct = fin.shopee.revenue > 0 ? (promoTotal / fin.shopee.revenue) * 100 : 0;
        findings.push({
            severity: 'MEDIO',
            category: 'Cupons & Descontos',
            source: 'Shopee',
            title: `Cupons/Descontos do Vendedor na Shopee somam ${fmt(promoTotal)}`,
            detail: `Cupom vendedor: ${fmt(fin.shopee.sellerCoupon)} · Desconto vendedor: ${fmt(fin.shopee.sellerDiscount)} · Ajuste PIX: ${fmt(fin.shopee.pixAdj)} (${fmtPct(promoPct)} da receita Shopee).`,
            impactVal: promoTotal + fin.shopee.pixAdj,
            impactText: `${fmt(promoTotal)} promo`,
            recommendation: 'Garantir que a margem líquida dos SKUs promocionais já absorve os cupons concedidos.',
            actionType: '',
            actionTarget: ''
        });
    }

    // 9. BAIXO: Recusas de pagamento MP & Cancelamentos gerais
    if (includeML && fin.retention.mlRejectedCount > 0) {
        findings.push({
            severity: 'BAIXO',
            category: 'Checkout / Pagamento',
            source: 'Mercado Pago',
            title: `${fin.retention.mlRejectedCount} pagamento(s) recusado(s) no Mercado Pago`,
            detail: `${fmt(fin.retention.mlRejectedAmount)} em tentativas rejeitadas (excluídas do faturamento, sem saída de estoque).`,
            impactVal: fin.retention.mlRejectedAmount,
            impactText: `${fin.retention.mlRejectedCount} recusas`,
            recommendation: 'Monitorar se há aumento de recusas por antifraude ou falha em parcelamento.',
            actionType: 'cancelled',
            actionTarget: ''
        });
    }

    // 10. BAIXO: Itens vendidos sem código SKU
    const noSkuCount = (rawOrders || []).filter(o => !String(o.sku || '').trim()).length;
    if (noSkuCount > 0) {
        findings.push({
            severity: 'BAIXO',
            category: 'Padronização / SKU',
            source: 'Catálogo',
            title: `${noSkuCount} linha(s) de pedido sem SKU informado`,
            detail: 'Sem SKU preenchido na planilha, o vínculo com o custo padrão depende apenas do título do anúncio.',
            impactVal: noSkuCount,
            impactText: `${noSkuCount} itens`,
            recommendation: 'Use "Regras de SKU Personalizadas" ou preencha o SKU nos anúncios originais.',
            actionType: 'costs-modal',
            actionTarget: ''
        });
    }

    findings.sort((a, b) => {
        const rA = SEVERITY_META[a.severity]?.rank ?? 9;
        const rB = SEVERITY_META[b.severity]?.rank ?? 9;
        if (rA !== rB) return rA - rB;
        return (b.impactVal || 0) - (a.impactVal || 0);
    });

    const counts = { ALL: findings.length, CRITICO: 0, ALTO: 0, MEDIO: 0, BAIXO: 0 };
    findings.forEach(f => {
        if (counts[f.severity] !== undefined) counts[f.severity] += 1;
    });

    return { findings, counts, fin };
}

function renderABCCurvePanel(abc) {
    const safeAbc = abc || {
        A: { count: 0, revenue: 0, profit: 0, revPct: 0 },
        B: { count: 0, revenue: 0, profit: 0, revPct: 0 },
        C: { count: 0, revenue: 0, profit: 0, revPct: 0 }
    };
    const metaDesc = {
        A: 'Curva A · Núcleo (~80% rec.)',
        B: 'Curva B · Intermediários (80–95%)',
        C: 'Curva C · Cauda Longa (>95%)'
    };

    return `
        <div class="abc-grid">
            ${['A', 'B', 'C'].map(cls => {
                const g = safeAbc[cls] || { count: 0, revenue: 0, profit: 0, revPct: 0 };
                return `
                    <div class="abc-box">
                        <div class="abc-box-header">
                            <span class="abc-badge abc-${cls}">Curva ${cls}</span>
                            <span class="abc-box-share">${fmtPct(g.revPct)}</span>
                        </div>
                        <div class="abc-box-main">${fmt(g.revenue)}</div>
                        <div class="abc-box-sub">${g.count} produto(s) · Lucro: <strong style="color:${g.profit >= 0 ? 'var(--green)' : 'var(--red)'};">${fmt(g.profit)}</strong></div>
                        <div class="abc-box-sub" style="margin-top:2px;">${metaDesc[cls]}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderAuditCardInnerHtml(auditPayload) {
    const { findings, counts } = auditPayload;
    auditActionTargets = [];

    if (!['ALL', 'CRITICO', 'ALTO', 'MEDIO', 'BAIXO'].includes(activeAuditSeverity)) {
        activeAuditSeverity = 'ALL';
    }
    if (activeAuditSeverity !== 'ALL' && counts[activeAuditSeverity] === 0) {
        activeAuditSeverity = 'ALL';
    }

    const filtered = activeAuditSeverity === 'ALL'
        ? findings
        : findings.filter(f => f.severity === activeAuditSeverity);

    const pills = [
        { key: 'ALL', label: `Todos (${counts.ALL})` },
        { key: 'CRITICO', label: `Crítico (${counts.CRITICO})` },
        { key: 'ALTO', label: `Alto (${counts.ALTO})` },
        { key: 'MEDIO', label: `Médio (${counts.MEDIO})` },
        { key: 'BAIXO', label: `Baixo (${counts.BAIXO})` }
    ];

    const listHtml = filtered.length === 0
        ? '<p style="font-size:0.82rem;color:var(--green);padding:8px 0;">✓ Nenhum alerta encontrado nesta severidade.</p>'
        : `<div class="audit-list">${filtered.map(f => {
            const actionIdx = f.actionType ? (auditActionTargets.push({ type: f.actionType, target: f.actionTarget }) - 1) : -1;
            const clickableClass = actionIdx >= 0 ? ' clickable' : '';
            const actionHint = f.actionType === 'cost'
                ? 'Clique para editar custo'
                : (f.actionType === 'detail' ? 'Clique para abrir simulador/pedidos' : (f.actionType === 'cancelled' ? 'Clique para auditar cancelamentos' : (f.actionType === 'costs-modal' ? 'Clique para configurar custos/SKUs' : '')));

            return `
                <div class="audit-item${clickableClass}" ${actionIdx >= 0 ? `data-audit-action-idx="${actionIdx}" title="${escapeHtml(actionHint)}"` : ''}>
                    <span class="sev-badge sev-${f.severity}">${SEVERITY_META[f.severity]?.label || f.severity}</span>
                    <div class="audit-main">
                        <div class="audit-title">
                            ${escapeHtml(f.title)}
                            <span style="font-size:0.68rem;color:var(--text-muted);font-weight:500;margin-left:6px;">[${escapeHtml(f.source)}]</span>
                        </div>
                        <div class="audit-detail">${escapeHtml(f.detail)}</div>
                        <div class="audit-rec">💡 ${escapeHtml(f.recommendation)}${actionHint ? ` · <strong>${actionHint} →</strong>` : ''}</div>
                    </div>
                    <div class="audit-impact">${escapeHtml(f.impactText || '')}</div>
                </div>
            `;
        }).join('')}</div>`;

    return `
        <div class="audit-header-bar">
            <h3 style="margin:0;">🛡️ Motor de Auditoria e Riscos (Severidade)</h3>
            <div class="severity-filter-bar">
                ${pills.map(p => `
                    <button type="button" class="sev-pill${activeAuditSeverity === p.key ? ' active' : ''}" data-sev-filter="${p.key}">${p.label}</button>
                `).join('')}
            </div>
        </div>
        ${listHtml}
    `;
}

function renderFinancialIntelCardHtml(fin) {
    const { shopee, mp, retention } = fin;
    const shHasData = shopee.orders > 0 || retention.shCancelledCount > 0;
    const mlHasData = mp.orders > 0 || retention.mlRefundedCount > 0 || retention.mlRejectedCount > 0 || retention.mlCancelledCount > 0;

    const mlMethodsHtml = mp.paymentMethods.length > 0
        ? mp.paymentMethods.map(m => `
            <div class="fin-row">
                <span>${escapeHtml(m.label)} <span style="color:var(--text-muted);font-size:0.74rem;">(${m.count} un./ped.${m.key === 'credit_card' ? ` · méd. ${m.avgInstallments.toFixed(1).replace('.', ',')}x` : ''})</span></span>
                <strong>${fmt(m.revenue)} (${fmtPct(m.revPct)})</strong>
            </div>
        `).join('')
        : '<div class="fin-row"><span style="color:var(--text-muted);">Nenhuma transação aprovada do Mercado Pago neste recorte.</span><strong>—</strong></div>';

    const mpTotalOrdersIncl = mp.orders || 1;
    const multiPct = mp.orders > 0 ? (mp.instMultiCount / mpTotalOrdersIncl) * 100 : 0;

    return `
        <h3>💳 Inteligência Financeira &amp; Fluxo de Caixa (Mercado Pago + Shopee)</h3>
        <div class="fin-split">
            <div class="fin-box">
                <h4>💙 Mercado Pago / ML — Meios, Fluxo (D+) &amp; Estornos Reais</h4>
                ${mlHasData ? `
                    ${mlMethodsHtml}
                    <div class="fin-row" style="margin-top:6px;padding-top:8px;border-top:1px dashed var(--border-color);">
                        <span>Parcelamento (1x vs 2x+)</span>
                        <strong>${mp.inst1xCount}x à vista · ${mp.instMultiCount}x parcelado (${fmtPct(multiPct)} · até ${mp.maxInstallments}x)</strong>
                    </div>
                    <div class="fin-row">
                        <span>Prazo de Liberação (D+ após venda)</span>
                        <strong>${mp.releaseCount > 0 ? `Méd. D+${mp.releaseAvg.toFixed(1).replace('.', ',')} (min ${mp.releaseMin.toFixed(1).replace('.', ',')} · máx ${mp.releaseMax.toFixed(1).replace('.', ',')} dias)` : 'Indisponível'}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Líquido MP Creditado (Net Received)</span>
                        <strong style="color:var(--green);">${fmt(mp.netReceived)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Reembolsos Reais (status: refunded)</span>
                        <strong style="color:var(--red);">${retention.mlRefundedCount} ped. · ${fmt(retention.mlRefundedAmount)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Recusas Checkout (rejected) / Cancelados</span>
                        <strong>${retention.mlRejectedCount} rec. (${fmt(retention.mlRejectedAmount)}) · ${retention.mlCancelledCount} canc.</strong>
                    </div>
                    ${(mp.financingFee > 0 || mp.couponFee > 0) ? `
                        <div class="fin-row">
                            <span>Taxas Extras MP (Financiamento / Cupom)</span>
                            <strong>Fin: ${fmt(mp.financingFee)} · Cupom: ${fmt(mp.couponFee)}</strong>
                        </div>
                    ` : ''}
                ` : '<p style="font-size:0.8rem;color:var(--text-muted);margin:6px 0;">Importe ou ative o canal Mercado Livre para exibir meios de pagamento e D+.</p>'}
            </div>
            <div class="fin-box">
                <h4>🧡 Shopee &amp; Consolidado — Subsídios, Taxas e Retenções</h4>
                ${shHasData ? `
                    <div class="fin-row">
                        <span>Comissão + Taxa de Serviço Shopee</span>
                        <strong>${fmt(shopee.commission)} + ${fmt(shopee.serviceFee)} = ${fmt(shopee.fees)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Cupom do Vendedor (proport. por pedido)</span>
                        <strong style="color:var(--yellow);">${fmt(shopee.sellerCoupon)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Desconto do Vendedor (nos itens)</span>
                        <strong>${fmt(shopee.sellerDiscount)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Ajuste PIX / Ação Comercial Shopee</span>
                        <strong>PIX: ${fmt(shopee.pixAdj)}${shopee.actionAdj !== 0 ? ` · Ação: ${fmt(shopee.actionAdj)}` : ''}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Repasse Bruto Pós-Taxas Shopee</span>
                        <strong style="color:var(--green);">${fmt(shopee.revenue - shopee.fees - shopee.shipping)}</strong>
                    </div>
                    <div class="fin-row">
                        <span>Cancelados / Devoluções Shopee</span>
                        <strong style="color:var(--red);">${retention.shCancelledCount} ped. · ${fmt(retention.shCancelledAmount)}</strong>
                    </div>
                ` : '<p style="font-size:0.8rem;color:var(--text-muted);margin:6px 0;">Importe ou ative o canal Shopee para exibir subsídios comerciais e retenções.</p>'}
            </div>
        </div>
    `;
}

function handleAnalyticsSectionClick(e) {
    const sevBtn = e.target.closest('[data-sev-filter]');
    if (sevBtn) {
        activeAuditSeverity = sevBtn.dataset.sevFilter || 'ALL';
        const auditCard = document.getElementById('analytics-audit-card');
        const payload = computeAuditFindings();
        if (auditCard) {
            auditCard.innerHTML = renderAuditCardInnerHtml(payload);
        }
        return;
    }

    const actionEl = e.target.closest('[data-audit-action-idx]');
    if (actionEl) {
        const act = auditActionTargets[Number(actionEl.dataset.auditActionIdx)];
        if (!act) return;
        if (act.type === 'cost' && typeof openCostEdit === 'function') {
            openCostEdit(act.target);
        } else if (act.type === 'detail' && typeof showDetail === 'function') {
            showDetail(act.target);
        } else if (act.type === 'cancelled') {
            openCancelledModal();
        } else if (act.type === 'costs-modal' && typeof openAllCostsModal === 'function') {
            openAllCostsModal();
        }
        return;
    }

    const monthJumpEl = e.target.closest('[data-jump-month]');
    if (monthJumpEl) {
        const mk = monthJumpEl.dataset.jumpMonth;
        if (mk && typeof setMonthSelection === 'function') {
            if (typeof monthSelection !== 'undefined' && monthSelection.mode === 'single' && monthSelection.single === mk) {
                setMonthSelection('all');
            } else {
                setMonthSelection('single', mk);
            }
        }
        return;
    }

    const row = e.target.closest('[data-analytics-key-idx]');
    if (!row) return;
    const key = analyticsProductKeys[Number(row.dataset.analyticsKeyIdx)];
    if (key !== undefined) showDetail(key);
}

function computeMonthlyEvolution() {
    if (typeof dbBackendActive === 'undefined' || !dbBackendActive || !dbFullDataset || !Array.isArray(dbFullDataset.orders)) {
        monthlyEvolutionList = [];
        previousMonthAutoBaseline = null;
        return [];
    }

    const taxRate = getTaxRatePercent() / 100;
    const useChannel = activeChannel || 'all';
    const monthBuckets = new Map();

    const getBucket = (mk) => {
        if (!monthBuckets.has(mk)) {
            monthBuckets.set(mk, {
                monthKey: mk,
                label: typeof formatMonthKeyPt === 'function' ? formatMonthKeyPt(mk) : mk,
                shOrderIds: new Set(),
                mlOrderIds: new Set(),
                cancelledIds: new Set(),
                shUnits: 0,
                mlUnits: 0,
                shRevenue: 0,
                mlRevenue: 0,
                shCost: 0,
                mlCost: 0,
                shFees: 0,
                mlFees: 0,
                shShipping: 0,
                mlShipping: 0
            });
        }
        return monthBuckets.get(mk);
    };

    dbFullDataset.orders.forEach(o => {
        if (useChannel !== 'all' && o.channel !== useChannel) return;
        const mk = o.monthKey || (o.isoDate ? o.isoDate.slice(0, 7) : 'undated');
        if (!/^\d{4}-\d{2}$/.test(mk)) return;
        const b = getBucket(mk);
        const displayName = groupingMode === 'listing' ? (o.productName || o.canonicalName) : (o.canonicalName || o.productName);
        const unitCost = getCost(displayName, o.canonicalName, o.defaultModelCost || 0);
        const qty = Math.max(1, Number(o.qty) || 1);

        if (o.channel === 'shopee') {
            b.shOrderIds.add(o.orderId);
            b.shUnits += qty;
            b.shRevenue += Number(o.subtotal) || 0;
            b.shCost += unitCost * qty;
            b.shFees += Number(o.itemFees) || 0;
            b.shShipping += Number(o.itemShipping) || 0;
        } else if (o.channel === 'mercadolivre') {
            b.mlOrderIds.add(o.orderId);
            b.mlUnits += qty;
            b.mlRevenue += Number(o.subtotal) || 0;
            b.mlCost += unitCost * qty;
            b.mlFees += Number(o.itemFees) || 0;
            b.mlShipping += Number(o.itemShipping) || 0;
        }
    });

    (dbFullDataset.cancelledOrders || []).forEach(c => {
        if (useChannel !== 'all' && c.channel !== useChannel) return;
        const mk = c.monthKey || (c.isoDate ? c.isoDate.slice(0, 7) : 'undated');
        if (!/^\d{4}-\d{2}$/.test(mk)) return;
        getBucket(mk).cancelledIds.add(`${c.channel}:${c.orderId}`);
    });

    const sortedKeys = [...monthBuckets.keys()].sort();
    const result = sortedKeys.map(mk => {
        const b = monthBuckets.get(mk);
        const shRev = b.shRevenue;
        const mlRev = b.mlRevenue;
        const adsSh = shRev > 0 ? (Number(extraExpenses?.adsShopee) || 0) : 0;
        const adsMl = mlRev > 0 ? (Number(extraExpenses?.adsML) || 0) : 0;
        const pkg = (b.shUnits + b.mlUnits) * (Number(extraExpenses?.packagingPerUnit) || 0);
        const extras = pkg + adsSh + adsMl;

        const revenue = shRev + mlRev;
        const cost = b.shCost + b.mlCost;
        const fees = b.shFees + b.mlFees;
        const shipping = b.shShipping + b.mlShipping;
        const tax = revenue * taxRate;
        const profit = revenue - cost - fees - shipping - tax - extras;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        const mNum = parseInt(mk.slice(5, 7), 10) - 1;

        return {
            monthKey: mk,
            label: b.label,
            shortLabel: `${(MONTHS_PT[mNum] || mk.slice(5, 7)).slice(0, 3)}/${mk.slice(2, 4)}`,
            orders: b.shOrderIds.size + b.mlOrderIds.size,
            cancelledOrders: b.cancelledIds.size,
            units: b.shUnits + b.mlUnits,
            revenue,
            cost,
            fees,
            shipping,
            tax,
            extras,
            profit,
            margin,
            shRevenue: shRev,
            mlRevenue: mlRev,
            revDeltaPct: null
        };
    });

    for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1];
        if (prev.revenue > 0) {
            result[i].revDeltaPct = ((result[i].revenue - prev.revenue) / prev.revenue) * 100;
        }
    }

    monthlyEvolutionList = result;

    previousMonthAutoBaseline = null;
    if (typeof activeWorkspaceTab !== 'undefined' && activeWorkspaceTab === 'current' && result.length > 0) {
        const prev = result[result.length - 1];
        previousMonthAutoBaseline = {
            label: prev.label,
            revenue: prev.revenue,
            cost: prev.cost,
            fees: prev.fees,
            shipping: prev.shipping,
            tax: prev.tax,
            extras: prev.extras,
            profit: prev.profit,
            margin: prev.margin
        };
    } else if (typeof monthSelection !== 'undefined' && monthSelection?.mode === 'single' && monthSelection.single) {
        const idx = result.findIndex(m => m.monthKey === monthSelection.single);
        if (idx > 0) {
            const prev = result[idx - 1];
            previousMonthAutoBaseline = {
                label: prev.label,
                revenue: prev.revenue,
                cost: prev.cost,
                fees: prev.fees,
                shipping: prev.shipping,
                tax: prev.tax,
                extras: prev.extras,
                profit: prev.profit,
                margin: prev.margin
            };
        }
    }

    return result;
}

function isMonthHighlightedInEvolution(mk) {
    if (typeof monthSelection === 'undefined') return false;
    if (monthSelection.mode === 'single') return monthSelection.single === mk;
    if (monthSelection.mode === 'range') {
        return (!monthSelection.from || mk >= monthSelection.from) && (!monthSelection.to || mk <= monthSelection.to);
    }
    return false;
}

function renderMonthlyEvolutionCardHtml(months) {
    if (!Array.isArray(months) || months.length === 0) return '';
    const firstLabel = months[0].shortLabel;
    const lastLabel = months[months.length - 1].shortLabel;

    const tableRows = months.map(m => {
        const isActive = isMonthHighlightedInEvolution(m.monthKey);
        const deltaHtml = m.revDeltaPct === null
            ? '<span style="color:var(--text-muted)">—</span>'
            : `<span style="color:${m.revDeltaPct >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700;">${m.revDeltaPct >= 0 ? '+' : ''}${m.revDeltaPct.toFixed(1).replace('.', ',')}%</span>`;
        return `
            <tr class="trend-table-row clickable ${isActive ? 'active' : ''}" data-jump-month="${escapeHtml(m.monthKey)}" title="Clique para abrir ${escapeHtml(m.label)}">
                <td><strong>${escapeHtml(m.label)}</strong></td>
                <td>${m.orders}</td>
                <td>${m.units}</td>
                <td>${fmt(m.shRevenue)}</td>
                <td>${fmt(m.mlRevenue)}</td>
                <td><strong>${fmt(m.revenue)}</strong></td>
                <td>${deltaHtml}</td>
                <td style="color:${m.profit >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700;">${fmt(m.profit)}</td>
                <td><span class="margin-badge ${m.margin >= 0 ? 'positive' : 'negative'}">${fmtPct(m.margin)}</span></td>
            </tr>
        `;
    }).join('');

    return `
        <div class="analytics-card full-span" id="analytics-evolution-card" data-analytics-group="overview">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                <h3 style="margin:0;">📈 Evolução Mensal (${escapeHtml(firstLabel)} → ${escapeHtml(lastLabel)}) · Banco SQLite</h3>
                <div style="display:flex;gap:14px;font-size:0.74rem;color:var(--text-secondary);flex-wrap:wrap;">
                    <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#111113;margin-right:4px;"></span>Receita Bruta</span>
                    <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#059669;margin-right:4px;"></span>Lucro Líquido</span>
                    <span><span style="display:inline-block;width:10px;height:3px;background:#DC2626;margin-right:4px;vertical-align:middle;"></span>Margem %</span>
                    <span style="color:var(--text-muted);">Clique em uma barra ou linha para isolar o mês</span>
                </div>
            </div>
            <div class="chart-wrap-tall">
                <canvas id="chart-monthly-evolution"></canvas>
            </div>
            <div style="overflow-x:auto;">
                <table class="cmp-table">
                    <thead>
                        <tr>
                            <th>Mês</th>
                            <th>Pedidos</th>
                            <th>Unidades</th>
                            <th>Shopee</th>
                            <th>Mercado Livre</th>
                            <th>Receita Bruta</th>
                            <th>MoM Rec.</th>
                            <th>Lucro Líquido</th>
                            <th>Margem</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function mountMonthlyEvolutionChart(months) {
    if (typeof Chart === 'undefined' || !Array.isArray(months) || months.length === 0) return;
    const canvas = document.getElementById('chart-monthly-evolution');
    if (!canvas) return;
    destroyAnalyticsChart('chart-monthly-evolution');

    const labels = months.map(m => m.shortLabel);
    const revColors = months.map(m => isMonthHighlightedInEvolution(m.monthKey) ? '#DC2626' : '#111113');
    const profitColors = months.map(m => m.profit >= 0 ? '#059669' : '#B91C1C');

    analyticsChartRegistry['chart-monthly-evolution'] = new Chart(canvas, {
        data: {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Margem (%)',
                    data: months.map(m => Number(m.margin.toFixed(2))),
                    yAxisID: 'y1',
                    borderColor: '#DC2626',
                    backgroundColor: '#DC2626',
                    borderWidth: 2.5,
                    pointRadius: 3.5,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    order: 0
                },
                {
                    type: 'bar',
                    label: 'Receita Bruta',
                    data: months.map(m => Number(m.revenue.toFixed(2))),
                    yAxisID: 'y',
                    backgroundColor: revColors,
                    borderRadius: 5,
                    maxBarThickness: 28,
                    order: 1
                },
                {
                    type: 'bar',
                    label: 'Lucro Líquido',
                    data: months.map(m => Number(m.profit.toFixed(2))),
                    yAxisID: 'y',
                    backgroundColor: profitColors,
                    borderRadius: 5,
                    maxBarThickness: 28,
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            onClick: (_evt, elements) => {
                if (!elements || elements.length === 0) return;
                const mk = months[elements[0].index]?.monthKey;
                if (!mk || typeof setMonthSelection !== 'function') return;
                if (typeof monthSelection !== 'undefined' && monthSelection.mode === 'single' && monthSelection.single === mk) {
                    setMonthSelection('all');
                } else {
                    setMonthSelection('single', mk);
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: { color: '#111113', boxWidth: 12, font: { size: 11, weight: '600' } }
                },
                tooltip: {
                    backgroundColor: '#111113',
                    titleColor: '#FFFFFF',
                    bodyColor: '#F4F5F7',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => {
                            const val = ctx.parsed.y ?? 0;
                            if (ctx.dataset.yAxisID === 'y1') return `${ctx.dataset.label}: ${fmtPct(val)}`;
                            return `${ctx.dataset.label}: ${fmt(val)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#3F3F46', font: { size: 11, weight: '600' } }
                },
                y: {
                    position: 'left',
                    grid: { color: 'rgba(17, 17, 19, 0.08)' },
                    ticks: { color: '#52525B', font: { size: 11 }, callback: formatCompactBrlTick }
                },
                y1: {
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#DC2626', font: { size: 11, weight: '600' }, callback: (v) => `${v}%` }
                }
            }
        }
    });
}

function mountCompositionChart(segments) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('chart-composition');
    if (!canvas) return;
    destroyAnalyticsChart('chart-composition');

    const activeSegments = (segments || []).filter(s => s.val > 0);
    if (activeSegments.length === 0) return;

    analyticsChartRegistry['chart-composition'] = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: activeSegments.map(s => s.label),
            datasets: [{
                data: activeSegments.map(s => Number(s.val.toFixed(2))),
                backgroundColor: activeSegments.map(s => s.color),
                borderColor: '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '64%',
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: { color: '#18181B', boxWidth: 11, font: { size: 11, weight: '600' } }
                },
                tooltip: {
                    backgroundColor: '#111113',
                    titleColor: '#FFFFFF',
                    bodyColor: '#F4F5F7',
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
                            const val = ctx.parsed || 0;
                            const pct = (val / total) * 100;
                            return `${ctx.label}: ${fmt(val)} (${fmtPct(pct)})`;
                        }
                    }
                }
            }
        }
    });
}

function computeCurrentMonthPace() {
    if (!hasPrimaryChannelData()) return null;
    const isoDates = (rawOrders || [])
        .map(o => o.isoDate || (typeof extractISODate === 'function' ? extractISODate(o.date) : ''))
        .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
        .sort();

    let monthKey = '';
    if (isoDates.length > 0) {
        const monthCounts = new Map();
        isoDates.forEach(d => {
            const mk = d.slice(0, 7);
            monthCounts.set(mk, (monthCounts.get(mk) || 0) + 1);
        });
        monthKey = [...monthCounts.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0][0];
    } else if (typeof inferMonthKey === 'function') {
        const shDates = currentWorkspaceData?.shopee?.dates || [];
        const mlDates = currentWorkspaceData?.mercadolivre?.dates || [];
        monthKey = inferMonthKey([...shDates, ...mlDates], currentPeriodText);
    }

    const validMk = /^\d{4}-\d{2}$/.test(monthKey) ? monthKey : '';
    const monthDates = validMk ? isoDates.filter(d => d.startsWith(validMk)) : isoDates;
    const minIso = monthDates[0] || '';
    const maxIso = monthDates[monthDates.length - 1] || '';

    let daysInMonth = 30;
    let elapsedDays = 1;
    let monthLabel = currentPeriodText;
    if (validMk) {
        const year = parseInt(validMk.slice(0, 4), 10);
        const month = parseInt(validMk.slice(5, 7), 10);
        daysInMonth = new Date(year, month, 0).getDate();
        monthLabel = typeof formatMonthKeyPt === 'function' ? formatMonthKeyPt(validMk) : validMk;
        if (minIso && maxIso) {
            const minDay = parseInt(minIso.slice(8, 10), 10) || 1;
            const maxDay = parseInt(maxIso.slice(8, 10), 10) || minDay;
            elapsedDays = minDay <= 2 ? maxDay : Math.max(1, maxDay - minDay + 1);
        }
    } else {
        const uniqDays = new Set(monthDates);
        elapsedDays = Math.max(1, uniqDays.size);
    }

    elapsedDays = Math.min(daysInMonth, Math.max(1, elapsedDays));
    const progressPct = Math.min(100, (elapsedDays / daysInMonth) * 100);

    const actualRev = Number(lastGrandTotals.revenue) || 0;
    const actualProfit = Number(lastGrandTotals.profit) || 0;
    const actualOrders = Number(lastGrandTotals.validOrders) || 0;

    const dailyRev = actualRev / elapsedDays;
    const dailyProfit = actualProfit / elapsedDays;
    const dailyOrders = actualOrders / elapsedDays;

    const projectedRev = dailyRev * daysInMonth;
    const projectedProfit = dailyProfit * daysInMonth;
    const projectedOrders = Math.round(dailyOrders * daysInMonth);

    const hist = Array.isArray(monthlyEvolutionList) ? monthlyEvolutionList : [];
    const lastClosed = hist.length > 0 ? hist[hist.length - 1] : null;
    const histAvgRev = hist.length > 0 ? hist.reduce((s, m) => s + (m.revenue || 0), 0) / hist.length : 0;
    const histAvgProfit = hist.length > 0 ? hist.reduce((s, m) => s + (m.profit || 0), 0) / hist.length : 0;

    const deltaLastPct = lastClosed && lastClosed.revenue > 0
        ? ((projectedRev - lastClosed.revenue) / lastClosed.revenue) * 100
        : null;
    const deltaAvgPct = histAvgRev > 0
        ? ((projectedRev - histAvgRev) / histAvgRev) * 100
        : null;

    const fmtBrDate = (iso) => iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '';
    const windowText = minIso && maxIso
        ? `${fmtBrDate(minIso)} a ${fmtBrDate(maxIso)}`
        : monthLabel;

    return {
        monthKey: validMk,
        monthLabel,
        windowText,
        elapsedDays,
        daysInMonth,
        progressPct,
        actualRev,
        actualProfit,
        actualOrders,
        dailyRev,
        dailyProfit,
        dailyOrders,
        projectedRev,
        projectedProfit,
        projectedOrders,
        lastClosed,
        histCount: hist.length,
        histAvgRev,
        histAvgProfit,
        deltaLastPct,
        deltaAvgPct
    };
}

function mountCurrentPaceChart(pace) {
    if (typeof Chart === 'undefined' || !pace) return;
    const canvas = document.getElementById('chart-current-pace');
    if (!canvas) return;
    destroyAnalyticsChart('chart-current-pace');

    const labels = ['Acumulado Atual', `Projeção (${pace.daysInMonth}d)`];
    const revData = [Number(pace.actualRev.toFixed(2)), Number(pace.projectedRev.toFixed(2))];
    const profData = [Number(pace.actualProfit.toFixed(2)), Number(pace.projectedProfit.toFixed(2))];
    if (pace.lastClosed) {
        labels.push(pace.lastClosed.shortLabel);
        revData.push(Number(pace.lastClosed.revenue.toFixed(2)));
        profData.push(Number(pace.lastClosed.profit.toFixed(2)));
    }
    if (pace.histCount > 0) {
        labels.push(`Média (${pace.histCount}m)`);
        revData.push(Number(pace.histAvgRev.toFixed(2)));
        profData.push(Number(pace.histAvgProfit.toFixed(2)));
    }

    analyticsChartRegistry['chart-current-pace'] = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Receita Bruta',
                    data: revData,
                    backgroundColor: ['#52525B', '#111113', '#A1A1AA', '#D4D4D8'].slice(0, labels.length),
                    borderRadius: 5,
                    maxBarThickness: 32
                },
                {
                    label: 'Lucro Líquido',
                    data: profData,
                    backgroundColor: profData.map(v => v >= 0 ? '#059669' : '#DC2626'),
                    borderRadius: 5,
                    maxBarThickness: 32
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: { color: '#111113', boxWidth: 10, font: { size: 11, weight: '600' } }
                },
                tooltip: {
                    backgroundColor: '#111113',
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y ?? 0)}`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#18181B', font: { size: 11, weight: '600' } } },
                y: { grid: { color: 'rgba(17, 17, 19, 0.08)' }, ticks: { color: '#52525B', font: { size: 10 }, callback: formatCompactBrlTick } }
            }
        }
    });
}

function renderCurrentPacePanel() {
    const panel = document.getElementById('current-pace-panel');
    if (!panel) return;
    const sub = typeof activeSubTab !== 'undefined' ? activeSubTab : 'overview';
    if (typeof activeWorkspaceTab === 'undefined' || activeWorkspaceTab !== 'current' || !hasPrimaryChannelData() || (sub !== 'overview' && sub !== 'sales')) {
        panel.style.display = 'none';
        panel.innerHTML = '';
        destroyAnalyticsChart('chart-current-pace');
        return;
    }

    const pace = computeCurrentMonthPace();
    if (!pace) {
        panel.style.display = 'none';
        panel.innerHTML = '';
        return;
    }

    const fmtSignedPct = (val) => val === null ? '—' : `${val >= 0 ? '+' : ''}${val.toFixed(1).replace('.', ',')}%`;
    const deltaLastSub = pace.lastClosed
        ? `${fmtSignedPct(pace.deltaLastPct)} vs ${escapeHtml(pace.lastClosed.label)}`
        : 'Importe meses no SQLite p/ comparar';
    const histBlockValue = pace.lastClosed ? fmt(pace.lastClosed.revenue) : 'Sem base';
    const histBlockSub = pace.lastClosed
        ? `${escapeHtml(pace.lastClosed.label)} · Média ${pace.histCount}m: ${fmt(pace.histAvgRev)}`
        : 'Use a aba Meses Anteriores para criar base histórica';

    panel.style.display = '';
    panel.innerHTML = `
        <div class="pace-header">
            <h3>
                <span class="context-tag tag-red">MÊS EM ANDAMENTO</span>
                Ritmo Semanal &amp; Projeção — ${escapeHtml(pace.monthLabel)}
            </h3>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:0.76rem;color:var(--text-secondary);">
                <span>Janela: <strong>${escapeHtml(pace.windowText)}</strong></span>
                <span class="context-tag tag-black">${pace.elapsedDays}/${pace.daysInMonth} dias (${fmtPct(pace.progressPct)})</span>
            </div>
        </div>
        <div class="pace-grid">
            <div class="pace-kpis">
                <div class="pace-kpi-box">
                    <div class="pace-kpi-label">Ritmo Diário Atual</div>
                    <div class="pace-kpi-val">${fmt(pace.dailyRev)}/dia</div>
                    <div class="pace-kpi-sub">${pace.dailyOrders.toFixed(1).replace('.', ',')} ped./dia · Lucro ${fmt(pace.dailyProfit)}/dia</div>
                </div>
                <div class="pace-kpi-box emphasis">
                    <div class="pace-kpi-label">Projeção Receita (${pace.daysInMonth}d)</div>
                    <div class="pace-kpi-val">${fmt(pace.projectedRev)}</div>
                    <div class="pace-kpi-sub">${deltaLastSub} · ~${pace.projectedOrders} ped.</div>
                </div>
                <div class="pace-kpi-box">
                    <div class="pace-kpi-label">Projeção Lucro Mês</div>
                    <div class="pace-kpi-val" style="color:${pace.projectedProfit >= 0 ? 'var(--green)' : 'var(--red)'};">${fmt(pace.projectedProfit)}</div>
                    <div class="pace-kpi-sub">Margem atual: ${fmtPct(lastGrandTotals.margin)}</div>
                </div>
                <div class="pace-kpi-box">
                    <div class="pace-kpi-label">Último Mês Fechado</div>
                    <div class="pace-kpi-val">${histBlockValue}</div>
                    <div class="pace-kpi-sub">${histBlockSub}</div>
                </div>
            </div>
            <div class="pace-chart-box">
                <div style="position:relative;height:190px;width:100%;">
                    <canvas id="chart-current-pace"></canvas>
                </div>
            </div>
        </div>
    `;
    mountCurrentPaceChart(pace);
}

function syncTrendMetricTilesUI() {
    document.querySelectorAll('.metric-tile[data-trend-metric]').forEach(tile => {
        const key = tile.dataset.trendMetric;
        const isSelected = selectedTrendMetrics.includes(key);
        tile.classList.toggle('selected', isSelected);
        if (key === 'orders') {
            tile.style.borderTopColor = isSelected ? '#059669' : '';
        } else if (key === 'cancelled') {
            tile.style.borderTopColor = isSelected ? '#D97706' : '';
        }
    });
    const countEl = document.getElementById('selected-metrics-count');
    if (countEl) countEl.textContent = String(selectedTrendMetrics.length);
}

function toggleTrendMetric(metricKey) {
    if (!TREND_METRICS_CONFIG[metricKey]) return;
    const idx = selectedTrendMetrics.indexOf(metricKey);
    if (idx >= 0) {
        if (selectedTrendMetrics.length <= 1) return;
        selectedTrendMetrics.splice(idx, 1);
    } else {
        if (selectedTrendMetrics.length >= 4) {
            selectedTrendMetrics.shift();
        }
        selectedTrendMetrics.push(metricKey);
    }
    syncTrendMetricTilesUI();
    mountMainTrendChart();
}

function setOverviewTopTab(mode) {
    if (!['profit', 'revenue', 'low'].includes(mode)) mode = 'profit';
    activeOverviewTopTab = mode;
    renderOverviewExtras(lastGrandTotals);
}

function buildTrendSeriesData() {
    const isSingleMonth = typeof monthSelection !== 'undefined' && monthSelection?.mode === 'single';
    const isCurrentTab = typeof activeWorkspaceTab !== 'undefined' && activeWorkspaceTab === 'current';
    const filteredMonths = Array.isArray(monthlyEvolutionList)
        ? monthlyEvolutionList.filter(m => (typeof matchesMonthSelection === 'function' ? matchesMonthSelection(m.monthKey) : true))
        : [];

    if (!isCurrentTab && !isSingleMonth && filteredMonths.length > 1) {
        return {
            granularity: 'monthly',
            granularityLabel: 'Série Mensal',
            points: filteredMonths.map(m => ({
                label: m.shortLabel,
                monthKey: m.monthKey,
                revenue: Number(m.revenue) || 0,
                profit: Number(m.profit) || 0,
                orders: Number(m.orders) || 0,
                cancelled: Number(m.cancelledOrders) || 0
            }))
        };
    }

    const taxRate = getTaxRatePercent() / 100;
    const pkgPerUnit = Number(extraExpenses?.packagingPerUnit) || 0;
    const dayMap = new Map();

    const ensureDay = (iso) => {
        if (!dayMap.has(iso)) {
            dayMap.set(iso, {
                iso,
                orderIds: new Set(),
                cancelledIds: new Set(),
                shRevenue: 0,
                mlRevenue: 0,
                units: 0,
                cost: 0,
                fees: 0,
                shipping: 0
            });
        }
        return dayMap.get(iso);
    };

    let totalShRev = 0;
    let totalMlRev = 0;
    (rawOrders || []).forEach(o => {
        const iso = o.isoDate || (typeof extractISODate === 'function' ? extractISODate(o.date) : '') || 'Sem Data';
        const d = ensureDay(iso);
        const displayName = groupingMode === 'listing' ? (o.productName || o.canonicalName) : (o.canonicalName || o.productName);
        const unitCost = getCost(displayName, o.canonicalName, o.defaultModelCost || 0);
        const qty = Math.max(1, Number(o.qty) || 1);
        const rev = Number(o.subtotal) || 0;

        d.orderIds.add(`${o.channel}:${o.orderId}`);
        d.units += qty;
        d.cost += unitCost * qty;
        d.fees += Number(o.itemFees) || 0;
        d.shipping += Number(o.itemShipping) || 0;
        if (o.channel === 'shopee') {
            d.shRevenue += rev;
            totalShRev += rev;
        } else {
            d.mlRevenue += rev;
            totalMlRev += rev;
        }
    });

    (activeCancelledOrders || []).forEach(c => {
        const iso = c.isoDate || (typeof extractISODate === 'function' ? extractISODate(c.date) : '') || 'Sem Data';
        ensureDay(iso).cancelledIds.add(`${c.channel}:${c.orderId}`);
    });

    const adsSh = totalShRev > 0 ? (Number(extraExpenses?.adsShopee) || 0) : 0;
    const adsMl = totalMlRev > 0 ? (Number(extraExpenses?.adsML) || 0) : 0;
    const sortedKeys = [...dayMap.keys()].filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
    if (dayMap.has('Sem Data') && sortedKeys.length === 0) sortedKeys.push('Sem Data');

    const points = sortedKeys.map(iso => {
        const d = dayMap.get(iso);
        const rev = d.shRevenue + d.mlRevenue;
        const dayAdsSh = totalShRev > 0 ? adsSh * (d.shRevenue / totalShRev) : 0;
        const dayAdsMl = totalMlRev > 0 ? adsMl * (d.mlRevenue / totalMlRev) : 0;
        const extras = d.units * pkgPerUnit + dayAdsSh + dayAdsMl;
        const tax = rev * taxRate;
        const profit = rev - d.cost - d.fees - d.shipping - tax - extras;
        const label = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : iso;
        return {
            label,
            iso,
            revenue: rev,
            profit,
            orders: d.orderIds.size,
            cancelled: d.cancelledIds.size
        };
    });

    return {
        granularity: 'daily',
        granularityLabel: 'Série Diária',
        points
    };
}

function mountMainTrendChart() {
    const canvas = document.getElementById('chart-main-trend');
    const granEl = document.getElementById('trend-granularity-label');
    if (!canvas || typeof Chart === 'undefined') return;
    destroyAnalyticsChart('chart-main-trend');

    const series = buildTrendSeriesData();
    if (granEl) granEl.textContent = series.granularityLabel;
    if (!series.points || series.points.length === 0) return;

    const activeMetrics = selectedTrendMetrics.filter(m => TREND_METRICS_CONFIG[m]);
    if (activeMetrics.length === 0) return;

    const hasMoney = activeMetrics.some(m => TREND_METRICS_CONFIG[m].kind === 'money');
    const hasCount = activeMetrics.some(m => TREND_METRICS_CONFIG[m].kind === 'count');

    const datasets = activeMetrics.map((mKey, idx) => {
        const cfg = TREND_METRICS_CONFIG[mKey];
        const yAxisID = cfg.kind === 'count' ? 'yCount' : 'y';
        return {
            type: 'line',
            label: cfg.label,
            data: series.points.map(pt => Number((pt[mKey] || 0).toFixed(2))),
            yAxisID,
            borderColor: cfg.color,
            backgroundColor: cfg.bg,
            borderWidth: 2.2,
            pointRadius: series.points.length <= 16 ? 3 : 1.8,
            pointHoverRadius: 5,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: cfg.color,
            pointBorderWidth: 2,
            fill: idx === 0 && activeMetrics.length <= 2,
            tension: 0.28
        };
    });

    const scales = {
        x: {
            grid: { display: false },
            ticks: {
                color: '#71717A',
                font: { size: 10.5, weight: '600' },
                maxTicksLimit: series.granularity === 'daily' ? 12 : 12
            }
        }
    };

    if (hasMoney) {
        scales.y = {
            position: 'left',
            grid: { color: '#F0F0F2' },
            border: { display: false, dash: [4, 4] },
            ticks: { color: '#71717A', font: { size: 10.5 }, callback: formatCompactBrlTick }
        };
    }

    if (hasCount) {
        scales.yCount = {
            position: hasMoney ? 'right' : 'left',
            beginAtZero: true,
            grid: { drawOnChartArea: !hasMoney, color: '#F0F0F2' },
            border: { display: false },
            ticks: {
                color: hasMoney ? '#059669' : '#71717A',
                precision: 0,
                font: { size: 10.5 }
            }
        };
    }

    analyticsChartRegistry['chart-main-trend'] = new Chart(canvas, {
        data: {
            labels: series.points.map(pt => pt.label),
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            onClick: (_evt, elements) => {
                if (series.granularity !== 'monthly' || !elements || elements.length === 0) return;
                const mk = series.points[elements[0].index]?.monthKey;
                if (!mk || typeof setMonthSelection !== 'function') return;
                setMonthSelection('single', mk);
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#18181B',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 7,
                        boxHeight: 7,
                        padding: 14,
                        font: { size: 11, weight: '600' }
                    }
                },
                tooltip: {
                    backgroundColor: '#111113',
                    titleColor: '#FFFFFF',
                    bodyColor: '#F4F5F7',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => {
                            const mKey = activeMetrics[ctx.datasetIndex];
                            const cfg = TREND_METRICS_CONFIG[mKey];
                            const val = ctx.parsed.y ?? 0;
                            if (cfg?.kind === 'count') {
                                return `${ctx.dataset.label}: ${Math.round(val)}`;
                            }
                            return `${ctx.dataset.label}: ${fmt(val)}`;
                        }
                    }
                }
            },
            scales
        }
    });
}

function mountSidebarSparkChart(series) {
    const canvas = document.getElementById('chart-sidebar-spark');
    if (!canvas || typeof Chart === 'undefined') return;
    destroyAnalyticsChart('chart-sidebar-spark');

    const pts = (series?.points || []).slice(-14);
    if (pts.length === 0) return;

    analyticsChartRegistry['chart-sidebar-spark'] = new Chart(canvas, {
        type: 'line',
        data: {
            labels: pts.map(p => p.label),
            datasets: [{
                label: 'Lucro',
                data: pts.map(p => Number((p.profit || 0).toFixed(2))),
                borderColor: '#DC2626',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 3.5,
                fill: true,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111113',
                    displayColors: false,
                    padding: 6,
                    callbacks: {
                        label: (ctx) => `Lucro: ${fmt(ctx.parsed.y ?? 0)}`
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

function updateRightSummarySidebar(totals) {
    const titleEl = document.getElementById('right-summary-title');
    const subTitleEl = document.getElementById('right-summary-subtitle');
    const heroLabelEl = document.getElementById('right-hero-label');
    const heroValEl = document.getElementById('right-hero-value');
    const heroSubEl = document.getElementById('right-hero-sub');
    if (!titleEl || !heroValEl) return;

    const avgTicket = totals.validOrders > 0 ? totals.revenue / totals.validOrders : 0;
    const avgUnitsOrder = totals.validOrders > 0 ? totals.totalUnits / totals.validOrders : 0;
    const isCurrent = typeof activeWorkspaceTab !== 'undefined' && activeWorkspaceTab === 'current';

    if (isCurrent) {
        const pace = computeCurrentMonthPace();
        titleEl.textContent = 'Ritmo & Projeção do Mês';
        if (subTitleEl) {
            subTitleEl.textContent = pace
                ? `${pace.elapsedDays}/${pace.daysInMonth} dias (${fmtPct(pace.progressPct)})`
                : (currentPeriodText || 'Mês Atual');
        }
        if (heroLabelEl) {
            heroLabelEl.textContent = pace ? `Projeção Receita (${pace.daysInMonth}d)` : 'Projeção do Mês';
        }
        heroValEl.textContent = pace ? fmt(pace.projectedRev) : fmt(totals.revenue);
        if (heroSubEl) {
            heroSubEl.textContent = pace
                ? `Ritmo: ${fmt(pace.dailyRev)}/dia · Lucro proj.: ${fmt(pace.projectedProfit)}`
                : `Ticket médio ${fmt(avgTicket)}`;
        }
    } else {
        titleEl.textContent = 'Raio-X de Custos';
        if (subTitleEl) subTitleEl.textContent = currentPeriodText || 'Estrutura sobre receita bruta';
        if (heroLabelEl) heroLabelEl.textContent = 'Lucro Médio / Pedido';
        const profitPerOrder = totals.validOrders > 0 ? totals.profit / totals.validOrders : 0;
        heroValEl.textContent = fmt(profitPerOrder);
        if (heroSubEl) {
            heroSubEl.textContent = `Ticket médio ${fmt(avgTicket)} · ${avgUnitsOrder.toFixed(2).replace('.', ',')} unid./ped.`;
        }
    }

    mountSidebarSparkChart(buildTrendSeriesData());
}

function renderOverviewExtras(totals) {
    const contribWrap = document.getElementById('overview-channel-contrib');
    const topWrap = document.getElementById('overview-top-products');

    if (contribWrap) {
        const sh = totals.channels?.shopee || {};
        const ml = totals.channels?.mercadolivre || {};
        const totalRev = Math.max(0.01, totals.revenue || 0);
        const shPct = ((sh.revenue || 0) / totalRev) * 100;
        const mlPct = ((ml.revenue || 0) / totalRev) * 100;
        const aClass = totals.abc?.A || { count: 0, revenue: 0, revPct: 0, profit: 0 };

        contribWrap.innerHTML = `
            <div class="contrib-cell ${activeChannel === 'all' ? 'active' : ''} clickable" onclick="setActiveChannel('all')" title="Exibir todos os canais consolidados">
                <div class="contrib-cell-top"><span>Consolidado</span><span class="contrib-cell-pct">100%</span></div>
                <div class="contrib-cell-val">${fmt(totals.revenue || 0)}</div>
                <div class="contrib-cell-sub">Lucro ${fmt(totals.profit || 0)} · ${fmtPct(totals.margin || 0)}</div>
            </div>
            <div class="contrib-cell ${activeChannel === 'shopee' ? 'active' : ''} ${(sh.orders || 0) > 0 ? 'clickable' : ''}" ${(sh.orders || 0) > 0 ? 'onclick="setActiveChannel(\'shopee\')" title="Filtrar somente Shopee"' : ''}>
                <div class="contrib-cell-top"><span>Shopee</span><span class="contrib-cell-pct">${fmtPct(shPct)} rec.</span></div>
                <div class="contrib-cell-val">${fmt(sh.revenue || 0)}</div>
                <div class="contrib-cell-sub">${sh.orders || 0} ped. · Lucro ${fmt(sh.profit || 0)} (${fmtPct(sh.margin || 0)})</div>
            </div>
            <div class="contrib-cell ${activeChannel === 'mercadolivre' ? 'active' : ''} ${(ml.orders || 0) > 0 ? 'clickable' : ''}" ${(ml.orders || 0) > 0 ? 'onclick="setActiveChannel(\'mercadolivre\')" title="Filtrar somente Mercado Livre"' : ''}>
                <div class="contrib-cell-top"><span>Mercado Livre</span><span class="contrib-cell-pct">${fmtPct(mlPct)} rec.</span></div>
                <div class="contrib-cell-val">${fmt(ml.revenue || 0)}</div>
                <div class="contrib-cell-sub">${ml.orders || 0} ped. · Lucro ${fmt(ml.profit || 0)} (${fmtPct(ml.margin || 0)})</div>
            </div>
            <div class="contrib-cell clickable" onclick="switchSubTab('products');setProductQuickFilter('A')" title="Abrir produtos Curva A (80% da receita)">
                <div class="contrib-cell-top"><span>Curva A (Pareto)</span><span class="contrib-cell-pct">${fmtPct(aClass.revPct || 0)} rec.</span></div>
                <div class="contrib-cell-val">${fmt(aClass.revenue || 0)}</div>
                <div class="contrib-cell-sub">${aClass.count || 0} produtos-chave · Lucro ${fmt(aClass.profit || 0)} →</div>
            </div>
        `;
    }

    if (topWrap) {
        if (!topWrap.dataset.bound) {
            topWrap.dataset.bound = '1';
            topWrap.addEventListener('click', (e) => {
                const trigger = e.target.closest('[data-overview-prod-idx]');
                if (!trigger) return;
                const key = overviewProductKeys[Number(trigger.dataset.overviewProdIdx)];
                if (key !== undefined && typeof showDetail === 'function') {
                    showDetail(key);
                }
            });
        }

        const targetMargin = getTargetMarginPercent();
        const allItems = Object.entries(productSummary).map(([key, p]) => ({ key, ...p }));
        let list = [];
        if (activeOverviewTopTab === 'revenue') {
            list = [...allItems].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 7);
        } else if (activeOverviewTopTab === 'low') {
            list = [...allItems]
                .filter(p => p._profit < 0 || (p._costUnit > 0 && p._margin < targetMargin))
                .sort((a, b) => a._margin - b._margin)
                .slice(0, 7);
        } else {
            list = [...allItems].sort((a, b) => b._profit - a._profit).slice(0, 7);
        }

        overviewProductKeys = [];
        const rowsHtml = list.length === 0
            ? `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px;">${activeOverviewTopTab === 'low' ? `✓ Todos os produtos com custo definido atingiram a meta de ${fmtPct(targetMargin)}!` : 'Nenhum produto encontrado no recorte atual.'}</td></tr>`
            : list.map((p, idx) => {
                const prodIdx = overviewProductKeys.push(p.key) - 1;
                const rankCls = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : (idx === 2 ? 'rank-3' : ''));
                const abcCls = p._abcClass || 'C';
                const profitCls = p._profit >= 0 ? 'positive' : 'negative';
                const chTags = [];
                if (p.channels?.has('shopee')) chTags.push('<span class="channel-tag shopee">Shopee</span>');
                if (p.channels?.has('mercadolivre')) chTags.push('<span class="channel-tag ml">ML</span>');
                return `
                    <tr>
                        <td><span class="rank-badge ${rankCls}">${idx + 1}</span></td>
                        <td>
                            <div style="font-weight:700;color:var(--ink-black);line-height:1.25;">${escapeHtml(p.productName)}</div>
                            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                                <span class="abc-badge abc-${abcCls}">Curva ${abcCls}</span>
                                ${p.modelKey ? `<span>${escapeHtml(p.modelKey)}</span>` : ''}
                            </div>
                        </td>
                        <td>${chTags.join(' ')}</td>
                        <td class="td-num">${p.totalQty}</td>
                        <td class="td-money">${fmt(p.totalRevenue)}</td>
                        <td class="td-money td-profit ${profitCls}">${fmt(p._profit)}</td>
                        <td class="td-money"><span class="margin-badge ${profitCls}">${fmtPct(p._margin)}</span></td>
                        <td><button type="button" class="link-more" data-overview-prod-idx="${prodIdx}">Ver detalhes &gt;</button></td>
                    </tr>
                `;
            }).join('');

        topWrap.innerHTML = `
            <div class="top-prod-tabs" role="tablist">
                <button type="button" class="top-prod-tab ${activeOverviewTopTab === 'profit' ? 'active' : ''}" data-top-mode="profit" onclick="setOverviewTopTab('profit')">Top Lucro Líquido</button>
                <button type="button" class="top-prod-tab ${activeOverviewTopTab === 'revenue' ? 'active' : ''}" data-top-mode="revenue" onclick="setOverviewTopTab('revenue')">Maior Receita Bruta</button>
                <button type="button" class="top-prod-tab ${activeOverviewTopTab === 'low' ? 'active' : ''}" data-top-mode="low" onclick="setOverviewTopTab('low')">Abaixo da Meta / Prejuízo</button>
            </div>
            <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;max-width:100%;">
                <table class="shopee-mini-table">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Informação do Produto</th>
                            <th>Canais</th>
                            <th style="text-align:right">Unidades</th>
                            <th style="text-align:right">Receita</th>
                            <th style="text-align:right">Lucro Líq.</th>
                            <th style="text-align:right">Margem</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>
        `;
    }
}

function renderCancelledAuditSummaryCardHtml() {
    const list = activeCancelledOrders || [];
    const shCount = list.filter(o => o.channel === 'shopee').length;
    const mlCount = list.filter(o => o.channel === 'mercadolivre').length;
    const lostRev = list.reduce((s, o) => s + (o.amount || 0), 0);
    const reasonMap = new Map();
    list.forEach(o => {
        const key = (o.reason || o.status || 'Não informado').trim();
        reasonMap.set(key, (reasonMap.get(key) || 0) + 1);
    });
    const topReasons = [...reasonMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

    return `
        <div class="analytics-card" id="analytics-cancelled-card" data-analytics-group="audit">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
                <h3 style="margin:0;">❌ Cancelamentos &amp; Devoluções Retidas</h3>
                <button type="button" class="link-more" onclick="openCancelledModal()">Auditar lista (${list.length}) &gt;</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
                <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-xs);padding:10px;">
                    <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">Pedidos Cancelados</div>
                    <div style="font-size:1.15rem;font-weight:800;color:var(--red);margin-top:2px;">${list.length}</div>
                </div>
                <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-xs);padding:10px;">
                    <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">Shopee / ML</div>
                    <div style="font-size:1.0rem;font-weight:700;color:var(--text-primary);margin-top:4px;">${shCount} SHP · ${mlCount} ML</div>
                </div>
                <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-xs);padding:10px;">
                    <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">Receita Não Realizada</div>
                    <div style="font-size:1.05rem;font-weight:800;color:var(--ink-black);margin-top:2px;">${fmt(lostRev)}</div>
                </div>
            </div>
            ${topReasons.length > 0 ? `
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    ${topReasons.map(([r, cnt]) => `<span class="sku-rule-pill">${escapeHtml(r)} <strong>(${cnt})</strong></span>`).join('')}
                </div>
            ` : '<p style="font-size:0.8rem;color:var(--green);">✓ Nenhum pedido cancelado ou reembolsado no recorte.</p>'}
        </div>
    `;
}

function renderAnalyticsSection() {
    const content = document.getElementById('analytics-content');
    const section = document.getElementById('analytics-section');
    if (!content || !section) return;

    if (!hasPrimaryChannelData()) {
        section.style.display = 'none';
        content.innerHTML = '';
        ['chart-main-trend', 'chart-sidebar-spark', 'chart-monthly-evolution', 'chart-composition', 'chart-current-pace'].forEach(destroyAnalyticsChart);
        const cWrap = document.getElementById('overview-channel-contrib');
        const tWrap = document.getElementById('overview-top-products');
        if (cWrap) cWrap.innerHTML = '';
        if (tWrap) tWrap.innerHTML = '';
        return;
    }

    const tab = typeof activeSubTab !== 'undefined' ? activeSubTab : 'overview';
    syncTrendMetricTilesUI();

    if (tab === 'overview') {
        updateRightSummarySidebar(lastGrandTotals);
        mountMainTrendChart();
        renderOverviewExtras(lastGrandTotals);
        ['chart-monthly-evolution', 'chart-composition'].forEach(destroyAnalyticsChart);
        section.style.display = 'none';
        content.innerHTML = '';
        return;
    }

    ['chart-main-trend', 'chart-sidebar-spark'].forEach(destroyAnalyticsChart);

    if (tab === 'products') {
        ['chart-monthly-evolution', 'chart-composition', 'chart-current-pace'].forEach(destroyAnalyticsChart);
        section.style.display = 'none';
        content.innerHTML = '';
        return;
    }

    section.style.display = '';
    content.style.display = '';
    if (!content.dataset.bound) {
        content.dataset.bound = '1';
        content.addEventListener('click', handleAnalyticsSectionClick);
    }

    const sh = lastGrandTotals.channels?.shopee || {};
    const ml = lastGrandTotals.channels?.mercadolivre || {};
    const all = lastGrandTotals;

    const comparisonRows = [
        { label: 'Pedidos Válidos', format: 'int', sh: sh.orders || 0, ml: ml.orders || 0, all: all.validOrders || 0 },
        { label: 'Unidades Vendidas', format: 'int', sh: sh.units || 0, ml: ml.units || 0, all: all.totalUnits || 0 },
        { label: 'Receita Bruta', format: 'money', sh: sh.revenue || 0, ml: ml.revenue || 0, all: all.revenue || 0 },
        { label: 'Custo Produtos', format: 'money', sh: sh.cost || 0, ml: ml.cost || 0, all: all.cost || 0 },
        { label: 'Taxas Marketplace', format: 'money', sh: sh.fees || 0, ml: ml.fees || 0, all: all.fees || 0 },
        { label: 'Frete Vendedor', format: 'money', sh: sh.shipping || 0, ml: ml.shipping || 0, all: all.shipping || 0 },
        { label: 'Imposto', format: 'money', sh: sh.tax || 0, ml: ml.tax || 0, all: all.tax || 0 },
        { label: 'Emb. + Ads', format: 'money', sh: sh.extras || 0, ml: ml.extras || 0, all: all.extras || 0 },
        { label: 'Lucro Líquido', format: 'profit', sh: sh.profit || 0, ml: ml.profit || 0, all: all.profit || 0 },
        { label: 'Margem Líquida', format: 'pct', sh: sh.margin || 0, ml: ml.margin || 0, all: all.margin || 0 }
    ];

    const formatCell = (val, kind) => {
        if (kind === 'int') return String(Math.round(val));
        if (kind === 'pct') {
            const cls = val >= 0 ? 'positive' : 'negative';
            return `<span class="margin-badge ${cls}">${fmtPct(val)}</span>`;
        }
        if (kind === 'profit') {
            const color = val >= 0 ? 'var(--green)' : 'var(--red)';
            return `<span style="color:${color};font-weight:700;">${fmt(val)}</span>`;
        }
        return fmt(val);
    };

    const cmpRowsHtml = comparisonRows.map(r => `
        <tr>
            <td>${r.label}</td>
            <td>${formatCell(r.sh, r.format)}</td>
            <td>${formatCell(r.ml, r.format)}</td>
            <td>${formatCell(r.all, r.format)}</td>
        </tr>
    `).join('');

    const totalRev = Math.max(0.01, all.revenue || 0);
    const segments = [
        { label: 'Custo Produtos', val: Math.max(0, all.cost || 0), color: '#111113' },
        { label: 'Taxas Marketplace', val: Math.max(0, all.fees || 0), color: '#DC2626' },
        { label: 'Frete Vendedor', val: Math.max(0, all.shipping || 0), color: '#52525B' },
        { label: 'Imposto', val: Math.max(0, all.tax || 0), color: '#F87171' },
        { label: 'Emb. + Ads', val: Math.max(0, all.extras || 0), color: '#A1A1AA' },
        { label: 'Lucro Líquido', val: Math.max(0, all.profit || 0), color: '#059669' }
    ];

    const compBarHtml = `
        <div class="chart-wrap-donut">
            <canvas id="chart-composition"></canvas>
        </div>
        <div class="comp-bar-track" title="Composição percentual sobre a Receita Bruta">
            ${segments.filter(s => s.val > 0).map(s => {
                const pct = Math.min(100, (s.val / totalRev) * 100);
                return `<div class="comp-seg" style="width:${pct.toFixed(2)}%;background:${s.color};" title="${s.label}: ${fmt(s.val)} (${fmtPct(pct)})"></div>`;
            }).join('')}
        </div>
        <div class="comp-legend">
            ${segments.map(s => {
                const pct = all.revenue > 0 ? (s.val / all.revenue) * 100 : 0;
                return `<span class="comp-legend-item"><span class="comp-dot" style="background:${s.color};"></span>${s.label}: <strong>${fmtPct(pct)}</strong></span>`;
            }).join('')}
        </div>
    `;

    const avgTicket = all.validOrders > 0 ? all.revenue / all.validOrders : 0;
    const avgUnitsOrder = all.validOrders > 0 ? all.totalUnits / all.validOrders : 0;
    const roas = all.ads > 0 ? all.revenue / all.ads : 0;

    const summaryPillsHtml = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:14px;">
            <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:10px 12px;">
                <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">Ticket Médio / Pedido</div>
                <div style="font-size:1.05rem;font-weight:800;color:var(--text-primary);margin-top:2px;">${fmt(avgTicket)}</div>
            </div>
            <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:10px 12px;">
                <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">Unid. Médias / Pedido</div>
                <div style="font-size:1.05rem;font-weight:800;color:var(--blue);margin-top:2px;">${avgUnitsOrder.toFixed(2).replace('.', ',')}</div>
            </div>
            <div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:10px 12px;">
                <div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;">${all.ads > 0 ? 'ROAS Geral (Ads)' : 'Lucro / Unidade'}</div>
                <div style="font-size:1.05rem;font-weight:800;color:var(--green);margin-top:2px;">
                    ${all.ads > 0 ? `${roas.toFixed(2).replace('.', ',')}x` : fmt(all.totalUnits > 0 ? all.profit / all.totalUnits : 0)}
                </div>
            </div>
        </div>
    `;

    analyticsProductKeys = [];
    const registerKey = (key) => {
        const idx = analyticsProductKeys.length;
        analyticsProductKeys.push(key);
        return idx;
    };

    const allItems = Object.values(productSummary);
    const targetMargin = getTargetMarginPercent();
    const lowMarginItems = [...allItems]
        .filter(p => p._costUnit > 0 && p._margin < targetMargin)
        .sort((a, b) => a._margin - b._margin)
        .slice(0, 6);

    const renderBarRows = (list) => {
        if (list.length === 0) {
            return `<p style="font-size:0.8rem;color:var(--green);">✓ Todos os produtos com custo definido atingiram a meta de ${fmtPct(targetMargin)}!</p>`;
        }
        return `<div class="bar-chart-list">${list.map(p => {
            const keyIdx = registerKey(p.productName);
            const abcCls = p._abcClass || 'C';
            const widthPct = Math.max(8, Math.min(100, Math.abs(p._margin) * 2.2));
            const barColor = p._profit < 0 ? 'var(--red)' : 'var(--yellow)';
            const valueText = fmtPct(p._margin);
            return `
                <div class="bar-row" data-analytics-key-idx="${keyIdx}" title="Clique para ver detalhes de ${escapeHtml(p.productName)}">
                    <span class="bar-label"><span class="abc-badge abc-${abcCls}" style="margin-right:5px;">${abcCls}</span>${escapeHtml(p.productName)}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${widthPct.toFixed(1)}%;background:${barColor};"></div></div>
                    <span class="bar-val" style="color:${barColor};">${valueText}</span>
                </div>
            `;
        }).join('')}</div>`;
    };

    if (tab === 'sales') {
        const showMonthlyEvo = (typeof activeWorkspaceTab === 'undefined' || activeWorkspaceTab === 'history')
            && typeof monthlyEvolutionList !== 'undefined';
        const evolutionCardHtml = showMonthlyEvo ? renderMonthlyEvolutionCardHtml(monthlyEvolutionList) : '';

        content.innerHTML = `
            <div class="analytics-grid">
                ${evolutionCardHtml}
                <div class="analytics-card" id="analytics-comparison-card" data-analytics-group="sales">
                    <h3>⚖️ Comparativo Direto: Shopee × Mercado Livre</h3>
                    <table class="cmp-table">
                        <thead>
                            <tr><th>Indicador</th><th>Shopee</th><th>Mercado Livre</th><th>Consolidado</th></tr>
                        </thead>
                        <tbody>${cmpRowsHtml}</tbody>
                    </table>
                </div>
                <div class="analytics-card" id="analytics-composition-card" data-analytics-group="sales">
                    <h3>🥧 Composição da Receita &amp; Curva ABC (Pareto 80/20)</h3>
                    ${compBarHtml}
                    ${summaryPillsHtml}
                    ${renderABCCurvePanel(all.abc)}
                </div>
            </div>
        `;
        if (evolutionCardHtml) {
            mountMonthlyEvolutionChart(monthlyEvolutionList);
        } else {
            destroyAnalyticsChart('chart-monthly-evolution');
        }
        mountCompositionChart(segments);
        return;
    }

    ['chart-monthly-evolution', 'chart-composition', 'chart-current-pace'].forEach(destroyAnalyticsChart);
    const auditPayload = computeAuditFindings();

    if (tab === 'audit') {
        content.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card full-span" id="analytics-audit-card" data-analytics-group="audit">
                    ${renderAuditCardInnerHtml(auditPayload)}
                </div>
                <div class="analytics-card" id="analytics-lowmargin-card" data-analytics-group="audit">
                    <h3>⚠️ Abaixo da Meta (${fmtPct(targetMargin)}) / Prejuízo</h3>
                    ${renderBarRows(lowMarginItems)}
                </div>
                ${renderCancelledAuditSummaryCardHtml()}
            </div>
        `;
        return;
    }

    if (tab === 'financial') {
        content.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card full-span" id="analytics-financial-card" data-analytics-group="financial">
                    ${renderFinancialIntelCardHtml(auditPayload.fin)}
                </div>
                <div class="analytics-card full-span" id="analytics-comparison-card" data-analytics-group="financial">
                    <h3>📊 Estrutura Financeira por Canal: Shopee × Mercado Livre</h3>
                    <table class="cmp-table">
                        <thead>
                            <tr><th>Indicador</th><th>Shopee</th><th>Mercado Livre</th><th>Consolidado</th></tr>
                        </thead>
                        <tbody>${cmpRowsHtml}</tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

// ===== AUDITORIA DE CANCELADOS E DEVOLVIDOS =====
function openCancelledModal() {
    const modal = document.getElementById('cancelled-modal');
    const body = document.getElementById('cancelled-modal-body');
    if (!modal || !body) return;

    const list = activeCancelledOrders || [];
    const shList = list.filter(o => o.channel === 'shopee');
    const mlList = list.filter(o => o.channel === 'mercadolivre');
    const totalAmount = list.reduce((s, o) => s + (o.amount || 0), 0);

    const reasonCounts = new Map();
    list.forEach(o => {
        const key = (o.reason || o.status || 'Não informado').trim();
        reasonCounts.set(key, (reasonCounts.get(key) || 0) + 1);
    });
    const topReasons = [...reasonCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    body.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;">
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Total Retidos / Cancelados</div>
                <div style="font-size:1.3rem;font-weight:800;color:var(--red);">${list.length}</div>
            </div>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Shopee / Mercado Pago</div>
                <div style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin-top:3px;">${shList.length} Shopee · ${mlList.length} ML</div>
            </div>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;">
                <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Receita Não Realizada</div>
                <div style="font-size:1.2rem;font-weight:800;color:var(--yellow);">${fmt(totalAmount)}</div>
            </div>
        </div>
        ${topReasons.length > 0 ? `
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                ${topReasons.map(([reason, cnt]) => `<span class="sku-rule-pill">${escapeHtml(reason)} <strong>(${cnt})</strong></span>`).join('')}
            </div>
        ` : ''}
        <div class="costs-toolbar">
            <div class="search-box" style="flex:1;min-width:220px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="cancelled-search-input" class="search-input" placeholder="Buscar pedido, produto ou motivo..." oninput="renderCancelledModalTable()">
            </div>
            <select id="cancelled-channel-filter" onchange="renderCancelledModalTable()">
                <option value="all">Todos os canais (${list.length})</option>
                <option value="shopee">Shopee (${shList.length})</option>
                <option value="mercadolivre">Mercado Livre (${mlList.length})</option>
            </select>
        </div>
        <div id="cancelled-table-wrap" style="max-height:380px;overflow-y:auto;"></div>
    `;

    modal.style.display = 'flex';
    renderCancelledModalTable();
}

function renderCancelledModalTable() {
    const wrap = document.getElementById('cancelled-table-wrap');
    if (!wrap) return;

    const search = normalizeText(document.getElementById('cancelled-search-input')?.value || '');
    const chFilter = document.getElementById('cancelled-channel-filter')?.value || 'all';

    let rows = activeCancelledOrders || [];
    if (chFilter !== 'all') {
        rows = rows.filter(r => r.channel === chFilter);
    }
    if (search) {
        rows = rows.filter(r =>
            normalizeText(r.orderId).includes(search) ||
            normalizeText(r.productName).includes(search) ||
            normalizeText(r.reason).includes(search) ||
            normalizeText(r.status).includes(search) ||
            normalizeText(r.sku).includes(search)
        );
    }

    if (rows.length === 0) {
        wrap.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:20px;">Nenhum registro encontrado para este filtro.</p>`;
        return;
    }

    wrap.innerHTML = `
        <table class="detail-table" style="font-size:0.8rem;">
            <thead>
                <tr>
                    <th>Canal</th><th>Pedido</th><th>Data</th><th>Produto</th>
                    <th>Status / Motivo</th><th style="text-align:right">Valor</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map(o => `
                    <tr>
                        <td><span class="channel-tag ${o.channel === 'shopee' ? 'shopee' : 'ml'}">${o.channel === 'shopee' ? 'Shopee' : 'ML'}</span></td>
                        <td style="font-size:0.74rem;color:var(--text-muted);">${escapeHtml(o.orderId)}</td>
                        <td style="white-space:nowrap;">${escapeHtml(o.date || '—')}</td>
                        <td>${escapeHtml(o.productName)}${o.sku ? `<div style="font-size:0.7rem;color:var(--text-muted);">SKU: ${escapeHtml(o.sku)}</div>` : ''}</td>
                        <td><span style="color:var(--red);font-weight:600;">${escapeHtml(o.status || '—')}</span>${o.reason && o.reason !== o.status ? `<div style="font-size:0.72rem;color:var(--text-secondary);">${escapeHtml(o.reason)}</div>` : ''}</td>
                        <td style="text-align:right;color:var(--yellow);">${fmt(o.amount || 0)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function closeCancelledModal() {
    const modal = document.getElementById('cancelled-modal');
    if (modal) modal.style.display = 'none';
}

// ===== HISTÓRICO MENSAL E COMPARATIVO (SNAPSHOTS) =====
function openSnapshotsModal() {
    const modal = document.getElementById('snapshots-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    renderSnapshotsModal();
}

function closeSnapshotsModal() {
    const modal = document.getElementById('snapshots-modal');
    if (modal) modal.style.display = 'none';
}

async function saveCurrentSnapshot() {
    if (!hasPrimaryChannelData()) {
        showToast('Importe pelo menos uma planilha antes de salvar.', 'warn');
        return;
    }

    const customInput = document.getElementById('snapshot-custom-label');
    const customLabel = String(customInput?.value || '').trim();
    const channelLabel = activeChannel === 'shopee'
        ? 'Shopee'
        : (activeChannel === 'mercadolivre' ? 'ML' : 'Consolidado');
    const label = customLabel || `${currentPeriodText} (${channelLabel})`;

    const snapshot = {
        id: `snap-${Date.now()}`,
        createdAt: Date.now(),
        label,
        periodText: currentPeriodText,
        channel: activeChannel,
        groupingMode,
        taxRate: getTaxRatePercent(),
        targetMargin: getTargetMarginPercent(),
        validOrders: lastGrandTotals.validOrders,
        cancelledOrders: lastGrandTotals.cancelledOrders,
        totalUnits: lastGrandTotals.totalUnits,
        revenue: lastGrandTotals.revenue,
        cost: lastGrandTotals.cost,
        fees: lastGrandTotals.fees,
        shipping: lastGrandTotals.shipping,
        tax: lastGrandTotals.tax,
        extras: lastGrandTotals.extras,
        profit: lastGrandTotals.profit,
        margin: lastGrandTotals.margin,
        channelsBreakdown: lastGrandTotals.channels
    };

    const ok = typeof idbSaveSnapshot === 'function' ? await idbSaveSnapshot(snapshot) : false;
    if (ok) {
        if (customInput) customInput.value = '';
        if (typeof refreshBaselineSnapshotCache === 'function') await refreshBaselineSnapshotCache();
        if (typeof recalcAll === 'function') recalcAll();
        showToast(`Visão "${label}" salva no histórico mensal!`, 'success');
        if (document.getElementById('snapshots-modal')?.style.display !== 'none') {
            renderSnapshotsModal();
        }
    } else {
        showToast('Não foi possível salvar no IndexedDB deste navegador.', 'error');
    }
}

async function deleteSnapshotById(id) {
    if (typeof idbDeleteSnapshot !== 'function') return;
    await idbDeleteSnapshot(id);
    if (typeof refreshBaselineSnapshotCache === 'function') await refreshBaselineSnapshotCache();
    if (typeof recalcAll === 'function') recalcAll();
    showToast('Snapshot removido do histórico.', 'info');
    renderSnapshotsModal();
}

function formatDeltaBadge(current, previous) {
    if (!previous || Math.abs(previous) < 0.01) return '<span style="color:var(--text-muted);font-size:0.72rem;">—</span>';
    const pct = ((current - previous) / Math.abs(previous)) * 100;
    const sign = pct >= 0 ? '+' : '';
    const color = pct >= 0 ? 'var(--green)' : 'var(--red)';
    return `<span style="color:${color};font-size:0.72rem;font-weight:700;">${sign}${pct.toFixed(1).replace('.', ',')}% MoM</span>`;
}

async function renderSnapshotsModal() {
    const body = document.getElementById('snapshots-modal-body');
    if (!body) return;

    const list = typeof idbListSnapshots === 'function' ? await idbListSnapshots() : [];
    const headerForm = `
        <div class="costs-toolbar" style="margin-bottom:14px;">
            <input type="text" id="snapshot-custom-label" class="search-input" style="flex:1;min-width:220px;background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:8px 12px;" placeholder="Nome opcional para este mês (ex: Outubro/2026 - Black Friday)">
        </div>
    `;

    if (list.length === 0) {
        body.innerHTML = `${headerForm}
            <p style="text-align:center;color:var(--text-muted);padding:26px;">
                Nenhum fechamento salvo ainda. Clique em <strong>Salvar Visão Atual no Histórico</strong> para comparar sua evolução mês a mês (MoM).
            </p>`;
        return;
    }

    body.innerHTML = `${headerForm}
        <div style="max-height:400px;overflow-y:auto;">
            <table class="detail-table" style="font-size:0.8rem;">
                <thead>
                    <tr>
                        <th>Mês / Rótulo</th>
                        <th style="text-align:center">Pedidos</th>
                        <th style="text-align:right">Receita Bruta</th>
                        <th style="text-align:right">Emb. + Ads</th>
                        <th style="text-align:right">Lucro Líquido</th>
                        <th style="text-align:right">Margem</th>
                        <th style="text-align:center">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map((s, idx) => {
                        const prev = list[idx + 1];
                        const dateSaved = s.createdAt ? new Date(s.createdAt).toLocaleString('pt-BR') : '';
                        return `
                            <tr>
                                <td>
                                    <strong>${escapeHtml(s.label)}</strong>
                                    <div style="font-size:0.7rem;color:var(--text-muted);">Salvo em ${escapeHtml(dateSaved)} · Imp. ${s.taxRate ?? 9}%</div>
                                </td>
                                <td style="text-align:center;">${s.validOrders} (${s.totalUnits} un.)</td>
                                <td style="text-align:right;color:var(--yellow);">
                                    ${fmt(s.revenue)}
                                    <div>${prev ? formatDeltaBadge(s.revenue, prev.revenue) : ''}</div>
                                </td>
                                <td style="text-align:right;">${fmt(s.extras || 0)}</td>
                                <td style="text-align:right;color:${s.profit >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700;">
                                    ${fmt(s.profit)}
                                    <div>${prev ? formatDeltaBadge(s.profit, prev.profit) : ''}</div>
                                </td>
                                <td style="text-align:right;"><span class="margin-badge ${s.profit >= 0 ? 'positive' : 'negative'}">${fmtPct(s.margin)}</span></td>
                                <td style="text-align:center;">
                                    <button type="button" class="btn btn-outline" style="padding:4px 8px;font-size:0.72rem;" onclick="deleteSnapshotById('${escapeHtml(s.id)}')">Excluir</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===== EXPORTAÇÃO EXCEL EXECUTIVO MULTI-ABAS (NEXUS BI) =====
function buildStyledExcelSheet(rows, colWidths, fallbackRow) {
    const data = rows && rows.length > 0 ? rows : [fallbackRow];
    const ws = XLSX.utils.json_to_sheet(data);
    if (Array.isArray(colWidths) && colWidths.length > 0) {
        ws['!cols'] = colWidths.map(w => ({ wch: w }));
    }
    return ws;
}

function buildExecSummarySheetRows(round2) {
    const sh = lastGrandTotals.channels?.shopee || {};
    const ml = lastGrandTotals.channels?.mercadolivre || {};
    const all = lastGrandTotals;
    const abc = all.abc || {};
    const avgTicket = all.validOrders > 0 ? all.revenue / all.validOrders : 0;
    const roas = all.ads > 0 ? all.revenue / all.ads : 0;

    const rows = [
        { 'Indicador': 'Período Analisado', 'Shopee': currentPeriodText, 'Mercado Livre': currentPeriodText, 'Consolidado': currentPeriodText },
        { 'Indicador': 'Imposto Aplicado (%)', 'Shopee': getTaxRatePercent(), 'Mercado Livre': getTaxRatePercent(), 'Consolidado': getTaxRatePercent() },
        { 'Indicador': 'Margem Alvo (%)', 'Shopee': getTargetMarginPercent(), 'Mercado Livre': getTargetMarginPercent(), 'Consolidado': getTargetMarginPercent() },
        { 'Indicador': 'Embalagem / Unid. (R$)', 'Shopee': round2(extraExpenses.packagingPerUnit), 'Mercado Livre': round2(extraExpenses.packagingPerUnit), 'Consolidado': round2(extraExpenses.packagingPerUnit) },
        { 'Indicador': 'Ads Informado (R$)', 'Shopee': round2(extraExpenses.adsShopee), 'Mercado Livre': round2(extraExpenses.adsML), 'Consolidado': round2(extraExpenses.adsShopee + extraExpenses.adsML) },
        { 'Indicador': 'Pedidos Válidos', 'Shopee': sh.orders || 0, 'Mercado Livre': ml.orders || 0, 'Consolidado': all.validOrders },
        { 'Indicador': 'Cancelados / Retidos', 'Shopee': '', 'Mercado Livre': '', 'Consolidado': all.cancelledOrders },
        { 'Indicador': 'Unidades Vendidas', 'Shopee': sh.units || 0, 'Mercado Livre': ml.units || 0, 'Consolidado': all.totalUnits },
        { 'Indicador': 'Ticket Médio / Pedido', 'Shopee': round2(sh.orders > 0 ? sh.revenue / sh.orders : 0), 'Mercado Livre': round2(ml.orders > 0 ? ml.revenue / ml.orders : 0), 'Consolidado': round2(avgTicket) },
        { 'Indicador': 'Receita Bruta', 'Shopee': round2(sh.revenue), 'Mercado Livre': round2(ml.revenue), 'Consolidado': round2(all.revenue) },
        { 'Indicador': 'Custo Produtos (CMV)', 'Shopee': round2(sh.cost), 'Mercado Livre': round2(ml.cost), 'Consolidado': round2(all.cost) },
        { 'Indicador': 'Taxas Marketplace', 'Shopee': round2(sh.fees), 'Mercado Livre': round2(ml.fees), 'Consolidado': round2(all.fees) },
        { 'Indicador': 'Frete Vendedor', 'Shopee': round2(sh.shipping), 'Mercado Livre': round2(ml.shipping), 'Consolidado': round2(all.shipping) },
        { 'Indicador': 'Imposto', 'Shopee': round2(sh.tax), 'Mercado Livre': round2(ml.tax), 'Consolidado': round2(all.tax) },
        { 'Indicador': 'Emb. + Ads', 'Shopee': round2(sh.extras), 'Mercado Livre': round2(ml.extras), 'Consolidado': round2(all.extras) },
        { 'Indicador': 'ROAS Geral (x)', 'Shopee': extraExpenses.adsShopee > 0 ? round2((sh.revenue || 0) / extraExpenses.adsShopee) : '', 'Mercado Livre': extraExpenses.adsML > 0 ? round2((ml.revenue || 0) / extraExpenses.adsML) : '', 'Consolidado': roas > 0 ? round2(roas) : '' },
        { 'Indicador': 'Lucro Líquido Real', 'Shopee': round2(sh.profit), 'Mercado Livre': round2(ml.profit), 'Consolidado': round2(all.profit) },
        { 'Indicador': 'Margem Líquida (%)', 'Shopee': round2(sh.margin), 'Mercado Livre': round2(ml.margin), 'Consolidado': round2(all.margin) },
        { 'Indicador': '--- CURVA ABC (PARETO) ---', 'Shopee': 'Qtd Produtos', 'Mercado Livre': 'Receita (R$)', 'Consolidado': '% Receita / Lucro' },
        { 'Indicador': 'Curva A (Núcleo até 80%)', 'Shopee': abc.A?.count || 0, 'Mercado Livre': round2(abc.A?.revenue || 0), 'Consolidado': `${round2(abc.A?.revPct || 0)}% | R$ ${round2(abc.A?.profit || 0)}` },
        { 'Indicador': 'Curva B (80% a 95%)', 'Shopee': abc.B?.count || 0, 'Mercado Livre': round2(abc.B?.revenue || 0), 'Consolidado': `${round2(abc.B?.revPct || 0)}% | R$ ${round2(abc.B?.profit || 0)}` },
        { 'Indicador': 'Curva C (Cauda > 95%)', 'Shopee': abc.C?.count || 0, 'Mercado Livre': round2(abc.C?.revenue || 0), 'Consolidado': `${round2(abc.C?.revPct || 0)}% | R$ ${round2(abc.C?.profit || 0)}` }
    ];

    const activeBaseline = (typeof previousMonthAutoBaseline !== 'undefined' && previousMonthAutoBaseline)
        || (typeof latestBaselineSnapshot !== 'undefined' && latestBaselineSnapshot)
        || null;
    if (activeBaseline) {
        rows.push({
            'Indicador': `Baseline MoM (${activeBaseline.label || 'Base'})`,
            'Shopee': `Rec Base: ${round2(activeBaseline.revenue)}`,
            'Mercado Livre': `Lucro Base: ${round2(activeBaseline.profit)}`,
            'Consolidado': `Margem Base: ${round2(activeBaseline.margin)}%`
        });
    }
    return rows;
}

function buildFinancialSheetRows(fin, round2) {
    const { shopee, mp, retention } = fin;
    const rows = [
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Receita Bruta Aprovada', 'Quantidade / Detalhe': `${mp.orders} pedidos`, 'Valor (R$)': round2(mp.revenue), '% / Taxa': '100%' },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Líquido Creditado (Net Received)', 'Quantidade / Detalhe': 'Após taxas e frete MP', 'Valor (R$)': round2(mp.netReceived), '% / Taxa': mp.revenue > 0 ? round2((mp.netReceived / mp.revenue) * 100) : 0 },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Parcelamento 1x (À vista)', 'Quantidade / Detalhe': `${mp.inst1xCount} linhas`, 'Valor (R$)': round2(mp.inst1xRev), '% / Taxa': mp.revenue > 0 ? round2((mp.inst1xRev / mp.revenue) * 100) : 0 },
        { 'Bloco': 'Mercado Pago', 'Indicador': `Parcelado 2x+ (até ${mp.maxInstallments}x)`, 'Quantidade / Detalhe': `${mp.instMultiCount} linhas`, 'Valor (R$)': round2(mp.instMultiRev), '% / Taxa': mp.revenue > 0 ? round2((mp.instMultiRev / mp.revenue) * 100) : 0 },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Prazo de Liberação (D+ após venda)', 'Quantidade / Detalhe': `Mín ${round2(mp.releaseMin)}d · Máx ${round2(mp.releaseMax)}d`, 'Valor (R$)': round2(mp.releaseAvg), '% / Taxa': 'dias médios' },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Reembolsos Reais (status: refunded)', 'Quantidade / Detalhe': `${retention.mlRefundedCount} pedidos`, 'Valor (R$)': round2(retention.mlRefundedAmount), '% / Taxa': '' },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Pagamentos Recusados (rejected)', 'Quantidade / Detalhe': `${retention.mlRejectedCount} tentativas`, 'Valor (R$)': round2(retention.mlRejectedAmount), '% / Taxa': '' },
        { 'Bloco': 'Mercado Pago', 'Indicador': 'Cancelados (cancelled / outros)', 'Quantidade / Detalhe': `${retention.mlCancelledCount} registros`, 'Valor (R$)': round2(retention.mlCancelledAmount), '% / Taxa': '' }
    ];

    mp.paymentMethods.forEach(m => {
        rows.push({
            'Bloco': 'MP - Meios de Pagamento',
            'Indicador': m.label,
            'Quantidade / Detalhe': `${m.count} un./ped.${m.key === 'credit_card' ? ` · méd. ${round2(m.avgInstallments)}x` : ''}`,
            'Valor (R$)': round2(m.revenue),
            '% / Taxa': round2(m.revPct)
        });
    });

    rows.push(
        { 'Bloco': 'Shopee', 'Indicador': 'Receita Bruta Válida', 'Quantidade / Detalhe': `${shopee.orders} pedidos`, 'Valor (R$)': round2(shopee.revenue), '% / Taxa': '100%' },
        { 'Bloco': 'Shopee', 'Indicador': 'Comissão Shopee', 'Quantidade / Detalhe': 'Proporcionada por item', 'Valor (R$)': round2(shopee.commission), '% / Taxa': shopee.revenue > 0 ? round2((shopee.commission / shopee.revenue) * 100) : 0 },
        { 'Bloco': 'Shopee', 'Indicador': 'Taxa de Serviço Shopee', 'Quantidade / Detalhe': 'Proporcionada por item', 'Valor (R$)': round2(shopee.serviceFee), '% / Taxa': shopee.revenue > 0 ? round2((shopee.serviceFee / shopee.revenue) * 100) : 0 },
        { 'Bloco': 'Shopee', 'Indicador': 'Cupom do Vendedor', 'Quantidade / Detalhe': 'Dedução de pedido proporcionada', 'Valor (R$)': round2(shopee.sellerCoupon), '% / Taxa': shopee.revenue > 0 ? round2((shopee.sellerCoupon / shopee.revenue) * 100) : 0 },
        { 'Bloco': 'Shopee', 'Indicador': 'Desconto do Vendedor', 'Quantidade / Detalhe': 'Nos itens', 'Valor (R$)': round2(shopee.sellerDiscount), '% / Taxa': shopee.revenue > 0 ? round2((shopee.sellerDiscount / shopee.revenue) * 100) : 0 },
        { 'Bloco': 'Shopee', 'Indicador': 'Ajuste PIX', 'Quantidade / Detalhe': 'Informativo planilha Shopee', 'Valor (R$)': round2(shopee.pixAdj), '% / Taxa': '' },
        { 'Bloco': 'Shopee', 'Indicador': 'Ajuste Ação Comercial', 'Quantidade / Detalhe': 'Participação promocional', 'Valor (R$)': round2(shopee.actionAdj), '% / Taxa': '' },
        { 'Bloco': 'Shopee', 'Indicador': 'Cancelados / Devoluções Shopee', 'Quantidade / Detalhe': `${retention.shCancelledCount} pedidos`, 'Valor (R$)': round2(retention.shCancelledAmount), '% / Taxa': '' }
    );

    return rows;
}

function exportExcelReport() {
    if (typeof XLSX === 'undefined') {
        showToast('Biblioteca XLSX indisponível para exportar Excel.', 'error');
        return;
    }
    if (!hasPrimaryChannelData()) {
        showToast('Importe pelo menos uma planilha antes de exportar.', 'warn');
        return;
    }

    const round2 = v => Math.round((Number(v) || 0) * 100) / 100;
    const auditPayload = computeAuditFindings();

    // Aba 1: Resumo Executivo (KPIs + Curva ABC + Baseline MoM)
    const execRows = buildExecSummarySheetRows(round2);

    // Aba 2: Auditoria e Riscos com Severidade
    const auditRows = auditPayload.findings.map(f => ({
        'Severidade': f.severity,
        'Categoria': f.category,
        'Origem': f.source,
        'Achado': f.title,
        'Detalhe': f.detail,
        'Impacto Estimado': f.impactText || '',
        'Impacto Numérico': round2(f.impactVal || 0),
        'Recomendação': f.recommendation
    }));

    // Aba 3: Produtos (Curva ABC + Rentabilidade)
    const itemsByRevenue = Object.values(productSummary).sort((a, b) => b.totalRevenue - a.totalRevenue);
    const productRows = itemsByRevenue.map(p => ({
        'Curva ABC': p._abcClass || 'C',
        'Part. Receita (%)': round2(p._revSharePct || 0),
        'Acumulado Rec. (%)': round2(p._cumRevPct || 0),
        'Produto': p.productName,
        'Modelo': p.modelKey || '',
        'SKUs': [...p.skus].join(', '),
        'Canais': [p.channels.has('shopee') ? 'Shopee' : '', p.channels.has('mercadolivre') ? 'Mercado Livre' : ''].filter(Boolean).join(' + '),
        'Qtd': p.totalQty,
        'Receita Bruta': round2(p.totalRevenue),
        'Custo Unitário': round2(p._costUnit),
        'Custo Total': round2(p._costTotal),
        'Taxas Marketplace': round2(p._fees),
        'Frete Vendedor': round2(p.totalShipping),
        'Imposto': round2(p._tax),
        'Emb. + Ads': round2(p._extras),
        'Lucro Líquido': round2(p._profit),
        'Margem (%)': round2(p._margin),
        'Preço Sugerido': round2(p._recommendedPrice),
        'Status': p._insight?.label || ''
    }));
    productRows.push({
        'Curva ABC': 'TOTAL',
        'Part. Receita (%)': 100,
        'Acumulado Rec. (%)': 100,
        'Produto': `TOTAL (${itemsByRevenue.length} produtos)`,
        'Modelo': '',
        'SKUs': '',
        'Canais': '',
        'Qtd': lastGrandTotals.totalUnits,
        'Receita Bruta': round2(lastGrandTotals.revenue),
        'Custo Unitário': '',
        'Custo Total': round2(lastGrandTotals.cost),
        'Taxas Marketplace': round2(lastGrandTotals.fees),
        'Frete Vendedor': round2(lastGrandTotals.shipping),
        'Imposto': round2(lastGrandTotals.tax),
        'Emb. + Ads': round2(lastGrandTotals.extras),
        'Lucro Líquido': round2(lastGrandTotals.profit),
        'Margem (%)': round2(lastGrandTotals.margin),
        'Preço Sugerido': '',
        'Status': ''
    });

    // Aba 4: Inteligência Financeira & Fluxo de Caixa
    const finRows = buildFinancialSheetRows(auditPayload.fin, round2);

    // Aba 5: Reembolsos e Cancelados
    const cancelledRows = (activeCancelledOrders || []).map(o => ({
        'Canal': o.channel === 'shopee' ? 'Shopee' : 'Mercado Livre',
        'Pedido': o.orderId,
        'Data': o.date || '',
        'Produto': o.productName || '',
        'SKU': o.sku || '',
        'Status': o.status || '',
        'Classificação': o.channel === 'shopee' ? 'Cancelado / Devolvido' : classifyMLCancelledStatus(o.status),
        'Motivo / Detalhe': o.reason || '',
        'Valor Pedido': round2(o.amount || 0),
        'Valor Reembolsado': round2(o.amountRefunded || 0),
        'Claim ID': o.claimId || '',
        'Chargeback ID': o.chargebackId || ''
    }));

    const evoList = typeof monthlyEvolutionList !== 'undefined' ? monthlyEvolutionList : [];
    const evoRows = evoList.map(m => ({
        'Mês': m.label,
        'Chave': m.monthKey,
        'Pedidos Válidos': m.orders,
        'Cancelados': m.cancelledOrders || 0,
        'Unidades': m.units,
        'Receita Shopee': round2(m.shRevenue),
        'Receita Mercado Livre': round2(m.mlRevenue),
        'Receita Bruta': round2(m.revenue),
        'Custo Produtos (CMV)': round2(m.cost),
        'Taxas Marketplace': round2(m.fees),
        'Frete Vendedor': round2(m.shipping),
        'Imposto': round2(m.tax),
        'Emb. + Ads': round2(m.extras),
        'Lucro Líquido': round2(m.profit),
        'Margem (%)': round2(m.margin),
        'Var. Receita MoM (%)': m.revDeltaPct === null ? '' : round2(m.revDeltaPct)
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(execRows, [32, 22, 22, 26], { 'Info': 'Sem dados.' }), 'Resumo Executivo');
    XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(auditRows, [12, 22, 16, 44, 52, 20, 16, 52], { 'Info': 'Nenhum alerta de auditoria detectado.' }), 'Auditoria e Riscos');
    XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(productRows, [11, 16, 17, 42, 18, 28, 22, 8, 15, 14, 14, 16, 15, 13, 13, 15, 12, 15, 16], { 'Info': 'Sem produtos.' }), 'Produtos (Curva ABC)');
    XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(finRows, [24, 38, 34, 16, 14], { 'Info': 'Sem dados financeiros.' }), 'Inteligencia Financeira');
    XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(cancelledRows, [15, 22, 18, 42, 22, 16, 20, 36, 14, 16, 16, 16], { 'Info': 'Nenhum pedido cancelado ou devolvido no recorte.' }), 'Reembolsos e Cancelados');
    if (evoRows.length > 0) {
        XLSX.utils.book_append_sheet(wb, buildStyledExcelSheet(evoRows, [18, 10, 15, 12, 11, 16, 20, 16, 18, 16, 15, 13, 13, 16, 12, 18], { 'Info': 'Sem dados mensais.' }), 'Evolucao Mensal');
    }

    const sheetCount = wb.SheetNames.length;
    const safePeriod = currentPeriodText.replace(/[^\w\u00C0-\u00FF-]+/g, '_');
    XLSX.writeFile(wb, `Relatorio_Nexus_BI_SouthTeam_${safePeriod}.xlsx`);
    showToast(`Planilha Executiva Nexus BI (${sheetCount} abas) exportada com sucesso!`, 'success');
}
