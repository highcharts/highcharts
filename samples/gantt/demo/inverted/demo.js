Highcharts.ganttChart('container', {

    chart: {
        inverted: true,
        plotBorderWidth: 1
    },

    title: {
        text: 'Inverted Gantt Chart'
    },

    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        point: {
            descriptionFormat: '{yCategory}. ' +
                '{#if completed}Task {(multiply completed.amount 100):.1f}% ' +
                'completed. {/if}' +
                'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.'
        }
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
                    'showing time in both week numbers and days.'
            }
        }
    },

    xAxis: [{
        opposite: false
    }, {
        opposite: false
    }],

    yAxis: {
        uniqueNames: true,
        opposite: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: '2018-12-01',
            end: '2018-12-02',
            completed: {
                amount: 0.95
            },
            name: 'Prototyping'
        }, {
            start: '2018-12-02',
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
        }]
    }]
});
