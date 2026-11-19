'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { SouthTeamDB, DEFAULT_DB_PATH } = require('./db');

function exportSnapshot(dbPath = DEFAULT_DB_PATH) {
    if (!fs.existsSync(dbPath)) {
        throw new Error(`Banco SQLite não encontrado em ${dbPath}`);
    }

    const db = new SouthTeamDB(dbPath);
    const bootstrap = db.getBootstrapState();
    const dataset = db.queryDataset({ fromMonth: '', toMonth: '' });
    const files = db.db.prepare(`
        SELECT rel_path, source_type, month_key, period_text, row_count, valid_order_count, cancelled_count, imported_at
        FROM import_files
        ORDER BY month_key ASC, source_type ASC
    `).all();

    const snapshot = {
        version: 1,
        publishedAt: new Date().toISOString(),
        summary: {
            filesCount: files.length,
            ordersCount: dataset.orders.length,
            cancelledCount: dataset.cancelledOrders.length,
            mlPerfCount: dataset.mlPerfRows.length,
            availableMonths: dataset.availableMonths
        },
        bootstrap,
        dataset,
        files
    };

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const targetPath = path.join(dataDir, 'published_snapshot.json');
    fs.writeFileSync(targetPath, JSON.stringify(snapshot));

    const stat = fs.statSync(targetPath);
    return {
        targetPath,
        sizeMb: (stat.size / 1024 / 1024).toFixed(2),
        ordersCount: dataset.orders.length,
        monthsCount: dataset.availableMonths.length,
        publishedAt: snapshot.publishedAt
    };
}

function publishToGit() {
    console.log('📦 1/3 Gerando snapshot consolidado dos dados...');
    const result = exportSnapshot();
    console.log(`✅ Snapshot gerado: ${result.sizeMb} MB com ${result.ordersCount} pedidos em ${result.monthsCount} meses.`);

    console.log('🔄 2/3 Preparando commits no Git...');
    try {
        execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
        
        let hasChanges = false;
        try {
            execSync('git diff --cached --quiet', { cwd: __dirname });
        } catch {
            hasChanges = true;
        }

        if (!hasChanges) {
            console.log('ℹ️ Nenhuma alteração pendente para commit. Tentando push...');
        } else {
            const commitMsg = `Publicação de dados: ${new Date().toLocaleString('pt-BR')} [${result.ordersCount} pedidos]`;
            execSync(`git commit -m "${commitMsg}"`, { cwd: __dirname, stdio: 'inherit' });
            console.log('✅ Commit realizado com sucesso.');
        }

        console.log('🚀 3/3 Enviando para o GitHub (origin/main)...');
        execSync('git push -u origin main', { cwd: __dirname, stdio: 'inherit' });
        console.log('🎉 Publicação concluída com sucesso! Visualizador online atualizado.');
        return { ok: true, ...result };
    } catch (err) {
        console.error('❌ Erro durante a publicação no Git:', err.message);
        throw err;
    }
}

if (require.main === module) {
    try {
        publishToGit();
    } catch {
        process.exit(1);
    }
}

module.exports = { exportSnapshot, publishToGit };
