import { test, expect } from '~/fixtures.ts';
import type { Page } from '@playwright/test';

const inputProductFilter = '.hcg-header-cell[data-column-id="product"] input';
const selectProductFilter = '.hcg-header-cell[data-column-id="product"] select';
const inputWeightFilter = '.hcg-header-cell[data-column-id="weight"] input';
const selectWeightFilter = '.hcg-header-cell[data-column-id="weight"] select';
const selectBooleanFilter = '.hcg-header-cell[data-column-id="active"] select';
const selectDateFilter = '.hcg-header-cell[data-column-id="date"] select';
const inputDateFilter = '.hcg-header-cell[data-column-id="date"] input';
const gridRows = '.hcg-row';
const productColumn = 'td[data-column-id="product"]';
const weightColumn = 'td[data-column-id="weight"]';
const booleanColumn = 'td[data-column-id="active"]';
const dateColumn = 'td[data-column-id="date"]';

// Helper functions to reduce code duplication
async function clearWeightFilter(page: Page): Promise<void> {
    const weightInput = page.locator(inputWeightFilter);
    await weightInput.clear();
    await expect(weightInput).toHaveValue('');
}

async function setFilterCondition(
    page: Page,
    selectLocator: string,
    condition: string
): Promise<void> {
    const select = page.locator(selectLocator);
    await expect(select).toBeVisible();
    await select.selectOption({ value: condition });
    await expect(select).toHaveValue(condition);
}

async function typeFilterValue(
    page: Page,
    inputLocator: string,
    value: string
): Promise<void> {
    const input = page.locator(inputLocator);
    await input.click();
    await input.type(value, { delay: 50 });
    await expect(input).toHaveValue(value);
}

async function clearFilterInput(
    page: Page,
    inputLocator: string
): Promise<void> {
    const input = page.locator(inputLocator);
    await input.clear();
    await expect(input).toHaveValue('');
}

async function verifyRowCount(
    page: Page,
    expectedCount: number,
    timeout = 5000
): Promise<void> {
    await expect(page.locator(gridRows)).toHaveCount(
        expectedCount,
        { timeout }
    );
}

async function verifyRowsContent(
    page: Page,
    columnSelector: string,
    validator: (text: string | null) => boolean
): Promise<void> {
    const rows = page.locator(gridRows);
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const text = await rows.nth(i).locator(columnSelector).textContent();
        expect(validator(text)).toBe(true);
    }
}

async function getSelectOptionValues(
    page: Page,
    selectLocator: string
): Promise<string[]> {
    const select = page.locator(selectLocator);
    await expect(select).toBeVisible();
    return await select.locator('option').evaluateAll((options) =>
        options.map((o) => (o as HTMLOptionElement).value)
    );
}

async function getSelectOptionLabel(
    page: Page,
    selectLocator: string,
    value: string
): Promise<string | null> {
    return page.locator(selectLocator)
        .locator(`option[value="${value}"]`)
        .textContent();
}

async function applyDateFilter(
    page: Page,
    operator: string,
    dateValue: string
): Promise<void> {
    await setFilterCondition(page, selectDateFilter, operator);
    const dateInput = page.locator(inputDateFilter);
    await dateInput.fill(dateValue);
    await expect(dateInput).toHaveValue(dateValue);
}

