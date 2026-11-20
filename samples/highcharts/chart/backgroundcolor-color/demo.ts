Highcharts.chart('container', {
    chart: {
        backgroundColor: 'light-dark(#f0f0ff, #202030)',
        borderRadius: 7,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.backgroundColor</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
