
// global variables
Highcharts.extend(Highcharts, {
	
	// Constructors
	Color: Color,
	Point: Point,
	Tick: Tick,	
	SVGElement: SVGElement,
	SVGRenderer: SVGRenderer,
	
	// Various
	arrayMin: arrayMin,
	arrayMax: arrayMax,
	error: error,
	format: format,
	getOptions: getOptions,
	setOptions: setOptions,
	addEvent: addEvent,
	removeEvent: removeEvent,
	discardElement: discardElement,
	each: each,
	map: map,
	extendClass: extendClass,
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
