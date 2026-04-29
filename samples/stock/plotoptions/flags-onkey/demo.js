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

    plotOptions: {
        series: {
            pointStart: '2025-01-01',
            pointInterval: 24 * 36e5
        }
    },

    series: [{
        id: 'a',
        name: 'Temperatures',
        data: [[0, 10, 20], [10, 13, 22], [20, 14, 15], [30, 10, 21]]
    }, {
        type: 'flags',
        onSeries: 'a',
        onKey: 'high',
        data: [{
            x: 10,
            title: 'Max'
        }]
    }]

});