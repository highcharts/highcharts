/* *
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Annotation from '../Annotation';
import type AnnotationMockPointOptionsObject from '../AnnotationMockPointOptionsObject';
import type { ControllableShapeOptions } from './ControllableOptions';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';

import Controllable from './Controllable.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
const { defined, merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * A controllable circle class.
 *
 * @internal
 * @requires modules/annotations
 *
 * @class
 * @name Highcharts.AnnotationControllableCircle
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the circle
 */
class ControllableCircle extends Controllable {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element
     * attributes.
     *
     * @name Highcharts.AnnotationControllableCircle.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = merge(ControllablePath.attrsMap, { r: 'r' });

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        annotation: Annotation,
        options: ControllableShapeOptions,
        index: number
    ) {
        super(annotation, options, index, 'shape');
    }

    /* *
     *
     *  Properties
     *
     * */

    public type = 'circle';

    public translate = super.translateShape;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        annotation: Annotation,
        options: ControllableShapeOptions,
        index: number
    ): void {
        const { point, xAxis, yAxis } = options;
        if (defined(xAxis) && point) {
            (point as AnnotationMockPointOptionsObject).xAxis = xAxis;
        }
        if (defined(yAxis) && point) {
            (point as AnnotationMockPointOptionsObject).yAxis = yAxis;
        }

        super.init(annotation, options, index);
    }

    public redraw(animation?: boolean): void {

        if (this.graphic) {
            const point = this.points[0],
                position = this.anchor(point).absolutePosition;

            let r = this.options.r;

            if (position && defined(r)) {
                const yAxis = defined(this.options.yAxis) ?
                    this.chart.yAxis[this.options.yAxis] : void 0;

                if (yAxis && defined(point.y)) {
                    r = this.calculateAnnotationSize(
                        point.y, r, yAxis
                    );
                }

                this.graphic[animation ? 'animate' : 'attr']({
                    x: position.x,
                    y: position.y,
                    r
                });
            } else {
                this.graphic.attr({
                    x: 0,
                    y: -9e9
                });
            }

            this.graphic.placed = !!position;
        }

        super.redraw.call(this, animation);
    }

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options);

        this.graphic = this.annotation.chart.renderer
            .circle(0, -9e9, 0)
            .attr(attrs)
            .add(parent);

        super.render();
    }

    /**
     * Set the radius.
     *
     * @internal
     * @param {number} r
     *        A radius to be set
     */
    public setRadius(r: number): void {
        this.options.r = r;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface ControllableCircle {
    collection: 'shapes';
    itemType: 'shape';
    options: ControllableShapeOptions;
}

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module './ControllableType' {
    interface ControllableShapeTypeRegistry {
        circle: typeof ControllableCircle;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ControllableCircle;
