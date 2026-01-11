Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.reversedStacks</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        reversedStacks: false
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [4, 2, 3, 1]
    }, {
        data: [4, 2, 3, 1]
    }]
} satisfies Highcharts.Options);
