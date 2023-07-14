Highcharts.chart('container', {
    series: [
        {
            marker: {
                radius: 30
            },
            dataLabels: {
                color: '#222',
                format: '{point.id}',
                linkFormat: '{point.parent} \u2192 {point.toNode.id}'
            },
            type: 'treegraph',
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
