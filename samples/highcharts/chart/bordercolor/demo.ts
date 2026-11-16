Highcharts.chart('container', {
    chart: {
        borderColor: 'light-dark(#202030, #f0f0ff)',
        borderRadius: 7,
        borderWidth: 2,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.borderColor</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