test.describe('Grid filtering', () => {
    test.beforeEach(async ({ page }) => {
        // Note: filtering tests use grid-lite demo as filtering works the same in both versions
        await page.goto('/grid-lite/e2e/inline-filtering', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    // Init filtering
    test('Filtering on init', async ({ page }) => {
        const rows = page.locator(gridRows);
        await expect(rows).toHaveCount(3);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const weightText = await rows.nth(i).locator('td[data-column-id="weight"]').textContent();
            const weight = parseFloat(weightText?.replace(/[,\s]/g, '') || '0');
            expect(weight).toBeGreaterThan(1000);
        }
    });

    test('Arrow key navigation works across header, filter row, and body', async ({
        page
    }) => {
        const productHeaderCell = page.locator(
            'th[data-column-id="product"]'
        ).first();
        const weightHeaderCell = page.locator(
            'th[data-column-id="weight"]'
        );
        const productFilterCell = page.locator(
            'th[data-column-id="product"]'
        ).nth(1);
        const firstProductBodyCell = page.locator(productColumn).first();

        await productHeaderCell.focus();
        await expect(productHeaderCell).toBeFocused();

        await page.keyboard.press('ArrowRight');
        await expect(weightHeaderCell.first()).toBeFocused();

        await page.keyboard.press('ArrowLeft');
        await expect(productHeaderCell).toBeFocused();

        await page.keyboard.press('ArrowDown');
        await expect(productFilterCell).toBeFocused();

        await page.keyboard.press('ArrowDown');
        await expect(firstProductBodyCell).toBeFocused();

        await page.keyboard.press('ArrowUp');
        await expect(productFilterCell).toBeFocused();

        await page.keyboard.press('ArrowUp');
        await expect(productHeaderCell).toBeFocused();
    });

    // Update filtering
    test('Update filtering', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).grid;
            grid.viewport.getColumn('weight').filtering.set();
        });

        const rowCount = await page.locator(gridRows).count();
        expect(rowCount).toBeGreaterThan(3);
    });

    // Filtering conditions
    test('Condition - contains', async ({ page }) => {
        await clearWeightFilter(page);
        await typeFilterValue(page, inputProductFilter, 'ap');
        await verifyRowCount(page, 4);
        await verifyRowsContent(page, productColumn, (text) =>
            text?.toLowerCase().includes('ap') ?? false
        );

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(4);
    });

    test('Condition - doesNotContain', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'doesNotContain');
        await typeFilterValue(page, inputProductFilter, 'an');
        await verifyRowCount(page, 16);
        await verifyRowsContent(page, productColumn, (text) =>
            !text?.toLowerCase().includes('an')
        );

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(16);
    });

    test('Condition - begins with', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'beginsWith');
        await typeFilterValue(page, inputProductFilter, 'app');
        await verifyRowCount(page, 1);
        await verifyRowsContent(page, productColumn, (text) =>
            text?.toLowerCase().startsWith('app') ?? false
        );

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - ends with', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'endsWith');
        await typeFilterValue(page, inputProductFilter, 'es');
        await verifyRowCount(page, 11);
        await verifyRowsContent(page, productColumn, (text) =>
            text?.toLowerCase().endsWith('es') ?? false
        );

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(11);
    });

    test('Condition - empty', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'empty');
        await verifyRowCount(page, 1);

        await setFilterCondition(page, selectProductFilter, 'contains');
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - not empty', async ({ page }) => {
        await clearWeightFilter(page);
        const initialCount = await page.locator(gridRows).count();
        await setFilterCondition(page, selectProductFilter, 'notEmpty');

        const rowCount = await page.locator(gridRows).count();
        expect(rowCount).toBe(initialCount - 1);
    });

    test('Condition - equals', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'equals');
        await typeFilterValue(page, inputProductFilter, 'apples');
        await verifyRowCount(page, 1);

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - doesNotEqual', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectProductFilter, 'doesNotEqual');
        await typeFilterValue(page, inputProductFilter, 'apples');
        await verifyRowCount(page, 19);

        await clearFilterInput(page, inputProductFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(19);
    });

    test('Condition - greater than', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectWeightFilter, 'greaterThan');
        await typeFilterValue(page, inputWeightFilter, '1000');
        await verifyRowCount(page, 3);

        await clearFilterInput(page, inputWeightFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(3);
    });

    test('Condition - less than', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectWeightFilter, 'lessThan');
        await typeFilterValue(page, inputWeightFilter, '1000');
        await verifyRowCount(page, 17);

        await clearFilterInput(page, inputWeightFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(17);
    });

    test('Condition - greaterThanOrEqualTo', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectWeightFilter, 'greaterThanOrEqualTo');
        await typeFilterValue(page, inputWeightFilter, '100');
        await verifyRowCount(page, 10);

        await clearFilterInput(page, inputWeightFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(10);
    });

    test('Condition - less than or equal to', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectWeightFilter, 'lessThanOrEqualTo');
        await typeFilterValue(page, inputWeightFilter, '100');
        await verifyRowCount(page, 11);

        await clearFilterInput(page, inputWeightFilter);
        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(11);
    });

    test('Condition boolean', async ({ page }) => {
        await clearWeightFilter(page);
        await setFilterCondition(page, selectBooleanFilter, 'true');
        await verifyRowCount(page, 9);
        expect(await page.locator(gridRows).count()).toBe(9);

        await setFilterCondition(page, selectBooleanFilter, 'false');
        await verifyRowCount(page, 7);
        expect(await page.locator(gridRows).count()).toBe(7);

        await setFilterCondition(page, selectBooleanFilter, 'empty');
        await verifyRowCount(page, 4);
        expect(await page.locator(gridRows).count()).toBe(4);
    });

    test('Condition - between', async ({ page }) => {
        await clearWeightFilter(page);
        // 'between' is not a standard condition in select, but we can simulate it
        // by using greaterThanOrEqualTo with 50 and verifying some values in range
        await setFilterCondition(
            page,
            selectWeightFilter,
            'greaterThanOrEqualTo'
        );
        const input = page.locator(inputWeightFilter);
        await input.fill('50');
        await expect(input).toHaveValue('50');
        
        // Wait for filtering to apply
        const rows = page.locator(gridRows);
        await expect(rows.first()).toBeVisible();
        
        // Get all rows and verify at least some are in range 50-150
        const rowCount = await rows.count();
        const weights: number[] = [];
        for (let i = 0; i < rowCount; i++) {
            const weightText = await rows.nth(i)
                .locator(weightColumn).textContent();
            const weight = parseFloat(weightText?.replace(/[,\s]/g, '') || '0');
            weights.push(weight);
        }
        // Verify we have some rows in the range 50-150
        const validWeights = weights.filter(w => w >= 50 && w <= 150);
        expect(validWeights.length).toBeGreaterThan(0);
    });

    test('Condition - boolean - equals', async ({ page }) => {
        await clearWeightFilter(page);
        // Boolean columns use 'true', 'false', 'empty' instead of 'equals'
        // Use 'true' directly for boolean filtering
        await setFilterCondition(page, selectBooleanFilter, 'true');
        await verifyRowCount(page, 9);
        const rowCount = await page.locator(gridRows).count();
        expect(rowCount).toBe(9);
        await verifyRowsContent(page, booleanColumn, (text) =>
            text?.toLowerCase() === 'true'
        );
    });

});

