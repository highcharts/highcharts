Highcharts.chart('container', {
    series: [
        {
            marker: {
                radius: 30
            },
            dataLabels: {
                color: '#222',
                linkFormat: '{point.id} \u2192 {point.parent}'
            },
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: [
                ['A'],
                ['B', 'A'],
                ['C', 'B'],
                ['E', 'B'],
                ['D', 'A']
            ]
        }
    ]
});
