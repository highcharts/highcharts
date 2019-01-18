'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    MockPoint = Annotation.MockPoint,
    InfinityLine = Annotation.types.infinityLine;

/**
 * @class
 * @extends Highcharts.InfinityLine
 * @memberOf Highcharts
 **/
function Pitchfork() {
    InfinityLine.apply(this, arguments);
}

Pitchfork.findEdgePoint = function (
    point,
    firstAnglePoint,
    secondAnglePoint
) {
    var angle = Math.atan2(
            secondAnglePoint.plotY - firstAnglePoint.plotY,
            secondAnglePoint.plotX - firstAnglePoint.plotX
        ),
        distance = 1e7;

    return {
        x: point.plotX + distance * Math.cos(angle),
        y: point.plotY + distance * Math.sin(angle)
    };
};

Pitchfork.middleLineEdgePoint = function (target) {
    var annotation = target.annotation,
        points = annotation.points;

    return InfinityLine.findEdgePoint(
        points[0],
        new MockPoint(
            annotation.chart,
            target,
            annotation.midPointOptions()
        )
    );
};

var outerLineEdgePoint = function (firstPointIndex) {
    return function (target) {
        var annotation = target.annotation,
            points = annotation.points;

        return Pitchfork.findEdgePoint(
            points[firstPointIndex],
            points[0],
            new MockPoint(
                annotation.chart,
                target,
                annotation.midPointOptions()
            )
        );
    };
};

Pitchfork.topLineEdgePoint = outerLineEdgePoint(1);
Pitchfork.bottomLineEdgePoint = outerLineEdgePoint(0);

H.extendAnnotation(Pitchfork, InfinityLine,
    {
        midPointOptions: function () {
            var points = this.points;

            return {
                x: (points[1].x + points[2].x) / 2,
                y: (points[1].y + points[2].y) / 2,
                xAxis: points[0].series.xAxis,
                yAxis: points[0].series.yAxis
            };
        },

        addShapes: function () {
            this.addLines();
            this.addBackgrounds();
        },

        addLines: function () {
            this.initShape({
                type: 'path',
                points: [
                    this.points[0],
                    Pitchfork.middleLineEdgePoint
                ]
            }, false);

            this.initShape({
                type: 'path',
                points: [
                    this.points[1],
                    Pitchfork.topLineEdgePoint
                ]
            }, false);

            this.initShape({
                type: 'path',
                points: [
                    this.points[2],
                    Pitchfork.bottomLineEdgePoint
                ]
            }, false);
        },

        addBackgrounds: function () {
            var shapes = this.shapes,
                typeOptions = this.options.typeOptions;

            var innerBackground = this.initShape(
                H.merge(typeOptions.innerBackground, {
                    type: 'path',
                    points: [
                        function (target) {
                            var annotation = target.annotation,
                                points = annotation.points,
                                midPointOptions = annotation.midPointOptions();

                            return {
                                x: (points[1].x + midPointOptions.x) / 2,
                                y: (points[1].y + midPointOptions.y) / 2,
                                xAxis: midPointOptions.xAxis,
                                yAxis: midPointOptions.yAxis
                            };
                        },
                        shapes[1].points[1],
                        shapes[2].points[1],
                        function (target) {
                            var annotation = target.annotation,
                                points = annotation.points,
                                midPointOptions = annotation.midPointOptions();

                            return {
                                x: (midPointOptions.x + points[2].x) / 2,
                                y: (midPointOptions.y + points[2].y) / 2,
                                xAxis: midPointOptions.xAxis,
                                yAxis: midPointOptions.yAxis
                            };
                        }
                    ]
                })
            );

            var outerBackground = this.initShape(
                H.merge(typeOptions.outerBackground, {
                    type: 'path',
                    points: [
                        this.points[1],
                        shapes[1].points[1],
                        shapes[2].points[1],
                        this.points[2]
                    ]
                })
            );

            typeOptions.innerBackground = innerBackground.options;
            typeOptions.outerBackground = outerBackground.options;
        }
    },
    /**
     * A pitchfork annotation.
     *
     * @extends annotations.infinityLine
     * @sample highcharts/annotations-advanced/pitchfork/
     *         Pitchfork
     * @product highstock
     * @optionparent annotations.pitchfork
     */
    {
        typeOptions: {
            /**
             * Inner background options.
             *
             * @extends annotations.crookedLine.shapeOptions
             * @excluding height, r, type, width
             */
            innerBackground: {
                fill: 'rgba(130, 170, 255, 0.4)',
                strokeWidth: 0
            },
            /**
             * Outer background options.
             *
             * @extends annotations.crookedLine.shapeOptions
             * @excluding height, r, type, width
             */
            outerBackground: {
                fill: 'rgba(156, 229, 161, 0.4)',
                strokeWidth: 0
            }
        }
    });

Annotation.types.pitchfork = Pitchfork;

export default Pitchfork;
