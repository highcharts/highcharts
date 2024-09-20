//@ts-check
import Highcharts from '../../../../code/es-modules/masters/highstock.src.js';
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

const { test, skip } = QUnit;

const registeredEvents = [];
const eventTypes = [
    'load',
    'afterLoad',
    'render',
    'afterRender',
    'tableChanged',
    'setConnectors',
    'afterSetConnectors',
    'update',
    'afterUpdate'
];

function registerEvent(e) {
    registeredEvents.push(e.type);
}

function emptyArray(array) {
    array.length = 0;
}

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
                renderTo: 'cell-1',
                type: 'Highcharts',
                chartOptions: {
                    title: {
                        text: void 0,
                        style: {}
                    }
                }
            },
            {
                renderTo: 'cell-2',
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
        // @ts-ignore
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
                }, {
                    id: 'connector-2',
                    type: 'CSV',
                    options: {
                        csv: '4,5,6',
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
                renderTo: 'cell-1',
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
        connector: {
            id: 'connector-2'
        },
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
            'setConnectors',
            'afterSetConnectors',
            'afterUpdate',
            'render',
            'afterRender',
        ],
        'If connector is given in options, it will be attached during load'
    );

    emptyArray(registeredEvents);
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
            renderTo: 'dashboard-cell',
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
            width: '',
            height: ''
        },
        'Should be able to update just the width'
    );

    component.resize(undefined, 300);

    assert.ok(
        component.element.style.width === '' && component.element.style.height !== '',
        'Should be able to update just the height. Width should stay the same.'
    );

    component.destroy();

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
                }],
            },
            chartOptions: {
                yAxis: [{}, {
                    opposite: true
                }],
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
                }],
            },
            chartOptions: {
                yAxis: [{}, {
                    opposite: true
                }],
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
                }],
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

    // basic column assignment
    assert.ok(
        // @ts-ignore
        mountedComponents[0].component.chart.series.length === 2,
        'Columns parsed to series by the basic column assignment.'
    );

    // columnAssigment merged with the same series options array
    assert.ok(
        // @ts-ignore
        mountedComponents[1].component.chart.series.length === 2,
        'Columns parsed to existing series.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[1].component.chart.series[0].yAxis.index === 0,
        'First series is assigned to basic yAxis.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[1].component.chart.series[1].yAxis.index === 1,
        'First series is assigned to opposite yAxis.'
    );

    // columnAssigment merged with shorter series options array
    assert.ok(
        // @ts-ignore
        mountedComponents[2].component.chart.series.length === 2,
        'Columns parsed to series with shorter series options array.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[2].component.chart.series[0].yAxis.index === 1,
        'First series is assigned to basic yAxis.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[2].component.chart.series[1].yAxis.index === 0,
        'First series is assigned to opposite yAxis.'
    );

    // columnAssigment and seriesColumnMap (mapping columns into point props)
    // OHLC
    assert.ok(
        // @ts-ignore
        mountedComponents[3].component.chart.series.length === 3,
        'Columns parsed to series (OHLC).'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[3].component.chart.series[2].type === 'ohlc',
        'OHLC series is initialized.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[3].component.chart.series[2].points.length > 0,
        'OHLC points are created.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[3].component.chart.series[2].processedYData[0].length > 0,
        'OHLC point is an array of open/low/high/close'
    );

    // Candlestick
    assert.ok(
        // @ts-ignore
        mountedComponents[4].component.chart.series.length === 3,
        'Columns parsed to series (Candlestick).'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[4].component.chart.series[2].type === 'candlestick',
        'Candlestick series is initialized.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[4].component.chart.series[2].points.length > 0,
        'Candlestick points are created.'
    );

    // columnAssigment, series options array and extra series with data
    assert.ok(
        // @ts-ignore
        mountedComponents[5].component.chart.series.length === 3,
        'Columns parsed to series (series options array and extra series with data).'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[5].component.chart.series[1].name === 'fake trend',
        'Implicited series is created.'
    );

    assert.ok(
        // @ts-ignore
        mountedComponents[5].component.chart.series[2].points.length > 0,
        'Points are created in implicited series.'
    );

});


