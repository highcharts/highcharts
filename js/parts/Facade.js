
// global variables
Highcharts.extend(Highcharts, {
	
	// Constructors
	Color: Color,
	Point: Point,
	Tick: Tick,	
	SVGElement: SVGElement,
	SVGRenderer: SVGRenderer,
	
	// Various
	getOptions: getOptions,
	setOptions: setOptions,
	removeEvent: removeEvent,
	each: each,
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
