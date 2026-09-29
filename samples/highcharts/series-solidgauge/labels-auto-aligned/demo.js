Highcharts.chart('container', {
    chart: {
        type: 'solidgauge'
    },
    title: {
        text: ''
    },
    pane: {
        startAngle: -130,
        endAngle: 130,
        size: '85%',
        innerSize: '60%'
    },
    yAxis: {
        min: 0,
        max: 100,
        tickAmount: 2,
        labels: {
            distance: '-20%',
            align: 'auto',
            style: {
                fontSize: '20px'
            }
        },
        plotLines: [{
            value: 35,
            zIndex: 5,
            width: 2,
            color: '#ff0000'
        }]
    },
    series: [{
        data: [63]
    }]
});
