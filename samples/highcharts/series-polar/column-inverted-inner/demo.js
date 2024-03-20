Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 40
    },
    title: {
        text: 'Pane\'s innerSize'
    },
    subtitle: {
        text: 'The innerSize option is set to 15%'
    },
    pane: {
        startAngle: 0,
        endAngle: 270,
        size: '80%',
        innerSize: '15%'
    },
    xAxis: {
        type: 'category',
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        max: 225,
        lineWidth: 0,
        showLastLabel: true
    },
    series: [{
        data: [29, 106, 144, 135, 216, 95]
    }]
});