import { test, expect } from './fixtures.ts';

test('Chart creation', async ({ page }) => {
    await page.setContent('<div id="container"></container>');
    await page.addScriptTag({ path: './code/highcharts.src.js' });

    await page.evaluate(() => {
        window.Highcharts.chart('container', {});
    });

    await expect(page.locator('#container'))
        .toHaveAttribute('data-highcharts-chart', '0');
});

test('Redirects are applied for code', async ({ page }) => {
    const template = `<html>
    <head>
        <script src="https://code.highcharts.com/highcharts.src.js"></script>
        <script src="https://code.highcharts.com/maps/highmaps.js"></script>

        <script src="https://code.highcharts.com/esm/highcharts-gantt.js"></script>
    </head>
    <body>
        <div id="container"></container>
    </body>
    </html>`;

    await page.setContent(template);

    await page.evaluate(() => {
        window.Highcharts.chart('container', {});
    });

    await expect(page.locator('#container'))
        .toHaveAttribute('data-highcharts-chart', '0');

    const { annotations } = test.info();

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/highcharts.src.js --> code/highcharts.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/maps/highmaps.js --> code/highmaps.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/esm/highcharts-gantt.js --> code/esm/highcharts-gantt.src.js'
    });

});
