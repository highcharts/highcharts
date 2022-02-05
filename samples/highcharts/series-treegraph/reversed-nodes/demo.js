Highcharts.chart('container', {
    title: {
        text: 'Treegraph series with reversed order of nodes.'
    },
    series: [{
        reversed: true,
        marker: {
            radius: 30
        },
        type: 'treegraph',
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['B', 'C'],
            ['B', 'E'],
            ['A', 'D']
        ]
    }],
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
