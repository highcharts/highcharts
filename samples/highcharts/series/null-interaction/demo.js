Highcharts.chart('container', {
    series: [{
        dataLabels: {
            enabled: true
        },
        nullInteraction: true,
        data: [1, 2, 3, null, 5, 6, 7]
    }]
});
