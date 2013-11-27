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
	return val * Math.PI / 180; 
};

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
HR.prototype.createElement3D = function () {
	var wrapper = new this.Element();
	wrapper.init(this, 'g');

	wrapper.children = [];
	wrapper.attrSetters = {};

	wrapper.addChild = function (element) {
		element.add(this);
		this.children.push(element);
		return element;
	};

	wrapper.attr = function (hash, val) {
		H.each(this.children, function (child) { child.attr(hash, val); });
		return wrapper;
	};

	wrapper.destroy = function () {
		H.each(this.children, function (child) { child.destroy(); });
		return H.SVGElement.prototype.destroy.apply(this);
	};
	return wrapper;
};

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
	var top = this.toLinePath([pArr[0], pArr[1], pArr[5], pArr[4]], true);
	var left = this.toLinePath([pArr[0], pArr[4], pArr[7], pArr[3]], true);
	var right = this.toLinePath([pArr[5], pArr[1], pArr[2], pArr[6]], true);

	return {
		front: front,
		top: top,
		side: (opposite ? left : right)
	};
};

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

	if (userOptions.yAxis.opposite) {
		userOptions.chart.options3d.angle1 =  -userOptions.chart.options3d.angle1;
	}

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

}(Highcharts));
