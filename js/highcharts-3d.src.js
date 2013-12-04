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

var PI = Math.PI;
var sin = Math.sin;
var cos = Math.cos;
var round = Math.round;

//function perspective(points, options) {
function perspective(points, angle1, angle2, origin) {
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
/**
 *	Extension of the Renderer
 */
HR.prototype.createElement3D = function (z) {
	var wrapper = new this.Element();
	wrapper.init(this, 'g');

	wrapper.attr({zIndex : (z || 0)});
	wrapper.children = [];
	wrapper.attrSetters = {};

	wrapper.addChild = function (element) {
		element.add(this);
		this.children.push(element);
		return element;
	};

	wrapper.attr = function (hash, val) {
		if (hash.d) { 
			this.animate(hash);
		} else {
			H.each(this.children, function (child) { child.attr(hash, val); });
		}
		return wrapper;
	};

	wrapper.destroy = function () {
		H.each(this.children, function (child) { child.destroy(); });
		return H.SVGElement.prototype.destroy.apply(this);
	};
	return wrapper;
};

/**** CUBES ****/

HR.prototype.cubeAnimate = function (x, y, z, w, h, d, options, opposite) {
	if (typeof x === 'object') {
		animate = x.animate;
		opposite = x.opposite;
		options = x.options;
		d = x.d;
		h = x.h;
		w = x.w;
		z = x.z;
		y = x.y;
		x = x.x;
	}

	var paths = this.renderer.getCubePath(x, y, z, w, h, d, options, opposite);
	this.front.attr({d: paths.front});
	this.top.attr({d: paths.top});
	this.side.attr({d: paths.side});
};

HR.prototype.cube = function (x, y, z, w, h, d, options, opposite, animate) {
	var result = this.createElement3D();

	result.side = result.addChild(this.path());
	result.top = result.addChild(this.path());
	result.front = result.addChild(this.path());

	this.cubeAnimate.apply(result, [x, y, z, w, h, d, options, opposite]);

	var filler = function (element, value, factor) {
		var v = H.Color(value).brighten(factor).get(); 
		element.attr({stroke: v, 'stroke-width': 1}); 
		return v;
	};

	result.front.attrSetters.fill = function (value, key) { return filler(this, value, 0); };	
	result.top.attrSetters.fill = function (value, key) { return filler(this, value, 0.1); };
	result.side.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };

	if (x.animate || animate) { result.animate = this.cubeAnimate; }

	return result;
};

HR.prototype.getCubePath = function (x, y, z, w, h, d, options, opposite) {
	var pArr = [
		{ x: x, y: y, z: z },
		{ x: x + w, y: y, z: z },
		{ x: x + w, y: y + h, z: z },
		{ x: x, y: y + h, z: z },
		{ x: x, y: y, z: z + d },
		{ x: x + w, y: y, z: z + d },
		{ x: x + w, y: y + h, z: z + d },
		{ x: x, y: y + h, z: z + d }
	];

	pArr = perspective(pArr, options.angle1, options.angle2, options.origin);

	var front = this.toLinePath([pArr[0], pArr[1], pArr[2], pArr[3]], true);
	var side  = (opposite ?
			this.toLinePath([pArr[0], pArr[4], pArr[7], pArr[3]], true) :			// left
			this.toLinePath([pArr[1], pArr[5], pArr[6], pArr[2]], true));			// right
	var top = this.toLinePath([pArr[0], pArr[1], pArr[5], pArr[4]], true);

	return {
		front: front,
		top: top,
		side: side
	};
};

/**** Lines ****/
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

/**** Pie Slices ***/
HR.prototype.arc3dAnimate = function (x, y, a1, d, options) {
	if (typeof x === 'object') {
		options = x.options;
		d = x.d;
		a1 = x.a1;
		y = x.y;
		x = x.x;
	}

	var paths = this.renderer.get3DArcPath(x, y, a1, d, options);

	this.top.attr({d: paths.top});
	this.outer.attr({d: paths.outer});
	this.back.attr({d: paths.back});
	this.side1.attr({d: paths.side1});
	this.side2.attr({d: paths.side2});
};

