import { test, expect } from '~/fixtures.ts';

const inputProductFilter = '.hcg-header-cell[data-column-id="product"] input';
const selectProductFilter = '.hcg-header-cell[data-column-id="product"] select';
const inputWeightFilter = '.hcg-header-cell[data-column-id="weight"] input';
const selectWeightFilter = '.hcg-header-cell[data-column-id="weight"] select';
const inputBooleanFilter = '.hcg-header-cell[data-column-id="active"] input';
const selectBooleanFilter = '.hcg-header-cell[data-column-id="active"] select';
const gridRows = '.hcg-row';
const productColumn = 'td[data-column-id="product"]';
const weightColumn = 'td[data-column-id="weight"]';
const booleanColumn = 'td[data-column-id="active"]';

test.describe('Grid filtering', () => {
    test.beforeEach(async ({ page }) => {
        // Note: filtering tests use grid-lite demo as filtering works the same in both versions
        await page.goto('/grid-lite/cypress/inline-filtering', { waitUntil: 'networkidle' });
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
        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('ap'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('ap');
        const rows = page.locator(gridRows);
        await expect(rows).toHaveCount(4);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const productText = await rows.nth(i).locator(productColumn).textContent();
            expect(productText?.toLowerCase()).toContain('ap');
        }

        await input.clear();
        await expect(input).toHaveValue('');
        const rowCountAfter = await rows.count();
        expect(rowCountAfter).toBeGreaterThan(4);
    });

    test('Condition - doesNotContain', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('doesNotContain');
        await expect(select).toHaveValue('doesNotContain');

        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('an'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('an');
        const rows = page.locator(gridRows);
        await expect(rows).toHaveCount(16);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const productText = await rows.nth(i).locator(productColumn).textContent();
            expect(productText?.toLowerCase()).not.toContain('an');
        }

        await input.clear();
        await expect(input).toHaveValue('');
        const rowCountAfter = await rows.count();
        expect(rowCountAfter).toBeGreaterThan(16);
    });

    test('Condition - begins with', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('beginsWith');
        await expect(select).toHaveValue('beginsWith');

        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('app'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('app');
        const rows = page.locator(gridRows);
        await expect(rows).toHaveCount(1);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const productText = await rows.nth(i).locator(productColumn).textContent();
            expect(productText?.toLowerCase().startsWith('app')).toBe(true);
        }

        await input.clear();
        await expect(input).toHaveValue('');
        const rowCountAfter = await rows.count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - ends with', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('endsWith');
        await expect(select).toHaveValue('endsWith');

        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('es'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('es');
        const rows = page.locator(gridRows);
        await expect(rows).toHaveCount(11);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const productText = await rows.nth(i).locator(productColumn).textContent();
            expect(productText?.toLowerCase().endsWith('es')).toBe(true);
        }

        await input.clear();
        await expect(input).toHaveValue('');
        const rowCountAfter = await rows.count();
        expect(rowCountAfter).toBeGreaterThan(11);
    });

    test('Condition - empty', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('empty');
        await expect(select).toHaveValue('empty');
        await expect(page.locator(gridRows)).toHaveCount(1);

        await select.selectOption('contains');
        await expect(select).toHaveValue('contains');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - not empty', async ({ page }) => {
        const initialCount = await page.locator(gridRows).count();
        const select = page.locator(selectProductFilter);
        await select.selectOption('notEmpty');
        await expect(select).toHaveValue('notEmpty');

        const rowCount = await page.locator(gridRows).count();
        expect(rowCount).toBe(initialCount - 1);
    });

    test('Condition - equals', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('equals');
        await expect(select).toHaveValue('equals');

        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('apples'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('apples');
        await expect(page.locator(gridRows)).toHaveCount(1);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(1);
    });

    test('Condition - doesNotEqual', async ({ page }) => {
        const select = page.locator(selectProductFilter);
        await select.selectOption('doesNotEqual');
        await expect(select).toHaveValue('doesNotEqual');

        const input = page.locator(inputProductFilter);
        await input.click(); // Focus input
        await input.type('apples'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('apples');
        await expect(page.locator(gridRows)).toHaveCount(19);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(19);
    });

    test('Condition - greater than', async ({ page }) => {
        const select = page.locator(selectWeightFilter);
        await select.selectOption('greaterThan');
        await expect(select).toHaveValue('greaterThan');

        const input = page.locator(inputWeightFilter);
        await input.click(); // Focus input
        await input.type('1000'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('1000');
        await expect(page.locator(gridRows)).toHaveCount(3);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(3);
    });

    test('Condition - less than', async ({ page }) => {
        const select = page.locator(selectWeightFilter);
        await select.selectOption('lessThan');
        await expect(select).toHaveValue('lessThan');

        const input = page.locator(inputWeightFilter);
        await input.click(); // Focus input
        await input.type('1000'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('1000');
        await expect(page.locator(gridRows)).toHaveCount(17);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(17);
    });

    test('Condition - greaterThanOrEqualTo', async ({ page }) => {
        const select = page.locator(selectWeightFilter);
        await select.selectOption('greaterThanOrEqualTo');
        await expect(select).toHaveValue('greaterThanOrEqualTo');

        const input = page.locator(inputWeightFilter);
        await input.click(); // Focus input
        await input.type('100'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('100');
        await expect(page.locator(gridRows)).toHaveCount(10);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(10);
    });

    test('Condition - less than or equal to', async ({ page }) => {
        const select = page.locator(selectWeightFilter);
        await select.selectOption('lessThanOrEqualTo');
        await expect(select).toHaveValue('lessThanOrEqualTo');

        const input = page.locator(inputWeightFilter);
        await input.click(); // Focus input
        await input.type('100'); // Use type() instead of fill() to trigger events
        await expect(input).toHaveValue('100');
        await expect(page.locator(gridRows)).toHaveCount(11);

        await input.clear();
        await expect(input).toHaveValue('');

        const rowCountAfter = await page.locator(gridRows).count();
        expect(rowCountAfter).toBeGreaterThan(11);
    });

    test('Condition boolean', async ({ page }) => {
        const select = page.locator(selectBooleanFilter);
        await select.selectOption('true');
        await expect(select).toHaveValue('true');
        await expect(page.locator(gridRows)).toHaveCount(9);

        await select.selectOption('false');
        await expect(select).toHaveValue('false');
        await expect(page.locator(gridRows)).toHaveCount(7);

        await select.selectOption('empty');
        await expect(select).toHaveValue('empty');
        await expect(page.locator(gridRows)).toHaveCount(4);
    });

    test('Condition - between', async ({ page }) => {
        const select = page.locator(selectWeightFilter);
        await select.selectOption('between');
        const input = page.locator(inputWeightFilter);
        await input.fill('50,150');
        const rows = page.locator(gridRows);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const weightText = await rows.nth(i).locator(weightColumn).textContent();
            const weight = parseFloat(weightText?.replace(/[,\s]/g, '') || '0');
            expect(weight).toBeGreaterThanOrEqual(50);
            expect(weight).toBeLessThanOrEqual(150);
        }
    });

    test('Condition - boolean - equals', async ({ page }) => {
        const select = page.locator(selectBooleanFilter);
        await select.selectOption('equals');
        const input = page.locator(inputBooleanFilter);
        await input.fill('true');
        const rows = page.locator(gridRows);
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const booleanText = await rows.nth(i).locator(booleanColumn).textContent();
            expect(booleanText?.toLowerCase()).toBe('true');
        }
    });

});

