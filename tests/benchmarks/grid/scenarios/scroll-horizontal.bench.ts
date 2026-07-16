import { defineScenario } from '../../harness/scenario.ts';

/**
 * Horizontal scrolling. Uses many columns so the table overflows its container
 * on the x-axis; the harness auto-detects the horizontal scroll element.
 */
export default defineScenario({
    name: 'scroll-horizontal',
    product: 'grid-lite',
    params: { rows: 5_000, columns: 40, seed: 7, distance: 6_000, steps: 80 },
    prepare: ({ page, params }) => page.evaluate((p) => {
        const columns = window.__bench.genColumns(p.rows, p.columns, p.seed);
        return window.__bench.grid.mount({ data: { columns } });
    }, params),
    steps: {
        scroll: ({ page, params }) => page.evaluate(
            (p) => window.__bench.scrollProfile({
                axis: 'x', distance: p.distance, steps: p.steps
            }),
            params
        )
    }
});
