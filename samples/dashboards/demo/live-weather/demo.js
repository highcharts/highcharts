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
        floatRes: 1,
        chartType: 'spline',
        colorStops: [
            [0.0, '#4CAFFE'],
            [0.3, '#53BB6C'],
            [0.5, '#DDCE16'],
            [0.6, '#DF7642'],
            [0.7, '#DD2323']
        ]
    },
    wind: {
        name: 'wind',
        unit: 'm/s',
        min: 0,
        max: 30, // Hurricane > 32.7
        floatRes: 1,
        chartType: 'areaspline',
        colorStops: [
            [0.0, '#C0CCC0'],
            [0.25, '#CCCC99'],
            [0.50, '#99CC66'],
            [0.75, '#336633']
        ]
    },
    precipitation: {
        name: 'precipitation',
        unit: 'mm',
        min: 0,
        max: 10, // per hour
        floatRes: 1,
        chartType: 'column',
        colorStops: [
            [0.0, '#CCCCCC'],
            [0.1, '#CCCCAA'],
            [0.2, '#9999AA'],
            [0.8, '#0000CC']
        ]
    },
    getColumnHeader: function (param, simple = false) {
        const info = this[param];
        // First letter uppercase
        const name = info.name[0].toUpperCase() + info.name.slice(1);
        if (simple) {
            return name;
        }
        return `${name} ${info.unit}`;
    }
};

// Geolocation info: https://www.maps.ie/coordinates.html

// Selection of weather stations to display data from
const worldLocations = {
    mapUrl: 'https://code.highcharts.com/mapdata/custom/north-america-no-central.topo.json',
    default: 'New York',
    points: [
        ['city', 'lat', 'lon', 'elevation'],
        ['New York', 40.71, -74.01, 10],
        ['San Diego', 32.71, -117.16, 36],
        ['Anchorage', 61.22, -149.89, 0],
        ['Winnipeg', 49.90, -97.14, 236],
        ['Monterrey', 25.68, -99.13, 2230],
        ['Baracoa', 20.35, -74.50, 15]
    ]
};

// Application configuration (weather station data set + data provider)
const weatherStations = {
    location: worldLocations, // Weather station data set

    // Base URL for weather forecast
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',

    // Build the full URL for accessing the data
    buildUrl: function (city) {
        for (let i = 1; i < this.location.points.length; i++) {
            const point = this.location.points[i];
            if (point[0] === city) {
                return this.baseUrl +
                    `?lat=${point[1]}&lon=${point[2]}&altitude=${point[3]}`;
            }
        }
        return null;
    }
};

