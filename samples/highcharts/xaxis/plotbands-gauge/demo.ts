Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    title: {
        text: 'Demo of gauge plot bands'
    },
    yAxis: {
        max: 100,
        min: 0,
        plotBands: [{
            color: '#89A54E',
            from: 0,
            outerRadius: '105%',
            thickness: '5%',
            to: 60
        }]
    },
    pane: {
        endAngle: 150,
        startAngle: -150
    },
    series: [{
        data: [80]
    }]
});
