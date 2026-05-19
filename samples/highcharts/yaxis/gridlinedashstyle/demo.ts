Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.gridLineDashStyle</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        gridLineColor: 'gray',
        gridLineDashStyle: 'Dash'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
