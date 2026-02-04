Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.softMax</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        endOnTick: false,
        lineWidth: 1,
        softMax: 10
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
