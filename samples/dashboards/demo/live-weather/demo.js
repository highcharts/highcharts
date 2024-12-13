Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});
// Index of the data to be displayed in map, KPI and spline chart.
// The number is an offset from the current hour.
const rangeConfig = {
    first: 0, // 0: current observation
    hours: 24 // max: 19 days
};

// The current date is used in several charts
const currentDay = Highcharts.dateFormat('%B %e, %Y', Date.now());

// Windbarb series object (deleted when not showing wind)
let windbarbSeries = null;

// Weather parameter configuration
const paramConfig = {
    temperature: {
        name: 'temperature',
        descr: 'Temperature',
        unit: '˚C',
        min: -20,
        max: 40,
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
        descr: 'Wind speed',
        unit: 'm/s',
        min: 0,
        max: 30, // Hurricane > 32.7
        floatRes: 1,
        chartType: 'area',
        colorStops: [
            [0.0, '#C0CCC0'],
            [0.25, '#CCCC99'],
            [0.50, '#99CC66'],
            [0.75, '#336633']
        ]
    },
    windDir: {
        // Used by Windbarb and grid only
        name: 'windDir',
        descr: 'Wind dir.',
        unit: 'degr.'
    },
    precipitation: {
        name: 'precipitation',
        descr: 'Precipitation',
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
    getColumnHeader: function (param, unit = true) {
        const info = this[param];
        // First letter uppercase
        const name = info.descr;
        if (unit) {
            return `${name} ${info.unit}`;
        }
        return name;
    }
};

// Geolocation info: https://www.maps.ie/coordinates.html

// Selection of weather stations to display data from
const locations = {
    mapUrl: 'https://code.highcharts.com/mapdata/custom/north-america-no-central.topo.json',
    default: 'New York',
    points: [
        ['station', 'lat', 'lon', 'elevation', 'timeDifference'],
        ['New York', 40.71, -74.01, 10, 5],
        ['San Diego', 32.71, -117.16, 36, 8],
        ['Anchorage', 61.22, -149.89, 0, 9],
        ['Winnipeg', 49.90, -97.14, 236, 6],
        ['Monterrey', 25.68, -99.13, 540, 6],
        ['Baracoa', 20.35, -74.50, 15, 5]
    ]
};

function getTimeDifference(station) {
    const location = locations.points.find(point => point[0] === station);
    return location ? location[4] : 0; // Default to 0 if station not found
}

// Application configuration (weather station data set + data provider)
const weatherStationConfig = {
    location: locations, // Weather station data set

    // Base URL for weather forecast
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',

    // Build the full URL for accessing the data
    buildUrl: function (station) {
        for (let i = 1; i < this.location.points.length; i++) {
            const point = this.location.points[i];
            if (point[0] === station) {
                return this.baseUrl +
                    `?lat=${point[1]}&lon=${point[2]}&altitude=${point[3]}`;
            }
        }
        return null;
    }
};

// Common options for KPI charts
// - Adapted from https://www.highcharts.com/demo/dashboards/climate
const kpiGaugeOptions = {
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
    yAxis: {
        labels: {
            distance: '105%',
            y: 5,
            align: 'auto'
        },
        lineWidth: 2,
        minorTicks: false,
        tickWidth: 2,
        tickAmount: 2,
        visible: true
    },
    series: [{
        data: null, // Populated later
        dataLabels: {
            format: '{y:.1f}',
            y: -25
        },
        enableMouseTracking: false,
        innerRadius: '90%',
        radius: '120%'
    }],
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

// Launches the Dashboards application
async function setupDashboard() {
    let activeStation = weatherStationConfig.location.default;
    let activeParam = paramConfig.temperature;

    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                {
                    id: 'Stations',
                    type: 'JSON',
                    options: {
                        firstRowAsNames: true,
                        data: weatherStationConfig.location.points
                    }
                }
            ]
        },
        // GUI based on https://www.highcharts.com/demo/dashboards/climate
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        // Top left
                        id: 'station-map'
                    }, {
                        // Top right
                        id: 'kpi-layout',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'html-geo-info'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-temperature'
                                }, {
                                    id: 'kpi-wind'
                                }, {
                                    id: 'kpi-precipitation'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        // Bottom left
                        id: 'forecast-grid'
                    }, {
                        // Bottom right
                        id: 'forecast-chart'
                    }]
                }]
            }]
        },
        // Adapted from https://www.highcharts.com/demo/dashboards/climate
        components: [
            {
                cell: 'station-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    chart: {
                        map: await fetch(weatherStationConfig.location.mapUrl)
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
                        name: 'Stations',
                        data: [],
                        allowPointSelect: true,
                        dataLabels: [{
                            align: 'left',
                            crop: false,
                            enabled: true,
                            format: '{point.name}',
                            padding: 0,
                            verticalAlign: 'top',
                            x: -2,
                            y: 2
                        }, {
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
                                const station = e.point.name;
                                if (station !== activeStation) {
                                    // New station selected
                                    activeStation = station;
                                    updateBoard(
                                        board,
                                        activeStation,
                                        activeParam.name,
                                        false, // Parameter unchanged
                                        true // Station changed
                                    );
                                } else {
                                    // Re-select (otherwise marker is reset)
                                    setActiveStation();
                                }
                            }
                        },
                        marker: {
                            enabled: true,
                            lineWidth: 2,
                            radius: 12,
                            symbol: 'mapmarker',
                            states: {
                                select: {
                                    radiusPlus: 4
                                }
                            }
                        },
                        tooltip: {
                            footerFormat: '',
                            headerFormat: '',
                            pointFormat: (
                                '<b>{point.name}</b><br>' +
                                'Elevation: {point.custom.elevation} m<br>' +
                                '{point.y:.1f} {point.custom.unit}'
                            )
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
                            chartContainerLabel: 'Weather stations. ' +
                                'Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The chart is displaying forecasted ' +
                            'temperature.',
                        point: {
                            valueDescriptionFormat: '{value} degrees celsius,' +
                                ' {xDescription}, Location'
                        }
                    }
                }
            }, {
                cell: 'html-geo-info',
                type: 'HTML',
                elements: [{
                    tagName: 'div',
                    // textContent of children populated dynamically
                    children: [{
                        tagName: 'h2'
                    },
                    {
                        tagName: 'div',
                        attributes: {
                            id: 'geo-info'
                        },
                        children: [{
                            tagName: 'p',
                            attributes: {
                                id: 'lon',
                                name: 'Longitude'
                            }
                        }, {
                            tagName: 'p',
                            attributes: {
                                id: 'lat',
                                name: 'Latitude'
                            }
                        }, {
                            tagName: 'p',
                            attributes: {
                                id: 'elevation',
                                name: 'Elevation'
                            }
                        }]
                    }]
                }]
            },
            {
                cell: 'kpi-temperature',
                type: 'KPI',
                columnName: 'temperature',
                chartOptions: {
                    chart: kpiGaugeOptions.chart,
                    pane: kpiGaugeOptions.pane,
                    title: {
                        text: paramConfig.getColumnHeader(
                            'temperature', false
                        ) + ' (latest)',
                        verticalAlign: 'bottom'
                    },
                    yAxis: {
                        ...kpiGaugeOptions.yAxis,
                        min: paramConfig.temperature.min,
                        max: paramConfig.temperature.max,
                        accessibility: {
                            description: paramConfig.getColumnHeader(
                                'temperature'
                            )
                        }
                    },
                    series: [{
                        ...kpiGaugeOptions.series[0],
                        dataLabels: {
                            format: '{y:.1f} ' + paramConfig.temperature.unit,
                            y: kpiGaugeOptions.series[0].dataLabels.y
                        }
                    }]
                },
                events: {
                    click: function () {
                        // Update dashboard
                        activeParam = paramConfig.temperature;
                        // Parameter changed, station unchanged
                        updateBoard(
                            board, activeStation,
                            'temperature', true, false
                        );
                    }
                },
                states: {
                    active: {
                        enabled: true,
                        isActive: true
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
                    chart: kpiGaugeOptions.chart,
                    pane: kpiGaugeOptions.pane,
                    title: {
                        text: paramConfig.getColumnHeader(
                            'wind', false
                        ) + ' (latest)',
                        verticalAlign: 'bottom'
                    },
                    yAxis: {
                        ...kpiGaugeOptions.yAxis,
                        min: paramConfig.wind.min,
                        max: paramConfig.wind.max,
                        accessibility: {
                            description: paramConfig.getColumnHeader('wind')
                        }
                    },
                    series: [{
                        ...kpiGaugeOptions.series[0],
                        dataLabels: {
                            format: '{y:.1f} ' + paramConfig.wind.unit,
                            y: kpiGaugeOptions.series[0].dataLabels.y
                        }
                    }]
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.wind;
                        // Parameter changed, station unchanged
                        updateBoard(board, activeStation, 'wind', true, false);
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
                    chart: kpiGaugeOptions.chart,
                    pane: kpiGaugeOptions.pane,
                    title: {
                        text: paramConfig.getColumnHeader(
                            'precipitation', false
                        ) + ' (next 24 hours)',
                        verticalAlign: 'bottom'
                    },
                    yAxis: {
                        ...kpiGaugeOptions.yAxis,
                        min: paramConfig.precipitation.min,
                        max: 50, // Per 24 hours
                        accessibility: {
                            description: paramConfig.getColumnHeader(
                                'precipitation'
                            )
                        }
                    },
                    series: [{
                        ...kpiGaugeOptions.series[0],
                        dataLabels: {
                            format: '{y:.1f} ' + paramConfig.precipitation.unit,
                            y: kpiGaugeOptions.series[0].dataLabels.y
                        }
                    }]
                },
                events: {
                    click: function () {
                        // Update board
                        activeParam = paramConfig.precipitation;
                        // Parameter changed, station unchanged
                        updateBoard(
                            board, activeStation,
                            'precipitation', true, false
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
                cell: 'forecast-grid',
                type: 'DataGrid',
                title: {
                    enabled: true,
                    text: 'Forecast for ' + currentDay
                },
                sync: {
                    highlight: true
                },
                dataGridOptions: {
                    credits: {
                        enabled: false
                    },
                    columns: [{
                        id: 'time',
                        header: {
                            format: 'Local Time'
                        },
                        cells: {
                            formatter: function () {
                                return Highcharts.dateFormat(
                                    '%I:%M %p', this.value
                                );
                            }
                        }
                    }, {
                        id: 'temperature',
                        header: {
                            format: paramConfig.getColumnHeader('temperature')
                        },
                        cells: {
                            format: '{value:.1f}'
                        }
                    }, {
                        id: 'wind',
                        header: {
                            format: paramConfig.getColumnHeader('wind')
                        },
                        cells: {
                            format: '{value:.1f}'
                        }
                    }, {
                        id: 'windDir',
                        header: {
                            format: paramConfig.getColumnHeader('windDir')
                        },
                        cells: {
                            format: '{value:.0f} {log}'
                        }
                    }, {
                        id: 'precipitation',
                        header: {
                            format: paramConfig.getColumnHeader('precipitation')
                        },
                        cells: {
                            format: '{value:.1f}'
                        }
                    }]
                }
            }, {
                cell: 'forecast-chart',
                type: 'Highcharts',
                sync: {
                    highlight: true
                },
                chartOptions: {
                    chart: {
                        spacing: [40, 40, 40, 10],
                        styledMode: true,
                        type: activeParam.chartType
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
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size: 10px">' +
                                    '{point.x:%B %e, %Y, %l:%M %p}</span><br/>',
                                pointFormatter: function () {
                                    return this.y + ' ' + activeParam.unit;
                                }
                            }
                        },
                        windbarb: {
                            tooltip: {
                                headerFormat: '<span style="font-size: 10px">' +
                                    '{point.x:%B %e, %Y, %l:%M %p}</span><br/>',
                                pointFormat: '<b>{point.value:.2f} m/s</b> ' +
                                    // eslint-disable-next-line max-len
                                    '({point.beaufort})<br/>Wind direction: ' +
                                    // eslint-disable-next-line max-len
                                    '{point.series.directionData.(point.index)::.0f}',
                                pointFormatter: null
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
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            format: '{value:%l:%M %p}',
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
                            chartContainerLabel: 'Weather stations. ' +
                                'Highcharts Interactive Map.'
                        }
                    },
                    accessibility: {
                        description: 'The chart is displaying forecasted ' +
                            'temperature, wind or precipitation.'
                    }
                }
            }]
    }, true);

    const dataPool = board.dataPool;
    const stationsTable = await dataPool.getConnectorTable('Stations');
    const stationRows = stationsTable.getRowObjects();

    // Add weather station sources
    for (let i = 0, iEnd = stationRows.length; i < iEnd; ++i) {
        const station = stationRows[i].station;
        const url = weatherStationConfig.buildUrl(station);

        if (!url) {
            continue;
        }

        dataPool.setConnectorOptions({
            id: station,
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                dataUrl: url,
                // Pre-parsing for filtering incoming data
                beforeParse: function (data) {
                    const retData = [];
                    const forecastData = data.properties.timeseries;

                    // Get the time difference for the current station
                    const timeDifference = getTimeDifference(station);

                    for (let i = 0; i < rangeConfig.hours; i++) {
                        const item = forecastData[i];

                        // Instant data
                        const instantData = item.data.instant.details;

                        // Data for the next hour
                        const hourSpan = item.data.next_1_hours.details;

                        // Convert UTC time to local time
                        const localTime = new Date(item.time).getTime() -
                            timeDifference * 3600000;

                        // Picks the parameters this application uses
                        retData.push({
                            time: localTime,
                            temperature: instantData.air_temperature,
                            precipitation: hourSpan.precipitation_amount,
                            wind: instantData.wind_speed,
                            windDir: instantData.wind_from_direction
                        });
                    }
                    return retData;
                }
            }
        });
    }

    // Update map (series 0 is the world map, series 1 the weather data)
    const mapChart = getMapChart(board);

    // Load active weather station
    await addStationToMap(board, stationsTable, mapChart, activeStation);
    await updateBoard(board, activeStation, activeParam.name);

    // Select active weather station on the map
    setActiveStation();

    // Load additional cities
    for (let i = 0; i < stationRows.length; i++) {
        const station = stationRows[i].station;
        if (station !== activeStation) {
            await addStationToMap(board, stationsTable, mapChart, station);
        }
    }

    // HELPER functions

    // Get map chart
    function getMapChart(board) {
        // Update map (series 0 is the world map, series 1 the weather data)
        return board.mountedComponents[0].component.chart.series[1];
    }

    // Select a weather station on the map
    function setActiveStation() {
        const mapData = getMapChart(board).data;
        for (let i = 0; i < mapData.length; i++) {
            if (mapData[i].name === activeStation) {
                mapData[i].select();
                break;
            }
        }
    }
}

