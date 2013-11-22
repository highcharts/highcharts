/**
 *	Extension for the Axis
 */
H.wrap(HA.prototype, 'render', function (proceed) {	
	proceed.apply(this, [].slice.call(arguments, 1));

	var axis = this,
		chart = axis.chart,
		renderer = chart.renderer,
		options = axis.options,
		options3d = chart.options.chart.options3d;

	options3d.origin = {
		x: chart.plotLeft,
		y: chart.plotTop + chart.plotHeight,
		z: chart.getTotalDepth()
	};

	var frame = options3d.frame || { x: this.lineWidth, y : [this.lineWidth, this.lineWidth] };

	// AxisLines --> replace with flat cubes
	if (axis.axisLine) axis.axisLine.destroy();

	var x1 = this.left,
		y1 = (this.horiz ? this.top + this.height : this.top),
		z1 = 0,
		h = (this.horiz ? frame.x : this.height),
		w = (this.horiz ? [this.len] : frame.y),
		d = chart.getTotalDepth();

	var nstacks = chart.getNumberOfStacks();

	if (this.horiz) {
		axis.axisLine  = renderer.cube(x1, y1, z1, w[0], h, d, options3d)
			.attr({
				fill: options.lineColor,
				zIndex: nstacks + 2
			})
			.add(axis.axisGroup);
	} else {
		var axisLineGroup = renderer.createElement3D().add(axis.axisGroup);
		
		// back			
		var back = renderer.cube(x1 - w[0], y1, z1 + d, this.width + w[0], h + options3d.frame.x, w[1], options3d)
			.attr({
				fill: options.lineColor,
				zIndex: nstacks + 2
			})
			.add(axis.axisLineGroup);
		axisLineGroup.children.push(back);
		
		// side
		var side = renderer.cube(x1 - w[0], y1, z1, w[0], h + frame.x, d, options3d)
			.attr({
				fill: options.lineColor,
				zIndex: nstacks + 2
			})
			.add(axis.axisLineGroup);
		axisLineGroup.children.push(side);

		axis.axisLine = axisLineGroup;
	}
	

	H.each(axis.tickPositions, function (tickPos) {
		var tick = axis.ticks[tickPos],
		label = tick.label,
		mark = tick.mark;

		if (label) {
			var xy = label.xy,
			labelPos = perspective([{x: xy.x, y: xy.y, z: z1 }], options3d)[0];

			label['animate']({
				x: labelPos.x,
				y: labelPos.y,
				opacity: xy.opacity					
			});
		}

		if (mark) {
			var path = (mark.toD ? mark.toD : mark.d.split(' ')),
			pArr = [ 
			{x: path[1], y: path[2], z: z1 },
			{x: path[4], y: path[5], z: z1 }
			];
			path = chart.renderer.toLinePath(perspective(pArr, options3d), false);
			mark.animate({d: path, opacity: 1});
		}
	});

});

H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d,
		d = options3d.depth * 1.5 * chart.getNumberOfStacks();

	options3d.origin = {
		x: chart.plotLeft,
		y: chart.plotTop + chart.plotHeight,
		z: chart.getTotalDepth()
	};

	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)}
	];

	pArr = perspective(pArr, options3d);
	path = this.chart.renderer.toLinePath(pArr, false);

	return path;
});
