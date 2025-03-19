Highcharts.ganttChart('container', {
    title: {
        text: 'Define tickInterval per Axis.grid'
    },

    xAxis: [{
        labels: {
            format: '{value:%w}' // day of the week
        },
        grid: {
            enabled: true, // default setting
            tickInterval: 1000 * 60 * 60 * 24 // Day

        }
    }, {
        grid: {
            tickInterval: 1000 * 60 * 60 * 24 * 7 // week
        },
        labels: {
            format: '{value:%W}'
        }

    }],

    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-25',
            completed: 0.25,
            assignee: 'Richards',
            y: 0
        }, {
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29',
            assignee: 'Richards',
            y: 1
        }, {
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25',
            assignee: 'Richards',
            y: 2
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26',
            assignee: 'Richards',
            y: 3
        }]
    }]
});
