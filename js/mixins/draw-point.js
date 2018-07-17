var isFn = function (x) {
    return typeof x === 'function';
};

/**
 * draw - Handles the drawing of a point.
 * TODO: add type checking.
 *
 * @param  {object} params Parameters.
 * @return {undefined} Returns undefined.
 */
var draw = function draw(params) {
    var point = this,
        graphic = point.graphic,
        animate = params.animate,
        attr = params.attr,
        onComplete = params.onComplete,
        css = params.css,
        group = params.group,
        renderer = params.renderer,
        shape = params.shapeArgs,
        type = params.shapeType;

    if (point.shouldDraw()) {
        if (!graphic) {
            point.graphic = graphic = renderer[type](shape).add(group);
        }
        graphic.css(css).attr(attr).animate(animate, undefined, onComplete);
    } else if (graphic) {
        graphic.animate(animate, undefined, function () {
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
