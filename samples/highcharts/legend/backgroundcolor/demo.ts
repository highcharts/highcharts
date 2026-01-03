Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.backgroundColor</em>'
    },
    legend: {
        backgroundColor: '#aaaaaa40'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
