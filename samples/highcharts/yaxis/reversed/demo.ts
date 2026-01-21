Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.reversed</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        reversed: true
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
