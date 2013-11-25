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

	var nstacks = chart.getNumberOfStacks();
	var fbottom = frame.bottom,
		fside = frame.side,
		fback = frame.back;

	if (this.horiz && fbottom !== 0) {
		if (axis.axisLine) { 
				axis.axisLine.destroy();
			}
		axis.axisLine  = renderer.cube(x1, y1, z1, w, fbottom, d, options3d)
			.attr({
				fill: options.lineColor,
				zIndex: nstacks + 2
			})
			.add(axis.axisGroup);
	} else if (!this.horiz) {
		var axisLineGroup = renderer.createElement3D().add(axis.axisGroup);
		// back
		if (fback) {
			var back = renderer.cube(x1 - fside, y1, z1 + d, this.width + fside, h + fbottom, fback, options3d)
				.attr({
					fill: options.lineColor,
					zIndex: nstacks + 2
				})
				.add(axis.axisLineGroup);
			axisLineGroup.children.push(back);
		}
		// side
		if (fside) {
			if (axis.axisLine) { 
				axis.axisLine.destroy();
			}
			var side = renderer.cube(x1 - fside, y1, z1, fside, h + fbottom, d, options3d)
				.attr({
					fill: options.lineColor,
					zIndex: nstacks + 2
				})
				.add(axis.axisLineGroup);
			axisLineGroup.children.push(side);
		} else {
			axisLineGroup.children.push(axis.axisLine);
		}
		axis.axisLine = axisLineGroup;
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

});

H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d;

	var d = options3d.depth * 1.5 * chart.getNumberOfStacks();

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