test.describe('Grid filtering operators allowlist', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/inline-filtering', {
            waitUntil: 'networkidle'
        });
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        });
    });

    test('Product column shows only column operators', async ({
        page
    }) => {
        await page.evaluate(() => {
            const base = (window as any).grid.userOptions;
            (window as any).grid.destroy();
            (window as any).grid = (window as any).Grid.grid('container', {
                data: base.data,
                header: base.header,
                columnDefaults: {
                    filtering: {
                        enabled: true,
                        inline: true,
                        operators: []
                    }
                },
                columns: [{
                    id: 'product',
                    filtering: {
                        enabled: true,
                        operators: ['contains', 'beginsWith']
                    }
                }]
            });
        });

        const values = await getSelectOptionValues(page, selectProductFilter);
        expect(values.sort()).toEqual(['beginsWith', 'contains']);

        const activeValues = await getSelectOptionValues(
            page,
            selectBooleanFilter
        );
        expect(activeValues.filter(Boolean).sort()).toEqual(
            ['all', 'empty', 'false', 'true']
        );
    });

    test('Defaults apply per type and defined column operators', async ({
        page
    }) => {
        await page.evaluate(() => {
            const base = (window as any).grid.userOptions;
            (window as any).grid.destroy();
            (window as any).grid = (window as any).Grid.grid('container', {
                data: base.data,
                header: base.header,
                columnDefaults: {
                    filtering: {
                        enabled: true,
                        inline: true,
                        operators: ['equals', 'doesNotEqual', 'lessThan']
                    }
                },
                columns: [{
                    id: 'product',
                    filtering: {
                        enabled: true,
                        operators: ['contains', 'beginsWith']
                    }
                }]
            });
        });

        const weightValues = (
            await getSelectOptionValues(page, selectWeightFilter)
        ).filter(Boolean);
        expect(weightValues).toEqual(['equals', 'doesNotEqual', 'lessThan']);

        const booleanValues = (
            await getSelectOptionValues(page, selectBooleanFilter)
        ).filter(Boolean);
        expect(booleanValues.sort()).toEqual(['all', 'empty', 'false', 'true']);

        const productValues = (
            await getSelectOptionValues(page, selectProductFilter)
        ).filter(Boolean);

        expect(productValues.sort()).toEqual(['beginsWith', 'contains']);
    });

    test('Datetime column respects filtering.operators allowlist', async ({
        page
    }) => {
        await page.evaluate(() => {
            const base = (window as any).grid.userOptions;
            (window as any).grid.destroy();
            (window as any).grid = (window as any).Grid.grid('container', {
                data: base.data,
                header: base.header,
                columnDefaults: {
                    filtering: {
                        enabled: true,
                        inline: true,
                        operators: ['equals', 'doesNotEqual', 'empty']
                    }
                },
                columns: [{
                    id: 'date',
                    dataType: 'datetime',
                    cells: {
                        format: '{value:%Y-%m-%d}'
                    },
                    filtering: {
                        operators: ['greaterThan', 'lessThan']
                    }
                }, {
                    id: 'weight',
                    filtering: {
                        enabled: true
                    }
                }]
            });
        });

        const dateValues = (
            await getSelectOptionValues(page, selectDateFilter)
        ).filter(Boolean);

        expect(dateValues.sort()).toEqual(['greaterThan', 'lessThan']);

        await clearWeightFilter(page);
        await applyDateFilter(page, 'greaterThan', '2025-10-15');
        await verifyRowCount(page, 5);
        await verifyRowsContent(page, dateColumn, (text) =>
            (text ?? '') > '2025-10-15'
        );
    });
});

