/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Annotations';
import type BBoxObject from '../../../Core/Renderer/BBoxObject';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControlPoint from '../ControlPoint.js';
import MockPoint from '../MockPoint.js';
import Tooltip from '../../../Core/Tooltip.js';
import U from '../../../Core/Utilities.js';
const {
    isObject,
    isString,
    merge,
    splat
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationAnchorObject {
            absolutePosition: BBoxObject;
            relativePosition: BBoxObject;
        }
        interface AnnotationControllable extends AnnotationControllableMixin {
            annotation: Annotation;
            chart: AnnotationChart;
            collection: string;
            controlPoints: Array<AnnotationControlPoint>;
            graphic: SVGElement;
            index: number;
            itemType?: ('label'|'shape');
            markerEnd?: SVGElement;
            markerStart?: SVGElement;
            options: AnnotationControllableOptionsObject;
            points: Array<AnnotationPointType>;
            tracker?: SVGElement;
        }
        interface AnnotationControllableMixin {
            addControlPoints(this: AnnotationControllable): void;
            anchor(this: AnnotationControllable, point: AnnotationPointType): AnnotationAnchorObject;
            attr: SVGElement['attr'];
            attrsFromOptions(this: AnnotationControllable, options: AnnotationControllableOptionsObject): SVGAttributes;
            destroy(this: AnnotationControllable): void;
            getPointsOptions(this: AnnotationControllable): Array<AnnotationMockPointOptionsObject>;
            init(
                this: AnnotationControllable,
                annotation: Annotation,
                options: AnnotationControllableOptionsObject,
                index: number
            ): void;
            linkPoints(this: AnnotationControllable): (Array<AnnotationPointType>|undefined);
            point(
                this: AnnotationControllable,
                pointOptions: (string|Function|AnnotationMockPointOptionsObject),
                point: AnnotationPointType
            ): (AnnotationPointType|null);
            redraw(this: AnnotationControllable, animation?: boolean): void;
            render(this: AnnotationControllable, parentGroup?: SVGElement): void;
            rotate(this: AnnotationControllable, cx: number, cy: number, radians: number): void;
            scale(this: AnnotationControllable, cx: number, cy: number, sx: number, sy: number): void;
            setControlPointsVisibility(this: Highcharts.AnnotationControllable, visible: boolean): void;
            shouldBeDrawn(this: AnnotationControllable): boolean;
            transform(
                this: AnnotationControllable,
                transformation: 'rotate',
                cx: number,
                cy: number,
                radians: number
            ): void;
            transform(
                this: AnnotationControllable,
                transformation: 'scale',
                cx: number,
                cy: number,
                sx: number,
                sy: number
            ): void;
            transform(
                this: AnnotationControllable,
                transformation: string,
                cx: (number|null),
                cy: (number|null),
                p1: number,
                p2?: number
            ): void;
            transformPoint(
                this: AnnotationControllable,
                transformation: string,
                cx: (number|null),
                cy: (number|null),
                p1: number,
                p2: (number|undefined),
                i: number
            ): void;
            translate(this: AnnotationControllable, dx: number, dy: number): void;
            translatePoint(this: Highcharts.AnnotationControllable, dx: number, dy: number, i: number): void;
            translateShape(this: Highcharts.AnnotationControllable, dx: number, dy: number): void;
            update(this: Highcharts.AnnotationControllable, newOptions: AnnotationControllableOptionsObject): void;
        }
        interface AnnotationControllableOptionsObject {
            className?: string;
            controlPoints?: Array<AnnotationControlPointOptionsObject>;
            id?: (number|string);
            markerEnd?: string;
            markerStart?: string;
            point?: (string|AnnotationMockPointOptionsObject);
            points?: Array<(string|AnnotationMockPointOptionsObject)>;
            r?: number;
            x?: number;
            y?: number;
        }
    }
}

/**
 * An object which denots a controllable's anchor positions - relative and
 * absolute.
 *
 * @private
 * @interface Highcharts.AnnotationAnchorObject
 *//**
 * Relative to the plot area position
 * @name Highcharts.AnnotationAnchorObject#relativePosition
 * @type {Highcharts.BBoxObject}
 *//**
 * Absolute position
 * @name Highcharts.AnnotationAnchorObject#absolutePosition
 * @type {Highcharts.BBoxObject}
 */

