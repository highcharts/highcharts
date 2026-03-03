Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorGridLineWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        gridLineColor: '#808080',
        gridLineWidth: 2,
        minorGridLineColor: '#80808080',
        minorGridLineWidth: 2,
        minorTicks: true
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
