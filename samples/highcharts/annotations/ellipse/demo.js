Highcharts.chart('container', {
    chart: {
        zoomType: 'x',
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    // showControlPoints/hide
                    annotation.setControlPointsVisibility(true);
                });
            }
        }
    },

    annotations: [
        {
            shapes: [
                {
                    type: 'ellipse',
                    point: {
                        x: 10,
                        y: 0,
                        xAxis: 0,
                        yAxis: 0
                    },
                    angle: 45,
                    rx: 40,
                    ry: 30,
                    controlPoints: [
                        {
                            positioner: function (target) {
                                var xy =
                                        Highcharts.Annotation.MockPoint
                                            .pointToPixels(
                                                target.points[0]
                                            ),
                                    attrs = target.getAttrsFromPoints();

                                return {
                                    x:
                                        xy.x -
                                        this.graphic.width / 2 +
                                        attrs.ry *
                                            Math.sin(
                                                (attrs.angle * Math.PI) / 180
                                            ),
                                    y:
                                        xy.y -
                                        this.graphic.height / 2 -
                                        attrs.ry *
                                            Math.cos(
                                                (attrs.angle * Math.PI) / 180
                                            )
                                };
                            },
                            events: {
                                drag: function (e, target) {
                                    var dx =
                                            e.chartX -
                                            (target.points[0].plotX +
                                                target.chart.plotLeft),
                                        dy =
                                            e.chartY -
                                            (target.points[0].plotY +
                                                target.chart.plotTop),
                                        newR = Math.max(
                                            Math.sqrt(dx * dx + dy * dy),
                                            5
                                        );

                                    target.setYRadius(newR);
                                    target.savePoints();

                                    target.redraw(false);
                                }
                            }
                        },
                        {
                            positioner: function (target) {
                                var xy =
                                        Highcharts.Annotation.MockPoint
                                            .pointToPixels(
                                                target.points[0]
                                            ),
                                    attrs = target.getAttrsFromPoints();

                                return {
                                    x:
                                        xy.x -
                                        this.graphic.width / 2 -
                                        attrs.rx *
                                            Math.cos(
                                                (attrs.angle * Math.PI) / 180
                                            ),
                                    y:
                                        xy.y -
                                        this.graphic.height / 2 -
                                        attrs.rx *
                                            Math.sin(
                                                (attrs.angle * Math.PI) / 180
                                            )
                                };
                            },
                            events: {
                                drag: function (e, target) {
                                    var dx =
                                            e.chartX -
                                            (target.points[0].plotX +
                                                target.chart.plotLeft),
                                        dy =
                                            e.chartY -
                                            (target.points[0].plotY +
                                                target.chart.plotTop),
                                        newR = Math.max(
                                            Math.sqrt(dx * dx + dy * dy),
                                            5
                                        ),
                                        newAngle =
                                            (-Math.atan(dx / dy) * 180) /
                                                Math.PI -
                                            90;

                                    if (dy < 0) {
                                        newAngle += 180;
                                    }

                                    target.setXRadius(newR);
                                    target.setAngle(newAngle);
                                    target.savePoints();

                                    target.redraw(false);
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    xAxis: {
        minRange: 0.1
    },
    series: [
        {
            data: Array.from(
                {
                    length: 100
                },
                (_, x) => Math.floor(Math.cos(x / 10) * 20)
            )
        }
    ]
});
