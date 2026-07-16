/**
 * Benchmark orchestrator. Launches one Chromium (Playwright's pinned build),
 * injects each product build into its own page, and runs every matching
 * scenario. When two builds are provided it interleaves base/PR measurements
 * iteration-by-iteration so transient runner slowdowns hit both equally.
 *
 * Usage:
 *   tsx run.ts --pr code                         # single build -> writes actual/
 *   tsx run.ts --base code-base --pr code        # interleaved base vs PR
 *   tsx run.ts --pr code --pattern scroll        # filter scenarios by path
 */
import type { Browser, Page } from '@playwright/test';
import type { Scenario } from './scenario.ts';

import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { argv } from 'node:process';

import { chromium } from '@playwright/test';
import yargs from 'yargs';

import { createBuildPage } from './browser.ts';

const REPO_ROOT = resolve(__dirname, '../../..');
const BENCH_DIR = resolve(__dirname, '..');
const OUTPUT_ROOT = join(REPO_ROOT, 'tmp', 'benchmarks');

interface Build {
    label: 'base' | 'actual';
    dir: string;
}

async function findScenarioFiles(): Promise<string[]> {
    const files: string[] = [];
    const products = await readdir(BENCH_DIR, { withFileTypes: true });
    for (const product of products) {
        if (!product.isDirectory() || product.name === 'harness') {
            continue;
        }
        const scenarioDir = join(BENCH_DIR, product.name, 'scenarios');
        if (!existsSync(scenarioDir)) {
            continue;
        }
        for (const entry of await readdir(scenarioDir)) {
            if (entry.endsWith('.bench.ts')) {
                files.push(join(scenarioDir, entry));
            }
        }
    }
    return files.sort();
}

async function run(): Promise<void> {
    const args = await yargs(argv.slice(2))
        .option('base', { type: 'string' })
        .option('pr', { type: 'string', default: 'code' })
        .option('pattern', { type: 'string' })
        .option('iterations', { type: 'number' })
        .option('warmup', { type: 'number' })
        .argv;

    const builds: Build[] = [];
    if (args.base) {
        const baseDir = resolve(REPO_ROOT, args.base);
        if (!existsSync(baseDir)) {
            throw new Error(`Base build dir not found: ${baseDir}`);
        }
        builds.push({ label: 'base', dir: baseDir });
    }
    const prDir = resolve(REPO_ROOT, args.pr);
    if (!existsSync(prDir)) {
        throw new Error(`PR build dir not found: ${prDir}. Run \`npx gulp scripts --product Grid\` first.`);
    }
    builds.push({ label: 'actual', dir: prDir });

    let scenarioFiles = await findScenarioFiles();
    if (args.pattern) {
        const re = new RegExp(args.pattern);
        scenarioFiles = scenarioFiles.filter(f => re.test(f));
    }
    if (!scenarioFiles.length) {
        console.log('No scenarios matched.');
        return;
    }

    console.log(
        `Builds: ${builds.map(b => b.label).join(' vs ')} | ` +
        `${scenarioFiles.length} scenario(s)` +
        (builds.length > 1 ? ' | interleaved' : '')
    );

    // --expose-gc lets the harness drop each iteration's grid before the next,
    // so heavy scenarios don't bias each other through accumulating heap.
    const browser: Browser = await chromium.launch({
        args: ['--js-flags=--expose-gc']
    });
    // Lazily created page per (build label, product).
    const pageCache = new Map<string, Page>();
    const getPage = async (build: Build, product: string): Promise<Page> => {
        const key = `${build.label}:${product}`;
        let page = pageCache.get(key);
        if (!page) {
            page = await createBuildPage(browser, build.dir, product);
            pageCache.set(key, page);
        }
        return page;
    };

    try {
        for (const file of scenarioFiles) {
            const scenario = (await import(file)).default as Scenario;
            const iterations = args.iterations ?? scenario.iterations ?? 20;
            const warmup = args.warmup ?? scenario.warmup ?? 3;
            const params = scenario.params ?? {};

            console.log(
                `\n▶ ${scenario.product}/${scenario.name} ` +
                `(${iterations} iters + ${warmup} warmup)`
            );

            // samples[buildLabel][step][metric] = number[]
            const samples: Record<string, Record<string, Record<string, number[]>>> = {};
            for (const b of builds) {
                samples[b.label] = {};
            }

            for (let iter = 0; iter < warmup + iterations; iter++) {
                // Alternate which build goes first each iteration for fairness.
                const order = iter % 2 === 0 ? builds : [...builds].reverse();
                const measured = iter >= warmup;

                for (const build of order) {
                    const page = await getPage(build, scenario.product);
                    const ctx = { page, params };

                    if (scenario.prepare) {
                        await scenario.prepare(ctx);
                    }

                    for (const [stepName, stepFn] of Object.entries(scenario.steps)) {
                        const metrics = await stepFn(ctx);
                        if (!measured) {
                            continue;
                        }
                        const stepBucket = (samples[build.label][stepName] ??= {});
                        for (const [metric, value] of Object.entries(metrics)) {
                            (stepBucket[metric] ??= []).push(value);
                        }
                    }

                    // Drop this iteration's grid and reclaim heap so neither
                    // build biases the other through accumulated memory.
                    await page.evaluate(() => {
                        window.__bench.reset();
                        window.__bench.gc();
                    });
                }

                if (measured && (iter - warmup + 1) % 5 === 0) {
                    console.log(`  ${iter - warmup + 1}/${iterations}`);
                }
            }

            for (const build of builds) {
                const dir = join(OUTPUT_ROOT, build.label, scenario.product);
                await mkdir(dir, { recursive: true });
                await writeFile(
                    join(dir, `${scenario.name}.json`),
                    JSON.stringify({
                        scenario: scenario.name,
                        product: scenario.product,
                        params,
                        build: build.label,
                        iterations,
                        warmup,
                        steps: samples[build.label]
                    }, undefined, 2)
                );
            }
            console.log(`  ✓ ${relative(REPO_ROOT, join(OUTPUT_ROOT, '<build>', scenario.product, scenario.name + '.json'))}`);
        }
    } finally {
        await browser.close();
    }

    console.log('\nDone. Compare with: tsx harness/compare.ts');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
