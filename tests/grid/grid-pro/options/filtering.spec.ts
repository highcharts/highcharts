import { test, expect } from '~/fixtures.ts';

test.describe('Advanced filtering', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                    <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css">
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        name: [
                            'Anna', 'Bjørn', 'Carlos', 'Daria', 'Erik',
                            'Fatima', 'Jan', 'Kari', 'Lena', 'Marek'
                        ],
                        country: [
                            'PL', 'NO', 'ES', 'PL', 'NO',
                            'FR', 'PL', 'NO', 'DE', 'PL'
                        ],
                        age: [19, 34, 28, 45, 22, 31, 17, 52, 26, 38]
                    }
                },
                filtering: {
                    conditions: [{
                        columnId: 'age',
                        operator: 'greaterThan',
                        value: 30
                    }, {
                        logic: 'or',
                        conditions: [{
                            columnId: 'country',
                            operator: 'equals',
                            value: 'PL'
                        }, {
                            columnId: 'country',
                            operator: 'equals',
                            value: 'NO'
                        }]
                    }]
                }
            }, true);
        });
    });

    const names = 'tbody td[data-column-id="name"]';

    test('applies nested groups of rules', async ({ page }) => {
        await expect(page.locator(names)).toHaveText([
            'Bjørn', 'Daria', 'Kari', 'Marek'
        ]);
    });

    test('replaces the filtering state on update', async ({ page }) => {
        const isSameTable = await page.evaluate(async (): Promise<boolean> => {
            const grid = (window as any).grid;
            const tableElement = grid.tableElement;
            const { conditions } = grid.getOptions().filtering;

            await grid.update({ filtering: { logic: 'or', conditions } });

            return grid.tableElement === tableElement;
        });

        await expect(page.locator(names)).toHaveText([
            'Anna', 'Bjørn', 'Daria', 'Erik', 'Fatima', 'Jan', 'Kari', 'Marek'
        ]);
        expect(
            isSameTable,
            'Updating the filtering should not re-render the grid.'
        ).toBe(true);
        expect(
            await page.evaluate((): unknown =>
                (window as any).grid.getOptions().filtering.logic
            ),
            'The filtering state should be exported with the options.'
        ).toBe('or');

        await page.evaluate(async (): Promise<void> => {
            const grid = (window as any).grid;
            const { conditions } = grid.getOptions().filtering;

            await grid.update({ filtering: { conditions } });
        });

        await expect(page.locator(names)).toHaveText([
            'Bjørn', 'Daria', 'Kari', 'Marek'
        ]);

        await page.evaluate(async (): Promise<void> => {
            await (window as any).grid.update(
                { filtering: { conditions: [] } }
            );
        });

        await expect(page.locator(names)).toHaveCount(10);
    });

    test('combines with column filters using and', async ({ page }) => {
        await page.evaluate(async (): Promise<void> => {
            await (window as any).grid.updateColumn('name', {
                filtering: {
                    rule: { operator: 'contains', value: 'a' }
                }
            });
        });

        await expect(page.locator(names)).toHaveText([
            'Daria', 'Kari', 'Marek'
        ]);

        await page.evaluate(async (): Promise<void> => {
            await (window as any).grid.updateColumn('name', {
                filtering: { rule: { value: '' } }
            });
        });

        await expect(page.locator(names)).toHaveText([
            'Bjørn', 'Daria', 'Kari', 'Marek'
        ]);
    });

    test('skips rules for missing columns and empty groups', async ({ page }) => {
        await page.evaluate(async (): Promise<void> => {
            await (window as any).grid.update({
                filtering: {
                    conditions: [{
                        columnId: 'age',
                        operator: 'greaterThan',
                        value: 30
                    }, {
                        columnId: 'salary',
                        operator: 'greaterThan',
                        value: 1
                    }, {
                        logic: 'or',
                        conditions: []
                    }]
                }
            });
        });

        await expect(page.locator(names)).toHaveText([
            'Bjørn', 'Daria', 'Fatima', 'Kari', 'Marek'
        ]);
    });

    test('filters by hidden row grouping columns', async ({ page }) => {
        await page.evaluate(async (): Promise<void> => {
            const grid = (window as any).grid;
            const pl = {
                columnId: 'country',
                operator: 'equals',
                value: 'PL'
            };

            await grid.update({
                rowGrouping: { enabled: true, groupBy: ['country'] },
                filtering: { conditions: [pl] }
            });
            await grid.update({
                filtering: {
                    logic: 'or',
                    conditions: [pl, { ...pl, value: 'DE' }]
                }
            });
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(2);
    });
});
