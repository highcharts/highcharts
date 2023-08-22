/* eslint-disable prefer-const, jsdoc/require-description */

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

const MathModifier = Dashboards.DataModifier.types.Math;

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
        activeColumn = 'TX',
        activeScale = 'C',
        activeTimeRange = [Date.UTC(2010, 0, 5), Date.UTC(2010, 11, 25)],
        selectionTimeout = -1;

    // Initialize board with most basic data
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Range Selection',
                type: 'CSV',
                options: {
                    dataModifier: {
                        type: 'Range'
                    }
                }
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
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboards-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'dark-mode',
                        type: 'toggle',
                        text: 'Dark mode',
                        events: {
                            click: function () {
                                this.menu.editMode.board.container
                                    .classList.toggle('highcharts-dark');
                            }
                        }
                    }, {
                        id: 'fahrenheit',
                        type: 'toggle',
                        text: 'Fahrenheit',
                        events: {
                            click: function () {
                                // Change temperature scale.
                                activeScale = activeScale === 'C' ? 'F' : 'C';
                                activeColumn = 'TX';
                                window.setTimeout(
                                    updateBoard,
                                    50,
                                    board,
                                    activeCity,
                                    activeColumn,
                                    activeScale,
                                    true
                                );
                            }
                        }
                    }
                ]
            }
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
                    }, {
                        id: 'kpi-layout',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-temperature',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-max-temperature',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-rain',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-ice',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-frost',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid'
                    }, {
                        id: 'city-chart'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
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
                        gridZIndex: 4,
                        labels: {
                            x: 1,
                            y: 22
                        },
                        opposite: true,
                        showFirstLabel: true,
                        showLastLabel: true,
                        startOnTick: true,
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
                            selectionTimeout = window.setTimeout(async () => {
                                if (
                                    activeTimeRange[0] !== e.min ||
                                    activeTimeRange[1] !== e.max
                                ) {
                                    activeTimeRange = [e.min, e.max];

                                    const newColumn =
                                        activeColumn[0] === 'T' ? activeColumn + activeScale : activeColumn;
                                    await onNavigatorChange(
                                        board,
                                        activeCity,
                                        newColumn,
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
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    map: await fetch(
                        'https://code.highcharts.com/mapdata/' +
                        'custom/world.topo.json'
                    ).then(response => response.json()),
                    styledMode: true
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature
                },
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    buttonOptions: {
                        verticalAlign: 'bottom'
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
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 2
                    }, {
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.y:.0f}',
                        inside: true,
                        padding: 0,
                        verticalAlign: 'bottom',
                        y: -16
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
                        radius: 12,
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
        }, {
            cell: 'kpi-data',
            type: 'KPI',
            title: activeCity,
            value: 10,
            valueFormat: '{value:.0f}m',
            subtitle: 'Elevation'
        }, {
            cell: 'kpi-temperature',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.0f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'Average Temperature',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 50,
                    min: -10,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 2,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'TN';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        activeScale,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-max-temperature',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.0f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'Maximal Temperature',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 50,
                    min: -10,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 2,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'TX';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        activeScale,
                        true
                    );
                },
                afterLoad: function () {
                    this.cell.setActiveState();
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-rain',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.0f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'Days with Rain',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 10,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 2,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'RR1';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        activeScale
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-ice',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.0f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'Days with Ice',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 10,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 2,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'ID';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        activeScale,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-frost',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.0f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'Days with Frost',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 10,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 2,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'FD';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        activeScale,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            connector: {
                id: 'Range Selection'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
                columns: {
                    time: {
                        show: false
                    },
                    FD: {
                        headerFormat: 'Days with Frost'
                    },
                    ID: {
                        headerFormat: 'Days with Ice'
                    },
                    RR1: {
                        headerFormat: 'Days with Rain'
                    },
                    TN: {
                        show: false
                    },
                    TX: {
                        show: false
                    },
                    TNC: {
                        headerFormat: 'Average Temperature °C'
                    },
                    TNF: {
                        headerFormat: 'Average Temperature °F',
                        show: false
                    },
                    TXC: {
                        headerFormat: 'Maximal Temperature °C'
                    },
                    TXF: {
                        headerFormat: 'Maximal Temperature °F',
                        show: false
                    }
                }
            },
            editable: true
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            connector: {
                id: 'Range Selection'
            },
            columnAssignment: {},
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    spacing: [40, 40, 40, 10],
                    styledMode: true,
                    type: 'spline',
                    animation: false,
                    animationLimit: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature
                },
                series: [{
                    name: activeCity,
                    animation: false,
                    animationLimit: 0,
                    marker: {
                        enabledThreshold: 0.5
                    }
                }],
                title: {
                    margin: 20,
                    text: 'Maximal Temperature',
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Celsius'
                    }
                }
            }
        }]
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

