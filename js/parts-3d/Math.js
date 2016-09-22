/**
 *	Mathematical Functionility
 */
var PI = Math.PI,
	deg2rad = (PI / 180), // degrees to radians
	sin = Math.sin,
	cos = Math.cos,
	round = Math.round;

/**
 * Apply 3-D rotation
 * Euler Angles (XYZ): cosA = cos(Alfa|Roll), cosB = cos(Beta|Pitch), cosG = cos(Gamma|Yaw) 
 * 
 * Composite rotation:
 * |          cosB * cosG             |           cosB * sinG            |    -sinB    |
 * | sinA * sinB * cosG - cosA * sinG | sinA * sinB * sinG + cosA * cosG | sinA * cosB |
 * | cosA * sinB * cosG + sinA * sinG | cosA * sinB * sinG - sinA * cosG | cosA * cosB |
 * 
 * Now, Gamma/Yaw is not used (angle=0), so we assume cosG = 1 and sinG = 0, so we get:
 * |     cosB    |   0    |   - sinB    |
 * | sinA * sinB |  cosA  | sinA * cosB |
 * | cosA * sinB | - sinA | cosA * cosB |
 * 
 * But in browsers, y is reversed, so we get sinA => -sinA. The general result is:
 * |      cosB     |   0    |    - sinB     |     | x |     | px |
 * | - sinA * sinB |  cosA  | - sinA * cosB |  x  | y |  =  | py | 
 * |  cosA * sinB  |  sinA  |  cosA * cosB  |     | z |     | pz |
 */
function rotate3D(x, y, z, angles) {
	return {
		x: angles.cosB * x - angles.sinB * z,
		y: -angles.sinA * angles.sinB * x + angles.cosA * y - angles.cosB * angles.sinA * z,
		z: angles.cosA * angles.sinB * x + angles.sinA * y + angles.cosA * angles.cosB * z
	};
}

function perspective3D(coordinate, origin, distance) {
	var projection = ((distance > 0) && (distance < Number.POSITIVE_INFINITY)) ? distance / (coordinate.z + origin.z + distance) : 1;
	return {
		x: coordinate.x * projection,
		y: coordinate.y * projection
	};
}

/**
 * Transforms a given array of points according to the angles in chart.options.
 * Parameters:
 *		- points: the array of points
 *		- chart: the chart
 *		- insidePlotArea: wether to verifiy the points are inside the plotArea
 * Returns:
 *		- an array of transformed points
 */
var perspective = Highcharts.perspective = function (points, chart, insidePlotArea) {
	var options3d = chart.options.chart.options3d,
		inverted = insidePlotArea ? chart.inverted : false,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth / 2,
			vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
		},
		scale = chart.scale3d || 1,
		beta = deg2rad * options3d.beta * (inverted ? -1 : 1),
		alpha = deg2rad * options3d.alpha * (inverted ? -1 : 1),
		angles = {
			cosA: cos(alpha),
			cosB: cos(-beta),
			sinA: sin(alpha),
			sinB: sin(-beta)
		};

	if (!insidePlotArea) {
		origin.x += chart.plotLeft;
		origin.y += chart.plotTop;
	}

	// Transform each point
	return Highcharts.map(points, function (point) {
		var rotated = rotate3D(
				(inverted ? point.y : point.x) - origin.x,
				(inverted ? point.x : point.y) - origin.y,
				(point.z || 0) - origin.z,
				angles
			),
			coordinate = perspective3D(rotated, origin, origin.vd); // Apply perspective

		// Apply translation
		coordinate.x = coordinate.x * scale + origin.x;
		coordinate.y = coordinate.y * scale + origin.y;
		coordinate.z = rotated.z * scale + origin.z;

		return {
			x: (inverted ? coordinate.y : coordinate.x),
			y: (inverted ? coordinate.x : coordinate.y),
			z: coordinate.z 
		};
	});
};