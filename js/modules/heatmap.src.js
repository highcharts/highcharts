/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2011-2014 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*global HighchartsAdapter*/
(function (Highcharts) {


var UNDEFINED,
	Axis = Highcharts.Axis,
	Chart = Highcharts.Chart,
	Color = Highcharts.Color,
	Legend = Highcharts.Legend,
	LegendSymbolMixin = Highcharts.LegendSymbolMixin,
	Series = Highcharts.Series,
	SVGRenderer = Highcharts.SVGRenderer,
	
	defaultOptions = Highcharts.getOptions(),
	each = Highcharts.each,
	extend = Highcharts.extend,
	extendClass = Highcharts.extendClass,
	merge = Highcharts.merge,
	pick = Highcharts.pick,
	seriesTypes = Highcharts.seriesTypes,
	wrap = Highcharts.wrap,
	noop = function () {};

	


/**
 * The ColorAxis object for inclusion in gradient legends
 */
var ColorAxis = Highcharts.ColorAxis = function () {
	this.isColorAxis = true;
	this.init.apply(this, arguments);
};
extend(ColorAxis.prototype, Axis.prototype);
extend(ColorAxis.prototype, {
	defaultColorAxisOptions: {
		lineWidth: 0,
		gridLineWidth: 1,
		tickPixelInterval: 72,
		startOnTick: true,
		endOnTick: true,
		offset: 0,
		marker: {
			animation: {
				duration: 50
			},
			color: 'gray',
			width: 0.01
		},
		labels: {
			overflow: 'justify'
		},
		minColor: '#EFEFFF',
		maxColor: '#003875',
		tickLength: 5
	},
	init: function (chart, userOptions) {
		var horiz = chart.options.legend.layout !== 'vertical',
			options;

		// Build the options
		options = merge(this.defaultColorAxisOptions, {
			side: horiz ? 2 : 1,
			reversed: !horiz
		}, userOptions, {
			isX: horiz,
			opposite: !horiz,
			showEmpty: false,
			title: null,
			isColor: true
		});

		Axis.prototype.init.call(this, chart, options);

		// Base init() pushes it to the xAxis array, now pop it again
		//chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

		// Prepare data classes
		if (userOptions.dataClasses) {
			this.initDataClasses(userOptions);
		}
		this.initStops(userOptions);

		// Override original axis properties
		this.isXAxis = true;
		this.horiz = horiz;
		this.zoomEnabled = false;
	},

	/*
	 * Return an intermediate color between two colors, according to pos where 0
	 * is the from color and 1 is the to color
	 */
	tweenColors: function (from, to, pos) {
		// Check for has alpha, because rgba colors perform worse due to lack of
		// support in WebKit.
		var hasAlpha;

		from = from.rgba;
		to = to.rgba;
		hasAlpha = (to[3] !== 1 || from[3] !== 1);
		if (!to.length || !from.length) {
			Highcharts.error(23);
		}
		return (hasAlpha ? 'rgba(' : 'rgb(') + 
			Math.round(to[0] + (from[0] - to[0]) * (1 - pos)) + ',' + 
			Math.round(to[1] + (from[1] - to[1]) * (1 - pos)) + ',' + 
			Math.round(to[2] + (from[2] - to[2]) * (1 - pos)) + 
			(hasAlpha ? (',' + (to[3] + (from[3] - to[3]) * (1 - pos))) : '') + ')';
	},

	initDataClasses: function (userOptions) {
		var axis = this,
			chart = this.chart,
			dataClasses,
			colorCounter = 0,
			options = this.options,
			len = userOptions.dataClasses.length;
		this.dataClasses = dataClasses = [];
		this.legendItems = [];

		each(userOptions.dataClasses, function (dataClass, i) {
			var colors;

			dataClass = merge(dataClass);
			dataClasses.push(dataClass);
			if (!dataClass.color) {
				if (options.dataClassColor === 'category') {
					colors = chart.options.colors;
					dataClass.color = colors[colorCounter++];
					// loop back to zero
					if (colorCounter === colors.length) {
						colorCounter = 0;
					}
				} else {
					dataClass.color = axis.tweenColors(
						Color(options.minColor), 
						Color(options.maxColor), 
						len < 2 ? 0.5 : i / (len - 1) // #3219
					);
				}
			}
		});
	},

	initStops: function (userOptions) {
		this.stops = userOptions.stops || [
			[0, this.options.minColor],
			[1, this.options.maxColor]
		];
		each(this.stops, function (stop) {
			stop.color = Color(stop[1]);
		});
	},

	/**
	 * Extend the setOptions method to process extreme colors and color
	 * stops.
	 */
	setOptions: function (userOptions) {
		Axis.prototype.setOptions.call(this, userOptions);

		this.options.crosshair = this.options.marker;
		this.coll = 'colorAxis';
	},

	setAxisSize: function () {
		var symbol = this.legendSymbol,
			chart = this.chart,
			x,
			y,
			width,
			height;

		if (symbol) {
			this.left = x = symbol.attr('x');
			this.top = y = symbol.attr('y');
			this.width = width = symbol.attr('width');
			this.height = height = symbol.attr('height');
			this.right = chart.chartWidth - x - width;
			this.bottom = chart.chartHeight - y - height;

			this.len = this.horiz ? width : height;
			this.pos = this.horiz ? x : y;
		}
	},

	/** 
	 * Translate from a value to a color
	 */
	toColor: function (value, point) {
		var pos,
			stops = this.stops,
			from,
			to,
			color,
			dataClasses = this.dataClasses,
			dataClass,
			i;

		if (dataClasses) {
			i = dataClasses.length;
			while (i--) {
				dataClass = dataClasses[i];
				from = dataClass.from;
				to = dataClass.to;
				if ((from === UNDEFINED || value >= from) && (to === UNDEFINED || value <= to)) {
					color = dataClass.color;
					if (point) {
						point.dataClass = i;
					}
					break;
				}	
			}

		} else {

			if (this.isLog) {
				value = this.val2lin(value);
			}
			pos = 1 - ((this.max - value) / ((this.max - this.min) || 1));
			i = stops.length;
			while (i--) {
				if (pos > stops[i][0]) {
					break;
				}
			}
			from = stops[i] || stops[i + 1];
			to = stops[i + 1] || from;

			// The position within the gradient
			pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);

			color = this.tweenColors(
				from.color, 
				to.color,
				pos
			);
		}
		return color;
	},

	getOffset: function () {
		var group = this.legendGroup,
			sideOffset = this.chart.axisOffset[this.side];
		
		if (group) {

			Axis.prototype.getOffset.call(this);
			
			if (!this.axisGroup.parentGroup) {

				// Move the axis elements inside the legend group
				this.axisGroup.add(group);
				this.gridGroup.add(group);
				this.labelGroup.add(group);

				this.added = true;
			}
			// Reset it to avoid color axis reserving space
			this.chart.axisOffset[this.side] = sideOffset;
		}
	},

	/**
	 * Create the color gradient
	 */
	setLegendColor: function () {
		var grad,
			horiz = this.horiz,
			options = this.options,
			reversed = this.reversed;

		grad = horiz ? [+reversed, 0, +!reversed, 0] : [0, +!reversed, 0, +reversed]; // #3190
		this.legendColor = {
			linearGradient: { x1: grad[0], y1: grad[1], x2: grad[2], y2: grad[3] },
			stops: options.stops || [
				[0, options.minColor],
				[1, options.maxColor]
			]
		};
	},

	/**
	 * The color axis appears inside the legend and has its own legend symbol
	 */
	drawLegendSymbol: function (legend, item) {
		var padding = legend.padding,
			legendOptions = legend.options,
			horiz = this.horiz,
			box,
			width = pick(legendOptions.symbolWidth, horiz ? 200 : 12),
			height = pick(legendOptions.symbolHeight, horiz ? 12 : 200),
			labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
			itemDistance = pick(legendOptions.itemDistance, 10);

		this.setLegendColor();

		// Create the gradient
		item.legendSymbol = this.chart.renderer.rect(
			0,
			legend.baseline - 11,
			width,
			height
		).attr({
			zIndex: 1
		}).add(item.legendGroup);
		box = item.legendSymbol.getBBox();

		// Set how much space this legend item takes up
		this.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
		this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
	},
	/**
	 * Fool the legend
	 */
	setState: noop,
	visible: true,
	setVisible: noop,
	getSeriesExtremes: function () {
		var series;
		if (this.series.length) {
			series = this.series[0];
			this.dataMin = series.valueMin;
			this.dataMax = series.valueMax;
		}
	},
	drawCrosshair: function (e, point) {
		var newCross = !this.cross,
			plotX = point && point.plotX,
			plotY = point && point.plotY,
			crossPos,
			axisPos = this.pos,
			axisLen = this.len;
		
		if (point) {
			crossPos = this.toPixels(point.value);
			if (crossPos < axisPos) {
				crossPos = axisPos - 2;
			} else if (crossPos > axisPos + axisLen) {
				crossPos = axisPos + axisLen + 2;
			}
			
			point.plotX = crossPos;
			point.plotY = this.len - crossPos;
			Axis.prototype.drawCrosshair.call(this, e, point);
			point.plotX = plotX;
			point.plotY = plotY;
			
			if (!newCross && this.cross) {
				this.cross
					.attr({
						fill: this.crosshair.color
					})
					.add(this.labelGroup);
			}
		}
	},
	getPlotLinePath: function (a, b, c, d, pos) {
		if (pos) { // crosshairs only
			return this.horiz ? 
				['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] : 
				['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z'];
		} else {
			return Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
		}
	},

	update: function (newOptions, redraw) {
		each(this.series, function (series) {
			series.isDirtyData = true; // Needed for Axis.update when choropleth colors change
		});
		Axis.prototype.update.call(this, newOptions, redraw);
		if (this.legendItem) {
			this.setLegendColor();
			this.chart.legend.colorizeItem(this, true);
		}
	},

	/**
	 * Get the legend item symbols for data classes
	 */
	getDataClassLegendSymbols: function () {
		var axis = this,
			chart = this.chart,
			legendItems = this.legendItems,
			legendOptions = chart.options.legend,
			valueDecimals = legendOptions.valueDecimals,
			valueSuffix = legendOptions.valueSuffix || '',
			name;

		if (!legendItems.length) {
			each(this.dataClasses, function (dataClass, i) {
				var vis = true,
					from = dataClass.from,
					to = dataClass.to;
				
				// Assemble the default name. This can be overridden by legend.options.labelFormatter
				name = '';
				if (from === UNDEFINED) {
					name = '< ';
				} else if (to === UNDEFINED) {
					name = '> ';
				}
				if (from !== UNDEFINED) {
					name += Highcharts.numberFormat(from, valueDecimals) + valueSuffix;
				}
				if (from !== UNDEFINED && to !== UNDEFINED) {
					name += ' - ';
				}
				if (to !== UNDEFINED) {
					name += Highcharts.numberFormat(to, valueDecimals) + valueSuffix;
				}
				
				// Add a mock object to the legend items
				legendItems.push(extend({
					chart: chart,
					name: name,
					options: {},
					drawLegendSymbol: LegendSymbolMixin.drawRectangle,
					visible: true,
					setState: noop,
					setVisible: function () {
						vis = this.visible = !vis;
						each(axis.series, function (series) {
							each(series.points, function (point) {
								if (point.dataClass === i) {
									point.setVisible(vis);
								}
							});
						});
						
						chart.legend.colorizeItem(this, vis);
					}
				}, dataClass));
			});
		}
		return legendItems;
	},
	name: '' // Prevents 'undefined' in legend in IE8
});

/**
 * Handle animation of the color attributes directly
 */
each(['fill', 'stroke'], function (prop) {
	HighchartsAdapter.addAnimSetter(prop, function (fx) {
		fx.elem.attr(prop, ColorAxis.prototype.tweenColors(Color(fx.start), Color(fx.end), fx.pos));
	});
});

/**
 * Extend the chart getAxes method to also get the color axis
 */
wrap(Chart.prototype, 'getAxes', function (proceed) {

	var options = this.options,
		colorAxisOptions = options.colorAxis;

	proceed.call(this);

	this.colorAxis = [];
	if (colorAxisOptions) {
		proceed = new ColorAxis(this, colorAxisOptions); // Fake assignment for jsLint
	}
});


/**
 * Wrap the legend getAllItems method to add the color axis. This also removes the 
 * axis' own series to prevent them from showing up individually.
 */
wrap(Legend.prototype, 'getAllItems', function (proceed) {
	var allItems = [],
		colorAxis = this.chart.colorAxis[0];

	if (colorAxis) {

		// Data classes
		if (colorAxis.options.dataClasses) {
			allItems = allItems.concat(colorAxis.getDataClassLegendSymbols());
		// Gradient legend
		} else {
			// Add this axis on top
			allItems.push(colorAxis);
		}

		// Don't add the color axis' series
		each(colorAxis.series, function (series) {
			series.options.showInLegend = false;
		});
	}

	return allItems.concat(proceed.call(this));
});/**
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
/**
 * Extend the default options with map options
 */
defaultOptions.plotOptions.heatmap = merge(defaultOptions.plotOptions.scatter, {
	animation: false,
	borderWidth: 0,
	nullColor: '#F8F8F8',
	dataLabels: {
		formatter: function () { // #2945
			return this.point.value;
		},
		verticalAlign: 'middle',
		crop: false,
		overflow: false,
		style: {
			color: 'white',
			fontWeight: 'bold',
			HcTextStroke: '1px rgba(0,0,0,0.5)'
		}
	},
	marker: null,
	tooltip: {
		pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
	},
	states: {
		normal: {
			animation: true
		},
		hover: {
			halo: false,  // #3406, halo is not required on heatmaps
			brightness: 0.2
		}
	}
});

// The Heatmap series type
seriesTypes.heatmap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
	type: 'heatmap',
	pointArrayMap: ['y', 'value'],
	hasPointSpecificOptions: true,
	supportsDrilldown: true,
	getExtremesFromAll: true,
	init: function () {
		seriesTypes.scatter.prototype.init.apply(this, arguments);
		this.pointRange = this.options.colsize || 1;
		this.yAxis.axisPointRange = this.options.rowsize || 1; // general point range
	},
	translate: function () {
		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis;

		series.generatePoints();

		each(series.points, function (point) {
			var xPad = (options.colsize || 1) / 2,
				yPad = (options.rowsize || 1) / 2,
				x1 = Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)),
				x2 = Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)),
				y1 = Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)),
				y2 = Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1));

			// Set plotX and plotY for use in K-D-Tree and more
			point.plotX = (x1 + x2) / 2;
			point.plotY = (y1 + y2) / 2;

			point.shapeType = 'rect';
			point.shapeArgs = {
				x: Math.min(x1, x2),
				y: Math.min(y1, y2),
				width: Math.abs(x2 - x1),
				height: Math.abs(y2 - y1)
			};
		});
		
		series.translateColors();

		// Make sure colors are updated on colorAxis update (#2893)
		if (this.chart.hasRendered) {
			each(series.points, function (point) {
				point.shapeArgs.fill = point.options.color || point.color; // #3311
			});
		}
	},
	drawPoints: seriesTypes.column.prototype.drawPoints,
	animate: noop,
	getBox: noop,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle,

	getExtremes: function () {
		// Get the extremes from the value data
		Series.prototype.getExtremes.call(this, this.valueData);
		this.valueMin = this.dataMin;
		this.valueMax = this.dataMax;

		// Get the extremes from the y data
		Series.prototype.getExtremes.call(this);
	}
		
}));


}(Highcharts));