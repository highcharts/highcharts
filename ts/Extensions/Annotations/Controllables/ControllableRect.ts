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
                position = this.anchor(point).absolutePosition;

            if (position) {
                const options = this.options,
                    chart = this.annotation.chart,
                    xAxis =
                        defined(options.xAxis) && chart.xAxis[options.xAxis],
                    yAxis =
                        defined(options.yAxis) && chart.yAxis[options.yAxis];

                let width = options.width,
                    height = options.height;

                if (xAxis && width && defined(point.x)) {
                    const startPixel = xAxis.toPixels(point.x, true),
                        endPixel = xAxis.toPixels(point.x + width, true);

                    width = Math.abs(endPixel - startPixel);
                }

                if (yAxis && height && defined(point.y)) {
                    const startPixel = yAxis.toPixels(point.y, true),
                        endPixel = yAxis.toPixels(point.y + height, true);

                    height = Math.abs(endPixel - startPixel);
                }

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
