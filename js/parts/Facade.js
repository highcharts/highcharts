
// global variables
extend(Highcharts, {
	
	// Constructors
	Axis: Axis,
	Chart: Chart,
	Color: Color,
	Point: Point,
	Tick: Tick,	
	Renderer: Renderer,
	SVGElement: SVGElement,
	SVGRenderer: SVGRenderer,
	
	// Various
	arrayMin: arrayMin,
	arrayMax: arrayMax,
	charts: charts,
	dateFormat: dateFormat,
	error: error,
	format: format,
	pathAnim: pathAnim,
	getOptions: getOptions,
	hasBidiBug: hasBidiBug,
	isTouchDevice: isTouchDevice,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	addEvent: addEvent,
	removeEvent: removeEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	extend: extend,
	map: map,
	merge: merge,
	pick: pick,
	splat: splat,
	extendClass: extendClass,
	pInt: pInt,
	svg: hasSVG,
	canvas: useCanVG,
	vml: !hasSVG && !useCanVG,
	product: PRODUCT,
	version: VERSION
});
