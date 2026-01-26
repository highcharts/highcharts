Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Demo of <em>xAxis.staticScale</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        staticScale: 50
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
