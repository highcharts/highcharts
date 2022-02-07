Highcharts.chart('container', {
    title: {
        text: 'Treegraph: move the node to different level.'
    },
    series: [{
        marker: {
            radius: 30
        },
        nodes: [{
            id: 'E',
            level: 2
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
