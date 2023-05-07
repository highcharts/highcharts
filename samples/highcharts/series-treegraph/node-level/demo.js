Highcharts.chart('container', {
    title: {
        text: 'Treegraph: move the node to different level.'
    },
    series: [{
        type: 'treegraph',
        keys: ['id', 'parent', 'level'],
        data: [
            ['A'],
            ['D', 'A', 3],
            ['B', 'A']
        ],
        dataLabels: {
            format: '{point.id}'
        }
    }]
});
