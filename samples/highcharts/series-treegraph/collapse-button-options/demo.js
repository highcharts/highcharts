Highcharts.chart('container', {
    title: {
        text: 'Treegraph\'s collpaseButton options'
    },
    series: [
        {
            marker: {
                radius: 30
            },
            collapseButton: {
                onlyOnHover: false,
                height: 40,
                width: 40,
                style: { fontSize: 20 }
            },
            type: 'treegraph',
            keys: ['id', 'parent'],
            data: [['A'], ['B', 'A'], ['C', 'B'], ['E', 'B'], ['D', 'A']],
            colorByPoint: true,
            dataLabels: {
                format: '{point.id}'
            }
        }
    ]
});
