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
		H.each(this.children, function (child) { child.attr(hash, val); });
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
	var top = this.toLinePath([pArr[0], pArr[1], pArr[5], pArr[4]], true);
	var left = this.toLinePath([pArr[0], pArr[4], pArr[7], pArr[3]], true);
	var right = this.toLinePath([pArr[5], pArr[1], pArr[2], pArr[6]], true);

	return {
		front: front,
		top: top,
		side: (opposite ? left : right)
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
		'A', rx1, ry1, 0, (longArc ? 0 : 1), 1, ex1, ey1,
		'L', ex1, ey1 + d,
		'A', rx1, ry1, 0, (longArc ? 0 : 1), 0, x + rx1, y + d,
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
	if ((sQ < 3 && sQ !== 0) && (eQ === 3 || eQ === 0)) {
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
		'A', rx2, ry2, 0, (longArc ? 0 : 1), 1, x + rx2, y,
		'L', x + rx2, y + d,
		'A', rx2, ry2, 0, (longArc ? 0 : 1), 0, ex2, ey2 + d,
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
		back: back,
		side1: side1,
		side2: side2
	};
};
