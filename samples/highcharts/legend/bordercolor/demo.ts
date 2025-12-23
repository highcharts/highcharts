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
        borderColor: '#999999',
        borderWidth: 2,
        backgroundColor: '#aaaaaa40'
    }
});
