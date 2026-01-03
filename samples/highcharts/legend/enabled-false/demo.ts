Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.enabled</em>'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
