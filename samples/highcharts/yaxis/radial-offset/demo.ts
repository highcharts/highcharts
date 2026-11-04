Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    title: {
        text: 'Demo of <em>yAxis.offset</em>'
    },
    yAxis: {
        lineWidth: 1,
        max: 100,
        min: 0,
        offset: '-20%',
        plotBands: [{
            color: '#ffbf00',
            from: 50,
            to: 70
        }, {
            color: '#00a96b',
            from: 70,
            to: 100
        }]
    },
    series: [{
        data: [80]
    }]
});
