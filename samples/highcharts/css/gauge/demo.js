Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        styledMode: true
    },

    title: {
        text: 'Speedometer'
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,
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
            const point = chart.series[0].points[0],
                inc = Math.round((Math.random() - 0.5) * 20);

            let newVal = point.y + inc;
            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }

            point.update(newVal);

        }, 3000);
    }
});