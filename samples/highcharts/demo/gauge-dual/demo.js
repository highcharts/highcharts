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
        endAngle: 150,
        background: [{
            outerRadius: '105%',
            innerRadius: 0,
            shape: 'circle'
        }]
    },

    yAxis: [{
        min: 0,
        max: 200,
        lineColor: '#2caffe',
        tickColor: '#2caffe',
        minorTicks: true,
        minorTickColor: '#2caffe',
        minorTickWidth: 1,
        minorTickPosition: 'inside',
        tickWidth: 2,
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
        minorTicks: true,
        minorTickLength: 5,
        minorTickColor: '#d66',
        minorTickWidth: 1,
        tickColor: '#d66',
        tickWidth: 2,
        tickLength: 5,
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
            style: {
                textOutline: 'none',
                fontSize: '1.2em'
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
