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
        lineColor: '#339',
        tickColor: '#339',
        minorTickColor: '#339',
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
        lineColor: '#933',
        lineWidth: 2,
        minorTickPosition: 'outside',
        tickColor: '#933',
        minorTickColor: '#933',
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
            format: '<span style="color:#339">{y} km/h</span><br/>' +
                '<span style="color:#933">{(multiply y 0.621):.0f} mph</span>',
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#DDD'],
                    [1, '#FFF']
                ]
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
