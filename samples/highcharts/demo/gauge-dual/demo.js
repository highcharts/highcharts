Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        alignTicks: false,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },

    title: {
        text: 'Speedometer with dual axes'
    },

    pane: {
        startAngle: -150,
        endAngle: 150
    },

    yAxis: [{
        min: 0,
        max: 200,
        lineColor: '#2caffe',
        tickColor: '#2caffe',
        minorTickColor: '#2caffe',
        offset: -25,
        lineWidth: 2,
        labels: {
            distance: -20,
            rotation: 'auto'
        },
        tickLength: 5,
        minorTickLength: 5,
        endOnTick: false
    }, {
        min: 0,
        max: 124,
        tickPosition: 'outside',
        lineColor: '#d66',
        lineWidth: 2,
        minorTickPosition: 'outside',
        tickColor: '#d66',
        minorTickColor: '#d66',
        tickLength: 5,
        minorTickLength: 5,
        labels: {
            distance: 12,
            rotation: 'auto'
        },
        offset: -20,
        endOnTick: false
    }],

    series: [{
        name: 'Speed',
        data: [80],
        dataLabels: {
            format: '<span style="color:#2caffe">{y} km/h</span><br/>' +
                '<span style="color:#d66">{(multiply y 0.621):.0f} mph</span>',
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'var(--highcharts-neutral-color-20, #ddd)'],
                    [1, 'var(--highcharts-background-color, #fff)']
                ]
            },
            style: {
                textOutline: 'none'
            }
        },
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

},
// Add some life
function (chart) {
    setInterval(function () {
        if (chart.axes) { // not destroyed
            const point = chart.series[0].points[0],
                inc = Math.round((Math.random() - 0.5) * 20);
            let newVal;

            newVal = point.y + inc;
            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }
    }, 3000);

});
