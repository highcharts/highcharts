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
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            completed: 0.25,
            assignee: 'Richards',
            y: 0
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            assignee: 'Richards',
            y: 1
        }, {
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            assignee: 'Richards',
            y: 2
        }, {
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
            assignee: 'Richards',
            y: 3
        }]
    }]
});
