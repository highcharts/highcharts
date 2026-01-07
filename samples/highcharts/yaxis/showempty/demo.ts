Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.showEmpty</em>'
    },
    subtitle: {
        text: 'To see the effect, hide the series by clicking the legend'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: {
        lineWidth: 1,
        showEmpty: false
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
