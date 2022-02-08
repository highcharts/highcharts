Highcharts.chart('container', {
    title: {
        text: 'Treegraph: move the node to different level.'
    },
    series: [{
        nodes: [{
            id: 'B',
            level: 3
        }],
        type: 'treegraph',
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['B', 'C'],
            ['B', 'I'],
            ['A', 'D'],
            ['A', 'E'],
            ['E', 'F'],
            ['E', 'G'],
            ['E', 'H']
        ]
    }],
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
