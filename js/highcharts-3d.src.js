// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v4.0.4-modified ()
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
	pick = Highcharts.pick,
	round = Math.round;

function perspective(points, chart, insidePlotArea) {
	var options3d = chart.options.chart.options3d,
		inverted = false;
	if (insidePlotArea) {
		inverted = chart.inverted;
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth / 2,
			vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
		};
	} else {
		origin = {
			x: chart.plotLeft + (chart.plotWidth / 2),
			y: chart.plotTop + (chart.plotHeight / 2),
			z: options3d.depth / 2,
			vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
		};
	}

	var result = [],
		xe = origin.x,
		ye = origin.y,
		ze = origin.z,
		vd = origin.vd,
		angle1 = deg2rad * (inverted ?  options3d.beta  : -options3d.beta),
		angle2 = deg2rad * (inverted ? -options3d.alpha :  options3d.alpha),
		s1 = sin(angle1),
		c1 = cos(angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, px, py, pz, p;

	Highcharts.each(points, function (point) {
		x = (inverted ? point.y : point.x) - xe;
		y = (inverted ? point.x : point.y) - ye;
		z = (point.z || 0) - ze;

		//Apply 3-D rotation
		px = c1 * x - s1 * z;
		py = -s1 * s2 * x - c1 * s2 * z + c2 * y;
		pz = s1 * c2 * x + c1 * c2 * z + s2 * y;

		//Apply perspective
		if ((vd > 0) && (vd < Number.POSITIVE_INFINITY)) {
			px = px * (vd / (pz + ze + vd));
			py = py * (vd / (pz + ze + vd));
		}

		//Apply translation
		px = px + xe;
		py = py + ye;
		pz = pz + ze;

		result.push({
			x: (inverted ? py : px),
			y: (inverted ? px : py),
			z: pz
		});
	});
	return result;
}
// Make function acessible to plugins
Highcharts.perspective = perspective;
/*** 
	EXTENSION TO THE SVG-RENDERER TO ENABLE 3D SHAPES
	***/
////// HELPER METHODS //////
var dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);

