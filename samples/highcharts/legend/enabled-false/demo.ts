Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.enabled</em>'
    },
    series: [
        {
            type: 'column',
            data: [
                1,
                3,
                2,
                4
            ],
            colorByPoint: true
        }
    ],
    legend: {
        enabled: false
    }
});
