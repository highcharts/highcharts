Highcharts.chart('container', {
    chart: {
        borderWidth: 2,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.borderWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
