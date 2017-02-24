

Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Speedometer'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            outerRadius: '110%'
        }, {
            outerRadius: '90%'
        }]
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: 'km/h'
        },
        plotBands: [{
            from: 0,
            to: 120,
            className: 'good'
        }, {
            from: 120,
            to: 160,
            className: 'bad'
        }, {
            from: 160,
            to: 200,
            className: 'ugly'
        }]
    },

    series: [{
        name: 'Speed',
        data: [80],
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

},
    // Add some life
    function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);

                newVal = point.y + inc;
                if (newVal < 0 || newVal > 200) {
                    newVal = point.y - inc;
                }

                point.update(newVal);

            }, 3000);
        }
    });