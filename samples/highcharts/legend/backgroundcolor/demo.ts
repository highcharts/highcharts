Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.backgroundColor</em>'
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
        backgroundColor: '#aaaaaa40'
    }
});
