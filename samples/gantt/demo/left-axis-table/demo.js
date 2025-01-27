Highcharts.ganttChart('container', {

    title: {
        text: 'Left Axis as Table'
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
                    'showing time in both week numbers and days.',
                yAxisDescriptionSingular: 'The chart has a tabular Y axis ' +
                    'showing a data table row for each point.'
            }
        }
    },

    accessibility: {
        point: {
            descriptionFormat: '{#if milestone}' +
                '{name}, milestone for {yCategory} at {x:%Y-%m-%d}.' +
                '{else}' +
                '{name}, assigned to {yCategory} from {x:%Y-%m-%d} to ' +
                '{x2:%Y-%m-%d}.' +
                '{/if}'
        }
    },

    xAxis: {
        tickPixelInterval: 70
    },

    yAxis: {
        type: 'category',
        grid: {
            enabled: true,
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            columns: [{
                title: {
                    text: 'Project'
                },
                labels: {
                    format: '{point.name}'
                }
            }, {
                title: {
                    text: 'Assignee'
                },
                labels: {
                    format: '{point.assignee}'
                }
            }, {
                title: {
                    text: 'Est. days'
                },
                labels: {
                    format: '{(divide (subtract point.x2 point.x) ' +
                        '86400000):.2f}'
                }
            }, {
                labels: {
                    format: '{point.start:%e. %b}'
                },
                title: {
                    text: 'Start date'
                }
            }, {
                title: {
                    text: 'End date'
                },
                offset: 30,
                labels: {
                    format: '{point.end:%e. %b}'
                }
            }]
        }
    },

    tooltip: {
        xDateFormat: '%e %b %Y, %H:%M'
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: '2017-11-18 08:00',
            end: '2017-11-25 16:00',
            name: 'Start prototype',
            assignee: 'Richards',
            y: 0
        }, {
            start: '2017-11-20 08:00',
            end: '2017-11-24 16:00',
            name: 'Develop',
            assignee: 'Michaels',
            y: 1
        }, {
            start: '2017-11-25 16:00',
            end: '2017-11-25 16:00',
            name: 'Prototype done',
            assignee: 'Richards',
            milestone: true,
            y: 2
        }, {
            start: '2017-11-27 08:00',
            end: '2017-12-03 16:00',
            name: 'Test prototype',
            assignee: 'Richards',
            y: 3
        }, {
            start: '2017-11-23 08:00',
            end: '2017-12-15 16:00',
            name: 'Run acceptance tests',
            assignee: 'Halliburton',
            y: 4
        }]
    }],

    exporting: {
        sourceWidth: 1000
    }
});
