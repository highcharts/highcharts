import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setupRoutes } from '../fixtures';
import { getKarmaScripts } from '../utils';
import { captureVisualSVG } from '../visual/visual-capture';
import { setVisualTime } from '../visual/visual-clock';
import { compareVisualSVGs } from '../visual/visual-comparison';

const sources = JSON.parse(readFileSync(
    join(__dirname, '../visual/data/index.json'), 'utf8'
)) as { url: string; filename: string }[];
const source = sources.find(source =>
    source.filename === 'security-details-us9229087104.json'
);

async function prepareDashboard(page: Page, layout = true): Promise<void> {
    await page.context().setOffline(true);
    await setVisualTime(page);
    await setupRoutes(page);
    await page.setContent('<div id="container"></div>');
    for (const script of [
        ...(await getKarmaScripts()),
        'code/grid/grid-pro.src.js',
        'code/dashboards/dashboards.src.js',
        ...(layout ? ['code/dashboards/modules/layout.src.js'] : []),
        'node_modules/@highcharts/connectors-morningstar/' +
            'connectors-morningstar.js',
        'test/visual-comparator.js',
        'tests/visual/visual-setup.js'
    ]) {
        await page.addScriptTag({ path: script });
    }
    await page.evaluate(() => window.HCVisualSetup.beforeSample());
}

test('dashboard capture waits for Grid data and includes HTML cells', async ({
    page
}) => {
    await prepareDashboard(page);
    await page.addStyleTag({
        path: 'samples/stock/financial/key-stats/demo.css'
    });

    let release: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route(source.url, async route => {
        await gate;
        await route.fulfill({
            path: join('tests/visual/data', source.filename),
            contentType: 'application/json'
        });
    });

    try {
        await page.addScriptTag({
            path: 'samples/stock/financial/key-stats/demo.js'
        });
        let captured = false;
        const capturing = captureVisualSVG(page, 100, 10).then(svg => {
            captured = true;
            return svg;
        });
        // Hold the real connector response while capture checks readiness.
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(captured).toBe(false);
        release();

        const svg = await capturing;
        expect(svg).toContain('data:image/png;base64,');
        await expect(page.locator('#container td').first()).toBeVisible();
        await expect(page.locator('.highcharts-container')).toHaveCount(0);

        await page.locator('#container td').first().evaluate(cell => {
            cell.textContent = 'Changed metadata';
        });
        const changed = await captureVisualSVG(page);
        const comparison = await compareVisualSVGs(page, svg, changed);
        expect(comparison.difference).toBeGreaterThan(0);
    } finally {
        release();
        await page.evaluate(() => window.HCVisualSetup.afterSample());
    }
});

test('dashboard capture waits for pending chart data updates', async ({ page }) => {
    await prepareDashboard(page);

    let release: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/dashboard-data.json', async route => {
        await gate;
        await route.fulfill({ json: [2, 3, 4] });
    });

    try {
        await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;
            const board = await Dashboards.board('container', {
                gui: {
                    layouts: [{ rows: [{ cells: [{ id: 'chart' }] }] }]
                },
                components: [{
                    type: 'Highcharts',
                    renderTo: 'chart',
                    chartOptions: {
                        chart: { animation: false },
                        plotOptions: { series: { animation: false } },
                        title: { text: 'Data pending' },
                        series: [{ type: 'line', data: [1, 2, 3] }]
                    }
                }]
            }, true);
            const chart = board.mountedComponents[0].component.chart;
            const request = new XMLHttpRequest();
            request.onload = () => {
                chart.series[0].setData(JSON.parse(request.responseText));
                chart.setTitle({ text: 'Data loaded' });
            };
            request.open('GET', 'http://localhost/dashboard-data.json');
            request.send();
        });
        let captured = false;
        const capturing = captureVisualSVG(page, 100, 10).then(svg => {
            captured = true;
            return svg;
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(captured).toBe(false);
        release();

        const svg = await capturing;
        await expect(page.locator('.highcharts-title')).toHaveText('Data loaded');
        expect(svg).toBe(await captureVisualSVG(page));
    } finally {
        release();
        await page.evaluate(() => window.HCVisualSetup.afterSample());
    }
});

test('dashboard capture supports charts without the layout module', async ({
    page
}) => {
    await prepareDashboard(page, false);
    await page.locator('#container').evaluate(container => {
        container.innerHTML = '<div id="chart"></div>';
    });

    try {
        await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;
            await Dashboards.board('container', {
                components: [{
                    type: 'Highcharts',
                    renderTo: 'chart',
                    chartOptions: {
                        chart: { animation: false },
                        plotOptions: { series: { animation: false } },
                        series: [{ type: 'line', data: [1, 2, 3] }]
                    }
                }]
            }, true);
        });
        expect(await captureVisualSVG(page)).toContain('data:image/png;base64,');
    } finally {
        await page.evaluate(() => window.HCVisualSetup.afterSample());
    }
});
