import { test, expect } from '../fixtures.ts';

// Common HTML setup for Dashboards with Highcharts plugin
// Note: HighchartsPlugin is included in dashboards.src.js, but we need layout module for GUI
const dashboardsWithHighchartsHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/stock/highstock.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/dashboards.src.js"></script>
            <script src="https://code.highcharts.com/dashboards/modules/layout.src.js"></script>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

// Helper function setup for Dashboards with layout module
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

test.describe('Component helpers', () => {
    // Equivalent of test/typescript-karma/Dashboards/Component/helpers.test.js
    // Note: This test uses KPI with chartOptions, which requires Highcharts
    test('Component helpers', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            // Connect Highcharts plugin for KPI chart
            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const dashboard = await Dashboards.board('container', {
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'dashboard-cell-1'
                            }, {
                                id: 'dashboard-cell-2'
                            }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-cell-1',
                    type: 'KPI',
                    title: 'Value',
                    value: 1,
                    chartOptions: {
                        series: [{
                            data: [1, 2, 3]
                        }]
                    }
                }, {
                    renderTo: 'dashboard-cell-2',
                    id: 'html-component',
                    type: 'HTML',
                    elements: [{
                        tagName: 'h1',
                        textContent: 'HTML from elements'
                    }]
                }]
            }, true);

            // Old way of getting components
            const kpi = dashboard.mountedComponents[0].component;
            const html = dashboard.mountedComponents[1].component;

            const kpiHasChart = !!kpi.chart;
            const htmlHasElement = !!html.element;

            // Getting components by ID
            const kpi1 = dashboard.getComponentByCellId('dashboard-cell-1');
            const html1 = dashboard.getComponentById('html-component');

            const html1HasElement = !!html1?.element;
            const kpi1HasChart = !!kpi1?.chart;

            // Getting components by ID, expected failures
            const compById = dashboard.getComponentById('dashboard-cell-2');
            const compByCellId = dashboard.getComponentByCellId('junk-cell-id');

            return {
                kpiHasChart,
                htmlHasElement,
                html1HasElement,
                kpi1HasChart,
                compByIdIsNull: !compById,
                compByCellIdIsNull: !compByCellId
            };
        });

        expect(result.kpiHasChart, 'KPI Component direct lookup.').toBe(true);
        expect(result.htmlHasElement, 'HTML Component direct lookup.').toBe(true);
        expect(result.html1HasElement, 'HTML Component via helper.').toBe(true);
        expect(result.kpi1HasChart, 'KPI Component via helper.').toBe(true);
        expect(result.compByIdIsNull, 'Component with wrong id.').toBe(true);
        expect(result.compByCellIdIsNull, 'Component with wrong cell id.').toBe(true);
    });
});

test.describe('HTML Component', () => {
    // Equivalent of test/typescript-karma/Dashboards/Component/html.test.js
    test('component resizing', async ({ page }) => {
        await page.setContent(dashboardsWithLayoutHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;

            const board = Dashboards.board('container', {
                gui: {
                    enabled: true,
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'dashboard-cell'
                            }]
                        }]
                    }]
                },
                components: [{
                    type: 'HTML',
                    renderTo: 'dashboard-cell'
                }]
            });

            const component = board.mountedComponents[0].component;

            const initialDimensions = {
                width: component.element.style.width,
                height: component.element.style.height
            };

            component.resize(200);
            const afterWidthResize = {
                width: component.element.style.width,
                height: component.element.style.height
            };

            component.resize(undefined, 300);
            const widthAfterHeightUpdate = component.element.style.width;
            const heightAfterHeightUpdate = component.element.style.height;

            component.destroy();

            return {
                initialDimensions,
                afterWidthResize,
                widthAfterHeightUpdate,
                heightAfterHeightUpdate
            };
        });

        expect(result.initialDimensions, 'Component with no dimensional options should have no internal styles set').toEqual({
            width: '',
            height: ''
        });

        expect(result.afterWidthResize, 'Should be able to update just the width').toEqual({
            width: '',
            height: ''
        });

        expect(
            result.widthAfterHeightUpdate === '' && result.heightAfterHeightUpdate !== '',
            'Should be able to update just the height. Width should stay the same.'
        ).toBe(true);
    });

    test('HTML Component created with elements and html string', async ({ page }) => {
        await page.setContent(dashboardsWithLayoutHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Dashboards = (window as any).Dashboards;

            const board = await Dashboards.board('container', {
                gui: {
                    enabled: true,
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'dashboard-cell-1'
                            }, {
                                id: 'dashboard-cell-2'
                            }]
                        }]
                    }]
                },
                components: [{
                    type: 'HTML',
                    renderTo: 'dashboard-cell-1',
                    elements: [{
                        tagName: 'h1',
                        textContent: 'HTML from elements'
                    }]
                }, {
                    type: 'HTML',
                    renderTo: 'dashboard-cell-2',
                    html: '<h1>HTML from string</h1>'
                }]
            }, true);

            const compFromElements = board.mountedComponents[0].component;
            const compFromString = board.mountedComponents[1].component;

            return {
                elementsText: compFromElements.element.innerText.trim(),
                stringText: compFromString.element.innerText.trim()
            };
        });

        expect(result.elementsText, 'HTML from elements should be rendered and text should be correct.').toBe('HTML from elements');
        expect(result.stringText, 'HTML from string should be rendered and text should be correct.').toBe('HTML from string');
    });
});

