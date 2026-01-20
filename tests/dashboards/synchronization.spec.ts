import { test, expect } from '~/fixtures.ts';

// HTML setup for Dashboards with Highcharts and Grid plugins
// Note: Using grid-pro.js (not .src.js) to match the fixtures routing pattern
// The plugins (HighchartsPlugin, GridPlugin) are already included in dashboards.src.js
// Layout module is needed for GUI-based components
const dashboardsWithHighchartsAndGridHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/stock/highstock.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/dashboards.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/modules/layout.src.js"></script>
            <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            <link rel="stylesheet" href="https://code.highcharts.com/css/grid-pro.css">
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

// Simple Dashboards HTML for basic sync tests - needs layout module for GUI
const dashboardsHTML = `
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

test.describe('Synchronization Tests', () => {
    // Equivalent of test/typescript-karma/Dashboards/Synchronization/sync.test.js
    test('Sync events leak in updated components', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsAndGridHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;
            const Grid = (window as any).Grid;

            // Connect plugins
            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
            Dashboards.GridPlugin.custom.connectGrid(Grid);
            Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'micro-element',
                        type: 'JSON',
                        data: [
                            ['Food', 'Vitamin A', 'Iron'],
                            ['Beef Liver', 6421, 6.5],
                            ['Lamb Liver', 2122, 6.5],
                            ['Cod Liver Oil', 1350, 0.9],
                            ['Mackerel', 388, 1],
                            ['Tuna', 214, 0.6]
                        ]
                    }]
                },
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{ id: 'chart' }, { id: 'grid' }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'chart',
                    type: 'Highcharts',
                    connector: { id: 'micro-element' },
                    sync: {
                        highlight: true,
                        visibility: true,
                        extremes: true
                    }
                }, {
                    renderTo: 'grid',
                    type: 'Grid',
                    connector: { id: 'micro-element' },
                    sync: {
                        highlight: true,
                        visibility: true,
                        extremes: true
                    }
                }]
            }, true);

            const cChart = dashboard.mountedComponents[0].component;
            const cGrid = dashboard.mountedComponents[1].component;

            const testLeaks = async (component: any) => {
                // Only the most important events are checked
                const events: Record<string, number | undefined> = {
                    setConnector: component.hcEvents.setConnector?.length,
                    afterSetConnector:
                        component.hcEvents.afterSetConnector?.length,
                    afterRender: component.hcEvents.afterRender?.length
                };

                await component.update({});

                // Disconnect the resize observer to avoid errors in the test
                component.grid?.viewport?.resizeObserver?.disconnect();

                return Object.keys(events).every((key) => (
                    events[key] === component.hcEvents[key]?.length
                ));
            };

            return {
                chartNoLeaks: await testLeaks(cChart),
                gridNoLeaks: await testLeaks(cGrid)
            };
        });

        expect(result.chartNoLeaks, 'Highcharts Component should not leak events when update.').toBe(true);
        expect(result.gridNoLeaks, 'Grid Component should not leak events when update.').toBe(true);
    });

    test('Custom sync handler & emitter', async ({ page }) => {
        await page.setContent(dashboardsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;

            type SyncResult = {
                handlerRegistered: boolean,
                emitterRegistered: boolean
            };
            return new Promise<SyncResult>((resolve) => {
                let handlerRegistered = false;
                let emitterRegistered = false;
                let handlerDone = false;
                let emitterDone = false;

                const checkDone = () => {
                    if (handlerDone && emitterDone) {
                        resolve({ handlerRegistered, emitterRegistered });
                    }
                };

                Dashboards.board('container', {
                    gui: {
                        layouts: [{
                            rows: [{
                                cells: [{ id: 'dashboard-1' }]
                            }]
                        }]
                    },
                    components: [{
                        type: 'HTML',
                        renderTo: 'dashboard-1',
                        elements: [{
                            tagName: 'h1',
                            textContent: 'test'
                        }],
                        sync: {
                            customSync: {
                                handler: function (this: any) {
                                    handlerRegistered = !!this.sync
                                        .registeredSyncHandlers.customSync;
                                    handlerDone = true;
                                    checkDone();
                                },
                                emitter: function (this: any) {
                                    emitterRegistered = !!this.sync
                                        .registeredSyncEmitters.customSync;
                                    emitterDone = true;
                                    checkDone();
                                }
                            }
                        }
                    }]
                });
            });
        });

        expect(result.handlerRegistered, 'Custom sync handler should be registered.').toBe(true);
        expect(result.emitterRegistered, 'Custom sync emitter should be registered.').toBe(true);
    });

    test('There should be no errors when syncing with chart with different extremes', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsAndGridHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            // Generate random data
            const data: (string | number)[][] = [['Series']];
            for (let i = 1; i < 200; i++) {
                data.push([Math.random() * 10]);
            }

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'data',
                        type: 'JSON',
                        data
                    }]
                },
                gui: {
                    layouts: [{
                        id: 'layout-1',
                        rows: [{
                            cells: [
                                { id: 'dashboard-col-0' },
                                { id: 'dashboard-col-1' }
                            ]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-col-0',
                    type: 'Highcharts',
                    chartConstructor: 'stockChart',
                    chartOptions: {
                        xAxis: { max: 100 }
                    },
                    connector: { id: 'data' },
                    sync: { highlight: true }
                }, {
                    renderTo: 'dashboard-col-1',
                    type: 'Highcharts',
                    connector: { id: 'data' },
                    sync: { highlight: true }
                }]
            }, true);

            const dataConnector = await dashboard.dataPool.getConnector('data');

            let noErrorThrown = true;
            try {
                dashboard.dataCursor.emitCursor(dataConnector.getTable(), {
                    type: 'position',
                    row: 120,
                    column: 'Series',
                    state: 'point.mouseOver'
                });
            } catch {
                noErrorThrown = false;
            }

            return { noErrorThrown };
        });

        expect(result.noErrorThrown, 'No errors should be thrown').toBe(true);
    });
});
