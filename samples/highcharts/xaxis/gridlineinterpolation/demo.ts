Highcharts.chart('container', {
    chart: {
        inverted: true,
        polar: true,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.gridLineInterpolation</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        gridLineColor: '#888',
        gridLineInterpolation: 'circle',
        tickInterval: 1
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
