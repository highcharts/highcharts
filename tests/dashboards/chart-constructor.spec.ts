import { test, expect } from '~/fixtures.ts';

// Align with other Dashboards + Highcharts specs: local code via CDN rewrite,
// highcharts only (no stock), connectHighcharts, wait for load (not networkidle).
const pageContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/highcharts.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/dashboards.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/modules/layout.src.js"></script>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

async function mount(chartConstructor: string) {
    const Highcharts = (window as any).Highcharts;
    const Dashboards = (window as any).Dashboards;

    Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

    const board = await Dashboards.board('container', {
        gui: {
            layouts: [{
                rows: [{
                    cells: [{ id: 'cell-1' }]
                }]
            }]
        },
        components: [{
            renderTo: 'cell-1',
            type: 'Highcharts',
            chartConstructor,
            chartOptions: {
                series: [{ type: 'line', data: [1, 2, 3] }]
            }
        }]
    }, true);

    const component = board.mountedComponents[0].component;

    return {
        resolvedConstructor: component.chartConstructor,
        chartType: typeof component.chart,
        hasSeries: !!(component.chart && component.chart.series)
    };
}

test.describe('HighchartsComponent chartConstructor', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'load' });
    });

    test('A namespace member that is not a factory falls back to chart',
        async ({ page }) => {
            const result = await page.evaluate(mount, 'constructor');

            expect(result.resolvedConstructor).toBe('chart');
            expect(result.chartType).toBe('object');
            expect(result.hasSeries).toBe(true);
        });

    test('An unknown constructor falls back to chart', async ({ page }) => {
        const result = await page.evaluate(mount, '__proto__');

        expect(result.resolvedConstructor).toBe('chart');
        expect(result.hasSeries).toBe(true);
    });

    test('Supported constructor keeps working', async ({ page }) => {
        const result = await page.evaluate(mount, 'chart');

        expect(result.resolvedConstructor).toBe('chart');
        expect(result.hasSeries).toBe(true);
    });
});
