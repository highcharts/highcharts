
// global variables
extend(Highcharts, {
	
	// Constructors
	Color: Color,
	Point: Point,
	Tick: Tick,	
	Renderer: Renderer,
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
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	map: map,
	merge: merge,
	splat: splat,
	extendClass: extendClass,
	pInt: pInt,
	canvas: Highcharts.useCanVG,
	vml: !Highcharts.svg && !Highcharts.useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});