/**
 * @interface Highcharts.AnnotationControllable
 *//**
 * @name Highcharts.AnnotationControllable#annotation
 * @type {Highcharts.Annotation}
 *//**
 * @name Highcharts.AnnotationControllable#chart
 * @type {Highcharts.Chart}
 *//**
 * @name Highcharts.AnnotationControllable#collection
 * @type {string}
 *//**
 * @private
 * @name Highcharts.AnnotationControllable#controlPoints
 * @type {Array<Highcharts.AnnotationControlPoint>}
 *//**
 * @name Highcharts.AnnotationControllable#points
 * @type {Array<Highcharts.Point>}
 */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * It provides methods for handling points, control points
 * and points transformations.
 *
 * @private
 * @mixin
 * @name Highcharts.AnnotationControllableMixin
 */
var controllableMixin: Highcharts.AnnotationControllableMixin = {
    /**
     * Init the controllable
     */
    init: function (
        this: Highcharts.AnnotationControllable,
        annotation: Annotation,
        options: Highcharts.AnnotationControllableOptionsObject,
        index: number
    ): void {
        this.annotation = annotation;
        this.chart = annotation.chart;
        this.options = options;
        this.points = [];
        this.controlPoints = [];
        this.index = index;

        this.linkPoints();
        this.addControlPoints();
    },

    /**
     * Redirect attr usage on the controllable graphic element.
     */
    attr: function (this: Highcharts.AnnotationControllable): void {
        this.graphic.attr.apply(this.graphic, arguments);
    } as any,


    /**
     * Get the controllable's points options.
     *
     * @return {Array<Highcharts.PointOptionsObject>}
     * An array of points' options.
     */
    getPointsOptions: function (
        this: Highcharts.AnnotationControllable
    ): Array<Highcharts.AnnotationMockPointOptionsObject> {
        var options = this.options;

        return (options.points || (options.point && splat(options.point))) as any;
    },

    /**
     * Utility function for mapping item's options
     * to element's attribute
     *
     * @param {Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions} options
     *
     * @return {Highcharts.SVGAttributes}
     * Mapped options.
     */
    attrsFromOptions: function (
        this: Highcharts.AnnotationControllable,
        options: Highcharts.AnnotationControllableOptionsObject
    ): SVGAttributes {
        var map: SVGAttributes = (this.constructor as any).attrsMap,
            attrs: SVGAttributes = {},
            key: string,
            mappedKey,
            styledMode = this.chart.styledMode;

        for (key in options) { // eslint-disable-line guard-for-in
            mappedKey = (map as any)[key];

            if (
                mappedKey &&
                (
                    !styledMode ||
                    ['fill', 'stroke', 'stroke-width']
                        .indexOf(mappedKey) === -1
                )
            ) {
                (attrs as any)[mappedKey] = (options as any)[key];
            }
        }

        return attrs;
    },

    /**
     * Returns object which denotes anchor position - relative and absolute.
     *
     * @param {Highcharts.AnnotationPointType} point
     * A point like object.
     *
     * @return {Highcharts.AnnotationAnchorObject} a controllable anchor
     */
    anchor: function (
        this: Highcharts.AnnotationControllable,
        point: Highcharts.AnnotationPointType
    ): Highcharts.AnnotationAnchorObject {
        var plotBox = point.series.getPlotBox(),
            chart = point.series.chart,
            box = point.mock ?
                point.toAnchor() :
                Tooltip.prototype.getAnchor.call({
                    chart: point.series.chart
                }, point),

            anchor = {
                x: box[0] + (this.options.x || 0),
                y: box[1] + (this.options.y || 0),
                height: box[2] || 0,
                width: box[3] || 0
            };

        return {
            relativePosition: anchor,
            absolutePosition: merge(anchor, {
                x: anchor.x + (point.mock ? plotBox.translateX : chart.plotLeft),
                y: anchor.y + (point.mock ? plotBox.translateY : chart.plotTop)
            })
        };
    },

    /**
     * Map point's options to a point-like object.
     *
     * @param {string|Function|Highcharts.AnnotationMockPointOptionsObject|Highcharts.AnnotationPointType} pointOptions
     * Point's options.
     *
     * @param {Highcharts.AnnotationPointType} point
     * A point-like instance.
     *
     * @return {Highcharts.AnnotationPointType|null}
     *         if the point is found/set returns this point, otherwise null
     */
    point: function (
        this: Highcharts.AnnotationControllable,
        pointOptions: (string|Function|Highcharts.AnnotationMockPointOptionsObject|Highcharts.AnnotationMockPoint),
        point: (Highcharts.AnnotationPointType|null)
    ): (Highcharts.AnnotationPointType|null) {
        if (pointOptions && (pointOptions as Highcharts.AnnotationMockPointOptionsObject).series) {
            return pointOptions as any;
        }

        if (!point || point.series === null) {
            if (isObject(pointOptions)) {
                point = new MockPoint(
                    this.chart,
                    this,
                    pointOptions as any
                );
            } else if (isString(pointOptions)) {
                point = (this.chart.get(pointOptions) as any) || null;
            } else if (typeof pointOptions === 'function') {
                var pointConfig: (Highcharts.AnnotationMockPoint|Highcharts.AnnotationMockPointOptionsObject) =
                    pointOptions.call(point, this);

                point = pointConfig.series ?
                    pointConfig :
                    new MockPoint(
                        this.chart,
                        this,
                        pointOptions
                    );
            }
        }

        return point;
    },

    /**
     * Find point-like objects based on points options.
     *
     * @return {Array<Annotation.PointLike>} an array of point-like objects
     */
    linkPoints: function (this: Highcharts.AnnotationControllable): (Array<Highcharts.AnnotationPointType>|undefined) {
        var pointsOptions = this.getPointsOptions(),
            points = this.points,
            len = (pointsOptions && pointsOptions.length) || 0,
            i: number,
            point: (Highcharts.AnnotationPointType|null);

        for (i = 0; i < len; i++) {
            point = this.point(pointsOptions[i], points[i]);

            if (!point) {
                points.length = 0;

                return;
            }

            if (point.mock) {
                point.refresh();
            }

            points[i] = point;
        }

        return points;
    },


    /**
     * Add control points to a controllable.
     */
    addControlPoints: function (this: Highcharts.AnnotationControllable): void {
        var controlPointsOptions = this.options.controlPoints;

        (controlPointsOptions || []).forEach(
            function (
                controlPointOptions: Highcharts.AnnotationControlPointOptionsObject,
                i: number
            ): void {
                var options = merge(
                    (this.options as any).controlPointOptions,
                    controlPointOptions
                );

                if (!options.index) {
                    options.index = i;
                }

                (controlPointsOptions as any)[i] = options;

                this.controlPoints.push(
                    new ControlPoint(this.chart, this, options)
                );
            },
            this
        );
    },

    /**
     * Check if a controllable should be rendered/redrawn.
     *
     * @return {boolean}
     * Whether a controllable should be drawn.
     */
    shouldBeDrawn: function (this: Highcharts.AnnotationControllable): boolean {
        return Boolean(this.points.length);
    },

    /**
     * Render a controllable.
     */
    render: function (this: Highcharts.AnnotationControllable, _parentGroup?: SVGElement): void {
        this.controlPoints.forEach(function (controlPoint): void {
            controlPoint.render();
        });
    },

    /**
     * Redraw a controllable.
     *
     * @param {boolean} [animation]
     */
    redraw: function (this: Highcharts.AnnotationControllable, animation?: boolean): void {
        this.controlPoints.forEach(function (controlPoint: Highcharts.AnnotationControlPoint): void {
            controlPoint.redraw(animation);
        });
    },

    /**
     * Transform a controllable with a specific transformation.
     *
     * @param {string} transformation a transformation name
     * @param {number|null} cx origin x transformation
     * @param {number|null} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number} [p2] param for the transformation
     */
    transform: function (
        this: Highcharts.AnnotationControllable,
        transformation: string,
        cx: (number|null),
        cy: (number|null),
        p1: number,
        p2?: number
    ): void {
        if (this.chart.inverted) {
            var temp = cx;

            cx = cy;
            cy = temp;
        }

        this.points.forEach(function (point: Highcharts.AnnotationPointType, i: number): void {
            this.transformPoint(transformation, cx, cy, p1, p2, i);
        }, this);
    },

    /**
     * Transform a point with a specific transformation
     * If a transformed point is a real point it is replaced with
     * the mock point.
     *
     * @param {string} transformation a transformation name
     * @param {number|null} cx origin x transformation
     * @param {number|null} cy origin y transformation
     * @param {number} p1 param for the transformation
     * @param {number|undefined} p2 param for the transformation
     * @param {number} i index of the point
     */
    transformPoint: function (
        this: Highcharts.AnnotationControllable,
        transformation: string,
        cx: (number|null),
        cy: (number|null),
        p1: number,
        p2: (number|undefined),
        i: number
    ): void {
        var point = this.points[i];

        if (!point.mock) {
            point = this.points[i] = MockPoint.fromPoint(point);
        }

        (point as any)[transformation](cx, cy, p1, p2);
    },

    /**
     * Translate a controllable.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     **/
    translate: function (this: Highcharts.AnnotationControllable, dx: number, dy: number): void {
        this.transform('translate', null, null, dx, dy);
    },

    /**
     * Translate a specific point within a controllable.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     * @param {number} i index of the point
     **/
    translatePoint: function (this: Highcharts.AnnotationControllable, dx: number, dy: number, i: number): void {
        this.transformPoint('translate', null, null, dx, dy, i);
    },

    /**
     * Translate shape within controllable item.
     * Replaces `controllable.translate` method.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     */
    translateShape: function (this: Highcharts.AnnotationControllable, dx: number, dy: number): void {
        var chart: Highcharts.AnnotationChart = this.annotation.chart,
            // Annotation.options
            shapeOptions = this.annotation.userOptions,
            // Chart.options.annotations
            annotationIndex = chart.annotations.indexOf(this.annotation),
            chartOptions = chart.options.annotations[annotationIndex];

        this.translatePoint(dx, dy, 0);

        // Options stored in:
        // - chart (for exporting)
        // - current config (for redraws)
        (chartOptions as any)[this.collection][this.index].point = this.options.point;
        (shapeOptions as any)[this.collection][this.index].point = this.options.point;
    },

    /**
     * Rotate a controllable.
     *
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} radians
     **/
    rotate: function (this: Highcharts.AnnotationControllable, cx: number, cy: number, radians: number): void {
        this.transform('rotate', cx, cy, radians);
    },

    /**
     * Scale a controllable.
     *
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} sx scale factor x
     * @param {number} sy scale factor y
     */
    scale: function (this: Highcharts.AnnotationControllable, cx: number, cy: number, sx: number, sy: number): void {
        this.transform('scale', cx, cy, sx, sy);
    },

    /**
     * Set control points' visibility.
     *
     * @param {boolean} visible
     */
    setControlPointsVisibility: function (this: Highcharts.AnnotationControllable, visible: boolean): void {
        this.controlPoints.forEach(function (controlPoint: Highcharts.AnnotationControlPoint): void {
            controlPoint.setVisibility(visible);
        });
    },

    /**
     * Destroy a controllable.
     */
    destroy: function (this: Highcharts.AnnotationControllable): void {
        if (this.graphic) {
            this.graphic = this.graphic.destroy() as any;
        }

        if (this.tracker) {
            this.tracker = this.tracker.destroy();
        }

        this.controlPoints.forEach(function (controlPoint: Highcharts.AnnotationControlPoint): void {
            controlPoint.destroy();
        });

        this.chart = null as any;
        this.points = null as any;
        this.controlPoints = null as any;
        this.options = null as any;

        if (this.annotation) {
            this.annotation = null as any;
        }
    },

    /**
     * Update a controllable.
     *
     * @param {Object} newOptions
     */
    update: function (
        this: Highcharts.AnnotationControllable,
        newOptions: Highcharts.AnnotationControllableOptionsObject
    ): void {
        var annotation = this.annotation,
            options = merge(true, this.options, newOptions),
            parentGroup = this.graphic.parentGroup;

        this.destroy();
        (this as any).constructor(annotation, options);
        this.render(parentGroup);
        this.redraw();
    }
};

namespace controllableMixin {
    export type Type = Highcharts.AnnotationControllable;
}

export default controllableMixin;
