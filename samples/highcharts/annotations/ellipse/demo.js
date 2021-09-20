Highcharts.chart('container', {
    chart: {
        zoomType: 'x',
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    // Show control points.
                    annotation.setControlPointsVisibility(true);
                });
            }
        }
    },

    annotations: [{
        shapes: [{
            type: 'ellipse',
            xAxis: 0,
            yAxis: 0,
            points: [{
                x: 10,
                y: 10
            }, {
                x: 20,
                y: 30
            }],
            ry: 3,
            stroke: 'blue',
            strokeWidth: 4,
            controlPoints: [{
                positioner: function (target) {
                    return {
                        x:
                            target.chart.plotLeft +
                            target.points[0].plotX -
                            this.graphic.width / 2,
                        y:
                            target.chart.plotTop +
                            target.points[0].plotY -
                            this.graphic.width / 2
                    };
                },
                events: {
                    drag: function (e, target) {
                        target.translatePoint(
                            e.chartX -
                                (target.points[0].plotX +
                                    target.chart.plotLeft),
                            e.chartY -
                                (target.points[0].plotY +
                                    target.chart.plotTop),
                            0
                        );

                        target.redraw(false);
                    }
                }
            }, {
                positioner: function (target) {
                    return {
                        x:
                            target.chart.plotLeft +
                            target.points[1].plotX -
                            this.graphic.width / 2,
                        y:
                            target.chart.plotTop +
                            target.points[1].plotY -
                            this.graphic.width / 2
                    };
                },
                events: {
                    drag: function (e, target) {
                        target.translatePoint(
                            e.chartX -
                                (target.points[1].plotX +
                                    target.chart.plotLeft),
                            e.chartY -
                                (target.points[1].plotY +
                                    target.chart.plotTop),
                            1
                        );

                        target.redraw(false);
                    }
                }
            }, {
                positioner: function (target) {
                    const position = target.getAbsolutePosition(
                            target.points[0]
                        ),
                        position2 = target.getAbsolutePosition(
                            target.points[1]
                        ),
                        attrs = target.getAttrs(position, position2);

                    return {
                        x:
                            attrs.cx -
                            this.graphic.width / 2 +
                            attrs.ry * Math.sin((attrs.angle * Math.PI) / 180),
                        y:
                            attrs.cy -
                            this.graphic.height / 2 -
                            attrs.ry * Math.cos((attrs.angle * Math.PI) / 180)
                    };
                },
                events: {
                    drag: function (e, target) {
                        const position = target.getAbsolutePosition(
                                target.points[0]
                            ),
                            position2 = target.getAbsolutePosition(
                                target.points[1]
                            ),
                            attrs = target.getAttrs(
                                position,
                                position2
                            );
                        const dx = e.chartX - attrs.cx,
                            dy = e.chartY - attrs.cy,
                            newR = Math.max(
                                Math.sqrt(dx * dx + dy * dy),
                                5
                            );

                        const yAxis = target.getYAxis();
                        const newRY = Math.abs(
                            yAxis.toValue(0) - yAxis.toValue(newR)
                        );
                        target.options.ry = newRY;

                        target.redraw(false);
                    }
                }
            }]
        }]
    }],
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
