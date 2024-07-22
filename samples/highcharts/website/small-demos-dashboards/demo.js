const params = (new URL(document.location)).search;

const pArray = params.split('&');

let chartStr = '';
let chartToShow = 'minimal';

pArray.forEach(function (element) {
    if (element.indexOf('charts=') !== -1) {
        chartStr = element;
    }
});

const chartArray = chartStr.split('=');
if (chartArray.length > 1) {
    chartToShow = chartArray[1];
}

function climate() {
    const MathModifier = Dashboards.DataModifier.types.Math;
    const RangeModifier = Dashboards.DataModifier.types.Range;

    // left arrow
    Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => [
        'M', x + w / 2 - 1, y,
        'L', x + w / 2 - 1, y + h,
        x - w / 2 - 1, y + h / 2,
        'Z'
    ];
    // right arrow
    Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => [
        'M', x + w / 2 + 1, y,
        'L', x + w / 2 + 1, y + h,
        x + w + w / 2 + 1, y + h / 2,
        'Z'
    ];

    const colorStopsDays = [
        [0.0, '#C2CAEB'],
        [1.0, '#162870']
    ];
    const colorStopsTemperature = [
        [0.0, '#4CAFFE'],
        [0.3, '#53BB6C'],
        [0.5, '#DDCE16'],
        [0.6, '#DF7642'],
        [0.7, '#DD2323']
    ];

    setupBoard();

    async function setupBoard() {
        let activeCity = 'New York',
            activeTimeRange = [Date.UTC(2000, 0, 5), Date.UTC(2010, 11, 25)],
            selectionTimeout = -1;

        const activeColumn = 'TX';
        const activeScale = 'C';

        // Initialize board with most basic data
        const board = await Dashboards.board('container', {
            dataPool: {
                connectors: [{
                    id: 'Range Selection',
                    type: 'CSV'
                }, {
                    id: 'Cities',
                    type: 'CSV',
                    options: {
                        csvURL: (
                            'https://www.highcharts.com/samples/data/' +
                            'climate-cities.csv'
                        )
                    }
                }]
            },
            editMode: {
                enabled: false
            },
            gui: {
                layouts: [{
                    rows: [{
                        cells: [{
                            id: 'time-range-selector'
                        }]
                    }, {
                        cells: [{
                            id: 'world-map'
                        }]
                    }
                    ]
                }]
            },
            components: [{
                renderTo: 'time-range-selector',
                type: 'Highcharts',
                chartOptions: {
                    chart: {
                        height: '60px',
                        margin: 10,
                        spacing: 0,
                        type: 'spline'
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        enabled: false
                    },
                    series: [{
                        name: 'Timeline',
                        data: [
                            [Date.UTC(1951, 0, 5), 0],
                            [Date.UTC(2010, 11, 25), 0]
                        ],
                        marker: {
                            enabled: false
                        },
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }],
                    navigator: {
                        enabled: true,
                        handles: {
                            symbols: ['leftarrow', 'rightarrow'],
                            lineWidth: 0,
                            width: 8,
                            height: 14
                        },
                        series: [{
                            name: activeCity,
                            data: [],
                            animation: false,
                            animationLimit: 0
                        }],
                        xAxis: {
                            endOnTick: true,
                            allowOveralp: true,
                            gridZIndex: 4,
                            labels: {
                                x: 1,
                                y: 22
                            },
                            opposite: true,
                            tickPosition: 'inside'
                        },
                        yAxis: {
                            maxPadding: 0.5
                        }
                    },
                    scrollbar: {
                        enabled: true,
                        barBorderRadius: 0,
                        barBorderWidth: 0,
                        buttonBorderWidth: 0,
                        buttonBorderRadius: 0,
                        height: 14,
                        trackBorderWidth: 0,
                        trackBorderRadius: 0
                    },
                    xAxis: {
                        visible: false,
                        min: activeTimeRange[0],
                        max: activeTimeRange[1],
                        minRange: 30 * 24 * 3600 * 1000, // 30 days
                        maxRange: 2 * 365 * 24 * 3600 * 1000, // 2 years
                        events: {
                            afterSetExtremes: function (e) {
                                window.clearTimeout(selectionTimeout);
                                selectionTimeout =
                                    window.setTimeout(async () => {
                                        if (
                                            activeTimeRange[0] !== e.min ||
                                            activeTimeRange[1] !== e.max
                                        ) {
                                            activeTimeRange = [e.min, e.max];
                                            await updateBoard(
                                                board,
                                                activeCity,
                                                activeColumn,
                                                activeScale
                                            );
                                        }
                                    }, 50);
                            }
                        }
                    },
                    yAxis: {
                        visible: false
                    }
                }
            }, {
                renderTo: 'world-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    chart: {
                        map: await fetch(
                            'https://code.highcharts.com/mapdata/' +
                            'custom/world.topo.json'
                        ).then(response => response.json()),
                        styledMode: true,
                        height: 190,
                        margin: 0
                    },
                    colorAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        max: 50,
                        min: 0,
                        stops: colorStopsTemperature
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    mapNavigation: {
                        buttonOptions: {
                            verticalAlign: 'bottom',
                            height: 14,
                            width: 14,
                            x: 10
                        },
                        enabled: true,
                        enableMouseWheelZoom: false
                    },
                    mapView: {
                        maxZoom: 4
                    },
                    series: [{
                        type: 'map',
                        name: 'World Map'
                    }, {
                        type: 'mappoint',
                        name: 'Cities',
                        data: [],
                        animation: false,
                        animationLimit: 0,
                        allowPointSelect: true,
                        dataLabels: [{
                            align: 'left',
                            animation: false,
                            crop: false,
                            enabled: true,
                            format: '',
                            padding: 0,
                            verticalAlign: 'top',
                            x: -2,
                            y: 2
                        }, {
                            animation: false,
                            enabled: true,
                            crop: false,
                            allowOveralp: true,
                            format: '{point.y:.0f}',
                            inside: true,
                            padding: 0,
                            verticalAlign: 'bottom',
                            y: -12
                        }],
                        events: {
                            click: function (e) {
                                activeCity = e.point.name;
                                updateBoard(
                                    board,
                                    activeCity,
                                    activeColumn,
                                    activeScale,
                                    true
                                );
                            }
                        },
                        marker: {
                            enabled: true,
                            lineWidth: 2,
                            radius: 8,
                            states: {
                                hover: {
                                    lineWidthPlus: 4,
                                    radiusPlus: 0
                                },
                                select: {
                                    lineWidthPlus: 4,
                                    radiusPlus: 0
                                }
                            },
                            symbol: 'mapmarker'
                        },
                        tooltip: {
                            footerFormat: '',
                            headerFormat: '',
                            pointFormat: (
                                '<b>{point.name}</b><br>' +
                                'Elevation: {point.custom.elevation}m<br>' +
                                '{point.y:.1f}˚{point.custom.yScale}'
                            )
                        }
                    }],
                    title: {
                        text: void 0
                    },
                    tooltip: {
                        shape: 'rect',
                        distance: -60,
                        useHTML: true
                    }
                }
            }
            ]
        }, true);
        const dataPool = board.dataPool;
        const citiesTable = await dataPool.getConnectorTable('Cities');

        // Add city sources
        for (const row of citiesTable.getRowObjects()) {
            dataPool.setConnectorOptions({
                id: row.city,
                type: 'CSV',
                options: {
                    csvURL: row.csv
                }
            });
        }

        // Load initial city
        await setupCity(board, activeCity, activeColumn, activeScale);
        await updateBoard(board, activeCity, activeColumn, activeScale, true);

        // Load additional cities
        for (const row of citiesTable.getRowObjects()) {
            if (row.city !== activeCity) {
                await setupCity(board, row.city, activeColumn, activeScale);
            }
        }

        // Done
        console.log(board);
    }

    async function setupCity(board, city, column, scale) {
        const dataPool = board.dataPool;
        const citiesTable = await dataPool.getConnectorTable('Cities');
        const cityTable = await dataPool.getConnectorTable(city);
        const time = board.mountedComponents[0].component.chart.axes[0].min;
        const worldMap = board.mountedComponents[1].component.chart.series[1];

        column = (column[0] === 'T' ? column + scale : column);

        // Extend city table
        await cityTable.setModifier(new MathModifier({
            modifier: 'Math',
            columnFormulas: [{
                column: 'TNC',
                formula: 'E1-273.15' // E1 is the TN column with Kelvin values
            }, {
                column: 'TNF',
                formula: 'E1*1.8-459.67'
            }, {
                column: 'TXC',
                formula: 'F1-273.15' // F1 is the TX column with Kelvin values
            }, {
                column: 'TXF',
                formula: 'F1*1.8-459.67'
            }]
        }));
        cityTable.modified.setColumn(
            'Date',
            (cityTable.getColumn('time') || []).map(
                timestamp => new Date(timestamp)
                    .toISOString()
                    .substring(0, 10)
            )
        );

        const cityInfo = citiesTable.getRowObject(
            citiesTable.getRowIndexBy('city', city)
        );

        // Add city to world map
        worldMap.addPoint({
            custom: {
                elevation: cityInfo.elevation,
                yScale: scale
            },
            lat: cityInfo.lat,
            lon: cityInfo.lon,
            name: cityInfo.city,
            y: cityTable.modified.getCellAsNumber(
                column,
                cityTable.getRowIndexBy('time', time)
            ) || Math.round((90 - Math.abs(cityInfo.lat)) / 3)
        });

    }

    async function updateBoard(board, city, column, scale, newData) {
        const dataPool = board.dataPool;
        // const citiesTable = await dataPool.getConnectorTable('Cities');
        const colorMin = (column[0] !== 'T' ? 0 : (scale === 'C' ? -10 : 14));
        const colorMax = (column[0] !== 'T' ? 10 : (scale === 'C' ? 50 : 122));
        const colorStops = (
            column[0] !== 'T' ?
                colorStopsDays :
                colorStopsTemperature
        );
        const selectionTable = await dataPool.getConnectorTable(
            'Range ' +
            'Selection'
        );
        const [
            timeRangeSelector,
            worldMap
        ] = board.mountedComponents.map(c => c.component);

        column = (column[0] === 'T' ? column + scale : column);

        const cityTable = await dataPool.getConnectorTable(city);

        if (newData) {
            // Update time range selector
            timeRangeSelector.chart.series[0].update({
                type: column[0] === 'T' ? 'spline' : 'column',
                data: cityTable.modified
                    .getRows(void 0, void 0, ['time', column])
            });
        }

        // Update range selection
        selectionTable.setColumns(cityTable.modified.getColumns(), 0);
        const timeRangeMax = timeRangeSelector.chart.axes[0].max;
        const timeRangeMin = timeRangeSelector.chart.axes[0].min;
        await selectionTable.setModifier(new RangeModifier({
            modifier: 'Range',
            ranges: [{
                column: 'time',
                maxValue: timeRangeMax,
                minValue: timeRangeMin
            }]
        }));
        const rangeTable = selectionTable.modified;

        // Update world map
        worldMap.chart.update({
            colorAxis: {
                min: colorMin,
                max: colorMax,
                stops: colorStops
            }
        });
        (async () => {
            const dataPoints = worldMap.chart.series[1].data;
            const lastTime = rangeTable
                .getCellAsNumber('time', rangeTable.getRowCount() - 1);

            for (const point of dataPoints) {
                const pointTable = await dataPool.getConnectorTable(point.name);

                point.update({
                    custom: {
                        yScale: scale
                    },
                    y: pointTable.modified.getCellAsNumber(
                        column,
                        pointTable.getRowIndexBy('time', lastTime)
                    )
                });
            }
        })();


        // Update city grid selection
        // const showCelsius = scale === 'C';
        if (newData) {
            // await selectionGrid.update({
            //     dataGridOptions: {
            //         columns: {
            //             TNC: {
            //                 show: showCelsius
            //             },
            //             TNF: {
            //                 show: !showCelsius
            //             },
            //             TXC: {
            //                 show: showCelsius
            //             },
            //             TXF: {
            //                 show: !showCelsius
            //             }
            //         }
            //     },
            //     columnAssignment: {
            //         time: 'x',
            //         FD: column === 'FD' ? 'y' : null,
            //         ID: column === 'ID' ? 'y' : null,
            //         RR1: column === 'RR1' ? 'y' : null,
            //         TN: null,
            //         TNC: column === 'TNC' ? 'y' : null,
            //         TNF: column === 'TNF' ? 'y' : null,
            //         TX: null,
            //         TXC: column === 'TXC' ? 'y' : null,
            //         TXF: column === 'TXF' ? 'y' : null,
            //         Date: null
            //     }
            // });
        }

        // selectionGrid.dataGrid.scrollToRow(
        //   selectionTable.getRowIndexBy('time', rangeTable.getCell('time', 0))
        // );

        // // Update city chart selection
        // await cityChart.update({
        //     columnAssignment: {
        //         time: 'x',
        //         FD: column === 'FD' ? 'y' : null,
        //         ID: column === 'ID' ? 'y' : null,
        //         RR1: column === 'RR1' ? 'y' : null,
        //         TN: null,
        //         TNC: column === 'TNC' ? 'y' : null,
        //         TNF: column === 'TNF' ? 'y' : null,
        //         TX: null,
        //         TXC: column === 'TXC' ? 'y' : null,
        //         TXF: column === 'TXF' ? 'y' : null,
        //         Date: null
        //     },
        //     chartOptions: {
        //         chart: {
        //             type: column[0] === 'T' ? 'spline' : 'column'
        //         },
        //         colorAxis: {
        //             min: colorMin,
        //             max: colorMax,
        //             stops: colorStops
        //         }
        //     }
        // });
    }
}

