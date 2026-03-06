Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorTickColor</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        minorTickColor: '#ff0000',
        minorTicks: true,
        minorTickWidth: 2
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
