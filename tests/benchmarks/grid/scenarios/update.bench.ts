import { defineScenario } from '../../harness/scenario.ts';

/** Options update on an existing grid (here: enabling descending sort). */
export default defineScenario({
    name: 'update',
    product: 'grid-lite',
    params: { rows: 100_000, columns: 10, seed: 7 },
    prepare: ({ page, params }) => page.evaluate((p) => {
        const columns = window.__bench.genColumns(p.rows, p.columns, p.seed);
        return window.__bench.grid.mount({ data: { columns } });
    }, params),
    steps: {
        update: ({ page }) => page.evaluate(async () => {
            const updateMs = await window.__bench.time(
                () => window.__bench.grid.update({
                    columnDefaults: { sorting: { order: 'desc' } }
                })
            );
            return { updateMs };
        })
    }
});
