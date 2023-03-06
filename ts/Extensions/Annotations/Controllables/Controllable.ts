/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Annotation from '../Annotation';
import type AnnotationChart from '../AnnotationChart';
import type { AnnotationPointType } from '../AnnotationSeries';
import type BBoxObject from '../../../Core/Renderer/BBoxObject';
import type ControllableLike from './ControllableLike';
import type ControllableOptions from './ControllableOptions';
import type MockPointOptions from '../MockPointOptions';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';

import ControlPoint from '../ControlPoint.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const {
    isObject,
    isString,
    merge,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

export type AttrsMapObject = Record<keyof ControllableOptions, keyof SVGAttributes>;

export interface ControllableAnchorObject {
    absolutePosition: BBoxObject;
    relativePosition: BBoxObject;
}

/* *
 *
 *  Class
 *
 * */

/**
 * It provides methods for handling points, control points
 * and points transformations.
 * @private
 */
abstract class Controllable {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        annotation: Annotation,
        options: ControllableOptions,
        index: number,
        itemType: ('label'|'shape')
    ) {
        this.annotation = annotation;
        this.chart = annotation.chart;
        this.collection = (itemType === 'label' ? 'labels' : 'shapes');
        this.options = options;
        this.points = [];
        this.controlPoints = [];
        this.index = index;
        this.itemType = itemType;
        this.init(annotation, options, index);
    }

    /* *
     *
     *  Properties
     *
     * */

    public annotation: Annotation;
    public chart: AnnotationChart;
    public collection: ('labels'|'shapes');
    public controlPoints: Array<ControlPoint>;
    public graphic: SVGElement = void 0 as any;
    public index: number;
    public itemType: ('label'|'shape');
    public options: ControllableOptions;
    public points: Array<AnnotationPointType>;
    public tracker?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add control points to a controllable.
     * @private
     */
    public addControlPoints(): void {
        const controlPoints = this.controlPoints,
            controlPointsOptions = this.options.controlPoints || [];

        controlPointsOptions.forEach((controlPointOptions, i): void => {
            const options = merge(
                this.options.controlPointOptions,
                controlPointOptions
            );

            if (!options.index) {
                options.index = i;
            }

            controlPointsOptions[i] = options;

            controlPoints.push(new ControlPoint(
                this.chart,
                this,
                options
            ));
        });
    }

    /**
     * Returns object which denotes anchor position - relative and absolute.
     * @private
     * @param {Highcharts.AnnotationPointType} point
     *        A point like object.
     * @return {Highcharts.AnnotationAnchorObject}
     *         A controllable anchor
     */
    public anchor(
        point: AnnotationPointType
    ): ControllableAnchorObject {
        const plotBox = point.series.getPlotBox(),
            chart = point.series.chart,
            box = point.mock ?
                point.toAnchor() :
                chart.tooltip &&
                chart.tooltip.getAnchor.call({
                    chart: point.series.chart
                }, point) ||
                [0, 0, 0, 0],

            anchor = {
                x: box[0] + (this.options.x || 0),
                y: box[1] + (this.options.y || 0),
                height: box[2] || 0,
                width: box[3] || 0
            };

        return {
            relativePosition: anchor,
            absolutePosition: merge(anchor, {
                x: anchor.x + (
                    point.mock ? plotBox.translateX : chart.plotLeft
                ),
                y: anchor.y + (point.mock ? plotBox.translateY : chart.plotTop)
            })
        };
    }

    /**
     * Redirect attr usage on the controllable graphic element.
     * @private
     */
    public attr<T>(..._args: Array<T>): void {
        this.graphic.attr.apply(this.graphic, arguments);
    }

    /**
     * Utility function for mapping item's options
     * to element's attribute
     * @private
     * @param {Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions} options
     * @return {Highcharts.SVGAttributes}
     *         Mapped options.
     */
    public attrsFromOptions(
        options: ControllableOptions
    ): SVGAttributes {
        const map = (this.constructor as AnyRecord).attrsMap as AttrsMapObject,
            attrs: SVGAttributes = {},
            styledMode = this.chart.styledMode;

        let key: keyof ControllableOptions,
            mappedKey: keyof SVGAttributes;

        for (key in options) { // eslint-disable-line guard-for-in
            mappedKey = map[key];

            if (
                typeof map[key] !== 'undefined' &&
                (
                    !styledMode ||
                    ['fill', 'stroke', 'stroke-width']
                        .indexOf(mappedKey) === -1
                )
            ) {
                attrs[mappedKey] = options[key] as undefined;
            }
        }

        return attrs;
    }

    /**
     * Destroy a controllable.
     * @private
     */
    public destroy(): void {

        if (this.graphic) {
            this.graphic = this.graphic.destroy() as any;
        }

        if (this.tracker) {
            this.tracker = this.tracker.destroy();
        }

        this.controlPoints.forEach(
            (controlPoint): void => controlPoint.destroy()
        );

        this.chart = null as any;
        this.points = null as any;
        this.controlPoints = null as any;
        this.options = null as any;

        if (this.annotation) {
            this.annotation = null as any;
        }

    }

    /**
     * Get the controllable's points options.
     * @private
     * @return {Array<Highcharts.PointOptionsObject>}
     *         An array of points' options.
     */
    public getPointsOptions(): Array<MockPointOptions> {
        const options = this.options;

        return (
            options.points ||
            (options.point && splat(options.point))
        ) as any;
    }

    /**
     * Init the controllable
     * @private
     */
    public init(
        annotation: Annotation,
        options: ControllableOptions,
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
    }

    /**
     * Find point-like objects based on points options.
     * @private
     * @return {Array<Annotation.PointLike>}
     *         An array of point-like objects.
     */
    public linkPoints(): (Array<AnnotationPointType>|undefined) {
        const pointsOptions = this.getPointsOptions(),
            points = this.points,
            len = (pointsOptions && pointsOptions.length) || 0;

        let i: number,
            point: (AnnotationPointType|null);

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
    }

    /**
     * Map point's options to a point-like object.
     * @private
     * @param {string|Function|Highcharts.AnnotationMockPointOptionsObject|Highcharts.AnnotationPointType} pointOptions
     *        Point's options.
     * @param {Highcharts.AnnotationPointType} point
     *        A point-like instance.
     * @return {Highcharts.AnnotationPointType|null}
     *         If the point is found/set returns this point, otherwise null
     */
    public point(
        pointOptions: (string|Function|MockPoint|MockPointOptions),
        point: (AnnotationPointType|null)
    ): (AnnotationPointType|null) {
        if (pointOptions && (pointOptions as MockPointOptions).series) {
            return pointOptions as any;
        }

        if (!point || point.series === null) {
            if (isObject(pointOptions)) {
                point = new MockPoint(
                    this.chart,
                    this,
                    pointOptions as MockPointOptions
                );
            } else if (isString(pointOptions)) {
                point = (this.chart.get(pointOptions) as any) || null;
            } else if (typeof pointOptions === 'function') {
                const pointConfig: (MockPoint|MockPointOptions) =
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
    }

    /**
     * Redraw a controllable.
     * @private
     */
    public redraw(
        animation?: boolean
    ): void {
        this.controlPoints.forEach(
            (controlPoint): void => controlPoint.redraw(animation)
        );
    }

    /**
     * Render a controllable.
     * @private
     */
    public render(
        _parentGroup?: SVGElement
    ): void {
        this.controlPoints.forEach(
            (controlPoint): void => controlPoint.render()
        );
    }

    /**
     * Rotate a controllable.
     * @private
     * @param {number} cx
     *        Origin x rotation
     * @param {number} cy
     *        Origin y rotation
     * @param {number} radians
     **/
    public rotate(
        cx: number,
        cy: number,
        radians: number
    ): void {
        this.transform('rotate', cx, cy, radians);
    }

    /**
     * Scale a controllable.
     * @private
     * @param {number} cx
     *        Origin x rotation
     * @param {number} cy
     *        Origin y rotation
     * @param {number} sx
     *        Scale factor x
     * @param {number} sy
     *        Scale factor y
     */
    public scale(
        cx: number,
        cy: number,
        sx: number,
        sy: number
    ): void {
        this.transform('scale', cx, cy, sx, sy);
    }

    /**
     * Set control points' visibility.
     * @private
     */
    public setControlPointsVisibility(
        visible: boolean
    ): void {
        this.controlPoints.forEach((controlPoint): void => {
            controlPoint.setVisibility(visible);
        });
    }

    /**
     * Check if a controllable should be rendered/redrawn.
     * @private
     * @return {boolean}
     *         Whether a controllable should be drawn.
     */
    public shouldBeDrawn(): boolean {
        return !!this.points.length;
    }

    /**
     * Transform a controllable with a specific transformation.
     * @private
     * @param {string} transformation
     *        A transformation name
     * @param {number|null} cx
     *        Origin x transformation
     * @param {number|null} cy
     *        Origin y transformation
     * @param {number} p1
     *        Param for the transformation
     * @param {number} [p2]
     *        Param for the transformation
     */
    public transform(
        transformation: string,
        cx: (number|null),
        cy: (number|null),
        p1: number,
        p2?: number
    ): void {
        if (this.chart.inverted) {
            const temp = cx;

            cx = cy;
            cy = temp;
        }

        this.points.forEach((_point, i): void => (
            this.transformPoint(transformation, cx, cy, p1, p2, i)
        ), this);
    }

    /**
     * Transform a point with a specific transformation
     * If a transformed point is a real point it is replaced with
     * the mock point.
     * @private
     * @param {string} transformation
     *        A transformation name
     * @param {number|null} cx
     *        Origin x transformation
     * @param {number|null} cy
     *        Origin y transformation
     * @param {number} p1
     *        Param for the transformation
     * @param {number|undefined} p2
     *        Param for the transformation
     * @param {number} i
     *        Index of the point
     */
    public transformPoint(
        transformation: string,
        cx: (number|null),
        cy: (number|null),
        p1: number,
        p2: (number|undefined),
        i: number
    ): void {
        let point = this.points[i];

        if (!point.mock) {
            point = this.points[i] = MockPoint.fromPoint(point);
        }

        (point as any)[transformation](cx, cy, p1, p2);
    }

    /**
     * Translate a controllable.
     * @private
     * @param {number} dx
     *        Translation for x coordinate
     * @param {number} dy
     *        Translation for y coordinate
     **/
    public translate(
        dx: number,
        dy: number
    ): void {
        this.transform('translate', null, null, dx, dy);
    }

    /**
     * Translate a specific point within a controllable.
     * @private
     * @param {number} dx
     *        Translation for x coordinate
     * @param {number} dy
     *        Translation for y coordinate
     * @param {number} i
     *        Index of the point
     **/
    public translatePoint(
        dx: number,
        dy: number,
        i: number
    ): void {
        this.transformPoint('translate', null, null, dx, dy, i);
    }

    /**
     * Translate shape within controllable item.
     * Replaces `controllable.translate` method.
     * @private
     * @param {number} dx
     *        Translation for x coordinate
     * @param {number} dy
     *        Translation for y coordinate
     * @param {boolean|undefined} translateSecondPoint
     *        If the shape has two points attached to it, this option allows you
     *        to translate also the second point.
     */
    public translateShape(
        dx: number,
        dy: number,
        translateSecondPoint?: boolean
    ): void {
        const chart = this.annotation.chart,
            // Annotation.options
            shapeOptions = this.annotation.userOptions,
            // Chart.options.annotations
            annotationIndex = chart.annotations.indexOf(this.annotation),
            chartOptions = chart.options.annotations[annotationIndex];

        this.translatePoint(dx, dy, 0);

        if (translateSecondPoint) {
            this.translatePoint(dx, dy, 1);
        }

        // Options stored in:
        // - chart (for exporting)
        // - current config (for redraws)
        (chartOptions as any)[this.collection][this.index]
            .point = this.options.point;
        (shapeOptions as any)[this.collection][this.index]
            .point = this.options.point;
    }

    /**
     * Update a controllable.
     * @private
     */
    public update(
        newOptions: DeepPartial<ControllableOptions>
    ): void {
        const annotation = this.annotation,
            options = merge(true, this.options, newOptions),
            parentGroup = this.graphic.parentGroup;

        this.destroy();
        this.constructor(annotation, options, this.index, this.itemType);
        this.render(parentGroup);
        this.redraw();
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Controllable extends ControllableLike {
    // placeholder for additional class members
}

/* *
 *
 *  Default Export
 *
 * */

export default Controllable;

/* *
 *
 *  API Declarations
 *
 * */


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

(''); // keeps doclets above in JS file
