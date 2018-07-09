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
            name: 'Create prototype',
            id: 'prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 21)
        }, {
            name: 'Prototype done',
            dependency: 'prototype',
            start: Date.UTC(2014, 10, 21, 12),
            milestone: true
        }, {
            name: 'Develop',
            id: 'develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25)
        }, {
            name: 'Development done',
            dependency: 'develop',
            start: Date.UTC(2014, 10, 25, 12),
            milestone: true,
            pointWidth: 40,
            color: '#fa0'
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29)
        }, {
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26)
        }]
    }]
});
