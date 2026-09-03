const chart = Highcharts.chart('container', {
    title: {
        text: 'Append point and shift'
    },
    series: [{
        data: [1, 4, 2, 3, 5],
        type: 'column',
        colorByPoint: true
    }]
});

setInterval(() => {
    chart.series[0].addPoint(Math.random() * 4 + 1, true, true);
}, 1000);
