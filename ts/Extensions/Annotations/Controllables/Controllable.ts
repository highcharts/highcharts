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
import type { AnnotationPoint } from '../AnnotationSeries';
import type ControllableBase from './ControllableBase';
import type ControllableOptions from './ControllableOptions';
import type { DeepPartial } from '../../../Shared/Types';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';

import ControlTarget from '../ControlTarget.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export type AttrsMapObject = Record<keyof ControllableOptions, keyof SVGAttributes>;

/* *
 *
 *  Class
 *
 * */

abstract class Controllable implements ControlTarget {

    /* *
     *
     *  Constructor
     *
     * */

    /** @internal */
    public constructor(
        annotation: Annotation,
        options: ControllableOptions,
        index: number,
        itemType: ('label'|'shape')
    ) {
        this.annotation = annotation;
        this.chart = annotation.chart;
        this.collection = (itemType === 'label' ? 'labels' : 'shapes');
        this.controlPoints = [];
        this.options = options;
        this.points = [];
        this.index = index;
        this.itemType = itemType;
        this.init(annotation, options, index);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * @name Highcharts.AnnotationControllable#annotation
     * @type {Highcharts.Annotation}
     */
    public annotation: Annotation;

    /**
     * @name Highcharts.AnnotationControllable#chart
     * @type {Highcharts.Chart}
     */
    public chart: AnnotationChart;

    /**
     * @name Highcharts.AnnotationControllable#collection
     * @type {string}
     */
    public collection: ('labels'|'shapes');

    /** @internal */
    public graphic!: SVGElement;

    /** @internal */
    public index: number;

    /** @internal */
    public itemType: ('label'|'shape');

    /** @internal */
    public options: ControllableOptions;

    /** @internal */
    public tracker?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Redirect attr usage on the controllable graphic element.
     * @internal
     */
    public attr<T>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ..._args: Array<T>
    ): void {
        this.graphic.attr.apply(this.graphic, arguments);
    }

    /**
     * Utility function for mapping item's options
     * to element's attribute
     * @internal
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
     * @internal
     */
    public destroy(): void {

        if (this.graphic) {
            this.graphic = this.graphic.destroy() as any;
        }

        if (this.tracker) {
            this.tracker = this.tracker.destroy();
        }

        this.destroyControlTarget();
    }

    /**
     * Init the controllable
     * @internal
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
     * Redraw a controllable.
     * @internal
     */
    public redraw(
        animation?: boolean
    ): void {
        this.redrawControlPoints(animation);
    }

    /**
     * Render a controllable.
     * @internal
     */
    public render(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _parentGroup?: SVGElement
    ): void {
        if (this.options.className && this.graphic) {
            this.graphic.addClass(this.options.className);
        }
        this.renderControlPoints();
    }

    /**
     * Rotate a controllable.
     * @internal
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
     * @internal
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
     * @internal
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
     * @internal
     * @return {boolean}
     *         Whether a controllable should be drawn.
     */
    public shouldBeDrawn(): boolean {
        return !!this.points.length;
    }

    /**
     * Translate shape within controllable item.
     * Replaces `controllable.translate` method.
     *
     * @internal
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
     * @internal
     */
    public update(
        newOptions: DeepPartial<ControllableOptions>
    ): void {
        const annotation = this.annotation,
            options = merge(true, this.options, newOptions),
            parentGroup = this.graphic.parentGroup,
            Constructor: any = this.constructor;

        this.destroy();
        const newControllable = new Constructor(
            annotation,
            options,
            this.index,
            this.itemType
        );
        merge(true, this as any, newControllable);

        this.render(parentGroup);
        this.redraw();
    }

}

/* *
 *
 *  Class Prototype
 *
 * */


/**
 * It provides methods for handling points, control points and points
 * transformations.
 *
 * @interface Highcharts.AnnotationControllable
 */
interface Controllable extends ControllableBase, ControlTarget {
    /**
     * @name Highcharts.AnnotationControllable#points
     * @type {Array<Highcharts.Point>}
     */
    points: Array<AnnotationPoint>;
}

ControlTarget.compose(Controllable);

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
 * An object which denotes a controllable's anchor positions - relative and
 * absolute.
 *
 * @internal
 * @interface Highcharts.AnnotationAnchorObject
 *//**
 * Relative to the plot area position.
 *
 * @internal
 * @name Highcharts.AnnotationAnchorObject#relativePosition
 * @type {Highcharts.BBoxObject}
 *//**
 * Absolute position.
 *
 * @internal
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
 * @internal
 * @name Highcharts.AnnotationControllable#controlPoints
 * @type {Array<Highcharts.AnnotationControlPoint>}
 *//**
 * @name Highcharts.AnnotationControllable#points
 * @type {Array<Highcharts.Point>}
 */

(''); // Keeps doclets above in JS file
