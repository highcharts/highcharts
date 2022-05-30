Highcharts.chart('container', {
    chart: {
        inverted: true,
        height: 600
    },
    title: {
        text: 'Treegraph series with reversed order of nodes.'
    },
    series: [
        {
            reversed: true,
            marker: {
                radius: 20
            },
            type: 'treegraph',
            keys: ['id', 'parent', 'level'],
            data: [
                ['A'],
                ['B', 'A'],
                ['C', 'B'],
                ['E', 'B'],
                ['F', 'A', 4]
            ]
        }
    ]
});
