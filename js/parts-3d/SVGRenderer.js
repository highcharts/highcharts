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

HR.prototype.cubeAnimate = function(x, y, z, w, h, d, options, opposite) {
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
	this.front.attr({d: paths.front, });
	this.top.attr({d: paths.top});
	this.side.attr({d: paths.side});	
}


HR.prototype.cube = function(x, y, z, w, h, d, options, opposite, animate) {
	var result = this.createElement3D();

	result.side = this.path().add(result);
	result.top = this.path().add(result);
	result.front = this.path().add(result);

	result.children.push(result.front);
	result.children.push(result.side);
	result.children.push(result.top);

	this.cubeAnimate.apply(result, [x, y, z, w, h, d, options, opposite]);

	var filler = function(element, value, factor) {
		var v = H.Color(value).brighten(factor).get(); 
		element.attr({stroke: v, 'stroke-width': 1}); 
		return v;
	}
	result.front.attrSetters.fill = function (value, key) { return filler(this,value,0); }	
	result.top.attrSetters.fill = function (value, key) { return filler(this,value,0.1); }
	result.side.attrSetters.fill = function (value, key) { return filler(this,value,-0.1); }

	if (x.animate || animate) { result.animate = this.cubeAnimate; }

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
		'Z'
	];

	// top
	var top = [
		'M', pArr[0].x, pArr[0].y,  
		'L', pArr[1].x, pArr[1].y, 
		'L', pArr[5].x, pArr[5].y,
		'L', pArr[4].x, pArr[4].y, 
		'Z'
	];

	// side (left or right depending on axis orientation)
	var left = [
		'M', pArr[0].x, pArr[0].y,  
		'L', pArr[4].x, pArr[4].y, 
		'L', pArr[7].x, pArr[7].y,
		'L', pArr[3].x, pArr[3].y, 
		'Z'
	];

	var right = [
		'M', pArr[5].x, pArr[5].y,  
		'L', pArr[1].x, pArr[1].y, 
		'L', pArr[2].x, pArr[2].y,
		'L', pArr[6].x, pArr[6].y, 
		'Z'
	];
	return {
		front: front,
		top: top,
		side: (opposite ? left : right)
	};
}
