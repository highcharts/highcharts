Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },
    title: {
        text: 'Gauge with plot band labels'
    },
    pane: {
        startAngle: -150,
        endAngle: 150,
        innerSize: '85%'
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 120,

        plotBands: [{
            from: 0,
            to: 50,
            color: '#55BF3B',
            label: {
                text: 'green',
                align: 'right',
                x: -10
            }
        }, {
            from: 50,
            to: 90,
            color: '#DDDF0D',
            label: {
                text: 'yellow',
                align: 'left'
            }
        }, {
            from: 90,
            to: 120,
            color: '#DF5353',
            label: {
                text: 'red',
                align: 'left'
            }
        }],
        labels: {
            distance: -30
        }
    },

    series: [{
        name: 'Speed',
        data: [80],
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

});
