/* eslint-disable jsdoc/require-description */

// Layout
// ! -------------------- !
// ! KPI          ! HTML  !
// ! -------------!------ !
// ! Map          ! Chart !
// ! -------------------- !
// ! Data grid            !
// ! -------------------- !


// Launches the Dashboards application
async function setupDashboard() {
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [
                {
                    id: 'States',
                    type: 'CSV',
                    options: {
                        firstRowAsNames: true,
                        data: [] // TBD
                    }
                }
            ]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        // Top left
                        id: 'kpi-result'
                    }, {
                        // Top right
                        id: 'html-control'
                    }]
                }, {
                    cells: [{
                        // Mid left
                        id: 'us-map'
                    }, {
                        // Mid right
                        id: 'election-chart'
                    }]
                }, {
                    cells: [{
                        // Spanning all columns
                        id: 'selection-grid'
                    }]
                }]
            }]
        },
        components: [
            {
                renderTo: 'us-map',
                type: 'Highcharts',
                chartConstructor: 'mapChart',
                chartOptions: {
                    chart: {
                        map: await fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json')
                            .then(response => response.json())
                    },
                    title: {
                        text: 'Presidential election results by state'
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
                        name: 'US map'
                    }, {
                        type: 'mappoint',
                        name: 'Cities',
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
                                const city = e.point.name;
                                /*
                                if (city !== activeCity) {
                                    // New city
                                    activeCity = city;
                                    updateBoard(
                                        board,
                                        activeCity,
                                        '',
                                        false, // No parameter update
                                        true // Data set update
                                    );
                                } else {
                                    // Re-select (otherwise marker is reset)
                                    selectActiveCity();
                                }
                                */
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
                renderTo: 'kpi-result',
                type: 'KPI',
                columnName: 'result',
                title: {
                    enabled: true,
                    text: 'National presidential election results'
                }
            }, {
                renderTo: 'html-control',
                title: {
                    enabled: true,
                    text: 'Election year'
                },

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
                renderTo: 'selection-grid',
                type: 'DataGrid',
                title: {
                    enabled: true,
                    text: 'Presidential election results by state'
                },
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
                                return Highcharts.dateFormat('%H:%M', this.value);
                            }
                        }
                    }
                }
            }, {
                renderTo: 'election-chart',
                title: {
                    enabled: true,
                    text: 'Historical presidential election results'
                },

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
                        type: 'column'
                    },
                    credits: {
                        enabled: true,
                        href: 'https://api.met.no/weatherapi/locationforecast/2.0/documentation',
                        text: 'MET Norway'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: true,
                                symbol: 'circle'
                            },
                            tooltip: {
                                pointFormatter: function () {
                                    return this.y;
                                }
                            }
                        }
                    },
                    title: {
                        margin: 20,
                        x: 15,
                        y: 5,
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            format: '{value:%H:%M}',
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
                            description: 'TBD'
                        }
                    },
                    lang: {
                        accessibility: {
                            chartContainerLabel: 'Presidential election results.'
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

    // Update map (series 0 is the world map, series 1 the weather data)
    const mapChart = getMapChart(board);

    // Load active city
    // await updateBoard(board, activeCity, '');

    // HELPER functions

    // Get map chart
    function getMapChart(board) {
        // Update map (series 0 is the world map, series 1 the weather data)
        return board.mountedComponents[0].component.chart.series[1];
    }
}


// Update board after changing data set (city) or parameter (measurement type)
async function updateBoard(board, city, paramName,
    paramUpdated = true, cityUpdated = true) {

    // Parameter info
    // const param = paramConfig[paramName];

    // Data access
    const dataPool = board.dataPool;

    // Geographical information
    const citiesTable = await dataPool.getConnectorTable('Cities');

    const [
        // The order here must be the same as in the component
        // definition in the Dashboard.
        worldMap
    ] = board.mountedComponents.map(c => c.component);

    if (paramUpdated) {
        // Parameters update: e.g. temperature -> precipitation.
        // Affects: map

        // Update map properties
        await worldMap.chart.update({
            title: {
                // text: paramConfig.getColumnHeader(paramName)
            }
        });

        // Update all map points (series 1: weather data)
        const mapPoints = worldMap.chart.series[1].data;
    }
}

// Launch the application
setupDashboard();
