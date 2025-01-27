Highcharts.ganttChart('container', {

    title: {
        text: 'Gantt Chart with Navigation'
    },

    yAxis: {
        uniqueNames: true
    },

    navigator: {
        enabled: true,
        liveRedraw: true,
        series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25,
            accessibility: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
        }
    },

    scrollbar: {
        enabled: true
    },

    rangeSelector: {
        enabled: true,
        selected: 0
    },

    accessibility: {
        point: {
            descriptionFormat: '{yCategory}. ' +
                '{#if completed}Task {(multiply completed.amount 100):.1f}% ' +
                'completed. {/if}' +
                'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.'
        },
        series: {
            descriptionFormat: '{name}'
        }
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
                    'showing time in both week numbers and days.',
                yAxisDescriptionPlural: 'The chart has one Y axis showing ' +
                    'task categories.'
            }
        }
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: '2017-12-01',
            end: '2018-02-02',
            completed: {
                amount: 0.95
            },
            name: 'Prototyping'
        }, {
            start: '2018-02-02',
            end: '2018-12-05',
            completed: {
                amount: 0.5
            },
            name: 'Development'
        }, {
            start: '2018-12-08',
            end: '2018-12-09',
            completed: {
                amount: 0.15
            },
            name: 'Testing'
        }, {
            start: '2018-12-09',
            end: '2018-12-19',
            completed: {
                amount: 0.3,
                fill: '#fa0'
            },
            name: 'Development'
        }, {
            start: '2018-12-10',
            end: '2018-12-23',
            name: 'Testing'
        }, {
            start: '2018-12-25 08:00',
            end: '2018-12-25 16:00',
            name: 'Release'
        }]
    }]
});
