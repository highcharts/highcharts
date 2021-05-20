/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DrawPoint extends Point {
            shouldDraw(): boolean;
        }
        interface DrawPointParams {
            animatableAttribs: SVGAttributes;
            attribs: SVGAttributes;
            css?: CSSObject;
            group: SVGElement;
            onComplete?: Function;
            isNew?: boolean;
            renderer: SVGRenderer;
            shadow?: (boolean|Partial<ShadowOptionsObject>);
            shapeArgs?: SVGAttributes;
            shapeType: string;
        }
    }
}

const isFn = function (x: unknown): x is Function {
    return typeof x === 'function';
};

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Handles the drawing of a component.
 * Can be used for any type of component that reserves the graphic property, and
 * provides a shouldDraw on its context.
 *
 * @private
 * @function draw
 * @param {DrawPointParams} params
 *        Parameters.
 *
 * @todo add type checking.
 * @todo export this function to enable usage
 */
const draw = function draw(
    this: Highcharts.DrawPoint,
    params: Highcharts.DrawPointParams
): void {
    const {
        animatableAttribs,
        onComplete,
        css,
        renderer
    } = params;

    const animation = (this.series && this.series.chart.hasRendered) ?
        // Chart-level animation on updates
        void 0 :
        // Series-level animation on new points
        (
            this.series &&
            this.series.options.animation
        );

    let graphic = this.graphic;

    if (this.shouldDraw()) {
        if (!graphic) {
            this.graphic = graphic =
                (renderer as any)[params.shapeType](params.shapeArgs)
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
            this.graphic = graphic = (graphic && graphic.destroy());
            if (isFn(onComplete)) {
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
};

/**
 * An extended version of draw customized for points.
 * It calls additional methods that is expected when rendering a point.
 * @private
 * @param {Highcharts.Dictionary<any>} params Parameters
 */
const drawPoint = function drawPoint(
    this: Highcharts.DrawPoint,
    params: Highcharts.DrawPointParams
): void {
    const point = this,
        attribs = params.attribs = params.attribs || {};

    // Assigning class in dot notation does go well in IE8
    // eslint-disable-next-line dot-notation
    attribs['class'] = point.getClassName();

    // Call draw to render component
    draw.call(point, params);
};

const drawPointModule = {
    draw,
    drawPoint,
    isFn
};

export default drawPointModule;