HR.prototype.arc3d = function (x, y, a1, d, options) {
	var z = (typeof x === 'object' ? x.options.start + x.options.end : options.start + options.end) / 2;
	z = (sin(z) + 1) * 100;

	var result = this.createElement3D(z);

	result.back = result.addChild(this.path());
	result.outer = result.addChild(this.path());
	result.side1 = result.addChild(this.path());
	result.side2 = result.addChild(this.path());
	
	result.top = result.addChild(this.path());
	
	result.attr({zIndex: z});

	this.arc3dAnimate.apply(result, [x, y, a1, d, options]);

	var filler = function (element, value, factor) {
		var v = H.Color(value).brighten(factor).get(); 
		element.attr({stroke: v, 'stroke-width': 1}); 
		return v;
	};
	
	result.top.attrSetters.fill = function (value, key) { return filler(this, value, 0); };
	result.outer.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };
	result.back.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };
	result.side1.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };
	result.side2.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };

	return result;
};

HR.prototype.get3DArcPath = function (x, y, a1, d, options) {
	if (options.start === options.end) {
		return {			
			top: [],
			outer: [],
			back: [],
			side1: [],
			side2: []
		};
	}

	var start = options.start,
		end = options.end - 0.001, // to prevent cos and sin of start and end from becoming equal on 360 arcs (related: #1561)
		longArc = end - start < PI ? 0 : 1,
		// outside ring
		rx1 = options.r,
		ry1 = rx1 * cos(a1),		
		sx1 = x + rx1 * cos(start),
		sy1 = y + ry1 * sin(start),
		ex1 = x + rx1 * cos(end),
		ey1 = y + ry1 * sin(end),
		// inside ring
		rx2 = options.ir,
		ry2 = rx2 * cos(a1),		
		sx2 = x + rx2 * cos(end),
		sy2 = y + ry2 * sin(end),
		ex2 = x + rx2 * cos(start),
		ey2 = y + ry2 * sin(start);

	// Sanity
	if (a1 === 0) { d = 0; }

	// Normalize angles
	start = (start + 4 * Math.PI) % (2 * Math.PI);
	end = (end + 4 * Math.PI) % (2 * Math.PI);

	// Find Quadrant start & end ?	
	var sQ = (Math.floor(start / (Math.PI / 2)) + 1) % 4;
	var eQ = (Math.floor(end / (Math.PI / 2)) + 1) % 4;

	// TOP SIDE
	var top =  [
		'M', sx1, sy1,
		'A', rx1, ry1, 0, longArc, 1, ex1, ey1,
		'L', sx2, sy2,
		'A', rx2, ry2, 0, longArc, 0, ex2, ey2,
		'L', sx1, sy1,
		'Z'
	];

	// OUTER SIDE
	var outer = [];
	var osx, osy, oex, oey,
		la = longArc;

	if ((sQ === 1) || (sQ === 2)) {
		osx = sx1;
		osy = sy1;
	} else {
		osx = x + rx1;		
		osy = y;
	}
	if ((eQ === 1) || (eQ === 2)) {
		oex = ex1;
		oey = ey1;
	} else {
		oex = x - rx1;
		oey = y;
	}

	if (((sQ === 3 || sQ === 0) && (eQ === 1 || eQ === 2)) || 
		((sQ === 2 || sQ === 1) && (eQ === 0 || eQ === 3))) {
		la = 0;
	}

	outer = [ 
		'M', osx, osy,
		'A', rx1, ry1, 0, la, 1, oex, oey,
		'L', oex, oey + d,
		'A', rx1, ry1, 0, la, 0, osx, osy + d,
		'L', osx, osy,
		'Z'
	];
	if (((sQ === 3) || (sQ === 0)) && ((eQ === 3) || (eQ === 0)) && (start < end)) {
		outer = [];
	}

	/*
	if ((sQ === 1 || sQ === 2) && (eQ === 1 || eQ === 2)) {
		outer = [		
		'M', sx1, sy1,
		'A', rx1, ry1, 0, longArc, 1, ex1, ey1,
		'L', ex1, ey1 + d,
		'A', rx1, ry1, 0, longArc, 0, sx1, sy1 + d,
		'L', sx1, sy1,
		'Z'
		];
	}
	if ((sQ === 1 || sQ === 2) && (eQ === 3 || eQ === 0)) {
		outer = [		
		'M', sx1, sy1,
		'A', rx1, ry1, 0, longArc, 1, x - rx1, y,
		'L', x - rx1, y + d,
		'A', rx1, ry1, 0, longArc, 0, sx1, sy1 + d,
		'L', sx1, sy1,
		'Z'
		];
	}

	if ((sQ === 3 || sQ === 0) && (eQ === 1 || eQ === 2)) {
		outer = [		
		'M', x + rx1, y,
		'A', rx1, ry1, 0, 0, 1, ex1, ey1,
		'L', ex1, ey1 + d,
		'A', rx1, ry1, 0, 0, 0, x + rx1, y + d,
		'L', x + rx1, y,
		'Z'
		];		
	}
	if ((sQ === 3 || sQ === 0) && (eQ === 3 || eQ === 0) && (start > end)) {
		outer = [		
		'M', x + rx1, y,
		'A', rx1, ry1, 0, longArc, 1, x - rx1, y,
		'L', x - rx1, y + d,
		'A', rx1, ry1, 0, longArc, 0, x + rx1, y + d,
		'L', x + rx1, y,
		'Z'
		];	
	} 
	*/
	// BACK SIDE
	var back = [];
	if ((sQ === 3 || sQ === 0) && (eQ === 3 || eQ === 0)) {
		
		back = [
		'M', sx2, sy2,
		'A', rx2, ry2, 0, longArc, 0, ex2, ey2,
		'L', ex2, ey2 + d,
		'A', rx2, ry2, 0, longArc, 1, sx2, sy2 + d,
		'L', sx2, sy2,
		'Z'
		];
		
	}

	if ((sQ === 1 && sQ !== 0) && (eQ === 3 || eQ === 0)) {
		back = [
		'M', x - rx2, y,
		'A', rx2, ry2, 0, (longArc ? 0 : 1), 1, sx2, sy2,
		'L', sx2, sy2 + d,
		'A', rx2, ry2, 0, (longArc ? 0 : 1), 0, x - rx2, y + d,
		'L', x - rx2, y,
		'Z'
		];		
	}
	
	if ((sQ === 2 && sQ !== 0) && (eQ === 3 || eQ === 0)) {
		back = [
		'M', x - rx2, y,
		'A', rx2, ry2, 0, longArc, 1, sx2, sy2,
		'L', sx2, sy2 + d,
		'A', rx2, ry2, 0, longArc, 0, x - rx2, y + d,
		'L', x - rx2, y,
		'Z'
		];		
	}

	if ((sQ === 3 || sQ === 0) && (eQ === 1 || eQ === 2)) {
		back = [
		'M', ex2, ey2,
		'A', rx2, ry2, 0, 0, 1, x + rx2, y,
		'L', x + rx2, y + d,
		'A', rx2, ry2, 0, 0, 0, ex2, ey2 + d,
		'L', ex2, ey2,
		'Z'
		];	
	}
	
	// INNER SIDE 1
	var side1 = [];
	if (sQ > 1) {
		side1 = [
		'M', sx1, sy1,
		'L', ex2, ey2,
		'L', ex2, ey2 + d,
		'L', sx1, sy1 + d,
		'Z' 
		];
	}

	// INNER SIDE 2
	var side2 = [];
	
	if (eQ <= 1) {
		side2 = [
		'M', ex1, ey1,
		'L', sx2, sy2,
		'L', sx2, sy2 + d,
		'L', ex1, ey1 + d,
		'Z' 
		];
	}
	
	return {
		top: top,
		outer: outer,
		back: (rx2 === 0 ? [] : back),
		side1: side1,
		side2: side2
	};
};
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
	} // 
	);

	/*
	if (userOptions.yAxis.opposite) {
		userOptions.chart.options3d.angle1 =  -userOptions.chart.options3d.angle1;
	}
	*/
	// Proceed as normal
	proceed.apply(this, [userOptions, callback]);

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
		if (S.visible && !stacks[(stacking ? S.options.stack : S._i) || 0]) {
			result++;
			stacks[(stacking ? S.options.stack : S._i) || 0] = true;
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
	// Set to force a redraw of all elements
	this.isDirtyBox = true;

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
			frameGroup.bottom = renderer.cube(xval, top + height, 0, width + sideSize, bottomSize, depth + backSize, options3d, opposite, true)
				.attr({ fill: fbottom.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.bottom.animate({
				x: xval,
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
		xval = (opposite ? left + width : left - sideSize);

		if (!frameGroup.side) {
			frameGroup.side = renderer.cube(xval, top, 0, sideSize, height, depth + backSize, options3d, opposite, true)
				.attr({ fill: fside.fillColor || '#C0C0C0' }).add(frameGroup);
		} else {
			frameGroup.side.animate({
				x: xval,
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
});/**
 *	Extension for the Axis
 */
H.wrap(HA.prototype, 'render', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var axis = this,
		chart = axis.chart,
		renderer = chart.renderer,
		options = axis.options,
		options3d = chart.options.chart.options3d,
		frame = options3d.frame;

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: chart.getTotalDepth()
	};

	var x1 = this.left,
		y1 = (this.horiz ? this.top + this.height : this.top),
		z1 = 0,
		h = this.height,
		w = this.len,
		d = chart.getTotalDepth();

	if (this.axisLine) {
		var axisLine = this.axisLine;
		var hide = (this.horiz ? options3d.frame.bottom : options3d.frame.side);
		if (hide) {
			axisLine.hide();
		} else {
			var path = axisLine.d.split(' ');
			var pArr = [
			{x: path[1], y: path[2], z: 0},
			{x: path[4], y: path[5], z: 0}
			];
			pArr = perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin);
			path = [
				'M', pArr[0].x, pArr[0].y,
				'L', pArr[1].x, pArr[1].y
				];
			axisLine.attr({d: path});
		}		 
	}

	H.each(axis.tickPositions, function (tickPos) {
		var tick = axis.ticks[tickPos],
		label = tick.label,
		mark = tick.mark;

		if (label) {
			var xy = label.xy,
			labelPos = perspective([{x: xy.x, y: xy.y, z: z1 }], options3d.angle1, options3d.angle2, options3d.origin)[0];

			label.animate({
				x: labelPos.x,
				y: labelPos.y,
				opacity: xy.opacity					
			});
		}

		if (mark) {
			var path = mark.toD || mark.d.split(' '),
			pArr = [ 
			{x: path[1], y: path[2], z: z1 },
			{x: path[4], y: path[5], z: z1 }
			];
			path = chart.renderer.toLinePath(perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin), false);
			mark.animate({d: path, opacity: 1});
		}
	});

	// If there is one, update the first one, the rest will follow automatically.
	if (this.alternateBands[0]) {
		this.alternateBands[0].svgElem.attr({zIndex: 1});
	}
});

H.wrap(HA.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));
	if (path === null) { return path; }

	var chart = this.chart,
		options3d = chart.options.chart.options3d;

	var d = chart.getTotalDepth();

	options3d.origin = {
		x: chart.plotLeft + (chart.plotWidth / 2),
		y: chart.plotTop + (chart.plotHeight / 2),
		z: chart.getTotalDepth()
	};

	var pArr = [
		{ x: path[1], y: path[2], z : (this.horiz || this.opposite ? d : 0)},
		{ x: path[1], y: path[2], z : d },
		{ x: path[4], y: path[5], z : d },
		{ x: path[4], y: path[5], z : (this.horiz || this.opposite ? 0 : d)}
	];

	pArr = perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin);
	path = this.chart.renderer.toLinePath(pArr, false);
	return path;
});

