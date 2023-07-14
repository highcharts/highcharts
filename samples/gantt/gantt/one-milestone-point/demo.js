Highcharts.ganttChart('container', {
    title: {
        text: 'Simple Gantt Chart'
    },

    series: [{
        name: 'Project 1',
        data: [{
            id: 's',
            name: 'Start prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 20)
        }, {
            id: 'b',
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            dependency: 's'
        }, {
            id: 'a',
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26)
        }, {
            name: 'Prototype finished',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            dependency: ['a', 'b'],
            milestone: true
        }]
    }]
});
