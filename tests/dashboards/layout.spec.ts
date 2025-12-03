import { test, expect } from '../fixtures.ts';

// HTML setup for Dashboards with Highcharts plugin and Edit Mode
// Note: HighchartsPlugin is included in dashboards.src.js, no separate file needed
const dashboardsWithHighchartsAndEditModeHTML = `
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

test.describe('Layout Tests', () => {
    // Equivalent of test/typescript-karma/Dashboards/Layout/tests.test.js
    test('Components in layout with no row style', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsAndEditModeHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;
            const DashboardGlobals =
                Dashboards.Globals || (window as any).DashboardGlobals;

            const container = document.getElementById('container');
            container.innerHTML = 'Loading';

            const textBeforeBoard = container.innerText;

            const rows = [{
                id: 'dashboard-row-0',
                cells: [{ id: 'dashboard-col-0' }]
            }, {
                id: 'dashboard-row-1',
                cells: [{ id: 'dashboard-col-1' }]
            }];

            const layouts = [{
                id: 'layout-1',
                rows
            }];

            const components = [{
                renderTo: 'dashboard-col-0',
                type: 'Highcharts',
                chartOptions: {
                    type: 'pie',
                    series: [{ name: 'Series from options', data: [1, 2, 3, 4] }],
                    chart: { animation: false }
                }
            }, {
                renderTo: 'dashboard-col-1',
                type: 'HTML',
                elements: [{
                    tagName: 'div',
                    children: [{
                        tagName: 'h1',
                        textContent: 'Title',
                        attributes: { id: 'main-title' }
                    }, {
                        tagName: 'p',
                        textContent: 'Description',
                        attributes: { id: 'description' }
                    }]
                }]
            }];

            Dashboards.board(container.id, {
                gui: { enabled: true, layouts },
                components
            });

            const classNamePrefix = DashboardGlobals?.classNamePrefix || 'highcharts-dashboards-';
            const comps = document.querySelectorAll(
                '[class*="' + classNamePrefix + 'component"]:not([class*="-content"])'
            );

            const componentStyles: Array<{height: string, width: string}> = [];
            for (const component of comps) {
                componentStyles.push({
                    height: (component as HTMLElement).style.height,
                    width: (component as HTMLElement).style.width
                });
            }

            return {
                textBeforeBoard,
                componentStyles
            };
        });

        expect(result.textBeforeBoard, 'Text should be set before adding dashboard.').toBe('Loading');
        
        for (const style of result.componentStyles) {
            expect(style.height, 'Height should be unset').toBe('');
            expect(style.width, 'Width should be unset').toBe('');
        }
    });

    test('Components in rows with set height', async ({ page }) => {
        await page.setContent(
            dashboardsWithHighchartsAndEditModeHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;
            const DashboardGlobals =
                Dashboards.Globals || (window as any).DashboardGlobals;
            const classNamePrefix =
                DashboardGlobals?.classNamePrefix ||
                'highcharts-dashboards-';

            const layouts = [{
                id: 'layout-1',
                rows: [{
                    id: 'dashboard-row-0',
                    style: { height: '200px', padding: '5px' },
                    cells: [{ id: 'dashboard-col-0' }]
                }, {
                    id: 'dashboard-row-1',
                    cells: [{ id: 'dashboard-col-1' }]
                }]
            }];

            const components = [{
                renderTo: 'dashboard-col-0',
                type: 'Highcharts',
                chartOptions: {
                    type: 'pie',
                    series: [{ name: 'Series from options', data: [1, 2, 3, 4] }],
                    chart: { animation: false }
                }
            }, {
                renderTo: 'dashboard-col-1',
                type: 'HTML',
                elements: [{
                    tagName: 'div',
                    children: [{
                        tagName: 'h1',
                        textContent: 'Title',
                        attributes: { id: 'main-title' }
                    }]
                }]
            }];

            Dashboards.board('container', {
                gui: { enabled: true, layouts },
                components
            });

            const cells = document.querySelectorAll(
                '.' + classNamePrefix + 'cell'
            );
            type ComponentCheck = {
                heightMatches: boolean,
                widthIsEmpty: boolean
            };
            const componentChecks: Array<ComponentCheck> = [];

            for (const cell of cells) {
                const cellElement = cell as HTMLElement;
                const components = cell.querySelectorAll(
                    '[class*="' + classNamePrefix +
                    'component"]:not([class*="-content"])'
                );

                for (const component of components) {
                    const compElement = component as HTMLElement;
                    componentChecks.push({
                        heightMatches:
                            compElement.style.height ===
                            cellElement.style.height,
                        widthIsEmpty: compElement.style.width === ''
                    });
                }
            }

            return {
                cellCount: cells.length,
                componentChecks
            };
        });

        expect(result.cellCount).toBe(2);
        for (const check of result.componentChecks) {
            expect(
                check.heightMatches, 'Height should be set to the row.'
            ).toBe(true);
            expect(check.widthIsEmpty, 'Width should be unset').toBe(true);
        }
    });

    test('Components in layout with set width', async ({ page }) => {
        await page.setContent(
            dashboardsWithHighchartsAndEditModeHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;
            const DashboardGlobals =
                Dashboards.Globals || (window as any).DashboardGlobals;
            const classNamePrefix =
                DashboardGlobals?.classNamePrefix ||
                'highcharts-dashboards-';

            const layouts = [{
                id: 'layout-1',
                style: { width: '800px' },
                rows: [{
                    id: 'dashboard-row-0',
                    cells: [{ id: 'dashboard-col-0' }]
                }, {
                    id: 'dashboard-row-1',
                    cells: [{ id: 'dashboard-col-1' }]
                }]
            }];

            const components = [{
                renderTo: 'dashboard-col-0',
                type: 'Highcharts',
                chartOptions: {
                    type: 'pie',
                    series: [{ name: 'Series from options', data: [1, 2, 3, 4] }],
                    chart: { animation: false }
                }
            }, {
                renderTo: 'dashboard-col-1',
                type: 'HTML',
                elements: [{
                    tagName: 'div',
                    children: [{
                        tagName: 'h1',
                        textContent: 'Title'
                    }]
                }]
            }];

            Dashboards.board('container', {
                gui: { enabled: true, layouts },
                components
            });

            const cells = document.querySelectorAll('.' + classNamePrefix + 'cell');
            const cellWidths: string[] = [];

            for (const cell of cells) {
                cellWidths.push((cell as HTMLElement).style.width);
            }

            return {
                cellCount: cells.length,
                cellWidths
            };
        });

        expect(result.cellCount).toBe(2);
        for (const width of result.cellWidths) {
            expect(width, 'Width should be set to the cell.').toBe('800px');
        }
    });

    test('Nested layouts serialization', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsAndEditModeHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;

            const chartComponentOptions = {
                type: 'Highcharts',
                chartOptions: {
                    type: 'line',
                    series: [{ name: 'Series from options', data: [1, 2, 3, 4] }],
                    chart: { animation: false }
                }
            };

            const board = Dashboards.board('container', {
                editMode: {
                    enabled: true,
                    contextMenu: { enabled: true }
                },
                gui: {
                    layouts: [{
                        id: 'layout-in-1',
                        rows: [{
                            cells: [{
                                id: 'dashboard-col-nolayout-0'
                            }, {
                                id: 'dashboard-col-layout-0',
                                layout: {
                                    rows: [{
                                        cells: [{
                                            id: 'dashboard-col-layout-1'
                                        }, {
                                            id: 'dashboard-col-layout-4'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'dashboard-col-nolayout-0',
                    ...chartComponentOptions
                }, {
                    renderTo: 'dashboard-col-layout-1',
                    ...chartComponentOptions
                }, {
                    renderTo: 'dashboard-col-layout-4',
                    ...chartComponentOptions
                }]
            });

            const layoutToExport = board.layouts[0];
            const exportedRows = layoutToExport.rows;
            const exportedRowsLength = layoutToExport.rows.length;
            const exportedCellsLength = exportedRows[0].cells.length;
            const numberOfMountedComponents = board.mountedComponents.length;
            const serializedOptions = board.getOptions();

            const gui = serializedOptions.gui;
            return {
                exportedRowsLength,
                exportedCellsLength,
                numberOfMountedComponents,
                serializedRowsLength: gui.layouts[0].rows.length,
                serializedCellsLength: gui.layouts[0].rows[0].cells.length,
                serializedComponentsLength:
                    serializedOptions.components.length,
                hasNestedLayout:
                    gui.layouts[0].rows[0].cells[1] !== undefined
            };
        });

        expect(
            result.serializedRowsLength,
            'The imported layout has an equal number of rows as exported.'
        ).toBe(result.exportedRowsLength);
        expect(
            result.serializedCellsLength,
            'The imported layout has an equal number of cells as exported.'
        ).toBe(result.exportedCellsLength);
        expect(
            result.serializedComponentsLength,
            'Mounted components count should be the same after importing.'
        ).toBe(result.numberOfMountedComponents);
        expect(
            result.hasNestedLayout,
            'The imported cell has a nested layout.'
        ).toBe(true);
    });

    test('Reserialized cell width', async ({ page }) => {
        await page.setContent(
            dashboardsWithHighchartsAndEditModeHTML,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;

            const chartComponentOptions = {
                type: 'Highcharts',
                chartOptions: {
                    type: 'line',
                    series: [{ name: 'Series from options', data: [1, 2, 3, 4] }],
                    chart: { animation: false }
                }
            };

            const board = Dashboards.board('container', {
                editMode: {
                    enabled: true,
                    contextMenu: { enabled: true }
                },
                gui: {
                    layouts: [{
                        id: 'layout-in-1',
                        rows: [{
                            cells: [{
                                id: 'cell-1',
                                width: '1/2'
                            }, {
                                id: 'cell-2',
                                width: '1/4'
                            }, {
                                id: 'cell-3',
                                width: '1/4'
                            }]
                        }]
                    }]
                },
                components: [{
                    renderTo: 'cell-1',
                    ...chartComponentOptions
                }, {
                    renderTo: 'cell-2',
                    ...chartComponentOptions
                }, {
                    renderTo: 'cell-3',
                    ...chartComponentOptions
                }]
            });

            const widthBeforeExport = board.layouts[0].rows[0].cells.map(
                (cell: any) => cell.options.width
            );

            board.getOptions();

            const widthAfterExport = board.layouts[0].rows[0].cells.map(
                (cell: any) => cell.options.width
            );

            return {
                widthBeforeExport,
                widthAfterExport
            };
        });

        expect(result.widthBeforeExport, 'Widths of cells are the same after export/import').toEqual(result.widthAfterExport);
    });

    test('IDs of rows, cells and layouts', async ({ page }) => {
        await page.setContent(dashboardsWithLayoutHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;
            const DashboardGlobals =
                Dashboards.Globals || (window as any).DashboardGlobals;
            const classNamePrefix =
                DashboardGlobals?.classNamePrefix ||
                'highcharts-dashboards-';

            Dashboards.board('container', {
                gui: {
                    layouts: [{
                        rows: [{
                            cells: [{
                                width: '30%'
                            }]
                        }]
                    }]
                }
            });

            const layout = document.querySelectorAll('.' + classNamePrefix + 'layout')[0];
            const row = document.querySelectorAll('.' + classNamePrefix + 'row')[0];
            const cell = document.querySelectorAll('.' + classNamePrefix + 'cell')[0];

            return {
                layoutId: layout?.getAttribute('id'),
                rowId: row?.getAttribute('id'),
                cellId: cell?.getAttribute('id')
            };
        });

        expect(result.layoutId, 'Layout\'s id should not exist').toBe(null);
        expect(result.rowId, 'Row\'s id should not exist').toBe(null);
        expect(result.cellId, 'Cell\'s id should not exist').toBe(null);
    });

    test('Board destroy with custom HTML', async ({ page }) => {
        await page.setContent(dashboardsWithHighchartsAndEditModeHTML, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Dashboards = (window as any).Dashboards;

            // Prepare custom HTML for the board
            const container = document.getElementById('container');
            const chartContainer = document.createElement('div');
            chartContainer.id = 'chart-container';
            container.appendChild(chartContainer);

            const component = {
                renderTo: 'chart-container',
                type: 'Highcharts',
                chartOptions: {
                    series: [{
                        type: 'column',
                        data: [1, 2, 3]
                    }]
                }
            };

            const board = Dashboards.board('container', {
                components: [component]
            });

            const mountedComponentsBefore = board.mountedComponents.length;

            board.destroy();

            const boardKeysAfterDestroy = Object.keys(board).length;
            const chartContainerExists = !!document.getElementById('chart-container');

            // Create a new board
            const board2 = Dashboards.board('container', {
                components: [component]
            });

            const mountedComponentsAfterRecreate =
                board2.mountedComponents.length;

            return {
                mountedComponentsBefore,
                boardKeysAfterDestroy,
                chartContainerExists,
                mountedComponentsAfterRecreate
            };
        });

        expect(result.mountedComponentsBefore, 'There should be one mounted component').toBe(1);
        expect(result.boardKeysAfterDestroy, 'Board should be destroyed and empty').toBe(0);
        expect(result.chartContainerExists, 'Chart container (custom HTML) should exist').toBe(true);
        expect(result.mountedComponentsAfterRecreate, 'There should be one mounted component after recreate').toBe(1);
    });
});
