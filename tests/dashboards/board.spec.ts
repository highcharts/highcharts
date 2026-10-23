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

    // Regression test for #25039
    test('Board.update() resolves when components are mounted', async ({
        page
    }) => {
        await page.setContent(
            dashboardsWithLayoutHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;

            const board = await Dashboards.board('container', {
                gui: {
                    layouts: [{
                        rows: [{ cells: [{ id: 'dashboard-cell-1' }] }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-cell-1',
                    type: 'HTML',
                    elements: [{ tagName: 'h1', textContent: 'Initial' }]
                }]
            }, true);

            const updated = await board.update({
                components: [{
                    renderTo: 'dashboard-cell-1',
                    type: 'HTML',
                    elements: [{ tagName: 'h1', textContent: 'Updated' }]
                }]
            });

            return {
                isSameBoard: updated === board,
                mounted: updated.mountedComponents.length,
                text: updated.mountedComponents[0]
                    ?.component.contentElement.textContent
            };
        });

        expect(
            result.isSameBoard,
            'update() resolves with the board instance'
        ).toBe(true);
        expect(result.mounted, 'One component mounted').toBe(1);
        expect(
            result.text,
            'Component is mounted once the promise resolves'
        ).toBe('Updated');
    });

    test('renderTo is an element id, not a CSS selector', async ({ page }) => {
        await page.setContent(
            dashboardsWithLayoutHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;
            const outside = document.createElement('div');

            outside.id = 'admin-panel';
            outside.textContent = 'untouched';
            document.body.appendChild(outside);

            let error: string | null = null;
            let board: any;

            try {
                board = await Dashboards.board('container', {
                    gui: {
                        layouts: [{
                            rows: [{
                                cells: [{ id: 'dashboard-cell-1' }]
                            }]
                        }]
                    },
                    components: [{
                        renderTo: 'dashboard-cell-1',
                        type: 'HTML',
                        elements: [{
                            tagName: 'p',
                            textContent: 'Inside'
                        }]
                    }, {
                        renderTo: 'missing,#admin-panel',
                        type: 'HTML',
                        elements: [{
                            tagName: 'p',
                            textContent: 'Pwned'
                        }]
                    }, {
                        renderTo: 'bad"id)',
                        type: 'HTML',
                        elements: [{
                            tagName: 'p',
                            textContent: 'Nope'
                        }]
                    }]
                }, true);
            } catch (e) {
                error = (e as Error).name + ': ' + (e as Error).message;
            }

            return {
                error,
                outsideText: outside.textContent,
                outsideChildren: outside.children.length,
                mounted: board ? board.mountedComponents.length : 0,
                insideText: document.getElementById('dashboard-cell-1')
                    ?.textContent
            };
        });

        expect(result.error, 'Board.init() should not throw').toBeNull();
        expect(
            result.outsideText,
            'Comma in the id must not match #admin-panel'
        ).toBe('untouched');
        expect(
            result.outsideChildren,
            'Component must not mount outside the board'
        ).toBe(0);
        expect(result.mounted, 'Only the real cell is mounted').toBe(1);
        expect(result.insideText, 'Normal id still resolves').toContain('Inside');
    });
});
