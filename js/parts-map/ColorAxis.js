


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
		marker: { // docs: use another name?
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
		maxColor: '#003875' //#102d4c'
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
		var hasAlpha = (to.rgba[3] !== 1 || from.rgba[3] !== 1);
		return (hasAlpha ? 'rgba(' : 'rgb(') + 
			Math.round(to.rgba[0] + (from.rgba[0] - to.rgba[0]) * (1 - pos)) + ',' + 
			Math.round(to.rgba[1] + (from.rgba[1] - to.rgba[1]) * (1 - pos)) + ',' + 
			Math.round(to.rgba[2] + (from.rgba[2] - to.rgba[2]) * (1 - pos)) + 
			(hasAlpha ? (',' + (to.rgba[3] + (from.rgba[3] - to.rgba[3]) * (1 - pos))) : '') + ')';
		},

	initDataClasses: function (userOptions) {
		var axis = this,
			chart = this.chart,
			dataClasses,
			colorCounter = 0,
			options = this.options;
		this.dataClasses = dataClasses = [];

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
					dataClass.color = axis.tweenColors(Color(options.minColor), Color(options.maxColor), i / (userOptions.dataClasses.length - 1));
				}
			}
		});
	},

	/**
	 * Extend the setOptions method to process extreme colors and color
	 * stops.
	 */
	setOptions: function (userOptions) {
		Axis.prototype.setOptions.call(this, userOptions);

		this.options.crosshair = this.options.marker;

		this.stops = userOptions.stops || [
			[0, this.options.minColor],
			[1, this.options.maxColor]
		];
		each(this.stops, function (stop) {
			stop.color = Color(stop[1]);
		});
		this.coll = 'colorAxis';
	},

	setAxisSize: function () {
		var symbol = this.legendSymbol,
			chart = this.chart;

		if (symbol) {
			this.left = symbol.x;
			this.top = symbol.y;
			this.width = symbol.width;
			this.height = symbol.height;
			this.right = chart.chartWidth - this.left - this.width;
			this.bottom = chart.chartHeight - this.top - this.height;

			this.len = this.horiz ? this.width : this.height;
			this.pos = this.horiz ? this.left : this.top;
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
			pos = 1 - ((this.max - value) / (this.max - this.min));
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
		var group = this.legendGroup;
		if (group) {

			Axis.prototype.getOffset.call(this);
			
			if (!this.axisGroup.parentGroup) {

				// Move the axis elements inside the legend group
				this.axisGroup.add(group);
				this.gridGroup.add(group);
				this.labelGroup.add(group);

				this.added = true;
			}
		}
	},

	/**
	 * Create the color gradient
	 */
	setLegendColor: function () {
		var grad,
			horiz = this.horiz,
			options = this.options;

		grad = horiz ? [0, 0, 1, 0] : [0, 0, 0, 1]; 
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
			labelPadding = pick(legendOptions.labelPadding, horiz ? 10 : 30);

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
		this.legendItemWidth = width + padding + (horiz ? 0 : labelPadding);
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
			legendItems = [],
			legendOptions = chart.options.legend,
			valueDecimals = legendOptions.valueDecimals,
			valueSuffix = legendOptions.valueSuffix || '',
			name;

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
				name += numberFormat(from, valueDecimals) + valueSuffix;
			}
			if (from !== UNDEFINED && to !== UNDEFINED) {
				name += ' - ';
			}
			if (to !== UNDEFINED) {
				name += numberFormat(to, valueDecimals) + valueSuffix;
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
		return legendItems;
	},
	name: '' // Prevents 'undefined' in legend in IE8
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
});