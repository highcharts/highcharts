// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart'
    },
    xAxis: {
        min: '2014-11-17',
        max: '2014-11-27',
        currentDateIndicator: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            name: 'Create prototype',
            id: 'prototype',
            start: '2014-11-18',
            end: '2014-11-21'
        }, {
            name: 'Prototype done',
            dependency: 'prototype',
            start: '2014-11-21 12:00',
            milestone: true
        }, {
            name: 'Develop',
            id: 'develop',
            start: '2014-11-20',
            end: '2014-11-25'
        }, {
            name: 'Development done',
            dependency: 'develop',
            start: '2014-11-25 12:00',
            milestone: true,
            pointWidth: 40,
            color: '#fa0'
        }, {
            name: 'Test prototype',
            start: '2014-11-21',
            end: '2014-11-22'
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }]
    }]
});
