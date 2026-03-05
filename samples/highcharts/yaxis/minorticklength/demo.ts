Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorTickLength</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        lineWidth: 1,
        minorTickLength: 5,
        minorTicks: true,
        minorTickWidth: 1
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
