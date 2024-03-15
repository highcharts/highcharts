Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'VegeTable',
            type: 'CSV',
            options: {
                csv: document.querySelector('#csv').innerHTML
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'top-left'
                }, {
                    id: 'top-right'
                }]
            }, {
                cells: [{
                    id: 'bottom'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'top-left',
        type: 'Highcharts',
        sync: {
            highlight: true
        },
        connector: {
            id: 'VegeTable'
        },
        chartOptions: {
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    enabled: false
                }
            }
        }
    }, {
        renderTo: 'top-right',
        type: 'Highcharts',
        sync: {
            highlight: true
        },
        connector: {
            id: 'VegeTable'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    innerSize: '60%'
                },
                series: {
                    colorByPoint: true
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    enabled: false
                }
            }
        }
    }, {
        renderTo: 'bottom',
        type: 'Highcharts',
        sync: {
            highlight: true
        },
        connector: {
            id: 'VegeTable'
        },
        chartOptions: {
            chart: {
                type: 'scatter'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    dataSorting: {
                        enabled: true,
                        sortKey: 'y'
                    },
                    marker: {
                        radius: 8
                    }
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    enabled: false
                }
            }
        }
    }]
});
