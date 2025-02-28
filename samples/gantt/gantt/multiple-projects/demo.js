Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart with Multiple Projects'
    },

    xAxis: {
        min: '2014-11-17',
        max: '2014-11-30',
        currentDateIndicator: true
    },

    plotOptions: {
        series: {
            colorByPoint: false
        }
    },

    legend: {
        enabled: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: '2014-11-18',
            end: '2014-11-25',
            name: 'Start prototype'
        }, {
            start: '2014-11-27',
            end: '2014-11-29',
            name: 'Test prototype'
        }, {
            start: '2014-11-20',
            end: '2014-11-25',
            name: 'Develop'
        }, {
            start: '2014-11-23',
            end: '2014-11-26',
            name: 'Run acceptance tests'
        }]
    }, {
        name: 'Project 2',
        data: [{
            start: '2014-11-18',
            end: '2014-11-19',
            name: 'Create protoype'
        }, {
            start: '2014-11-19',
            end: '2014-11-23',
            name: 'Write unit tests'
        }, {
            start: '2014-11-24',
            end: '2014-11-28',
            name: 'Develop'
        }, {
            start: '2014-11-27',
            end: '2014-11-28',
            name: 'Run user tests'
        }]
    }]
});
