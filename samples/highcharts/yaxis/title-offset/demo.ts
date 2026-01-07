Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.title.offset</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        title: {
            offset: 50
        },
        lineWidth: 1
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
