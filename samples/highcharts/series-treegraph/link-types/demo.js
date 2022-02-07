Highcharts.chart('container', {
    title: {
        text: 'Treegraph: Different type of links'
    },
    series: [{
        marker: {
            radius: 30
        },
        link: {
            type: 'straight'
        },
        type: 'treegraph',
        keys: ['from', 'to', 'link.type'],
        data: [
            ['A', 'B', 'default'],
            ['B', 'C'],
            ['B', 'E', 'curved'],
            ['A', 'D']
        ]
    }],
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
