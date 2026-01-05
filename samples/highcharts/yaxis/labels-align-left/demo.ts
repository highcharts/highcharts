Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.labels</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        labels: {
            align: 'left',
            y: -2
        }
    },
    series: [{
        data: [100, 300, 200, 400]
    }]
});
