Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Highcharts with horizontal category grid axis'
    },
    xAxis: [{
        grid: {
            enabled: true,
            columns: [{
                categories: ['Ein', 'To', 'Tre', 'Fire']
            }, {
                categories: ['Jeden', 'Dwa', 'Trzy', 'Cztery']
            }]
        }
    }],
    series: [{
        colorByPoint: true,
        data: [1, 4, 2, 4]
    }]
});
