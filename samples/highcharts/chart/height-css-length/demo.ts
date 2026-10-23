Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        height: '20rem',
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.height</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
