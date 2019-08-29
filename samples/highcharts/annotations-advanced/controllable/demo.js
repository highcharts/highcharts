var positioner = function (target) {
    var xy = Highcharts.Annotation.MockPoint.pointToPixels(
        target.points[this.index]
    );

    return {
        x: xy.x - this.graphic.width / 2,
        y: xy.y - this.graphic.height / 2
    };
};

var chart = Highcharts.chart('container', {

    title: {
        text: 'Controlling elements by dragging'
    },

    chart: {
        // inverted: true,
        zoomType: 'x',
        events: {
            load: function () {
                Highcharts.each(this.annotations, function (annotation) {
                    // showControlPoints/hide
                    annotation.setControlPointsVisibility(true);
                });
            }
        }
    },

    annotations: [{
        shapes: [{
            type: 'path',
            strokeWidth: 4,
            points: [{
                x: 1,
                y: 5,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 4,
                y: 5,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 4,
                y: 8,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 1,
                y: 8,
                xAxis: 0,
                yAxis: 0
            }],

            controlPoints: [{
                positioner: positioner,
                events: {
                    mousedown: function (e, target) {
                        var xy = Highcharts.Annotation.MockPoint.pointToPixels(
                            target.points[2]
                        );

                        this.transformOrigin = xy;
                    },

                    // ROTATE
                    drag: function (e, target) {
                        var center = this.transformOrigin,
                            radians = this.mouseMoveToRadians(
                                e,
                                center.x,
                                center.y
                            );

                        target.rotate(
                            center.x - chart.plotLeft,
                            center.y - chart.plotTop,
                            radians
                        );

                        target.redraw(false);
                    }
                }
            }, {
                positioner: positioner,

                events: {
                    // SCALE
                    drag: function (e, target) {
                        var chart = this.chart,
                            bbox = target.graphic.getBBox(true),
                            center = {
                                x: bbox.x + bbox.width / 2,
                                y: bbox.y + bbox.height / 2
                            },
                            scale = this.mouseMoveToScale(
                                e,
                                center.x,
                                center.y
                            );

                        target.scale(
                            center.x - chart.plotLeft,
                            center.y - chart.plotTop,
                            scale.x,
                            scale.y
                        );

                        target.redraw(false);
                    }
                }
            }]
        }, {
            type: 'path',
            points: [{
                x: 8,
                y: 2,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 12,
                y: 2,
                xAxis: 0,
                yAxis: 0
            }],
            controlPoints: [{
                positioner: positioner,

                // TRANSLATE Y
                events: {
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translate(0, translation.y);
                        target.redraw(false);
                    }
                }
            }, {
                positioner: positioner,
                events: {

                    // TRANSLATE X
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translate(translation.x, 0);
                        target.redraw(false);
                    }
                }
            }, {
                positioner: function (target) {
                    var toPixels = Highcharts.Annotation.MockPoint.pointToPixels,
                        xy1 = toPixels(target.points[0]),
                        xy2 = toPixels(target.points[1]);

                    return {
                        x: xy1.x + (xy2.x - xy1.x - this.graphic.width) / 2,
                        y: xy2.y + (xy1.y - xy2.y - this.graphic.height) / 2
                    };
                },
                events: {
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translate(translation.x, translation.y);
                        target.redraw(false);
                    }
                }
            }]
        }, {
            type: 'circle',
            point: { x: 250, y: 250 },
            r: 10,
            controlPoints: [{
                positioner: function (target) {
                    var xy = Highcharts.Annotation.MockPoint.pointToPixels(
                        target.points[0]
                    );

                    return {
                        x: xy.x - this.graphic.width / 2,
                        y: xy.y - this.graphic.height / 2 - target.options.r
                    };
                },
                events: {
                    // TRANSFORM RADIUS ACCORDING TO Y TRANSLATION
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e),
                            radiusTranslation = target.chart.inverted ?
                                translation.x :
                                translation.y;

                        target.setRadius(
                            Math.max(target.options.r - radiusTranslation, 5)
                        );

                        target.redraw(false);
                    }
                }
            }]
        }],

        labels: [{
            point: 'c',
            format: '{y:.2f}',
            controlPoints: [{
                symbol: 'triangle-down',
                positioner: function (target) {
                    if (!target.graphic.placed) {
                        return {
                            x: 0,
                            y: -9e7
                        };
                    }

                    var xy = Highcharts.Annotation.MockPoint.pointToPixels(
                        target.points[0]
                    );

                    return {
                        x: xy.x - this.graphic.width / 2,
                        y: xy.y - this.graphic.height / 2
                    };
                },

                // TRANSLATE POINT/ANCHOR
                events: {
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translatePoint(translation.x, translation.y);
                        target.redraw(false);
                    }
                }
            }, {
                symbol: 'square',
                positioner: function (target) {
                    if (!target.graphic.placed) {
                        return {
                            x: 0,
                            y: -9e7
                        };
                    }

                    return {
                        x: target.graphic.alignAttr.x - this.graphic.width / 2,
                        y: target.graphic.alignAttr.y - this.graphic.height / 2
                    };
                },

                // TRANSLATE POSITION WITHOUT CHANGING THE ANCHOR
                events: {
                    drag: function (e, target) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translate(translation.x, translation.y);
                        target.redraw(false);
                    }
                }
            }],
            overflow: 'none',
            crop: true
        }]
    }],

    series: [{
        data: [
            1, 2, 3, { y: 4, id: 'a' }, 5, { y: 6, id: 'b' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, { y: 8, id: 'c' }, 4, 4, 3
        ]
    }]
});
