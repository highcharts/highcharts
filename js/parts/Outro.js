
// global variables
extend(Highcharts, {
	Chart: Chart,
	dateFormat: dateFormat,
	pathAnim: pathAnim,
	getOptions: getOptions,
	numberFormat: numberFormat,
	Point: Point,
	Color: Color,
	Renderer: Renderer,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	Series: Series,

	// Expose utility funcitons for modules
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
	version: 'Highstock 1.0 Beta'
});
}());
