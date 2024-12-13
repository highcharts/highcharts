Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt chart with custom cell height'
    },
    xAxis: [{
        min: '2014-11-17',
        max: '2014-11-30',
        // Set the first axis to have a height of 30px
        grid: {
            cellHeight: 30
        }
    }, {
        // Set the second axis to have a height of 60px
        grid: {
            cellHeight: 60
        }
    }],

    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-25',
            completed: 0.25
        }, {
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29'
        }, {
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25',
            completed: {
                amount: 0.12,
                fill: '#fa0'
            }
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }]
    }]
});
