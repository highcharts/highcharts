/**
 *	Extension of the Renderer
 */
HR.prototype.createElement3D = function (z) {
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
		options = x.options,
		d = x.d;
		a1 = x.a1;
		y = x.y;
		x = x.x;
	}

	var paths = this.renderer.get3DArcPath(x, y, a1, d, options);

	this.top.attr({d: paths.top});
	this.front.attr({d: paths.front});
}

HR.prototype.arc3d = function (x, y, a1, d, options) {
	var result = this.createElement3D();


	result.top = result.addChild(this.path());
	result.front = result.addChild(this.path());

	this.arc3dAnimate.apply(result, [x, y, a1, d, options]);

	var filler = function (element, value, factor) {
		var v = H.Color(value).brighten(factor).get(); 
		element.attr({stroke: v, 'stroke-width': 1}); 
		return v;
	};

	result.front.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };	
	result.top.attrSetters.fill = function (value, key) { return filler(this, value, 0); };
	//result.side.attrSetters.fill = function (value, key) { return filler(this, value, -0.1); };

	return result;
}

HR.prototype.get3DArcPath = function (x, y, a1, d, options) {
	var start = options.start,
		rx = options.r || w || h,
		ry = rx * cos(a1);
		end = options.end - 0.001, // to prevent cos and sin of start and end from becoming equal on 360 arcs (related: #1561)
		
		sx = x + rx * cos(start);
		sy = y + ry * sin(start);
		ex = x + rx * cos(end);
		ey = y + ry * sin(end);

		longArc = end - start < PI ? 0 : 1;

	// Normalize angles
	start = (start + 4 * Math.PI) % (2 * Math.PI);
	end = (end + 4 * Math.PI) % (2 * Math.PI);

	// Find Quadrant start & end ?	
	var sQ = (Math.floor(start / (Math.PI / 2)) + 1) % 4;
	var eQ = (Math.floor(end / (Math.PI / 2)) + 1) % 4;

	// TOP SIDE
	var top =  [
		'M', sx, sy,
		'A', rx, ry, 0, longArc, 1, ex, ey,
		'L', x, y,
		'L', sx, sy,
		'Z'
	]

	// FRONT SIDE
	var front = [];
	if ((sQ == 1 || sQ == 2) && (eQ == 1 || eQ == 2)) {
		front = [		
		'M', sx, sy,
		'A', rx, ry, 0, longArc, 1, ex, ey,
		'L', ex, ey + d,
		'A', rx, ry, 0, longArc, 0, sx, sy + d,
		'L', sx, sy,
		'Z'
		];
	}
	if ((sQ == 1 || sQ == 2) && eQ > 2) {
		front = [		
		'M', sx, sy,
		'A', rx, ry, 0, longArc, 1, x - rx, y,
		'L', x - rx, y + d,
		'A', rx, ry, 0, longArc, 0, sx, sy + d,
		'L', sx, sy,
		'Z'
		];
	}

	if ((sQ == 0 || sQ == 3) && (eQ == 2 || eQ == 1)) {
		front = [		
		'M', x + rx, y,
		'A', rx, ry, 0, longArc, 1, ex, ey,
		'L', ex, ey + d,
		'A', rx, ry, 0, longArc, 0, x + rx, y + d,
		'L', x + rx, y,
		'Z'
		];		
	}
	return {
		top: top,
		front: front,
	};
}