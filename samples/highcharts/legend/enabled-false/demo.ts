Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.enabled</em>'
    },
    series: [
        {
            data: [
                1,
                3,
                2,
                4
            ]
        }
    ],
    legend: {
        enabled: false
    }
});