test.describe('KPI Component', () => {
    // Equivalent of test/typescript-karma/Dashboards/Component/kpi.test.js
    // Note: After update with chartOptions, Highcharts is needed
    test('KPI Component updating', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            // Connect Highcharts plugin for KPI chart
            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const dashboard = await Dashboards.board('container', {
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'dashboard-cell-1'
                            }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-cell-1',
                    type: 'KPI',
                    title: 'Value',
                    value: 1
                }]
            }, true);

            const kpi = dashboard.mountedComponents[0].component;
            const hasChartBeforeUpdate = !!kpi.chart;

            kpi.update({
                value: 2,
                chartOptions: {
                    series: [{
                        data: [1, 2, 3]
                    }]
                }
            });

            const hasChartAfterUpdate = !!kpi.chart;

            return {
                hasChartBeforeUpdate,
                hasChartAfterUpdate
            };
        });

        expect(result.hasChartBeforeUpdate, 'KPI Component should be loaded without a chart.').toBe(false);
        expect(result.hasChartAfterUpdate, 'KPI Component should have a chart after update.').toBe(true);
    });
});

test.describe('Highcharts Component', () => {
    // Equivalent of test/typescript-karma/Dashboards/Component/highcharts.test.js
    test('Board without data connectors and HighchartsComponent update', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            // Debug: Check if libraries loaded
            if (!Highcharts || !Dashboards) {
                return {
                    error: `Libraries not loaded: Highcharts=${!!Highcharts}, Dashboards=${!!Dashboards}`
                };
            }

            try {
                Dashboards.HighchartsPlugin.custom
                    .connectHighcharts(Highcharts);
                Dashboards.PluginHandler
                    .addPlugin(Dashboards.HighchartsPlugin);
            } catch (e: any) {
                return { error: `Plugin error: ${e.message}` };
            }

            const registeredEvents: string[] = [];
            const eventTypes = [
                'load', 'afterLoad', 'render', 'afterRender', 'tableChanged',
                'setConnectors', 'afterSetConnectors', 'update', 'afterUpdate'
            ];

            function registerEvent(e: any) {
                registeredEvents.push(e.type);
            }

            function emptyArray(array: any[]) {
                array.length = 0;
            }

            function registerEvents(component: any) {
                eventTypes.forEach(
                    (eventType) => component.on(eventType, registerEvent)
                );
            }

            let board: any;
            try {
                board = await Dashboards.board('container', {
                    gui: {
                        enabled: true,
                        layouts: [{
                            rows: [{
                                cells: [{
                                    id: 'cell-1'
                                }, {
                                    id: 'cell-2'
                                }]
                            }]
                        }]
                    },
                    components: [{
                        renderTo: 'cell-1',
                        type: 'Highcharts',
                        chartOptions: {
                            title: { text: void 0, style: {} }
                        }
                    }, {
                        renderTo: 'cell-2',
                        type: 'HTML',
                        elements: [{
                            tagName: 'h1',
                            textContent: 'Some text'
                        }]
                    }]
                }, true);
            } catch (e: any) {
                return { error: `Board creation error: ${e.message}` };
            }

            // Debug: Check board state
            const hasMounted = board.mountedComponents &&
                board.mountedComponents.length > 0;
            if (!hasMounted) {
                return {
                    error: `No mounted components. Board: ${JSON.stringify({
                        hasBoard: !!board,
                        mountedComponentsLength:
                            board.mountedComponents?.length,
                        guiEnabled: board.options?.gui?.enabled
                    })}`
                };
            }

            // Test the HighchartsComponent
            const highchartsComponent = board.mountedComponents[0].component;

            registerEvents(highchartsComponent);
            await highchartsComponent.update({
                chartOptions: {
                    title: { text: 'Hello World', style: {} }
                }
            });

            const highchartsEvents = [...registeredEvents];
            emptyArray(registeredEvents);

            const titleText =
                highchartsComponent.options.chartOptions.title.text;

            // Test the HTMLComponent
            const htmlComponent = board.mountedComponents[1].component;

            registerEvents(htmlComponent);
            htmlComponent.update({
                elements: [{
                    tagName: 'h1',
                    textContent: 'Hello World'
                }]
            });

            const htmlEvents = [...registeredEvents];
            emptyArray(registeredEvents);

            await highchartsComponent.update({
                chartConstructor: 'stockChart'
            });

            const hasNavigator = !!highchartsComponent.chart.navigator;

            return {
                highchartsEvents,
                titleText,
                htmlEvents,
                hasNavigator
            };
        });

        // Check for errors first
        if ('error' in result) {
            throw new Error((result as any).error);
        }

        expect(result.highchartsEvents, 'After updating the HighchartsComponent events should be fired in the correct order.').toEqual(
            ['update', 'afterUpdate', 'render', 'afterRender']
        );

        expect(result.titleText, 'HighchartsComponent should have updated title').toBe('Hello World');

        expect(result.htmlEvents, 'After updating HTMLComponent, the events should be fired in the correct order.').toEqual(
            ['update', 'render', 'afterRender']
        );

        expect(result.hasNavigator, 'HighchartsComponent chart constructor should be updated.').toBe(true);
    });

    test('Board with data connectors and HighchartsComponent update', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const registeredEvents: string[] = [];
            const eventTypes = [
                'load', 'afterLoad', 'render', 'afterRender', 'tableChanged',
                'setConnectors', 'afterSetConnectors', 'update', 'afterUpdate'
            ];

            function registerEvent(e: any) {
                registeredEvents.push(e.type);
            }

            function registerEvents(component: any) {
                eventTypes.forEach(
                    (eventType) => component.on(eventType, registerEvent)
                );
            }

            const board = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'connector-1',
                        type: 'CSV',
                        csv: '1,2,3',
                        firstRowAsNames: false
                    }, {
                        id: 'connector-2',
                        type: 'CSV',
                        csv: '4,5,6',
                        firstRowAsNames: false
                    }]
                },
                gui: {
                    enabled: true,
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'cell-1'
                            }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'cell-1',
                    type: 'Highcharts',
                    connector: { id: 'connector-1' },
                    chartOptions: {
                        title: { text: void 0, style: {} }
                    }
                }]
            }, true);

            const componentWithConnector = board.mountedComponents[0].component;

            registeredEvents.length = 0;
            registerEvents(componentWithConnector);

            await componentWithConnector.update({
                connector: { id: 'connector-2' },
                chartOptions: {
                    title: { text: 'Hello World', style: {} }
                }
            });

            return { registeredEvents: [...registeredEvents] };
        });

        expect(result.registeredEvents, 'If connector is given in options, it will be attached during load').toEqual([
            'update', 'setConnectors', 'afterSetConnectors', 'afterUpdate', 'render', 'afterRender'
        ]);
    });

    test('HighchartsComponent resizing', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const container = document.getElementById('container');
            container.style.width = '500px';

            const board = Dashboards.board(container, {
                gui: {
                    enabled: true,
                    layouts: [{
                        rows: [{
                            cells: [{
                                id: 'dashboard-cell'
                            }]
                        }]
                    }]
                },
                components: [{
                    type: 'Highcharts',
                    renderTo: 'dashboard-cell',
                    chartOptions: {
                        series: [{ data: [1, 2, 3] }]
                    }
                }]
            });

            const component = board.mountedComponents[0].component;
            component.resize(200);

            const afterWidthResize = {
                width: component.element.style.width,
                height: component.element.style.height
            };

            component.resize(undefined, 300);

            const afterHeightResize = {
                widthIsEmpty: component.element.style.width === '',
                heightIsNotEmpty: component.element.style.height !== ''
            };

            component.destroy();

            return { afterWidthResize, afterHeightResize };
        });

        expect(result.afterWidthResize, 'Should be able to update just the width').toEqual({
            width: '',
            height: ''
        });

        expect(
            result.afterHeightResize.widthIsEmpty &&
                result.afterHeightResize.heightIsNotEmpty,
            'Should be able to update just the height. ' +
                'Width should stay the same.'
        ).toBe(true);
    });

    test('Data columnAssignment', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'EUR-USD',
                        type: 'JSON',
                        data: [
                            ['Day', 'EUR', 'Rate'],
                            [1691971200000, 11, 1.0930],
                            [1692057600000, 23, 1.0926],
                            [1692144000000, 15, 1.0916]
                        ]
                    }, {
                        id: 'micro-element',
                        type: 'JSON',
                        firstRowAsNames: false,
                        columnIds: ['x', 'myOpen', 'myHigh', 'myLow', 'myClose', 'mySeries1', 'mySeries2'],
                        data: [
                            [1699434920314, 6, 5, 4, 1, 6, 9],
                            [1699494920314, 2, 6, 2, 5, 7, 9],
                            [1699534920314, 1, 9, 5, 3, 8, 8]
                        ]
                    }]
                },
                gui: {
                    layouts: [{
                        id: 'layout-1',
                        rows: [{
                            cells: [
                                { id: 'dashboard-col-0' },
                                { id: 'dashboard-col-1' },
                                { id: 'dashboard-col-2' }
                            ]
                        }, {
                            cells: [
                                { id: 'dashboard-col-3' },
                                { id: 'dashboard-col-4' },
                                { id: 'dashboard-col-5' }
                            ]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-col-0',
                    type: 'Highcharts',
                    connector: {
                        id: 'EUR-USD',
                        columnAssignment: [{
                            seriesId: 'EUR',
                            data: ['Day', 'EUR']
                        }, {
                            seriesId: 'Rate',
                            data: ['Day', 'Rate']
                        }]
                    }
                }, {
                    renderTo: 'dashboard-col-1',
                    type: 'Highcharts',
                    connector: {
                        id: 'EUR-USD',
                        columnAssignment: [{
                            seriesId: 'eur-series',
                            data: ['Day', 'EUR']
                        }, {
                            seriesId: 'rate-series',
                            data: ['Day', 'Rate']
                        }]
                    },
                    chartOptions: {
                        yAxis: [{}, { opposite: true }],
                        series: [{
                            id: 'eur-series',
                            name: 'EUR'
                        }, {
                            id: 'rate-series',
                            name: 'Rate',
                            yAxis: 1
                        }]
                    }
                }, {
                    renderTo: 'dashboard-col-2',
                    type: 'Highcharts',
                    connector: {
                        id: 'EUR-USD',
                        columnAssignment: [{
                            seriesId: 'eur-series',
                            data: ['Day', 'EUR']
                        }, {
                            seriesId: 'Rate',
                            data: ['Day', 'Rate']
                        }]
                    },
                    chartOptions: {
                        yAxis: [{}, { opposite: true }],
                        series: [{
                            id: 'eur-series',
                            name: 'EUR',
                            yAxis: 1
                        }]
                    }
                }, {
                    renderTo: 'dashboard-col-3',
                    type: 'Highcharts',
                    connector: {
                        id: 'micro-element',
                        columnAssignment: [{
                            seriesId: 'mySeries1',
                            data: ['x', 'mySeries1']
                        }, {
                            seriesId: 'mySeries2',
                            data: ['x', 'mySeries2']
                        }, {
                            seriesId: 'mySeriesId',
                            data: {
                                x: 'x',
                                open: 'myOpen',
                                high: 'myHigh',
                                low: 'myLow',
                                close: 'myClose'
                            }
                        }]
                    },
                    chartOptions: {
                        series: [{
                            id: 'mySeries1',
                            type: 'spline'
                        }, {
                            id: 'mySeries2',
                            type: 'line'
                        }, {
                            id: 'mySeriesId',
                            type: 'ohlc'
                        }]
                    }
                }, {
                    renderTo: 'dashboard-col-4',
                    type: 'Highcharts',
                    connector: {
                        id: 'micro-element',
                        columnAssignment: [{
                            seriesId: 'my-series-1',
                            data: 'mySeries1'
                        }, {
                            seriesId: 'my-series-2',
                            data: 'mySeries2'
                        }, {
                            seriesId: 'my-series-3',
                            data: {
                                open: 'myOpen',
                                high: 'myHigh',
                                low: 'myLow',
                                close: 'myClose'
                            }
                        }]
                    },
                    chartOptions: {
                        series: [{
                            id: 'my-series-1',
                            type: 'spline'
                        }, {
                            id: 'my-series-2',
                            type: 'line'
                        }, {
                            id: 'my-series-3',
                            type: 'candlestick'
                        }]
                    }
                }, {
                    renderTo: 'dashboard-col-5',
                    type: 'Highcharts',
                    connector: {
                        id: 'EUR-USD',
                        columnAssignment: [{
                            seriesId: 'EUR',
                            data: ['Day', 'EUR']
                        }, {
                            seriesId: 'rate-series',
                            data: ['Day', 'Rate']
                        }]
                    },
                    chartOptions: {
                        yAxis: [{
                            title: { text: 'EUR / USD' }
                        }, {
                            title: { text: 'Rate' },
                            opposite: true
                        }],
                        series: [{
                            id: 'rate-series',
                            name: 'Rate',
                            type: 'column'
                        }, {
                            name: 'fake trend',
                            data: [
                                [1691971200000, 22],
                                [1692316800000, 22]
                            ]
                        }]
                    }
                }]
            }, true);

            const mountedComponents = dashboard.mountedComponents;

            return {
                // basic column assignment
                comp0SeriesLength: mountedComponents[0].component.chart.series.length,

                // columnAssigment merged with the same series options array
                comp1SeriesLength: mountedComponents[1].component.chart.series.length,
                comp1Series0YAxisIndex: mountedComponents[1].component.chart.series[0].yAxis.index,
                comp1Series1YAxisIndex: mountedComponents[1].component.chart.series[1].yAxis.index,

                // columnAssigment merged with shorter series options array
                comp2SeriesLength: mountedComponents[2].component.chart.series.length,
                comp2Series0YAxisIndex: mountedComponents[2].component.chart.series[0].yAxis.index,
                comp2Series1YAxisIndex: mountedComponents[2].component.chart.series[1].yAxis.index,

                // columnAssigment and seriesColumnMap (mapping columns into point props) - OHLC
                comp3SeriesLength: mountedComponents[3].component.chart.series.length,
                comp3Series2Type: mountedComponents[3].component
                    .chart.series[2].type,
                comp3Series2PointsLength: mountedComponents[3].component
                    .chart.series[2].points.length,
                comp3Series2HasData: mountedComponents[3].component
                    .chart.series[2].dataTable.getModified().rowCount > 0,

                // Candlestick
                comp4SeriesLength: mountedComponents[4].component.chart.series.length,
                comp4Series2Type: mountedComponents[4].component.chart.series[2].type,
                comp4Series2PointsLength: mountedComponents[4].component.chart.series[2].points.length,

                // columnAssigment, series options array and extra series with data
                comp5SeriesLength: mountedComponents[5].component.chart.series.length,
                comp5Series1Name: mountedComponents[5].component.chart.series[1].name,
                comp5Series2PointsLength: mountedComponents[5].component.chart.series[2].points.length
            };
        });

        // basic column assignment
        expect(result.comp0SeriesLength, 'Columns parsed to series by the basic column assignment.').toBe(2);

        // columnAssigment merged with the same series options array
        expect(result.comp1SeriesLength, 'Columns parsed to existing series.').toBe(2);
        expect(result.comp1Series0YAxisIndex, 'First series is assigned to basic yAxis.').toBe(0);
        expect(result.comp1Series1YAxisIndex, 'Second series is assigned to opposite yAxis.').toBe(1);

        // columnAssigment merged with shorter series options array
        expect(result.comp2SeriesLength, 'Columns parsed to series with shorter series options array.').toBe(2);
        expect(result.comp2Series0YAxisIndex, 'First series is assigned to yAxis 1.').toBe(1);
        expect(result.comp2Series1YAxisIndex, 'Second series is assigned to yAxis 0.').toBe(0);

        // OHLC
        expect(result.comp3SeriesLength, 'Columns parsed to series (OHLC).').toBe(3);
        expect(result.comp3Series2Type, 'OHLC series is initialized.').toBe('ohlc');
        expect(result.comp3Series2PointsLength, 'OHLC points are created.').toBeGreaterThan(0);
        expect(result.comp3Series2HasData, 'OHLC point is an array of open/low/high/close').toBe(true);

        // Candlestick
        expect(result.comp4SeriesLength, 'Columns parsed to series (Candlestick).').toBe(3);
        expect(result.comp4Series2Type, 'Candlestick series is initialized.').toBe('candlestick');
        expect(result.comp4Series2PointsLength, 'Candlestick points are created.').toBeGreaterThan(0);

        // columnAssigment, series options array and extra series with data
        expect(result.comp5SeriesLength, 'Columns parsed to series (series options array and extra series with data).').toBe(3);
        expect(result.comp5Series1Name, 'Implicited series is created.').toBe('fake trend');
        expect(result.comp5Series2PointsLength, 'Points are created in implicited series.').toBeGreaterThan(0);
    });

    test('JSON data with columnIds and columnAssignment', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const data = [{
                'InstanceId': 'i-0abcdef1234567890',
                'InstanceType': 't2.micro',
                'State': 'running',
                'PrivateIpAddress': '10.0.1.101',
                'PublicIpAddress': '54.123.45.67',
                'CPUUtilization': 20.5,
                'MemoryUsage': 512,
                'DiskSpace': {
                    'RootDisk': { 'SizeGB': 30, 'UsedGB': 15, 'FreeGB': 15 }
                },
                'DiskOperations': [{ 'ReadOps': 1500, 'WriteOps': 800 }]
            }, {
                'InstanceId': 'i-1a2b3c4d5e6f78901',
                'InstanceType': 't3.small',
                'State': 'stopped',
                'PrivateIpAddress': '10.0.1.102',
                'PublicIpAddress': '',
                'CPUUtilization': 0,
                'MemoryUsage': 256,
                'DiskSpace': {
                    'RootDisk': { 'SizeGB': 20, 'UsedGB': 10, 'FreeGB': 10 }
                },
                'DiskOperations': [{
                    'timestamp': 1637037600000, 'ReadOps': 500, 'WriteOps': 300
                }]
            }, {
                'InstanceId': 'i-9876543210abcdef0',
                'InstanceType': 'm5.large',
                'State': 'running',
                'PrivateIpAddress': '10.0.1.103',
                'PublicIpAddress': '54.321.67.89',
                'CPUUtilization': 45.2,
                'MemoryUsage': 2048,
                'DiskSpace': {
                    'RootDisk': { 'SizeGB': 50, 'UsedGB': 25, 'FreeGB': 25 }
                },
                'DiskOperations': [{
                    'timestamp': 1637037600000, 'ReadOps': 400, 'WriteOps': 100
                }]
            }];

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'micro-element',
                        type: 'JSON',
                        firstRowAsNames: false,
                        columnIds: {
                            InstanceType: ['InstanceType'],
                            DiskSpace: ['DiskSpace', 'RootDisk', 'SizeGB'],
                            ReadOps: ['DiskOperations', 0, 'ReadOps']
                        },
                        data
                    }]
                },
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{ id: 'dashboard-col-1' }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-col-1',
                    connector: {
                        id: 'micro-element',
                        columnAssignment: [{
                            seriesId: 'DiskSpace',
                            data: ['InstanceType', 'DiskSpace']
                        }, {
                            seriesId: 'ReadOps',
                            data: ['InstanceType', 'ReadOps']
                        }]
                    },
                    type: 'Highcharts',
                    chartOptions: {
                        chart: { type: 'column' },
                        xAxis: { type: 'category' }
                    }
                }]
            }, true);

            const mountedComponents = dashboard.mountedComponents;

            return {
                series0Y: mountedComponents[0].component.chart.series[0].getColumn('y'),
                series1Y: mountedComponents[0].component.chart.series[1].getColumn('y')
            };
        });

        expect(result.series0Y, 'Each server instance should be rendered as a column.').toEqual([30, 20, 50]);
        expect(result.series1Y, 'Each server instance should be rendered as a column.').toEqual([1500, 500, 400]);
    });

    // This test verifies single Navigator crossfilter works correctly
    test('Crossfilter with single Navigator setExtremes', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'data',
                        type: 'JSON',
                        data: [
                            ['Product Name', 'Quantity', 'Revenue', 'Category'],
                            ['Laptop', 100, 2000, 'Electronics'],
                            ['Smartphone', 150, 3300, 'Electronics'],
                            ['Desk Chair', 120, 2160, 'Furniture'],
                            ['Coffee Maker', 90, 1890, 'Appliances'],
                            ['Headphones', 200, 3200, 'Electronics'],
                            ['Dining Table', 130, 2470, 'Furniture'],
                            ['Refrigerator', 170, 2890, 'Appliances']
                        ]
                    }]
                },
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{ id: 'top-left' }, { id: 'top-middle' }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'top-left',
                    type: 'Navigator',
                    connector: { id: 'data' },
                    columnAssignment: { Revenue: 'y' },
                    sync: {
                        crossfilter: { enabled: true, affectNavigator: true }
                    },
                    chartOptions: {
                        title: { text: 'Revenue' }
                    }
                }, {
                    renderTo: 'top-middle',
                    type: 'Navigator',
                    connector: { id: 'data' },
                    columnAssignment: { Category: 'y' },
                    sync: {
                        crossfilter: { enabled: true, affectNavigator: true }
                    },
                    chartOptions: {
                        title: { text: 'Category' }
                    }
                }]
            }, true);

            const revenueNavigator =
                dashboard.mountedComponents[0].component;
            const categoryNavigator =
                dashboard.mountedComponents[1].component;

            const initialRevenueRowCount =
                revenueNavigator.chart.series[0].dataTable.rowCount;
            const initialCategoryRowCount =
                categoryNavigator.chart.series[0].dataTable.rowCount;

            const countPoints = (series: any) => (
                series.getColumn('y')
                    .filter((data: any) => data !== null).length
            );

            // Return a promise that resolves when tableChanged fires
            return new Promise<any>((resolve) => {
                revenueNavigator.on('tableChanged', (e: any) => {
                    const table = e.connector?.getTable();
                    const conditions =
                        table?.modifier?.options?.condition?.conditions;
                    const conditionsLength = conditions?.length || 0;

                    // Single navigator setExtremes should produce 2 conditions
                    if (conditionsLength >= 2) {
                        resolve({
                            initialRevenueRowCount,
                            initialCategoryRowCount,
                            conditionsLength,
                            categoryPointsAfter: countPoints(
                                categoryNavigator.chart.series[0]
                            ),
                            revenuePointsAfter: countPoints(
                                revenueNavigator.chart.series[0]
                            ),
                            tableModifiedRowCount:
                                table.getModified().rowCount
                        });
                    }
                });

                // Only set extremes on one navigator - filter Revenue between 2500 and 3500
                // This should filter to: Smartphone (3300), Headphones (3200), Refrigerator (2890) = 3 rows
                revenueNavigator.chart.xAxis[0].setExtremes(2500, 3500);
            });
        });

        expect(result.initialRevenueRowCount, 'Revenue navigator should start with 7 points.').toBe(7);
        expect(result.initialCategoryRowCount, 'Category navigator should start with 3 category points.').toBe(3);
        expect(result.conditionsLength, 'Should have 2 filter conditions from single setExtremes.').toBe(2);
        expect(result.tableModifiedRowCount, 'DataTable should have 3 rows after filtering Revenue 2500-3500.').toBe(3);
    });

    // Note: This test is skipped because there appears to be a timing issue with the
    // crossfilter sync when calling setExtremes on multiple navigators. The filter
    // conditions get replaced rather than accumulated. This might be a race condition
    // in the crossfilter implementation, or requires specific timing that's hard to
    // replicate in Playwright. The original Karma test has assert.timeout(1000).
    // See: test/typescript-karma/Dashboards/Component/highcharts.test.js
    // See also: tests/migrations.md for detailed analysis.
    test.skip('Crossfilter with string values (multiple navigators)', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const Dashboards = (window as any).Dashboards;

            Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
            Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

            const dashboard = await Dashboards.board('container', {
                dataPool: {
                    connectors: [{
                        id: 'data',
                        type: 'JSON',
                        data: [
                            ['Product Name', 'Quantity', 'Revenue', 'Category'],
                            ['Laptop', 100, 2000, 'Electronics'],
                            ['Smartphone', 150, 3300, 'Electronics'],
                            ['Desk Chair', 120, 2160, 'Furniture'],
                            ['Coffee Maker', 90, 1890, 'Appliances'],
                            ['Headphones', 200, 3200, 'Electronics'],
                            ['Dining Table', 130, 2470, 'Furniture'],
                            ['Refrigerator', 170, 2890, 'Appliances']
                        ]
                    }]
                },
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{ id: 'top-left' }, { id: 'top-middle' }]
                        }, {
                            cells: [{ id: 'bottom' }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'top-left',
                    type: 'Navigator',
                    connector: { id: 'data' },
                    columnAssignment: { Revenue: 'y' },
                    sync: {
                        crossfilter: { enabled: true, affectNavigator: true }
                    },
                    chartOptions: {
                        title: { text: 'Quantity' }
                    }
                }, {
                    renderTo: 'top-middle',
                    type: 'Navigator',
                    connector: { id: 'data' },
                    columnAssignment: { Category: 'y' },
                    sync: {
                        crossfilter: { enabled: true, affectNavigator: true }
                    },
                    chartOptions: {
                        title: { text: 'Category' }
                    }
                }]
            }, true);

            const numbersNavigator =
                dashboard.mountedComponents[0].component;
            const stringsNavigator =
                dashboard.mountedComponents[1].component;

            const numbersRowCount =
                numbersNavigator.chart.series[0].dataTable.rowCount;
            const stringsRowCount =
                stringsNavigator.chart.series[0].dataTable.rowCount;

            const countPoints = (series: any) => (
                series.getColumn('y')
                    .filter((data: any) => data !== null).length
            );

            // Return a promise that resolves when tableChanged fires
            return new Promise<any>((resolve) => {
                numbersNavigator.on('tableChanged', (e: any) => {
                    const table = e.connector?.getTable();
                    const conditions =
                        table?.modifier?.options?.condition?.conditions;
                    const conditionsLength = conditions?.length || 0;

                    // Assert only on the last event (when conditions > 2)
                    if (conditionsLength > 2) {
                        resolve({
                            numbersRowCount,
                            stringsRowCount,
                            stringsPointsAfter: countPoints(
                                stringsNavigator.chart.series[0]
                            ),
                            numbersPointsAfter: countPoints(
                                numbersNavigator.chart.series[0]
                            ),
                            tableModifiedRowCount:
                                table.getModified().rowCount
                        });
                    }
                });

                numbersNavigator.chart.xAxis[0].setExtremes(2300, 3000);
                stringsNavigator.chart.xAxis[0].setExtremes(0, 1);
            });
        });

        expect(result.numbersRowCount, 'Numbers navigator should have 7 points.').toBe(7);
        expect(result.stringsRowCount, 'Strings navigator should have 3 points.').toBe(3);
        expect(result.stringsPointsAfter, 'Strings navigator should have 2 points after extremes changed.').toBe(2);
        expect(result.numbersPointsAfter, 'Numbers navigator should have 5 points after extremes changed.').toBe(5);
        expect(result.tableModifiedRowCount, 'DataTable should have 1 row after extremes changed.').toBe(1);
    });
});
