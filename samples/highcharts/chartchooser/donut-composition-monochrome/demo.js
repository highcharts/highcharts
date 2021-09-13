Highcharts.chart('container', {
    colors: ['#bfdbf6', '#92c2ef', '#10487F'],
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