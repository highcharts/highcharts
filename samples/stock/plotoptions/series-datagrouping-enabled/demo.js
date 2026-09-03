const data = Array.from({ length: 800 }, (_, i) => [
    Math.round((2 * Math.sin(i / 50) + Math.random() - 0.5) * 100)
]);

Highcharts.stockChart('container', {
    legend: {
        enabled: true
    },
    plotOptions: {
        series: {
            pointStart: '2025-01-01',
            pointInterval: 60 * 1000
        }
    },
    series: [
        {
            data,
            name: 'Data Grouping disabled',
            dataGrouping: {
                enabled: false
            }
        },
        {
            name: 'Data Grouping enabled',
            data,
            dataGrouping: {
                forced: true,
                units: [['minute', [15]]]
            }
        }
    ]
});
