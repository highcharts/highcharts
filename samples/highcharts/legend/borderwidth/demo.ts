Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.borderWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    legend: {
        borderWidth: 1
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
