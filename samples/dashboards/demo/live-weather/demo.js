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
            [0.0, '#C0CCC0'],
            [0.5, '#CCCC99'], // 950 hPa
            [0.7, '#99CC66'], // 1013 hPa
            [0.8, '#336633']  // 1030 hPa
        ]
    },
    humidity: {
        name: 'humidity',
        unit: '%',
        min: 0,
        max: 100,
        colorStops: [
            [0.0, '#000000'],
            [1.0, '#CCCC00']
        ]
    },
    getColumnHeader: function (param) {
        const info = this[param];
        // First letter uppercase
        const name = info.name[0].toUpperCase() + info.name.slice(1);

        return `${name} ${info.unit}`;
    }
};

// Geolocation info: https://www.maps.ie/coordinates.html

// Selection of weather stations to display data from
const worldLocations = {
    default: 'Dublin',
    mapView: {
        maxZoom: 4
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
        },
        Istanbul: {
            lat: 41.00824,
            lon: 28.978359,
            alt: 39
        },
        Helsinki: {
            lat: 60.167488,
            lon: 24.942747,
            alt: 0
        },
        Bengaluru: {
            lat: 12.976793,
            lon: 77.590082,
            alt: 921
        },
        Dakar: {
            lat: 14.693425,
            lon: -17.447938,
            alt: 12
        },
        Bogotá: {
            lat: 4.6529539,
            lon: -74.083564,
            alt: 2556
        },
        Ulanbaatar: {
            lat: 47.940932,
            lon: 106.91795,
            alt: 1316
        },
        'Hong Kong': {
            lat: 22.284893,
            lon: 114.1583,
            alt: 6
        },
        'San Diego': {
            lat: 32.7174202,
            lon: -117.162,
            alt: 36
        }
    }
};

// Application configuration (weather station data set + data provider)
const weatherStations = {
    location: worldLocations, // Weather station data set

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
// - Adapted from https://www.highcharts.com/demo/dashboards/climate
const KPIChartOptions = {
    chart: {
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

// Create JSON object on the format required by this application
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
        // Copied from https://www.highcharts.com/demo/dashboards/climate)
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
                    title: {
                        text: paramConfig.getColumnHeader('temperature')
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
                                const city = e.point.name;
                                if (city !== activeCity) {
                                    // New city
                                    activeCity = city;
                                    updateBoard(
                                        board,
                                        activeCity,
                                        activeParam.name
                                    );
                                } else {
                                    // Re-select (otherwise marker is reset)
                                    selectActiveCity();
                                }
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
                custom: 'test',
                chartOptions: {
                    ...KPIChartOptions,
                    title: {
                        text: paramConfig.getColumnHeader('temperature'),
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: paramConfig.getColumnHeader('temperature')
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
                        text: paramConfig.getColumnHeader('pressure'),
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: paramConfig.getColumnHeader('pressure')
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
                        text: paramConfig.getColumnHeader('humidity'),
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: paramConfig.getColumnHeader('humidity')
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
                            headerFormat: 'Time UTC',
                            cellFormatter: function () {
                                return Highcharts.dateFormat('%d/%m, %H:%M', this.value);
                            }
                        },
                        temperature: {
                            headerFormat: paramConfig.getColumnHeader('temperature'),
                            cellFormat: '{value:.1f}'
                        },
                        pressure: {
                            headerFormat: paramConfig.getColumnHeader('pressure'),
                            cellFormat: '{value:.1f}'
                        },
                        humidity: {
                            headerFormat: paramConfig.getColumnHeader('humidity'),
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
                            text: paramConfig.getColumnHeader(activeParam.name)
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
    selectActiveCity();

    // Load additional cities
    for (let i = 0, iEnd = cityRows.length; i < iEnd; ++i) {
        if (cityRows[i].city !== activeCity) {
            await addCityToMap(board, citiesTable, worldMap, cityRows[i].city);
        }
    }

    // HELPER functions

    // Get map chart
    function getMapChart(board) {
        // Update map (series 0 is the world map, series 1 the weather data)
        return board.mountedComponents[0].component.chart.series[1];
    }

    // Select a city on the map
    function selectActiveCity() {
        const worldMap = getMapChart(board);
        for (let idx = 0; idx < worldMap.data.length; idx++) {
            if (worldMap.data[idx].name === activeCity) {
                worldMap.data[idx].select();
                break;
            }
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
            yScale: null // Parameter dependent
        },
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        name: cityInfo.city,
        // First item in current data set
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
        const cityName = mapPoints[i].name;
        const cityInfo = citiesTable.getRowObject(citiesTable.getRowIndexBy('city', cityName));

        // Forecast for city
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
        colorAxis: colorAxis,
        title: {
            text: paramConfig.getColumnHeader(paramName)
        }
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
    options.yAxis.title.text = paramConfig.getColumnHeader(paramName);

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
