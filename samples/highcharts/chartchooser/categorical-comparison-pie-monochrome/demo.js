Highcharts.chart('container', {
    colors: ['#7CB5EC', '#346DA4', '#10487F'],
    chart: {
        type: 'pie'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Earth&#39;s Water Supply'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true
            },
            showInLegend: true
        }
    },
    series: [{
        name: null,
        colorByPoint: true,
        data: [{
            name: 'Salt water',
            y: 97
        }, {
            name: 'Ice',
            y: 2
        }, {
            name: 'Fresh water',
            sliced: true,
            selected: true,
            y: 1
        }]
    }]
});