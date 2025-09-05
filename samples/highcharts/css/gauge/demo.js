Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        styledMode: true
    },

    title: {
        text: 'Speedometer'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        margin: 0,
        innerSize: 0,
        background: [{
            className: 'outer-pane',
            outerRadius: '115%',
            shape: 'circle'
        }, {
            className: 'middle-pane',
            outerRadius: '112%',
            shape: 'circle'
        }, {
            shape: 'circle',
            outerRadius: '110%'
        }, {
            className: 'inner-pane',
            outerRadius: '105%',
            innerRadius: '103%',
            shape: 'circle'
        }]
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 200,

        minorTickInterval: 'auto',
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickWidth: 1,

        tickPixelInterval: 30,
        tickPosition: 'inside',
        tickLength: 10,
        tickWidth: 1,
        labels: {
            step: 2,
            rotation: 'auto',
            distance: -25
        },
        title: {
            text: 'km/h'
        },
        plotBands: [{
            from: 0,
            to: 120,
            className: 'green-band',
            thickness: 10
        }, {
            from: 120,
            to: 160,
            className: 'yellow-band',
            thickness: 10
        }, {
            from: 160,
            to: 200,
            className: 'red-band',
            thickness: 10
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