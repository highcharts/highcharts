Highcharts.chart('container', {
    title: {
        text: 'Treegraph series with reversed order of nodes.'
    },
    series: [
        {
            reversed: true,
            marker: {
                radius: 30
            },
            type: 'treegraph',
            keys: ['from', 'to'],
            dataLabels: {
                allowOverlap: false
            },
            data: [
                { id: 'A' },
                { id: 'B', parent: 'A' },
                { id: 'C', parent: 'B' },
                { id: 'E', parent: 'B' },
                { id: 'D', parent: 'A' }
            ]
        }
    ]
});
