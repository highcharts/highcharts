Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Demo of <em>xAxis.gridZIndex</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        gridLineWidth: 1,
        gridZIndex: 4
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
