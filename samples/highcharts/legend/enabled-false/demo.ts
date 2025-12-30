Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    series: [{
        data: [1, 3, 2, 4]
    }],
    title: {
        text: 'Demo of <em>legend.enabled</em>'
    },
    legend: {
        enabled: false
    }
});
