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
function SVGElementCollection() {}
SVGElementCollection.prototype = {
	init: function (renderer) {
		this.element = {};
		this.renderer = renderer;
		this.attrSetters = {};

		this.children = [];
	},

	addChild: function (element) {
		this.children.push(element);
		return element;
	},

	animate: function (params, options, complete) {
		if (params.x !== undefined) {
			this.pathFunction(params);
		} else {
			H.each(this.children, function (child) { child.animate(params, options, complete); });	
		}
		return this;
	},

	attr: function (hash, val) {
		if (hash.x !== undefined) {
			this.pathFunction(hash);
		} else {
			H.each(this.children, function (child) { child.attr(hash, val); });
		}
		return this;
	},

	addClass: function (className) {
		H.each(this.children, function (child) { child.addClass(className); });
		return this;
	},

	symbolAttr: function (hash) {
		H.each(this.children, function (child) { child.symbolAttr(hash); });
		return this;
	},

	clip: function (clipRect) {
		H.each(this.children, function (child) { child.clipRect(clipRect); });
		return this;
	},

	crisp: function (strokeWidth, x, y, width, height) {
		H.each(this.children, function (child) { child.crisp(strokeWidth, x, y, width, height); });
		return this;
	},

	css: function (styles) {
		H.each(this.children, function (child) { child.css(styles); });
		return this;
	},

	on: function (eventType, handler) {
		H.each(this.children, function (child) { child.on(eventType, handler); });
		return this;
	},
	setRadialReference: function (coordinates) {
		H.each(this.children, function (child) { child.setRadialReference(coordinates); });
		return this;
	},

	translate: function (x, y) {
		H.each(this.children, function (child) { child.translate(x, y); });
		return this;
	},

	invert: function () {
		H.each(this.children, function (child) { child.invert(); });
		return this;
	},

	htmlCss: function (styles) {
		H.each(this.children, function (child) { child.htmlCss(styles); });
		return this;
	},

	// TODO 
	htmlGetBBox: function () {
		return null;
	},

	htmlUpdateTransform: function () {
		H.each(this.children, function (child) { child.htmlUpdateTransform(); });
		return this;
	},

	setSpanRotation: function (rotation, alignCorrection, baseline) {
		H.each(this.children, function (child) { child.setSpanRotation(rotation, alignCorrection, baseline); });
		return this;
	},

	getSpanCorrection: function (width, baseline, alignCorrection) {
		H.each(this.children, function (child) { child.getSpanCorrection(width, baseLine, alignCorrection); });
		return this;
	},

	updateTransform: function () {
		H.each(this.children, function (child) { child.updateTransform(); });
		return this;
	},

	toFront: function () {
		H.each(this.children, function (child) { child.toFront(); });
		return this;
	},

	align: function (alignOptions, alignByTranslate, box) {
		H.each(this.children, function (child) { child.align(alignOptions, alignByTranslate, box); });
		return this;
	},

	// TODO
	getBBox: function () {
		return null;
	},

	show: function () {
		H.each(this.children, function (child) { child.show(); });
		return this;
	},

	hide: function () {
		H.each(this.children, function (child) { child.hide(); });
		return this;
	},

	fadeOut: function (duration) {
		H.each(this.children, function (child) { child.fadeOut(); });
		return this;
	},

	add: function (parent) {
		H.each(this.children, function (child) { child.add(parent); });		
		return this;
	},

	safeRemoveChild: function (element) {
		H.each(this.children, function (child) { child.safeRemoveChild(); });
		return this;
	},

	destroy: function () {
		H.each(this.children, function (child) { child.destroy(); });
		return null;
	},

	shadow: function (shadowOptions, group, cutOff) {
		H.each(this.children, function (child) { child.shadow(shadowOptions, group, cutOff); });
		return this;
	}
};

