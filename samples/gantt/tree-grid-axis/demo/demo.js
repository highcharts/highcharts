$(function () {
    // THE CHART
    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Highcharts TreeGrid'
        },
        xAxis: [{
            type: 'datetime'
        }],
        yAxis: [{
            title: '',
            type: 'tree-grid',
            labels: {
                align: 'left'
            }
        }],
        series: [{
            name: 'Project 1',
            data: [{
                id: '1',
                name: 'Node 1',
                x: Date.UTC(2014, 10, 18),
                y: 0
            }, {
                id: '2',
                parent: '1',
                name: 'Node 2',
                x: Date.UTC(2014, 10, 20),
                y: 1
            }, {
                id: '3',
                parent: '2',
                name: 'Node 3',
                x: Date.UTC(2014, 10, 26),
                y: 2
            }]
        }]
    });
});
