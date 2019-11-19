/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

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
            renderer: Renderer;
            shadow?: (boolean|ShadowOptionsObject);
            shapeArgs?: SVGAttributes;
            shapeType: string;
        }
    }
}

var isFn = function (x: unknown): x is Function {
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
var draw = function draw(
    this: Highcharts.DrawPoint,
    params: Highcharts.DrawPointParams
): void {
    var component = this,
        graphic = component.graphic,
        animatableAttribs = params.animatableAttribs,
        onComplete = params.onComplete,
        css = params.css,
        renderer = params.renderer;

    if (component.shouldDraw()) {
        if (!graphic) {
            component.graphic = graphic =
                (renderer as any)[params.shapeType](params.shapeArgs)
                    .add(params.group);
        }
        (graphic as any)
            .css(css)
            .attr(params.attribs)
            .animate(
                animatableAttribs,
                params.isNew ? false : void 0,
                onComplete
            );
    } else if (graphic) {
        var destroy = function (): void {
            component.graphic = graphic = (graphic as any).destroy();
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
var drawPoint = function drawPoint(
    this: Highcharts.DrawPoint,
    params: Highcharts.DrawPointParams
): void {
    var point = this,
        attribs = params.attribs = params.attribs || {};

    // Assigning class in dot notation does go well in IE8
    // eslint-disable-next-line dot-notation
    attribs['class'] = point.getClassName();

    // Call draw to render component
    draw.call(point, params);
};

export default drawPoint;
