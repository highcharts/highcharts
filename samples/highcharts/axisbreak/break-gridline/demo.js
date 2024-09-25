Highcharts.chart('container', {
    xAxis: [{
        minorGridLineColor: '#C0C0C0',
        minorGridLineWidth: 1,
        minorGridLineDashStyle: 'Dot',
        minorTickInterval: 40,
        min: 0,
        max: 10000,
        breaks: [{
            from: 3000,
            to: 8000,
            breakSize: 200
        }]
    }],
    series: [{
        data: [{
            x: 0,
            y: 1
        }, {
            x: 1000,
            y: 2
        }, {
            x: 2000,
            y: 1
        }, {
            x: 3000,
            y: 1
        }]
    }, {
        data: [{
            x: 8000,
            y: 1
        }, {
            x: 9000,
            y: 3
        }, {
            x: 10000,
            y: 2
        }]
    }]
});