/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import Annotation from '../Annotations.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationVerticalLine extends Annotation {
            public static connectorFirstPoint: Function;
            public static connectorSecondPoint: Function;
            public getPointsOptions: () => Array<AnnotationMockPointOptionsObject>;
            public options: AnnotationVerticalLineOptionsObject;
            public addLabels(): void;
            public addShapes(): void;
        }
        interface AnnotationVerticalLineOptionsObject extends AnnotationsOptions {
            typeOptions: AnnotationVerticalLineTypeOptionsObject;
        }
        interface AnnotationVerticalLineTypeLabelOptionsObject extends AnnotationsLabelOptions {
            offset: number;
        }
        interface AnnotationVerticalLineTypeOptionsObject extends AnnotationsTypeOptions {
            connector: AnnotationsShapeOptions;
            label: AnnotationVerticalLineTypeLabelOptionsObject;
            yOffset: number;
        }
        interface AnnotationTypesRegistry {
            verticalLine: typeof VerticalLine;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

class VerticalLine extends Annotation {

    /* *
     *
     *  Static Functions
     *
     * */

    public static connectorFirstPoint(
        target: Highcharts.AnnotationControllable
    ): Highcharts.AnnotationMockPointOptionsObject {
        var annotation = target.annotation as Highcharts.AnnotationVerticalLine,
            point = annotation.points[0],
            xy = MockPoint.pointToPixels(point, true),
            y = xy.y,
            offset = annotation.options.typeOptions.label.offset;

        if (annotation.chart.inverted) {
            y = xy.x;
        }

        return {
            x: point.x as any,
            xAxis: point.series.xAxis,
            y: y + offset
        };
    }

    public static connectorSecondPoint(
        target: Highcharts.AnnotationControllable
    ): Highcharts.AnnotationMockPointOptionsObject {
        var annotation = target.annotation as Highcharts.AnnotationVerticalLine,
            typeOptions = annotation.options.typeOptions,
            point = annotation.points[0],
            yOffset = typeOptions.yOffset,
            xy = MockPoint.pointToPixels(point, true),
            y = xy[annotation.chart.inverted ? 'x' : 'y'];

        if (typeOptions.label.offset < 0) {
            yOffset *= -1;
        }

        return {
            x: point.x as any,
            xAxis: point.series.xAxis,
            y: y + yOffset
        };
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        chart: Highcharts.AnnotationChart,
        userOptions: Highcharts.AnnotationVerticalLineOptionsObject
    ) {
        super(chart, userOptions);
    }

    /* *
     *
     *  Functions
     *
     * */

    public getPointsOptions(): Array<Highcharts.AnnotationMockPointOptionsObject> {
        return [this.options.typeOptions.point];
    }

    public addShapes(): void {
        var typeOptions = this.options.typeOptions,
            connector = this.initShape(
                merge(typeOptions.connector, {
                    type: 'path',
                    points: [
                        VerticalLine.connectorFirstPoint,
                        VerticalLine.connectorSecondPoint
                    ]
                }),
                false as any
            );

        typeOptions.connector = connector.options;
    }

    public addLabels(): void {
        var typeOptions = this.options.typeOptions,
            labelOptions = typeOptions.label,
            x = 0,
            y = labelOptions.offset,
            verticalAlign = (labelOptions.offset as any) < 0 ? 'bottom' : 'top',
            align = 'center';

        if (this.chart.inverted) {
            x = labelOptions.offset as any;
            y = 0;
            verticalAlign = 'middle';
            align = (labelOptions.offset as any) < 0 ? 'right' : 'left';
        }

        var label = (this.initLabel as any)(
            merge(labelOptions, {
                verticalAlign: verticalAlign,
                align: align,
                x: x,
                y: y
            })
        );

        typeOptions.label = label.options;
    }

}

interface VerticalLine {
    defaultOptions: Annotation['defaultOptions'];
    options: Highcharts.AnnotationVerticalLineOptionsObject;
}

VerticalLine.prototype.defaultOptions = merge(
    Annotation.prototype.defaultOptions,
    /**
     * A vertical line annotation.
     *
     * @sample highcharts/annotations-advanced/vertical-line/
     *         Vertical line
     *
     * @extends      annotations.crookedLine
     * @excluding    labels, shapes, controlPointOptions
     * @product      highstock
     * @optionparent annotations.verticalLine
     */
    {
        typeOptions: {
            /**
             * @ignore
             */
            yOffset: 10,

            /**
             * Label options.
             *
             * @extends annotations.crookedLine.labelOptions
             */
            label: {
                offset: -40,
                point: function (target: Highcharts.AnnotationControllable): Highcharts.AnnotationPointType {
                    return target.annotation.points[0];
                } as any,
                allowOverlap: true,
                backgroundColor: 'none',
                borderWidth: 0,
                crop: true,
                overflow: 'none' as any,
                shape: 'rect',
                text: '{y:.2f}'
            },

            /**
             * Connector options.
             *
             * @extends   annotations.crookedLine.shapeOptions
             * @excluding height, r, type, width
             */
            connector: {
                strokeWidth: 1,
                markerEnd: 'arrow'
            }
        }
    }
);

Annotation.types.verticalLine = VerticalLine;

export default VerticalLine;
