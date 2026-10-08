Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>plotOptions.column.pointWidth</em>'
    },
    subtitle: {
        text: 'Oranges overrides it with <em>series.data.pointWidth</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    plotOptions: {
        column: {
            pointWidth: '1.5rem'
        }
    },
    series: [{
        data: [
            1,
            3,
            {
                pointWidth: '4rem',
                y: 2
            },
            4
        ]
    }]
});
