Highcharts.chart('container', {
    title: {
        text: 'Organization Chart: Different type of links'
    },
    series: [{
        marker: {
            radius: 30
        },
        link: {
            type: 'straight'
        },
        type: 'organization',
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
