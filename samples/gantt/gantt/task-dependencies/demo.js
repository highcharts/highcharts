Highcharts.ganttChart('container', {
    title: {
        text: 'Task Dependencies'
    },

    series: [{
        name: 'Project 1',
        data: [{
            id: 'start',
            name: 'Start prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 20)
        }, {
            id: 'dev',
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            dependency: 'start'
        }, {
            id: 'run',
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26)
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            dependency: ['dev', 'run']
        }]
    }]
});
