Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette.colorScheme</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    palette: {
        colorScheme: 'dark'
    },
    series: [{
        colorByPoint: true,
        data: [1, 3, 2, 4]
    }]
});
