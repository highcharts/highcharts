$(function () {

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
                y: 0,
                taskName: 'Start prototype'
            }, {
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29),
                taskName: 'Test prototype',
                y: 1
            }, {
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                y: 2,
                taskName: 'Develop'
            }, {
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                taskName: 'Run acceptance tests',
                y: 3
            }]
        }, {
            name: 'Project 2',
            data: [{
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 19),
                taskName: 'Create protoype',
                y: 4
            }, {
                start: Date.UTC(2014, 10, 19),
                end: Date.UTC(2014, 10, 23),
                taskName: 'Write unit tests',
                y: 5
            }, {
                start: Date.UTC(2014, 10, 24),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Develop',
                y: 6
            }, {
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Run user tests',
                y: 7
            }]
        }]
    });
});
