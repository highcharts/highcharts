/*** 
	EXTENSION TO THE AXIS
***/
H.wrap(HA.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.axisLine) {
		this.axisLine.hide();
	}

	if (this.horiz) {

		if (this.bottomFrame) {
			this.bottomFrame.destroy();
			this.sideFrame.destroy();
			this.backFrame.destroy();
		}

		var chart = this.chart,
			options3d = chart.options.chart.options3d,
			frame = options3d.frame,
			fbottom = frame.bottom,
			fback = frame.back,
			fside = frame.side;

		var d = options3d.depth * chart.series.length;

		var origin = {
			x: chart.plotLeft + (chart.plotWidth / 2),
			y: chart.plotTop + (chart.plotHeight / 2),
			z: d
		};

		
		var backShape = {
			x: this.left,
			y: this.top,
			z: d + 1,
			width: this.width,
			height: this.height + fbottom.size,
			depth: fback.size,
			alpha: options3d.alpha,
			beta: options3d.beta,
			origin: origin
		};
		this.backFrame = this.chart.renderer.cuboid(backShape).attr({fill: fback.color}).add();

		var bottomShape = {
			x: this.left,
			y: this.top + this.height,
			z: 0,
			width: this.width,
			height: fbottom.size,
			depth: d,
			alpha: options3d.alpha,
			beta: options3d.beta,
			origin: origin
		};
		this.bottomFrame = this.chart.renderer.cuboid(bottomShape).attr({fill: fbottom.color}).add();

		var sideShape = {
			x: this.left,
			y: this.top,
			z: 0,
			width: fside.size,
			height: this.height,
			depth: d,
			alpha: options3d.alpha,
			beta: options3d.beta,
			origin: origin
		};
		this.sideFrame = this.chart.renderer.cuboid(sideShape).attr({fill: fside.color}).add();
	}
});


H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d;

	var d = options3d.depth * chart.series.length;

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

H.wrap(H.Tick.prototype, 'getMarkPath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: options3d.depth * chart.series.length
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

H.wrap(H.Tick.prototype, 'getLabelPosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: options3d.depth * chart.series.length
	};
	
	var alpha = chart.inverted ? options3d.beta : options3d.alpha,
		beta = chart.inverted ? options3d.alpha : options3d.beta;

	pos = perspective([{x: pos.x, y: pos.y, z: 0}], alpha, beta, origin)[0];
	return pos;
});
