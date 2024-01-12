/* eslint-disable jsdoc/require-description */

// Index of the data to be displayed in map, KPI and spline chart.
// The number is an offset from the current hour.
const hourOffset = 0; // Display the current observation

// Index of the weather data in the map chart
const weatherDataIndex = 1;

// Collection of weather stations
const weatherStations = {
    // Data source: TBD
    cities: {
        'New York': {
            lat: 40.71,
            lon: -74.01,
            alt: 10
        },
        Dublin: {
            lat: 53.35,
            lon: -6.26,
            alt: 8
        },
        Sydney: {
            lat: -33.87,
            lon: 151.21,
            alt: 35
        },
        'Buenos Aires': {
            lat: -34.60,
            lon: -58.38,
            alt: 10
        },
        Tokyo: {
            lat: 35.69,
            lon: 139.69,
            alt: 17
        },
        Johannesburg: {
            lat: -26.20,
            lon: 28.034,
            alt: 1767
        }
    },
    // Endpoint for weather forecast
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',
    // Build the full URL for accessing the data
    buildUrl: function (city) {
        if (city in this.cities) {
            const info = this.cities[city];
            const ret = this.baseUrl +
                `?lat=${info.lat}&lon=${info.lon}&altitude=${info.alt}`;

            return ret;
        }
        return null;
    }
};

// Launch application
setupBoard();

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

// Common options for KPI charts
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
        data: null, // Populated on the fly
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
        stops: colorStopsTemperature,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

function processWeatherData(data) {
    const retData = [];
    const forecastData = data.properties.timeseries;

    // Create object for application specific format (24 hours forecast)
    for (let i = 0; i < 24; i++) {
        const item = forecastData[i];
        const pred = item.data.instant.details;
        const msec = new Date(item.time).getTime();
        retData.push({
            time: msec,
            temperature: pred.air_temperature,
            pressure: pred.air_pressure_at_sea_level,
            humidity: pred.relative_humidity
        });
    }
    return retData;
}

async function setupBoard() {
    let activeCity = 'New York';

    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                {
                    id: 'Cities',
                    type: 'JSON',
                    options: {
                        data: weatherStations.cities,
                        beforeParse: function () {
                            const ret = [['city', 'lat', 'lon', 'elevation']];
                            // eslint-disable-next-line max-len
                            for (const [name, item] of Object.entries(weatherStations.cities)) {
                                ret.push([name, item.lat, item.lon, item.alt]);
                            }
                            return ret;
                        }
                    }
                }, {
                    type: 'JSON',
                    id: activeCity,
                    options: {
                        firstRowAsNames: false,
                        dataUrl: weatherStations.buildUrl(activeCity),
                        beforeParse: processWeatherData
                    }
                }
            ]
        },
        gui: {
            layouts: [{
                rows: [{
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
        components: [
            {
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
                        enableMouseWheelZoom: true
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
                                    activeCity
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
                                '{point.y:.1f}˚C'
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
                        description: 'The chart is displaying maximal temperature in cities.',
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
                    id: activeCity
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
                    id: activeCity
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
                    id: activeCity
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
                    id: activeCity
                },
                sync: {
                    highlight: true
                },
                dataGridOptions: {
                    cellHeight: 38,
                    editable: false,
                    columns: {
                        time: {
                            headerFormat: 'Time (UTC)',
                            cellFormatter: function () {
                                return Highcharts.dateFormat('%d/%m - %H:%M', this.value);
                            }
                        },
                        humidity: {
                            headerFormat: 'Humidity (%)'
                        },
                        pressure: {
                            headerFormat: 'Pressure (hPa)'
                        },
                        temperature: {
                            headerFormat: 'Temperature (°C)',
                            cellFormat: '{value:.1f}'
                        }
                    }
                }
            }, {
                cell: 'city-chart',
                type: 'Highcharts',
                connector: {
                    id: activeCity
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
                    legend: {
                        enabled: false
                    },
                    colorAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        max: tempRange.maxC,
                        min: tempRange.minC,
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

                            // Date/time
                            let str = Highcharts.dateFormat('%Y-%m-%d %H:%M<br />', point.x);

                            // Temperature
                            const tempStr = Highcharts.numberFormat(point.y, 1);
                            str += tempStr + '˚C ';

                            return str;
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function () {
                                return Highcharts.dateFormat('%H:%M', this.value);
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
                        description: 'The chart is displaying maximal temperature, average temperature and days of rain.'
                    }
                }
            }]
    }, true);

    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('Cities');
    const cityRows = citiesTable.getRowObjects();

    // Add weather station sources
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        const city = cityRows[i].city;
        const url = weatherStations.buildUrl(city);

        if (url !== null) {
            dataPool.setConnectorOptions({
                id: city,
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    dataUrl: url,
                    beforeParse: processWeatherData
                }
            });
        }
    }

    // Load active city
    await setupCity(board, activeCity);
    await updateBoard(board, activeCity);

    // Select active city on the map
    const worldMap = board.mountedComponents[0].component.chart.series[1];
    for (let idx = 0; idx < worldMap.data.length; idx++) {
        if (worldMap.data[idx].name === activeCity) {
            worldMap.data[idx].select();
            break;
        }
    }

    // Load additional cities
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        if (cityRows[i].city !== activeCity) {
            await setupCity(board, cityRows[i].city);
        }
    }
}

async function setupCity(board, city) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('Cities');
    const forecastTable = await dataPool.getConnectorTable(city);
    const worldMap = board.mountedComponents[0]
        .component.chart.series[weatherDataIndex];

    const cityInfo = citiesTable.getRowObject(
        citiesTable.getRowIndexBy('city', city)
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
        // Latest observation
        y: forecastTable.columns.temperature[hourOffset]
    });
}

async function updateBoard(board, city) {
    const dataPool = board.dataPool;
    // Geographical data
    const citiesTable = await dataPool.getConnectorTable('Cities');

    const [
        worldMap,
        kpiGeoData,
        kpiTemperature,
        kpiPressure,
        kpiHumidity,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    // Update map (series 0 is the world map, series 1 the weather data)
    const mapPoints = worldMap.chart.series[weatherDataIndex].data;

    for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
        // Get elevation of city
        const cityName = mapPoints[i].name;
        const cityInfo = citiesTable.getRowObject(citiesTable.getRowIndexBy('city', cityName));
        const forecastTable = await dataPool.getConnectorTable(cityName);

        mapPoints[i].update({
            custom: {
                elevation: cityInfo.elevation
            },
            y: forecastTable.columns.temperature[hourOffset]
        }, false);
    }

    // Update KPI with latest observations
    const forecastTable = await dataPool.getConnectorTable(city);

    kpiTemperature.update({
        value: forecastTable.columns.temperature[hourOffset]
    });
    kpiPressure.update({
        value: forecastTable.columns.pressure[hourOffset]
    });
    kpiHumidity.update({
        value: forecastTable.columns.humidity[hourOffset]
    });

    // Update geo KPI
    await kpiGeoData.update({
        title: city,
        value: citiesTable.getCellAsNumber(
            'elevation',
            citiesTable.getRowIndexBy('city', city)
        ) || '--'
    });

    // Update city grid data selection
    await selectionGrid.update({
        connector: {
            id: city
        }
    });

    // Update city chart
    const options = cityChart.chartOptions;
    options.title.text = 'Temperature in ' + city;
    await cityChart.update({
        connector: {
            id: city
        },
        chartOptions: options
    });
}
