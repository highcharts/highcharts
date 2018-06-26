
// THE CHART
Highcharts.chart('container', {

    title: {
        text: 'Left Axis as Table'
    },

    xAxis: [{
        grid: true,
        title: {
            text: 'Day'
        },
        type: 'datetime',
        opposite: true,
        tickInterval: 1000 * 60 * 60 * 24, // Day
        labels: {
            format: '{value:%E}'
        },
        min: Date.UTC(2017, 10, 17),
        max: Date.UTC(2017, 11, 16)
    }, {
        grid: true,
        title: {
            text: 'Week'
        },
        type: 'datetime',
        opposite: true,
        tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
        labels: {
            format: '{value:Week %W}',
            style: {
                fontSize: '1.2em'
            }
        },
        linkedTo: 0
    }],

    yAxis: {
        reversed: true,
        grid: {
            enabled: true,
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 2,
            columns: [{
                title: {
                    text: 'Project'
                },
                pointProperty: 'name'
            }, {
                title: {
                    text: 'Assignee'
                },
                pointProperty: 'assignee'
            }, {
                title: {
                    text: 'Est. days'
                },
                pointProperty: function (point) {
                    var number = (point.x2 - point.x) / (1000 * 60 * 60 * 24);
                    return Math.round(number * 100) / 100;
                },
                dataType: 'linear'
            }, {
                title: {
                    text: 'Start date'
                },
                pointProperty: 'x',
                dataType: 'datetime'
            }, {
                title: {
                    text: 'End date'
                },
                offset: 30,
                pointProperty: 'x2',
                dataType: 'datetime'
            }]
        }
    },

    series: [{
        name: 'Project 1',
        type: 'xrange',
        data: [{
            x: Date.UTC(2017, 10, 18, 8),
            x2: Date.UTC(2017, 10, 25, 16),
            name: 'Start prototype',
            assignee: 'Richards',
            y: 0
        }, {
            x: Date.UTC(2017, 10, 20, 8),
            x2: Date.UTC(2017, 10, 24, 16),
            name: 'Develop',
            assignee: 'Michaels',
            y: 1
        }, {
            x: Date.UTC(2017, 10, 25, 16),
            x2: Date.UTC(2017, 10, 25, 16),
            name: 'Prototype done',
            assignee: 'Richards',
            y: 2
        }, {
            x: Date.UTC(2017, 10, 27, 8),
            x2: Date.UTC(2017, 11, 3, 16),
            name: 'Test prototype',
            assignee: 'Richards',
            y: 3
        }, {
            x: Date.UTC(2017, 10, 23, 8),
            x2: Date.UTC(2017, 11, 15, 16),
            name: 'Run acceptance tests',
            assignee: 'Halliburton',
            y: 4
        }]
    }]
});
