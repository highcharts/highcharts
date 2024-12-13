// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart with Progress Indicators',
        align: 'left'
    },

    xAxis: {
        min: '2014-11-17',
        max: '2014-11-30'
    },

    accessibility: {
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

    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-25',
            completed: {
                amount: 0.25
            }
        }, {
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29'
        }, {
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25',
            completed: {
                amount: 0.12,
                fill: '#fa0'
            }
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }]
    }]
});
