/* eslint-disable jsdoc/require-description */

// Forecast data
const configMet = {
    cities: {
        london: {
            name: 'London',
            url: 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.50853&lon=-0.12574&altitude=25'
        }
    },
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact?'
};

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
    let activeCity = 'New York';
    const activeColumn = 'temperature';

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
                        'https://www.highcharts.com/samples/data/climate-cities-limited.csv'
                    )
                }
            }, {
                type: 'JSON',
                id: 'Weather',
                options: {
                    firstRowAsNames: false,
                    dataUrl: configMet.cities.london.url,
                    beforeParse: data => {
                        const retData = [];

                        const obsData = data.properties.timeseries;
                        // const time = data.properties.meta.updated_at;
                        // console.log('api.met.no - updated at: ' + time);

                        // Create object for application specific format
                        for (let i = 0; i < 24; i++) {
                            const item = obsData[i];
                            const pred = item.data.instant.details;
                            retData.push({
                                time: item.time,
                                temperature: pred.air_temperature,
                                pressure: pred.air_pressure_at_sea_level,
                                humidity: pred.relative_humidity
                            });
                        }
                        return retData;
                    }
                }
            }]
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
                        [Date.UTC(2024, 0, 0), 0],
                        [Date.UTC(2024, 1, 0), 0]
                    ]
                }],
                xAxis: {
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
                    description: 'The chart is displaying range of dates from now and the next 5 days',
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
                            'Elevation: {point.custom.elevation} m<br>' +
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
            valueFormat: '{value:.0f} m',
            subtitle: 'Elevation'
        }, {
            cell: 'kpi-temperature',
            type: 'KPI',
            connector: {
                id: 'Weather'
            },
            columnName: 'temperature',
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
                id: 'Weather'
            },
            columnName: 'pressure',
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
                    max: 1100,
                    min: 800
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
                id: 'Weather'
            },
            columnName: 'humidity',
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
                    max: 100,
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
                id: 'Weather'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
                columns: {
                    time: {
                        headerFormat: 'Time ISO'
                    },
                    humidity: {
                        headerFormat: 'Humidity %'
                    },
                    pressure: {
                        headerFormat: 'Pressure hPa'
                    },
                    temperature: {
                        headerFormat: 'Temperature °C',
                        cellFormat: '{value:.1f}'
                    }
                }
            }
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            connector: {
                id: 'Weather'
            },
            columnAssignment: {
                time: 'x',
                temperature: 'y'
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

                        if (name === 'temperature') {
                            // Temperature
                            const tempStr = Highcharts.numberFormat(point.y, 1);
                            str += tempStr + '˚C ' + point.x;
                        } else {
                            // TBD
                            str += 'xxx: ' + point.y;
                        }
                        return str;
                    }
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%Y-%m-%d', this.value);
                        },
                        accessibility: {
                            description: 'Hours'
                        }
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
    const forecastTable = await dataPool.getConnectorTable('Weather'); // JSON  weather
    const citiesTable = await dataPool.getConnectorTable('Cities');
    const cityTable = await dataPool.getConnectorTable(city);
    const latestTime = board.mountedComponents[0].component.chart.axes[0].min;
    const worldMap = board.mountedComponents[1].component.chart.series[1];

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
    const cityTable = await dataPool.getConnectorTable(city); // City weather
    const citiesTable = await dataPool.getConnectorTable('Cities'); // Geographical data
    const forecastTable = await dataPool.getConnectorTable('Weather'); // JSON  weather

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

    // Update KPI (TBD: check is this can be pre-configured)
    kpiTemperature.update({
        value: forecastTable.columns.temperature[0]
    });
    kpiPressure.update({
        value: forecastTable.columns.pressure[0]
    });
    kpiHumidity.update({
        value: forecastTable.columns.humidity[0]
    });

    if (newData) {
        // Update geo KPI
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
            temperature: 'y'
        };

        // Update city grid selection
        await selectionGrid.update({
            dataGridOptions: {
                columns: {
                    temperature: {
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
            // columnAssignment: sharedColumnAssignment,
            chartOptions: options
        });
    }
}
