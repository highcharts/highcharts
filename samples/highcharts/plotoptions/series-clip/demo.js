Highcharts.chart('container', {

    title: {
        text: 'Clipping Series'
    },

    yAxis: {
        endOnTick: false,
        maxPadding: 0,
        gridLineWidth: 0
    },

    series: [{
        name: 'Non clipped series',
        lineWidth: 2,
        clip: false,
        data: [100, 100, 50, 50, 0, 0]
    }, {
        name: 'Clipped series',
        lineWidth: 2,
        data: [0, 0, 50, 50, 100, 100]
    }]
});
