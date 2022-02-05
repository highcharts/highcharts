Highcharts.chart('container', {
    series: [
        {
            marker: {
                radius: 30
            },
            dataLabels: {
                color: '#222',
                format: '{point.from} \u2192 {point.to}'
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
