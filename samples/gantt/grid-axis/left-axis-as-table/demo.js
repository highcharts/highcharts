
// THE CHART
Highcharts.chart('container', {
    title: {
        text: 'Left Axis as Table'
    },
    xAxis: [{
        grid: true,
        type: 'datetime'
    }],
    yAxis: {
        reversed: true,
        grid: {
            enabled: true,
            borderColor: '#fa0',
            borderWidth: 5,
            columns: [{
                name: 'Project',
                pointProperty: 'name',
                type: 'category'
            }, {
                name: 'Assignee',
                pointProperty: 'assignee',
                type: 'category'
            }, {
                name: 'Est. days',
                pointProperty: function (point) {
                    return (point.x2 - point.x) / (1000 * 60 * 60 * 24);
                }
                // type is linear
            }, {
                name: 'Start date',
                pointProperty: 'x',
                type: 'datetime'
            }, {
                name: 'End date',
                pointProperty: 'x',
                type: 'datetime'
            }]
        }
    },
    series: [{
        name: 'Project 1',
        type: 'scatter',
        data: [{
            x: Date.UTC(2014, 10, 18),
            name: 'Start prototype',
            y: 0
        }, {
            x: Date.UTC(2014, 10, 20),
            name: 'Develop',
            y: 1
        }, {
            x: Date.UTC(2014, 10, 25, 12),
            name: 'Prototype done',
            y: 2
        }, {
            x: Date.UTC(2014, 10, 27),
            name: 'Test prototype',
            y: 3
        }, {
            x: Date.UTC(2014, 10, 23),
            name: 'Run acceptance tests',
            y: 4
        }]
    }]
});
