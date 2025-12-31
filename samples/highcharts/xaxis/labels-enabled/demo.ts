Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.labels.enabled</em>'
    },
    xAxis: {
        labels: {
            enabled: false
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
