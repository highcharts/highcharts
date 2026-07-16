import { defineScenario } from '../../harness/scenario.ts';

/** Initial render: time from grid() call until the viewport is painted. */
export default defineScenario({
    name: 'render',
    product: 'grid-lite',
    params: { rows: 100_000, columns: 10, seed: 7 },
    steps: {
        render: ({ page, params }) => page.evaluate(async (p) => {
            const columns = window.__bench.genColumns(p.rows, p.columns, p.seed);
            const renderMs = await window.__bench.time(
                () => window.__bench.grid.mount({ data: { columns } })
            );
            return { renderMs, heapMb: window.__bench.heapUsedMb() };
        }, params)
    }
});
