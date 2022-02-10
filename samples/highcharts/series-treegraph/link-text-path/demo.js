Highcharts.chart('container', {
    series: [
        {
            marker: {
                radius: 30
            },
            dataLabels: {
                color: '#222',
                nodeFormat: '{point.name}',
                format: '{point.from} \u2192 {point.to}'
            },
            type: 'treegraph',
            keys: ['from', 'to'],
            data: [
                ['A', 'B'],
                ['B', 'C'],
                ['B', 'E'],
                ['A', 'D']
            ]
        }
    ]
});
