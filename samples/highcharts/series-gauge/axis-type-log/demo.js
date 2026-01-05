Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },

    title: {
        text: 'Gauge with log axis'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        innerSize: '90%',
        borderRadius: 0
    },

    // the value axis
    yAxis: {
        min: 1,
        max: 200,
        type: 'logarithmic',

        minorTickInterval: 'auto',
        minorGridLineWidth: 0.5,

        tickPixelInterval: 30,
        gridLineWidth: 2,
        labels: {
            step: 2
        },
        title: {
            text: 'km/h'
        },
        plotBands: [{
            from: 1,
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
        data: [80],
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

});
