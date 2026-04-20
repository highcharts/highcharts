Highcharts.chart('container', {
    chart: {
        plotBorderWidth: 1,
        type: 'gauge'
    },
    title: {
        text: 'Demo of <em>pane.margin</em>'
    },
    yAxis: {
        max: 100,
        min: 0
    },
    pane: {
        margin: 30
    },
    series: [{
        data: [80]
    }]
});
