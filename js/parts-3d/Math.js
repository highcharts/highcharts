/**
 *	Mathematical Functionility
 */
var PI = Math.PI,
	deg2rad = (PI / 180), // degrees to radians 
	sin = Math.sin,
	cos = Math.cos, 
	pick = Highcharts.pick,
	round = Math.round;

function perspective(points, chart, insidePlotArea) {
	var options3d = chart.options.chart.options3d,
		inverted = false;
	if (insidePlotArea) {
		inverted = chart.inverted;
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth / 2,
			vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
		};
	} else {
		origin = {
			x: chart.plotLeft + (chart.plotWidth / 2),
			y: chart.plotTop + (chart.plotHeight / 2),
			z: options3d.depth / 2,
			vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
		};
	}

	var result = [],
		xe = origin.x,
		ye = origin.y,
		ze = origin.z,
		vd = origin.vd,
		angle1 = deg2rad * (inverted ?  options3d.beta  : -options3d.beta),
		angle2 = deg2rad * (inverted ? -options3d.alpha :  options3d.alpha),
		s1 = sin(angle1),
		c1 = cos(angle1),
		s2 = sin(angle2),
		c2 = cos(angle2);

	var x, y, z, px, py, pz, p;

	Highcharts.each(points, function (point) {
		x = (inverted ? point.y : point.x) - xe;
		y = (inverted ? point.x : point.y) - ye;
		z = (point.z || 0) - ze;

		//Apply 3-D rotation
		px = c1 * x - s1 * z;
		py = -s1 * s2 * x - c1 * s2 * z + c2 * y;
		pz = s1 * c2 * x + c1 * c2 * z + s2 * y;

		//Apply perspective
		if ((vd > 0) && (vd < Number.POSITIVE_INFINITY)) {
			px = px * (vd / (pz + ze + vd));
			py = py * (vd / (pz + ze + vd));
		}

		//Apply translation
		px = px + xe;
		py = py + ye;
		pz = pz + ze;

		result.push({
			x: (inverted ? py : px),
			y: (inverted ? px : py),
			z: pz
		});
	});
	return result;
}
// Make function acessible to plugins
Highcharts.perspective = perspective;
