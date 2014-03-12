/**
 *	Mathematical Functionility
 */
var PI = Math.PI,
	deg2rad = (PI / 180), // degrees to radians 
	sin = Math.sin,
	cos = Math.cos, 

	round = Math.round;

function perspective(points, angle2, angle1, origin) {
	angle1 *= deg2rad;
	angle2 *= deg2rad;

	var result = [],
		xe, 
		ye, 
		ze;

	angle1 *= -1;
	
	xe = origin.x;
	ye = origin.y;
	ze = (origin.z === 0 ? 0.0001 : origin.z * 100);

	// some kind of minimum?

	var s1 = sin(angle1),
		c1 = cos(angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, p;

	Highcharts.each(points, function (point) {
		x = point.x - xe;
		y = point.y - ye;
		z = point.z;

		p = {
			x: c1 * x - s1 * z,
			y: -s1 * s2 * x - c1 * s2 * z + c2 * y,		
			z: s1 * c2 * x + c1 * c2 * z + s2 * y
		};

		p.x = p.x * ((ze - p.z) / ze) + xe;
		p.y = p.y * ((ze - p.z) / ze) + ye;

		result.push(p);
	});
	return result;
}
