// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v3.0.7-modified ()
 *
 * (c) 2009-2013 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, HighchartsAdapter, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console */

(function (Highcharts, UNDEFINED) {
	/**
 *	Shorthand notations of often used functions and variables
 */

var SVG_NS = 'http://www.w3.org/2000/svg';

var H = Highcharts,
	HC = H.Chart,
	HC3 = H.Chart3D,
	HR = H.SVGRenderer,
	HA = H.Axis;


var defaultOptions = H.getOptions();

// To get the length of an associative array.
function arraySize(array) {
	var size = 0, 
	key;

	for (key in array) {
		if (array.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
}
/**
 *	Mathematical Functionility
 */

H.toRadians = function (val) { 
	return val * PI / 180; 
};

var PI = Math.PI,

	sin = Math.sin,
	cos = Math.cos,

	min = Math.min,
	max = Math.max, 

	round = Math.round;

function perspective(points, angle2, angle1, origin) {
	angle1 *= (Math.PI / 180);
	angle2 *= (Math.PI / 180);

	var result = [],
		xe, 
		ye, 
		ze;

	angle1 = -angle1;
	
	xe = origin.x;
	ye = origin.y;
	ze = (origin.z === 0 ? 0.0001 : origin.z * 10);

	// some kind of minimum?

	var s1 = sin(angle1),
		c1 = cos(angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, p;

	H.each(points, function (point) {
		x = point.x - xe;
		y = point.y - ye;
		z = point.z;

		p = {
			x: c1 * x - s1 * z,
			y: -s1 * s2 * x - c1 * s2 * z + c2 * y,		
			z: s1 * c2 * x + c1 * c2 * z + s2 * y
		};

		p.x = p.x * ((ze - p.z) / ze) + xe;
		p.y = p.y * ((ze - p.z) / ze) + ye;

		result.push(p);
	});
	return result;
}
/*** 
	EXTENSION TO THE SVG-RENDERER TO ENABLE 3D SHAPES
	***/

////// CUBOIDS //////
HR.prototype.cuboid = function (shapeArgs) {

	var result = this.g(),
	paths = this.cuboidPath(shapeArgs);

	result.front = this.path(paths[0]).attr({zIndex: paths[3]}).add(result);
	result.top = this.path(paths[1]).attr({zIndex: paths[4]}).add(result);
	result.side = this.path(paths[2]).attr({zIndex: paths[5]}).add(result);

	result.attrSetters.fill = function (color) {
		var c0 = color,
		c1 = H.Color(color).brighten(0.1).get(),
		c2 = H.Color(color).brighten(-0.1).get();

		this.front.attr({fill: c0});
		this.top.attr({fill: c1});
		this.side.attr({fill: c2});

		return this;
	};

	result.animate = function (args, duration, complete) {
		if (args.x && args.y) {
			var renderer = this.renderer,
			paths = renderer.cuboidPath(args);
			this.front.animate({d: paths[0]}, duration, complete);
			this.top.animate({d: paths[1]}, duration, complete);
			this.side.animate({d: paths[2]}, duration, complete);
		} else {
			H.SVGElement.prototype.animate.call(this, args, duration, complete);
		}
		return this;
	};

	result.destroy = function () {
		this.front.destroy();
		this.top.destroy();
		this.side.destroy();

		return null;
	};

	return result;
};


HR.prototype.cuboidPath = function (shapeArgs) {
	var inverted = shapeArgs.inverted || false,
		x = shapeArgs.x,
		y = shapeArgs.y,
		z = shapeArgs.z,
		h = shapeArgs.height,
		w = shapeArgs.width,
		d = shapeArgs.depth,
		alpha = shapeArgs.alpha,
		beta = shapeArgs.beta,
		origin = shapeArgs.origin;

	var pArr = [
	{x: x, y: y, z: z},
	{x: x + w, y: y, z: z},
	{x: x + w, y: y + h, z: z},
	{x: x, y: y + h, z: z},
	{x: x, y: y + h, z: z + d},
	{x: x + w, y: y + h, z: z + d},
	{x: x + w, y: y, z: z + d},
	{x: x, y: y, z: z + d}
	];

	pArr = perspective(pArr, alpha, beta, origin);

	// front
	var path1 = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];
	var z1 = (pArr[0].z + pArr[1].z + pArr[2].z + pArr[3].z) / 4;

	// top or bottom
	var path2 = (beta > 0 ? 
		[
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[7].x, pArr[7].y,
		'L', pArr[6].x, pArr[6].y,
		'L', pArr[1].x, pArr[1].y,
		'Z'
		] :
	// bottom
	[
	'M', pArr[3].x, pArr[3].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[4].x, pArr[4].y,
	'Z'
	]);
	var z2 = (beta > 0 ? (pArr[0].z + pArr[7].z + pArr[6].z + pArr[1].z) / 4 : (pArr[3].z + pArr[2].z + pArr[5].z + pArr[4].z) / 4);

	// side
	var path3 = (alpha > 0 ? 
		[
		'M', pArr[1].x, pArr[1].y,
		'L', pArr[2].x, pArr[2].y,
		'L', pArr[5].x, pArr[5].y,
		'L', pArr[6].x, pArr[6].y,
		'Z'
		] : 
		[
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[7].x, pArr[7].y,
		'L', pArr[4].x, pArr[4].y,
		'L', pArr[3].x, pArr[3].y,
		'Z'
		]);
	var z3 = (alpha > 0 ? (pArr[1].z + pArr[2].z + pArr[5].z + pArr[6].z) / 4 : (pArr[0].z + pArr[7].z + pArr[4].z + pArr[3].z) / 4);

	return [path1, path2, path3, z1, z2, z3];
};

////// SECTORS //////
HR.prototype.arc3d = function (shapeArgs) {

	shapeArgs.alpha *= (Math.PI / 180);
	shapeArgs.beta *= (Math.PI / 180);
	var result = this.g(),
		paths = this.arc3dPath(shapeArgs),
		renderer = result.renderer;

	var zIndex = paths.zAll * 100;

	result.shapeArgs = shapeArgs;	// Store for later use

	result.side1 = renderer.path(paths.side2).attr({zIndex: paths.zSide2}).add(result);
	result.side2 = renderer.path(paths.side1).attr({zIndex: paths.zSide1}).add(result);
	result.inn = renderer.path(paths.inn).attr({zIndex: paths.zInn}).add(result);
	result.out = renderer.path(paths.out).attr({zIndex: paths.zOut}).add(result);
	result.top = renderer.path(paths.top).attr({zIndex: paths.zTop}).add(result);

	result.attrSetters.fill = function (color) {
		this.color = color;

		var c0 = color,
		c2 = H.Color(color).brighten(-0.1).get();
		
		this.side1.attr({fill: c2});
		this.side2.attr({fill: c2});
		this.inn.attr({fill: c2});
		this.out.attr({fill: c2});
		this.top.attr({fill: c0});
		return this;
	};
	
	/*
	result.attrSetters['stroke-width'] = function () {
		// Force all to 0		
		return 0;
	};
	*/
	
	result.animate = function (args, duration, complete) {	
		H.SVGElement.prototype.animate.call(this, args, duration, complete);
		
		if (args.x && args.y) {

			// Recreate
			var result = this,
				renderer = this.renderer,
				shapeArgs = H.splat(args)[0];

			shapeArgs.alpha *= (Math.PI / 180);
			shapeArgs.beta *= (Math.PI / 180);

			var paths = renderer.arc3dPath(shapeArgs);

			result.shapeArgs = shapeArgs;	// Store for later use

			result.inn.attr({d: paths.inn, zIndex: paths.zInn});
			result.out.attr({d: paths.out, zIndex: paths.zOut});
			result.side1.attr({d: paths.side1, zIndex: paths.zSide2});
			result.side2.attr({d: paths.side2, zIndex: paths.zSide1});
			result.top.attr({d: paths.top, zIndex: paths.zTop});

			result.attr({fill: result.color});
			result.attr({zIndex: paths.zAll * 100});
		}
		
		return this;
	};

	result.attr({zIndex: zIndex});
	return result;
};


HR.prototype.arc3dPath = function (shapeArgs) {
	var cx = shapeArgs.x,
		cy = shapeArgs.y,
		z = shapeArgs.z,
		start = shapeArgs.start,
		end = shapeArgs.end - 0.00001,
		r = shapeArgs.r,
		ir = shapeArgs.innerR,
		d = shapeArgs.depth,
		alpha = shapeArgs.alpha,
		beta = shapeArgs.beta,
		origin = shapeArgs.origin;

	// Some Variables
	var cs = cos(start),
		ss = sin(start),
		ce = cos(end),
		se = sin(end),
		rx = r * cos(beta),
		ry = r * cos(alpha),
		irx = ir * cos(beta),
		iry = ir * cos(alpha),
		dx = d * sin(beta),
		dy = d * sin(alpha);

	// TOP	
	var top = ['M', cx + (rx * cs), cy + (ry * ss)];
	top = top.concat(curveTo(cx, cy, rx, ry, start, end, 0, 0));
	top = top.concat([
		'L', cx + (irx * ce), cy + (iry * se)
	]);
	top = top.concat(curveTo(cx, cy, irx, iry, end, start, 0, 0));
	top = top.concat(['Z']);

	var midAngle = ((shapeArgs.start + shapeArgs.end) / 2);
	var zIndex = ((sin(beta) * cos(midAngle)) + (sin(-alpha) * sin(-midAngle)));

	// OUTSIDE
	var out = ['M', cx + (rx * cs), cy + (ry * ss)];
	out = out.concat(curveTo(cx, cy, rx, ry, start, end, 0, 0));
	out = out.concat([
		'L', cx + (rx * cos(end)) + dx, cy + (ry * sin(end)) + dy
	]);
	out = out.concat(curveTo(cx, cy, rx, ry, end, start, dx, dy));
	out = out.concat(['Z']);

	// INSIDE
	var inn = ['M', cx + (irx * cs), cy + (iry * ss)];
	inn = inn.concat(curveTo(cx, cy, irx, iry, start, end, 0, 0));
	inn = inn.concat([
		'L', cx + (irx * cos(end)) + dx, cy + (iry * sin(end)) + dy
	]);
	inn = inn.concat(curveTo(cx, cy, irx, iry, end, start, dx, dy));
	inn = inn.concat(['Z']);

	// SIDES
	var side1 = [
		'M', cx + (rx * cs), cy + (ry * ss),
		'L', cx + (rx * cs) + dx, cy + (ry * ss) + dy,
		'L', cx + (irx * cs) + dx, cy + (iry * ss) + dy,
		'L', cx + (irx * cs), cy + (iry * ss),
		'Z'
	];
	var side2 = [
		'M', cx + (rx * ce), cy + (ry * se),
		'L', cx + (rx * ce) + dx, cy + (ry * se) + dy,
		'L', cx + (irx * ce) + dx, cy + (iry * se) + dy,
		'L', cx + (irx * ce), cy + (iry * se),
		'Z'
	];

	var mr = ir + ((r - ir) / 2);

	var zTop = Math.abs(zIndex * 2 * mr),
		zOut = zIndex * r,
		zInn = zIndex * ir,
		zSide1 = ((sin(beta) * cos(start)) + (sin(-alpha) * sin(-start))) * mr,
		zSide2 = ((sin(beta) * cos(end)) + (sin(-alpha) * sin(-end))) * mr;

	return {
		top: top,
		zTop: zTop * 100,
		out: out,
		zOut: zOut * 100,
		inn: inn,
		zInn: zInn * 100,
		side1: side1,
		zSide1: zSide1 * 100,
		side2: side2,
		zSide2: zSide2 * 100,
		zAll: zIndex
	};
};

////// HELPER METHODS //////
// Don't ask don't tell, it's MAGIC!!
var magic = (4 * (Math.sqrt(2) - 1) / 3) / (Math.PI / 2);

function curveTo(cx, cy, rx, ry, start, end, dx, dy) {
	var result = [];
	if ((end > start) && (end - start > PI / 2)) {
		result = result.concat(curveTo(cx, cy, rx, ry, start, start + (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start + (PI / 2), end, dx, dy));
		return result;
	} else if ((end < start) && (start - end > PI / 2)) {			
		result = result.concat(curveTo(cx, cy, rx, ry, start, start - (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start - (PI / 2), end, dx, dy));
		return result;
	} else {
		var arcAngle = end - start;
		return [
			'C', 
			cx + (rx * cos(start)) - ((rx * magic * arcAngle) * sin(start)) + dx,
			cy + (ry * sin(start)) + ((ry * magic * arcAngle) * cos(start)) + dy,
			cx + (rx * cos(end)) + ((rx * magic * arcAngle) * sin(end)) + dx,
			cy + (ry * sin(end)) - ((ry * magic * arcAngle) * cos(end)) + dy,

			cx + (rx * cos(end)) + dx,
			cy + (ry * sin(end)) + dy
		];
	}
}

HR.prototype.toLinePath = function (points, closed) {
	var result = [];

	// Put "L x y" for each point
	H.each(points, function (point) {
		result.push('L', point.x, point.y);
	});

	// Set the first element to M
	result[0] = 'M';

	// If it is a closed line, add Z
	if (closed) {
		result.push('Z');
	}
	
	return result;
};
/*** 
	EXTENSION FOR 3D CHARTS
***/
H.wrap(HC.prototype, 'init', function (proceed) {	
	var args = arguments;
	args[1] = H.merge({ 
		chart: {
			is3d: false,
			options3d: {
				alpha: 0,
				beta: 0,
				depth: 0,

				frame: {
					bottom: { size: 1, color: 'transparent' },
					side: { size: 1, color: 'transparent' },
					back: { size: 1, color: 'transparent' }
				}
			}
		}
	}, args[1]);

	proceed.apply(this, [].slice.call(args, 1));
});

H.wrap(HC.prototype, 'setChartSize', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Change the clipBox size to encompass the full chart
	var inverted = this.inverted,
		clipBox = this.clipBox,
		x = inverted ? 'y' : 'x',
		y = inverted ? 'x' : 'y',
		w = inverted ? 'height' : 'width',
		h = inverted ? 'width' : 'height';

	clipBox[x] = -(this.margin[3] || 0);
	clipBox[y] = -(this.margin[0] || 0);
	clipBox[w] = this.chartWidth + (this.margin[3] || 0) + (this.margin[1] || 0);
	clipBox[h] = this.chartHeight + (this.margin[0] || 0) + (this.margin[2] || 0);
});

H.wrap(HC.prototype, 'redraw', function (proceed) {
	if (this.options.chart.is3d) {
		// Set to force a redraw of all elements
		this.isDirtyBox = true;
	}
	proceed.apply(this, [].slice.call(arguments, 1));	
});


H.wrap(HC.prototype, 'firstRender', function (proceed) {		
	proceed.apply(this, [].slice.call(arguments, 1));
	if (this.options.chart.is3d) {
		// Change the order for drawing the series
		var invSeries = [];
		for (i = 0; i < this.series.length; i++) {
			invSeries.push(this.series[this.series.length - (i + 1)]);
		}
		this.series = invSeries;	
		this.redraw();
	}
});

HC.prototype.getNumberOfStacks = function () {
	var type = this.chart.options.chart.type;
		options = this.options.plotOptions[type];
		
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
};/*** 
	EXTENSION TO THE AXIS
***/
H.wrap(HA.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}

	// Isolate
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

		var d = options3d.depth;

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
	
	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
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

H.wrap(H.Tick.prototype, 'getMarkPath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));	

	// Do not do this if the chart is not 3D
	if (!this.axis.chart.options.chart.is3d) {
		return path;
	}

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	origin = {
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

H.wrap(H.Tick.prototype, 'getLabelPosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	
	// Do not do this if the chart is not 3D
	if (!this.axis.chart.options.chart.is3d) {
		return pos;
	}	

	var chart = this.axis.chart,
		options3d = chart.options.chart.options3d;

	origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: options3d.depth
	};
	
	var alpha = chart.inverted ? options3d.beta : options3d.alpha,
		beta = chart.inverted ? options3d.alpha : options3d.beta;

	pos = perspective([{x: pos.x, y: pos.y, z: 0}], alpha, beta, origin)[0];
	return pos;
});
/*** 
	EXTENSION FOR 3D COLUMNS
***/
H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {  
		return;
	}	

	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		options3d = options.chart.options3d,

		depth = options.plotOptions[type].depth || 0,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var stack = options.plotOptions[type].stacking ? (this.options.stack || 0) : series._i; 
	var z = stack * (depth + (options.plotOptions[type].groupZPadding || 1));

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	z += (options.plotOptions[type].groupZPadding || 1);

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'cuboid';
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta; 
		shapeArgs.z = z;
		shapeArgs.origin = origin;
		shapeArgs.depth = depth;
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.options.chart.is3d) {
		var type = this.chart.options.chart.type,
			options = this.chart.options.plotOptions[type];
		
		var stack = (this.options.stack || 0),
			order = this.chart.series.length - this._i;

		var z = this.group.zIndex * 10;

		this.group.attr({zIndex: z});
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});

/*** 
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
	Not supported
***/
defaultOptions.plotOptions.cylinder = H.merge(defaultOptions.plotOptions.column);
var CylinderSeries = H.extendClass(H.seriesTypes.column, {
	type: 'cylinder'
});
H.seriesTypes.cylinder = CylinderSeries;

H.wrap(H.seriesTypes.cylinder.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	

	var series = this,
		chart = series.chart,
		options = chart.options,
		options3d = options.chart.options3d,
		depth = options.plotOptions.cylinder.depth || 0,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = options.plotOptions.cylinder.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (options.plotOptions.cylinder.grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'arc3d';
		shapeArgs.x += depth / 2;
		shapeArgs.z = z;
		shapeArgs.start = 0;
		shapeArgs.end = PI * 2;
		shapeArgs.r = depth * 0.95;
		shapeArgs.innerR = 0;
		shapeArgs.depth = shapeArgs.height * (1 / sin((90 - alpha) * (Math.PI / 180))) - z;
		shapeArgs.alpha = 90 - alpha;
		shapeArgs.beta = 0;
		shapeArgs.origin = origin;	
	});
});
/*** 
	EXTENSION FOR 3D PIES
***/

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	


	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		depth = options.plotOptions[type].depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = options.plotOptions[type].stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		
		point.shapeArgs.z = z;
		point.shapeArgs.depth = depth * 0.75;
		point.shapeArgs.origin = origin;
		point.shapeArgs.alpha = alpha;
		point.shapeArgs.beta = beta;
	
		var angle = (point.shapeArgs.end + point.shapeArgs.start) / 2;

		var tx = point.slicedTranslation.translateX = Math.round(cos(angle) * series.options.slicedOffset * cos(alpha * PI / 180));
		var ty = point.slicedTranslation.translateY = Math.round(sin(angle) * series.options.slicedOffset * cos(alpha * PI / 180));
	});
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	

	var series = this;
	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha * (Math.PI / 180),
			b1 = shapeArgs.beta * (Math.PI / 180),
			a2 = (shapeArgs.start + shapeArgs.end) / 2; 

		if (point.connector) {
			point.connector.translate(
				(-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? sin(b1) * d : 0),
				(-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0)
			);
		}
		if (point.dataLabel) {
			point.dataLabel.attr({
				x: point.dataLabel.connX + (-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? cos(b1) * d : 0) - (point.dataLabel.width / 2),
				y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)
			});
		}
	});
});

