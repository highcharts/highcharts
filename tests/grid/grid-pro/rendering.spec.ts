import { test, expect } from '~/fixtures.ts';

test.describe('Rendering types', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/cell-renderers');
    });

    // Boolean
    test('Boolean as a string', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_checkbox"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input[type="checkbox"]')).not.toBeVisible();

        await expect(cell).toContainText('true');
    });

    test('Boolean as a checkbox, when renderer is used', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="checkbox_checkbox"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input[type="checkbox"]')).toBeVisible();
    });

    test('Boolean as a checkbox, when editing', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_checkbox"]').first();
        await cell.dblclick();
        await expect(cell.locator('input[type="checkbox"]')).toBeVisible();
    });

    // Text
    test('Text as a string', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_textInput"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input')).not.toBeVisible();

        await expect(cell).toContainText('Gamma');
    });

    test('Text as a input, when renderer is used', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="textInput_textInput"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input')).toBeVisible();
    });

    test('Text as a input, when editing', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_textInput"]').first();
        await cell.dblclick();
        await expect(cell.locator('input')).toBeVisible();
    });

    // Datetime
    test('Date for datetime data type', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_date"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input[type="date"]')).not.toBeVisible();

        await expect(cell).toContainText('2023');
    });

    test('Date for datetime data type, when renderer is used', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="date_date"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input[type="date"]')).toBeVisible();
    });

    test('Date for datetime data type, when editing', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_date"]').first();
        await cell.dblclick();
        await expect(cell.locator('input[type="date"]')).toBeVisible();
    });

    // Select
    test('Select, when editing', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_select"]').first();
        await cell.dblclick();
        await expect(cell.locator('select')).toBeVisible();
    });

    test('Select type should be selectable', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="select_select"]').first();
        await expect(cell).toBeVisible();
        const select = cell.locator('select');
        await expect(select).toBeVisible();
        await select.selectOption('R');
    });

    // Number
    test('Number as a string', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_numberInput"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input')).not.toBeVisible();

        await expect(cell).toContainText('3');
    });

    test('Number as a input, when renderer is used', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="numberInput_numberInput"]').first();
        await expect(cell).toBeVisible();
        await expect(cell.locator('input')).toBeVisible();
    });

    test('Number as a input, when editing', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_numberInput"]').first();
        await cell.dblclick();
        await expect(cell.locator('input')).toBeVisible();
    });

    test('Number input attributes', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="2"] td[data-column-id="text_numberInput"]').first();
        await cell.dblclick();
        const input = cell.locator('input');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('step', '1');
        await expect(input).toHaveAttribute('min', '0');
        await expect(input).toHaveAttribute('max', '10');
    });
});

