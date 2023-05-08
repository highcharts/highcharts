Highcharts.chart('container', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Global smartphone shipments market share, Q1 2022',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.counterpointresearch.com/global-smartphone-share/"' +
            'target="_blank">Counterpoint Research</a>',
        align: 'left'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Share',
        data: [
            ['Samsung', 23],
            ['Apple', 18],
            {
                name: 'Xiaomi',
                y: 12,
                sliced: true,
                selected: true
            },
            ['Oppo*', 9],
            ['Vivo', 8],
            ['Others', 30]
        ]
    }]
});
