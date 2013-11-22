/**
 *	Mathematical Functionility
 */

function toRad(val) { return val*Math.PI/180 };

var sin = Math.sin;
var cos = Math.cos;
var round = Math.round;

function perspective(points, options) {
	var result = [];

	var angle1 = toRad(options.angle1),
		angle2 = toRad(options.angle2),
		xe = options.origin.x,
		ye = options.origin.y,
		ze = options.origin.z * 100;
	
	var s1 = sin(0 - angle1),
		c1 = cos(0 - angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, p;

	H.each(points, function (point) {
		x = point.x - xe,
		y = point.y - ye,
		z = point.z;

		p = {
			x: c1*x - s1*z,
			y: 0 - s1*s2*x - c1*s2*z + c2*y,		// Minus because the axis is inverted
			z: s1*c2*x + c1*c2*z + s2*y
		};

		p.x = p.x * ((ze - p.z) / ze) + xe;
		p.y = p.y * ((ze - p.z) / ze) + ye;

		result.push(p);
	});
	return result;
}