Highcharts.ganttChart('container', {

    title: {
        text: 'Left Axis as Table'
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.',
                yAxisDescriptionSingular: 'The chart has a tabular Y axis showing a data table row for each point.'
            }
        }
    },

    accessibility: {
        point: {
            descriptionFormat: '{#if milestone}' +
                '{name}, milestone for {yCategory} at {x:%Y-%m-%d}.' +
                '{else}' +
                '{name}, assigned to {yCategory} from {x:%Y-%m-%d} to {x2:%Y-%m-%d}.' +
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
                    format: '{(divide (subtract point.x2 point.x) 86400000):.2f}'
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
            start: Date.UTC(2017, 10, 18, 8),
            end: Date.UTC(2017, 10, 25, 16),
            name: 'Start prototype',
            assignee: 'Richards',
            y: 0
        }, {
            start: Date.UTC(2017, 10, 20, 8),
            end: Date.UTC(2017, 10, 24, 16),
            name: 'Develop',
            assignee: 'Michaels',
            y: 1
        }, {
            start: Date.UTC(2017, 10, 25, 16),
            end: Date.UTC(2017, 10, 25, 16),
            name: 'Prototype done',
            assignee: 'Richards',
            milestone: true,
            y: 2
        }, {
            start: Date.UTC(2017, 10, 27, 8),
            end: Date.UTC(2017, 11, 3, 16),
            name: 'Test prototype',
            assignee: 'Richards',
            y: 3
        }, {
            start: Date.UTC(2017, 10, 23, 8),
            end: Date.UTC(2017, 11, 15, 16),
            name: 'Run acceptance tests',
            assignee: 'Halliburton',
            y: 4
        }]
    }],

    exporting: {
        sourceWidth: 1000
    }
});
