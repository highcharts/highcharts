$(function () {

    // THE CHART
    Highcharts.chart('container', {
        title: {
            text: 'Left Axis as Table'
        },
        xAxis: [{
            grid: true,
            type: 'datetime'
        }],
        yAxis: [{
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            grid: true
        }, {
            linkedTo: 0,
            categories: ['Lennie', 'Jenny', 'Lennie and Jennie'],
            reversed: true,
            grid: true
        }],
        series: [{
            name: 'Project 1',
            type: 'scatter',
            pointStart: 1000,
            data: [{
                x: Date.UTC(2014, 10, 18),
                name: 'Start prototype',
                y: 1000
            }, {
                x: Date.UTC(2014, 10, 20),
                name: 'Develop',
                y: 1001
            }, {
                x: Date.UTC(2014, 10, 25, 12),
                milestone: true,
                name: 'Prototype done',
                y: 1002
            }, {
                x: Date.UTC(2014, 10, 27),
                name: 'Test prototype',
                y: 1003
            }, {
                x: Date.UTC(2014, 10, 23),
                name: 'Run acceptance tests',
                y: 1004
            }]
        }]
    });
});
