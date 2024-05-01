const plotLines = [{
    label: {
        text: 'Today',
        align: 'left',
        rotation: 0,
        y: 0
    },
    value: Date.UTC(2023, 5, 2),
    zIndex: 7
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
                    ['Alex', 41],
                    ['Jasmine', 28],
                    ['Ryan', 15],
                    ['Emily', 14],
                    ['Jordan', 4]
                ]
            }
        }]
    },
    components: [{
        renderTo: 'dashboard-kpi-1',
        type: 'KPI',
        title: 'Completed tasks',
        subtitle: 'tasks completed',
        linkedValueTo: {
            enabled: false
        }
    }, {
        renderTo: 'dashboard-kpi-2',
        type: 'KPI',
        title: 'Incomplete tasks',
        subtitle: 'to be done',
        linkedValueTo: {
            enabled: false
        }
    }, {
        renderTo: 'dashboard-kpi-4',
        type: 'Highcharts',
        title: 'Tasks by status',
        chartOptions: {
            series: [{
                type: 'pie',
                keys: ['name', 'y'],
                innerSize: '50%',
                size: '110%',
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:,.1f}%'
                }
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
        renderTo: 'dashboard-chart-1',
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
        renderTo: 'dashboard-chart-2',
        type: 'Highcharts',
        title: 'Timeline',
        chartConstructor: 'ganttChart',
        chartOptions: {
            chart: {
                marginLeft: 10
            },
            xAxis: [{
                plotLines,
                dateTimeLabelFormats: {
                    day: '%e<br><span style="opacity: 0.5; font-size: ' +
                        '0.7em;">%a</span>'
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
                data: [{
                    name: 'F:1352',
                    start: Date.UTC(2023, 4, 1, 9),
                    end: Date.UTC(2023, 4, 19, 17)
                }, {
                    name: 'I.20-00',
                    start: Date.UTC(2023, 4, 1, 9),
                    end: Date.UTC(2023, 4, 5, 17)
                }, {
                    name: 'I.20-01',
                    start: Date.UTC(2023, 4, 8, 9),
                    end: Date.UTC(2023, 4, 12, 17)
                }, {
                    name: 'F:2741',
                    start: Date.UTC(2023, 4, 15, 9),
                    end: Date.UTC(2023, 5, 2, 17)
                }, {
                    name: 'I.20-02',
                    start: Date.UTC(2023, 4, 15, 9),
                    end: Date.UTC(2023, 4, 19, 17)
                }, {
                    name: 'I.20-03',
                    start: Date.UTC(2023, 4, 22, 9),
                    end: Date.UTC(2023, 4, 26, 17)
                }, {
                    name: 'I.20-04',
                    start: Date.UTC(2023, 4, 29, 9),
                    end: Date.UTC(2023, 5, 2, 17)
                }, {
                    name: 'I.20-05',
                    start: Date.UTC(2023, 5, 5, 9),
                    end: Date.UTC(2023, 5, 9, 17)
                }, {
                    name: 'F:1982',
                    start: Date.UTC(2023, 4, 1, 9),
                    end: Date.UTC(2023, 4, 26, 17)
                }, {
                    name: 'F:673',
                    start: Date.UTC(2023, 4, 29, 9),
                    end: Date.UTC(2023, 5, 9, 17)
                }]
            }],
            lang: {
                accessibility: {
                    chartContainerLabel: `Timeline of the project. Highcharts
                        Interactive Chart.`
                }
            },
            accessibility: {
                description: `The chart shows the timeline of the project. It is
                    divided into tasks. There also is a line indicating today's
                    date.`,
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
        renderTo: 'dashboard-chart-cumulative',
        type: 'Highcharts',
        title: 'Cumulative flow',
        connector: {
            id: 'cumulativeData',
            columnAssignment: [{
                seriesId: 'Done',
                data: ['Date', 'Done']
            }, {
                seriesId: 'To Do',
                data: ['Date', 'To Do']
            }, {
                seriesId: 'Blocked',
                data: ['Date', 'Blocked']
            }]
        },
        chartOptions: {
            chart: {
                type: 'area'
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    label: {
                        enabled: true,
                        useHTML: true
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                plotLines,
                accessibility: {
                    description: `Axis showing the time from the start of the
                    project (1 May 2023) to the end of if (12 June 2023). With
                    today's date marked.`
                }
            },
            yAxis: {
                title: {
                    text: 'Number of tasks'
                },
                accessibility: {
                    description: 'Number of tasks.'
                }
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
                    done and blocked. There also is a line indicating today's
                    date.`,
                point: {
                    descriptionFormatter: function (point) {
                        return `Week from
                            ${Highcharts.dateFormat('%e %b %Y', point.x)} Tasks
                            ${point.series.name}: ${point.y}`;
                    }
                },
                series: {
                    descriptionFormat: 'Tasks that are {series.name}.'
                }
            }
        }
    }]
}, true).then(dashboard => {
    const completedTaskKPI = dashboard.mountedComponents[0].component,
        incompleteTaskKPI = dashboard.mountedComponents[1].component,
        taskByStatusChart = dashboard.mountedComponents[2].component,
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
