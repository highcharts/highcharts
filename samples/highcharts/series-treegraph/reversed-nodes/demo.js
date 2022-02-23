Highcharts.chart('container', {
    title: {
        text: 'Treegraph series with reversed order of nodes.'
    },
    series: [
        {
            reversed: true,
            marker: {
                radius: 30
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
