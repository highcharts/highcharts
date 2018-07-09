'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    MockPoint = Annotation.MockPoint,
    ControlPoint = Annotation.ControlPoint;

function CrookedLine() {
    Annotation.apply(this, arguments);
}

H.extendAnnotation(CrookedLine, null, {
    getPointsOptions: function () {
        var typeOptions = this.options.typeOptions;

        return H.map(typeOptions.points, function (pointOptions) {
            pointOptions.xAxis = typeOptions.xAxis;
            pointOptions.yAxis = typeOptions.yAxis;

            return pointOptions;
        });
    },

    getControlPointsOptions: function () {
        return this.getPointsOptions();
    },

    addControlPoints: function () {
        H.each(
            this.getControlPointsOptions(),
            function (pointOptions, i) {
                var controlPoint = new ControlPoint(
                    this.chart,
                    this,
                    H.merge(
                        ControlPoint.defaultOptions,
                        pointOptions.controlPoint,
                        this.options.controlPointsOptions
                    ),
                    i
                );

                this.controlPoints.push(controlPoint);

                pointOptions.controlPoint = controlPoint.options;
            },
            this
        );
    },

    addShapes: function () {
        var typeOptions = this.options.typeOptions,
            shape = this.initShape(
                H.merge(typeOptions.line, {
                    type: 'path',
                    points: H.map(this.points, function (point, i) {
                        return function (target) {
                            return target.annotation.points[i];
                        };
                    })
                }),
                false
            );

        typeOptions.line = shape.options;
    },

    addEvents: function () {
        Annotation.prototype.addEvents.call(this);

        H.addEvent(this, 'drag', this.onDrag);
    },

    onDrag: function (e) {
        if (
            this.chart.isInsidePlot(
                e.chartX - this.chart.plotLeft,
                e.chartY - this.chart.plotTop
            )
        ) {
            var translation = this.mouseMoveToTranslation(e);

            this.translate(translation.x, translation.y);
            this.redraw(false);
        }
    }
}, {
    typeOptions: {
        xAxis: 0,
        yAxis: 0,

        line: {
            fill: 'none'
        }
    },

    controlPointsOptions: {
        positioner: function (target) {
            var graphic = this.graphic,
                xy = MockPoint.pointToPixels(target.points[this.index]);

            return {
                x: xy.x - graphic.width / 2,
                y: xy.y - graphic.height / 2
            };
        },

        events: {
            drag: function (e, target) {
                if (
                    target.chart.isInsidePlot(
                        e.chartX - target.chart.plotLeft,
                        e.chartY - target.chart.plotTop
                    )
                ) {
                    var translation = this.mouseMoveToTranslation(e);

                    target.translatePoint(
                        translation.x,
                        translation.y,
                        this.index
                    );

                    target.redraw(false);
                }
            }
        }
    }
});

Annotation.types['crooked-line'] = CrookedLine;

export default CrookedLine;
