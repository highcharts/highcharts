Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.minorTicksPerMajor</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        minorTicks: true,
        minorTicksPerMajor: 2
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