HA.prototype.getPlotBandPath = function (from, to) {
	var toPath = this.getPlotLinePath(to),
		path = this.getPlotLinePath(from);
	if (path && toPath) {
		return [
			'M', path[4], path[5],
			'L', path[7], path[8],
			'L', toPath[7], toPath[8],
			'L', toPath[4], toPath[5],
			'Z'];
	} else { // outside the axis area
		return null;
	}
};/**
 *	Column Extension
 */
H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
	chart = series.chart,
	zPos = chart.getZPosition(series),
	options3d = chart.options.chart.options3d;

	options3d.depth = options3d.depth || 0;

	options3d.origin = { 
		x: chart.plotWidth / 2,
		y: chart.plotHeight / 2,
		z: chart.getTotalDepth()
	};

	H.each(series.data, function (point) {
		point.shapeType = 'cube';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			z: zPos * options3d.depth * 1.3 + (options3d.depth * 0.3),
			w: point.shapeArgs.width,
			h: point.shapeArgs.height,
			d: options3d.depth,
			options: options3d,
			opposite: series.yAxis.opposite,
			animate: true
		};
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	var options = this.chart.options.plotOptions.column,
		nz;

	// Without grouping all stacks are on the front line.
	if (options.grouping !== false) {
		nz = this._i;
	} else {
		nz = this.chart.getZPosition(this) + 1;
	}


	this.group.attr({zIndex: nz}); 
	proceed.apply(this, [].slice.call(arguments, 1));
});
/**
 *	Pies
 */

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
		options3d = series.chart.options.chart.options3d;

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			a1: options3d.angle1,
			d: options3d.depth,
			options: {
				start: point.shapeArgs.start,
				end: point.shapeArgs.end,
				r: point.shapeArgs.r,
				ir: point.shapeArgs.innerR
			}
		};
	});    
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	var series = this;

	H.each(series.data, function (point) {
		var options = point.shapeArgs.options;
		var r = options.r,
			d = point.shapeArgs.d,
			a1 = point.shapeArgs.a1,
			a2 = (options.start + options.end) / 2; 

		if (point.connector) {
			point.connector.translate(0, (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0));
		}
		if (point.dataLabel) {
			point.dataLabel.attr({y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)});
		}
	});
});

}(Highcharts));
