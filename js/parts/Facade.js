
// global variables
Highcharts.extend(Highcharts, {
	
	// Constructors
	Point: Point,
	Tick: Tick,	
	SVGElement: SVGElement,
	SVGRenderer: SVGRenderer,
	
	// Various
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
