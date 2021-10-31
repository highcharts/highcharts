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

import type CSSObject from '../Core/Renderer/CSSObject';
import type Point from '../Core/Series/Point';
import type ShadowOptionsObject from '../Core/Renderer/ShadowOptionsObject';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';

/* *
 *
 *  Composition
 *
 * */

namespace DrawPointComposition {
    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Point {
        public draw(params: DrawParams): void;
        public shouldDraw(): boolean;
    }

    export interface DrawParams {
        animatableAttribs: SVGAttributes;
        attribs: SVGAttributes;
        css?: CSSObject;
        group: SVGElement;
        onComplete?: Function;
        isNew?: boolean;
        renderer: SVGRenderer;
        shadow?: boolean | Partial<ShadowOptionsObject>;
        shapeArgs?: SVGAttributes;
        shapeType: string;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose<T extends typeof Composition>(
        PointClass: T
    ): T & typeof Composition {
        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);

            const pointProto = PointClass.prototype as Composition;

            pointProto.draw = draw;

            if (!pointProto.shouldDraw) {
                pointProto.shouldDraw = shouldDraw;
            }
        }

        return PointClass as T & typeof Composition;
    }

    /**
     * Handles the drawing of a component.
     * Can be used for any type of component that reserves the graphic property,
     * and provides a shouldDraw on its context.
     *
     * @private
     *
     * @todo add type checking.
     * @todo export this function to enable usage
     */
    function draw(this: Composition, params: DrawParams): void {
        const { animatableAttribs, onComplete, css, renderer } = params;

        const animation =
            this.series && this.series.chart.hasRendered
                ? // Chart-level animation on updates
                  void 0
                : // Series-level animation on new points
                  this.series && this.series.options.animation;

        let graphic = this.graphic;

        params.attribs = params.attribs || {};

        // Assigning class in dot notation does go well in IE8
        // eslint-disable-next-line dot-notation
        params.attribs['class'] = this.getClassName();

        if (this.shouldDraw()) {
            if (!graphic) {
                this.graphic = graphic = (renderer as any)
                    [params.shapeType](params.shapeArgs)
                    .add(params.group);
            }
            (graphic as any)
                .css(css)
                .attr(params.attribs)
                .animate(
                    animatableAttribs,
                    params.isNew ? false : animation,
                    onComplete
                );
        } else if (graphic) {
            const destroy = (): void => {
                this.graphic = graphic = graphic && graphic.destroy();
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            };

            // animate only runs complete callback if something was animated.
            if (Object.keys(animatableAttribs).length) {
                graphic.animate(animatableAttribs, void 0, function (): void {
                    destroy();
                });
            } else {
                destroy();
            }
        }
    }

    /**
     * @private
     */
    function shouldDraw(this: Composition): boolean {
        return !this.isNull;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DrawPointComposition;
