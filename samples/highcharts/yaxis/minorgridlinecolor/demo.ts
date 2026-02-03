Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorGridLineColor</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        gridLineColor: '#808080',
        minorGridLineColor: '#80808080',
        minorTicks: true
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
