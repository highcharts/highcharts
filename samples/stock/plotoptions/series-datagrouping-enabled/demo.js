const data = Array.from({ length: 800 }, (_, i) => [
    i * 1000,
    Math.round((2 * Math.sin(i / 50) + Math.random() - 0.5) * 100)
]);

Highcharts.stockChart('container', {
    legend: {
        enabled: true
    },
    series: [
        {
            data,
            name: 'Data Grouping enabled',
            dataGrouping: {
                enabled: false
            }
        },
        {
            name: 'Data Grouping disabled',
            data,
            dataGrouping: {
                forced: true,
                units: [['second', [10]]]
            }
        }
    ]
});
