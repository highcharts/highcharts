Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>plotOptions.column.borderRadius</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    plotOptions: {
        column: {
            borderRadius: {
                radius: '50%',
                scope: 'stack',
                where: 'all'
            },
            stacking: 'normal'
        }
    },
    series: [{
        data: [1, 4, 3]
    }, {
        data: [8, 1, 5]
    }, {
        data: [1, 2, 4]
    }]
});
