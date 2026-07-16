/**
 * Compares base vs PR benchmark results and writes a markdown report.
 * A metric is flagged only when the change is both outside the quiet band
 * AND statistically significant (Mann–Whitney U), to filter out runner noise.
 *
 * Writes tmp/benchmarks/table.md (consumed by the PR-comment step).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { summarize, mannWhitneyU } from './stats.ts';

const OUTPUT_ROOT = resolve(__dirname, '../../..', 'tmp', 'benchmarks');
const QUIET_BAND_PERCENT = 5;
const SIGNIFICANCE_P = 0.05;

/** Metrics where a higher value is better; everything else is lower-is-better. */
const HIGHER_IS_BETTER = new Set(['fps']);

/** Coarse metrics shown for context but never flagged (too noisy for A/B). */
const INFORMATIONAL = new Set(['heapMb']);

interface ScenarioResult {
    scenario: string;
    product: string;
    params: Record<string, number | string>;
    steps: Record<string, Record<string, number[]>>;
}

const fmt = (n: number): string =>
    (Number.isFinite(n) ? (Math.abs(n) >= 100 ? Math.round(n) : n.toFixed(1)) : '—').toString();

interface Row {
    line: string;
    loud: boolean;
}

function metricRow(
    step: string,
    metric: string,
    baseSamples: number[],
    prSamples: number[]
): Row {
    const base = summarize(baseSamples);
    const pr = summarize(prSamples);

    const rawDelta = pr.median - base.median;
    const deltaPct = base.median ? (rawDelta / base.median) * 100 : NaN;
    const p = mannWhitneyU(base.samples, pr.samples);

    const higherBetter = HIGHER_IS_BETTER.has(metric);
    const improved = higherBetter ? rawDelta > 0 : rawDelta < 0;
    const significant = !INFORMATIONAL.has(metric) &&
        p < SIGNIFICANCE_P &&
        Number.isFinite(deltaPct) &&
        Math.abs(deltaPct) > QUIET_BAND_PERCENT;

    let marker = '';
    if (significant) {
        marker = improved ? ' ✅' : ' ⚠️';
    }

    const deltaStr = Number.isFinite(deltaPct) ?
        `${deltaPct > 0 ? '+' : ''}${fmt(deltaPct)}%${marker}` : '—';

    const line = `| ${step} | ${metric} | ${fmt(pr.median)} | ${fmt(base.median)} | ` +
        `**${deltaStr}** | ${p < 0.001 ? '<0.001' : p.toFixed(3)} |`;

    return { line, loud: significant };
}

async function loadResults(buildLabel: string): Promise<Map<string, ScenarioResult>> {
    const map = new Map<string, ScenarioResult>();
    const root = join(OUTPUT_ROOT, buildLabel);
    if (!existsSync(root)) {
        return map;
    }
    for (const product of await readdir(root)) {
        const productDir = join(root, product);
        for (const file of await readdir(productDir)) {
            if (!file.endsWith('.json')) {
                continue;
            }
            const data = JSON.parse(
                await readFile(join(productDir, file), 'utf8')
            ) as ScenarioResult;
            map.set(`${data.product}/${data.scenario}`, data);
        }
    }
    return map;
}

async function compare(): Promise<void> {
    const baseResults = await loadResults('base');
    const prResults = await loadResults('actual');

    if (!prResults.size) {
        console.log('No PR results to compare.');
        return;
    }

    const header =
        '| Step | Metric | PR (median) | Master (median) | Δ | p |\n' +
        '| --- | --- | --- | --- | --- | --- |';

    const sections: string[] = [];
    let anyLoud = false;

    for (const [key, pr] of [...prResults.entries()].sort()) {
        const base = baseResults.get(key);
        const rows: Row[] = [];

        for (const [step, metrics] of Object.entries(pr.steps)) {
            for (const [metric, prSamples] of Object.entries(metrics)) {
                const baseSamples = base?.steps?.[step]?.[metric] ?? [];
                rows.push(metricRow(step, metric, baseSamples, prSamples));
            }
        }

        if (rows.some(r => r.loud)) {
            anyLoud = true;
        }

        const paramStr = Object.entries(pr.params)
            .map(([k, v]) => `${k}=${v}`).join(', ');

        sections.push(
            `### ${key}\n` +
            (paramStr ? `\`${paramStr}\`\n\n` : '\n') +
            `${header}\n${rows.map(r => r.line).join('\n')}\n`
        );
    }

    const intro = hasBase(baseResults) ?
        '> ✅ significant improvement · ⚠️ significant regression ' +
        `(outside ±${QUIET_BAND_PERCENT}% and p < ${SIGNIFICANCE_P}).\n\n` :
        '> No base (master) results found — showing PR medians only.\n\n';

    const body = sections.join('\n');
    const md = anyLoud ?
        `${intro}${body}` :
        '### No significant performance changes.\n\n' +
        `<details><summary>See all benchmarks.</summary>\n\n${intro}${body}\n</details>\n`;

    await writeFile(join(OUTPUT_ROOT, 'table.md'), md);
    console.log('Report written to', join(OUTPUT_ROOT, 'table.md'));
}

function hasBase(baseResults: Map<string, unknown>): boolean {
    return baseResults.size > 0;
}

compare().catch(err => {
    console.error(err);
    process.exit(1);
});
