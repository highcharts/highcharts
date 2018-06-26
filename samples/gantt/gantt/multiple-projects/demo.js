
// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart with Multiple Projects'
    },
    xAxis: {
        min: Date.UTC(2014, 10, 17),
        max: Date.UTC(2014, 10, 30),
        currentDateIndicator: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            taskName: 'Start prototype'
        }, {
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            taskName: 'Test prototype'
        }, {
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            taskName: 'Develop'
        }, {
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
            taskName: 'Run acceptance tests'
        }]
    }, {
        name: 'Project 2',
        data: [{
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 19),
            taskName: 'Create protoype'
        }, {
            start: Date.UTC(2014, 10, 19),
            end: Date.UTC(2014, 10, 23),
            taskName: 'Write unit tests'
        }, {
            start: Date.UTC(2014, 10, 24),
            end: Date.UTC(2014, 10, 28),
            taskName: 'Develop'
        }, {
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 28),
            taskName: 'Run user tests'
        }]
    }]
});
