/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
var isFn = function (x) {
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
var draw = function draw(params) {
    var _a;
    var component = this, graphic = component.graphic, animatableAttribs = params.animatableAttribs, onComplete = params.onComplete, css = params.css, renderer = params.renderer, animation = (_a = component.series) === null || _a === void 0 ? void 0 : _a.options.animation;
    if (component.shouldDraw()) {
        if (!graphic) {
            component.graphic = graphic =
                renderer[params.shapeType](params.shapeArgs)
                    .add(params.group);
        }
        graphic
            .css(css)
            .attr(params.attribs)
            .animate(animatableAttribs, params.isNew ? false : animation, onComplete);
    }
    else if (graphic) {
        var destroy = function () {
            component.graphic = graphic = graphic.destroy();
            if (isFn(onComplete)) {
                onComplete();
            }
        };
        // animate only runs complete callback if something was animated.
        if (Object.keys(animatableAttribs).length) {
            graphic.animate(animatableAttribs, void 0, function () {
                destroy();
            });
        }
        else {
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
var drawPoint = function drawPoint(params) {
    var point = this, attribs = params.attribs = params.attribs || {};
    // Assigning class in dot notation does go well in IE8
    // eslint-disable-next-line dot-notation
    attribs['class'] = point.getClassName();
    // Call draw to render component
    draw.call(point, params);
};
var drawPointModule = {
    draw: draw,
    drawPoint: drawPoint,
    isFn: isFn
};
export default drawPointModule;
