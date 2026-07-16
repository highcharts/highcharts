import { defineScenario } from '../../harness/scenario.ts';

/** Vertical virtualized scrolling: per-frame timing, jank and long tasks. */
export default defineScenario({
    name: 'scroll-vertical',
    product: 'grid-lite',
    params: { rows: 100_000, columns: 10, seed: 7, distance: 20_000, steps: 80 },
    prepare: ({ page, params }) => page.evaluate((p) => {
        const columns = window.__bench.genColumns(p.rows, p.columns, p.seed);
        return window.__bench.grid.mount({ data: { columns } });
    }, params),
    steps: {
        scroll: ({ page, params }) => page.evaluate(
            (p) => window.__bench.scrollProfile({
                axis: 'y', distance: p.distance, steps: p.steps
            }),
            params
        )
    }
});
