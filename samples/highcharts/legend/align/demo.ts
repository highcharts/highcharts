Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    series: [
        {
            data: [
                1,
                3,
                2,
                4
            ]
        },
        {
            data: [
                5,
                3,
                4,
                2
            ]
        },
        {
            data: [
                4,
                2,
                5,
                3
            ]
        }
    ],
    title: {
        text: 'Demo of <em>legend</em> options'
    },
    legend: {}
});
