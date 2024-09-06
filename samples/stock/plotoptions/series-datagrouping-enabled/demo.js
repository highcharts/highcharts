const data = Array.from({ length: 800 }, (_, i) =>
    Math.round((2 * Math.sin(i / 50) + Math.random() - 0.5) * 100)
);

Highcharts.stockChart('container', {
    legend: {
        enabled: true
    },
    series: [
        {
            data: data,
            name: 'Data Grouping enabled',
            dataGrouping: {
                enabled: false
            }
        },
        {
            name: 'Data Grouping disabled',
            data
        }
    ]
});
