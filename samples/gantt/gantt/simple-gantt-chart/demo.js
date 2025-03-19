// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Simple Gantt Chart'
    },

    xAxis: [{
        min: '2014-11-17',
        max: '2014-11-30'
    }],

    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-25'
        }, {
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25'
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }, {
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29'
        }]
    }]
});
