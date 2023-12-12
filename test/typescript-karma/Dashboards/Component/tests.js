//@ts-check
import Highcharts from '../../../../code/es-modules/masters/highstock.src.js';
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/dashboards/es-modules/masters/datagrid.src.js';
import DashboardsPlugin from '../../../../code/dashboards/es-modules/masters/modules/dashboards-plugin.src.js';

DashboardsPlugin.HighchartsPlugin.custom.connectHighcharts(Highcharts);
DashboardsPlugin.DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);

DashboardsPlugin.PluginHandler.addPlugin(DashboardsPlugin.HighchartsPlugin);
DashboardsPlugin.PluginHandler.addPlugin(DashboardsPlugin.DataGridPlugin);


const { test, only, skip } = QUnit;

const Component = Dashboards.Component;
const CSVConnector = Dashboards.DataConnector.types.CSV;
const HighchartsComponent = Dashboards.ComponentRegistry.types.Highcharts;

const eventTypes = [
    'load',
    'afterLoad',
    'render',
    'afterRender',
    'tableChanged',
    'setConnector',
    'update',
    'afterUpdate'
];

const registeredEvents = [];

function registerEvent(e) {
    registeredEvents.push(e.type);
}

function emptyArray(array) {
    array.length = 0;
}
/** @param {HighchartsComponent | HTMLComponent} component */
function registerEvents(component) {
    eventTypes.forEach((eventType) => component.on(eventType, registerEvent));
}

test('Board without data connectors and HighchartsComponent update', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = await Dashboards.board(parentElement, {
        gui: {
            enabled: true,
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'cell-1'
                                },
                                {
                                    id: 'cell-2'
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
                type: 'Highcharts',
                chartOptions: {
                    title: {
                        text: void 0,
                        style: {}
                    }
                }
            },
            {
                cell: 'cell-2',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'h1',
                        textContent: 'Some text'
                    }
                ]
            }
        ]
    }, true);
    // Test the HighchartsComponent
    const highchartsComponent = board.mountedComponents[0].component;

    registerEvents(highchartsComponent);
    await highchartsComponent.update({
        chartOptions: {
            title: {
                text: 'Hello World',
                style: {}
            }
        }
    });

    assert.deepEqual(
        registeredEvents,
        ['update',  'afterUpdate', 'render', 'afterRender'],
        'After updating the HighchartsComponent events should be fired in the correct order.'
    );

    emptyArray(registeredEvents);

    assert.strictEqual(
        highchartsComponent.options.chartOptions.title.text,
        'Hello World',
        'HighchartsComponent should have updated title'
    );

    // Test the HTMLComponent
    const htmlComponent = board.mountedComponents[1].component;

    registerEvents(htmlComponent);
    htmlComponent.update({
        elements: [
            {
                tagName: 'h1',
                textContent: 'Hello World'
            }
        ]
    });

    assert.deepEqual(
        registeredEvents,
        [
            'update',
            'render',
            'afterRender'
        ],
        'After updating HTMLComponent, the events should be fired in the correct order.'
    );

    // @TODO test update with the redraw flag set to false !!!!!!!!!!!!!!!!!!!
    // component.update({
    //     chartOptions: {
    //         title: {
    //             text: 'This should fire a redraw'
    //         }
    //     },
    //     false
    // });

    // expectedEvents.push(
    //       "update",
    //       "redraw",
    //       "render",
    //       "load",
    //       "afterLoad",
    //       "afterRender",
    //       "update",
    //       "afterUpdate"

    // );
    // assert.deepEqual(registeredEvents, expectedEvents, 'events after forced update');

    emptyArray(registeredEvents);
});

