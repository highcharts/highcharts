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
		group = params.group,
		renderer = params.renderer,
		shape = params.shapeArgs,
		type = params.shapeType,
		css = params.css,
		attr = params.attr;

	if (point.shouldDraw()) {
		if (!graphic) {
			point.graphic = graphic = renderer[type](shape).add(group);
		}
		graphic.css(css).attr(attr).animate(animate);
	} else if (graphic) {
		graphic.animate(animate, null, function () {
			point.graphic = graphic = graphic.destroy();
		});
	}
};

export default draw;
