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
 * A controllable rect class.
 *
 * @internal
 * @requires modules/annotations
 *
 * @class
 * @name Highcharts.AnnotationControllableRect
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A rect's options.
 *
 * @param {number} index
 * Index of the rectangle
 */
class ControllableRect extends Controllable {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element attributes
     *
     * @type {Annotation.ControllableRect.AttrsMap}
     */
    public static attrsMap = merge(ControllablePath.attrsMap, {
        width: 'width',
        height: 'height'
    });

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

    public type = 'rect';

    public translate = super.translateShape;

    /* *
     *
     *  Functions
     *
     * */

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options);

        this.graphic = this.annotation.chart.renderer
            .rect(0, -9e9, 0, 0)
            .attr(attrs)
            .add(parent);

        super.render();
    }

    public redraw(animation?: boolean): void {

        if (this.graphic) {
            const point = this.points[0],
                position = this.anchor(point).absolutePosition,
                userWidth = this.options.width,
                userHeight = this.options.height;

            if (
                position &&
                defined(point.x) &&
                defined(point.y) &&
                defined(userWidth) &&
                defined(userHeight)
            ) {
                const xAxis = defined(this.options.xAxis) ?
                        this.chart.xAxis[this.options.xAxis] : void 0,
                    yAxis = defined(this.options.yAxis) ?
                        this.chart.yAxis[this.options.yAxis] : void 0;

                const width =
                    this.calculateAnnotationSize(point.x, userWidth, xAxis);
                const height =
                    this.calculateAnnotationSize(point.y, userHeight, yAxis);

                this.graphic[animation ? 'animate' : 'attr']({
                    x: position.x,
                    y: position.y,
                    width,
                    height
                });
            } else {
                this.attr({
                    x: 0,
                    y: -9e9
                });
            }

            this.graphic.placed = Boolean(position);
        }

        super.redraw(animation);
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface ControllableRect {
    collections: 'shapes';
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
        rect: typeof ControllableRect;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ControllableRect;
