Highcharts.chart('container', {
    title: {
        text: 'Simple Gauge'
    },
    chart: {
        type: 'gauge'
    },
    yAxis: {
        min: 0,
        max: 200,
        plotBands: [{
            from: 0,
            to: 120,
            color: '#55BF3B' // green
        }, {
            from: 120,
            to: 160,
            color: '#DDDF0D' // yellow
        }, {
            from: 160,
            to: 200,
            color: '#DF5353' // red
        }]
    },
    series: [{
        name: 'Speed',
        data: [80]
    }]
});