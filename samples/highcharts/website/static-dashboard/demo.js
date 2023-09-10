const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'sample',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            connector: {
                id: 'sample'
            },
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A - % DV': 'y'
            },
            title: {
                text: ''
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                legend: {
                    enabled: false,
                    verticalAlign: 'top'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '% Daily Values of Vitamin A',
                    y: 20
                },
                subtitle: {
                    useHTML: true,
                    text: '<p>DV = 700mcg - 900mcg (based on age and gender)</p>',
                    y: 30
                },
                chart: {
                    animation: false,
                    type: 'packedbubble',
                    margin: [50, 0, 0, 0],
                    spacing: [0, 0, 0, 0],
                    events: {
                        load: function () {
                            const chart = this;
                            console.log(chart.chartWidth);
                        }
                    }
                },
                tooltip: {
                    headerFormat: '{point.key}: ',
                    pointFormat: '{point.y}% Daily Value'
                },
                plotOptions: {
                    series: {
                        colorByPoint: true,
                        minSize: 30,
                        maxSize: 80,
                        dataLabels: {
                            enabled: true,
                            format: '{key}',
                            allowOverlap: false
                        }
                    }
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 385
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    minSize: 40,
                                    maxSize: 80
                                }
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 386,
                            maxWidth: 485
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    minSize: 50,
                                    maxSize: 90
                                }
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 486
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    minSize: 70,
                                    maxSize: 150
                                }
                            }
                        }
                    }]
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            connector: {
                id: 'sample'
            },
            editable: true,
            title: {
                text: ''
            },
            sync: {
                highlight: true
            }
        }
    ]
}, true);

[...document.querySelectorAll('input[name="color-mode"]')]
    .forEach(input => {
        input.addEventListener('click', e => {
            document.getElementById('container').className =
                e.target.value === 'none' ? '' : `highcharts-${e.target.value}`;
        });
    });
