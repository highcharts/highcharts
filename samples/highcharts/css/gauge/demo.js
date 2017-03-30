

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
            className: 'outer-pane',
            outerRadius: '115%'
        }, {
            className: 'middle-pane',
            outerRadius: '112%'
        }, {
            // default background
        }, {
            className: 'inner-pane',
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,

        minorTickInterval: 'auto',
        minorTickLength: 10,
        minorTickPosition: 'inside',

        tickPixelInterval: 30,
        tickPosition: 'inside',
        tickLength: 10,
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
            className: 'green-band'
        }, {
            from: 120,
            to: 160,
            className: 'yellow-band'
        }, {
            from: 160,
            to: 200,
            className: 'red-band'
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