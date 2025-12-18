Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend</em> options'
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
        enabled: true,
        align: 'center',
        backgroundColor: '#efefef'
    }
});
