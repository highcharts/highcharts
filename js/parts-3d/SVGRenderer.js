/*** 
	EXTENSION TO THE SVG-RENDERER TO ENABLE 3D SHAPES
	***/

////// CUBOIDS //////
HR.prototype.cuboid = function (shapeArgs) {

	var result = this.g(),
	paths = this.cuboidPath(shapeArgs);

	result.front = this.path(paths[0]).attr({zIndex: paths[3]}).add(result);
	result.top = this.path(paths[1]).attr({zIndex: paths[4]}).add(result);
	result.side = this.path(paths[2]).attr({zIndex: paths[5]}).add(result);

	result.attrSetters.fill = function (color) {
		var c0 = color,
		c1 = H.Color(color).brighten(0.1).get(),
		c2 = H.Color(color).brighten(-0.1).get();

		this.front.attr({fill: c0});
		this.top.attr({fill: c1});
		this.side.attr({fill: c2});

		return this;
	};

	result.animate = function (shapeArgs) {
		var renderer = this.renderer,
		paths = renderer.cuboidPath(shapeArgs);

		this.front.attr({d: paths[0]});
		this.top.attr({d: paths[1]});
		this.side.attr({d: paths[2]});

		return this;
	};
	return result;
};


HR.prototype.cuboidPath = function (shapeArgs) {
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

	// front
	var path1 = [
	'M', pArr[0].x, pArr[0].y,
	'L', pArr[1].x, pArr[1].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[3].x, pArr[3].y,
	'Z'
	];
	var z1 = (pArr[0].z + pArr[1].z + pArr[2].z + pArr[3].z) / 4;

	// top or bottom
	var path2 = (beta > 0 ? 
		[
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[7].x, pArr[7].y,
		'L', pArr[6].x, pArr[6].y,
		'L', pArr[1].x, pArr[1].y,
		'Z'
		] :
	// bottom
	[
	'M', pArr[3].x, pArr[3].y,
	'L', pArr[2].x, pArr[2].y,
	'L', pArr[5].x, pArr[5].y,
	'L', pArr[4].x, pArr[4].y,
	'Z'
	]);
	var z2 = (beta > 0 ? (pArr[0].z + pArr[7].z + pArr[6].z + pArr[1].z) / 4 : (pArr[3].z + pArr[2].z + pArr[5].z + pArr[4].z) / 4);

	// side
	var path3 = (alpha > 0 ? 
		[
		'M', pArr[1].x, pArr[1].y,
		'L', pArr[2].x, pArr[2].y,
		'L', pArr[5].x, pArr[5].y,
		'L', pArr[6].x, pArr[6].y,
		'Z'
		] : 
		[
		'M', pArr[0].x, pArr[0].y,
		'L', pArr[7].x, pArr[7].y,
		'L', pArr[4].x, pArr[4].y,
		'L', pArr[3].x, pArr[3].y,
		'Z'
		]);
	var z3 = (alpha > 0 ? (pArr[1].z + pArr[2].z + pArr[5].z + pArr[6].z) / 4 : (pArr[0].z + pArr[7].z + pArr[4].z + pArr[3].z) / 4);

	return [path1, path2, path3, z1, z2, z3];
};

