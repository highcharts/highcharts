Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    title: {
        text: 'Demo of <em>yAxis.type</em>'
    },
    yAxis: {
        endOnTick: false,
        max: 100,
        min: 1,
        plotBands: [{
            color: '#ffbf00',
            from: 50,
            to: 70
        }, {
            color: '#00a96b',
            from: 70,
            to: 100
        }],
        type: 'logarithmic'
    },
    series: [{
        data: [80]
    }]
});
