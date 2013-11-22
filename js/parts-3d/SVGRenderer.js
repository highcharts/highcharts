/**
 *	Extension of the Renderer
 */

HR.prototype.createElement3D = function () {
	var wrapper = new this.Element();
	wrapper.init(this, 'g');

	wrapper.children = [];
	wrapper.attrSetters = {};

	wrapper.attr = function (hash, val) {
		H.each(this.children, function (child) { child.attr(hash, val); });
		return wrapper;
	}

	wrapper.destroy = function () {
		H.each(this.children, function (child) { child.destroy(); });
		return H.SVGElement.prototype.destroy.apply(this);
	}
	return wrapper;
}

HR.prototype.cube = function(x, y, z, w, h, d, options, opposite) {
	var result = this.createElement3D();

	var paths = this.getCubePath(x, y, z, w, h, d, options, opposite);

	result.top = this.path(paths.top).add(result);
	result.children.push(result.top);

	result.side = this.path(paths.side).add(result);
	result.children.push(result.side);

	result.front = this.path(paths.front).add(result);
	result.children.push(result.front);

	result.side.attrSetters.fill = function (value, key) { return H.Color(value).brighten(-0.1).get(); }
	result.top.attrSetters.fill = function (value, key) { return H.Color(value).brighten(0.1).get(); }

	return result;
}

HR.prototype.cube2 = function(x, y, z, w, h, d, options, opposite) {
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

	var result = this.createElement3D();

	var paths = this.getCubePath(x, y, z, w, h, d, options, opposite);

	result.top = this.path(paths.top).add(result);
	result.children.push(result.top);

	result.side = this.path(paths.side).add(result);
	result.children.push(result.side);

	result.front = this.path(paths.front).add(result);
	result.children.push(result.front);

	result.side.attrSetters.fill = function (value, key) { return H.Color(value).brighten(-0.1).get(); }
	result.top.attrSetters.fill = function (value, key) { return H.Color(value).brighten(0.1).get(); }

	result.animate = function (x) {
		opposite = x.opposite;
		options = x.options;
			d = x.d;
		h = x.h;
		w = x.w;
		z = x.z;
		y = x.y;
		x = x.x;
		var paths = this.renderer.getCubePath(x, y, z, w, h, d, options, opposite);
		this.front.attr({d: paths.front});
		this.top.attr({d: paths.top});
		this.side.attr({d: paths.side});
	}
	return result;
}

HR.prototype.getCubePath = function(x, y, z, w, h, d, options, opposite) {
	var pArr = [
		{ x: x,		y: y,		z: z		},
		{ x: x + w, y: y,		z: z		},
		{ x: x + w,	y: y + h, 	z: z		},
		{ x: x,		y: y + h, 	z: z 		},
		{ x: x,		y: y,		z: z + d 	},
		{ x: x + w,	y: y,		z: z + d 	},
		{ x: x + w,	y: y + h,	z: z + d 	},
		{ x: x, 	y: y + h,	z: z + d 	}
	];

	pArr = perspective(pArr, options);

	// front
	var front = [
		'M', pArr[0].x, pArr[0].y,  
		'L', pArr[1].x, pArr[1].y, 
		'L', pArr[2].x, pArr[2].y,
		'L', pArr[3].x, pArr[3].y, 
		'Z'];

	// top
	var top = [
		'M', pArr[0].x, pArr[0].y,  
		'L', pArr[1].x, pArr[1].y, 
		'L', pArr[5].x, pArr[5].y,
		'L', pArr[4].x, pArr[4].y, 
		'Z'];

	// side (left or right depending on axis orientation)
	var side = opposite ? 
		[ // left
		 'M', pArr[0].x, pArr[0].y,  
		 'L', pArr[4].x, pArr[4].y, 
		 'L', pArr[7].x, pArr[7].y,
		 'L', pArr[3].x, pArr[3].y, 
		 'Z'
		] : [ // right
		 'M', pArr[5].x, pArr[5].y,  
		 'L', pArr[1].x, pArr[1].y, 
		 'L', pArr[2].x, pArr[2].y,
		 'L', pArr[6].x, pArr[6].y, 
		 'Z'
		];

	return {
		front: front,
		top: top,
		side: side
	};
}
