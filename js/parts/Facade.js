
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
	addEvent: addEvent,
	removeEvent: removeEvent,
	each: each,
	map: map,
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
