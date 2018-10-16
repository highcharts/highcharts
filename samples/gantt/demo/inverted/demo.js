Highcharts.ganttChart('container', {

    chart: {
        inverted: true,
        plotBorderWidth: 1
    },

    title: {
        text: 'Inverted Gantt Chart'
    },

    xAxis: [{
        opposite: false
    }, {
        opposite: false
    }],

    yAxis: {
        uniqueNames: true,
        opposite: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: Date.UTC(2018, 11, 1),
            end: Date.UTC(2018, 11, 2),
            completed: 0.95,
            name: 'Prototyping'
        }, {
            start: Date.UTC(2018, 11, 2),
            end: Date.UTC(2018, 11, 5),
            completed: 0.5,
            name: 'Development'
        }, {
            start: Date.UTC(2018, 11, 8),
            end: Date.UTC(2018, 11, 9),
            completed: 0.15,
            name: 'Testing'
        }, {
            start: Date.UTC(2018, 11, 9),
            end: Date.UTC(2018, 11, 19),
            completed: {
                amount: 0.3,
                fill: '#fa0'
            },
            name: 'Development'
        }, {
            start: Date.UTC(2018, 11, 10),
            end: Date.UTC(2018, 11, 23),
            name: 'Testing'
        }]
    }]
});
