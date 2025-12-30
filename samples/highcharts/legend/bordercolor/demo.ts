Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend</em> options'
    },
    legend: {
        backgroundColor: '#aaaaaa40',
        borderColor: '#999999',
        borderWidth: 2
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
