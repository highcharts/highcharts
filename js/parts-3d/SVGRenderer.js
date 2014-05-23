/*** 
	EXTENSION TO THE SVG-RENDERER TO ENABLE 3D SHAPES
	***/
////// HELPER METHODS //////
var dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);

function curveTo(cx, cy, rx, ry, start, end, dx, dy) {
	var result = [];
	if ((end > start) && (end - start > PI / 2 + 0.0001)) {
		result = result.concat(curveTo(cx, cy, rx, ry, start, start + (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start + (PI / 2), end, dx, dy));
		return result;
	} else if ((end < start) && (start - end > PI / 2 + 0.0001)) {			
		result = result.concat(curveTo(cx, cy, rx, ry, start, start - (PI / 2), dx, dy));
		result = result.concat(curveTo(cx, cy, rx, ry, start - (PI / 2), end, dx, dy));
		return result;
	} else {
		var arcAngle = end - start;
		return [
			'C', 
			cx + (rx * cos(start)) - ((rx * dFactor * arcAngle) * sin(start)) + dx,
			cy + (ry * sin(start)) + ((ry * dFactor * arcAngle) * cos(start)) + dy,
			cx + (rx * cos(end)) + ((rx * dFactor * arcAngle) * sin(end)) + dx,
			cy + (ry * sin(end)) - ((ry * dFactor * arcAngle) * cos(end)) + dy,

			cx + (rx * cos(end)) + dx,
			cy + (ry * sin(end)) + dy
		];
	}
}

Highcharts.SVGRenderer.prototype.toLinePath = function (points, closed) {
	var result = [];

	// Put "L x y" for each point
	Highcharts.each(points, function (point) {
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

////// CUBOIDS //////
Highcharts.SVGRenderer.prototype.cuboid = function (shapeArgs) {

	var result = this.g(),
	paths = this.cuboidPath(shapeArgs);

	result.front = this.path(paths[0]).attr({zIndex: paths[3], 'stroke-linejoin': 'round'}).add(result);
	result.top = this.path(paths[1]).attr({zIndex: paths[4], 'stroke-linejoin': 'round'}).add(result);
	result.side = this.path(paths[2]).attr({zIndex: paths[5], 'stroke-linejoin': 'round'}).add(result);

	result.fillSetter = function (color) {
		var c0 = color,
		c1 = Highcharts.Color(color).brighten(0.1).get(),
		c2 = Highcharts.Color(color).brighten(-0.1).get();

		this.front.attr({fill: c0});
		this.top.attr({fill: c1});
		this.side.attr({fill: c2});

		this.color = color;
		return this;
	};

	result.opacitySetter = function (opacity) {
		this.front.attr({opacity: opacity});
		this.top.attr({opacity: opacity});
		this.side.attr({opacity: opacity});
		return this;
	};

	result.attr = function (args) {
		if (args.shapeArgs || args.x) {
			var shapeArgs = args.shapeArgs || args;
			var paths = this.renderer.cuboidPath(shapeArgs);
			this.front.attr({d: paths[0], zIndex: paths[3]});
			this.top.attr({d: paths[1], zIndex: paths[4]});
			this.side.attr({d: paths[2], zIndex: paths[5]});			
		} else {
			Highcharts.SVGElement.prototype.attr.call(this, args);
		}

		return this;
	};
	
	result.animate = function (args, duration, complete) {
		if (args.x && args.y) {
			var paths = this.renderer.cuboidPath(args);
			this.front.attr({zIndex: paths[3]}).animate({d: paths[0]}, duration, complete);
			this.top.attr({zIndex: paths[4]}).animate({d: paths[1]}, duration, complete);
			this.side.attr({zIndex: paths[5]}).animate({d: paths[2]}, duration, complete);
		} else if (args.opacity) {				
				this.front.animate(args, duration, complete);
				this.top.animate(args, duration, complete);
				this.side.animate(args, duration, complete);
		} else {
			Highcharts.SVGElement.prototype.animate.call(this, args, duration, complete);
		}
		return this;
	};

	result.destroy = function () {
		this.front.destroy();
		this.top.destroy();
		this.side.destroy();

		return null;
	};

	// Apply the Z index to the cuboid group
	result.attr({ zIndex: -paths[3] });

	return result;
};


Highcharts.SVGRenderer.prototype.cuboidPath = function (shapeArgs) {
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

	var path1, // FRONT
		path2, // TOP OR BOTTOM
		path3; // LEFT OR RIGHT

	// front	
	path1 = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];
	var z1 = (pArr[0].z + pArr[1].z + pArr[2].z + pArr[3].z) / 4;

	// top or bottom
	var top = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[7].x, pArr[7].y,
	'L', pArr[6].x, pArr[6].y,
	'L', pArr[1].x, pArr[1].y,
	'Z'
	];
	var bottom = [
	'M', pArr[3].x, pArr[3].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[4].x, pArr[4].y,
	'Z'
	];
	if (pArr[7].y < pArr[1].y) {
		path2 = top;
	} else if (pArr[4].y > pArr[2].y) {
		path2 = bottom;
	} else {
		path2 = [];
	}
	var z2 = (beta > 0 ? (pArr[0].z + pArr[7].z + pArr[6].z + pArr[1].z) / 4 : (pArr[3].z + pArr[2].z + pArr[5].z + pArr[4].z) / 4);

	// side
	var right = [
	'M', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[6].x, pArr[6].y,
	'Z'
	];
	var left = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[7].x, pArr[7].y,
	'L', pArr[4].x, pArr[4].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];	
	if (pArr[6].x > pArr[1].x) {
		path3 = right;
	} else if (pArr[7].x < pArr[0].x) {
		path3 = left;
	} else {
		path3 = [];
	}
	var z3 = (alpha > 0 ? (pArr[1].z + pArr[2].z + pArr[5].z + pArr[6].z) / 4 : (pArr[0].z + pArr[7].z + pArr[4].z + pArr[3].z) / 4);

	return [path1, path2, path3, z1, z2, z3];
};

////// SECTORS //////
Highcharts.SVGRenderer.prototype.arc3d = function (shapeArgs) {

	shapeArgs.alpha *= deg2rad;
	shapeArgs.beta *= deg2rad;
	var result = this.g(),
		paths = this.arc3dPath(shapeArgs),
		renderer = result.renderer;

	var zIndex = paths.zTop * 100;

	result.shapeArgs = shapeArgs;	// Store for later use

	result.top = renderer.path(paths.top).attr({zIndex: paths.zTop}).add(result);
	result.side1 = renderer.path(paths.side2).attr({zIndex: paths.zSide2});
	result.side2 = renderer.path(paths.side1).attr({zIndex: paths.zSide1});
	result.inn = renderer.path(paths.inn).attr({zIndex: paths.zInn});
	result.out = renderer.path(paths.out).attr({zIndex: paths.zOut});

	result.fillSetter = function (color) {
		this.color = color;

		var c0 = color,
		c2 = Highcharts.Color(color).brighten(-0.1).get();
		
		this.side1.attr({fill: c2});
		this.side2.attr({fill: c2});
		this.inn.attr({fill: c2});
		this.out.attr({fill: c2});
		this.top.attr({fill: c0});
		return this;
	};
	
	result.translateXSetter = function (value) {
		this.out.attr({translateX: value});
		this.inn.attr({translateX: value});
		this.side1.attr({translateX: value});
		this.side2.attr({translateX: value});
		this.top.attr({translateX: value});
	};
	
	result.translateYSetter = function (value) {
		this.out.attr({translateY: value});
		this.inn.attr({translateY: value});
		this.side1.attr({translateY: value});
		this.side2.attr({translateY: value});
		this.top.attr({translateY: value});
	};

	result.animate = function (args, duration, complete) {	
		Highcharts.SVGElement.prototype.animate.call(this, args, duration, complete);
		if (args.x && args.y) {
			// Recreate
			var result = this,
				renderer = this.renderer,
				shapeArgs = Highcharts.splat(args)[0];

			shapeArgs.alpha *= deg2rad;
			shapeArgs.beta *= deg2rad;

			var paths = renderer.arc3dPath(shapeArgs);

			result.shapeArgs = shapeArgs;	// Store for later use

			result.inn.attr({d: paths.inn, zIndex: paths.zInn});
			result.out.attr({d: paths.out, zIndex: paths.zOut});
			result.side1.attr({d: paths.side1, zIndex: paths.zSide2});
			result.side2.attr({d: paths.side2, zIndex: paths.zSide1});
			result.top.attr({d: paths.top, zIndex: paths.zTop});

			result.attr({fill: result.color});
			result.attr({zIndex: paths.zTop * 100});
		}		
		return this;
	};

	result.zIndex = zIndex;
	result.attr({zIndex: zIndex});
	return result;
};


Highcharts.SVGRenderer.prototype.arc3dPath = function (shapeArgs) {
	var cx = shapeArgs.x,
		cy = shapeArgs.y,
		start = shapeArgs.start,
		end = shapeArgs.end - 0.00001,
		r = shapeArgs.r,
		ir = shapeArgs.innerR,
		d = shapeArgs.depth,
		alpha = shapeArgs.alpha,
		beta = shapeArgs.beta;

	// Some Variables
	var cs = cos(start),
		ss = sin(start),
		ce = cos(end),
		se = sin(end),
		rx = r * cos(beta),
		ry = r * cos(alpha),
		irx = ir * cos(beta),
		iry = ir * cos(alpha),
		dx = d * sin(beta),
		dy = d * sin(alpha);

	// TOP	
	var top = ['M', cx + (rx * cs), cy + (ry * ss)];
	top = top.concat(curveTo(cx, cy, rx, ry, start, end, 0, 0));
	top = top.concat([
		'L', cx + (irx * ce), cy + (iry * se)
	]);
	top = top.concat(curveTo(cx, cy, irx, iry, end, start, 0, 0));
	top = top.concat(['Z']);

	// OUTSIDE
	var b = (beta > 0 ? PI / 2 : 0),
		a = (alpha > 0 ? 0 : PI / 2);

	var start2 = start > -b ? start : (end > -b ? -b : start),
		end2 = end < PI - a ? end : (start < PI - a ? PI - a : end);
	
	var out = ['M', cx + (rx * cos(start2)), cy + (ry * sin(start2))];
	out = out.concat(curveTo(cx, cy, rx, ry, start2, end2, 0, 0));
	out = out.concat([
		'L', cx + (rx * cos(end2)) + dx, cy + (ry * sin(end2)) + dy
	]);
	out = out.concat(curveTo(cx, cy, rx, ry, end2, start2, dx, dy));
	out = out.concat(['Z']);

	// INSIDE
	var inn = ['M', cx + (irx * cs), cy + (iry * ss)];
	inn = inn.concat(curveTo(cx, cy, irx, iry, start, end, 0, 0));
	inn = inn.concat([
		'L', cx + (irx * cos(end)) + dx, cy + (iry * sin(end)) + dy
	]);
	inn = inn.concat(curveTo(cx, cy, irx, iry, end, start, dx, dy));
	inn = inn.concat(['Z']);

	// SIDES
	var side1 = [
		'M', cx + (rx * cs), cy + (ry * ss),
		'L', cx + (rx * cs) + dx, cy + (ry * ss) + dy,
		'L', cx + (irx * cs) + dx, cy + (iry * ss) + dy,
		'L', cx + (irx * cs), cy + (iry * ss),
		'Z'
	];
	var side2 = [
		'M', cx + (rx * ce), cy + (ry * se),
		'L', cx + (rx * ce) + dx, cy + (ry * se) + dy,
		'L', cx + (irx * ce) + dx, cy + (iry * se) + dy,
		'L', cx + (irx * ce), cy + (iry * se),
		'Z'
	];

	var mr = ir + ((r - ir) / 2),
		Ks = ((sin(beta) * cos(start)) + (sin(-alpha) * sin(-start))),
		Ke = ((sin(beta) * cos(end)) + (sin(-alpha) * sin(-end)));

	var zOut = Math.max(Ke, Ks) * r,
		zInn = Ke * ir,
		zSide1 = Ks * mr,
		zSide2 =  Ke * mr,
		zTop = Math.max(zOut, zInn, zSide1, zSide2) + 25;

	return {
		top: top,
		zTop: zTop,
		out: out,
		zOut: zOut,
		inn: inn,
		zInn: zInn,
		side1: side1,
		zSide1: zSide1,
		side2: side2,
		zSide2: zSide2
	};
};
