/**
 *	Extension for the Axis
 */
H.wrap(HA.prototype, 'render', function (proceed) {	
	proceed.apply(this, [].slice.call(arguments, 1));

	var axis = this,
		chart = axis.chart,
		renderer = chart.renderer,
		options = axis.options,
		options3d = chart.options.D3;

	options3d.origin = {
		//x: chart.plotLeft + (chart.yAxis[0].opposite ? 0 : chart.plotWidth),
		//y: chart.plotTop,
		x: chart.plotLeft,
		y: chart.plotTop + chart.plotHeight,
		z: chart.getTotalDepth()
	}

	// AxisLines --> replace with flat cubes
	if (options.lineWidth > 0) {
		axis.axisLine.destroy();

		var x1 = this.horiz ? this.left : this.left,
			y1 = this.horiz ? this.top + this.height : this.top,
			z1 = 0,
			h = this.horiz ? options.lineWidth * 5 : this.height,
			w = this.horiz ? this.len : options.lineWidth * 5,
			d = chart.getTotalDepth();

		var nstacks = chart.getNumberOfStacks();

		if (this.horiz) {
			axis.axisLine  = renderer.cube(x1, y1, z1, w, h, d, options3d)
				.attr({
					fill: options.lineColor,
					zIndex: nstacks + 2
				})
				.add(axis.axisGroup);
		} else {
			var axisLineGroup = renderer.createElement3D().add(axis.axisGroup);

			// back			
			var back = renderer.cube(x1 - w, y1, z1 + d, this.width + w, h + w, w, options3d)
				.attr({
					fill: options.lineColor,
					zIndex: nstacks + 2
				})
				.add(axis.axisLineGroup);
			axisLineGroup.children.push(back);
			
			// side
			var side = renderer.cube(x1 - w, y1, z1, w, h + w, d, options3d)
				.attr({
					fill: options.lineColor,
					zIndex: nstacks + 2
				})
				.add(axis.axisLineGroup);
			axisLineGroup.children.push(side);

			axis.axisLine = axisLineGroup;
		}
	}
});

H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart;
		options3d = chart.options.D3,
		d = options3d.depth * 1.5 * chart.getNumberOfStacks();

	options3d.origin = {
		//x: chart.plotLeft + (chart.yAxis[0].opposite ? 0 : chart.plotWidth),
		//y: chart.plotTop,
		x: chart.plotLeft,
		y: chart.plotTop + chart.plotHeight,
		z: chart.getTotalDepth()
	}
	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)},
	];

	pArr = perspective(pArr, options3d);

	path = [
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[1].x, pArr[1].y,
		'L', pArr[2].x, pArr[2].y,
		'L', pArr[3].x, pArr[3].y
	]
	return path;
});
