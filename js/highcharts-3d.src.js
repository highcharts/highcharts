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
	var result = [];
	var xe, ye, ze;

	angle1 = -angle1;
	
	xe = origin.x;
	ye = origin.y;
	ze = (origin.z === 0 ? 0.0001 : origin.z * 1000);

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

	result.animate = function (shapeArgs) {
		var renderer = this.renderer,
		paths = renderer.cuboidPath(shapeArgs);

		this.front.attr({d: paths[0]});
		this.top.attr({d: paths[1]});
		this.side.attr({d: paths[2]});

		return this;
	};
	return result;
};


HR.prototype.cuboidPath = function (shapeArgs) {
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
HR.prototype.arc3d = function (shapeArgs) {

	var result = this.g(),
	paths = this.arc3dPath(shapeArgs),
	renderer = result.renderer;

	var zIndex = paths[4] * 100;

	result.ins = [];
	H.each(paths[3], function (path) {
		result.ins.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.outs = [];
	H.each(paths[1], function (path) {
		result.outs.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.sides = [];
	H.each(paths[2], function (path) {
		result.sides.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.tops = [];
	H.each(paths[0], function (path) {
		result.tops.push(renderer.path(path).attr({zIndex: zIndex + 1}).add(result));
	});

	result.attrSetters.fill = function (color) {
		var c0 = color,
		c2 = H.Color(color).brighten(-0.1).get();

		H.each(this.outs, function (out) {
			out.attr({fill: c2}).css({stroke: c2});
		});				
		H.each(this.ins, function (inn) {
			inn.attr({fill: c2}).css({stroke: c2});
		});	
		H.each(this.sides, function (side) {
			side.attr({fill: c2}).css({stroke: c2});
		});
		H.each(this.tops, function (top) {
			top.attr({fill: c0}).css({stroke: c0});
		});
		return this;
	};
	
	result.attrSetters['stroke-width'] = function () {
		// Force all to 0		
		return 0;
	};
	
	result.animate = function (args) {
		if (args.translateX !== undefined && args.translateY !== undefined) {
			this.translate(args.translateX, args.translateY);

		}
		return this;
	};
	result.slice = function (shapeArgs) {
		console.log('slice ?');
		return this;
	};

	result.attr({zIndex: zIndex});
	return result;
};


HR.prototype.arc3dPath = function (shapeArgs) {
	var topPaths = [],
	outPaths = [],
	sidePaths = [],
	inPaths = [];

	var x = shapeArgs.x,
	y = shapeArgs.y,
	z = shapeArgs.z,
	start = shapeArgs.start,
	end = shapeArgs.end - 0.00001,
	r = shapeArgs.r,
	ir = shapeArgs.innerR,
	d = shapeArgs.depth,
	alpha = shapeArgs.alpha,
	beta = shapeArgs.beta,
	origin = shapeArgs.origin;

	// 2PI Correction
	start = start % (2 * PI);
	end = end % (2 * PI);

	var arcAngle = end - start,
	p1, 
	p2;

	if (arcAngle > PI / 2) {		
		p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: start + (PI / 2), r: r, innerR: ir, alpha: alpha, beta: beta});
		p2 = this.arc3dPath({x: x, y: y, depth: d, start: start + (PI / 2) + 0.00001, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

		topPaths = topPaths.concat(p1[0]);
		topPaths = topPaths.concat(p2[0]);

		outPaths = outPaths.concat(p1[1]);
		outPaths = outPaths.concat(p2[1]);	 

		sidePaths = sidePaths.concat(p1[2]);
		sidePaths = sidePaths.concat(p2[2]);   

		inPaths = inPaths.concat(p1[3]);
		inPaths = inPaths.concat(p2[3]);
	} else {
		// -PI -> PI
		start = (start > PI ? start - (2 * PI) : start);
		end = (end > PI ? end - (2 * PI) : end);

		if (start < 0 && end > 0) {	   
			p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: 0, r: r, innerR: ir, alpha: alpha, beta: beta});
			p2 = this.arc3dPath({x: x, y: y, depth: d, start: 0, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

			topPaths = topPaths.concat(p1[0]);
			topPaths = topPaths.concat(p2[0]);   

			outPaths = outPaths.concat(p1[1]);
			outPaths = outPaths.concat(p2[1]);	 

			sidePaths = sidePaths.concat(p1[2]);
			sidePaths = sidePaths.concat(p2[2]);   

			inPaths = inPaths.concat(p1[3]);
			inPaths = inPaths.concat(p2[3]);
		} else if (start > 0 && end < 0) {			
			p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: PI, r: r, innerR: ir, alpha: alpha, beta: beta});
			p2 = this.arc3dPath({x: x, y: y, depth: d, start: -PI, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

			topPaths = topPaths.concat(p1[0]);
			topPaths = topPaths.concat(p2[0]);

			outPaths = outPaths.concat(p1[1]);
			outPaths = outPaths.concat(p2[1]);  

			sidePaths = sidePaths.concat(p1[2]);
			sidePaths = sidePaths.concat(p2[2]);   

			inPaths = inPaths.concat(p1[3]);
			inPaths = inPaths.concat(p2[3]);
		} else {		
			end += 0.001;

			var rx = cos(beta) * r,
			ry = cos(alpha) * r,
			irx = cos(beta) * ir,
			iry = cos(alpha) * ir,
			dx = d * sin(beta),
			dy = d * sin(alpha);

			var sxO = x + (rx * cos(start)),
			syO = y + (ry * sin(start)),
			exO = x + (rx * cos(end)),
			eyO = y + (ry * sin(end)),
			exI = x + (irx * cos(start)),
			eyI = y + (iry * sin(start)),
			sxI = x + (irx * cos(end)),
			syI = y + (iry * sin(end));

			var rx2 = rx * 4 * (Math.sqrt(2) - 1) / 3,	
			rx3 = rx2 / ((PI / 2) / arcAngle),
			irx2 = irx * 4 * (Math.sqrt(2) - 1) / 3,	
			irx3 = irx2 / ((PI / 2) / arcAngle);

			var ry2 = ry * 4 * (Math.sqrt(2) - 1) / 3,	
			ry3 = ry2 / ((PI / 2) / arcAngle),
			iry2 = iry * 4 * (Math.sqrt(2) - 1) / 3,	
			iry3 = iry2 / ((PI / 2) / arcAngle);	

			topPaths.push([
				'M', sxO, syO,
				'C', sxO - (rx3 * sin(start)), syO + (ry3 * cos(start)), 
				exO + (rx3 * sin(end)), eyO - (ry3 * cos(end)), 
				exO, eyO,
				'L', sxI, syI,
				'C', sxI + (irx3 * sin(end)), syI - (iry3 * cos(end)), 
				exI - (irx3 * sin(start)), eyI + (iry3 * cos(start)), 
				exI, eyI,		
				'Z'
				]);

			outPaths.push([
				'M', sxO, syO,
				'C', sxO - (rx3 * sin(start)), syO + (ry3 * cos(start)), 
				exO + (rx3 * sin(end)), eyO - (ry3 * cos(end)), 
				exO, eyO,
				'L', exO + dx, eyO + dy,
				'C', exO + (rx3 * sin(end)) + dx, eyO - (ry3 * cos(end)) + dy,
				sxO - (rx3 * sin(start)) + dx, syO + (ry3 * cos(start)) + dy, 
				sxO + dx, syO + dy,
				'Z'
				]);

			sidePaths.push([
				'M', sxO, syO,
				'L', sxO + dx, syO + dy,
				'L', exI + dx, eyI + dy,
				'L', exI, eyI,
				'Z',

				'M', exO, eyO,
				'L', exO + dx, eyO + dy,
				'L', sxI + dx, syI + dy,
				'L', sxI, syI,
				'Z'		
				]);

			inPaths.push([
				'M', sxI, syI,
				'C', sxI + (irx3 * sin(end)), syI - (iry3 * cos(end)), 
				exI - (irx3 * sin(start)), eyI + (iry3 * cos(start)), 
				exI, eyI,
				'L', exI + dx, eyI + dy,
				'C', exI - (irx3 * sin(start)) + dx, eyI + (iry3 * cos(start)) + dy, 
				sxI + (irx3 * sin(end)) + dx, syI - (iry3 * cos(end)) + dy, 
				sxI + dx, syI + dy,
				'Z'
				]);
		}
	}

	var midAngle = (start * 2 + arcAngle) / 2;
	var zIndex = (sin(beta) * cos(midAngle)) + (sin(alpha) * sin(midAngle));

	return [topPaths, outPaths, sidePaths, inPaths, zIndex];
};

////// HELPER METHODS //////
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
	// Set to force a redraw of all elements
	this.isDirtyBox = true;
	proceed.apply(this, [].slice.call(arguments, 1));	
});


H.wrap(HC.prototype, 'firstRender', function (proceed) {
	// Set to force a redraw of all elements

	proceed.apply(this, [].slice.call(arguments, 1));

	var invSeries = [];

	for (i = 0; i < this.series.length; i++) {
		invSeries.push(this.series[this.series.length - (i + 1)]);
	}
	this.series = invSeries;
	
	this.redraw();
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
/*** 
	EXTENSION FOR 3D COLUMNS
***/
H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		options3d = options.chart.options3d,
		cylindrical = (type === 'cylinder'),
		depth = options3d.depth,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: depth * chart.series.length
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = options.plotOptions[type].stacking ? (this.options.stack || 0) * depth : series._i * depth;

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		if (cylindrical) {
			point.shapeType = 'arc3d';
			shapeArgs.x += depth / 2;
			shapeArgs.z = z;
			shapeArgs.start = 0;
			shapeArgs.end = PI * 2;
			shapeArgs.r = depth * 0.95;
			shapeArgs.innerR = 0;
			shapeArgs.depth = shapeArgs.height * (1 / sin((Math.PI / 2) - alpha)) - z;
			shapeArgs.alpha = (Math.PI / 2) - alpha;
			shapeArgs.beta = 0;
			shapeArgs.origin = origin;

		} else {
			point.shapeType = 'cuboid';
			shapeArgs.alpha = cylindrical ? (Math.PI / 2) - alpha : alpha;
			shapeArgs.beta = beta; 
			shapeArgs.z = chart.inverted ? -z : z;
			shapeArgs.origin = origin;
			shapeArgs.depth = depth * 0.75;
		}	
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	var type = this.chart.options.chart.type,
		options = this.chart.options.plotOptions[type];
	
	var stack = (this.options.stack || 0),
		order = this.chart.series.length - this._i;

	var z = this.group.zIndex * 10;

	this.group.attr({zIndex: z});

	proceed.apply(this, [].slice.call(arguments, 1));
});

/*** 
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
***/
var defaultOptions = H.getOptions();
defaultOptions.plotOptions.cylinder = H.merge(defaultOptions.plotOptions.column);
var CylinderSeries = H.extendClass(H.seriesTypes.column, {
	type: 'cylinder'
});
H.seriesTypes.cylinder = CylinderSeries;
/*** 
	EXTENSION FOR 3D PIES
***/

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		depth = options.chart.options3d.depth,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: depth * chart.series.length
		},
		alpha = options.chart.options3d.alpha,
		beta = options.chart.options3d.beta;

	var z = options.plotOptions[type].stacking ? (this.options.stack || 0) * depth : series._i * depth;

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		
		point.shapeArgs.z = z;
		point.shapeArgs.depth = depth * 0.75;
		point.shapeArgs.origin = origin;
		point.shapeArgs.alpha = alpha;
		point.shapeArgs.beta = beta;
	
		var angle = (point.shapeArgs.end + point.shapeArgs.start) / 2;

		var tx = point.slicedTranslation.translateX = Math.round(cos(angle) * series.options.slicedOffset * cos(alpha));
		var ty = point.slicedTranslation.translateY = Math.round(sin(angle) * series.options.slicedOffset * cos(alpha));
	});
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	var series = this;
	proceed.apply(this, [].slice.call(arguments, 1));

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha,
			b1 = shapeArgs.beta,
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
}(Highcharts));
