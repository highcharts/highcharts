const day = 24 * 36e5,
    week = 7 * day;

Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        text: ''
    }
});

Dashboards.board('container', {
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
                                height: 300
                            }, {
                                id: 'dashboard-kpi-2',
                                height: 300
                            }]
                        }]
                    }
                }, {
                    id: 'dashboard-kpi-4',
                    height: 300
                }]
            }, {
                id: 'charts-1',
                cells: [{
                    id: 'dashboard-chart-1',
                    height: 350,
                    width: '2/5'
                }, {
                    id: 'dashboard-chart-2',
                    height: 350
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
        subtitle: '10% more',
        value: 22,
        chartOptions: {
            series: [{
                type: 'column',
                name: 'Previous sprints',
                data: [20, 18, 23, 14, 19]
            }]
        }
    }, {
        cell: 'dashboard-kpi-2',
        type: 'KPI',
        title: 'Incomplete tasks',
        subtitle: '7% less',
        value: 10,
        chartOptions: {
            series: [{
                type: 'column',
                name: 'Previous sprints',
                data: [20, 18, 23, 14, 19].reverse()
            }]
        }
    }, {
        cell: 'dashboard-kpi-4',
        type: 'Highcharts',
        title: 'Task by status',
        chartOptions: {
            series: [{
                type: 'pie',
                data: [{
                    name: 'Done',
                    y: 10
                },
                {
                    name: 'To Do',
                    y: 21
                },
                {
                    name: 'In Progress',
                    y: 16
                },
                {
                    name: 'Blocked',
                    y: 9
                }],
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
            }
        }
    }, {
        cell: 'dashboard-chart-1',
        type: 'Highcharts',
        title: 'Total task by assignee',
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            series: [{
                type: 'column',
                data: [
                    {
                        name: 'Dev 1',
                        y: 20
                    },
                    {
                        name: 'Dev 2',
                        y: 18
                    },
                    {
                        name: 'Dev 3',
                        y: 15
                    },
                    {
                        name: 'Dev 4',
                        y: 4
                    },
                    {
                        name: 'Dev 5',
                        y: 1
                    }
                ]
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
                plotLines: [{
                    label: {
                        text: 'Today',
                        align: 'right'
                    },
                    value: 4.7 * week
                }],
                plotBands: [{
                    from: 1 * week,
                    to: 3 * week
                }],
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
            series: [{
                data: [
                    {
                        name: 'F:1352',
                        start: 0,
                        end: 3 * week
                    }, {
                        name: 'I.20-00',
                        start: 0,
                        end: 1 * week
                    }, {
                        name: 'I.20-01',
                        start: 1 * week,
                        end: 2 * week
                    }, {
                        name: 'F:2741',
                        start: 2 * week,
                        end: 5 * week
                    }, {
                        name: 'I.20-02',
                        start: 2 * week,
                        end: 3 * week
                    }, {
                        name: 'I.20-03',
                        start: 3 * week,
                        end: 4 * week
                    }, {
                        name: 'I.20-04',
                        start: 4 * week,
                        end: 5 * week
                    }, {
                        name: 'I.20-05',
                        start: 5 * week,
                        end: 6 * week
                    }, {
                        name: 'F:1982',
                        start: 0,
                        end: 4 * week
                    }, {
                        name: 'F:673',
                        start: 4 * week,
                        end: 6 * week
                    }
                ]
            }]
        }
    }, {
        cell: 'dashboard-chart-cumulative',
        type: 'Highcharts',
        title: 'Cumulative flow',
        chartOptions: {
            chart: {
                type: 'area',
                marginTop: 30
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    pointStart: 0,
                    pointInterval: week
                }
            },
            xAxis: {
                type: 'datetime',
                plotLines: [{
                    label: {
                        text: 'Today',
                        align: 'right'
                    },
                    value: 4.7 * week
                }],
                plotBands: [{
                    from: 1 * week,
                    to: 3 * week
                }]
            },
            series: [{
                name: 'Done',
                data: [0, 23, 45, 68, 90, 113]
            }, {
                name: 'To Do',
                data: [156, 134, 111, 89, 93, 44, 21]
            }, {
                name: 'Blocked',
                data: [30, 30, 30, 13, 2, 8, 2]
            }],
            legend: {
                enabled: true,
                align: 'left',
                verticalAlign: 'top',
                floating: true,
                x: 50
            }
        }
    }]
});
