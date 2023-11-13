const plotLines = [{
        label: {
            text: 'Today',
            align: 'right'
        },
        value: Date.UTC(2023, 5, 4)
    }],
    plotBands = [{
        from: Date.UTC(2023, 4, 8),
        to: Date.UTC(2023, 4, 22)
    }];

Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        text: ''
    }
});

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'cumulativeData',
            type: 'JSON',
            options: {
                data: [
                    ['Date', 'Done', 'To Do', 'Blocked'],
                    [Date.UTC(2023, 4, 1), 0, 156, 30],
                    [Date.UTC(2023, 4, 8), 23, 134, 30],
                    [Date.UTC(2023, 4, 15), 45, 111, 30],
                    [Date.UTC(2023, 4, 22), 68, 89, 13],
                    [Date.UTC(2023, 4, 29), 85, 93, 2],
                    [Date.UTC(2023, 5, 5), 113, 44, 8],
                    [Date.UTC(2023, 5, 12), null, 21, 2]
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                id: 'current-sprint',
                cells: [{
                    id: 'dashboard-header',
                    width: '100%',
                    height: 50
                }, {
                    layout: {
                        rows: [{
                            cells: [{
                                id: 'dashboard-kpi-1',
                                height: 300,
                                responsive: {
                                    small: {
                                        width: '100%'
                                    },
                                    medium: {
                                        width: '50%'
                                    },
                                    large: {
                                        width: '50%'
                                    }
                                }
                            }, {
                                id: 'dashboard-kpi-2',
                                height: 300
                            }]
                        }]
                    }
                }, {
                    id: 'dashboard-kpi-4',
                    height: 300,
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '100%'
                        },
                        large: {
                            width: '50%'
                        }
                    }
                }]
            }, {
                id: 'charts-1',
                cells: [{
                    id: 'dashboard-chart-1',
                    height: 350,
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '100%'
                        },
                        large: {
                            width: '2/5'
                        }
                    }
                }, {
                    id: 'dashboard-chart-2',
                    height: 350,
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '100%'
                        },
                        large: {
                            width: '3/5'
                        }
                    }
                }]
            }, {
                id: 'cumulative',
                cells: [{
                    id: 'dashboard-chart-cumulative',
                    height: 350
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-header',
        type: 'HTML',
        elements: [{
            tagName: 'div',
            id: 'dashboard-title',
            children: [{
                tagName: 'h2',
                textContent: 'Current sprint',
                attributes: {
                    id: 'main-title'
                }
            }]
        }]
    }, {
        cell: 'dashboard-kpi-1',
        type: 'KPI',
        title: 'Completed tasks',
        subtitle: 'task completed',
        value: 28,
        chartOptions: {
            series: [{
                type: 'column',
                enableMouseTracking: false,
                name: 'Previous sprints',
                data: [0, 23, 22, 23, 17, 28]
            }]
        }
    }, {
        cell: 'dashboard-kpi-2',
        type: 'KPI',
        title: 'Incomplete tasks',
        subtitle: 'to be done',
        value: 10,
        chartOptions: {
            series: [{
                type: 'column',
                name: 'Previous sprints',
                enableMouseTracking: false,
                data: [20, 18, 23, 14, 19]
            }]
        }
    }, {
        cell: 'dashboard-kpi-4',
        type: 'Highcharts',
        title: 'Task by status',
        chartOptions: {
            xAxis: {
                categories: ['Done', 'To Do', 'In Progress', 'Blocked']
            },
            series: [{
                type: 'pie',
                keys: ['name', 'y'],
                data: [
                    ['Done', 113],
                    ['To Do', 21],
                    ['In Progress', 38],
                    ['Blocked', 8]
                ],
                innerSize: '50%',
                size: '110%',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }],
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'center',
                layout: 'vertical'
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 450
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        }
                    }
                }]
            }
        }
    }, {
        cell: 'dashboard-chart-1',
        type: 'Highcharts',
        title: 'Total task by assignee',
        chartOptions: {
            xAxis: {
                categories: ['Dev 1', 'Dev 2', 'Dev 3', 'Dev 4', 'Dev 5']
            },
            series: [{
                type: 'column',
                data: [41, 28, 15, 14, 4]
            }],
            legend: {
                enabled: false
            }
        }
    }, {
        cell: 'dashboard-chart-2',
        type: 'Highcharts',
        title: 'Timeline',
        chartConstructor: 'ganttChart',
        chartOptions: {
            xAxis: [{
                plotLines,
                plotBands,
                dateTimeLabelFormats: {
                    day: '%e<br><span style="opacity: 0.5; font-size: 0.7em">%a</span>'
                },
                grid: {
                    borderWidth: 0
                }
            }],
            yAxis: {
                visible: false,
                staticScale: 20
            },
            plotOptions: {
                series: {
                    borderRadius: '50%',
                    groupPadding: 0,
                    colorByPoint: false,
                    dataLabels: [{
                        enabled: true,
                        format: '{point.name}'
                    }]
                }
            },
            tooltip: {
                headerFormat: ''
            },
            series: [{
                data: [
                    {
                        name: 'F:1352',
                        start: Date.UTC(2023, 4, 1),
                        end: Date.UTC(2023, 4, 22)
                    }, {
                        name: 'I.20-00',
                        start: Date.UTC(2023, 4, 1),
                        end: Date.UTC(2023, 4, 8)
                    }, {
                        name: 'I.20-01',
                        start: Date.UTC(2023, 4, 8),
                        end: Date.UTC(2023, 4, 15)
                    }, {
                        name: 'F:2741',
                        start: Date.UTC(2023, 4, 15),
                        end: Date.UTC(2023, 5, 5)
                    }, {
                        name: 'I.20-02',
                        start: Date.UTC(2023, 4, 15),
                        end: Date.UTC(2023, 4, 22)
                    }, {
                        name: 'I.20-03',
                        start: Date.UTC(2023, 4, 22),
                        end: Date.UTC(2023, 4, 29)
                    }, {
                        name: 'I.20-04',
                        start: Date.UTC(2023, 4, 29),
                        end: Date.UTC(2023, 5, 5)
                    }, {
                        name: 'I.20-05',
                        start: Date.UTC(2023, 5, 5),
                        end: Date.UTC(2023, 5, 12)
                    }, {
                        name: 'F:1982',
                        start: Date.UTC(2023, 4, 1),
                        end: Date.UTC(2023, 4, 29)
                    }, {
                        name: 'F:673',
                        start: Date.UTC(2023, 4, 29),
                        end: Date.UTC(2023, 5, 12)
                    }
                ]
            }]
        }
    }, {
        cell: 'dashboard-chart-cumulative',
        type: 'Highcharts',
        title: 'Cumulative flow',
        connector: {
            id: 'cumulativeData'
        },
        columnAssignment: {
            Date: 'x',
            Done: 'y',
            'To Do': 'y',
            Blocked: 'y'
        },
        chartOptions: {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            xAxis: {
                type: 'datetime',
                plotLines,
                plotBands
            },
            legend: {
                enabled: true,
                align: 'left',
                verticalAlign: 'top',
                floating: false
            }
        }
    }]
}, true);
