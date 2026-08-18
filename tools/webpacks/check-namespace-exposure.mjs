import FS from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = Path.resolve(Path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONFIGS = [
    {
        configPath: Path.join(ROOT, 'tools/webpacks/externals.json'),
        mastersPath: Path.join(ROOT, 'ts/masters/highcharts.src.ts'),
        label: 'Highcharts'
    },
    {
        configPath: Path.join(ROOT, 'tools/webpacks/externals-dashboards.json'),
        mastersPath: Path.join(ROOT, 'ts/masters-dashboards/dashboards.src.ts'),
        label: 'Dashboards'
    }
];

/**
 * Exports that are intentionally not exposed on the global namespace.
 * These are internal implementation details accessed only by the core,
 * not by externalized secondary bundles.
 */
const ALLOWLIST = new Set([
    // Core/Globals - internal state
    'SVG_NS',
    'charts',
    'composed',
    'dateFormats',
    'seriesTypes',
    'symbolSizes',
    'chartCount',
    // Core/Utilities - internal
    'messages',
    // Shared/Utilities - keyword/type collision
    'enum',
    // Dashboards/Globals - internal constants
    'classNamePrefix',
    'version',
    'classNames',
    'guiElementType',
    'boards',
    'doc',
    'noop',
    'isMS',
    'supportsPassiveEvents'
]);

const exportPatterns = [
    /export\s+(?:async\s+)?(?:function|class|const|let|var|enum)\s+([A-Za-z_$][\w$]*)/gu,
    /export\s+\{([^}]+)\}/gu
];

const missing = [];

for (const { configPath, mastersPath, label } of CONFIGS) {
    if (!FS.existsSync(configPath)) {
        continue;
    }

    const entries = readJson(configPath);
    const mastersSource = readOptionalText(mastersPath);
    if (mastersSource === null) {
        console.warn(`[warn] Missing masters file: ${relative(mastersPath)}`);
    }

    for (const entry of entries) {
        if (entry.namespacePath !== '') {
            continue;
        }

        for (const fileKey of entry.files || []) {
            const sourcePath = Path.join(ROOT, 'ts', `${fileKey}.ts`);
            const source = readOptionalText(sourcePath);
            if (source === null) {
                console.warn(`[warn] Missing source file: ${relative(sourcePath)}`);
                continue;
            }

            const exportNames = collectNamedExports(source);
            for (const name of exportNames) {
                if (ALLOWLIST.has(name)) {
                    continue;
                }

                if (hasNamespaceExposure(mastersSource, name)) {
                    continue;
                }

                missing.push({
                    label,
                    module: fileKey,
                    exportName: name,
                    masters: relative(mastersPath)
                });
            }
        }
    }
}

for (const item of missing) {
    console.warn(`[warn] ${item.label} missing namespace exposure: ${item.module} -> ${item.exportName} (${item.masters})`);
}

process.exit(missing.length > 0 ? 1 : 0);

function readJson(filePath) {
    return JSON.parse(FS.readFileSync(filePath, 'utf8'));
}

function readOptionalText(filePath) {
    if (!FS.existsSync(filePath)) {
        return null;
    }

    return FS.readFileSync(filePath, 'utf8');
}

function collectNamedExports(source) {
    const names = new Set();

    // Single-declaration exports (function, class, const, let, var, enum, async function)
    for (const match of source.matchAll(exportPatterns[0])) {
        names.add(match[1]);
    }

    // Braced export lists: export { A, B as C }
    for (const match of source.matchAll(exportPatterns[1])) {
        for (const specifier of match[1].split(',')) {
            const piece = specifier.trim();
            if (!piece) {
                continue;
            }

            if (piece.startsWith('type ')) {
                continue;
            }

            const aliasMatch = piece.match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/u);
            if (!aliasMatch) {
                continue;
            }

            names.add(aliasMatch[2] || aliasMatch[1]);
        }
    }

    return [...names];
}

function hasNamespaceExposure(source, name) {
    if (!source) {
        return false;
    }

    const escaped = escapeRegExp(name);
    const namespacePattern = new RegExp(`\\bG(?:\\.${escaped}|\\[['"]${escaped}['"]\\])`, 'u');
    return namespacePattern.test(source);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function relative(filePath) {
    return Path.relative(ROOT, filePath);
}
