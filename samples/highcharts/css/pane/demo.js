Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        styledMode: true
    },

    title: {
        text: 'Pane in styled mode'
    },

    pane: {
        startAngle: -150,
        endAngle: 150
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,
        tickPixelInterval: 30,
        labels: {
            step: 2,
            rotation: 'auto',
            distance: 10
        },
        title: {
            text: 'km/h',
            y: 20
        },
        plotBands: [{
            from: 40,
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