function minimal() {
    const csvData = document.getElementById('csv').innerText;

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Vitamin',
                type: 'CSV',
                options: {
                    csv: csvData
                }
            }]
        },
        editMode: {
            enabled: false,
            contextMenu: {
                enabled: true
            }
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-col-1',
                        height: 130
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-col-0',
                        height: 130
                    }]
                }]
            }]
        },
        components: [{
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            connector: {
                id: 'Vitamin'
            },
            renderTo: 'dashboard-col-1',
            type: 'Highcharts',
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'value',
                Iron: null
            },
            chartOptions: {
                xAxis: {
                    type: 'category',
                    visible: true
                },
                yAxis: {
                    visible: true
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    outside: true
                },
                plotOptions: {
                    series: {
                        colorByPoint: true
                    }
                },
                chart: {
                    type: 'column',
                    height: 200,
                    width: 130,
                    margin: [10, 10, 10, 30],
                    spacing: 0
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                }
            }
        },
        {
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'Vitamin'
            },
            type: 'DataGrid',
            sync: {
                highlight: true
            }
        }]
    }, true);

}

function datacursor() {
    const DataCursor = Dashboards.DataCursor;
    const DataTable = Dashboards.DataTable;
    const cursor = new DataCursor();
    const vegeTable = buildVegeTable();

    // Create Dashboards.Board
    Dashboards.board('container', {
        gui: {
            layouts: [{
                id: 'dashboards-layout-1',
                rows: [{
                    cells: [{
                        id: 'highcharts-dashboards-cell-a0'
                    }, {
                        id: 'highcharts-dashboards-cell-b0'
                    }]
                }, {
                    cells: [{
                        id: 'highcharts-dashboards-cell-a1'
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'highcharts-dashboards-cell-a0',
                type: 'Highcharts',
                chartOptions: buildChartOptions('bar', vegeTable, cursor)
            }, {
                renderTo: 'highcharts-dashboards-cell-b0',
                type: 'Highcharts',
                chartOptions: buildChartOptions('line', vegeTable, cursor)
            }, {
                renderTo: 'highcharts-dashboards-cell-a1',
                type: 'Highcharts',
                chartOptions: buildChartOptions('pie', vegeTable, cursor)
            }
        ]
    });

    // Build chart options for each HighchartsComponent
    function buildChartOptions(type, table, cursor) {
        return {
            chart: {
                height: 130,
                events: {
                    load: function () {
                        const chart = this;
                        const series = chart.series[0];

                        // react to table cursor
                        cursor.addListener(
                            table.id,
                            'point.mouseOver', function (e) {
                                const point = series.data[e.cursor.row];

                                if (chart.hoverPoint !== point) {
                                    chart.tooltip.refresh(point);
                                }
                            });
                        cursor.addListener(
                            table.id,
                            'point.mouseOut', function () {
                                chart.tooltip.hide();
                            });
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                type,
                name: table.id,
                colorByPoint: true,
                data: table.getRowObjects(0, void 0, ['name', 'y']),
                point: {
                    events: {
                        // emit table cursor
                        mouseOver: function () {
                            cursor.emitCursor(table, {
                                type: 'position',
                                row: this.x,
                                state: 'point.mouseOver'
                            });
                        },
                        mouseOut: function () {
                            cursor.emitCursor(table, {
                                type: 'position',
                                row: this.x,
                                state: 'point.mouseOut'
                            });
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                }
            }],
            title: {
                text: '' // table.id
            },
            credits: {
                enabled: false
            },
            tooltip: {
                outside: true
            },
            xAxis: {
                visible: false,
                categories: table.getColumn('name')
            },
            yAxis: {
                visible: false,
                title: {
                    enabled: false
                }
            }
        };
    }

    // Build table with vegetables data
    function buildVegeTable() {
        const table = new DataTable({
            columns: {
                // Vegetable name
                name: [
                    'Broccoli',
                    'Carrots',
                    'Corn',
                    'Cucumbers',
                    'Onions',
                    'Potatos',
                    'Spinach',
                    'Tomatos'
                ],
                // Amount
                y: [
                    44,
                    51,
                    38,
                    45,
                    57,
                    62,
                    35,
                    61
                ]
            },
            id: 'Vegetables'
        });

        return table;
    }
}

function extremes() {
    const csv = document.getElementById('csv2').innerText;

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Population',
                type: 'CSV',
                options: {
                    csv,
                    firstRowAsNames: true
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [
                        { id: 'dashboard-col-0', height: 130 },
                        { id: 'dashboard-col-1', height: 130 }
                    ]
                }, {
                    cells: [
                        { id: 'dashboard-col-2', height: 130 },
                        { id: 'dashboard-col-3', height: 130 }
                    ]
                }]
            }]
        },
        components: [{
            title: {
                text: ''
            },
            sync: {
                extremes: true
            },
            connector: {
                id: 'Population'
            },
            renderTo: 'dashboard-col-0',
            type: 'Highcharts',
            columnAssignment: {
                Town: 'x',
                Population: 'y',
                'Metro Area(km2)': null,
                'Highest Elevation(m)': null
            },
            chartOptions: {
                xAxis: {
                    visible: false,
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                chart: {
                    type: 'column',
                    margin: [10, 10, 10, 35],
                    spacing: 0,
                    height: 130,
                    events: {
                        load: function () {
                            const el = document.getElementById('zoom1');
                            el.addEventListener('click', () => {
                                this.xAxis[0].setExtremes(10, 20);
                            });
                        }
                    },
                    zooming: {
                        type: 'x',
                        resetButton: {
                            position: {
                                align: 'center'
                            },
                            theme: {
                                zIndex: 20,
                                padding: 4
                            }
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    outside: true
                },
                plotOptions: {
                    column: {
                        pointWidth: 4,
                        colorByPoint: true
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    useHTML: true,
                    text: '<a href="#" id="zoom1">zoom</a>'
                }
            }
        },
        {
            renderTo: 'dashboard-col-1',
            title: {
                text: ''
            },
            sync: {
                extremes: true
            },
            connector: {
                id: 'Population'
            },
            type: 'Highcharts',
            columnAssignment: {
                Town: 'x',
                Population: null,
                'Metro Area(km2)': 'y',
                'Highest Elevation(m)': null
            },
            chartOptions: {
                xAxis: {
                    visible: false,
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                chart: {
                    type: 'column',
                    margin: [10, 10, 10, 35],
                    spacing: 0,
                    height: 130,
                    events: {
                        load: function () {
                            const el = document.getElementById('zoom2');
                            el.addEventListener('click', () => {
                                this.xAxis[0].setExtremes(10, 20);
                            });
                        }
                    },
                    zooming: {
                        type: 'x',
                        resetButton: {
                            position: {
                                align: 'center'
                            },
                            theme: {
                                zIndex: 20,
                                padding: 4
                            }
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    outside: true
                },
                plotOptions: {
                    column: {
                        pointWidth: 4,
                        colorByPoint: true
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    useHTML: true,
                    text: '<a href="#" id="zoom2">zoom</a>'
                }
            }
        },
        {
            renderTo: 'dashboard-col-2',
            connector: {
                id: 'Population'
            },
            title: {
                text: ''
            },
            sync: {
                extremes: true
            },
            type: 'Highcharts',
            columnAssignment: {
                Town: 'x',
                Population: null,
                'Metro Area(km2)': null,
                'Highest Elevation(m)': 'y'
            }
        },
        {
            renderTo: 'dashboard-col-3',
            connector: {
                id: 'Population'
            },
            type: 'DataGrid',
            sync: {
                extremes: true
            }
        }]
    }, true);
}

const charts = {
    climate: climate,
    minimal: minimal,
    datacursor: datacursor,
    extremes: extremes
};


charts[chartToShow]();
