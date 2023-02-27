Highcharts.chart('container', {
    title: {
        text: 'Treegraph series with level options'
    },
    series: [
        {
            marker: {
                radius: 30
            },
            levels: [{
                level: 1,
                dataLabels: {
                    style: {
                        fontSize: '50px'
                    }
                }
            }, {
                level: 2,
                marker: {
                    symbol: 'rect',
                    width: 100,
                    fillColor: 'red'
                }
            }],
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: [
                ['A'],
                ['B', 'A'],
                ['C', 'B'],
                ['E', 'B'],
                ['D', 'A']
            ],
            dataLabels: {
                format: '{point.id}'
            }
        }
    ]
});
