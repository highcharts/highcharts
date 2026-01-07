Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.gridLineWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        gridLineWidth: 2
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