// Add weather station to map
async function addStationToMap(board, stationsTable, stationMap, station) {
    const forecastTable = await board.dataPool.getConnectorTable(station);
    const stationInfo = stationsTable.getRowObject(
        stationsTable.getRowIndexBy('station', station)
    );

    // Add weather station to world map
    stationMap.addPoint({
        name: stationInfo.station,
        lat: stationInfo.lat,
        lon: stationInfo.lon,
        custom: {
            elevation: stationInfo.elevation,
            unit: paramConfig.temperature.unit
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

// Update board after changing weather station or parameter (measurement type)
async function updateBoard(
    board, station, paramName,
    paramChanged = true, stationChanged = true
) {
    // Parameter info
    const param = paramConfig[paramName];

    // Data access
    const dataPool = board.dataPool;

    // Geographical information
    const stationsTable = await dataPool.getConnectorTable('Stations');

    const [
        // The order here must be the same as in the component
        // definition in the Dashboard.
        stationMap,
        htmlGeoInfo,
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

    // Update forecast chart
    const options = cityChart.chartOptions;
    const isWind = paramName === 'wind';

    const title = isWind ?
        'Wind' : paramConfig.getColumnHeader(paramName, false);
    options.title.text = title + ' forecast for ' + station;
    options.subtitle.text = currentDay;
    options.colorAxis = colorAxis;
    options.chart.type = param.chartType;
    options.xAxis.offset = isWind ? 40 : 0; // Allow space for Windbarb

    const chart = cityChart.chart;

    // Handle auxiliary series (Windbarb)
    if (windbarbSeries !== null) {
        // Remove any existing Windbarb series
        await windbarbSeries.remove();
        windbarbSeries = null;
    }

    await cityChart.update({
        connector: {
            id: station,
            columnAssignment: [{
                seriesId: paramName,
                data: ['time', paramName]
            }]
        },
        chartOptions: options
    });

    if (isWind) {
        // Add Windbarb series
        const forecastTable = await dataPool.getConnectorTable(station);

        // Create series data
        const data = [];
        for (let i = rangeConfig.first; i < rangeConfig.hours; i++) {
            const windSpeed = forecastTable.columns.wind[i];
            const windDir = forecastTable.columns.windDir[i];
            data.push([windSpeed, windDir]);
        }

        // Add series (and store for removal)
        windbarbSeries = await chart.addSeries({
            type: 'windbarb',
            pointStart: forecastTable.columns.time[0],
            pointInterval: 36e5,
            data: data
        });
    }

    if (paramChanged) {
        // Parameters update: e.g. temperature -> precipitation.
        // Affects: map

        // Update all map points (series 1: weather data)
        const mapPoints = stationMap.chart.series[1].data;

        for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
            // Forecast for station
            const station = mapPoints[i].name;
            const forecastTable = await dataPool.getConnectorTable(station);
            const elevation = stationsTable.getCellAsNumber(
                'elevation', stationsTable.getRowIndexBy('station', station)
            );

            mapPoints[i].update({
                y: getObservation(forecastTable, paramName),
                custom: {
                    elevation: elevation,
                    unit: param.unit
                }
            }, false);
        }

        // Update map properties and redraw
        stationMap.chart.update({
            colorAxis: colorAxis,
            title: {
                text: paramConfig.getColumnHeader(paramName)
            }
        });
    }

    if (stationChanged) {
        // Weather station changed: e.g. New York -> Winnipeg
        // Affects: KPIs and grid.
        const forecastTable = await dataPool.getConnectorTable(station);

        await kpiTemperature.update({
            value: getObservation(forecastTable, 'temperature')
        });

        await kpiWind.update({
            value: getObservation(forecastTable, 'wind')
        });

        await kpiRain.update({
            value: getObservation(forecastTable, 'precipitation')
        });

        // Update geo-info HTML
        const options = htmlGeoInfo.getOptions();
        const html = options.elements[0];
        const stationRow = stationsTable.getRowIndexBy('station', station);

        html.children[0].textContent = 'Forecast for ' + station;

        const geoInfo = html.children[1].children;
        for (let i = 0; i < geoInfo.length; i++) {
            const attr = geoInfo[i].attributes;
            const value = stationsTable.getCellAsNumber(attr.id, stationRow);
            const unit = attr.id === 'elevation' ? 'm.' : 'degr.';

            geoInfo[i].textContent = `${attr.name}: ${value} ${unit}`;
        }

        await htmlGeoInfo.update(options);

        // Update grid
        await selectionGrid.update({
            connector: {
                id: station
            }
        });
    }
}

// Launch the application
setupDashboard();
