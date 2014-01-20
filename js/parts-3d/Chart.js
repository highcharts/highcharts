/**
 *	3D Chart
 */
H.wrap(HC.prototype, 'setChartSize', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Change the clipBox size to encompass the full chart
	this.clipBox.x = -(this.margin[3] || 0);
	this.clipBox.y = -(this.margin[0] || 0);
	this.clipBox.width = this.chartWidth + (this.margin[3] || 0) + (this.margin[1] || 0);
	this.clipBox.height = this.chartHeight + (this.margin[0] || 0) + (this.margin[2] || 0);
});

H.wrap(HC.prototype, 'init', function (proceed, userOptions, callback) {
	userOptions = H.merge({
		chart: {
			//animation: false,
			options3d: {
				angle1: 0,
				angle2: 0,
				deptheight: 0,
				frame: {
					bottom: false,
					side: false,
					back: false
				}
			}
		},
		plotOptions: {
			column: {
				
			}
		},
		yAxis: {
			opposite: false
		}
	},
	//user's options
	userOptions, {
		chart: {
			plotBackgroundImage: null
		}
	} 
	);

	// Proceed as normal
	proceed.apply(this, [userOptions, callback]);

	// Destroy the plotBackground
	if (this.plotBackground) { 
		this.plotBackground.destroy();
	}
	//this.redraw();
});

HC.prototype.getZPosition = function (serie) {
	if (serie.type !== 'column') {
		return 0;
	}
	
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
		if (S.visible && !stacks[(stacking ? S.options.stack : S._i) || 0]) {
			result++;
			stacks[(stacking ? S.options.stack : S._i) || 0] = true;
		}
	}

	return result;
};
HC.prototype.getZPosition2 = HC.prototype.getZPosition;

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
HC.prototype.drawFrame = function () {
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
		//this.frameGroup = frameGroup = renderer.g().add(this.seriesGroup);
		this.frameGroup = frameGroup = renderer.g().add();
	}

	var opposite = chart.yAxis[0].opposite,
		left = chart.plotLeft,
		top = chart.plotTop,
		width = chart.plotWidth,
		height = chart.plotHeight,
		depth = chart.getTotalDepth(),

		sideSize = (fside ? fside.size || 0 : 0);
		bottomSize = (fbottom ? fbottom.size || 0 : 0);
		backSize = (fback ? fback.size || 0 : 0);


	var xval;

	if (fbottom) {
		xval = (opposite ? left : left - sideSize);

		if (!frameGroup.bottom) {
			frameGroup.bottom = renderer.cube({x: xval, y: top + height, z: 0, width: width + sideSize, height: bottomSize, d: depth + backSize, options: options3d, opposite: opposite, i: 0 })
				.attr({ fill: fbottom.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.bottom.animate({
				x: xval,
				y: top + height,
				z: 0,
				width: width + sideSize,
				height: bottomSize,
				d: depth + backSize,
				options: options3d,
				opposite: opposite, 
				i: 50
			});
		}
	}

	if (fside) {
		xval = (opposite ? left + width : left - sideSize);

		if (!frameGroup.side) {
			frameGroup.side = renderer.cube({x: xval, y: top, z: 0, width: sideSize, height: height, d: depth + backSize, options: options3d, opposite: opposite, i: 0 })
				.attr({ fill: fside.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.side.animate({
				x: xval,
				y: top,
				z: 0,
				width: sideSize,
				height: height,
				d: depth + backSize,
				options: options3d,
				opposite: opposite, 
				i: 0
			});
		}
	}

	if (fback || chart.options.chart.plotBackgroundColor) {
		if (!frameGroup.back) {
			frameGroup.back = renderer.cube({x: left, y: top, z: depth, width: width, height: height, d: backSize, options: options3d, opposite: opposite, i: 0 })
				.attr({ fill: fback.fillColor || chart.options.chart.plotBackgroundColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.back.animate({
				x: left,
				y: top,
				z: depth,
				width: width,
				height: height,
				d: backSize,
				options: options3d,
				opposite: opposite, 
				i: 0
			});
		}
	}
};
H.wrap(HC.prototype, 'firstRender', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	this.drawFrame();
	
});

H.wrap(HC.prototype, 'redraw', function (proceed) {
	// Set to force a redraw of all elements
	this.isDirtyBox = true;
	proceed.apply(this, [].slice.call(arguments, 1));
	this.drawFrame();
	
});