/**** GENERIC 3D OBJECT ****/
HR.prototype.createElement3D = function (pathFunction, params) {
	var result = new SVGElementCollection();
	result.init(this);


	result.front = result.addChild(this.path());
	result.back = result.addChild(this.path());
	result.top = result.addChild(this.path());
	result.bottom = result.addChild(this.path());
	result.left = result.addChild(this.path());
	result.right = result.addChild(this.path());

	var filler = function (element, value, factor) {
		var v = H.Color(value).brighten(factor).get(); 
		element.attr({stroke: v, 'stroke-width': 1}); 
		return v;
	};

	result.front.attrSetters.fill = function (value, key) { return filler(this, value, 0); };
	result.back.attrSetters.fill = function (value, key) { return filler(this, value, 0); };		
	result.top.attrSetters.fill = function (value, key) { return filler(this, value, 0.1); };
	result.bottom.attrSetters.fill = function (value, key) { return filler(this, value, 0.1); };
	result.left.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };
	result.right.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };

	result.pathFunction = function (parameters) {
		var paths = pathFunction(parameters);
		this.front.animate({d: paths.front.d, zIndex: paths.front.z }, false, false);
		this.back.animate({d: paths.back.d, zIndex: paths.back.z }, false, false);
		this.top.animate({d: paths.top.d, zIndex: paths.top.z }, false, false);
		this.bottom.animate({d: paths.bottom.d, zIndex: paths.bottom.z }, false, false);
		this.left.animate({d: paths.left.d, zIndex: paths.left.z }, false, false);
		this.right.animate({d: paths.right.d, zIndex: paths.right.z }, false, false);
		return this;
	};
	result.pathFunction(params);

	return result;
};

/**** CUBES ****/
HR.prototype.cube = function () {
	result = this.createElement3D(this.getCubePath, arguments);
	return result;
};

