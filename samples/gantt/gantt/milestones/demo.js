$(function () {

    // THE CHART
    Highcharts.ganttChart('container', {
        title: {
            text: 'Gantt Chart'
        },
        xAxis: {
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 27),
            currentDateIndicator: true
        },

        series: [{
            name: 'Project 1',
            data: [{
                taskName: 'Create prototype',
                id: 'prototype',
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 21),
                y: 0
            }, {
                taskName: 'Prototype done',
                dependency: 'prototype',
                start: Date.UTC(2014, 10, 21, 12),
                milestone: true,
                y: 1
            }, {
                taskName: 'Develop',
                id: 'develop',
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                y: 2
            }, {
                taskName: 'Development done',
                dependency: 'develop',
                start: Date.UTC(2014, 10, 25, 12),
                milestone: true,
                color: '#fa0',
                y: 3
            }, {
                taskName: 'Test prototype',
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29),
                y: 4
            }, {
                taskName: 'Run acceptance tests',
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                y: 5
            }]
        }]
    });
});
