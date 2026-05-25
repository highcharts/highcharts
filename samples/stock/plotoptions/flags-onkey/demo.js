Highcharts.stockChart('container', {

    chart: {
        type: 'arearange'
    },

    rangeSelector: {
        enabled: false
    },

    title: {
        text: 'Reading variation'
    },

    tooltip: {
        valueSuffix: '°C'
    },

    series: [{
        id: 'a',
        name: 'Temperatures',
        data: [
            ['2025-01-01', 10, 20],
            ['2025-01-02', 13, 22],
            ['2025-01-03', 14, 15],
            ['2025-01-04', 10, 21]
        ]
    }, {
        type: 'flags',
        onSeries: 'a',
        onKey: 'high',
        data: [{
            x: '2025-01-02',
            title: 'Max'
        }]
    }]

});