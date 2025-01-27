Highcharts.chart('container', {
    title: {
        text: 'Controllable image annotation'
    },
    chart: {
        zooming: {
            type: 'x'
        },
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    // showControlPoints/hide
                    annotation.setControlPointsVisibility(true);
                });
            }
        }
    },

    annotations: [{
        shapes: [{
            point: 'a',
            type: 'image',
            src: 'https://www.highcharts.com/samples/graphics/sun.png',
            width: 40,
            height: 40,
            verticalAlign: 'middle',
            align: 'right',
            controlPoints: [{
                symbol: 'square',
                style: {
                    fill: 'black'
                },
                width: 5,
                height: 5,
                positioner: function (target) {
                    const xy = Highcharts.Annotation.MockPoint.pointToPixels(
                        target.points[0]
                    );

                    return {
                        x: xy.x,
                        y: xy.y
                    };
                },
                events: {
                    drag: function (e, target) {
                        const translation = this.mouseMoveToTranslation(e);

                        target.translate(0, translation.y);
                        target.redraw(false);
                    }
                }
            }]
        }]
    }],

    series: [{
        data: [
            1, 2, 3, { y: 4, id: 'a' }, 5, { y: 6, id: 'b' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, { y: 8, id: 'c' }, 4, 4, 3
        ]
    }]
});