function defined(obj) {
	return obj !== undefined && obj !== null;
}


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

	result.front = this.path(paths[0]).attr({zIndex: paths[3], 'stroke-linejoin': 'round'}).add(result);
	result.top = this.path(paths[1]).attr({zIndex: paths[4], 'stroke-linejoin': 'round'}).add(result);
	result.side = this.path(paths[2]).attr({zIndex: paths[5], 'stroke-linejoin': 'round'}).add(result);

	result.fillSetter = function (color) {
		var c0 = color,
		c1 = Highcharts.Color(color).brighten(0.1).get(),
		c2 = Highcharts.Color(color).brighten(-0.1).get();

		this.front.attr({fill: c0});
		this.top.attr({fill: c1});
		this.side.attr({fill: c2});

		this.color = color;
		return this;
	};

	result.opacitySetter = function (opacity) {
		this.front.attr({opacity: opacity});
		this.top.attr({opacity: opacity});
		this.side.attr({opacity: opacity});
		return this;
	};

	result.attr = function (args) {
		if (args.shapeArgs || defined(args.x)) {
			var shapeArgs = args.shapeArgs || args;
			var paths = this.renderer.cuboidPath(shapeArgs);
			this.front.attr({d: paths[0], zIndex: paths[3]});
			this.top.attr({d: paths[1], zIndex: paths[4]});
			this.side.attr({d: paths[2], zIndex: paths[5]});			
		} else {
			Highcharts.SVGElement.prototype.attr.call(this, args);
		}

		return this;
	};
	
	result.animate = function (args, duration, complete) {
		if (defined(args.x) && defined(args.y)) {
			var paths = this.renderer.cuboidPath(args);
			this.front.attr({zIndex: paths[3]}).animate({d: paths[0]}, duration, complete);
			this.top.attr({zIndex: paths[4]}).animate({d: paths[1]}, duration, complete);
			this.side.attr({zIndex: paths[5]}).animate({d: paths[2]}, duration, complete);
		} else if (args.opacity) {				
				this.front.animate(args, duration, complete);
				this.top.animate(args, duration, complete);
				this.side.animate(args, duration, complete);
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

	// Apply the Z index to the cuboid group
	result.attr({ zIndex: -paths[3] });

	return result;
};


Highcharts.SVGRenderer.prototype.cuboidPath = function (shapeArgs) {
	var x = shapeArgs.x,
		y = shapeArgs.y,
		z = shapeArgs.z,
		h = shapeArgs.height,
		w = shapeArgs.width,
		d = shapeArgs.depth,
		chart = Highcharts.charts[this.box.parentElement.parentElement.getAttribute("data-highcharts-chart")],
		alpha = chart.options.chart.options3d.alpha,
		beta = chart.options.chart.options3d.beta;

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

	pArr = perspective(pArr, chart, shapeArgs.insidePlotArea);

	var path1, // FRONT
		path2, // TOP OR BOTTOM
		path3; // LEFT OR RIGHT

	// front	
	path1 = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];
	var z1 = (pArr[0].z + pArr[1].z + pArr[2].z + pArr[3].z) / 4;

	// top or bottom
	var top = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[7].x, pArr[7].y,
	'L', pArr[6].x, pArr[6].y,
	'L', pArr[1].x, pArr[1].y,
	'Z'
	];
	var bottom = [
	'M', pArr[3].x, pArr[3].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[4].x, pArr[4].y,
	'Z'
	];
	if (pArr[7].y < pArr[1].y) {
		path2 = top;
	} else if (pArr[4].y > pArr[2].y) {
		path2 = bottom;
	} else {
		path2 = [];
	}
	var z2 = (beta > 0 ? (pArr[0].z + pArr[7].z + pArr[6].z + pArr[1].z) / 4 : (pArr[3].z + pArr[2].z + pArr[5].z + pArr[4].z) / 4);

	// side
	var right = [
	'M', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[6].x, pArr[6].y,
	'Z'
	];
	var left = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[7].x, pArr[7].y,
	'L', pArr[4].x, pArr[4].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];	
	if (pArr[6].x > pArr[1].x) {
		path3 = right;
	} else if (pArr[7].x < pArr[0].x) {
		path3 = left;
	} else {
		path3 = [];
	}
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

	var zIndex = paths.zTop * 100;

	result.shapeArgs = shapeArgs;	// Store for later use

	result.top = renderer.path(paths.top).attr({zIndex: paths.zTop}).add(result);
	result.side1 = renderer.path(paths.side2).attr({zIndex: paths.zSide1});
	result.side2 = renderer.path(paths.side1).attr({zIndex: paths.zSide2});
	result.inn = renderer.path(paths.inn).attr({zIndex: paths.zInn});
	result.out = renderer.path(paths.out).attr({zIndex: paths.zOut});

	result.fillSetter = function (color) {
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
	
	result.translateXSetter = function (value) {
		this.out.attr({translateX: value});
		this.inn.attr({translateX: value});
		this.side1.attr({translateX: value});
		this.side2.attr({translateX: value});
		this.top.attr({translateX: value});
	};
	
	result.translateYSetter = function (value) {
		this.out.attr({translateY: value});
		this.inn.attr({translateY: value});
		this.side1.attr({translateY: value});
		this.side2.attr({translateY: value});
		this.top.attr({translateY: value});
	};

	result.animate = function (args, duration, complete) {
		if (defined(args.end) || defined(args.start)) {
			this._shapeArgs = this.shapeArgs;

			Highcharts.SVGElement.prototype.animate.call(this, {
				_args: args	
			}, {
				duration: duration,
				step: function () {
					var args = arguments,
						fx = args[1],
						result = fx.elem,						
						start = result._shapeArgs,
						end = fx.end,
						pos = fx.pos,
						sA = Highcharts.merge(start, {
							x: start.x + ((end.x - start.x) * pos),
							y: start.y + ((end.y - start.y) * pos),
							r: start.r + ((end.r - start.r) * pos),
							innerR: start.innerR + ((end.innerR - start.innerR) * pos),
							start: start.start + ((end.start - start.start) * pos),
							end: start.end + ((end.end - start.end) * pos)
						});

					var paths = result.renderer.arc3dPath(sA);

					result.shapeArgs = sA;

					result.top.attr({d: paths.top, zIndex: paths.zTop});
					result.inn.attr({d: paths.inn, zIndex: paths.zInn});
					result.out.attr({d: paths.out, zIndex: paths.zOut});
					result.side1.attr({d: paths.side1, zIndex: paths.zSide1});
					result.side2.attr({d: paths.side2, zIndex: paths.zSide2});

				}
			}, complete);
		} else {			
			Highcharts.SVGElement.prototype.animate.call(this, args, duration, complete);
		}
		return this;
	};

	result.destroy = function () {
		this.top.destroy();
		this.out.destroy();
		this.inn.destroy();
		this.side1.destroy();
		this.side2.destroy();

		Highcharts.SVGElement.prototype.destroy.call(this);
	};
	result.hide = function () {
		this.top.hide();
		this.out.hide();
		this.inn.hide();
		this.side1.hide();
		this.side2.hide();
	};
	result.show = function () {
		this.top.show();
		this.out.show();
		this.inn.show();
		this.side1.show();
		this.side2.show();
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

	var a1 = sin((start + end) / 2),
		a2 = sin(start),
		a3 = sin(end);

	return {
		top: top,
		zTop: r,
		out: out,
		zOut: Math.max(a1, a2, a3) * r,
		inn: inn,
		zInn: Math.max(a1, a2, a3) * r,
		side1: side1,
		zSide1: a2 * (r * 0.99),
		side2: side2,
		zSide2: a3 * (r * 0.99)
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

var defaultChartOptions = Highcharts.getOptions();
defaultChartOptions.chart.options3d = {
	enabled: false,
	alpha: 0,
	beta: 0,
	depth: 100,
	viewDistance: 25,
	frame: {
		bottom: { size: 1, color: 'rgba(255,255,255,0)' },
		side: { size: 1, color: 'rgba(255,255,255,0)' },
		back: { size: 1, color: 'rgba(255,255,255,0)' }
	}
};

Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {
	var args = [].slice.call(arguments, 1),
		plotOptions,
		pieOptions;

	if (args[0].chart.options3d && args[0].chart.options3d.enabled) {
		plotOptions = args[0].plotOptions || {};
		pieOptions = plotOptions.pie || {};

		pieOptions.borderColor = Highcharts.pick(pieOptions.borderColor, undefined); 
	}
	proceed.apply(this, args);
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

Highcharts.Chart.prototype.retrieveStacks = function (grouping, stacking) {

	var stacks = {},
		i = 1;

	if (grouping || !stacking) { return this.series; }

	Highcharts.each(this.series, function (S) {
		if (!stacks[S.options.stack || 0]) {
			stacks[S.options.stack || 0] = { series: [S], position: i};
			i++;
		} else {
			stacks[S.options.stack || 0].series.push(S);
		}
	});
	stacks.totalStacks = i + 1;
	return stacks;
};

/***
	EXTENSION TO THE AXIS
***/
Highcharts.wrap(Highcharts.Axis.prototype, 'init', function (proceed) {
	var args = arguments;
	if (args[1].is3d()) {
		args[2].tickWidth = Highcharts.pick(args[2].tickWidth, 0);
		args[2].gridLineWidth = Highcharts.pick(args[2].gridLineWidth, 1);
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
		frame = options3d.frame,
		fbottom = frame.bottom,
		fback = frame.back,
		fside = frame.side,
		depth = options3d.depth,
		height = this.height,
		width = this.width,
		left = this.left,
		top = this.top;

	if (this.horiz) {
		/// BOTTOM
		if (this.axisLine) {
			this.axisLine.hide();
		}
		var bottomShape = {
			x: left,
			y: top + (chart.yAxis[0].reversed ? -fbottom.size : height),
			z: 0,
			width: width,
			height: fbottom.size,
			depth: depth,
			insidePlotArea: false
		};
		if (!this.bottomFrame) {
			this.bottomFrame = renderer.cuboid(bottomShape).attr({fill: fbottom.color, zIndex: (chart.yAxis[0].reversed && options3d.alpha > 0 ? 4 : -1)}).css({stroke: fbottom.color}).add();
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
			insidePlotArea: false
		};
		if (!this.backFrame) {
			this.backFrame = renderer.cuboid(backShape).attr({fill: fback.color, zIndex: -3}).css({stroke: fback.color}).add();
		} else {
			this.backFrame.animate(backShape);
		}
		// SIDE
		if (this.axisLine) {
			this.axisLine.hide();
		}
		var sideShape = {
			x: (chart.yAxis[0].opposite ? width : 0) + left - fside.size,
			y: top,
			z: 0,
			width: fside.size,
			height: height + fbottom.size,
			depth: depth + fback.size,
			insidePlotArea: false
		};
		if (!this.sideFrame) {
			this.sideFrame = renderer.cuboid(sideShape).attr({fill: fside.color, zIndex: -2}).css({stroke: fside.color}).add();
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

	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)}
	];

	pArr = perspective(pArr, this.chart, false);
	path = this.chart.renderer.toLinePath(pArr, false);

	return path;
});

Highcharts.wrap(Highcharts.Axis.prototype, 'getPlotBandPath', function (proceed) {
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			from = args[1],
			to = args[2];
	
		var toPath = this.getPlotLinePath(to),
			path = this.getPlotLinePath(from);

		if (path && toPath) {
			path.push(
				toPath[7],	// These two do not exist in the regular getPlotLine
				toPath[8],  // ---- # 3005
				toPath[4],
				toPath[5],
				toPath[1],
				toPath[2]
			);
		} else { // outside the axis area
			path = null;
		}
		
		return path;
	}
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

	var pArr = [
		{x: path[1], y: path[2], z: 0},
		{x: path[4], y: path[5], z: 0}
	];

	pArr = perspective(pArr, this.axis.chart, false);
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

	pos = perspective([{x: pos.x, y: pos.y, z: 0}], this.axis.chart, false)[0];
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
/***
	EXTENSION FOR 3D COLUMNS
***/
Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {  
		return;
	}	

	var series = this,
		chart = series.chart,
		options = chart.options,
		seriesOptions = series.options,
		depth = seriesOptions.depth || 25;

	var stack = seriesOptions.stacking ? (seriesOptions.stack || 0) : series._i;
	var z = stack * (depth + (seriesOptions.groupZPadding || 1));

	if (seriesOptions.grouping !== false) { z = 0; }

	z += (seriesOptions.groupZPadding || 1);

	Highcharts.each(series.data, function (point) {
		if (point.y !== null) {
			var shapeArgs = point.shapeArgs,
				tooltipPos = point.tooltipPos;

			point.shapeType = 'cuboid';
			shapeArgs.z = z;
			shapeArgs.depth = depth;
			shapeArgs.insidePlotArea = true;

			// Translate the tooltip position in 3d space
			tooltipPos = perspective([{ x: tooltipPos[0], y: tooltipPos[1], z: z }], chart, false)[0];
			point.tooltipPos = [tooltipPos.x, tooltipPos.y];
		}
	});	    
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'animate', function (proceed) {
	if (!this.chart.is3d()) {
		proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			init = args[1],
			yAxis = this.yAxis,
			series = this,
			reversed = this.yAxis.reversed;

		if (Highcharts.svg) { // VML is too slow anyway
			if (init) {
				Highcharts.each(series.data, function (point) {
					if (point.y !== null) {
						point.height = point.shapeArgs.height;
						point.shapey = point.shapeArgs.y;	//#2968				
						point.shapeArgs.height = 1;
						if (!reversed) {
							if (point.stackY) {
								point.shapeArgs.y = point.plotY + yAxis.translate(point.stackY);
							} else {
								point.shapeArgs.y = point.plotY + (point.negative ? -point.height : point.height);
							}
						}
					}
				});

			} else { // run the animation				
				Highcharts.each(series.data, function (point) {					
					if (point.y !== null) {
						point.shapeArgs.height = point.height;
						point.shapeArgs.y = point.shapey;	//#2968
						// null value do not have a graphic
						if (point.graphic) {
							point.graphic.animate(point.shapeArgs, series.options.animation);					
						}
					}
				});

				// redraw datalabels to the correct position
				this.drawDataLabels();

				// delete this function to allow it only once
				series.animate = null;
			}
		}
	}
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'init', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		var seriesOptions = this.options,	
			grouping = seriesOptions.grouping,
			stacking = seriesOptions.stacking,
			z = 0;	
		
		if (!(grouping !== undefined && !grouping) && stacking) {
			var stacks = this.chart.retrieveStacks(grouping, stacking),
				stack = seriesOptions.stack || 0,
				i; // position within the stack
			for (i = 0; i < stacks[stack].series.length; i++) {
				if (stacks[stack].series[i] === this) {
					break;
				}
			}
			z = (stacks.totalStacks * 10) - (10 * (stacks.totalStacks - stacks[stack].position)) - i;
		}
				
		seriesOptions.zIndex = z;
	}
});
function draw3DPoints(proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {		
		var grouping = this.chart.options.plotOptions.column.grouping;
		if (grouping !== undefined && !grouping && this.group.zIndex !== undefined) {
			this.group.attr({zIndex : (this.group.zIndex * 10)});
		} 

		var options = this.options,
			states = this.options.states;
			
		this.borderWidth = options.borderWidth = options.edgeWidth || 1;

		Highcharts.each(this.data, function (point) {
			if (point.y !== null) {
				var pointAttr = point.pointAttr;

				// Set the border color to the fill color to provide a smooth edge
				this.borderColor = Highcharts.pick(options.edgeColor, pointAttr[''].fill);

				pointAttr[''].stroke = this.borderColor;
				pointAttr.hover.stroke = Highcharts.pick(states.hover.edgeColor, this.borderColor);
				pointAttr.select.stroke = Highcharts.pick(states.select.edgeColor, this.borderColor);
			}
		});
	}

	proceed.apply(this, [].slice.call(arguments, 1));
}

Highcharts.wrap(Highcharts.Series.prototype, 'alignDataLabel', function (proceed) {
	
	// Only do this for 3D columns and columnranges
	if (this.chart.is3d() && (this.type === 'column' || this.type === 'columnrange')) {
		var series = this,
			chart = series.chart;

		var args = arguments,
			alignTo = args[4];
		
		var pos = ({x: alignTo.x, y: alignTo.y, z: 0});
		pos = perspective([pos], chart, true)[0];
		alignTo.x = pos.x;
		alignTo.y = pos.y;
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});

if (Highcharts.seriesTypes.columnrange) {
	Highcharts.wrap(Highcharts.seriesTypes.columnrange.prototype, 'drawPoints', draw3DPoints);
}

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'drawPoints', draw3DPoints);

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
			z: options3d.depth,
			vd: options3d.viewDistance
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
		seriesOptions = series.options,
		depth = seriesOptions.depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (seriesOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		var shapeArgs = point.shapeArgs;

		if (point.y) { // will be false if null or 0 #3006
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
		} else {
			shapeArgs = null;
		}
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype.pointClass.prototype, 'haloPath', function (proceed) {
	var args = arguments;
	return this.series.chart.is3d() ? [] : proceed.call(this, args[1]);
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {
		var options = this.options,
			states = this.options.states;

		// Set the border color to the fill color to provide a smooth edge
		this.borderWidth = options.borderWidth = options.edgeWidth || 1;
		this.borderColor = options.edgeColor = Highcharts.pick(options.edgeColor, options.borderColor, undefined);

		states.hover.borderColor = Highcharts.pick(states.hover.edgeColor, this.borderColor);		
		states.hover.borderWidth = Highcharts.pick(states.hover.edgeWidth, this.borderWidth);	
		states.select.borderColor = Highcharts.pick(states.select.edgeColor, this.borderColor);		
		states.select.borderWidth = Highcharts.pick(states.select.edgeWidth, this.borderWidth);

		Highcharts.each(this.data, function (point) {
			var pointAttr = point.pointAttr;
			pointAttr[''].stroke = point.series.borderColor || point.color;
			pointAttr['']['stroke-width'] = point.series.borderWidth;
			pointAttr.hover.stroke = states.hover.borderColor;	
			pointAttr.hover['stroke-width'] = states.hover.borderWidth;
			pointAttr.select.stroke = states.select.borderColor;
			pointAttr.select['stroke-width'] = states.select.borderWidth;
		});	
	}

	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {		
		var seriesGroup = this.group;
		Highcharts.each(this.points, function (point) {
			point.graphic.out.add(seriesGroup);
			point.graphic.inn.add(seriesGroup);
			point.graphic.side1.add(seriesGroup);
			point.graphic.side2.add(seriesGroup);
		});		
	}
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	if (this.chart.is3d()) {
		var series = this;
		Highcharts.each(series.data, function (point) {
			var shapeArgs = point.shapeArgs,
				r = shapeArgs.r,
				d = shapeArgs.depth,
				a1 = (shapeArgs.alpha || series.chart.options.chart.options3d.alpha) * deg2rad, //#3240 issue with datalabels for 0 and null values
				a2 = (shapeArgs.start + shapeArgs.end) / 2,
				labelPos = point.labelPos;

			labelPos[1] += (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0);
			labelPos[3] += (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0);
			labelPos[5] += (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0);

		});
	} 

	proceed.apply(this, [].slice.call(arguments, 1));
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'addPoint', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.is3d()) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'animate', function (proceed) {
	if (!this.chart.is3d()) {
		proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			init = args[1],
			animation = this.options.animation,
			attribs,
			center = this.center,
			group = this.group,
			markerGroup = this.markerGroup;

		if (Highcharts.svg) { // VML is too slow anyway
				
				if (animation === true) {
					animation = {};
				}
				// Initialize the animation
				if (init) {
				
					// Scale down the group and place it in the center
					group.oldtranslateX = group.translateX;
					group.oldtranslateY = group.translateY;
					attribs = {
						translateX: center[0],
						translateY: center[1],
						scaleX: 0.001, // #1499
						scaleY: 0.001
					};
					
					group.attr(attribs);
					if (markerGroup) {
						markerGroup.attrSetters = group.attrSetters;
						markerGroup.attr(attribs);
					}
				
				// Run the animation
				} else {
					attribs = {
						translateX: group.oldtranslateX,
						translateY: group.oldtranslateY,
						scaleX: 1,
						scaleY: 1
					};
					group.animate(attribs, animation);

					if (markerGroup) {
						markerGroup.animate(attribs, animation);
					}
				
					// Delete this function to allow it only once
					this.animate = null;
				}
				
		}
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
		depth = chart.options.chart.options3d.depth,
		zAxis = chart.options.zAxis || { min : 0, max: depth };

	var rangeModifier = depth / (zAxis.max - zAxis.min),
		raw_points = [],
		raw_point,
		projected_points,
		projected_point,
		i;

	for (i = 0; i < series.data.length; i++) {
		raw_point = series.data[i];
		raw_points.push({
			x: raw_point.plotX,
			y: raw_point.plotY,
			z: (raw_point.z - zAxis.min) * rangeModifier
		});
	}

	projected_points = perspective(raw_points, chart, true);

	for (i = 0; i < series.data.length; i++) {
		raw_point = series.data[i];
		projected_point = projected_points[i];

		raw_point.plotXold = raw_point.plotX;
		raw_point.plotYold = raw_point.plotY;

		raw_point.plotX = projected_point.x;
		raw_point.plotY = projected_point.y;
		raw_point.plotZ = projected_point.z;
	}
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
});
/**
 *	Extension to the VML Renderer
 */
if (Highcharts.VMLRenderer) {

Highcharts.setOptions({animate: false});

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

Highcharts.wrap(Highcharts.Axis.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// VML doesn't support a negative z-index
	if (this.sideFrame) {
		this.sideFrame.css({zIndex: 0});
		this.sideFrame.front.attr({fill: this.sideFrame.color});
	}
	if (this.bottomFrame) {
		this.bottomFrame.css({zIndex: 1});
		this.bottomFrame.front.attr({fill: this.bottomFrame.color});
	}	
	if (this.backFrame) {
		this.backFrame.css({zIndex: 0});
		this.backFrame.front.attr({fill: this.backFrame.color});
	}		
});

}

}(Highcharts));
