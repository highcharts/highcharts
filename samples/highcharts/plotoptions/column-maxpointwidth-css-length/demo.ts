Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>plotOptions.column.maxPointWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    plotOptions: {
        column: {
            maxPointWidth: '3rem'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
