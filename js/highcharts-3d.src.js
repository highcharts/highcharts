// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v3.0.10 (2014-03-10)
 *
 * (c) 2009-2013 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, HighchartsAdapter, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console */

(function (Highcharts) {
	/**
	Shorthands for often used function
*/ 
/**
 *	Mathematical Functionility
 */
var PI = Math.PI,
	deg2rad = (PI / 180), // degrees to radians 
	sin = Math.sin,
	cos = Math.cos, 

	round = Math.round;

function perspective(points, angle2, angle1, origin) {
	angle1 *= deg2rad;
	angle2 *= deg2rad;

	var result = [],
		xe, 
		ye, 
		ze;

	angle1 *= -1;
	
	xe = origin.x;
	ye = origin.y;
	ze = (origin.z === 0 ? 0.0001 : origin.z * 100);

	// some kind of minimum?

	var s1 = sin(angle1),
		c1 = cos(angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, p;

	Highcharts.each(points, function (point) {
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
////// HELPER METHODS //////
var dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);

function curveTo(cx, cy, rx, ry, start, end, dx, dy) {
	var result = [];
	if ((end > start) && (end - start > PI / 2 + 0.0001)) {
		result = result.concat(curveTo(cx, cy, rx, ry, start, start + (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start + (PI / 2), end, dx, dy));
		return result;
	} else if ((end < start) && (start - end > PI / 2 + 0.0001)) {			
		result = result.concat(curveTo(cx, cy, rx, ry, start, start - (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start - (PI / 2), end, dx, dy));
		return result;
	} else {
		var arcAngle = end - start;
		return [
			'C', 
			cx + (rx * cos(start)) - ((rx * dFactor * arcAngle) * sin(start)) + dx,
			cy + (ry * sin(start)) + ((ry * dFactor * arcAngle) * cos(start)) + dy,
			cx + (rx * cos(end)) + ((rx * dFactor * arcAngle) * sin(end)) + dx,
			cy + (ry * sin(end)) - ((ry * dFactor * arcAngle) * cos(end)) + dy,

			cx + (rx * cos(end)) + dx,
			cy + (ry * sin(end)) + dy
		];
	}
}

Highcharts.SVGRenderer.prototype.toLinePath = function (points, closed) {
	var result = [];

	// Put "L x y" for each point
	Highcharts.each(points, function (point) {
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

////// CUBOIDS //////
Highcharts.SVGRenderer.prototype.cuboid = function (shapeArgs) {

	var result = this.g(),
	paths = this.cuboidPath(shapeArgs);

	result.front = this.path(paths[0]).attr({zIndex: paths[3]}).add(result);
	result.top = this.path(paths[1]).attr({zIndex: paths[4]}).add(result);
	result.side = this.path(paths[2]).attr({zIndex: paths[5]}).add(result);

	result.attrSetters.fill = function (color) {
		var c0 = color,
		c1 = Highcharts.Color(color).brighten(0.1).get(),
		c2 = Highcharts.Color(color).brighten(-0.1).get();

		this.front.attr({fill: c0});
		this.top.attr({fill: c1});
		this.side.attr({fill: c2});

		return this;
	};

	result.animate = function (args, duration, complete) {
		if (args.x && args.y) {
			var renderer = this.renderer,
			paths = renderer.cuboidPath(args);
			this.front.animate({d: paths[0], zIndex: paths[3]}, duration, complete);
			this.top.animate({d: paths[1], zIndex: paths[4]}, duration, complete);
			this.side.animate({d: paths[2], zIndex: paths[5]}, duration, complete);
		} else {
			Highcharts.SVGElement.prototype.animate.call(this, args, duration, complete);
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


Highcharts.SVGRenderer.prototype.cuboidPath = function (shapeArgs) {
	var x = shapeArgs.x,
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
Highcharts.SVGRenderer.prototype.arc3d = function (shapeArgs) {

	shapeArgs.alpha *= deg2rad;
	shapeArgs.beta *= deg2rad;
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
		c2 = Highcharts.Color(color).brighten(-0.1).get();
		
		this.side1.attr({fill: c2});
		this.side2.attr({fill: c2});
		this.inn.attr({fill: c2});
		this.out.attr({fill: c2});
		this.top.attr({fill: c0});
		return this;
	};
		
	result.animate = function (args, duration, complete) {	
		Highcharts.SVGElement.prototype.animate.call(this, args, duration, complete);
		
		if (args.x && args.y) {

			// Recreate
			var result = this,
				renderer = this.renderer,
				shapeArgs = Highcharts.splat(args)[0];

			shapeArgs.alpha *= deg2rad;
			shapeArgs.beta *= deg2rad;

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

	result.zIndex = zIndex;
	result.attr({zIndex: zIndex});
	return result;
};


Highcharts.SVGRenderer.prototype.arc3dPath = function (shapeArgs) {
	var cx = shapeArgs.x,
		cy = shapeArgs.y,
		start = shapeArgs.start,
		end = shapeArgs.end - 0.00001,
		r = shapeArgs.r,
		ir = shapeArgs.innerR,
		d = shapeArgs.depth,
		alpha = shapeArgs.alpha,
		beta = shapeArgs.beta;

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
	var b = (beta > 0 ? PI / 2 : 0),
		a = (alpha > 0 ? 0 : PI / 2);

	var start2 = start > -b ? start : (end > -b ? -b : start),
		end2 = end < PI - a ? end : (start < PI - a ? PI - a : end);
	
	var out = ['M', cx + (rx * cos(start2)), cy + (ry * sin(start2))];
	out = out.concat(curveTo(cx, cy, rx, ry, start2, end2, 0, 0));
	out = out.concat([
		'L', cx + (rx * cos(end2)) + dx, cy + (ry * sin(end2)) + dy
	]);
	out = out.concat(curveTo(cx, cy, rx, ry, end2, start2, dx, dy));
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
/*** 
	EXTENSION FOR 3D CHARTS
***/
// Shorthand to check the is3d flag
Highcharts.Chart.prototype.is3d = function () {
	return this.options.chart.options3d && this.options.chart.options3d.enabled;
};

Highcharts.wrap(Highcharts.Chart.prototype, 'isInsidePlot', function (proceed) {
	if (this.is3d()) {
		return true;
	} else {
		return proceed.apply(this, [].slice.call(arguments, 1));
	}
});

Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {	
	var args = arguments;
	args[1] = Highcharts.merge({ 
		chart: {
			options3d: {
				enabled: false,
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

Highcharts.wrap(Highcharts.Chart.prototype, 'setChartSize', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.is3d()) {
		var inverted = this.inverted,
			clipBox = this.clipBox,
			margin = this.margin,
			x = inverted ? 'y' : 'x',
			y = inverted ? 'x' : 'y',
			w = inverted ? 'height' : 'width',
			h = inverted ? 'width' : 'height';

		clipBox[x] = -(margin[3] || 0);
		clipBox[y] = -(margin[0] || 0);
		clipBox[w] = this.chartWidth + (margin[3] || 0) + (margin[1] || 0);
		clipBox[h] = this.chartHeight + (margin[0] || 0) + (margin[2] || 0);
	}
});

Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function (proceed) {
	if (this.is3d()) {
		// Set to force a redraw of all elements
		this.isDirtyBox = true;
	}
	proceed.apply(this, [].slice.call(arguments, 1));	
});
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
});/*** 
	EXTENSION FOR 3D COLUMNS
***/
Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'init', function (proceed) {
	var args = arguments,
		series = this;
	if (args[1].is3d) {
		args[2].borderColor = args[2].borderColor || (function () {	
			return series.color;
		}());
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});	

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {  
		return;
	}	

	var type = this.chart.options.chart.type,
		series = this,
		chart = series.chart,
		options = chart.options,
		typeOptions = options.plotOptions[type],		
		options3d = options.chart.options3d,

		depth = typeOptions.depth || 0,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var stack = typeOptions.stacking ? (this.options.stack || 0) : series._i; 
	var z = stack * (depth + (typeOptions.groupZPadding || 1));

	if (typeOptions.grouping !== false) { z = 0; }

	z += (typeOptions.groupZPadding || 1);

	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'cuboid';
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta; 
		shapeArgs.z = z;
		shapeArgs.origin = origin;
		shapeArgs.depth = depth;
	});	    
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {
		this.group.attr({zIndex: this.group.zIndex * 10});
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});

/*** 
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
	Not supported
***/
var defaultOptions = Highcharts.getOptions();
defaultOptions.plotOptions.cylinder = Highcharts.merge(defaultOptions.plotOptions.column);
var CylinderSeries = Highcharts.extendClass(Highcharts.seriesTypes.column, {
	type: 'cylinder'
});
Highcharts.seriesTypes.cylinder = CylinderSeries;

Highcharts.wrap(Highcharts.seriesTypes.cylinder.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this,
		chart = series.chart,
		options = chart.options,
		cylOptions = options.plotOptions.cylinder,
		options3d = options.chart.options3d,
		depth = cylOptions.depth || 0,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha;

	var z = cylOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (cylOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'arc3d';
		shapeArgs.x += depth / 2;
		shapeArgs.z = z;
		shapeArgs.start = 0;
		shapeArgs.end = 2 * PI;
		shapeArgs.r = depth * 0.95;
		shapeArgs.innerR = 0;
		shapeArgs.depth = shapeArgs.height * (1 / sin((90 - alpha) * deg2rad)) - z;
		shapeArgs.alpha = 90 - alpha;
		shapeArgs.beta = 0;
		shapeArgs.origin = origin;	
	});
});
/*** 
	EXTENSION FOR 3D PIES
***/

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	
	
	var series = this,
		chart = series.chart,
		options = chart.options,
		pieOptions = options.plotOptions.pie,
		depth = pieOptions.depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = pieOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (pieOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		var shapeArgs = point.shapeArgs;

		shapeArgs.z = z;
		shapeArgs.depth = depth * 0.75;
		shapeArgs.origin = origin;
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta;
	
		var angle = (shapeArgs.end + shapeArgs.start) / 2;

		point.slicedTranslation = {
			translateX : round(cos(angle) * series.options.slicedOffset * cos(alpha * deg2rad)),
			translateY : round(sin(angle) * series.options.slicedOffset * cos(alpha * deg2rad))
		};
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this;
	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha * deg2rad,
			b1 = shapeArgs.beta * deg2rad,
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

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'addPoint', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.is3d()) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});/*** 
	EXTENSION FOR 3D SCATTER CHART
***/
Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'translate', function (proceed) {
//function translate3d(proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	if (!this.chart.is3d()) {
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

		point.plotXold = point.plotX;
		point.plotYold = point.plotY;
		
		point.plotX = pCo.x;
		point.plotY = pCo.y;
		point.plotZ = pCo.z;
	});	  
});

Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'init', function (proceed) {
	var result = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		// Add a third coordinate
		this.pointArrayMap = ['x', 'y', 'z'];

		// Set a new default tooltip formatter
		var default3dScatterTooltip = 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
		if (this.userOptions.tooltip) {
			this.tooltipOptions.pointFormat = this.userOptions.tooltip.pointFormat || default3dScatterTooltip;
		} else {
			this.tooltipOptions.pointFormat = default3dScatterTooltip;
		}
	}
	return result;
});/**
 *	Extension to the VML Renderer
 */
if (Highcharts.VMLRenderer) {

Highcharts.VMLRenderer.prototype.cuboid = Highcharts.SVGRenderer.prototype.cuboid;
Highcharts.VMLRenderer.prototype.cuboidPath = Highcharts.SVGRenderer.prototype.cuboidPath;

Highcharts.VMLRenderer.prototype.toLinePath = Highcharts.SVGRenderer.prototype.toLinePath;

Highcharts.VMLRenderer.prototype.createElement3D = Highcharts.SVGRenderer.prototype.createElement3D;

Highcharts.VMLRenderer.prototype.arc3d = function (shapeArgs) { 
	var result = Highcharts.SVGRenderer.prototype.arc3d.call(this, shapeArgs);
	result.css({zIndex: result.zIndex});
	return result;
};

Highcharts.VMLRenderer.prototype.arc3dPath = Highcharts.SVGRenderer.prototype.arc3dPath;

// Draw the series in the reverse order
Highcharts.Chart.prototype.renderSeries = function () {
	var serie,
		i = this.series.length;
	while (i--) {		
		serie = this.series[i];
		serie.translate();
		if (serie.setTooltipPoints) {
			serie.setTooltipPoints();
		}
		serie.render();	
	}
};

}

}(Highcharts));
