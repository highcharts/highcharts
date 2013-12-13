/**
 *	Extension to the VML Renderer
 */

var HV = H.VMLRenderer,
	HVE = H.VMLElement;

if (HV) {

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