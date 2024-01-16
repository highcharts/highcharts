/* eslint-disable jsdoc/require-description */

// Index of the data to be displayed in map, KPI and spline chart.
// The number is an offset from the current hour.

const rangeConfig = {
    first: 0, // 0: current observation
    hours: 24 // max: 19 days
};

// Parameter configuration
const paramConfig = {
    temperature: {
        name: 'temperature',
        unit: '˚C',
        min: -20,
        max: 50,
        colorStops: [
            [0.0, '#4CAFFE'],
            [0.3, '#53BB6C'],
            [0.5, '#DDCE16'],
            [0.6, '#DF7642'],
            [0.7, '#DD2323']
        ]
    },
    pressure: {
        name: 'pressure',
        unit: 'hPa',
        min: 800,
        max: 1100,
        colorStops: [
            [0.0, '#000000'],
            [0.5, '#CCCCCC'], // 950 hPa
            [0.7, '#6666CC'], // 1013 hPa
            [0.8, '#3333CC']  // 1030 hPa
        ]
    },
    humidity: {
        name: 'humidity',
        unit: '%',
        min: 0,
        max: 100,
        colorStops: [
            [0.4, '#dceff5'],
            [0.5, '#87abd6'],
            [0.6, '#dceff5'],
            [0.7, '#5470b3'],
            [0.8, '#2843b8'],
            [0.9, '#0f11a6']
        ]
    },
    buildDescription: function (param) {
        const info = this[param];
        // First letter uppercase
        const name = info.name[0].toUpperCase() + info.name.slice(1);

        return `${name} (${info.unit})`;
    }
};

// Geolocation info: https://www.maps.ie/coordinates.html

// Three sets of locations are available:
//  - worldLocations, testLocations, euroLocations
//  - selected in "weatherStations.location"

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
    default: 'Bergen',
    mapView: {
        zoom: 5,
        center: [10, 55]
    },
    points: {
        Vangsnes: {
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
        },
        Olomouc: {
            lat: 49.59552,
            lon: 17.25175,
            alt: 223
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
    // One of: testLocations, worldLocations, euroLocations
    location: worldLocations,

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
// - Copied from https://www.highcharts.com/demo/dashboards/climate
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
        stops: paramConfig.temperature.colorStops,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

// Create JSON object for application specific data format
function processWeatherData(data) {
    const retData = [];
    const forecastData = data.properties.timeseries;

    for (let i = 0; i < rangeConfig.hours; i++) {
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

// Launches the applications
async function setupBoard() {
    let activeCity = weatherStations.location.default;
    let activeParam = paramConfig.temperature;

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
                }
            ]
        },
        // Layout from https://www.highcharts.com/demo/dashboards/climate)
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
        // Adapted from https://www.highcharts.com/demo/dashboards/climate
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
                        max: activeParam.max,
                        min: activeParam.min,
                        stops: activeParam.colorStops
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
                        name: 'Weather Station Map'
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
                                    activeParam.name
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
                            pointFormatter: function () {
                                return `<b>${this.name}</b><br>` +
                                    `Elevation: ${this.custom.elevation} m` +
                                    `<br>${this.y} ${activeParam.unit}`;
                            }
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
                        max: paramConfig.temperature.max,
                        min: paramConfig.temperature.min
                    }
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.temperature;
                        updateBoard(board, activeCity, 'temperature');
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
                            description: paramConfig.pressure.unit
                        },
                        max: paramConfig.pressure.max,
                        min: paramConfig.pressure.min
                    }
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.pressure;
                        updateBoard(board, activeCity, 'pressure');
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
                            description: paramConfig.buildDescription('humidity')
                        },
                        max: paramConfig.humidity.max,
                        min: paramConfig.humidity.min
                    }
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.humidity;
                        updateBoard(board, activeCity, 'humidity');
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
                        max: activeParam.max,
                        min: activeParam.min,
                        stops: activeParam.colorStops,
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

                            // Date + value
                            const hdr = Highcharts.dateFormat('%Y-%m-%d %H:%M<br />', point.x);
                            return hdr + Highcharts.numberFormat(point.y, 1) +
                                activeParam.unit;
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
                            text: paramConfig.buildDescription(activeParam.name)
                        },
                        accessibility: {
                            description: activeParam.unit
                        }
                    },
                    lang: {
                        accessibility: {
                            chartContainerLabel: 'Weather stations. Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The chart is displaying forecasted temperature, pressure or humidity.'
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

    // Update map (series 0 is the world map, series 1 the weather data)
    const worldMap = board.mountedComponents[0].component.chart.series[1];

    // Load active city
    await addCityToMap(board, citiesTable, worldMap, activeCity);
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
            await addCityToMap(board, citiesTable, worldMap, cityRows[i].city);
        }
    }
}

// Add station to map
async function addCityToMap(board, citiesTable, worldMap, city) {
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
        y: forecastTable.columns.temperature[rangeConfig.first]
    });
}

// Update board after changing city or parameter selection
async function updateBoard(board, city, paramName = 'temperature') {
    // Parameter info
    const param = paramConfig[paramName];

    // Data access
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
    const mapPoints = worldMap.chart.series[1].data;

    for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
        // Get elevation of city
        const cityName = mapPoints[i].name;
        const cityInfo = citiesTable.getRowObject(citiesTable.getRowIndexBy('city', cityName));
        const forecastTable = await dataPool.getConnectorTable(cityName);

        mapPoints[i].update({
            custom: {
                elevation: cityInfo.elevation,
                yScale: param.unit
            },
            y: forecastTable.modified.getCell(paramName, rangeConfig.first)

        }, true);
    }

    // Updated scale on map and station chart
    const colorAxis = {
        min: param.min,
        max: param.max,
        stops: param.colorStops
    };

    worldMap.chart.update({
        colorAxis: colorAxis
    });

    // Update KPI with latest observations
    const forecastTable = await dataPool.getConnectorTable(city);

    kpiTemperature.update({
        value: forecastTable.columns.temperature[rangeConfig.first]
    });
    kpiPressure.update({
        value: forecastTable.columns.pressure[rangeConfig.first]
    });
    kpiHumidity.update({
        value: forecastTable.columns.humidity[rangeConfig.first]
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
    options.colorAxis = colorAxis;
    options.title.text = 'Forecast for ' + city + ' (' + paramName + ')';
    options.yAxis.title.text = paramConfig.buildDescription(paramName);

    await cityChart.update({
        connector: {
            id: city
        },
        columnAssignment: {
            time: 'x',
            temperature: paramName === 'temperature' ? 'y' : null,
            pressure: paramName === 'pressure' ? 'y' : null,
            humidity: paramName === 'humidity' ? 'y' : null
        },
        chartOptions: options
    });
}

// Launch the application
setupBoard();
