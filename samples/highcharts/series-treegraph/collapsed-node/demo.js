Highcharts.chart('container', {
    title: {
        text: 'Treegraph series with initially collapsed node.'
    },
    series: [
        {
            marker: {
                radius: 30
            },
            type: 'treegraph',
            keys: ['id', 'parent', 'collapsed'],
            data: [
                ['A'],
                ['B', 'A', true],
                ['C', 'B'],
                ['E', 'B'],
                ['D', 'A']
            ],
            dataLabels: {
                format: '{point.id}'
            }
        }
    ]
});
