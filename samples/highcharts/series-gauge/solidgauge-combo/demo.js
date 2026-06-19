Highcharts.chart('container', {
    title: {
        text: 'Solid Gauge and Gauge combo'
    },

    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.3, '#55BF3B'],
            [0.7, '#DDDF0D'],
            [0.9, '#DF5353']
        ]
    },

    series: [{
        type: 'solidgauge',
        name: 'Target',
        data: [60],
        dataLabels: {
            // Avoid collision with the gauge pivot
            enabled: false
        }
    }, {
        type: 'gauge',
        name: 'Current',
        data: [70]
    }]
});