// Common options for KPI charts
// - Adapted from https://www.highcharts.com/demo/dashboards/climate
const KPIChartOptions = {
    chart: {
        spacing: [8, 8, 8, 8],
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
                        firstRowAsNames: true,
                        data: weatherStations.location.points
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
                                    id: 'kpi-wind',
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
                                    id: 'kpi-precipitation',
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
                        map: await fetch(weatherStations.location.mapUrl)
                            .then(response => response.json())
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
                    mapView: {
                        maxZoom: 4
                    },
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
                                        activeParam.name,
                                        false, // No parameter update
                                        true // Data set update
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
                chartOptions: {
                    ...KPIChartOptions,
                    title: {
                        text: paramConfig.getColumnHeader('temperature') + ' (latest)',
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
                        // Parameter update, data set unchanged
                        updateBoard(board, activeCity, 'temperature', true, false);
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
                cell: 'kpi-wind',
                type: 'KPI',
                columnName: 'wind',
                chartOptions: {
                    ...KPIChartOptions,
                    title: {
                        text: paramConfig.getColumnHeader('wind') + ' (latest)',
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: paramConfig.getColumnHeader('wind')
                        },
                        max: paramConfig.wind.max,
                        min: paramConfig.wind.min
                    }
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.wind;
                        // Parameter update, data set unchanged
                        updateBoard(board, activeCity, 'wind', true, false);
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
                cell: 'kpi-precipitation',
                type: 'KPI',
                columnName: 'precipitation',
                chartOptions: {
                    ...KPIChartOptions,
                    title: {
                        text: paramConfig.getColumnHeader('precipitation') + ' (next 24 hours)',
                        verticalAlign: 'bottom',
                        widthAdjust: 0
                    },
                    yAxis: {
                        accessibility: {
                            description: paramConfig.getColumnHeader('precipitation')
                        },
                        max: 50, // Per 24 hours
                        min: paramConfig.precipitation.min
                    }
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.precipitation;
                        // Parameter update, data set unchanged
                        updateBoard(board, activeCity, 'precipitation', true, false);
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
                        wind: {
                            headerFormat: paramConfig.getColumnHeader('wind'),
                            cellFormat: '{value:.1f}'
                        },
                        precipitation: {
                            headerFormat: paramConfig.getColumnHeader('precipitation'),
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
                        type: activeParam.chartType,
                        animation: false,
                        animationLimit: 0
                    },
                    credits: {
                        enabled: true,
                        href: 'https://api.met.no/weatherapi/locationforecast/2.0/documentation',
                        text: 'MET Norway'
                    },
                    legend: {
                        enabled: false
                    },
                    colorAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        max: activeParam.max,
                        min: activeParam.min,
                        stops: activeParam.colorStops
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
                    subtitle: {
                        text: '----'
                    },
                    tooltip: {
                        enabled: true,
                        stickOnContact: true,
                        formatter: function () {
                            const point = this.point;

                            // Date + value
                            return Highcharts.dateFormat('%d/%m/%Y %H:%M<br />', point.x) +
                                Highcharts.numberFormat(point.y,
                                    activeParam.floatRes) + ' ' +
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
                            enabled: false
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
                        description: 'The chart is displaying forecasted temperature, wind or precipitation.'
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
                    // Pre-parsing for filtering incoming data
                    beforeParse: function (data) {
                        const retData = [];
                        const forecastData = data.properties.timeseries;

                        for (let i = 0; i < rangeConfig.hours; i++) {
                            const item = forecastData[i];

                            // Instant data
                            const instantData = item.data.instant.details;

                            // Data for next hour
                            const hourSpan = item.data.next_1_hours.details;

                            // Picks the parameters this application uses
                            retData.push({
                                // UTC -> milliseconds
                                time: new Date(item.time).getTime(),
                                temperature: instantData.air_temperature,
                                wind: instantData.wind_speed,
                                precipitation: hourSpan.precipitation_amount
                            });
                        }
                        return retData;
                    }
                }
            });
        }
    }

    // Update map (series 0 is the world map, series 1 the weather data)
    const worldMap = board.mountedComponents[0].component.chart.series[1];

    // Load active city
    await addCityToMap(board, citiesTable, worldMap, activeCity);
    await updateBoard(board, activeCity, activeParam.name);

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
    const forecastTable = await board.dataPool.getConnectorTable(city);
    const cityInfo = citiesTable.getRowObject(
        citiesTable.getRowIndexBy('city', city)
    );

    // Add city to world map
    worldMap.addPoint({
        name: cityInfo.city,
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        custom: {
            elevation: cityInfo.elevation
        },
        // First item in current data set
        y: forecastTable.columns.temperature[rangeConfig.first]
    });
}

// Get observation (accumulated or latest)
function getObservation(forecastTable, param) {
    if (param === 'precipitation') {
        let sum = 0;
        for (let i = rangeConfig.first; i < rangeConfig.hours; i++) {
            sum += forecastTable.columns[param][i];
        }
        return Math.round(sum);
    }
    return forecastTable.columns[param][rangeConfig.first];
}

// Update board after changing data set (city) or parameter
async function updateBoard(board, city, paramName,
    updateParam = true, updateCity = true) {

    // Parameter info
    const param = paramConfig[paramName];

    // Data access
    const dataPool = board.dataPool;

    const [
        worldMap,
        kpiGeoData,
        kpiTemperature,
        kpiWind,
        kpiRain,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    // Common to map and chart
    const colorAxis = {
        min: param.min,
        max: param.max,
        stops: param.colorStops
    };

    // Update city chart
    const options = cityChart.chartOptions;
    options.title.text = paramConfig.getColumnHeader(paramName, true) + ' forecast for ' + city;
    options.subtitle.text = Highcharts.dateFormat('%d/%m/%Y', Date.now());
    options.colorAxis = colorAxis;
    options.chart.type = param.chartType;

    await cityChart.update({
        connector: {
            id: city
        },
        columnAssignment: {
            time: 'x',
            temperature: paramName === 'temperature' ? 'y' : null,
            wind: paramName === 'wind' ? 'y' : null,
            precipitation: paramName === 'precipitation' ? 'y' : null
        },
        chartOptions: options
    });

    if (updateParam) {
        // Parameters update: e.g. temperature -> precipitation.
        // Affects: map

        // Update map properties
        await worldMap.chart.update({
            colorAxis: colorAxis,
            title: {
                text: paramConfig.getColumnHeader(paramName)
            }
        });

        // Update all map points (series 1: weather data)
        const mapPoints = worldMap.chart.series[1].data;

        for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
            // Forecast for city
            const forecastTable = await dataPool.getConnectorTable(
                mapPoints[i].name);

            mapPoints[i].update({
                y: getObservation(forecastTable, paramName)
            }, true);
        }
    }

    if (updateCity) {
        // City update: e.g. New York -> Winnipeg
        // Affects: KPIs and grid.
        const forecastTable = await dataPool.getConnectorTable(city);

        await kpiTemperature.update({
            value: getObservation(forecastTable, 'temperature')
        });

        await kpiWind.update({
            value: getObservation(forecastTable, 'wind')
        });

        await kpiRain.update({
            value: getObservation(forecastTable, 'precipitation')
        });

        // Update geo KPI
        const citiesTable = await dataPool.getConnectorTable('Cities');

        await kpiGeoData.update({
            title: city,
            value: citiesTable.getCellAsNumber(
                'elevation',
                citiesTable.getRowIndexBy('city', city)
            )
        });

        // Update grid
        await selectionGrid.update({
            connector: {
                id: city
            }
        });
    }
}

// Launch the application
setupBoard();
