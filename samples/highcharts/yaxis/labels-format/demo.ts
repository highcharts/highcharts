Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.labels.format</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        labels: {
            format: '${value:.2f} USD'
        }
    },
    series: [{
        data: [100, 300, 200, 400]
    }]
});
