Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.labels.align</em>'
    },
    xAxis: {
        labels: {
            align: 'right',
            format: 'Category {value}'
        },
        tickWidth: 1
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
