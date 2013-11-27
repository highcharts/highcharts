/**
 *	Extension for the Axis
 */
H.wrap(HA.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var axis = this,
		chart = axis.chart,
		renderer = chart.renderer,
		options = axis.options,
		options3d = chart.options.chart.options3d,
		frame = options3d.frame;

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: chart.getTotalDepth()
	};

	var x1 = this.left,
		y1 = (this.horiz ? this.top + this.height : this.top),
		z1 = 0,
		h = this.height,
		w = this.len,
		d = chart.getTotalDepth();

	if (this.axisLine) {
		var axisLine = this.axisLine;
		var hide = (this.horiz ? options3d.frame.bottom : options3d.frame.side);
		if (hide) {
			axisLine.hide();
		} else {
			var path = axisLine.d.split(' ');
			var pArr = [
			{x: path[1], y: path[2], z: 0},
			{x: path[4], y: path[5], z: 0}
			];
			pArr = perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin);
			path = [
				'M', pArr[0].x, pArr[0].y,
				'L', pArr[1].x, pArr[1].y
				];
			axisLine.attr({d: path});
		}		 
	}

	H.each(axis.tickPositions, function (tickPos) {
		var tick = axis.ticks[tickPos],
		label = tick.label,
		mark = tick.mark;

		if (label) {
			var xy = label.xy,
			labelPos = perspective([{x: xy.x, y: xy.y, z: z1 }], options3d.angle1, options3d.angle2, options3d.origin)[0];

			label.animate({
				x: labelPos.x,
				y: labelPos.y,
				opacity: xy.opacity					
			});
		}

		if (mark) {
			var path = mark.toD || mark.d.split(' '),
			pArr = [ 
			{x: path[1], y: path[2], z: z1 },
			{x: path[4], y: path[5], z: z1 }
			];
			path = chart.renderer.toLinePath(perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin), false);
			mark.animate({d: path, opacity: 1});
		}
	});

	// If there is one, update the first one, the rest will follow automatically.
	if (this.alternateBands[0]) {
		this.alternateBands[0].svgElem.attr({zIndex: 1});
	}
});

H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d;

	var d = chart.getTotalDepth();

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: chart.getTotalDepth()
	};

	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)}
	];

	pArr = perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin);
	path = this.chart.renderer.toLinePath(pArr, false);
	return path;
});

HA.prototype.getPlotBandPath = function (from, to) {
	var toPath = this.getPlotLinePath(to),
		path = this.getPlotLinePath(from);
	if (path && toPath) {
		return [
			'M', path[4], path[5],
			'L', path[7], path[8],
			'L', toPath[7], toPath[8],
			'L', toPath[4], toPath[5],
			'Z'];
	} else { // outside the axis area
		return null;
	}
};