import { test, expect } from '~/fixtures.ts';

// HTML setup for Dashboards with layout module only
const dashboardsWithLayoutHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/dashboards/dashboards.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/modules/layout.src.js"></script>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

test.describe('Board Tests', () => {
    // Regression test for #24857
    test('Board.destroy() with multiple layouts', async ({ page }) => {
        await page.setContent(
            dashboardsWithLayoutHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;

            const board = await Dashboards.board('container', {
                gui: {
                    layouts: [{
                        id: 'layout-1',
                        rows: [{ cells: [{ id: 'dashboard-cell-1' }] }]
                    }, {
                        id: 'layout-2',
                        rows: [{ cells: [{ id: 'dashboard-cell-2' }] }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-cell-1',
                    type: 'HTML',
                    elements: [{ tagName: 'p', textContent: 'Layout 1' }]
                }, {
                    renderTo: 'dashboard-cell-2',
                    type: 'HTML',
                    elements: [{ tagName: 'p', textContent: 'Layout 2' }]
                }]
            }, true);

            const layoutsBefore = board.layouts.length;

            let error: string | null = null;
            try {
                board.destroy();
            } catch (e) {
                error = (e as Error).message;
            }

            return {
                layoutsBefore,
                error,
                // `destroy` deletes all board properties, so `layouts`
                // becomes undefined when fully destroyed.
                layoutsAfter: board.layouts
            };
        });

        expect(result.layoutsBefore, 'Board created with two layouts').toBe(2);
        expect(
            result.error,
            'destroy() should not throw with multiple layouts'
        ).toBeNull();
        expect(
            result.layoutsAfter,
            'Board fully destroyed, all layouts removed'
        ).toBeUndefined();
    });
});
