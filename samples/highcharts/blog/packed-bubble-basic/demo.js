Highcharts.chart('container', {
    chart: {
        type: 'packedbubble'
    },
    plotOptions: {
        packedbubble: {
            minPointSize: 15,
            maxPointSize: 300
        }
    },
    series: [{
        data: [1, 75, 112, 180, 20, 3000]
    }]
});