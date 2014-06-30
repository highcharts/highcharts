/**
 * Mixin for maps and heatmaps
 */
var colorSeriesMixin = {

	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		dashstyle: 'dashStyle'
	},
	pointArrayMap: ['value'],
	axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
	optionalAxis: 'colorAxis',
	trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
	getSymbol: noop,
	parallelArrays: ['x', 'y', 'value'],
	colorKey: 'value',
	
	/**
	 * In choropleth maps, the color is a result of the value, so this needs translation too
	 */
	translateColors: function () {
		var series = this,
			nullColor = this.options.nullColor,
			colorAxis = this.colorAxis,
			colorKey = this.colorKey;

		each(this.data, function (point) {
			var value = point[colorKey],
				color;

			color = value === null ? nullColor : (colorAxis && value !== undefined) ? colorAxis.toColor(value, point) : point.color || series.color;

			if (color) {
				point.color = color;
			}
		});
	}
};


/**
 * Wrap the buildText method and add the hook for add text stroke
 */
wrap(SVGRenderer.prototype, 'buildText', function (proceed, wrapper) {

	var textStroke = wrapper.styles && wrapper.styles.HcTextStroke;

	proceed.call(this, wrapper);

	// Apply the text stroke
	if (textStroke && wrapper.applyTextStroke) {
		wrapper.applyTextStroke(textStroke);
	}
});

/**
 * Apply an outside text stroke to data labels, based on the custom CSS property, HcTextStroke.
 * Consider moving this to Highcharts core, also makes sense on stacked columns etc.
 */
SVGRenderer.prototype.Element.prototype.applyTextStroke = function (textStroke) {
	var elem = this.element,
		tspans,
		firstChild;
	
	textStroke = textStroke.split(' ');
	tspans = elem.getElementsByTagName('tspan');
	firstChild = elem.firstChild;
	
	// In order to get the right y position of the clones, 
	// copy over the y setter
	this.ySetter = this.xSetter;
	
	each([].slice.call(tspans), function (tspan, y) {
		var clone;
		if (y === 0) {
			tspan.setAttribute('x', elem.getAttribute('x'));
			if ((y = elem.getAttribute('y')) !== null) {
				tspan.setAttribute('y', y);
			}
		}
		clone = tspan.cloneNode(1);
		clone.setAttribute('stroke', textStroke[1]);
		clone.setAttribute('stroke-width', textStroke[0]);
		clone.setAttribute('stroke-linejoin', 'round');
		elem.insertBefore(clone, firstChild);
	});
};