H.wrap(H.seriesTypes.pie.prototype, 'addPoint', function (proceed) {

	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.options.chart.is3d) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});/*** 
	EXTENSION FOR 3D SCATTER CHART
***/
H.wrap(H.seriesTypes.scatter.prototype, 'translate', function (proceed) {
//function translate3d(proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	if (!this.chart.options.chart.is3d) {
		return;
	}	

	var series = this,
		chart = series.chart,
		options3d = series.chart.options.chart.options3d,
		alpha = options3d.alpha,
		beta = options3d.beta,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		depth = options3d.depth,
		zAxis = chart.options.zAxis || { min : 0, max: depth };
	
	var rangeModifier = depth / (zAxis.max - zAxis.min);
	
	Highcharts.each(series.data, function (point) {
		var pCo = { 
			x: point.plotX,
			y: point.plotY,
			z: (point.z - zAxis.min) * rangeModifier
		};

		pCo = perspective([pCo], alpha, beta, origin)[0];		

		point.plotX = pCo.x;
		point.plotY = pCo.y;
		point.plotZ = pCo.z;
	});	  
});

H.wrap(H.seriesTypes.scatter.prototype, 'init', function (proceed) {
	var result = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.options.chart.is3d) {
		// Add a third coordinate
		this.pointArrayMap = ['x', 'y', 'z'];

		/// TODO: CAN THIS BE MADE SIMPLER ????
		// Set a new default tooltip formatter
		var default3dScatterTooltip = 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
		if (this.userOptions.tooltip) {
			this.tooltipOptions.pointFormat = this.userOptions.tooltip.pointFormat || default3dScatterTooltip;
		} else {
			this.tooltipOptions.pointFormat = default3dScatterTooltip;
		}
	}
});/***
	TO BE MADE
***/
}(Highcharts));
