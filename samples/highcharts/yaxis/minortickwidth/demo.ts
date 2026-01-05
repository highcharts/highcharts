Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorTickWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        minorTicks: true,
        minorTickWidth: 3
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