////// SECTORS //////
HR.prototype.arc3d = function (shapeArgs) {

	var result = this.g(),
	paths = this.arc3dPath(shapeArgs),
	renderer = result.renderer;

	var zIndex = paths[4] * 100;

	result.ins = [];
	H.each(paths[3], function (path) {
		result.ins.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.outs = [];
	H.each(paths[1], function (path) {
		result.outs.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.sides = [];
	H.each(paths[2], function (path) {
		result.sides.push(renderer.path(path).attr({zIndex: zIndex}).add(result));
	});
	result.tops = [];
	H.each(paths[0], function (path) {
		result.tops.push(renderer.path(path).attr({zIndex: zIndex + 1}).add(result));
	});

	result.attrSetters.fill = function (color) {
		var c0 = color,
		c2 = H.Color(color).brighten(-0.1).get();

		H.each(this.outs, function (out) {
			out.attr({fill: c2}).css({stroke: c2});
		});				
		H.each(this.ins, function (inn) {
			inn.attr({fill: c2}).css({stroke: c2});
		});	
		H.each(this.sides, function (side) {
			side.attr({fill: c2}).css({stroke: c2});
		});
		H.each(this.tops, function (top) {
			top.attr({fill: c0}).css({stroke: c0});
		});
		return this;
	};
	
	result.attrSetters['stroke-width'] = function () {
		// Force all to 0		
		return 0;
	};
	
	result.animate = function (args) {
		if (args.translateX !== undefined && args.translateY !== undefined) {
			this.translate(args.translateX, args.translateY);

		}
		return this;
	};
	result.slice = function (shapeArgs) {
		console.log('slice ?');
		return this;
	};

	result.attr({zIndex: zIndex});
	return result;
};


HR.prototype.arc3dPath = function (shapeArgs) {
	var topPaths = [],
	outPaths = [],
	sidePaths = [],
	inPaths = [];

	var x = shapeArgs.x,
	y = shapeArgs.y,
	z = shapeArgs.z,
	start = shapeArgs.start,
	end = shapeArgs.end - 0.00001,
	r = shapeArgs.r,
	ir = shapeArgs.innerR,
	d = shapeArgs.depth,
	alpha = shapeArgs.alpha,
	beta = shapeArgs.beta,
	origin = shapeArgs.origin;

	// 2PI Correction
	start = start % (2 * PI);
	end = end % (2 * PI);

	var arcAngle = end - start,
	p1, 
	p2;

	if (arcAngle > PI / 2) {		
		p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: start + (PI / 2), r: r, innerR: ir, alpha: alpha, beta: beta});
		p2 = this.arc3dPath({x: x, y: y, depth: d, start: start + (PI / 2) + 0.00001, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

		topPaths = topPaths.concat(p1[0]);
		topPaths = topPaths.concat(p2[0]);

		outPaths = outPaths.concat(p1[1]);
		outPaths = outPaths.concat(p2[1]);	 

		sidePaths = sidePaths.concat(p1[2]);
		sidePaths = sidePaths.concat(p2[2]);   

		inPaths = inPaths.concat(p1[3]);
		inPaths = inPaths.concat(p2[3]);
	} else {
		// -PI -> PI
		start = (start > PI ? start - (2 * PI) : start);
		end = (end > PI ? end - (2 * PI) : end);

		if (start < 0 && end > 0) {	   
			p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: 0, r: r, innerR: ir, alpha: alpha, beta: beta});
			p2 = this.arc3dPath({x: x, y: y, depth: d, start: 0, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

			topPaths = topPaths.concat(p1[0]);
			topPaths = topPaths.concat(p2[0]);   

			outPaths = outPaths.concat(p1[1]);
			outPaths = outPaths.concat(p2[1]);	 

			sidePaths = sidePaths.concat(p1[2]);
			sidePaths = sidePaths.concat(p2[2]);   

			inPaths = inPaths.concat(p1[3]);
			inPaths = inPaths.concat(p2[3]);
		} else if (start > 0 && end < 0) {			
			p1 = this.arc3dPath({x: x, y: y, depth: d, start: start, end: PI, r: r, innerR: ir, alpha: alpha, beta: beta});
			p2 = this.arc3dPath({x: x, y: y, depth: d, start: -PI, end: end, r: r, innerR: ir, alpha: alpha, beta: beta});

			topPaths = topPaths.concat(p1[0]);
			topPaths = topPaths.concat(p2[0]);

			outPaths = outPaths.concat(p1[1]);
			outPaths = outPaths.concat(p2[1]);  

			sidePaths = sidePaths.concat(p1[2]);
			sidePaths = sidePaths.concat(p2[2]);   

			inPaths = inPaths.concat(p1[3]);
			inPaths = inPaths.concat(p2[3]);
		} else {		
			end += 0.001;

			var rx = cos(beta) * r,
			ry = cos(alpha) * r,
			irx = cos(beta) * ir,
			iry = cos(alpha) * ir,
			dx = d * sin(beta),
			dy = d * sin(alpha);

			var sxO = x + (rx * cos(start)),
			syO = y + (ry * sin(start)),
			exO = x + (rx * cos(end)),
			eyO = y + (ry * sin(end)),
			exI = x + (irx * cos(start)),
			eyI = y + (iry * sin(start)),
			sxI = x + (irx * cos(end)),
			syI = y + (iry * sin(end));

			var rx2 = rx * 4 * (Math.sqrt(2) - 1) / 3,	
			rx3 = rx2 / ((PI / 2) / arcAngle),
			irx2 = irx * 4 * (Math.sqrt(2) - 1) / 3,	
			irx3 = irx2 / ((PI / 2) / arcAngle);

			var ry2 = ry * 4 * (Math.sqrt(2) - 1) / 3,	
			ry3 = ry2 / ((PI / 2) / arcAngle),
			iry2 = iry * 4 * (Math.sqrt(2) - 1) / 3,	
			iry3 = iry2 / ((PI / 2) / arcAngle);	

			topPaths.push([
				'M', sxO, syO,
				'C', sxO - (rx3 * sin(start)), syO + (ry3 * cos(start)), 
				exO + (rx3 * sin(end)), eyO - (ry3 * cos(end)), 
				exO, eyO,
				'L', sxI, syI,
				'C', sxI + (irx3 * sin(end)), syI - (iry3 * cos(end)), 
				exI - (irx3 * sin(start)), eyI + (iry3 * cos(start)), 
				exI, eyI,		
				'Z'
				]);

			outPaths.push([
				'M', sxO, syO,
				'C', sxO - (rx3 * sin(start)), syO + (ry3 * cos(start)), 
				exO + (rx3 * sin(end)), eyO - (ry3 * cos(end)), 
				exO, eyO,
				'L', exO + dx, eyO + dy,
				'C', exO + (rx3 * sin(end)) + dx, eyO - (ry3 * cos(end)) + dy,
				sxO - (rx3 * sin(start)) + dx, syO + (ry3 * cos(start)) + dy, 
				sxO + dx, syO + dy,
				'Z'
				]);

			sidePaths.push([
				'M', sxO, syO,
				'L', sxO + dx, syO + dy,
				'L', exI + dx, eyI + dy,
				'L', exI, eyI,
				'Z',

				'M', exO, eyO,
				'L', exO + dx, eyO + dy,
				'L', sxI + dx, syI + dy,
				'L', sxI, syI,
				'Z'		
				]);

			inPaths.push([
				'M', sxI, syI,
				'C', sxI + (irx3 * sin(end)), syI - (iry3 * cos(end)), 
				exI - (irx3 * sin(start)), eyI + (iry3 * cos(start)), 
				exI, eyI,
				'L', exI + dx, eyI + dy,
				'C', exI - (irx3 * sin(start)) + dx, eyI + (iry3 * cos(start)) + dy, 
				sxI + (irx3 * sin(end)) + dx, syI - (iry3 * cos(end)) + dy, 
				sxI + dx, syI + dy,
				'Z'
				]);
		}
	}

	var midAngle = (start * 2 + arcAngle) / 2;
	var zIndex = (sin(beta) * cos(midAngle)) + (sin(alpha) * sin(midAngle));

	return [topPaths, outPaths, sidePaths, inPaths, zIndex];
};

////// HELPER METHODS //////
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
