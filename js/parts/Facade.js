
// global variables
extend(Highcharts, {
	
	// Constructors
	Axis: Axis,
	CanVGRenderer: CanVGRenderer,
	Chart: Chart,
	Color: Color,
	Legend: Legend,
	MouseTracker: MouseTracker,
	Point: Point,
	Tick: Tick,
	Tooltip: Tooltip,
	Renderer: Renderer,
	Series: Series,
	SVGRenderer: SVGRenderer,
	VMLRenderer: VMLRenderer,
	
	// Various
	dateFormat: dateFormat,
	pathAnim: pathAnim,
	getOptions: getOptions,
	hasBidiBug: hasBidiBug,
	isTouchDevice: isTouchDevice,
	numberFormat: numberFormat,
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
	wrap: wrap,
	svg: hasSVG,
	canvas: useCanVG,
	vml: !hasSVG && !useCanVG,
	product: '@product.name@',
	version: '@product.version@'
});