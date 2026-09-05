Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    title: {
        text: 'Demo of <em>pane.background</em> options'
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
        background: {
            backgroundColor: '#f7f7f7',
            borderColor: '#cccccc',
            borderWidth: 1
        }
    },
    series: [{
        data: [80]
    }]
});
