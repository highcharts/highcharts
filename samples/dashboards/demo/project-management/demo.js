const plotLines = [{
        label: {
            text: 'Today',
            align: 'right'
        },
        value: Date.UTC(2023, 5, 4),
        zIndex: 10
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
                    [Date.UTC(2023, 5, 5), 113, 51, 8],
                    [Date.UTC(2023, 5, 12), null, 51, 8]
                ]
            }
        }, {
            id: 'taskByAssignee',
            type: 'JSON',
            options: {
                data: [
                    ['Assignee', 'Completed tasks'],
                    ['Dev 1', 41],
                    ['Dev 2', 28],
                    ['Dev 3', 15],
                    ['Dev 4', 14],
                    ['Dev 5', 4]
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
        subtitle: 'tasks completed',
        linkedValueTo: {
            enabled: false
        }
    }, {
        cell: 'dashboard-kpi-2',
        type: 'KPI',
        title: 'Incomplete tasks',
        subtitle: 'to be done',
        linkedValueTo: {
            enabled: false
        }
    }, {
        cell: 'dashboard-kpi-4',
        type: 'Highcharts',
        title: 'Tasks by status',
        chartOptions: {
            xAxis: {
                categories: ['Done', 'To Do', 'In Progress', 'Blocked']
            },
            series: [{
                type: 'pie',
                keys: ['name', 'y'],
                innerSize: '50%',
                size: '110%',
                showInLegend: true
            }],
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'center',
                layout: 'vertical'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: `<span style="color:{point.color}">\u25CF</span>
                    Tasks {point.name}: <b>{point.y}</b><br/>`
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
            },
            lang: {
                accessibility: {
                    chartContainerLabel: `Tasks by status, current sprint.
                        Highcharts Interactive Chart.`
                }
            },
            accessibility: {
                description: `The chart shows the number of tasks by status.
                    Pie is divided into four parts, to do, in progress, done and
                    blocked.`,
                point: {
                    descriptionFormat: '{name}: {y} tasks.'
                }
            }
        }
    }, {
        cell: 'dashboard-chart-1',
        type: 'Highcharts',
        title: 'Total tasks by assignee',
        connector: {
            id: 'taskByAssignee'
        },
        chartOptions: {
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Developer'
                }
            },
            yAxis: {
                title: {
                    text: 'Completed tasks'
                }
            },
            legend: {
                enabled: false
            },
            lang: {
                accessibility: {
                    chartContainerLabel: `Total tasks by assignee. Highcharts
                        Interactive Chart.`
                }
            },
            accessibility: {
                description: `The chart shows the number of completed tasks by
                    assignee.`
            }
        }
    }, {
        cell: 'dashboard-chart-2',
        type: 'Highcharts',
        title: 'Timeline',
        chartConstructor: 'ganttChart',
        chartOptions: {
            chart: {
                marginLeft: 10
            },
            xAxis: [{
                plotLines,
                plotBands,
                dateTimeLabelFormats: {
                    day: '%e<br><span style="opacity: 0.5; font-size: 0.7em">%a</span>'
                },
                grid: {
                    borderWidth: 0
                },
                accessibility: {
                    description: 'Timeline axis.'
                }
            }],
            yAxis: {
                labels: {
                    enabled: false
                },
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
            }],
            lang: {
                accessibility: {
                    chartContainerLabel: `Timeline of the project. Highcharts
                        Interactive Chart.`
                }
            },
            accessibility: {
                description: `The chart shows the timeline of the project. It is
                    divided into tasks.`,
                typeDescription: `The Gantt chart shows the timeline of
                    the project.`,
                point: {
                    descriptionFormatter: function (point) {
                        return `Task ${point.name} starts on
                        ${Highcharts.dateFormat('%e %b %Y', point.start)}, ends
                        on ${Highcharts.dateFormat('%e %b %Y', point.end)}.`;
                    }
                }
            }
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
            },
            lang: {
                accessibility: {
                    chartContainerLabel: `Tasks status over time. Highcharts
                        Interactive Chart.`
                }
            },
            accessibility: {
                description: `The chart shows the number of tasks by status
                    over time. The chart is divided into three parts, to do,
                    done and blocked.`
            }
        }
    }]
}, true).then(dashboard => {
    const completedTaskKPI = dashboard.mountedComponents[1].component,
        incompleteTaskKPI = dashboard.mountedComponents[2].component,
        taskByStatusChart = dashboard.mountedComponents[3].component,
        connectors = dashboard.dataPool.connectors,
        cumulativeData = connectors.cumulativeData.table.columns,
        completedTask = cumulativeData.Done[5] - cumulativeData.Done[4],
        planedTask = cumulativeData['To Do'][4] - cumulativeData['To Do'][5],
        blockedTask = cumulativeData.Blocked[5] - cumulativeData.Blocked[4],
        inProgressTask = planedTask - completedTask;

    completedTaskKPI.setValue(completedTask);
    incompleteTaskKPI.setValue(inProgressTask);

    taskByStatusChart.chart.series[0].update({
        data: [
            ['Done', completedTask],
            ['To Do', inProgressTask],
            ['In Progress', inProgressTask],
            ['Blocked', blockedTask]
        ]
    });
});
