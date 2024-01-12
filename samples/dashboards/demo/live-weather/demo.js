/* eslint-disable jsdoc/require-description */

// Forecast data
const configMet = {
    /*
Buenos Aires,Argentine Republic,10,-34.60,-34.75,-58.38,-58.25,https://assets.highcharts.com/dashboard-demodata/climate/cities/-34.6_-58.38.csv
Dublin,Republic of Ireland,8,53.35,53.25,-6.26,-6.25,https://assets.highcharts.com/dashboard-demodata/climate/cities/53.35_-6.26.csv
New York,United States of America,10,40.71,40.75,-74.01,-74.25,https://assets.highcharts.com/dashboard-demodata/climate/cities/40.71_-74.01.csv
Sydney,Commonwealth of Australia,35,-33.87,-33.75,151.21,151.25,https://assets.highcharts.com/dashboard-demodata/climate/cities/-33.87_151.21.csv
Tokyo,Japan,17,35.69,35.75,139.69,139.75,https://assets.highcharts.com/dashboard-demodata/climate/cities/35.69_139.69.csv
*/
    cities: {
        'New York': {
            name: 'New York',
            lat: 40.71,
            lon: -74.01,
            alt: 10
        },
        Dublin: {
            name: 'Dublin',
            lat: 53.35,
            lon: -6.26,
            alt: 8
        },
        Sydney: {
            name: 'Sydney',
            lat: -33.87,
            lon: 151.21,
            alt: 35
        },
        'Buenos Aires': {
            name: 'Buenos Aires',
            lat: -34.60,
            lon: -58.38,
            alt: 10
        },
        Tokyo: {
            name: 'Tokyo',
            lat: 35.69,
            lon: 139.69,
            alt: 17
        },
        Johannesburg: {
            name: 'Johannesburg',
            lat: -26.20,
            lon: 28.034,
            alt: 1767
        }
    },
    baseUrl: 'https://api.met.no/weatherapi/locationforecast/2.0/compact?',
    buildUrl: function (id) {
        if (id in this.cities) {
            const city = this.cities[id];
            const ret = this.baseUrl +
                `lat=${city.lat}&lon=${city.lon}&altitude=${city.alt}`;

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
        stops: colorStopsTemperature,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

function parseMetData(data) {
    const retData = [];
    const obsData = data.properties.timeseries;

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


async function setupBoard() {
    let activeCity = 'Tokyo';

    // Initialize board with most basic data
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                {
                    id: 'Cities',
                    type: 'CSV',
                    options: {
                        csvURL: (
                            'https://www.highcharts.com/samples/data/climate-cities-limited.csv'
                        )
                    }
                }, {
                    type: 'JSON',
                    id: activeCity,
                    options: {
                        firstRowAsNames: false,
                        dataUrl: configMet.buildUrl(activeCity),
                        beforeParse: parseMetData
                    }
                }
            ]
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
                            headerFormat: 'Time'
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
        const city = cityRows[i].city;
        const url = configMet.buildUrl(city);

        if (url !== null) {
            dataPool.setConnectorOptions({
                id: city,
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    dataUrl: url,
                    beforeParse: parseMetData
                }
            });
        }
    }

    // Load active city
    await setupCity(board, activeCity);
    await updateBoard(board, activeCity, true);

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
    // Debug
    if (!(city in configMet.cities)) {
        return;
    }

    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('Cities');
    const forecastTable = await dataPool.getConnectorTable(city);
    const worldMap = board.mountedComponents[0].component.chart.series[1];

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
        y: forecastTable.columns.temperature[0] // Latest observation
    });
}

async function updateBoard(board, city, newData) {
    // Debug
    if (!(city in configMet.cities)) {
        return;
    }
    const dataPool = board.dataPool;
    const colorMin = tempRange.minC;
    const colorMax = tempRange.maxC;
    const colorStops = colorStopsTemperature;
    const citiesTable = await dataPool.getConnectorTable('Cities'); // Geographical data

    const [
        worldMap,
        kpiGeoData,
        kpiTemperature,
        kpiPressure,
        kpiHumidity,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    // Update world map
    const mapPoints = worldMap.chart.series[1].data;

    for (let i = 0, iEnd = mapPoints.length; i < iEnd; ++i) {
        // Get elevation of city
        const cityName = mapPoints[i].name;
        const cityInfo = citiesTable.getRowObject(citiesTable.getRowIndexBy('city', cityName));
        const forecastTable = await dataPool.getConnectorTable(cityName);

        mapPoints[i].update({
            custom: {
                elevation: cityInfo.elevation,
                yScale: 'C'
            },
            y: forecastTable.columns.temperature[0]
        }, false);
    }
    worldMap.chart.update({
        colorAxis: {
            min: colorMin,
            max: colorMax,
            stops: colorStops
        }
    });

    // Update KPI
    const forecastTable = await dataPool.getConnectorTable(city);

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
            columnAssignment: {
                time: 'x',
                temperature: 'y'
            },
            chartOptions: options
        });
    }
}
