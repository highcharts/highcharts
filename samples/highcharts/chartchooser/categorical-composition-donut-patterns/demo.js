Highcharts.chart('container', {
    colors: [
        { patternIndex: 3 }, { patternIndex: 1 }, '#5050f0'],
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Air composition'
    },
    tooltip: {
        valueSuffix: '%',
        borderColor: '#999'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: {y} %',
                connectorColor: '#669'
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
            y: 78,
            borderColor: '#D97D26'
        }, {
            name: 'Oxygen',
            y: 20.9,
            borderColor: '#999'
        }, {
            name: 'Other gases',
            y: 1.1,
            borderColor: '#5050a0'
        }]
    }]
});