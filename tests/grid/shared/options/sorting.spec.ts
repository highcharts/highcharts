import { test, expect } from '~/fixtures.ts';

test.describe('Grid sorting', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/e2e/sorting-options');
    });

    const getSortingState = async (page: any) => {
        return await page.evaluate(() => {
            const grid = (window as any).grid;
            const sorting = grid.querying.sorting;

            return {
                currentSorting: sorting.currentSorting,
                currentSortings: sorting.currentSortings || []
            };
        });
    };

    test('Grid should be sorted initially by price in ascending order', async ({ page }) => {
        await expect(page.locator('#select-column')).toHaveValue('price');
        await expect(page.locator('#select-order')).toHaveValue('asc');

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });
        expect(priceData, 'Price column should be sorted.').toEqual([1.5, 2.53, 4.5, 5]);

        await expect(page.locator('th[data-column-id="price"]')).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Should be able to turn off sorting', async ({ page }) => {
        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });
        expect(priceData, 'Weight column should be sorted.').toEqual([1.5, 2.53, 5, 4.5]);

        await expect(page.locator('th[data-column-id="price"]')).not.toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Clicking on the `icon` column header should do nothing', async ({ page }) => {
        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();
        await page.locator('th[data-column-id="icon"]').click();

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });

        expect(priceData, 'Weight column should be sorted.').toEqual([1.5, 2.53, 5, 4.5]);
    });

    test('Clicking two times on the `weight` column header should sort the table in descending order', async ({ page }) => {
        await page.locator('th[data-column-id="weight"]').click();
        await page.locator('th[data-column-id="weight"]').click();

        const result = await page.evaluate(() => {
            const grid = (window as any).grid;
            return {
                weightData: grid.presentationTable.columns.weight,
                order: grid.columnOptionsMap.weight.options.sorting.order
            };
        });
        expect(result.weightData, 'Weight column should be sorted.').toEqual([200, 100, 40, 0.5]);
        expect(result.order, 'Weight column sorting options should be updated.').toBe('desc');

        await expect(page.locator('th[data-column-id="weight"]')).toHaveClass(/hcg-column-sorted-desc/);
    });

    test('Sorting the `icon` column should be possible by the code', async ({ page }) => {
        await page.locator('#select-column').selectOption('icon');
        await page.locator('#select-order').selectOption('asc');
        await page.locator('#apply-btn').click();

        const metaData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.metaData;
        });
        expect(metaData, 'Icon column should be sorted.').toEqual(['a', 'd', 'b', 'c']);

        await expect(page.locator('th[data-column-id="icon"]')).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Should cycle sorting with orderSequence [asc, desc]', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['asc', 'desc']
                    }
                }]
            });
        });

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'First toggle should set ascending order from null.'
        ).toHaveClass(/hcg-column-sorted-asc/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Second toggle should set descending order.'
        ).toHaveClass(/hcg-column-sorted-desc/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Third toggle should cycle back to ascending order.'
        ).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Should cycle sorting with duplicated null in orderSequence', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['asc', null, 'desc', null]
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-desc/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .not.toHaveClass(/hcg-column-sorted-(asc|desc)/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-asc/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .not.toHaveClass(/hcg-column-sorted-(asc|desc)/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-desc/);
    });

    test('Should keep ascending sorting with orderSequence [asc]', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['asc']
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-asc/);
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sortable/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Should keep sorting unchanged with empty orderSequence', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: []
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        const beforeState = await getSortingState(page);
        await page.locator('th[data-column-id="weight"]').click();
        const afterState = await getSortingState(page);

        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sortable/);
        expect(
            afterState.currentSorting,
            'Sorting state should remain unchanged for empty sequence.'
        ).toEqual(beforeState.currentSorting);
    });

    test('Per-column orderSequence should override columnDefaults orderSequence', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columnDefaults: {
                    sorting: {
                        orderSequence: ['desc', 'asc', null]
                    }
                },
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['asc', 'desc', null]
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Per-column sequence should apply for weight.'
        ).toHaveClass(/hcg-column-sorted-asc/);

        await page.locator('th[data-column-id="product"]').click();
        await expect(
            page.locator('th[data-column-id="product"]'),
            'Column defaults sequence should apply for product.'
        ).toHaveClass(/hcg-column-sorted-desc/);
    });

    test('Shift additive sorting should respect each column orderSequence', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['desc', null, 'asc']
                    }
                }, {
                    id: 'price',
                    sorting: {
                        orderSequence: ['asc', null, 'desc']
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();
        await page.locator('th[data-column-id="price"]')
            .click({ modifiers: ['Shift'] });

        const sortingState = await getSortingState(page);
        expect(
            sortingState.currentSortings.map((s: any) => (
                [s.columnId, s.order]
            )),
            'Each sorted column should follow its own orderSequence.'
        ).toEqual([['weight', 'asc'], ['price', 'desc']]);
    });

    test('Runtime orderSequence update should apply on next toggle', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['desc', null, 'asc']
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();
        await expect(page.locator('th[data-column-id="weight"]'))
            .toHaveClass(/hcg-column-sorted-asc/);

        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        orderSequence: ['asc', null, 'desc']
                    }
                }]
            });
        });

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Next toggle should use updated sequence.'
        ).not.toHaveClass(/hcg-column-sorted-(asc|desc)/);

        await page.locator('th[data-column-id="weight"]').click();
        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Following toggle should continue updated sequence.'
        ).toHaveClass(/hcg-column-sorted-desc/);
    });

    test('Sorting disabled should block UI toggle but allow programmatic setOrder', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                columns: [{
                    id: 'weight',
                    sorting: {
                        enabled: false,
                        orderSequence: ['asc']
                    }
                }]
            });
        });

        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        await page.locator('th[data-column-id="weight"]').click();

        const uiState = await getSortingState(page);
        expect(
            uiState.currentSorting?.columnId,
            'UI click should not sort disabled column.'
        ).not.toBe('weight');

        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.viewport.getColumn('weight').sorting.setOrder('asc');
        });

        await expect(
            page.locator('th[data-column-id="weight"]'),
            'Programmatic sorting should still work.'
        ).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Editing a cell in sorted column should resort the table', async ({ page }) => {
        await page.locator('th[data-column-id="weight"]').click();
        const cell = page.locator('tr[data-row-index="1"] td[data-column-id="weight"]');
        await cell.dblclick();
        await cell.locator('input').fill('40000');
        await page.keyboard.press('Enter');

        const result = await page.evaluate(() => {
            const grid = (window as any).grid;
            const { rows } = grid.viewport;
            const lastRow = rows[rows.length - 1];
            return {
                lastRowValue: lastRow.cells[0].value,
                weightData: grid.presentationTable.columns.weight
            };
        });

        expect(result.lastRowValue, 'Last rendered row should be `Pears`.').toBe('Pears');
        expect(result.weightData, 'Weight column should be sorted.').toEqual([0.5, 100, 200, 40000]);
    });
});
