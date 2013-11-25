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
