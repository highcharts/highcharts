Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        type: 'column',
        width: '30rem'
    },
    title: {
        text: 'Demo of <em>chart.width</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
