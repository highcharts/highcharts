/* eslint-disable jsdoc/require-description */

// Index of the data to be displayed in map, KPI and spline chart.
// The number is an offset from the current hour.
const hourOffset = 0; // Display the current observation

// Index of the weather data in the map chart
const weatherDataIndex = 1;

const colorStopsTemperature = [
    [0.0, '#4CAFFE'],
    [0.3, '#53BB6C'],
    [0.5, '#DDCE16'],
    [0.6, '#DF7642'],
    [0.7, '#DD2323']
];

// Ranges for various measurements
const range = {
    tempMin: -10,
    tempMax: 50,
    humMin: 0,
    humMax: 100,
    hpaMin: 800,
    hpaMax: 1100
};

// Geolocation info: https://www.maps.ie/coordinates.html

// eslint-disable-next-line no-unused-vars
const worldLocations = {
    default: 'Dublin',
    mapView: {
        zoom: 1.7,
        center: [0, 10]
    },
    points: {
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
    }
};

// eslint-disable-next-line no-unused-vars
const testLocations = {
    default: 'Oslo',
    mapView: {
        zoom: 5,
        center: [10, 55]
    },
    points: {
        Olomouc: {
            lat: 49.59552,
            lon: 17.25175,
            alt: 223
        },
        Vangses: {
            lat: 61.16981,
            lon: 6.64151,
            alt: 49
        },
        Bergen: {
            lat: 60.384,
            lon: 5.332,
            alt: 12
        },
        Oslo: {
            lat: 59.93743,
            lon: 10.71819,
            alt: 94
        },
        Kraków: {
            lat: 50.06143,
            lon: 19.93658,
            alt: 219
        }
    }
};

// eslint-disable-next-line no-unused-vars
const euroLocations = {
    default: 'London',
    mapView: {
        zoom: 3.8,
        center: [10, 50]
    },
    points: {
        London: {
            lat: 51.507351,
            lon: -0.127758,
            alt: 22
        },
        Berlin: {
            lat: 52.5170365,
            lon: 13.3888599,
            alt: 44
        },
        Dublin: {
            lat: 53.35,
            lon: -6.26,
            alt: 8
        },
        Istanbul: {
            lat: 41.008240,
            lon: 28.978359,
            alt: 39
        },
        Roma: {
            lat: 41.8933203,
            lon: 12.4829321,
            alt: 46
        },
        Lyon: {
            lat: 45.7578137,
            lon: 4.8320114,
            alt: 171
        },
        Oslo: {
            lat: 59.93743,
            lon: 10.71819,
            alt: 94
        },
        Kraków: {
            lat: 50.06143,
            lon: 19.93658,
            alt: 219
        },
        Helsinki: {
            lat: 60.1674881,
            lon: 24.9427473,
            alt: 0
        },
        Sevilla: {
            lat: 37.3886303,
            lon: -5.9953403,
            alt: 17
        },
        Київ: {
            lat: 50.4500336,
            lon: 30.5241361,
            alt: 157
        },
        Wien: {
            lat: 48.2083537,
            lon: 16.3725042,
            alt: 190
        }
    }
};

// Application configuration (selection of weather stations + data provider)
const weatherStations = {
    location: euroLocations, // testLocations, worldLocations, euroLocations

    // Base URL for weather forecast
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',

    // Build the full URL for accessing the data
    buildUrl: function (city) {
        if (city in this.location.points) {
            const point = this.location.points[city];
            const ret = this.baseUrl +
                `?lat=${point.lat}&lon=${point.lon}&altitude=${point.alt}`;

            return ret;
        }
        return null;
    }
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
            format: '{y:.1f}',
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
    let activeCity = weatherStations.location.default;

    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                {
                    id: 'Cities',
                    type: 'JSON',
                    options: {
                        data: weatherStations.location.points,
                        beforeParse: function () {
                            const ret = [['city', 'lat', 'lon', 'elevation']];
                            // eslint-disable-next-line max-len
                            for (const [name, item] of Object.entries(weatherStations.location.points)) {
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
                        max: range.tempMax,
                        min: range.tempMin,
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
                    mapView: weatherStations.location.mapView,
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
                            chartContainerLabel: 'Weather stations. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The chart is displaying forecasted temperature.',
                        point: {
                            valueDescriptionFormat: '{value} degrees celsius, {xDescription}, Location'
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
                        max: range.tempMax,
                        min: range.tempMin
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
                columnName: 'pressure',
                chartOptions: {
                    ...KPIChartOptions,
                    title: {
                        text: 'Pressure',
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: 'hPa'
                        },
                        max: range.hpaMax,
                        min: range.hpaMin
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
                        max: range.humMax,
                        min: range.humMin
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
                                return Highcharts.dateFormat('%d/%m, %H:%M', this.value);
                            }
                        },
                        humidity: {
                            headerFormat: 'Humidity (%)',
                            cellFormat: '{value:.1f}'
                        },
                        pressure: {
                            headerFormat: 'Pressure (hPa)',
                            cellFormat: '{value:.1f}'
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
                        labelFormatter: function () {
                            return Highcharts.dateFormat('%d/%m/%Y', this.xAxis.min);
                        }
                    },
                    colorAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        max: range.tempMax,
                        min: range.tempMin,
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
                                description: 'Hours, minutes'
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
                            chartContainerLabel: 'Weather stations. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The chart is displaying forecasted temperature.'
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

    const worldMap = board.mountedComponents[0]
        .component.chart.series[weatherDataIndex];

    // Load active city
    await setupCity(board, citiesTable, worldMap, activeCity);
    await updateBoard(board, activeCity);

    // Select active city on the map
    for (let idx = 0; idx < worldMap.data.length; idx++) {
        if (worldMap.data[idx].name === activeCity) {
            worldMap.data[idx].select();
            break;
        }
    }

    // Load additional cities
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        if (cityRows[i].city !== activeCity) {
            await setupCity(board, citiesTable, worldMap, cityRows[i].city);
        }
    }
}

async function setupCity(board, citiesTable, worldMap, city) {
    const dataPool = board.dataPool;
    const forecastTable = await dataPool.getConnectorTable(city);
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
        )
    });

    // Update city grid data selection
    await selectionGrid.update({
        connector: {
            id: city
        }
    });

    // Update city chart
    const options = cityChart.chartOptions;
    options.title.text = 'Temperature forecast for ' + city;
    await cityChart.update({
        connector: {
            id: city
        },
        chartOptions: options
    });
}

// Launch the application
setupBoard();