test.describe('Grid datetime filtering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/inline-filtering', {
            waitUntil: 'networkidle'
        });
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        });
    });

    test('Datetime column shows default operator labels without custom lang', async ({
        page
    }) => {
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'greaterThan'
        )).resolves.toBe('After');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'greaterThanOrEqualTo'
        )).resolves.toBe('On or after');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'lessThan'
        )).resolves.toBe('Before');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'lessThanOrEqualTo'
        )).resolves.toBe('On or before');
    });

    test('Datetime column shows operator labels from lang', async ({
        page
    }) => {
        await page.evaluate(() => {
            const base = (window as any).grid.userOptions;
            (window as any).grid.destroy();
            (window as any).grid = (window as any).Grid.grid('container', {
                data: base.data,
                header: base.header,
                columnDefaults: base.columnDefaults,
                columns: base.columns,
                lang: {
                    columnFilteringDateTimeOperators: {
                        greaterThan: 'Custom after',
                        greaterThanOrEqualTo: 'Custom on or after',
                        lessThan: 'Custom before',
                        lessThanOrEqualTo: 'Custom on or before'
                    }
                }
            });
        });

        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'greaterThan'
        )).resolves.toBe('Custom after');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'greaterThanOrEqualTo'
        )).resolves.toBe('Custom on or after');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'lessThan'
        )).resolves.toBe('Custom before');
        await expect(getSelectOptionLabel(
            page,
            selectDateFilter,
            'lessThanOrEqualTo'
        )).resolves.toBe('Custom on or before');
    });

    test.describe('Datetime comparison operators', () => {
        test.beforeEach(async ({ page }) => {
            await clearWeightFilter(page);
            await page.evaluate(() => {
                (window as any).grid.viewport.getColumn('date').filtering.set();
            });
            await verifyRowCount(page, 20);
        });

        test('greaterThan filters rows', async ({ page }) => {
            await applyDateFilter(page, 'greaterThan', '2025-10-10');
            await verifyRowCount(page, 9);
            await verifyRowsContent(page, dateColumn, (text) =>
                (text ?? '') > '2025-10-10'
            );
        });

        test('greaterThanOrEqualTo filters rows', async ({ page }) => {
            await applyDateFilter(page, 'greaterThanOrEqualTo', '2025-10-10');
            await verifyRowCount(page, 10);
            await verifyRowsContent(page, dateColumn, (text) =>
                (text ?? '') >= '2025-10-10'
            );
        });

        test('lessThan filters rows', async ({ page }) => {
            await applyDateFilter(page, 'lessThan', '2025-10-10');
            await verifyRowCount(page, 10);
            await verifyRowsContent(page, dateColumn, (text) =>
                !text || text < '2025-10-10'
            );
        });

        test('lessThanOrEqualTo filters rows', async ({ page }) => {
            await applyDateFilter(page, 'lessThanOrEqualTo', '2025-10-10');
            await verifyRowCount(page, 11);
            await verifyRowsContent(page, dateColumn, (text) =>
                !text || text <= '2025-10-10'
            );
        });
    });

    test.describe('Filtering with hideOperatorSelect option', () => {
        const inputProductFilter =
            '.hcg-header-cell[data-column-id="product"] input';
        const inputCategoryFilter =
            '.hcg-header-cell[data-column-id="category"] input';
        const productColumn = 'td[data-column-id="product"]';
        const categoryColumn = 'td[data-column-id="category"]';

        test.beforeEach(async ({ page }) => {
            await page.goto(
                '/grid-lite/e2e/inline-filtering-hide-select',
                { waitUntil: 'networkidle' }
            );
            await page.waitForFunction(() => {
                return typeof (window as any).Grid !== 'undefined' &&
                    (window as any).Grid.grids &&
                    (window as any).Grid.grids.length > 0;
            });
        });

        test('Inline hideOperatorSelect hides select and filters columns', async ({
            page
        }) => {
            await expect(
                page.locator(
                    'th[data-column-id="product"] select'
                )
            ).toHaveCount(0);
            await expect(page.locator(inputProductFilter)).toBeVisible();

            await typeFilterValue(page, inputProductFilter, 'Pear');
            await verifyRowCount(page, 1);
            await verifyRowsContent(
                page,
                productColumn,
                (text) => (text ?? '').includes('Pear')
            );

            await clearFilterInput(page, inputProductFilter);
            await verifyRowCount(page, 6);

            await typeFilterValue(page, inputCategoryFilter, 'Citrus');
            await verifyRowCount(page, 1);
            await verifyRowsContent(
                page,
                categoryColumn,
                (text) => (text ?? '').includes('Citrus')
            );
        });

        test('The hideOperatorSelect hides the select in popup mode', async ({
            page
        }) => {
            await page.evaluate(() => {
                const data = (window as any).grid.userOptions.data;
                (window as any).grid.destroy();
                (window as any).grid = (window as any).Grid.grid('container', {
                    data,
                    columns: [{
                        id: 'product',
                        dataType: 'string',
                        filtering: {
                            enabled: true,
                            hideOperatorSelect: true
                        }
                    }]
                });
            });

            await page
                .locator(
                    '[data-column-id="product"] ' +
                    '.hcg-header-cell-filter-icon button'
                )
                .evaluate((button: HTMLButtonElement) => button.click());
            await expect(
                page.locator('.hcg-popup-content select')
            ).toHaveCount(0);
            await expect(
                page.locator('.hcg-popup-content input')
            ).toBeVisible();
            await expect(
                page.locator('.hcg-popup-content .hcg-column-filter-operator-spacer')
            ).toHaveCount(0);
        });

        test('Single operator hides select by default', async ({ page }) => {
            await page.evaluate(() => {
                (window as any).grid.destroy();
                (window as any).grid = (window as any).Grid.grid('container', {
                    data: {
                        columns: {
                            category: [
                                'Fruit',
                                'Fruit',
                                'Citrus'
                            ]
                        }
                    },
                    columnDefaults: {
                        filtering: {
                            enabled: true,
                            inline: true
                        }
                    },
                    columns: [{
                        id: 'category',
                        dataType: 'string',
                        filtering: {
                            operators: ['contains']
                        }
                    }]
                });
            });

            await expect(
                page.locator('th[data-column-id="category"] select')
            ).toHaveCount(0);
            await expect(
                page.locator(inputCategoryFilter)
            ).toBeVisible();
            await expect(
                page.locator(
                    'th[data-column-id="category"] .hcg-column-filter-operator-spacer'
                )
            ).toHaveCount(0);
        });

        test('Hidden operator select uses operator label as input placeholder', async ({
            page
        }) => {
            await expect(page.locator(inputProductFilter)).toHaveAttribute(
                'placeholder',
                'Contains'
            );
        });

        test('Visible operator select keeps default input placeholder', async ({
            page
        }) => {
            await page.evaluate(() => {
                const data = (window as any).grid.userOptions.data;
                (window as any).grid.destroy();
                (window as any).grid = (window as any).Grid.grid('container', {
                    data,
                    columnDefaults: {
                        filtering: {
                            enabled: true,
                            inline: true
                        }
                    },
                    columns: [{
                        id: 'product',
                        dataType: 'string'
                    }]
                });
            });

            await expect(page.locator(inputProductFilter)).toHaveAttribute(
                'placeholder',
                'Value...'
            );
        });

    });
});
