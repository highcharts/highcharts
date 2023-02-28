Highcharts.chart('container', {
    title: {
        text: 'Organization chart with link labels'
    },
    series: [{
        type: 'organization',
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['C', 'D']
        ],
        dataLabels: {
            linkFormat: 'from {point.from} to {point.to}',
            linkTextPath: {
                enabled: true
            }
        }
    }]
});
