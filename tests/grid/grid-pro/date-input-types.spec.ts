import { test, expect } from '~/fixtures.ts';

test.describe('Date Input Types', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test('Should parse date input values correctly', async ({ page }) => {
        const browserName = page.context().browser()?.browserType().name();
        await page.goto('grid-pro/cypress/date-input-types');

        // Test date input type
        const dateCell = page.locator('tr[data-row-index="1"] td[data-column-id="dateView"]');
        await dateCell.dblclick();
        const dateInput = dateCell.locator('input[type="date"]');
        await expect(dateInput).toHaveValue('2023-01-02');
        await dateInput.clear();

        // In WebKit, input[type="date"] uses the native OS date picker, which
        // cannot be programmatically selected or committed (no Playwright
        // support), whereas input[type="datetime-local"] behaves like a regular
        // text input and can be automated, highlighting the difference between
        // these input types.
        if (browserName === 'webkit') {
            // Skip test in WebKit - native date picker cannot be automated
            test.skip();
            return;
        }

        await dateInput.fill('2023-12-25');
        await page.locator('body').click();

        await expect(dateCell).toContainText('2023-12-25');
    });

    test('Should parse datetime input values correctly', async ({ page }) => {
        await page.goto('grid-pro/cypress/date-input-types');

        // Test datetime input type
        const datetimeCell = page.locator('tr[data-row-index="0"] td[data-column-id="datetimeView"]');
        await datetimeCell.dblclick();
        const datetimeInput = datetimeCell.locator('input[type="datetime-local"]');
        await expect(datetimeInput).toHaveValue('2023-01-01T08:15:30');
        await datetimeInput.clear();
        await datetimeInput.fill('2023-05-20T14:30');
        await datetimeInput.blur();

        await expect(datetimeCell).toContainText('2023-05-20 14:30:00');
    });

    test('Should parse time input values correctly', async ({ page }) => {
        await page.goto('grid-pro/cypress/date-input-types');

        // Test time input type
        const timeCell = page.locator('tr[data-row-index="0"] td[data-column-id="timeView"]');
        await timeCell.dblclick();
        const timeInput = timeCell.locator('input[type="time"]');
        await expect(timeInput).toHaveValue('03:00:00');
        await timeInput.clear();
        await timeInput.fill('16:30');

        // Trigger blur to save the value
        await page.locator('body').click();

        await expect(timeCell).toContainText('16:30');
    });

    test('Should use correct input types for each column', async ({ page }) => {
        const browserName = page.context().browser()?.browserType().name();
        await page.goto('grid-pro/cypress/date-input-types');

        // In WebKit, input[type="date"] uses the native OS date picker, which
        // cannot be programmatically selected or committed (no Playwright
        // support), whereas input[type="datetime-local"] behaves like a regular
        // text input and can be automated, highlighting the difference between
        // these input types.
        if (browserName === 'webkit') {
            // Skip test in WebKit - native date picker cannot be automated
            test.skip();
            return;
        }

        // Verify correct input types are used
        const dateCell = page.locator('tr[data-row-index="0"] td[data-column-id="dateView"]');
        await dateCell.dblclick();
        await expect(dateCell.locator('input[type="date"]')).toBeVisible();

        const datetimeCell = page.locator('tr[data-row-index="0"] td[data-column-id="datetimeView"]');
        await datetimeCell.dblclick();
        await expect(datetimeCell.locator('input[type="datetime-local"]')).toBeVisible();

        const timeCell = page.locator('tr[data-row-index="0"] td[data-column-id="timeView"]');
        await timeCell.dblclick();
        await expect(timeCell.locator('input[type="time"]')).toBeVisible();
    });

    test('Should handle always-edit mode columns', async ({ page }) => {
        await page.goto('grid-pro/cypress/date-input-types');

        // Test columns that are always in edit mode
        const dateEditCell = page.locator('tr[data-row-index="0"] td[data-column-id="dateEdit"]');
        const dateEditInput = dateEditCell.locator('input[type="date"]');
        await expect(dateEditInput).toBeVisible();
        await expect(dateEditInput).toHaveValue('2023-01-01');

        const datetimeEditCell = page.locator('tr[data-row-index="0"] td[data-column-id="datetimeEdit"]');
        const datetimeEditInput = datetimeEditCell.locator('input[type="datetime-local"]');
        await expect(datetimeEditInput).toBeVisible();
        await expect(datetimeEditInput).toHaveValue('2023-01-01T21:05:10');

        const timeEditCell = page.locator('tr[data-row-index="0"] td[data-column-id="timeEdit"]');
        const timeEditInput = timeEditCell.locator('input[type="time"]');
        await expect(timeEditInput).toBeVisible();
        await expect(timeEditInput).toHaveValue('07:00:00');
    });
});

