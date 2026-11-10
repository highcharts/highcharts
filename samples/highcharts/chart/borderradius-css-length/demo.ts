Highcharts.chart('container', {
    chart: {
        borderRadius: '2rem',
        borderWidth: 2,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.borderRadius</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
