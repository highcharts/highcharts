(async () => {
    const board = await Dashboards.board('container', {
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
                        id: 'Top-left'
                    }, {
                        id: 'Top-right'
                    }]
                }, {
                    cells: [{
                        id: 'Center'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'Top-left',
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
                    text: '1 - 145'
                },
                chart: {
                    zooming: {
                        type: 'x'
                    }
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
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
                    shadow: false
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
                        // crossfilter countries
                        setExtremes: async function (extremes) {
                            const countries = this.names;
                            const min = (
                                typeof extremes.min === 'number' ?
                                    extremes.min :
                                    this.dataMin
                            );
                            const firstCountry = countries[Math.round(min)];
                            const max = (
                                typeof extremes.max === 'number' ?
                                    extremes.max :
                                    this.dataMax
                            );
                            const lastCountry = countries[Math.round(max)];

                            const table = await board.dataPool
                                .getConnectorTable('Economy');
                            const modifier = table.getModifier();

                            modifier.options.ranges[0].minValue = firstCountry;
                            modifier.options.ranges[0].maxValue = lastCountry;

                            await table.setModifier(modifier);
                        }
                    }
                }
            }
        }, {
            cell: 'Top-right',
            type: 'Highcharts',
            chartOptions: {
                title: {
                    text: 'Years'
                },
                subtitle: {
                    text: '1995 - 2020'
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
                        // crossfilter years
                        setExtremes: async function (extremes) {
                            const years = this.names;
                            const min = (
                                typeof extremes.min === 'number' ?
                                    extremes.min :
                                    this.dataMin
                            );
                            const minYear =
                                parseInt(years[Math.round(min)], 10);
                            const max = (
                                typeof extremes.max === 'number' ?
                                    extremes.max :
                                    this.dataMax
                            );
                            const maxYear =
                                parseInt(years[Math.round(max)], 10);

                            const table = await board.dataPool
                                .getConnectorTable('Economy');
                            const modifier = table.getModifier();

                            modifier.options.ranges[1].minValue = minYear;
                            modifier.options.ranges[1].maxValue = maxYear;

                            await table.setModifier(modifier);
                        }
                    }
                }
            }
        }, {
            cell: 'Center',
            type: 'DataGrid',
            connector: {
                id: 'Economy'
            },
            title: 'Economic Acitivity'
        }]
    });

    console.log(board);

})();