test('Board with data connectors and HighchartsComponent update', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = await Dashboards.board(parentElement, {
        dataPool: {
            connectors: [
                {
                    id: 'connector-1',
                    type: 'CSV',
                    options: {
                        csv: '1,2,3',
                        firstRowAsNames: false
                    }
                }
            ]
        },
        gui: {
            enabled: true,
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'cell-1'
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
                type: 'Highcharts',
                connector: {
                    id: 'connector-1'
                },
                chartOptions: {
                    title: {
                        text: void 0,
                        style: {}
                    }
                }
            }
        ]
    }, true);
    const componentWithConnector = board.mountedComponents[0].component;

    emptyArray(registeredEvents);
    registerEvents(componentWithConnector);
    await componentWithConnector.update({
        chartOptions: {
            title: {
                text: 'Hello World',
                style: {}
            }
        }
    });

    assert.deepEqual(
        registeredEvents,
        [
            'update',
            'setConnector',
            'afterUpdate',
            'render',
            'afterRender',
        ],
        'If connector is given in options, it will be attached during load'
    );

    emptyArray(registeredEvents);

    // // Message
    // expectedEvents.push('message');

    // // This should fire a 'message' event to all the other components
    // // We should expect N - 1 'message' events (in this case 1)

    // componentWithConnector.postMessage('hello');

    // assert.deepEqual(registeredEvents, expectedEvents);

    // // This should bounce a message back and forth
    // componentWithConnector.postMessage({
    //     callback: function () {
    //         this.postMessage('hello');
    //     }
    // });

    // expectedEvents.push('message', 'message');

    // assert.deepEqual(registeredEvents, expectedEvents);
});

test('component resizing', function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = Dashboards.board(parentElement, {
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
            cell: 'dashboard-cell'
        }]
    });

    const component = board.mountedComponents[0].component;

    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '',
            height: ''
        },
        'Component with no dimensional options should have no internal styles set'
    );

    component.resize(200);
    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '200px',
            height: ''
        },
        'Should be able to update just the width'
    );

    component.resize(undefined, 300);

    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '200px',
            height: '300px'
        },
        'Should be able to update just the height. Width should stay the same.'
    );

    component.destroy();

    // parentElement.style.width = '1000px';
    // parentElement.style.height = '200px';
    // component.resize('100%', '100%');
    // assert.deepEqual(
    //     {
    //         width: component.element.style.width,
    //         height: component.element.style.height
    //     },
    //     {
    //         width: 1000,
    //         height: 200
    //     },
    //     'Should be able to update just the height'
    // );

    // const widthComponent = new HTMLComponent({
    //     dimensions: {
    //         width: '100'
    //     }
    // }).render();
    // assert.strictEqual(widthComponent.dimensions.width, 100)
    // assert.strictEqual(widthComponent.dimensions.height, null)

    // widthComponent.destroy()

    //  const heightComponent = new HTMLComponent({
    //      dimensions: {
    //          height: '100'
    //      }
    //  }).render();
    //  assert.strictEqual(heightComponent.dimensions.width, null)
    //  assert.strictEqual(heightComponent.dimensions.height, 100)
    //
    //  heightComponent.destroy()
    //
    //  const emptyDimensions = new HTMLComponent({
    //      dimensions: {}
    // }).render();
    //  assert.strictEqual(emptyDimensions.dimensions.width, null)
    //  assert.strictEqual(emptyDimensions.element.style.height, "")
    //
    //  emptyDimensions.destroy();
    //
    //  const percentageDimensions = new HTMLComponent({
    //      parentElement: parent,
    //      dimensions: {
    //          width: '50%',
    //          height: '50%'
    //      }
    //  }).render();
    //
    //  let rect = percentageDimensions.element.getBoundingClientRect()
    //  assert.strictEqual(rect.width, parent.scrollWidth / 2)
    //  assert.strictEqual(rect.height, parent.scrollHeight / 2 )
    //
    //
    // // With padding
    // percentageDimensions.element.style.padding = '5px';
    // percentageDimensions.resize('50%', '50%')
    //
    // rect = percentageDimensions.element.getBoundingClientRect()
    // assert.strictEqual(rect.width, parent.scrollWidth / 2)
    // assert.strictEqual(rect.height, parent.scrollHeight / 2)
    //
    // percentageDimensions.destroy();
});