HR.prototype.getCubePath = function (params) {
	params = params[0] || params;
	var opposite = params.opposite,
		options = params.options,
		d = params.d,
		h = params.height,
		w = params.width,
		z = params.z,
		y = params.y,
		x = params.x;		


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

	var front = HR.prototype.toLinePath([pArr[0], pArr[1], pArr[2], pArr[3]], true);
	var left  = HR.prototype.toLinePath([pArr[0], pArr[4], pArr[7], pArr[3]], true);
	var right = HR.prototype.toLinePath([pArr[1], pArr[5], pArr[6], pArr[2]], true);
	var top = HR.prototype.toLinePath([pArr[0], pArr[1], pArr[5], pArr[4]], true);

	return {
		front: {d: front, z: 2},
		back: {d: [], z: 0 },
		top: {d: top, z: 0},
		bottom: {d: [], z: 0},
		left: {d: opposite ? left : [], z: 0 },
		right: {d: opposite ? [] : right, z: 0 }
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
HR.prototype.arc3d = function (x, y, a1, d, options) {
	return this.createElement3D(this.get3DArcPath, arguments);
};

HR.prototype.get3DArcPath = function (params) {
	params = params[0] || params;
	var	options = params.options;
		d = params.d;
		a1 = params.a1;
		y = params.y;
		x = params.x;

	var deg1 = Math.PI / 360; // small correction to prevent slices to overlap each other

	var start = options.start, //+ 0.005,
		end = options.end - 0.001, // to prevent cos and sin of start and end from becoming equal on 360 arcs (related: #1561)
		longArc = end - start < PI ? 0 : 1,
		// outside ring
		rx1 = options.r,
		ry1 = rx1 * cos(a1),		
		sx1 = x + rx1 * cos(start + (deg1 / 10)),
		sy1 = y + ry1 * sin(start + (deg1 / 10)),
		ex1 = x + rx1 * cos(end - (deg1 / 10)),
		ey1 = y + ry1 * sin(end - (deg1 / 10)),
		// inside ring
		rx2 = Math.max(0.5, options.ir),
		ry2 = rx2 * cos(a1),		
		sx2 = x + rx2 * cos(end - deg1),
		sy2 = y + ry2 * sin(end - deg1),
		ex2 = x + rx2 * cos(start + deg1),
		ey2 = y + ry2 * sin(start + deg1);

	// Sanity
	if (a1 === 0) { d = 0; }

	if (options.start === options.end) {
		return {
			front: {d: [], z: 0},
			back: {d: [], z: 0 },
			top: {d: [], z: 0 },
			bottom: {d: [], z: 0 },
			left: {d: [], z: 0 },
			right: {d: [], z: 0 }
		};
	}
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
	var fsx1 = sx1,
		fsy1 = sy1,
		fex1 = ex1,
		fey1 = ey1,
		tLong = longArc;

	if (eQ === 3 || eQ === 0) {
		fex1 = x - rx1;
		fey1 = y;
		tLong = 0;
	}
	if (sQ === 3 || sQ === 0) {
		fsx1 = x + rx1;
		fsy1 = y;
		tLong = 0;
	}

	var front = [		
		'M', fsx1, fsy1,
		'A', rx1, ry1, 0, tLong, 1, fex1, fey1,
		'L', fex1, fey1 + d,
		'A', rx1, ry1, 0, tLong, 0, fsx1, fsy1 + d,
		'L', fsx1, fsy1,
		'Z'
		];

	if ((eQ === 3 || eQ === 0) && (sQ === 3 || sQ === 0) && (start < end)) {
		front = [];
	}

	if ((eQ === 2 || eQ === 1) && (sQ === 2 || sQ === 1) && (start > end)) {
	front = [	
		'M', sx1, sy1,
		'A', rx1, ry1, 0, 0, 1, x - rx1, y,
		'L', x - rx1, y + d,
		'A', rx1, ry1, 0, 0, 0, sx1, sy1 + d,
		'L', sx1, sy1,
		'M', ex1, ey1,
		'A', rx1, ry1, 0, 0, 0, x + rx1, y,
		'L', x + rx1, y + d,
		'A', rx1, ry1, 0, 0, 1, ex1, ey1 + d,
		'L', ex1, ey1		
		];
	}
	
	// BACK SIDE
	var bsx2 = sx2,
		bsy2 = sy2,
		bex2 = ex2,
		bey2 = ey2;

	if (eQ === 2 || eQ === 1) {
		bsx2 = x + rx2;
		bsy2 = y;
		longArc = 0;
	}
	if (sQ === 2 || sQ === 1) {
		bex2 = x - rx2;
		bey2 = y;
		longArc = 0;
	}

	var back = [
		'M', bsx2, bsy2,
		'A', rx2, ry2, 0, longArc, 0, bex2, bey2,
		'L', bex2, bey2 + d,
		'A', rx2, ry2, 0, longArc, 1, bsx2, bsy2 + d,
		'L', bsx2, bsy2,
		'Z'
		];

	if ((eQ === 2 || eQ === 1) && (sQ === 2 || sQ === 1) && (start < end)) {
		back = [];
	}
	// INNER SIDE 1
	var right = [];
	if (sQ > 1) {
		right = [
		'M', sx1, sy1,
		'L', ex2, ey2,
		'L', ex2, ey2 + d,
		'L', sx1, sy1 + d,
		'Z' 
		];
	}

	// INNER SIDE 2
	var left = [];
	
	if (eQ <= 1) {
		left = [
		'M', ex1, ey1,
		'L', sx2, sy2,
		'L', sx2, sy2 + d,
		'L', ex1, ey1 + d,
		'Z' 
		];
	}

	// Z-INDEX
	var fz = (front.length !== 0 ? 
		(Math.sin(Math.sin((start + end) / 2) + (start > end ? Math.PI : 0))) * 1000 : 0);
	var bz = (back.length !== 0 ? 
		(Math.sin(Math.sin((start + end) / 2) + (start > end ? Math.PI : 0))) * 1000 : 0);

	var lz = (left.length !== 0 ?  sin(Math.min(sin(start), sin(end))) * 1000 : 0);
	var rz = (right.length !== 0 ?  sin(Math.max(sin(start), sin(end))) * 1000 : 0);

	return {
		front: {d: front, z: 1000 + fz },
		back: {d: back, z: 2000 + bz},
		top: {d: top, z: 3000 },
		bottom: {d: [], z: 0 },
		left: {d: left, z: 1000 + lz },
		right: {d: right, z: 1000 + rz }
	};
};
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
			var path = this.getLinePath(this.options.lineWidth);
			var pArr = [
				{x: path[1], y: path[2], z: 0},
				{x: path[4], y: path[5], z: 0}
			];
			pArr = perspective(pArr, options3d.angle1, options3d.angle2, options3d.origin);
			path = [
				'M', pArr[0].x, pArr[0].y,
				'L', pArr[1].x, pArr[1].y
				];
			axisLine.animate({d: path});
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
			var txy = tick.getPosition(axis.horiz, tick.pos, axis.tickmarkOffset, false);
			var path = tick.getMarkPath(txy.x, txy.y, axis.options.tickLength, axis.options.tickWidth, axis.horiz, renderer);
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
		point.shapeArgs.z = zPos * options3d.depth * 1.3 + (options3d.depth * 0.3);
		point.shapeArgs.d = options3d.depth;
		point.shapeArgs.options = options3d;
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	var options = this.chart.options.plotOptions.column,
		nz;

	// Without grouping all stacks are on the front line.
	if (options.grouping !== false) {
		nz = this._i;
	} else {
		nz = this.chart.getZPosition2(this) + 1;		
	}

	this.group.attr({zIndex: nz});

	proceed.apply(this, [].slice.call(arguments, 1));
	
	H.each(this.data, function (point) {
		H.each(point.graphic.children, function (child) {
			child.element.point = point;
		});
	});	

});
/**
 *	Pies
 */

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
		chart = series.chart,
		zPos = chart.getZPosition(series),
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


		var angle = (point.shapeArgs.options.end + point.shapeArgs.options.start) / 2;
		point.slicedTranslation.translateX = Math.round(cos(angle) * cos(options3d.angle1) * series.options.slicedOffset);
		point.slicedTranslation.translateY = Math.round(sin(angle) * cos(-options3d.angle1) * series.options.slicedOffset);

	});    
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	var series = this;
	proceed.apply(this, [].slice.call(arguments, 1));

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

