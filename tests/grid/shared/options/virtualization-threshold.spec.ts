import { test, expect } from '~/fixtures.ts';

test.describe('Grid rows virtualizaion threshold', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/virtualization-threshold');
    });

    test('Should properly set rows virtualizaion based on row count', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const { grids } = (window as any).Grid;
            const grid = grids[0];
            const initialVirtual = grid.viewport.virtualRows;

            // Update data to lower the row count below the default
            // virtualization threshold.
            await grid.update({
                dataTable: {
                    columns: {
                        Data: grid.dataTable.columns.Data.slice(0, 40)
                    }
                }
            });
            const afterUpdate = grid.viewport.virtualRows;

            // Update virtualization manually.
            await grid.update({
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            });
            const afterManual = grid.viewport.virtualRows;

            return {
                initial: initialVirtual,
                afterUpdate,
                afterManual
            };
        });

        expect(result.initial).toBe(true);
        expect(result.afterUpdate).toBe(false);
        expect(result.afterManual).toBe(true);
    });
});

