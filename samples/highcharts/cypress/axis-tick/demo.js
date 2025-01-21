Highcharts.chart('container', {
    chart: {
        animation: false
    },
    xAxis: [{
        minorGridLineWidth: 5,
        minorGridLineColor: 'rgba(255,0,255,0.2)',
        minorTickInterval: 2.5
    }, {
        minorGridLineColor: 'red',
        minorTickInterval: 2.5,
        linkedTo: 0
    }],
    series: [{
        animation: false,
        data: [{
            x: 10,
            y: 1
        }, {
            x: 20,
            y: 2
        }, {
            x: 39.7,
            y: 1
        }]
    }]
});
