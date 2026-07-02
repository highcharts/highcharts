Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.borderRadius</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    legend: {
        borderRadius: 0,
        borderWidth: 1
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
