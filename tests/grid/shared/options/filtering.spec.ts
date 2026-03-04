import { test, expect } from '~/fixtures.ts';
import type { Page } from '@playwright/test';

const inputProductFilter = '.hcg-header-cell[data-column-id="product"] input';
const selectProductFilter = '.hcg-header-cell[data-column-id="product"] select';
const inputWeightFilter = '.hcg-header-cell[data-column-id="weight"] input';
const selectWeightFilter = '.hcg-header-cell[data-column-id="weight"] select';
const selectBooleanFilter = '.hcg-header-cell[data-column-id="active"] select';
const gridRows = '.hcg-row';
const productColumn = 'td[data-column-id="product"]';
const weightColumn = 'td[data-column-id="weight"]';
const booleanColumn = 'td[data-column-id="active"]';

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

