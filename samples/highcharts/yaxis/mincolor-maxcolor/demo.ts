Highcharts.chart('container', {
    chart: {
        type: 'solidgauge'
    },
    title: {
        text: 'Demo of <em>yAxis.minColor</em> and <em>maxColor</em>'
    },
    yAxis: {
        max: 100,
        maxColor: '#000000',
        min: 0,
        minColor: '#ffffff'
    },
    series: [{
        data: [30]
    }]
});
