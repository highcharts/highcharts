Highcharts.chart('container', {
    series: [
        {
            marker: {
                radius: 30
            },
            dataLabels: {
                color: '#222',
                linkFormat: '{point.id} \u2192 {point.parent}'
            },
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: [
                {
                    id: 'A'
                },
                {
                    id: 'B',
                    parent: 'A'
                },
                {
                    id: 'C',
                    parent: 'A'
                }
            ]
        }
    ]
});
