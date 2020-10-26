/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../../../Core/Renderer/PositionObject';
import Annotation from '../Annotations.js';
import InfinityLine from './InfinityLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationPitchforkOptionsObject extends AnnotationInfinityLineOptionsObject {
            typeOptions: AnnotationPitchforkTypeOptionsObject;
        }
        interface AnnotationPitchforkTypeOptionsObject extends AnnotationInfinityLineTypeOptionsObject {
            innerBackground: AnnotationsShapeOptions;
            outerBackground: AnnotationsShapeOptions;
        }
        interface AnnotationTypesRegistry {
            pitchfork: typeof Pitchfork;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */


class Pitchfork extends InfinityLine {

    /**
     *
     * Static Properties
     *
     */
    public static topLineEdgePoint = Pitchfork.outerLineEdgePoint(1);
    public static bottomLineEdgePoint = Pitchfork.outerLineEdgePoint(0);


    /* *
     *
     * Static Functions
     *
     * */

    private static outerLineEdgePoint(firstPointIndex: number): Function {
        return function (target: any): PositionObject {
            var annotation: Pitchfork = target.annotation,
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
    }

    public static findEdgePoint(
        point: Highcharts.AnnotationPointType,
        firstAnglePoint: Highcharts.AnnotationPointType,
        secondAnglePoint?: Highcharts.AnnotationPointType
    ): PositionObject {
        var angle = Math.atan2(
                (secondAnglePoint as any).plotY - (firstAnglePoint.plotY as any),
                (secondAnglePoint as any).plotX - (firstAnglePoint.plotX as any)
            ),
            distance = 1e7;

        return {
            x: (point.plotX as any) + distance * Math.cos(angle),
            y: (point.plotY as any) + distance * Math.sin(angle)
        };
    }

    public static middleLineEdgePoint(target: Annotation): PositionObject {
        var annotation: Pitchfork = target.annotation as any,
            points = annotation.points;

        return InfinityLine.findEdgePoint(
            points[0],
            new MockPoint(
                annotation.chart,
                target,
                annotation.midPointOptions()
            )
        );
    }


    /* *
     *
     * Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationPitchforkOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     *  Functions
     *
     * */

    public midPointOptions(): Highcharts.AnnotationMockPointOptionsObject {
        var points = this.points;

        return {
            x: ((points[1].x as any) + (points[2].x as any)) / 2,
            y: ((points[1].y as any) + (points[2].y as any)) / 2,
            xAxis: points[0].series.xAxis,
            yAxis: points[0].series.yAxis
        };
    }

    public addShapes(): void {
        this.addLines();
        this.addBackgrounds();
    }

    public addLines(): void {
        this.initShape({
            type: 'path',
            points: [
                this.points[0],
                Pitchfork.middleLineEdgePoint as any
            ]
        }, false as any);

        this.initShape({
            type: 'path',
            points: [
                this.points[1],
                Pitchfork.topLineEdgePoint as any
            ]
        }, false as any);

        this.initShape({
            type: 'path',
            points: [
                this.points[2],
                Pitchfork.bottomLineEdgePoint as any
            ]
        }, false as any);
    }

    public addBackgrounds(): void {
        var shapes = this.shapes,
            typeOptions = this.options.typeOptions as Highcharts.AnnotationPitchforkTypeOptionsObject;

        var innerBackground = (this.initShape as any)(
            merge(typeOptions.innerBackground, {
                type: 'path',
                points: [
                    function (target: any): Highcharts.AnnotationMockPointOptionsObject {
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
                    function (target: any): Highcharts.AnnotationMockPointOptionsObject {
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

        var outerBackground = (this.initShape as any)(
            merge(typeOptions.outerBackground, {
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
}

interface Pitchfork {
    defaultOptions: InfinityLine['defaultOptions'];
}

Pitchfork.prototype.defaultOptions = merge(
    InfinityLine.prototype.defaultOptions,
    /**
     * A pitchfork annotation.
     *
     * @sample highcharts/annotations-advanced/pitchfork/
     *         Pitchfork
     *
     * @extends      annotations.infinityLine
     * @product      highstock
     * @optionparent annotations.pitchfork
     */
    {
        typeOptions: {
            /**
             * Inner background options.
             *
             * @extends   annotations.crookedLine.shapeOptions
             * @excluding height, r, type, width
             */
            innerBackground: {
                fill: 'rgba(130, 170, 255, 0.4)',
                strokeWidth: 0
            },
            /**
             * Outer background options.
             *
             * @extends   annotations.crookedLine.shapeOptions
             * @excluding height, r, type, width
             */
            outerBackground: {
                fill: 'rgba(156, 229, 161, 0.4)',
                strokeWidth: 0
            }
        }
    }
);

Annotation.types.pitchfork = Pitchfork;

export default Pitchfork;
