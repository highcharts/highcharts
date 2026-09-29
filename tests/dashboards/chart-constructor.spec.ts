import { test, expect } from '~/fixtures.ts';

const pageContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/highcharts.src.js"></script>
            <script src="https://code.highcharts.com/stock/modules/stock.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/dashboards.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/modules/layout.src.js"></script>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

async function mount(chartConstructor: string) {
    const Dashboards = (window as any).Dashboards;

    try {
        const board = await Dashboards.board('container', {
            gui: { layouts: [{ rows: [{ cells: [{ id: 'cell-1' }] }] }] },
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
        const chart = component.chart;

        return {
            error: null,
            resolvedConstructor: component.chartConstructor,
            isChart: !!(chart && chart.series && chart.container),
            chartIsFunction: typeof chart === 'function'
        };
    } catch (e) {
        return {
            error: String(e),
            resolvedConstructor: null,
            isChart: false,
            chartIsFunction: false
        };
    }
}

test.describe('HighchartsComponent chartConstructor', () => {
    test('A namespace member that is not a factory falls back to chart',
        async ({ page }) => {
            await page.setContent(pageContent, { waitUntil: 'networkidle' });

            const result = await page.evaluate(mount, 'constructor');

            expect(result.error).toBeNull();
            expect(result.chartIsFunction).toBe(false);
            expect(result.resolvedConstructor).toBe('chart');
            expect(result.isChart).toBe(true);
        });

    test('An unknown constructor falls back to chart', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        const result = await page.evaluate(mount, '__proto__');

        expect(result.error).toBeNull();
        expect(result.resolvedConstructor).toBe('chart');
        expect(result.isChart).toBe(true);
    });

    test('Supported constructors keep working', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        const result = await page.evaluate(mount, 'stockChart');

        expect(result.error).toBeNull();
        expect(result.resolvedConstructor).toBe('stockChart');
        expect(result.isChart).toBe(true);
    });
});
