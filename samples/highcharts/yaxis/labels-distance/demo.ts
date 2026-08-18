Highcharts.chart('container', {
    chart: {
        marginBottom: 50,
        type: 'solidgauge'
    },
    title: {
        text: 'Demo of <em>yAxis.labels.distance</em>'
    },
    subtitle: {
        text: 'Initially placed in the middle of the solid gauge band'
    },
    yAxis: {
        labels: {
            distance: '-20%',
            y: 25
        },
        max: 100,
        min: 0,
        plotBands: [],
        tickAmount: 2
    },
    pane: {
        endAngle: 90,
        innerSize: '60%',
        startAngle: -90
    },
    series: [{
        data: [54.4]
    }]
});
