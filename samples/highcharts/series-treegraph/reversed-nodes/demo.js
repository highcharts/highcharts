Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    series: [
        {
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
        }
    ],
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
