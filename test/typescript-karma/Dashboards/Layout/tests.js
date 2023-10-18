import DashboardGlobals from '/base/code/dashboards/es-modules/Dashboards/Globals.js';
const { test, skip } = QUnit;

function setupContainer() {
    const container = document.createElement('div');
    container.id = 'test-container';

    //append the container container, which gets cleaned up after each test
    document.getElementById('container').appendChild(container);
    return container;
}

const rows = [{
    id: 'dashboard-row-0',
    cells: [{
        id: 'dashboard-col-0',
    }]
}, {
    id: 'dashboard-row-1',
    cells: [{
        id: 'dashboard-col-1'
    }]
}]

const layouts = [{
    id: 'layout-1', // mandatory
    rows
}]

const components = [{
    cell: 'dashboard-col-0',
    type: 'Highcharts',
    chartOptions: {
        type: 'pie',
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }],
        chart: {
            animation: false
        }
    }
}, {
    cell: 'dashboard-col-1',
    type: 'HTML',
    elements: [{
        tagName: 'img',
        attributes: {
            src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
            title: 'I heard you like components'
        }
    }, {
        textContent: 'Lorem ipsum'
    }]
}]

test('Components in layout with no row style', function (assert) {
    const container = setupContainer();
    container.innerHTML = 'Loading';

    assert.strictEqual(
        container.innerText,
        'Loading',
        'Text should be set before adding dashboard.'
    );

    const board = Dashboards.board(container.id, {
        gui: {
            enabled: true,
            layouts
        },
        components
    });

    const comps = document.querySelectorAll(
        '[class*="' + DashboardGlobals.classNamePrefix + 'component"]:not([class*="-content"])'
    );
    for (const component of comps) {
        assert.strictEqual(component.style.height, '', 'Height should be unset');
        assert.strictEqual(component.style.width, '', 'Width should be unset');
    }
});

test('Components in rows with set height', function (assert) {
    const container = setupContainer();

    layouts[0].rows[0].style = {
        height: '200px',
        padding: '5px'
    }

    const board = Dashboards.board(container.id, {
        gui: {
            enabled: true,
            layouts
        },
        components
    });

    const columns = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'cell')
    assert.strictEqual(columns.length, 2)
    for (const column of columns) {
        const components = column.querySelectorAll(
            '[class*="' + DashboardGlobals.classNamePrefix + 'component"]:not([class*="-content"])'
        );

        for (const component of components) {
            assert.strictEqual(
                component.style.height,
                column.style.height,
                'Height should be set to the row.'
            );
            assert.strictEqual(
                component.style.width,
                '',
                'Width should be unset'
            );
        }
    }

    layouts[0].rows[0].style = {}
});

skip('Components in layout with set width', function (assert) {
    const container = setupContainer();

    layouts[0].style = {
        width: '800px'
    }

    const board = Dashboards.board(container.id, {
        gui: {
            enabled: true,
            layouts
        },
        components
    });

    const columns = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'cell')
    assert.strictEqual(columns.length, 2)
    for (const column of columns) {
        const components = column.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'component');
        assert.strictEqual(column.style.width, '800px');
        for (const component of components) {
            assert.strictEqual(component.style.height, '', 'Height should be unset')
            assert.strictEqual(component.element.getBoundingClientRect(), column.style.width, 'Width should be set to the column')
        }
    }

    layouts[0].style = {}
});

test('Components and rows in layout with set height', function (assert) {
    const container = setupContainer();

    layouts[0].style = {
        height: '800px'
    }

    const board = Dashboards.board(container.id, {
        gui: {
            enabled: true,
            layouts
        },
        components
    });

    const rows = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'row')
    assert.strictEqual(rows.length, 2)

    // This is on the todo list :)
    // for (const row of rows) {
    //     assert.strictEqual(window.getComputedStyle(row).height, '400px')
    // }

    // const columns = document.querySelectorAll('.highcharts-dashboards-column')
    // assert.strictEqual(columns.length, 2)
    // for (const column of columns) {
    //     const components = column.querySelectorAll('.highcharts-dashboards-component');
    //     assert.strictEqual(column.style.width, '800px');
    //     for (const component of components) {
    //         assert.strictEqual(component.style.height, '', 'Height should be unset')
    //         assert.strictEqual(component.style.width, column.style.width, 'Width should be set to the column')
    //     }
    // }

    layouts[0].style = {}
});