test('JSON data with columnNames and columnAssignment.', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const data = [{
        "InstanceId": "i-0abcdef1234567890",
        "InstanceType": "t2.micro",
        "State": "running",
        "PrivateIpAddress": "10.0.1.101",
        "PublicIpAddress": "54.123.45.67",
        "CPUUtilization": 20.5,
        "MemoryUsage": 512,
        "DiskSpace": {
          "RootDisk": {
            "SizeGB": 30,
            "UsedGB": 15,
            "FreeGB": 15
          },
        },
        "DiskOperations": [{
          "ReadOps": 1500,
          "WriteOps": 800
        }],
      },
      {
        "InstanceId": "i-1a2b3c4d5e6f78901",
        "InstanceType": "t3.small",
        "State": "stopped",
        "PrivateIpAddress": "10.0.1.102",
        "PublicIpAddress": "",
        "CPUUtilization": 0,
        "MemoryUsage": 256,
        "DiskSpace": {
          "RootDisk": {
            "SizeGB": 20,
            "UsedGB": 10,
            "FreeGB": 10
          }
        },
        "DiskOperations": [{
          "timestamp": 1637037600000,
          "ReadOps": 500,
          "WriteOps": 300
        }],
      },
      {
        "InstanceId": "i-9876543210abcdef0",
        "InstanceType": "m5.large",
        "State": "running",
        "PrivateIpAddress": "10.0.1.103",
        "PublicIpAddress": "54.321.67.89",
        "CPUUtilization": 45.2,
        "MemoryUsage": 2048,
        "DiskSpace": {
          "RootDisk": {
            "SizeGB": 50,
            "UsedGB": 25,
            "FreeGB": 25
          },
        },
        "DiskOperations": [{
          "timestamp": 1637037600000,
          "ReadOps": 400,
          "WriteOps": 100
        }],
      }
    ];

    const dashboard = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: {
                    InstanceType: ['InstanceType'],
                    DiskSpace: ['DiskSpace', 'RootDisk', 'SizeGB'],
                    ReadOps: ['DiskOperations', 0, 'ReadOps']
                },
                // @ts-ignore
                data
            }
            }]
        },
        gui: {
            layouts: [{
            rows: [{
                cells: [{
                id: 'dashboard-col-1',
                }]
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
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'category'
                }
            },
        }]
        }, true);

    const mountedComponents = dashboard.mountedComponents;

    assert.deepEqual(
        // @ts-ignore
        mountedComponents[0].component.chart.series[0].yData,
        [30, 20, 50],
        'Each server instance should be rendered as a column.'
    );

    assert.deepEqual(
        // @ts-ignore
        mountedComponents[0].component.chart.series[1].yData,
        [1500, 500, 400],
        'Each server instance should be rendered as a column.'
    );

});

test('Crossfilter with string values', async function (assert) {
    assert.timeout(1000);

    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dashboard = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'data',
                type: 'JSON',
                options: {
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
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'top-left'
                    }, {
                        id: 'top-middle'
                    }]
                }, {
                    cells: [{
                        id: 'bottom'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'top-left',
            type: 'Navigator',
            connector: {
                id: 'data'
            },
            columnAssignment: {
                Revenue: 'y'
            },
            sync: {
                crossfilter: {
                    enabled: true,
                    affectNavigator: true
                }
            },
            chartOptions: {
                title: {
                    text: 'Quantity'
                }
            }
        }, {
            renderTo: 'top-middle',
            type: 'Navigator',
            connector: {
                id: 'data'
            },
            columnAssignment: {
                Category: 'y'
            },
            sync: {
                crossfilter: {
                    enabled: true,
                    affectNavigator: true
                }
            },
            chartOptions: {
                title: {
                    text: 'Category'
                }
            }
        }]
    }, true);

    const numbersNavigator = dashboard.mountedComponents[0].component;
    const stringsNavigator = dashboard.mountedComponents[1].component;

    assert.ok(
        numbersNavigator.chart.series[0].yData.length === 7,
        'Numbers navigator should have 7 points.'
    );

    assert.ok(
        stringsNavigator.chart.series[0].yData.length === 3,
        'Strings navigator should have 3 points.'
    );

    const countPoints = (series) => (
        series.yData.filter(data => data !== null).length
    );

    const done = assert.async();
    numbersNavigator.on('tableChanged', e => {
        const table = e.connector.table;

        // Assert only on the last event
        if (table?.modifier?.options?.ranges?.length > 1) {

            assert.equal(
                countPoints(stringsNavigator.chart.series[0]),
                2,
                'Strings navigator should have 2 points after extremes changed.'
            );

            assert.equal(
                countPoints(numbersNavigator.chart.series[0]),
                5,
                'Numbers navigator should have 2 points after extremes changed.'
            );

            assert.equal(
                table.modified.rowCount,
                1,
                'DataTable should have 2 rows after extremes changed.'
            );

            done();
        }
    });

    numbersNavigator.chart.xAxis[0].setExtremes(2300, 3000);
    stringsNavigator.chart.xAxis[0].setExtremes(0, 1);
});
