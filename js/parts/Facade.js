
// global variables
Highcharts.extend(Highcharts, {
	
	// Constructors
	Point: Point,
	
	// Various
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
