Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend</em> options'
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
        enabled: true,
        align: 'center',
        backgroundColor: '#efefef'
    }
});