async function onNavigatorChange(board, city, column, scale) {
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
    const dataPool = board.dataPool;
    const [
        timeRangeSelector,
        worldMap,
        kpiData,
        kpiTemperature,
        kpiMaxTemperature,
        kpiRain,
        kpiIce,
        kpiFrost
    ] = board.mountedComponents.map(c => c.component);
    // Update range selection
    const colorMin = (column[0] !== 'T' ? 0 : (scale === 'C' ? -10 : 14));
    const colorMax = (column[0] !== 'T' ? 10 : (scale === 'C' ? 50 : 122));
    const colorStops = (
        column[0] !== 'T' ?
            colorStopsDays :
            colorStopsTemperature
    );
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const timeRangeMax = timeRangeSelector.chart.axes[0].max;
    const timeRangeMin = timeRangeSelector.chart.axes[0].min;
    const selectionModifier = selectionTable.getModifier();

    const citiesTable = await dataPool.getConnectorTable('Cities');

    if (
        !selectionModifier.options.ranges[0] ||
        selectionModifier.options.ranges[0].maxValue !== timeRangeMax ||
        selectionModifier.options.ranges[0].minValue !== timeRangeMin
    ) {
        selectionModifier.options.ranges = [{
            column: 'time',
            maxValue: timeRangeMax,
            minValue: timeRangeMin
        }];
        await selectionTable.setModifier(selectionModifier);
    }

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

    // Update KPIs
    await kpiData.update({
        title: city,
        value: citiesTable.getCellAsNumber(
            'elevation',
            citiesTable.getRowIndexBy('city', city)
        ) || '--'
    });
    kpiTemperature.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('TN' + scale, 0) || 0,
        true,
        true
    );
    kpiMaxTemperature.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('TX' + scale, 0) || 0,
        true,
        true
    );
    kpiRain.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('RR1', 0) || 0,
        true,
        true
    );
    kpiIce.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('ID', 0) || 0,
        true,
        true
    );
    kpiFrost.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('FD', 0) || 0,
        true,
        true
    );
}

async function updateBoard(board, city, column, scale, newData) {
    const dataPool = board.dataPool;
    const colorMin = (column[0] !== 'T' ? 0 : (scale === 'C' ? -10 : 14));
    const colorMax = (column[0] !== 'T' ? 10 : (scale === 'C' ? 50 : 122));
    const colorStops = (
        column[0] !== 'T' ?
            colorStopsDays :
            colorStopsTemperature
    );
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const [
        timeRangeSelector,
        worldMap,
        kpiData,
        kpiTemperature,
        kpiMaxTemperature,
        kpiRain,
        kpiIce,
        kpiFrost,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    column = (column[0] === 'T' ? column + scale : column);

    let cityTable = await dataPool.getConnectorTable(city);

    if (newData) {
        // Update time range selector
        timeRangeSelector.chart.series[0].update({
            type: column[0] === 'T' ? 'spline' : 'column',
            data: cityTable.modified
                .getRows(void 0, void 0, ['time', column])
        });

        selectionTable.setColumns(cityTable.modified.getColumns(), 0);
    }

    onNavigatorChange(board, city, column, scale);

    if (newData) {
        await selectionTable.setModifier(selectionTable.getModifier());
    }

    // Update city grid selection
    const showCelsius = scale === 'C';
    const sharedColumnAssignment = {
        time: 'x',
        FD: column === 'FD' ? 'y' : null,
        ID: column === 'ID' ? 'y' : null,
        RR1: column === 'RR1' ? 'y' : null,
        TNC: column === 'TNC' ? 'y' : null,
        TNF: column === 'TNF' ? 'y' : null,
        TXC: column === 'TXC' ? 'y' : null,
        TXF: column === 'TXF' ? 'y' : null
    };

    if (newData) {
        await selectionGrid.update({
            dataGridOptions: {
                columns: {
                    TNC: {
                        show: showCelsius
                    },
                    TNF: {
                        show: !showCelsius
                    },
                    TXC: {
                        show: showCelsius
                    },
                    TXF: {
                        show: !showCelsius
                    }
                }
            },
            columnAssignment: sharedColumnAssignment
        });
    }

    // Update city chart selection
    if (newData) {
        await cityChart.update({
            columnAssignment: sharedColumnAssignment,
            chartOptions: {
                chart: {
                    type: column[0] === 'T' ? 'spline' : 'column'
                },
                chartOptions: {
                    chart: {
                        type: column[0] === 'T' ? 'spline' : 'column'
                    },
                    colorAxis: {
                        min: colorMin,
                        max: colorMax,
                        stops: colorStops
                    }
                }
            }
        });
    }
}
