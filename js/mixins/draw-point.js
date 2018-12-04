var isFn = function (x) {
    return typeof x === 'function';
};

/**
 * Handles the drawing of a point.
 *
 * @private
 * @function draw
 *
 * @param {object} params
 *        Parameters.
 *
 * @todo
 * - add type checking.
 */
var draw = function draw(params) {
    var point = this,
        graphic = point.graphic,
        animatableAttribs = params.animatableAttribs,
        onComplete = params.onComplete,
        css = params.css,
        renderer = params.renderer;

    if (point.shouldDraw()) {
        if (!graphic) {
            point.graphic = graphic =
                renderer[params.shapeType](params.shapeArgs).add(params.group);
        }
        graphic
            .css(css)
            .attr(params.attribs)
            .animate(
                animatableAttribs,
                params.isNew ? false : undefined,
                onComplete
            );
    } else if (graphic) {
        graphic.animate(animatableAttribs, undefined, function () {
            point.graphic = graphic = graphic.destroy();
            if (isFn(onComplete)) {
                onComplete();
            }
        });
    }
    if (graphic) {
        graphic.addClass(point.getClassName(), true);
    }
};

export default draw;
