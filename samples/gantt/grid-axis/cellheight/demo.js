Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt chart with custom cell height'
    },
    xAxis: [{
        min: Date.UTC(2014, 10, 17),
        max: Date.UTC(2014, 10, 30),
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
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            completed: 0.25
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29)
        }, {
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            completed: {
                amount: 0.12,
                fill: '#fa0'
            }
        }, {
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26)
        }]
    }]
});
