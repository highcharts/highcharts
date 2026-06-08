import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const codeRoot = path.join(repoRoot, 'code');
const externalsFiles = [
    path.join(repoRoot, 'tools/webpacks/externals.json'),
    path.join(repoRoot, 'tools/webpacks/externals-dashboards.json')
];
const masterBundleBasenames = new Set([
    'highcharts.src.js',
    'highstock.src.js',
    'highmaps.src.js',
    'highcharts-gantt.src.js',
    'dashboards.src.js',
    'datagrid.src.js',
    'highcharts.js',
    'highstock.js',
    'highmaps.js',
    'highcharts-gantt.js',
    'dashboards.js',
    'datagrid.js',
    'standalone-navigator.src.js',
    'standalone-navigator.js',
    'grid-lite.src.js',
    'grid-lite.js',
    'grid-pro.src.js',
    'grid-pro.js'
]);

function readJsonArray(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
}

function collectJsFiles(directory) {
    if (!fs.existsSync(directory)) {
        return [];
    }

    const files = [];

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);

        if (entryPath.replace(/\\/g, '/').includes('/es-modules/')) {
            continue;
        }

        if (entry.isDirectory()) {
            files.push(...collectJsFiles(entryPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.js')) {
            files.push(entryPath);
        }
    }

    return files;
}

const externalModuleKeys = [];

for (const externalsFile of externalsFiles) {
    for (const entry of readJsonArray(externalsFile)) {
        if (!entry || !Array.isArray(entry.files)) {
            continue;
        }

        externalModuleKeys.push(...entry.files);
    }
}

const jsFiles = collectJsFiles(codeRoot).filter((filePath) => {
    return !masterBundleBasenames.has(path.basename(filePath)) &&
        !filePath.replace(/\\/g, '/').includes('/es-modules/') &&
        !filePath.replace(/\\/g, '/').includes('/es5/') &&
        !filePath.replace(/\\/g, '/').includes('/esm/');
});

if (!fs.existsSync(codeRoot) || jsFiles.length === 0) {
    console.log('Warning: code/ has no .js files yet; build may not have been run.');
    process.exit(0);
}

const violations = [];

for (const filePath of jsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');

    for (const moduleKey of externalModuleKeys) {
        if (content.includes(`'/${moduleKey}.js'`) || content.includes(`"/${moduleKey}.js"`)) {
            violations.push({ filePath, moduleKey });
        }
    }
}

if (violations.length > 0) {
    for (const violation of violations) {
        console.log(`${path.relative(repoRoot, violation.filePath)}: inlined external ${violation.moduleKey}`);
    }
    process.exit(1);
}

console.log('Success: no externalized modules were inlined into secondary bundles.');
process.exit(0);