H.wrap(H.seriesTypes.pie.prototype, 'drawPoints', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	var group = this.group;

	H.each(this.data, function (point) {		
		H.each(point.graphic.children, function (child) {
			child.element.point = point;
		});
	});	
});/**
 *	Extension to the VML Renderer
 */

var HV = H.VMLRenderer;

if (HV) {
H.wrap(HC.prototype, 'getZPosition2', function (proceed) {
	var k  = proceed.apply(this, [].slice.call(arguments, 1));
	return (this.getNumberOfStacks() - k - 1);
});

HV.prototype.cube = HR.prototype.cube;
HV.prototype.getCubePath = HR.prototype.getCubePath;

HV.prototype.toLinePath = HR.prototype.toLinePath;

HV.prototype.createElement3D = HR.prototype.createElement3D;

HV.prototype.arc3d = HR.prototype.arc3d;
HV.prototype.get3DArcPath = function (params) {
	params = params[0] || params;
	var	options = params.options;
		d = params.d;
		a1 = params.a1;
		y = params.y;
		x = params.x;

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

	if (options.start === options.end) {
		return {
			front: {d: [], z: 0},
			back: {d: [], z: 0 },
			top: {d: [], z: 0 },
			bottom: {d: [], z: 0 },
			left: {d: [], z: 0 },
			right: {d: [], z: 0 }
		};
	}
	// Normalize angles
	start = (start + 4 * Math.PI) % (2 * Math.PI);
	end = (end + 4 * Math.PI) % (2 * Math.PI);

	// Find Quadrant start & end ?	
	var sQ = (Math.floor(start / (Math.PI / 2)) + 1) % 4;
	var eQ = (Math.floor(end / (Math.PI / 2)) + 1) % 4;

	// TOP SIDE
	var top =  [
		'wa', 
		x - rx1, y - ry1, x + rx1, y + ry1, 
		sx1, sy1, ex1, ey1,
		'at',
		x - rx2, y - ry2, x + rx2, y + ry2,
		sx2, sy2, ex2, ey2
	];

	// OUTER SIDE
	var fsx1 = sx1,
		fsy1 = sy1,
		fex1 = ex1,
		fey1 = ey1;

	if (eQ === 3 || eQ === 0) {
		fex1 = x - rx1;
		fey1 = y;
		longArc = 0;
	}
	if (sQ === 3 || sQ === 0) {
		fsx1 = x + rx1;
		fsy1 = y;
		longArc = 0;
	}

	var front = [		
		'wa', 
		x - rx1, y - ry1, x + rx1, y + ry1,
		fsx1, fsy1, fex1, fey1,
		'at', 
		x - rx1, y - ry1 + d, x + rx1, y + ry1 + d,
		fex1, fey1 + d, fsx1, fsy1 + d
		];

	if ((eQ === 3 || eQ === 0) && (sQ === 3 || sQ === 0)) {
		front = [];
	}
	if ((eQ === 2 || eQ === 1) && (sQ === 2 || sQ === 1) && (start > end)) {
	front = [
		'wa',
		x - rx1, y - ry1, x + rx1, y + ry1,
		sx1, sy1, x - rx1, y,
		'at',
		x - rx1, y - ry1 + d, x + rx1, y + ry1 + d,
		x - rx1, y + d, sx1, sy1 + d,
		'e',
		'at',
		x - rx1, y - ry1, x + rx1, y + ry1,
		ex1, ey1, x + rx1, y,
		'wa',
		x - rx1, y - ry1 + d, x + rx1, y + ry1 + d,
		x + rx1, y + d, ex1, ey1 + d,
		'e'
		];
	}
	// BACK SIDE
	var bsx2 = sx2,
		bsy2 = sy2,
		bex2 = ex2,
		bey2 = ey2;

	if (eQ === 2 || eQ === 1) {
		bsx2 = x + rx2;
		bsy2 = y;
		longArc = 0;
	}
	if (sQ === 2 || sQ === 1) {
		bex2 = x - rx2;
		bey2 = y;
		longArc = 0;
	}

	var back = [
		'at', 
		x - rx2, y - ry2, x + rx2, y + ry2,
		bsx2, bsy2, bex2, bey2,
		'wa', 
		x - rx2, y - ry2 + d, x + rx2, y + ry2 + d,
		bex2, bey2 + d, bsx2, bsy2 + d
		];

	if ((eQ === 2 || eQ === 1) && (sQ === 2 || sQ === 1) && (start < end)) {
		back = [];
	}
	// INNER SIDE 1
	var right = [];
	if (sQ > 1) {
		right = [
		'M', sx1, sy1,
		'L', ex2, ey2,
		'L', ex2, ey2 + d,
		'L', sx1, sy1 + d,
		'Z' 
		];
	}

	// INNER SIDE 2
	var left = [];
	
	if (eQ <= 1) {
		left = [
		'M', ex1, ey1,
		'L', sx2, sy2,
		'L', sx2, sy2 + d,
		'L', ex1, ey1 + d,
		'Z' 
		];
	}

	var zCorr = Math.sin((start + end) / 2) * 100;
	if (start > end) {
		zCorr = 0;
	}

	return {
		front: {d: front, z: 100 + zCorr},
		back: {d: back, z: 100 + zCorr },
		top: {d: top, z: 200 + zCorr },
		bottom: {d: [], z: zCorr },
		left: {d: left, z: zCorr },
		right: {d: right, z: zCorr }
	};
};


}
}(Highcharts));
