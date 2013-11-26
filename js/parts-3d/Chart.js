/**
 *	3D Chart
 */
H.wrap(HC.prototype, 'init', function (proceed, userOptions, callback) {
	userOptions = H.merge({
		chart: {
			animation: false,
			options3d: {
				angle1: 0,
				angle2: 0,
				depth: 0,
				frame: {
					bottom: false,
					side: false,
					back: false
				}
			}
		},
		yAxis: {
			opposite: false
		}
	},
	//user's options
	userOptions, {
		chart: {
			plotBackgroundImage: null,
		}
	} // 
	);

	if (userOptions.yAxis.opposite) {
		userOptions.chart.options3d.angle1 =  -userOptions.chart.options3d.angle1;
	}

	// Proceed as normal
	proceed.apply(this, [userOptions, callback]);

	console.log(this);

	// Destroy the plotBackground
	if (this.plotBackground) { 
		this.plotBackground.destroy();
	}

	// Make the clipbox larger
	var mainSVG = this.container.childNodes[0];
	this.clipRect.destroy();
	this.clipRect = this.renderer.rect({x: 0, y: 0, height: this.chartHeight, width: this.chartWidth}).add(mainSVG);

	this.redraw();
});

HC.prototype.getZPosition = function (serie) {
	// Without grouping all stacks are on the front line.
	if (this.options.plotOptions.column.grouping !== false) { 
		return 0;
	}

	var stacking = this.options.plotOptions.column.stacking,
		i = (stacking ? (serie.options.stack || 0) : serie._i),	// The number of the stack
		result = 0,		
		stacks = [],
		cnt,
		S;

	// Count the number of stacks in front of this one.
	for (cnt = 0; cnt < i; cnt++) {
		S = this.series[cnt];
		if (S.visible && !stacks[S.options.stack || 0]) {
			result++;
			stacks[S.options.stack || 0] = true;
		}
	}

	return result;
};

HC.prototype.getNumberOfStacks = function () {
	var options = this.options.plotOptions.column;

	// Without grouping all stacks are on the front line.
	if (options.grouping !== false) {
		return 1;
	}

	// If there is no stacking all series are their own stack.
	if (options.stacking === null || options.stacking === undefined) {
		return this.series.length;
	}

	// If there is stacking, count the stacks.
	var stacks = [];
	H.each(this.series, function (serie) {
		stacks[serie.options.stack || 0] = true;
	});
	return stacks.length;
};

HC.prototype.getTotalDepth = function () {
	return this.getNumberOfStacks() * (this.options.chart.options3d.depth || 0) * 1.5;
};

H.wrap(HC.prototype, 'redraw', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var chart = this,
		renderer = chart.renderer,
		frameGroup = chart.frameGroup,
		options3d = chart.options.chart.options3d,
		frame = options3d.frame;

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: chart.getTotalDepth()
	};

	var nstacks = chart.getNumberOfStacks();
	var fbottom = frame.bottom,
		fside = frame.side,
		fback = frame.back;

	if (!frameGroup) {
		this.frameGroup = frameGroup = renderer.g().add();
	}

	var left = chart.plotLeft,
		top = chart.plotTop,
		width = chart.plotWidth,
		height = chart.plotHeight,
		depth = chart.getTotalDepth(),
		opposite = chart.yAxis.opposite;

		sideSize = (fside ? fside.size || 0 : 0);
		bottomSize = (fbottom ? fbottom.size || 0 : 0);
		backSize = (fback ? fback.size || 0 : 0);

	if (fbottom) {
		if (!frameGroup.bottom) {
			frameGroup.bottom = renderer.cube(left - sideSize, top + height, 0, width + sideSize, bottomSize, depth + backSize, options3d, opposite, true)
				.attr({ fill: fbottom.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.bottom.animate({
				x: left - sideSize,
				y: top + height,
				z: 0,
				w: width + sideSize,
				h: bottomSize,
				d: depth + backSize,
				options: options3d,
				opposite: opposite
			});
		}
	}

	if (fside) {
		if (!frameGroup.side) {
			frameGroup.side = renderer.cube(left - sideSize, top, 0, sideSize, height, depth + backSize, options3d, opposite, true)
				.attr({ fill: fside.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.side.animate({
				x: left - sideSize,
				y: top,
				z: 0,
				w: sideSize,
				h: height,
				d: depth + backSize,
				options: options3d,
				opposite: opposite
			});
		}
	}

	if (fback || chart.options.chart.plotBackgroundColor) {
		if (!frameGroup.back) {
			frameGroup.back = renderer.cube(left, top, depth, width, height, backSize, options3d, opposite, true)
				.attr({ fill: fback.fillColor || chart.options.chart.plotBackgroundColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.back.animate({
				x: left,
				y: top,
				z: depth,
				w: width,
				h: height,
				d: backSize,
				options: options3d,
				opposite: opposite
			});
		}
	}
});