test('HighchartsComponent resizing', function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    parentElement.style.width = '500px';

    const board = Dashboards.board(parentElement, {
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
            cell: 'dashboard-cell',
            chartOptions: {
                series: [{
                    data: [1, 2, 3]
                }]
            }
        }]
    });

    const component = board.mountedComponents[0].component;
    component.resize(200);

    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '200px',
            height: ''
        },
        'Should be able to update just the width'
    );

    component.resize(undefined, 300);

    assert.deepEqual(
        {
            height: component.element.style.height
        },
        {
            height: '300px'
        },
        'Should be able to update just the height. Width should stay the same.'
    );

    component.destroy();

});

skip('toJSON', function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const connector = new CSVConnector();
    const component = new HighchartsComponent(void 0, {
        connector,
        parentElement: container,
        chartOptions: {
            chart: {},
            series: [
                {
                    data: [1, 2, 3, 5, 15, 1, 5, 15, 1]
                }
            ]
        }
    });

    component.render();
    const json = component.toJSON();
    const clone = HighchartsComponent.fromJSON(json);
    clone.render();

    assert.deepEqual(json, clone.toJSON());
});

test('DataGrid component with dataTable', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const { DataTable } = Dashboards;

    const columns = {
        product: ['Apples', 'Pears', 'Plums', 'Bananas'],
        weight: [100, 40, 0.5, 200],
        price: [1.5, 2.53, 5, 4.5],
        metaData: ['a', 'b', 'c', 'd']
    };

    const dashboard = await Dashboards.board('container', {
        gui: {
            layouts: [
                {
                    id: 'layout-1',
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-1'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'dashboard-col-1',
                type: 'DataGrid',
                dataGridOptions: {
                    dataTable: new DataTable({
                        columns
                    })
                }
            }
        ]
    }, true);

    assert.ok(
        dashboard.mountedComponents[0].component.dataGrid.dataTable.columns.product,
        'DataGrid component should have a dataTable with columns.'
    );
});

test('KPI Component updating', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';
    
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
            cell: 'dashboard-cell-1',
            type: 'KPI',
            title: 'Value',
            value: 1
        }]
    }, true),
        kpi = dashboard.mountedComponents[0].component;

    assert.notOk(kpi.chart, 'KPI Component should be loaded without a chart.');

    kpi.update({
        value: 2,
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    });

    assert.ok(kpi.chart, 'KPI Component should have a chart after update.');
});

