Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Demo of <em>xAxis.labels.reserveSpace</em>'
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
        labels: {
            reserveSpace: true
        }
    },
    series: [{
        data: [5, 3, 4, 7, 2]
    }]
});
