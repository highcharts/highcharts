
Highcharts.chart('container', {
    chart: {
        type: 'candlestick'
    },

    title: {
        text: 'Possible values for pointValKey'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                borderRadius: 5,
                backgroundColor: 'rgba(252, 255, 197, 0.7)',
                borderWidth: 1,
                borderColor: '#AAA',
                format: '{point.series.name}'
            },
            grouping: false
        }
    },

    xAxis: {
        categories: ['on open', 'on high', 'on low', 'on close (default)']
    },

    series: [{
        name: 'open',
        pointValKey: 'open',
        data: [{
            x: 0,
            high: 100,
            low: 0,
            open: 30,
            close: 50
        }]
    }, {
        name: 'high',
        pointValKey: 'high',
        data: [{
            x: 1,
            high: 100,
            low: 0,
            open: 30,
            close: 50
        }]
    }, {
        name: 'low',
        pointValKey: 'low',
        data: [{
            x: 2,
            high: 100,
            low: 0,
            open: 30,
            close: 50
        }]
    }, {
        name: 'close',
        pointValKey: 'close', // default
        data: [{
            x: 3,
            high: 100,
            low: 0,
            open: 30,
            close: 50
        }]
    }]
});
