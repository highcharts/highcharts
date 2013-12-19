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

	var i = params[0].i * 10;

	result.pathFunction = function (parameters) {
		var paths = pathFunction(parameters);
		this.front.animate({d: paths.front.d, zIndex: i + paths.front.z }, false, false);
		this.back.animate({d: paths.back.d, zIndex: i + paths.back.z }, false, false);
		this.top.animate({d: paths.top.d, zIndex: i + paths.top.z }, false, false);
		this.bottom.animate({d: paths.bottom.d, zIndex: i + paths.bottom.z }, false, false);
		this.left.animate({d: paths.left.d, zIndex: i + paths.left.z }, false, false);
		this.right.animate({d: paths.right.d, zIndex: i + paths.right.z }, false, false);
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
		'M', fsx1, fsy1,
		'A', rx1, ry1, 0, longArc, 1, fex1, fey1,
		'L', fex1, fey1 + d,
		'A', rx1, ry1, 0, longArc, 0, fsx1, fsy1 + d,
		'L', fsx1, fsy1,
		'Z'
		];

	if ((eQ === 3 || eQ === 0) && (sQ === 3 || sQ === 0)) {
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

	var zCorr = Math.sin((start + end) / 2);
	if (start > end) {
		zCorr = 0;
	}

	return {
		front: {d: front, z: 2},
		back: {d: back, z: 2 },
		top: {d: top, z: 3 },
		bottom: {d: [], z: 0 },
		left: {d: left, z: 1 },
		right: {d: right, z: 1 }
	};
};
