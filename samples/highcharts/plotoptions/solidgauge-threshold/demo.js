

var chart = Highcharts.chart('container', {

    chart: {
        type: 'solidgauge'
    },

    title: {
        text: 'Solid gauge with threshold'
    },

    pane: {
        center: ['50%', '50%'],
        size: '90%',
        startAngle: -140,
        endAngle: 140,
        background: {
            backgroundColor: '#EEE',
            innerRadius: '80%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    xAxis: {
        labels: {
            enabled: true
        }
    },

    // the value axis
    yAxis: {

        min: -4,
        max: 4,
        title: {
            text: 'Loss',
            y: 50
        },
        lineWidth: 1,
        tickAmount: 2,
        zIndex: 4,
        labels: {
            y: 20,
            distance: 0.5
        },
        stops: [
            [0.4999, '#55BF3B'], // green
            [0.5, '#DF5353'] // red
        ],
        plotBands: [{
            color: '#55BF3B', // Color value
            from: -4, // Start of the plot band
            to: 0,
            outerRadius: "78%"
        }, {
            color: '#DF5353', // Color value
            from: 0, // Start of the plot band
            to: 4,
            outerRadius: "78%"
        }]
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0
            },
            innerRadius: "80%"
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Svinn',
        data: [-0.5],
        threshold: 0,
        dataLabels: {
            format: '<span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                    'black') + '">{y} </span>' +
                '<span style="font-size:16px">%</span><br>' +
                '<span style="color:silver">Target: 2 %</span>'
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }]
});

// Bring life to the dial
setInterval(function () {
    var point,
        newVal;

    if (chart) {
        point = chart.series[0].points[0];
        newVal = parseFloat(((Math.random() - 0.5) * 4).toFixed(2));

        point.update(newVal);
    }
}, 2000);

