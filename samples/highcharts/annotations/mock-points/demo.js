var minMax = {};

function getMinMax(chart) {
    var yMin = Math.min.apply(
            null,
            chart.series[0].processedYData.slice(1, -1)
        ),
        yMax = Math.max.apply(
            null,
            chart.series[0].processedYData.slice(1, -1)
        ),
        maxIndex = chart.series[0].processedYData.indexOf(yMax),
        minIndex = chart.series[0].processedYData.indexOf(yMin);


    minMax = {
        xMin: chart.series[0].processedXData[minIndex],
        xMax: chart.series[0].processedXData[maxIndex],
        yMin,
        yMax
    };
}

Highcharts.chart('container', {
    chart: {
        zoomType: 'x'
    },

    title: {
        text: 'Highcharts Annotations'
    },

    xAxis: {
        type: 'datetime'
    },

    annotations: [{
        draggable: '',
        shapes: [{
            type: 'path',
            points: [
                function (annotation) {
                    // Calculate once
                    getMinMax(annotation.chart);

                    return {
                        x: annotation.chart.xAxis[0].min,
                        xAxis: 0,
                        y: (minMax.yMin + minMax.yMax) / 2,
                        yAxis: 0
                    };
                },
                function (annotation) {
                    return {
                        x: annotation.chart.xAxis[0].max,
                        xAxis: 0,
                        y: (minMax.yMin + minMax.yMax) / 2,
                        yAxis: 0
                    };
                }
            ]
        }],
        labels: [{
            point: function () {
                return {
                    x: minMax.xMax,
                    xAxis: 0,
                    y: minMax.yMax,
                    yAxis: 0
                };
            },
            format: 'max: {y:.2f}'
        }, {
            point: function () {
                return {
                    x: minMax.xMin,
                    xAxis: 0,
                    y: minMax.yMin,
                    yAxis: 0
                };
            },
            format: 'min: {y:.2f}'
        }, {
            point: function (annotation) {
                return {
                    x: annotation.chart.xAxis[0].max,
                    xAxis: 0,
                    y: (minMax.yMin + minMax.yMax) / 2,
                    yAxis: 0
                };
            },
            y: 11,
            x: -30,
            clip: false,
            overflow: 'none',
            format: 'avg: {y:.2f}'
        }]
    }],

    series: [{
        pointInterval: 24 * 36e5,
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});