test('Data columnAssignment', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dashboard = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'EUR-USD',
                type: 'JSON',
                options: {
                data: [
                    ['Day', 'EUR', 'Rate'],
                    [1691971200000, 11, 1.0930],
                    [1692057600000, 23, 1.0926],
                    [1692144000000, 15, 1.0916]
                ]
                }
            }, {
                id: 'micro-element',
                type: 'JSON',
                options: {
                firstRowAsNames: false,
                columnNames: ['x', 'myOpen', 'myHigh', 'myLow', 'myClose', 'mySeries1', 'mySeries2'],
                data: [
                    [1699434920314, 6, 5, 4, 1, 6, 9],
                    [1699494920314, 2, 6, 2, 5, 7, 9],
                    [1699534920314, 1, 9, 5, 3, 8, 8]
                ]
                }
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'dashboard-col-0'
                    }, {
                        id: 'dashboard-col-1'
                    }, {
                        id: 'dashboard-col-2'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-col-3'
                    }, {
                        id: 'dashboard-col-4'
                    }, {
                        id: 'dashboard-col-5'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'dashboard-col-0',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD'
            },
            columnAssignment: {
                Day: 'x',
                EUR: 'custom.eur',
                Rate: 'y'
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD'
            },
            columnAssignment: {
                Day: 'x',
                EUR: 'custom.eur',
                Rate: 'y'
            },
            chartOptions: {
                yAxis: [{}, {
                    opposite: true
                }],
                series: [{
                    name: 'EUR'
                }, {
                    name: 'Rate',
                    yAxis: 1
                }]
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD'
            },
            columnAssignment: {
                Day: 'x',
                EUR: 'custom.eur',
                Rate: 'y'
            },
            chartOptions: {
                yAxis: [{}, {
                    opposite: true
                }],
                series: [{
                    name: 'EUR',
                    yAxis: 1
                }]
            }
        }, {
            cell: 'dashboard-col-3',
            type: 'Highcharts',
            connector: {
                id: 'micro-element'
            },
            columnAssignment: {
                'x': 'x',
                'mySeries1': 'value',
                'mySeries2': 'value',
                'mySeriesName': {
                    'open': 'myOpen',
                    'high': 'myHigh',
                    'low': 'myLow',
                    'close': 'myClose'
                }
            },
            chartOptions: {
                series: [{
                    name: 'mySeries1',
                    type: 'spline'
                }, {
                    name: 'mySeries2',
                    type: 'line'
                }, {
                    name: 'mySeriesName',
                    type: 'ohlc'
                }]
            }
        }, {
            cell: 'dashboard-col-4',
            type: 'Highcharts',
            connector: {
                id: 'micro-element'
            },
            columnAssignment: {
                'x': 'x',
                'mySeries1': 'value',
                'mySeries2': 'value',
                'mySeriesName': {
                    'open': 'myOpen',
                    'high': 'myHigh',
                    'low': 'myLow',
                    'close': 'myClose'
                }
            },
            chartOptions: {
                series: [{
                    name: 'mySeries1',
                    type: 'spline'
                }, {
                    name: 'mySeries2',
                    type: 'line'
                }, {
                    name: 'mySeriesName',
                    type: 'candlestick'
                }]
            }
        }, {
            cell: 'dashboard-col-5',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD'
            },
            columnAssignment: {
                Day: 'x',
                EUR: 'custom.eur',
                Rate: 'y'
            },
            chartOptions: {
                yAxis: [{
                    title: {
                        text: 'EUR / USD'
                    }
                }, {
                    title: {
                        text: 'Rate'
                    },
                    opposite: true
                }],
                series: [{
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

    // basic column assignment
    assert.ok(
        mountedComponents[0].component.chart.series.length === 2,
        'Columns parsed to series.'
    );

    // columnAssigment merged with the same series options array
    assert.ok(
        mountedComponents[1].component.chart.series.length === 2,
        'Columns parsed to series.'
    );

    assert.ok(
        mountedComponents[1].component.chart.series[0].yAxis.index === 0,
        'First series is assigned to basic yAxis.'
    );

    assert.ok(
        mountedComponents[1].component.chart.series[1].yAxis.index === 1,
        'First series is assigned to opposite yAxis.'
    );

    // columnAssigment merged with shorter series options array
    assert.ok(
        mountedComponents[2].component.chart.series.length === 2,
        'Columns parsed to series.'
    );

    assert.ok(
        mountedComponents[2].component.chart.series[0].yAxis.index === 1,
        'First series is assigned to basic yAxis.'
    );

    assert.ok(
        mountedComponents[2].component.chart.series[1].yAxis.index === 0,
        'First series is assigned to opposite yAxis.'
    );

    // columnAssigment and seriesColumnMap (mapping columns into point props)
    // OHLC
    assert.ok(
        mountedComponents[3].component.chart.series.length === 3,
        'Columns parsed to series.'
    );

    assert.ok(
        mountedComponents[3].component.chart.series[2].type === 'ohlc',
        'OHLC series is initialized.'
    );

    assert.ok(
        mountedComponents[3].component.chart.series[2].points.length > 0,
        'OHLC points are created.'
    );

    assert.ok(
        mountedComponents[3].component.chart.series[2].processedYData[0].length > 0,
        'OHLC point is an array of open/low/high/close'
    );

    // Candlestick
    assert.ok(
        mountedComponents[4].component.chart.series.length === 3,
        'Columns parsed to series.'
    );

    assert.ok(
        mountedComponents[4].component.chart.series[2].type === 'candlestick',
        'Candlestick series is initialized.'
    );

    assert.ok(
        mountedComponents[4].component.chart.series[2].points.length > 0,
        'Candlestick points are created.'
    );

    // columnAssigment, series options array and extra series with data
    assert.ok(
        mountedComponents[5].component.chart.series.length === 3,
        'Columns parsed to series.'
    );

    assert.ok(
        mountedComponents[5].component.chart.series[1].name === 'fake trend',
        'Implicited series is created.'
    );

    assert.ok(
        mountedComponents[5].component.chart.series[2].points.length > 0,
        'Points are created in implicited series.'
    );

});