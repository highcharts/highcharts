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
        await page.locator('.highcharts-container').click({ position: { x: 100, y: 210 } });
        await page.locator('.highcharts-container').click({ position: { x: 120, y: 260 } });
        await page.locator('.highcharts-container').click({ position: { x: 140, y: 210 } });
        await page.locator('.highcharts-container').click({ position: { x: 160, y: 260 } });

        const chart = await page.evaluate(() => {
            return Highcharts.charts[0];
        });

        chart.annotations[0].points.forEach(point => {
            expect(point.y).toBeGreaterThan(-50);
            expect(point.y).toBeLessThan(75);
        });
    });
    // test('#16158: Should use correct default series in popup', async ({ page }) => {
    //     await page.locator('.highcharts-indicators').click();
    //     await page.locator('.highcharts-indicator-list').getByText('Accumulation').click();
    //     await expect(page.locator('.highcharts-tab-item-show #highcharts-select-series')).toHaveValue('aapl-ohlc');
    //     await expect(page.locator('.highcharts-tab-item-show #highcharts-select-volume')).toHaveValue('aapl-volume');
    //     await page.getByRole('button', { name: 'Add' }).nth(1).click();
    //     await page.locator('.highcharts-indicators').click();
    //     await page.getByText('Edit').click();
    //
    //     const selectedElement = page.locator('#highcharts-select-series').first().evaluate((el: HTMLSelectElement) => el.value);
    //     expect(selectedElement).toBe('aapl-ohlc');
    //     // const selectedElement2 = page.locator('#highcharts-select-series').nth(1).evaluate((el: HTMLSelectElement) => el.value);
    //     // expect(selectedElement2).toBe('aapl-volume');
    // });
    //
    // test('#16159: For some indicators params, there should be a dropdown with options in popup.', async ({ page }) => {
    //     await page.locator('.highcharts-indicators').click();
    //     await page.locator('.highcharts-indicator-list').contains('Disparity Index').click();
    //     await page.locator('#highcharts-select-params\\.average').selectOption('ema');
    //     await page.locator('.highcharts-popup-rhs-col button').contains('Add').click();
    // });
    //
    // test('#17425: Editing labels of Elliott3 line should not hide the line.', async ({ page }) => {
    //     await page.locator('.highcharts-elliott3').first().click();
    //     await page.locator('.highcharts-container').click({ position: { x: 300, y: 100 }, force: true });
    //     await page.locator('.highcharts-container').click({ position: { x: 320, y: 120 }, force: true });
    //     await page.locator('.highcharts-container').click({ position: { x: 340, y: 120 }, force: true });
    //     await page.locator('.highcharts-container').click({ position: { x: 360, y: 100 }, force: true });
    //
    //     await page.locator('.highcharts-annotation-shapes').last().click({ force: true });
    //     await page.locator('.highcharts-annotation-edit-button').click();
    //     await page.locator('input[name="highcharts-annotation-0"]').clear().type('1');
    //     await page.locator('div.highcharts-popup-bottom-row button').click();
    //
    //     const chart = await page.evaluate(() => {
    //         return Highcharts.charts[0];
    //     });
    //
    //     expect(chart.annotations[0].graphic.opacity).toBe(1);
    // });
    //
    // test('#17425: Editing labels of Elliott3 line to number should not change type of input.', async ({ page }) => {
    //     await page.locator('.highcharts-annotation-shapes').last().click({ force: true });
    //     await page.locator('.highcharts-annotation-edit-button').click();
    //     await page.locator('input[name="highcharts-annotation-0"]').clear().type('(X)');
    //     await page.locator('div.highcharts-popup-bottom-row button').click();
    //     await page.locator('.highcharts-annotation-shapes').last().click({ force: true });
    //     await page.locator('.highcharts-annotation-edit-button').click();
    //     await expect(page.locator('input[name="highcharts-annotation-0"]')).toHaveValue('(X)');
    //     await page.locator('button.highcharts-popup-close').click();
    // });
});

// test.describe('Indicator popup searchbox, #16019.', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.setViewportSize({ width: 1000, height: 800 });
//         await page.goto('http://localhost:3030/highcharts/cypress/stock-tools-gui/');
//     });
//
//     test('Search indicator input should filter and sort the list, #16019.', async ({ page }) => {
//         await page.locator('.highcharts-indicators').click();
//         await page.locator('input[name="highcharts-input-search-indicators"]').click().type('ac');
//         await expect(page.locator('.highcharts-indicator-list')).toHaveCount(5);
//
//         await page.locator('input[name="highcharts-input-search-indicators"]').type('c');
//         await expect(page.locator('.highcharts-indicator-list li:first')).toContainText('Acceleration Bands');
//
//         await page.locator('input[name="highcharts-input-search-indicators"]').clear().type('cd');
//         await expect(page.locator('.highcharts-indicator-list li:first')).toContainText('MACD');
//     });
//
//     test('Clicking the reset button should reset the indicator list, #16019.', async ({ page }) => {
//         await page.locator('.clear-filter-button').click();
//         await expect(page.locator('input[name="highcharts-input-search-indicators"]')).toHaveValue('');
//         await expect(page.locator('.highcharts-indicator-list')).toHaveCount(50);
//     });
//
//     test('Indicators should be accessible through aliases, #16019.', async ({ page }) => {
//         await page.locator('input[name="highcharts-input-search-indicators"]').type('boll');
//         await expect(page.locator('.highcharts-indicator-list li:first')).toContainText('BB');
//     });
//
//     test('Popup should warn when no items are found using the filter, #16019.', async ({ page }) => {
//         await page.locator('input[name="highcharts-input-search-indicators"]').type('dada');
//         await expect(page.locator('.highcharts-popup-rhs-col-wrapper')).toContainText('No match');
//         await page.locator('.clear-filter-button').click();
//         await expect(page.locator('.highcharts-indicator-list li:first')).toContainText('Acceleration Bands');
//     });
//
//     test('Stock-tools should work after update, #17741.', async ({ page }) => {
//         await page.locator('.highcharts-toggle-toolbar').click();
//         await page.locator('.highcharts-toggle-toolbar').click();
//         await page.locator('.highcharts-indicators').click();
//         await expect(page.locator('.highcharts-popup')).toBeVisible();
//     });
//
//     test('Indicators button should be inactive when popup is closed #16487', async ({ page }) => {
//         await page.locator('.highcharts-popup-close').click();
//         await expect(page.locator('.highcharts-indicators')).not.toHaveClass('highcharts-active');
//     });
// });
//
// test.describe('Annotations popup text field', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.setViewportSize({ width: 1000, height: 800 });
//         await page.goto('http://localhost:3030/highcharts/cypress/stock-tools-gui/');
//     });
//
//     test('Should be able to type `space` char in the text field', async ({ page }) => {
//         await page.locator('.highcharts-fibonacci').first().click();
//         await page.locator('.highcharts-container').click({ position: { x: 300, y: 100 }, force: true });
//         await page.locator('.highcharts-container').click({ position: { x: 400, y: 100 }, force: true });
//         await page.locator('.highcharts-container').click({ position: { x: 350, y: 200 }, force: true });
//         await page.locator('.highcharts-annotation').click();
//         await page.locator('button.highcharts-annotation-edit-button').click();
//         await page.locator('input[highcharts-data-name="typeOptions.line.fill"]').clear().type(' ').press('Enter');
//         await expect(page.locator('input[highcharts-data-name="typeOptions.line.fill"]')).toHaveValue(' ');
//     });
// });
//
