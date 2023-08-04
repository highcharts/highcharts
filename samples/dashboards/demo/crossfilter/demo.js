(async () => {

    let board = void 0;

    // Crossfilter a connector table
    async function setCrossfilter(
        connectorId,
        column,
        axis,
        extremes
    ) {
        // Get DataTable from data pool
        const table = await board.dataPool.getConnectorTable(connectorId);

        // Extract column values from axis
        const names = axis.names;
        const minValue = names[Math.round(
            typeof extremes.min === 'number' ?
                extremes.min :
                axis.dataMin
        )];
        const maxValue = names[Math.round(
            typeof extremes.max === 'number' ?
                extremes.max :
                axis.dataMax
        )];

        // Configure and apply range
        const modifier = table.getModifier();
        for (const range of modifier.options.ranges) {
            if (range.column === column) {
                range.minValue = minValue;
                range.maxValue = maxValue;
                break;
            }
        }
        await table.setModifier(modifier);
    }

    // Dashboard with crossfilter
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Countries',
                type: 'CSV',
                options: {
                    csv: document.getElementById('csv').innerHTML,
                    decimalPoint: '.',
                    itemDelimiter: ',',
                    dataModifier: {
                        type: 'Range',
                        ranges: [{
                            column: 'Year',
                            minValue: 2020,
                            maxValue: 2020
                        }]
                    }
                }
            }, {
                id: 'Economy',
                type: 'CSV',
                options: {
                    csv: document.getElementById('csv').innerHTML,
                    decimalPoint: '.',
                    itemDelimiter: ',',
                    dataModifier: {
                        type: 'Range',
                        ranges: [{
                            column: 'Country',
                            minValue: 'Afghanistan',
                            maxValue: 'Zimbabwe'
                        }, {
                            column: 'Year',
                            minValue: 1995,
                            maxValue: 2020
                        }]
                    }
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'Top'
                    }]
                }, {
                    cells: [{
                        id: 'Middle-left'
                    }, {
                        id: 'Middle-right'
                    }]
                }, {
                    cells: [{
                        id: 'Bottom'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'Top',
            type: 'HTML',
            elements: [
                '<h2 style="text-align:center">Economic Acitivity</h2>'
            ]
        }, {
            cell: 'Middle-left',
            type: 'Highcharts',
            connector: {
                id: 'Countries'
            },
            columnAssignment: {
                Country: 'x',
                Agriculture: 'y',
                Industry: 'y',
                Services: 'y'
            },
            chartOptions: {
                title: {
                    text: 'Countries'
                },
                subtitle: {
                    text: 'Select a range'
                },
                chart: {
                    zooming: {
                        type: 'x'
                    }
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false,
                            radius: 1
                        },
                        stickyTracking: false
                    }
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top'
                },
                tooltip: {
                    positioner: () => ({ x: 10, y: 10 }),
                    shadow: false,
                    shared: true,
                    valueSuffix: '%'
                },
                yAxis: {
                    visible: false
                },
                xAxis: {
                    type: 'category',
                    minRange: 0.5,
                    labels: {
                        rotation: 90
                    },
                    events: {
                        setExtremes: function (extremes) {
                            setCrossfilter('Economy', 'Country', this, extremes);
                        }
                    }
                }
            }
        }, {
            cell: 'Middle-right',
            type: 'Highcharts',
            chartOptions: {
                title: {
                    text: 'Years'
                },
                subtitle: {
                    text: 'Select a range'
                },
                chart: {
                    type: 'timeline',
                    zooming: {
                        type: 'x'
                    }
                },
                series: [{
                    data: [
                        { name: '1995' },
                        { name: '2005' },
                        { name: '2010' },
                        { name: '2015' },
                        { name: '2018' },
                        { name: '2019' },
                        { name: '2020' }
                    ]
                }],
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: false
                },
                yAxis: {
                    visible: false
                },
                xAxis: {
                    minRange: 0.5,
                    visible: false,
                    events: {
                        setExtremes: function (extremes) {
                            setCrossfilter('Economy', 'Year', this, extremes);
                        }
                    }
                }
            }
        }, {
            cell: 'Bottom',
            type: 'DataGrid',
            connector: {
                id: 'Economy'
            }
        }]
    });

    console.log(board);

})();
