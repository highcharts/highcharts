/* eslint-disable jsdoc/require-description */

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
        activeTimeRange = [ // default to a year
            Date.UTC(2009, 11, 25, 0, 0, 1),
            Date.UTC(2010, 11, 25)
        ];

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
                    'https://code.highcharts.com/dashboards/gfx/' +
                    'dashboards-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'fahrenheit',
                        type: 'toggle',
                        text: 'Fahrenheit',
                        events: {
                            click: function () {
                                // Change temperature scale.
                                activeScale = activeScale === 'C' ? 'F' : 'C';
                                activeColumn = 'TX';
                                updateBoard(
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
                        id: 'world-map',
                        responsive: {
                            large: {
                                width: '1/2'
                            },
                            medium: {
                                width: '100%'
                            },
                            small: {
                                width: '100%'
                            }
                        }
                    }, {
                        id: 'kpi-layout',
                        responsive: {
                            large: {
                                width: '1/2'
                            },
                            medium: {
                                width: '100%'
                            },
                            small: {
                                width: '100%'
                            }
                        },
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }, {
                                    id: 'kpi-temperature',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }, {
                                    id: 'kpi-max-temperature',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }, {
                                    id: 'kpi-rain',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }, {
                                    id: 'kpi-ice',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }, {
                                    id: 'kpi-frost',
                                    responsive: {
                                        large: {
                                            width: '1/3'
                                        },
                                        medium: {
                                            width: '1/2'
                                        },
                                        small: {
                                            width: '1/2'
                                        }
                                    },
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid',
                        responsive: {
                            large: {
                                width: '1/2'
                            },
                            medium: {
                                width: '100%'
                            },
                            small: {
                                width: '100%'
                            }
                        }
                    }, {
                        id: 'city-chart',
                        responsive: {
                            large: {
                                width: '1/2'
                            },
                            medium: {
                                width: '100%'
                            },
                            small: {
                                width: '100%'
                            }
                        }
                    }]
                }]
            }]
        },
        components: [{
            cell: 'time-range-selector',
            type: 'Navigator',
            chartOptions: {
                chart: {
                    height: '80px',
                    type: 'spline'
                },
                navigator: {
                    handles: {
                        symbols: ['leftarrow', 'rightarrow'],
                        lineWidth: 0,
                        width: 8,
                        height: 14
                    }
                },
                series: [{
                    name: 'Timeline',
                    data: [
                        [Date.UTC(1951, 0, 5), 0],
                        [Date.UTC(2010, 11, 25), 0]
                    ]
                }],
                xAxis: {
                    min: activeTimeRange[0],
                    max: activeTimeRange[1],
                    minRange: 30 * 24 * 3600 * 1000, // 30 days
                    maxRange: 2 * 365 * 24 * 3600 * 1000, // 2 years
                    events: {
                        afterSetExtremes: async function (e) {
                            const min = Math.round(e.min);
                            const max = Math.round(e.max);

                            if (
                                activeTimeRange[0] !== min ||
                                activeTimeRange[1] !== max
                            ) {
                                activeTimeRange = [min, max];
                                await updateBoard(
                                    board,
                                    activeCity,
                                    activeColumn,
                                    activeScale,
                                    false
                                );
                            }
                        }
                    }
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
                        headerFormat: 'Average Temperature °C',
                        cellFormat: '{value:.2f}'
                    },
                    TNF: {
                        headerFormat: 'Average Temperature °F',
                        show: false
                    },
                    TXC: {
                        headerFormat: 'Maximal Temperature °C',
                        cellFormat: '{value:.2f}'
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
                plotOptions: {
                    series: {
                        marker: {
                            enabled: true,
                            symbol: 'circle'
                        }
                    }
                },
                series: [{
                    name: activeCity,
                    animation: false,
                    animationLimit: 0
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
    const cityRows = citiesTable.getRowObjects();

    // Add city sources
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        dataPool.setConnectorOptions({
            id: cityRows[i].city,
            type: 'CSV',
            options: {
                csvURL: cityRows[i].csv
            }
        });
    }

    // Load initial city
    await setupCity(board, activeCity, activeColumn, activeScale);
    await updateBoard(board, activeCity, activeColumn, activeScale, true);

    // Load additional cities
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        if (cityRows[i].city !== activeCity) {
            await setupCity(board, cityRows[i].city, activeColumn, activeScale);
        }
    }
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
    const colorMin = (column[0] !== 'T' ? 0 : (scale === 'C' ? -10 : 14));
    const colorMax = (column[0] !== 'T' ? 10 : (scale === 'C' ? 50 : 122));
    const colorStops = (
        column[0] !== 'T' ?
            colorStopsDays :
            colorStopsTemperature
    );
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const cityTable = await dataPool.getConnectorTable(city);
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

    // Update data of time range selector
    if (newData) {
        timeRangeSelector.chart.series[0].update({
            type: column[0] === 'T' ? 'spline' : 'column',
            data: cityTable.modified
                .getRows(void 0, void 0, ['time', column])
        });

        selectionTable.setColumns(cityTable.modified.getColumns(), 0);
    }

    // Update range selection
    const timeRangeMax = timeRangeSelector.chart.axes[0].max;
    const timeRangeMin = timeRangeSelector.chart.axes[0].min;
    const selectionModifier = selectionTable.getModifier();

    if (
        newData ||
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
    const rangeEnd = rangeTable.getRowCount() - 1;

    // Update world map
    const mapPoints = worldMap.chart.series[1].data;
    const lastTime = rangeTable.getCellAsNumber('time', rangeEnd);

    for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
        const pointTable = await dataPool.getConnectorTable(mapPoints[i].name);

        mapPoints[i].update({
            custom: {
                yScale: scale
            },
            y: pointTable.modified.getCellAsNumber(
                column,
                pointTable.modified.getRowIndexBy('time', lastTime)
            )
        }, false);
    }
    worldMap.chart.update({
        colorAxis: {
            min: colorMin,
            max: colorMax,
            stops: colorStops
        }
    });

    // Update KPIs
    if (newData) {
        const citiesTable = await dataPool.getConnectorTable('Cities');
        await kpiData.update({
            title: city,
            value: citiesTable.getCellAsNumber(
                'elevation',
                citiesTable.getRowIndexBy('city', city)
            ) || '--'
        });
    }
    kpiTemperature.chart.series[0].points[0]
        .update(rangeTable.getCellAsNumber('TN' + scale, rangeEnd) || 0);
    kpiMaxTemperature.chart.series[0].points[0]
        .update(rangeTable.getCellAsNumber('TX' + scale, rangeEnd) || 0);
    kpiRain.chart.series[0].points[0]
        .update(rangeTable.getCellAsNumber('RR1', rangeEnd) || 0);
    kpiIce.chart.series[0].points[0]
        .update(rangeTable.getCellAsNumber('ID', rangeEnd) || 0);
    kpiFrost.chart.series[0].points[0]
        .update(rangeTable.getCellAsNumber('FD', rangeEnd) || 0);

    // Update data grid and city chart
    if (newData) {
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

        // Update city grid selection
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

        // Update city chart selection
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

const toggle = document.getElementById('mode-toggle');

toggle.addEventListener('click', () => {
    changeTheme();
});

function isDarkModeEnabled() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

toggle.checked = isDarkModeEnabled();

function changeTheme() {
    const toggleContainer = document.getElementById('toggle-container'),
        container = document.getElementById('container'),
        className = toggle.checked ? 'highcharts-dark' : 'highcharts-light';

    container.className = className;
    toggleContainer.className = className;
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    toggle.checked = isDarkModeEnabled();
    changeTheme();
});
