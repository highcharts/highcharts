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
        min: 0,
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
    pane: {
        margin: 30
    },
    series: [{
        data: [80]
    }]
});
