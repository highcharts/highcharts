Highcharts.chart('container', {
    title: {
        text: 'Treegraph: move the node to different level.'
    },
    series: [{
        type: 'treegraph',
        keys: ['id', 'parent', 'column'],
        data: [
            ['A'],
            ['B', 'A'],
            ['D', 'A', 3],
            ['E', 'B'],
            ['F', 'B'],
            ['G', 'D'],
            ['H', 'D'],
            ['I', 'D'],
            ['J', 'E'],
            ['K', 'E']
        ]
    }]
});
