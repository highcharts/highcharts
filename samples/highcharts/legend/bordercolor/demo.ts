Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    series: [{
        data: [1, 3, 2, 4]
    }],
    title: {
        text: 'Demo of <em>legend</em> options'
    },
    legend: {
        borderColor: '#999999',
        borderWidth: 2,
        backgroundColor: '#aaaaaa40'
    }
});
