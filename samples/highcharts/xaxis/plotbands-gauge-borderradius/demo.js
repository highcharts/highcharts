Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Gauge with rounded plot bands'
    },

    pane: {
        startAngle: -150,
        endAngle: 150
    },

    // The value axis
    yAxis: {
        min: 0,
        max: 120,
        endOnTick: false,

        title: {
            text: 'km/h'
        },
        labels: {
            distance: 15
        },
        // Plot bands with rounded corners. To avoid the bands having rounded
        // corners in the transitions between them, we apply a trick. For the
        // first and the last band we apply rounded corners, but let them extend
        // behind the middle one. The middle one is not rounded, but has a
        // higher zIndex to be above the other two.
        plotBands: [{
            from: 1,
            to: 70,
            color: '#55BF3B',
            borderRadius: '50%'
        }, {
            from: 50,
            to: 90,
            color: '#DDDF0D',
            zIndex: 1
        }, {
            from: 70,
            to: 119,
            color: '#DF5353',
            borderRadius: '50%'
        }]
    },

    series: [{
        name: 'Speed',
        data: [80],
        dataLabels: {
            borderWidth: 0,
            style: {
                fontSize: '2em'
            }
        },
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

});
