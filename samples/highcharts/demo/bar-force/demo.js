/**
 * Highcharts plugin for creating individual arrow-head like inverted bars.
 */
(function (H) {
    H.addEvent(
        H.seriesTypes.column,
        'afterColumnTranslate',
        function () {
            const options = this.options,
                topMargin = options.topMargin || 0,
                bottomMargin = options.bottomMargin || 0,
                idx = this.index;

            if (options.headSize) {

                this.points.forEach(function (point) {
                    const shapeArgs = point.shapeArgs,
                        w = shapeArgs.width,
                        h = shapeArgs.height,
                        x = shapeArgs.x,
                        y = shapeArgs.y,
                        cutLeft = idx !== 0,
                        cutRight = point.stackY !== point.y || !cutLeft;

                    var len = options.headSize; // in pixels

                    if (point.y < 0) {
                        len *= -1;
                    }

                    // Preserve the box for data labels
                    point.dlBox = point.shapeArgs;

                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: [
                            ['M', x, y + topMargin],
                            [
                                'L',
                                x + w / 2,
                                y + topMargin + (cutRight ? len : 0)
                            ], // arrow
                            // top side
                            ['L', x + w, y + topMargin],
                            // right side
                            ['L', x + w, y + h],
                            // bottom side
                            [
                                'L',
                                x + w / 2,
                                y + h + bottomMargin + (cutLeft ? len : 0)
                            ],
                            ['L', x, y + h + bottomMargin],
                            // left side
                            ['L', x, y],
                            // close
                            ['Z']
                        ]
                    };

                });
            }
        }
    );
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'bar',
        height: 170
    },
    title: {
        text: 'Force chart'
    },
    plotOptions: {
        bar: {
            headSize: 6,
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                y: 30,
                format: `<span style="color:{point.color}">
                    Force: {point.y}</span>`
            },
            color: 'rgb(1, 127, 250)',
            negativeColor: 'rgb(255, 7, 77)'
        }
    },
    tooltip: {
        format: `<span style="color:{point.color}">\u25CF</span>
            Force: <b>{point.y}</b>`
    },
    yAxis: {
        reversedStacks: false,
        opposite: true,
        labels: {
            enabled: false
        },
        title: ''
    },
    xAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [2]
    }, {
        data: [1]
    }, {
        data: [1]
    }, {
        data: [0.5]
    }, {
        data: [0.5]
    }, {
        data: [0.1]
    }, {
        data: [0.1]
    }, {
        data: [-2]
    }, {
        data: [-1]
    }, {
        data: [-0.1]
    }]
});
