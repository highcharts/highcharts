Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of axis <em>labels.enabled</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        labels: {
            enabled: false
        }
    },
    yAxis: {
        labels: {
            enabled: true
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
