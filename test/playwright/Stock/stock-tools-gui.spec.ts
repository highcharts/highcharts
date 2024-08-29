import { test, expect } from '@playwright/test';
declare const Highcharts: any;

test.describe('Stock Tools annotation popup, #15725', () => {

    test.beforeEach(async ({ page }) => {
        const urlPrefix = "view?path=";
        await page.goto(urlPrefix + '/highcharts/cypress/stock-tools-gui/');
    });

    test('Adding annotation after deselecting the button should not be allowed, #16485.', async ({ page }) => {
        await page.locator('.highcharts-label-annotation').first().click();
        await page.locator('.highcharts-label-annotation').first().click();
        await page.locator('.highcharts-container').click({ position: { x: 100, y: 210 } });

        const chart = await page.evaluate(() => {
            return Highcharts.charts[0];
        });

        expect(chart.annotations.length).toBe(0);
    });

    test('#15730: Should close popup after hiding annotation', async ({ page }) => {
        await page.locator('.highcharts-label-annotation').first().click();
        await page.locator('.highcharts-container').click();

        let chart = await page.evaluate(() => {
            return Highcharts.charts[0];
        });
        expect(chart.annotations.length).toBe(1);

        await page.locator('.highcharts-annotation').click();
        await expect(page.locator('.highcharts-popup')).toBeVisible();
        await page.locator('.highcharts-toggle-annotations').click();
        await expect(page.locator('.highcharts-popup')).toBeHidden();
        await page.locator('.highcharts-toggle-annotations').click();
    });

    test('#15729: Should keep annotation selected after dragging', async ({ page }) => {
        await page.locator('.highcharts-label-annotation').first().click();
        await page.locator('.highcharts-container').click();
        await page.locator('.highcharts-annotation').click();
        await page.mouse.move(300, 100);
        await page.mouse.down();
        await page.mouse.move(350, 150);
        await page.mouse.up();
        await expect(page.locator('.highcharts-popup')).toBeVisible();
    });


    test('#15727: Should keep popup open after dragging from input to outside popup', async ({ page }) => {
        await page.locator('.highcharts-label-annotation').first().click();
        await page.locator('.highcharts-container').click();
        await page.locator('.highcharts-annotation').click();
        await page.locator('.highcharts-annotation-edit-button').click();
        await page.locator('.highcharts-popup input').first().click();
        await page.mouse.move(100, 200);
        await page.mouse.down();
        await page.mouse.move(150, 250);
        await page.mouse.up();
    });

    test('#15725: Should use the same axis for all points in multi-step annotation', async ({ page }) => {
        await page.locator('.highcharts-elliott3').first().click();
        const element = page.locator('.highcharts-container');
        const rect = await element.boundingBox();

        expect(rect).not.toBeNull();

        if (!rect) {
            throw new Error(`Element ${element} was not found or is not visible`);
        }

        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height * 0.7 } });
        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 3 } });

        const chart = await page.evaluate(() => {
            return Highcharts.charts[0];
        });

        chart.annotations[0].points.forEach((point) => {
            expect(point.y).toBeGreaterThan(-50);
            expect(point.y).toBeLessThan(100);
        });

    });
    test('#16158: Should use correct default series in popup', async ({ page }) => {
        await page.locator('.highcharts-indicators').click();
        await page.locator('.highcharts-indicator-list').getByText('Accumulation').click();
        await expect(page.locator('.highcharts-tab-item-show #highcharts-select-series')).toHaveValue('aapl-ohlc');
        await expect(page.locator('.highcharts-tab-item-show #highcharts-select-volume')).toHaveValue('aapl-volume');
        await page.getByRole('button', { name: 'Add' }).nth(1).click();
        await page.locator('.highcharts-indicators').click();
        await page.getByText('Edit').click();

        expect(await page.locator('#highcharts-select-series').first().evaluate((el: HTMLSelectElement) => el.value)).toBe('aapl-ohlc');
        expect(await page.locator('#highcharts-select-series').nth(1).evaluate((el: HTMLSelectElement) => el.value)).toBe('aapl-ohlc');
    });
    //
    // test('#16159: For some indicators params, there should be a dropdown with options in popup.', async ({ page }) => {
    //     await page.locator('.highcharts-indicators').click();
    //     await page.locator('.highcharts-input-search-indicators').fill('Dis');
    //     await page.getByText('Disparity Index').click();
    //     const selectLabel = page.locator('[id="highcharts-select-params\\.average"]');
    //     await selectLabel.selectOption('ema');
    // });

    test('#17425: Editing labels of Elliott3 line should not hide the line.', async ({ page }) => {
        await page.locator('.highcharts-elliott3').first().click();
        const element = page.locator('.highcharts-container');
        const rect = await element.boundingBox();

        expect(rect).not.toBeNull();

        if (!rect) {
            throw new Error(`Element ${element} was not found or is not visible`);
        }
        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height / 3 } });
        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 3 } });

        await page.locator('.highcharts-annotation-shapes').last().click();
        await page.getByText('Edit').click();
        await page.locator('input[name="highcharts-annotation-0"]').fill('1');
        await page.getByRole('button', { name: 'Save' }).click();

        const chart = await page.evaluate(() => {
            return Highcharts.charts[0];
        });

        expect(chart.annotations[0].graphic.opacity).toBe(1);
    });
    //
    test('#17425: Editing labels of Elliott3 line to number should not change type of input.', async ({ page }) => {
        await page.locator('.highcharts-elliott3').first().click();
        const element = page.locator('.highcharts-container');
        const rect = await element.boundingBox();

        expect(rect).not.toBeNull();

        if (!rect) {
            throw new Error(`Element ${element} was not found or is not visible`);
        }
        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height / 4 } });
        await element.click({ position: { x: rect.x + rect.width / 3, y: rect.y + rect.height / 3 } });
        await element.click({ position: { x: rect.x + rect.width / 4, y: rect.y + rect.height / 3 } });

        await page.getByText('Edit').click();
        await page.locator('input[name="highcharts-annotation-0"]').fill('(X)');
        await page.getByRole('button', { name: 'Save' }).click();
        await page.locator('.highcharts-annotation-shapes').last().click();
        await page.locator('.highcharts-annotation-edit-button').click();
        await expect(page.locator('input[name="highcharts-annotation-0"]')).toHaveValue('(X)');
        await page.locator('button.highcharts-popup-close').click();
    });
});

test.describe('Annotations popup text field', () => {

    test.beforeEach(async ({ page }) => {
        const urlPrefix = "view?path=";
        await page.goto(urlPrefix + '/highcharts/cypress/stock-tools-gui/');
    });

    test('Should be able to type `space` char in the text field', async ({ page }) => {
        await page.locator('.highcharts-fibonacci').first().click();
        const element = page.locator('.highcharts-container');
        const rect = await element.boundingBox();

        expect(rect).not.toBeNull();

        if (!rect) {
            throw new Error(`Element ${element} was not found or is not visible`);
        }
        await element.click({ position: { x: rect.x + rect.width * 0.1, y: rect.y + rect.height * 0.5 } });
        await element.click({ position: { x: rect.x + rect.width * 0.8, y: rect.y + rect.height * 0.5 } });
        await element.click({ position: { x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.3 } });

        await page.locator('.highcharts-annotation').click();

        await page.locator('button.highcharts-annotation-edit-button').click();
        await page.locator('input[highcharts-data-name="typeOptions.line.fill"]').fill(' ');
        await expect(page.locator('input[highcharts-data-name="typeOptions.line.fill"]')).toHaveValue(' ');
    });
});
