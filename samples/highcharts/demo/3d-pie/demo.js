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
                distance: -50,
                format: '{point.name}',
                style: {
                    fontSize: '12px'
                }
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Share',
        data: [
            {
                name: 'Samsung',
                y: 23,
                dataLabels: {
                    x: -30,
                    y: -5
                }
            },
            {
                name: 'Apple',
                y: 18,
                dataLabels: {
                    x: -20
                }
            },
            {
                name: 'Xiaomi',
                y: 12,
                sliced: true,
                selected: true,
                dataLabels: {
                    distance: -30,
                    x: -75,
                    y: -10
                }
            },
            {
                name: 'Oppo*',
                y: 9,
                dataLabels: {
                    x: 45,
                    y: 10
                }
            },
            {
                name: 'Vivo',
                y: 8,
                dataLabels: {
                    y: 10
                }
            },
            {
                name: 'Others',
                y: 30,
                dataLabels: {
                    x: 25
                }
            }
        ]
    }]
});
