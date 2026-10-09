// TEMPORARY (#25392) - remove before merging.
//
// Compares UMD, /esm and /es-modules sizes of the working tree against its
// merge-base with master, which is built in a worktree at tmp/size-base.
//
// Usage: node tools/size-compare.mjs [--no-build]
// Cleanup: git worktree remove --force tmp/size-base
//
// UMD: minified size of each file. ESM: what an entry adds on top of the four
// products and its @requires in either tree, i.e. bundle(deps + entry) - bundle(deps). For ESM
// use the min column, gzip deltas of such differences are noisy.
/* eslint-disable no-console, node/no-unpublished-import */
import { execSync } from 'node:child_process';
import { existsSync, globSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
// eslint-disable-next-line node/no-extraneous-import -- comes with tsx
import esbuild from 'esbuild';
import gzipSize from 'gzip-size';

const ROOT = resolve(import.meta.dirname, '..'),
    BASE = join(ROOT, 'tmp/size-base'),
    ref = execSync('git merge-base master HEAD', { cwd: ROOT }).toString().trim();

function sh(cmd, cwd = ROOT) {
    execSync(cmd, { cwd, stdio: 'inherit' });
}

if (!existsSync(BASE)) {
    sh(`git worktree add --detach ${BASE} ${ref}`);
    symlinkSync(join(ROOT, 'node_modules'), join(BASE, 'node_modules'));
}
sh(`git checkout --detach ${ref}`, BASE);

// Sequential, both trees share the gulp scripts cache in node_modules
if (!process.argv.includes('--no-build')) {
    sh('npx gulp scripts --force', BASE);
    sh('npx gulp scripts --force', ROOT);
}

const FLAVORS = {
        umd: 'code',
        esm: 'code/esm',
        'es-modules': 'code/es-modules/masters'
    },
    PRODUCTS = ['highcharts', 'highstock', 'highmaps', 'highcharts-gantt']
        .map(p => `import './${p}.src.js';`).join('\n');

function size(code) {
    return { min: code.length, gz: gzipSize.sync(code) };
}

// Many entries share the same @requires, so reuse their deps-only bundles
const depsCache = {};

async function bundle(dir, contents) {
    const { outputFiles } = await esbuild.build({
        stdin: { contents, resolveDir: dir },
        bundle: true,
        minify: true,
        write: false,
        format: 'esm',
        logLevel: 'silent',
        legalComments: 'none'
    });
    return size(outputFiles[0].text);
}

async function measure(root, flavor) {
    const dir = join(root, FLAVORS[flavor]),
        // Forward slashes, Windows paths break the filter and the imports
        files = globSync('**/*.src.js', { cwd: dir })
            .map(f => f.replaceAll('\\', '/'))
            .filter(f => !/^(?:esm|es-modules|es5|grid|dashboards)\//u.test(f)),
        out = {};

    await Promise.all(files.map(async f => {
        const src = readFileSync(join(dir, f), 'utf8');
        if (flavor === 'umd') {
            const { code } = await esbuild.transform(src, {
                minify: true, legalComments: 'none'
            });
            out[f] = size(code);
            return;
        }
        // @requires of both trees, so both subtract the same deps
        const deps = PRODUCTS + [...new Set([BASE, ROOT].flatMap(r => {
                const p = join(r, FLAVORS[flavor], f);
                return existsSync(p) ? [
                    ...readFileSync(p, 'utf8')
                        .matchAll(/@requires highcharts\/(\S+)/gu)
                ].map(m => m[1]) : [];
            }))].map(m => `\nimport './${m}.src.js';`).join(''),
            [d, s] = await Promise.all([
                depsCache[dir + deps] ??= bundle(dir, deps),
                bundle(dir, `${deps}\nimport './${f}';`)
            ]);
        out[f] = { min: s.min - d.min, gz: s.gz - d.gz };
    }));
    return out;
}

function sign(n) {
    return (n > 0 ? '+' : '') + n;
}

async function main() {
    const lines = [`# Size comparison: ${ref.slice(0, 10)} -> working tree`];

    for (const flavor of Object.keys(FLAVORS)) {
        console.log(`Measuring ${flavor}...`);
        const [a, b] = await Promise.all([
                measure(BASE, flavor), measure(ROOT, flavor)
            ]),
            rows = [],
            total = { min: 0, gz: 0 };

        for (const f of Object.keys(b)) {
            const min = b[f].min - (a[f]?.min || 0),
                gz = b[f].gz - (a[f]?.gz || 0);
            total.min += min;
            total.gz += gz;
            if (min) {
                rows.push({ f, min, gz, base: a[f]?.min ?? 'new' });
            }
        }
        rows.sort((x, y) => y.min - x.min);
        lines.push(
            `\n## ${flavor}: ${rows.length} changed, ` +
            `Δ min ${sign(total.min)} B, Δ gzip ${sign(total.gz)} B\n`,
            '| file | base min | Δ min (B) | Δ gzip (B) |',
            '|---|--:|--:|--:|',
            ...rows.map(r =>
                `| ${r.f} | ${r.base} | ${sign(r.min)} | ${sign(r.gz)} |`)
        );
    }

    const report = lines.join('\n');
    writeFileSync(join(ROOT, 'tmp/size-compare.md'), report);
    console.log(`${report}\n\nWritten to tmp/size-compare.md`);
}

main();
