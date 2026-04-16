Highcharts.chart('container', {
    chart: {
        plotBorderWidth: 1,
        type: 'gauge'
    },
    title: {
        text: 'Demo of <em>pane.size</em>'
    },
    yAxis: {
        max: 100,
        min: 0
    },
    pane: {
        endAngle: 360,
        size: '85%',
        startAngle: 0
    },
    series: [{
        data: [80]
    }]
});
