Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        type: 'category'
    },
    series: [{
        name: 'Supply',
        data: [{
            name: 'Fruits',
            y: 5,
            drilldown: 'Fruits'
        }, {
            name: 'Vegetables',
            y: 6
        }, {
            name: 'Meat',
            y: 3
        }]
    }],
    drilldown: {
        breadcrumbs: {
            showFullPath: true,
            format: 'Go to {level.name}'
        },
        series: [{
            name: 'Fruits',
            id: 'Fruits',
            data: [
                ['Citrus', 2],
                ['Tropical', 5],
                ['Other', 1]
            ]
        }]
    }
});