$(function () {

    // THE CHART
    Highcharts.ganttChart('container', {
        title: {
            text: 'Simple Gantt Chart'
        },

        xAxis: [{
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }],

        series: [{
            name: 'Project 1',
            data: [{
                taskName: 'Start prototype',
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                y: 0
            }, {
                taskName: 'Develop',
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                y: 1
            }, {
                taskName: 'Run acceptance tests',
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                y: 2
            }, {
                taskName: 'Test prototype',
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29),
                y: 3
            }]
        }]
    });
});
