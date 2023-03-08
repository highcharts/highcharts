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
                x: 30,
                y: -20
            }, {
                x: 60,
                y: 20
            }],
            ry: 10,
            stroke: '#00f',
            strokeWidth: 4,
            controlPoints: [{
                positioner: function (target) {
                    const position = target.getAbsolutePosition(
                        target.points[0]
                    );

                    return {
                        x: position.x - this.graphic.width / 2,
                        y: position.y - this.graphic.height / 2
                    };
                },
                events: {
                    drag: function (e, target) {
                        const position = target.getAbsolutePosition(
                            target.points[0]
                        );

                        target.translatePoint(
                            e.chartX - position.x,
                            e.chartY - position.y,
                            0
                        );

                        target.redraw(false);
                    }
                }
            }, {
                positioner: function (target) {
                    const position = target.getAbsolutePosition(
                        target.points[1]
                    );

                    return {
                        x: position.x - this.graphic.width / 2,
                        y: position.y - this.graphic.height / 2
                    };
                },
                events: {
                    drag: function (e, target) {
                        const position = target.getAbsolutePosition(
                            target.points[1]
                        );

                        target.translatePoint(
                            e.chartX - position.x,
                            e.chartY - position.y,
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
                        x: attrs.cx - this.graphic.width / 2 +
                            attrs.ry * Math.sin((attrs.angle * Math.PI) / 180),
                        y: attrs.cy - this.graphic.height / 2 -
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
                            newR = target.getDistanceFromLine(
                                position,
                                position2,
                                e.chartX,
                                e.chartY
                            ),
                            yAxis = target.getYAxis(),
                            newRY = Math.abs(
                                yAxis.toValue(0) - yAxis.toValue(newR)
                            );

                        target.setYRadius(newRY);
                        target.redraw(false);
                    }
                }
            }]
        }]
    }],
    series: [{
        data: Array.from(
            {
                length: 100
            },
            (_, x) => Math.floor(Math.cos(x / 10) * 20)
        )
    }]
});
