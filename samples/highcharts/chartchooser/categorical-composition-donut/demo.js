Highcharts.chart('container', {
    colors: ['#01BAF2', '#71BF45', '#FAA74B', '#B37CD2'],
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Air composition'
    },
    tooltip: {
        valueSuffix: '%'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: {y} %'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Percentage',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'Nitrogen',
            y: 78
        }, {
            name: 'Oxygen',
            y: 20.9
        }, {
            name: 'Other gases',
            y: 1.1
        }]
    }]
});