/*** 
	EXTENSION TO THE AXIS
***/
Highcharts.wrap(Highcharts.Axis.prototype, 'init', function (proceed) {
	var args = arguments;
	if (args[1].is3d) {
		args[2].tickWidth = args[2].tickWidth || 0;
		args[2].gridLineWidth = args[2].gridLineWidth || 1;
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});	
Highcharts.wrap(Highcharts.Axis.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}

	var chart = this.chart,
		renderer = chart.renderer,
		options3d = chart.options.chart.options3d,
		alpha = options3d.alpha,
		beta = options3d.beta,
		frame = options3d.frame,
		fbottom = frame.bottom,
		fback = frame.back,
		fside = frame.side,
		depth = options3d.depth,
		height = this.height,
		width = this.width,
		left = this.left,
		top = this.top;

	var origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: depth
	};
	if (this.horiz) {
		/// BOTTOM
		if (this.axisLine) {
			this.axisLine.hide();
		}
		var bottomShape = {
			x: left,
			y: top + height,
			z: 0,
			width: width,
			height: fbottom.size,
			depth: depth,
			alpha: alpha,
			beta: beta,
			origin: origin
		};
		if (!this.bottomFrame) {
			this.bottomFrame = renderer.cuboid(bottomShape).attr({fill: fbottom.color, zIndex: -1}).add();
		} else {
			this.bottomFrame.animate(bottomShape);
		}
	} else {
		// BACK
		var backShape = {
			x: left,
			y: top,
			z: depth + 1,
			width: width,
			height: height + fbottom.size,
			depth: fback.size,
			alpha: alpha,
			beta: beta,
			origin: origin
		};
		if (!this.backFrame) {
			this.backFrame = renderer.cuboid(backShape).attr({fill: fback.color, zIndex: -3}).add();
		} else {
			this.backFrame.animate(backShape);
		}
		// SIDE
		if (this.axisLine) {
			this.axisLine.hide();
		}
		var sideShape = {
			x: left - fside.size,
			y: top,
			z: 0,
			width: fside.size,
			height: height + fbottom.size,
			depth: depth + fback.size,
			alpha: alpha,
			beta: beta,
			origin: origin
		};
		if (!this.sideFrame) {
			this.sideFrame = renderer.cuboid(sideShape).attr({fill: fside.color, zIndex: -2}).add();
		} else {
			this.sideFrame.animate(sideShape);
		}
	}
});

Highcharts.wrap(Highcharts.Axis.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return path;
	}

	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d;

	var d = options3d.depth;

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: d
	};

	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)}
	];

	var alpha = chart.options.inverted ? options3d.beta : options3d.alpha,
		beta = chart.options.inverted ? options3d.alpha : options3d.beta;

	pArr = perspective(pArr, alpha, beta, options3d.origin);
	path = this.chart.renderer.toLinePath(pArr, false);

	return path;
});

/*** 
	EXTENSION TO THE TICKS
***/

Highcharts.wrap(Highcharts.Tick.prototype, 'getMarkPath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));	

	// Do not do this if the chart is not 3D
	if (!this.axis.chart.is3d()) {
		return path;
	}

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	var origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: options3d.depth
	};

	var pArr = [
		{x: path[1], y: path[2], z: 0},
		{x: path[4], y: path[5], z: 0}
	];
	
	var alpha = chart.inverted ? options3d.beta : options3d.alpha,
		beta = chart.inverted ? options3d.alpha : options3d.beta;

	pArr = perspective(pArr, alpha, beta, origin);
	path = [
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[1].x, pArr[1].y
		];
	return path;
});

Highcharts.wrap(Highcharts.Tick.prototype, 'getLabelPosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	
	// Do not do this if the chart is not 3D
	if (!this.axis.chart.is3d()) {
		return pos;
	}	

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	var origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: options3d.depth
	};
	
	var alpha = chart.inverted ? options3d.beta : options3d.alpha,
		beta = chart.inverted ? options3d.alpha : options3d.beta;

	pos = perspective([{x: pos.x, y: pos.y, z: 0}], alpha, beta, origin)[0];
	return pos;
});

Highcharts.wrap(Highcharts.Axis.prototype, 'drawCrosshair', function (proceed) {
	var args = arguments;
	if (this.chart.is3d()) {
		if (args[2]) {
			args[2] = {
				plotX: args[2].plotXold || args[2].plotX,
				plotY: args[2].plotYold || args[2].plotY
			};
		}
	}
	proceed.apply(this, [].slice.call(args, 1));
});