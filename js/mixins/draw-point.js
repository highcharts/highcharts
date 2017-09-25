var draw = function draw(options) {
	var point = this,
		graphic = point.graphic,
		animation = options.animation,
		animationOptions = options.animationOptions,
		group = options.group,
		renderer = options.renderer,
		shape = options.shapeArgs,
		type = options.shapeType,
		css = options.css,
		attr = options.attr;
		
	if (point.shouldDraw()) {
		if (!graphic) {
			point.graphic = graphic = renderer[type](shape).add(group);
		}
		graphic.css(css).attr(attr).animate(animation, animationOptions);
	} else if (graphic) {
		point.graphic = graphic.destroy();
	}
};

export default draw;
