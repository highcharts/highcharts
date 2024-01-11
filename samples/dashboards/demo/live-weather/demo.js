/* eslint-disable jsdoc/require-description */
const MathModifier = Dashboards.DataModifier.types.Math;

// Forecast data
const configMet = {
    cities: [
        {
            name: 'London',
            url: 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.50853&lon=-0.12574&altitude=25'
        }
    ],
    fnProcess: processMetData
};

// Alternative source: Past week
const configOpenMeteo = {
    cities: [
        {
            name: 'London',
            url: 'https://api.open-meteo.com/v1/forecast?' +
                'latitude=51.5085&longitude=-0.1257&hourly=temperature_2m&past_days=7'
        }
    ],
    fnProcess: processMetData
};

// Launch the application
setupBoard();

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

const tempRange = {
    minC: -10,
    maxC: 50
};

const KPIChartOptions = {
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
    yAxis: {
        labels: {
            distance: 4,
            y: 12
        },
        max: 10,
        min: 0,
        stops: colorStopsDays,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

async function setupBoard() {
    let activeCity = 'New York',
        activeColumn = 'TNC',
        activeTimeRange = [ // default to a year
            Date.UTC(2009, 11, 25, 0, 0, 1),
            Date.UTC(2010, 11, 25)
        ];

    // Initialize board with most basic data
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Range Selection',
                type: 'CSV', // JSON
                options: {
                    dataModifier: {
                        type: 'Range'
                    }
                }
            }, {
                id: 'Cities',
                type: 'CSV', // JSON
                options: {
                    csvURL: (
                        // Replace with JSON
                        'https://www.highcharts.com/samples/data/climate-cities-limited.csv'
                    )
                }
            }]
        },
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/dashboards/gfx/dashboards-icons/menu.svg'
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
                                activeColumn = 'TNC';
                                updateBoard(
                                    board,
                                    activeCity,
                                    activeColumn,
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
                                            width: '1/2'
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
                                            width: '1/2'
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
                                    id: 'kpi-pressure',
                                    responsive: {
                                        large: {
                                            width: '1/2'
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
                                    id: 'kpi-humidity',
                                    responsive: {
                                        large: {
                                            width: '1/2'
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
                                    false
                                );
                            }
                        }
                    },
                    accessibility: {
                        description: 'Years'
                    }
                },
                yAxis: {
                    accessibility: {
                        description: 'Temperature'
                    }
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Data range selector. Highcharts Interactive Chart.'
                    }
                },
                accessibility: {
                    description: `The chart is displaying range of dates from
                    1951-01-01 to 2010-10-25.`,
                    typeDescription: 'Navigator that selects a range of dates.',
                    point: {
                        descriptionFormatter: function (point) {
                            return 'x, ' +
                                Highcharts.dateFormat('%Y-%m-%d', point.x) +
                                ', ' + point.y + '. Timeline.';
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
                        'https://code.highcharts.com/mapdata/custom/world.topo.json'
                    ).then(response => response.json()),
                    styledMode: true
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: tempRange.maxC,
                    min: tempRange.minC,
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
                                radiusPlus: 2
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
                    useHTML: true,
                    stickOnContact: true
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Cities in the world. Highcharts Interactive Map.'
                    }
                },
                accessibility: {
                    description: `The chart is displaying maximal temperature
                    in cities.`,
                    point: {
                        valueDescriptionFormat: '{value} degrees celsius, {xDescription}, Cities'
                    }
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
            connector: {
                id: 'Range Selection'
            },
            columnName: 'TNC',
            chartOptions: {
                ...KPIChartOptions,
                title: {
                    text: 'Temperature',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    accessibility: {
                        description: 'Celsius'
                    },
                    max: tempRange.maxC,
                    min: tempRange.minC
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
            cell: 'kpi-pressure',
            type: 'KPI',
            connector: {
                id: 'Range Selection'
            },
            columnName: 'FD',
            chartOptions: {
                ...KPIChartOptions,
                title: {
                    text: 'Air Pressure',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    accessibility: {
                        description: 'hPa'
                    },
                    max: tempRange.maxC,
                    min: tempRange.minC
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
            cell: 'kpi-humidity',
            type: 'KPI',
            connector: {
                id: 'Range Selection'
            },
            columnName: 'ID',
            chartOptions: {
                ...KPIChartOptions,
                title: {
                    text: 'Humidity',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    accessibility: {
                        description: '%'
                    },
                    max: 10,
                    min: 0
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
                        headerFormat: 'Humidity'
                    },
                    ID: {
                        headerFormat: 'Pressure'
                    },
                    TNC: {
                        headerFormat: 'Temperature °C',
                        cellFormat: '{value:.1f}'
                    },
                    TNX: {
                        show: false
                    },
                    TN: {
                        show: false
                    },
                    TX: {
                        show: false
                    },
                    RR1: {
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
            columnAssignment: {
                time: 'x',
                TNC: 'value'
            },
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
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature,
                    showInLegend: false
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: true,
                            symbol: 'circle'
                        }
                    }
                },
                title: {
                    margin: 20,
                    text: 'Temperature in the city',
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true,
                    stickOnContact: true,
                    formatter: function () {
                        const point = this.point;
                        const name = this.series.name;

                        // Date
                        let str = Highcharts.dateFormat('%Y-%m-%d<br />', point.x);

                        if (name === 'TNC') {
                            // Temperature (names TXC, TNC, TXF, TNF)
                            const tempStr = (name[1] === 'X' ? 'Max: ' : 'Avg: ') + Highcharts.numberFormat(point.y, 1);
                            str += tempStr + '˚' + name[2];
                        } else {
                            // TBD
                            str += 'xxx: ' + point.y;
                        }
                        return str;
                    }
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b'
                    },
                    accessibility: {
                        description: 'Years'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Celsius'
                    },
                    accessibility: {
                        description: 'Celsius'
                    }
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Cities in the world. Highcharts Interactive Map.'
                    }
                },
                accessibility: {
                    description: `The chart is displaying maximal temperature,
                    average temperature and days of rain.`
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

    // Load active city
    await setupCity(board, activeCity, activeColumn);
    await updateBoard(board, activeCity, activeColumn, true);

    // Select active city on the map
    const worldMap = board.mountedComponents[1].component.chart.series[1];
    for (let idx = 0; idx < worldMap.data.length; idx++) {
        if (worldMap.data[idx].name === activeCity) {
            worldMap.data[idx].select();
            break;
        }
    }

    // Load additional cities
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        if (cityRows[i].city !== activeCity) {
            await setupCity(board, cityRows[i].city, activeColumn);
        }
    }
}

async function setupCity(board, city, column) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('Cities');
    const cityTable = await dataPool.getConnectorTable(city);
    const latestTime = board.mountedComponents[0].component.chart.axes[0].max;
    const worldMap = board.mountedComponents[1].component.chart.series[1];

    // Extend city table
    await cityTable.setModifier(new MathModifier({
        modifier: 'Math',
        columnFormulas: [{
            column: column,
            formula: 'E1-273.15' // E1 is the TN column with Kelvin values
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

    const pointValue = cityTable.modified.getCellAsNumber(
        column,
        cityTable.modified.getRowIndexBy('time', latestTime)
    );

    // Add city to world map
    worldMap.addPoint({
        custom: {
            elevation: cityInfo.elevation,
            yScale: 'C'
        },
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        name: cityInfo.city,
        y: pointValue || Math.round((90 - Math.abs(cityInfo.lat)) / 3)
    });
}

async function updateBoard(board, city, column, newData) {
    const dataPool = board.dataPool;
    const colorMin = tempRange.minC;
    const colorMax = tempRange.maxC;
    const colorStops = colorStopsTemperature;
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const cityTable = await dataPool.getConnectorTable(city);
    const citiesTable = await dataPool.getConnectorTable('Cities'); // Geographical data

    const [
        timeRangeSelector,
        worldMap,
        kpiGeoData,
        kpiTemperature,
        kpiPressure,
        kpiHumidity,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    // Update data of time range selector
    if (newData) {
        timeRangeSelector.chart.series[0].update({
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
        // Get elevation of city
        const cityName = mapPoints[i].name;
        const cityInfo = citiesTable.getRowObject(citiesTable.getRowIndexBy('city', cityName));

        const pointTable = await dataPool.getConnectorTable(cityName);

        mapPoints[i].update({
            custom: {
                elevation: cityInfo.elevation,
                yScale: 'C'
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
    kpiTemperature.update({
        columnName: 'TNC'
    });
    kpiPressure.update({
        columnName: 'FD'
    });
    kpiHumidity.update({
        columnName: 'ID'
    });

    if (newData) {
        // Update KPIs
        await kpiGeoData.update({
            title: city,
            value: citiesTable.getCellAsNumber(
                'elevation',
                citiesTable.getRowIndexBy('city', city)
            ) || '--'
        });

        // Update data grid and city chart
        const sharedColumnAssignment = {
            time: 'x',
            TNC: 'y'
        };

        // Update city grid selection
        await selectionGrid.update({
            dataGridOptions: {
                columns: {
                    TNC: {
                        show: true
                    }
                }
            },
            columnAssignment: sharedColumnAssignment
        });

        // Update city chart
        const options = cityChart.chartOptions;
        options.title.text = 'Temperature in ' + city;
        options.colorAxis.min = colorMin;
        options.colorAxis.max = colorMax;
        options.colorAxis.colorStops = colorStops;

        await cityChart.update({
            columnAssignment: {
                time: 'x',
                TNC: 'y'
            },
            chartOptions: options
        });
    }
}

//
// Test section, to be removed.
//
function processMetData(json) {
    const time = json.properties.meta.updated_at;
    const obsData = json.properties.timeseries;

    console.log('api.met.no - updated at: ' + time);
    obsData.forEach(item => {
        console.log(item.time + ':' + item.data.instant.details.air_temperature);
    });
}

function processOpenMeteoData(json) {
    var time = 0;
    console.log('api.met.no - updated at: ' + time);
}

// On DOM ready...
getMetData(configMet);

async function getMetData(cfg) {
    const data = await fetch(
        cfg.cities[0].url
    ).then(response => response.json());

    // Process the received data
    cfg.fnProcess(data);
}