test('Nested layouts serialization.', function (assert) {
    const container = setupContainer();

    const chartComponentOptions = {
        type: 'Highcharts',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        }
    };
        const board = Dashboards.board(container.id, {
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                items: ['editMode']
            }
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
                                    id: 'dashboard-col-layout-1',
                                }, {
                                    id: 'dashboard-col-layout-4',
                                }]
                            }]
                        }
                    }]
                }]
            }]
        },
        components: [{
            cell: 'dashboard-col-nolayout-0',
            ...chartComponentOptions
        }, {
            cell: 'dashboard-col-layout-1',
            ...chartComponentOptions
        }, {
            cell: 'dashboard-col-layout-4',
            ...chartComponentOptions
        }]

    });
    const layoutToExport = board.layouts[0];
    const exportedLayoutId = layoutToExport.options.id;
    const exportedRows = layoutToExport.rows;
    const exportedRowsLength = layoutToExport.rows.length;
    const exportedCellsLength = exportedRows[0].cells.length;
    const numberOfMountedComponents = board.mountedComponents.length;
    layoutToExport.exportLocal();
    layoutToExport.destroy();
    const importedLayout = board.importLayoutLocal(exportedLayoutId);


    assert.equal(importedLayout.rows.length, exportedRowsLength, 'The imported layout has an equal number of rows as exported one.')
    assert.equal(importedLayout.rows[0].cells.length, exportedCellsLength, 'The imported layout has an equal number of cells as exported one.')
    assert.equal(numberOfMountedComponents, importedLayout.board.mountedComponents.length, 'The number of mounted components should be the same after importing the layout.')
    assert.true(importedLayout.rows[0].cells[1] !== undefined, 'The imported cell has a nested layout.')
});

test('Reserialized cell width', function (assert) {
    const container = setupContainer();
    const chartComponentOptions = {
        type: 'Highcharts',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        }
    };
    const board = Dashboards.board(container.id, {
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                items: ['editMode']
            }
        },
        gui: {
            layouts: [
                {
                    id: 'layout-in-1',
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'cell-1',
                                    width: '1/2'
                                },
                                {
                                    id: 'cell-2',
                                    width: '1/4'
                                },
                                {
                                    id: 'cell-3',
                                    width: '1/4'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'cell-1',
                ...chartComponentOptions
            },
            {
                cell: 'cell-2',
                ...chartComponentOptions
            },
            {
                cell: 'cell-3',
                ...chartComponentOptions
            }
        ]
    });

    const layoutToExport = board.layouts[0];
    const exportedLayoutId = layoutToExport.options.id;
    const widthBeforeExport = board.layouts[0].rows[0].cells.map(
        (cell) => cell.options.width
    );

    layoutToExport.exportLocal();
    layoutToExport.destroy();
    board.importLayoutLocal(exportedLayoutId);

    const widthAfterExport = board.layouts[0].rows[0].cells.map(
        (cell) => cell.options.width
    );

    assert.deepEqual(
        widthBeforeExport,
        widthAfterExport,
        'Widths of cells are the same after export/import'
    );

});

test('IDs of rows, cells and layouts', function (assert) {
    const container = setupContainer();
    const board = Dashboards.board(container.id, {
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

    const layout = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'layout')[0];
    const row = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'row')[0];
    const cell = document.querySelectorAll('.' + DashboardGlobals.classNamePrefix + 'cell')[0];

    assert.strictEqual(layout.getAttribute('id'), null, 'Layout\'s id should not exist');
    assert.strictEqual(cell.getAttribute('id'), null, 'Cell\'s id should not exist');
    assert.strictEqual(row.getAttribute('id'), null, 'Row\'s id should not exist');
})
