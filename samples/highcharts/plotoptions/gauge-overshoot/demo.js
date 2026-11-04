Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Demo of gauge with overshoot'
    },

    // the value axis
    yAxis: {
        min: -50,
        max: 50,
        startOnTick: false,
        endOnTick: false,
        plotBands: [{
            from: -50,
            to: 50,
            color: '#d3e9f7' // light blue
        }, {
            from: 20,
            to: 50,
            color: '#6fbe6b' // green
        }, {
            from: -50,
            to: -20,
            color: '#e7797d' // yellow
        }]
    },

    series: [{
        name: 'Speed',
        data: [60],
        overshoot: 5
    }]

},
// Add some life
function (chart) {
    if (!chart.renderer.forExport) {
        setInterval(function () {
            const point = chart.series[0].points[0],
                inc = Math.round((Math.random() - 0.5) * 100);
            let newVal = point.y + inc;

            if (newVal < -100 || newVal > 100) {
                newVal = point.y - inc;
            }

            point.update(newVal);

        }, 3000);
    }
});