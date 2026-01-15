Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.reversedStacks</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        reversedStacks: true
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [4, 3, 5, 2]
    }]
} satisfies Highcharts.Options);
