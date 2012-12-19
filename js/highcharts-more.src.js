// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v2.3.5 (2012-12-19)
 *
 * (c) 2009-2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console */

(function (Highcharts, UNDEFINED) {
var each = Highcharts.each,
	extend = Highcharts.extend,
	merge = Highcharts.merge,
	map = Highcharts.map,
	pick = Highcharts.pick,
	pInt = Highcharts.pInt,
	defaultPlotOptions = Highcharts.getOptions().plotOptions,
	seriesTypes = Highcharts.seriesTypes,
	extendClass = Highcharts.extendClass,
	splat = Highcharts.splat,
	wrap = Highcharts.wrap,
	Axis = Highcharts.Axis,
	Tick = Highcharts.Tick,
	Series = Highcharts.Series,
	colProto = seriesTypes.column.prototype,
	noop = function () {};/**
 * The Pane object allows options that are common to a set of X and Y axes.
 * 
 * In the future, this can be extended to basic Highcharts and Highstock.
 */
function Pane(options, chart, firstAxis) {
	this.init.call(this, options, chart, firstAxis);
}

// Extend the Pane prototype
extend(Pane.prototype, {
	
	/**
	 * Initiate the Pane object
	 */
	init: function (options, chart, firstAxis) {
		var pane = this,
			backgroundOption,
			defaultOptions = pane.defaultOptions;
		
		pane.chart = chart;
		
		// Set options
		if (chart.angular) { // gauges
			defaultOptions.background = {}; // gets extended by this.defaultBackgroundOptions
		}
		pane.options = options = merge(defaultOptions, options);
		
		backgroundOption = options.background;
		
		// To avoid having weighty logic to place, update and remove the backgrounds,
		// push them to the first axis' plot bands and borrow the existing logic there.
		if (backgroundOption) {
			each([].concat(splat(backgroundOption)).reverse(), function (config) {
				var backgroundColor = config.backgroundColor; // if defined, replace the old one (specific for gradients)
				config = merge(pane.defaultBackgroundOptions, config);
				if (backgroundColor) {
					config.backgroundColor = backgroundColor;
				}
				config.color = config.backgroundColor; // due to naming in plotBands
				firstAxis.options.plotBands.unshift(config);
			});
		}
	},
	
	/**
	 * The default options object
	 */
	defaultOptions: {
		// background: {conditional},
		center: ['50%', '50%'],
		size: '85%',
		startAngle: 0
		//endAngle: startAngle + 360
	},	
	
	/**
	 * The default background options
	 */
	defaultBackgroundOptions: {
		shape: 'circle',
		borderWidth: 1,
		borderColor: 'silver',
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, '#FFF'],
				[1, '#DDD']
			]
		},
		from: Number.MIN_VALUE, // corrected to axis min
		innerRadius: 0,
		to: Number.MAX_VALUE, // corrected to axis max
		outerRadius: '105%'
	}
	
});
var axisProto = Axis.prototype,
	tickProto = Tick.prototype;
	
/**
 * Augmented methods for the x axis in order to hide it completely, used for the X axis in gauges
 */
var hiddenAxisMixin = {
	getOffset: noop,
	redraw: function () {
		this.isDirty = false; // prevent setting Y axis dirty
	},
	render: function () {
		this.isDirty = false; // prevent setting Y axis dirty
	},
	setScale: noop,
	setCategories: noop,
	setTitle: noop
};

/**
 * Augmented methods for the value axis
 */
/*jslint unparam: true*/
var radialAxisMixin = {
	isRadial: true,
	
	/**
	 * The default options extend defaultYAxisOptions
	 */
	defaultRadialGaugeOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: null // auto
		},
		minorGridLineWidth: 0,
		minorTickInterval: 'auto',
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickWidth: 1,
		plotBands: [],
		tickLength: 10,
		tickPosition: 'inside',
		tickWidth: 2,
		title: {
			rotation: 0
		},
		zIndex: 2 // behind dials, points in the series group
	},
	
	// Circular axis around the perimeter of a polar chart
	defaultRadialXOptions: {
		gridLineWidth: 1, // spokes
		labels: {
			align: null, // auto
			distance: 15,
			x: 0,
			y: null // auto
		},
		maxPadding: 0,
		minPadding: 0,
		plotBands: [],
		showLastLabel: false, 
		tickLength: 0
	},
	
	// Radial axis, like a spoke in a polar chart
	defaultRadialYOptions: {
		gridLineInterpolation: 'circle',
		labels: {
			align: 'right',
			x: -3,
			y: -2
		},
		plotBands: [],
		showLastLabel: false,
		title: {
			x: 4,
			text: null,
			rotation: 90
		}
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		
		this.options = merge(
			this.defaultOptions,
			this.defaultRadialOptions,
			userOptions
		);
		
	},
	
	/**
	 * Wrap the getOffset method to return zero offset for title or labels in a radial 
	 * axis
	 */
	getOffset: function () {
		// Call the Axis prototype method (the method we're in now is on the instance)
		axisProto.getOffset.call(this);
		
		// Title or label offsets are not counted
		this.chart.axisOffset[this.side] = 0;
		
		// Set the center array
		this.center = this.pane.center = seriesTypes.pie.prototype.getCenter.call(this.pane);
	},


	/**
	 * Get the path for the axis line. This method is also referenced in the getPlotLinePath
	 * method.
	 */
	getLinePath: function (lineWidth, radius) {
		var center = this.center;
		radius = pick(radius, center[2] / 2 - this.offset);
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radius,
			radius, 
			{
				start: this.startAngleRad,
				end: this.endAngleRad,
				open: true,
				innerR: 0
			}
		);
	},

	/**
	 * Override setAxisTranslation by setting the translation to the difference
	 * in rotation. This allows the translate method to return angle for 
	 * any given value.
	 */
	setAxisTranslation: function () {
		
		// Call uber method		
		axisProto.setAxisTranslation.call(this);
			
		// Set transA and minPixelPadding
		if (this.center) { // it's not defined the first time
			if (this.isCircular) {
				
				this.transA = (this.endAngleRad - this.startAngleRad) / 
					((this.max - this.min) || 1);
					
				
			} else { 
				this.transA = (this.center[2] / 2) / ((this.max - this.min) || 1);
			}
			
			if (this.isXAxis) {
				this.minPixelPadding = this.transA * this.minPointOffset +
					(this.reversed ? (this.endAngleRad - this.startAngleRad) / 4 : 0); // ???
			}
		}
	},
	
	/**
	 * In case of auto connect, add one closestPointRange to the max value right before
	 * tickPositions are computed, so that ticks will extend passed the real max.
	 */
	beforeSetTickPositions: function () {
		if (this.autoConnect) {
			this.max += (this.categories && 1) || this.pointRange || this.closestPointRange; // #1197
		}
	},
	
	/**
	 * Override the setAxisSize method to use the arc's circumference as length. This
	 * allows tickPixelInterval to apply to pixel lengths along the perimeter
	 */
	setAxisSize: function () {
		
		axisProto.setAxisSize.call(this);
		
		if (this.center) { // it's not defined the first time
			this.len = this.width = this.height = this.isCircular ?
				this.center[2] * (this.endAngleRad - this.startAngleRad) / 2 :
				this.center[2] / 2;
		}
	},
	
	/**
	 * Returns the x, y coordinate of a point given by a value and a pixel distance
	 * from center
	 */
	getPosition: function (value, length) {
		if (!this.isCircular) {
			length = this.translate(value);
			value = this.min;	
		}
		
		return this.postTranslate(
			this.translate(value),
			pick(length, this.center[2] / 2) - this.offset
		);		
	},
	
	/**
	 * Translate from intermediate plotX (angle), plotY (axis.len - radius) to final chart coordinates. 
	 */
	postTranslate: function (angle, radius) {
		
		var chart = this.chart,
			center = this.center;
			
		angle = this.startAngleRad + angle;
		
		return {
			x: chart.plotLeft + center[0] + Math.cos(angle) * radius,
			y: chart.plotTop + center[1] + Math.sin(angle) * radius
		}; 
		
	},
	
	/**
	 * Find the path for plot bands along the radial axis
	 */
	getPlotBandPath: function (from, to, options) {
		var center = this.center,
			startAngleRad = this.startAngleRad,
			fullRadius = center[2] / 2,
			radii = [
				pick(options.outerRadius, '100%'),
				options.innerRadius,
				pick(options.thickness, 10)
			],
			percentRegex = /%$/,
			start,
			end,
			open,
			isCircular = this.isCircular, // X axis in a polar chart
			ret;
			
		// Polygonal plot bands
		if (this.options.gridLineInterpolation === 'polygon') {
			ret = this.getPlotLinePath(from).concat(this.getPlotLinePath(to, true));
		
		// Circular grid bands
		} else {
			
			// Plot bands on Y axis (radial axis) - inner and outer radius depend on to and from
			if (!isCircular) {
				radii[0] = this.translate(from);
				radii[1] = this.translate(to);
			}
			
			// Convert percentages to pixel values
			radii = map(radii, function (radius) {
				if (percentRegex.test(radius)) {
					radius = (pInt(radius, 10) * fullRadius) / 100;
				}
				return radius;
			});
			
			// Handle full circle
			if (options.shape === 'circle' || !isCircular) {
				start = -Math.PI / 2;
				end = Math.PI * 1.5;
				open = true;
			} else {
				start = startAngleRad + this.translate(from);
				end = startAngleRad + this.translate(to);
			}
		
		
			ret = this.chart.renderer.symbols.arc(
				this.left + center[0],
				this.top + center[1],
				radii[0],
				radii[0],
				{
					start: start,
					end: end,
					innerR: pick(radii[1], radii[0] - radii[2]),
					open: open
				}
			);
		}
		 
		return ret;
	},
	
	/**
	 * Find the path for plot lines perpendicular to the radial axis.
	 */
	getPlotLinePath: function (value, reverse) {
		var axis = this,
			center = axis.center,
			chart = axis.chart,
			end = axis.getPosition(value),
			xAxis,
			xy,
			tickPositions,
			ret;
		
		// Spokes
		if (axis.isCircular) {
			ret = ['M', center[0] + chart.plotLeft, center[1] + chart.plotTop, 'L', end.x, end.y];
		
		// Concentric circles			
		} else if (axis.options.gridLineInterpolation === 'circle') {
			value = axis.translate(value);
			if (value) { // a value of 0 is in the center
				ret = axis.getLinePath(0, value);
			}
		// Concentric polygons 
		} else {
			xAxis = chart.xAxis[0];
			ret = [];
			value = axis.translate(value);
			tickPositions = xAxis.tickPositions;
			if (xAxis.autoConnect) {
				tickPositions = tickPositions.concat([tickPositions[0]]);
			}
			// Reverse the positions for concatenation of polygonal plot bands
			if (reverse) {
				tickPositions = [].concat(tickPositions).reverse();
			}
				
			each(tickPositions, function (pos, i) {
				xy = xAxis.getPosition(pos, value);
				ret.push(i ? 'L' : 'M', xy.x, xy.y);
			});
			
		}
		return ret;
	},
	
	/**
	 * Find the position for the axis title, by default inside the gauge
	 */
	getTitlePosition: function () {
		var center = this.center,
			chart = this.chart,
			titleOptions = this.options.title;
		
		return { 
			x: chart.plotLeft + center[0] + (titleOptions.x || 0), 
			y: chart.plotTop + center[1] - ({ high: 0.5, middle: 0.25, low: 0 }[titleOptions.align] * 
				center[2]) + (titleOptions.y || 0)  
		};
	}
	
};
/*jslint unparam: false*/

/**
 * Override axisProto.init to mix in special axis instance functions and function overrides
 */
wrap(axisProto, 'init', function (proceed, chart, userOptions) {
	var axis = this,
		angular = chart.angular,
		polar = chart.polar,
		isX = userOptions.isX,
		isHidden = angular && isX,
		isCircular,
		startAngleRad,
		endAngleRad,
		options,
		chartOptions = chart.options,
		paneIndex = userOptions.pane || 0,
		pane,
		paneOptions;
		
	// Before prototype.init
	if (angular) {
		extend(this, isHidden ? hiddenAxisMixin : radialAxisMixin);
		isCircular =  !isX;
		if (isCircular) {
			this.defaultRadialOptions = this.defaultRadialGaugeOptions;
		}
		
	} else if (polar) {
		//extend(this, userOptions.isX ? radialAxisMixin : radialAxisMixin);
		extend(this, radialAxisMixin);
		isCircular = isX;
		this.defaultRadialOptions = isX ? this.defaultRadialXOptions : merge(this.defaultYAxisOptions, this.defaultRadialYOptions);
		
	}
	
	// Run prototype.init
	proceed.call(this, chart, userOptions);
	
	if (!isHidden && (angular || polar)) {
		options = this.options;
		
		// Create the pane and set the pane options.
		if (!chart.panes) {
			chart.panes = [];
		}
		this.pane = chart.panes[paneIndex] = pane = new Pane(
			splat(chartOptions.pane)[paneIndex],
			chart,
			axis
		);
		paneOptions = pane.options;
		
			
		// Disable certain features on angular and polar axes
		chart.inverted = false;
		chartOptions.chart.zoomType = null;
		
		// Start and end angle options are
		// given in degrees relative to top, while internal computations are
		// in radians relative to right (like SVG).
		this.startAngleRad = startAngleRad = (paneOptions.startAngle - 90) * Math.PI / 180;
		this.endAngleRad = endAngleRad = (pick(paneOptions.endAngle, paneOptions.startAngle + 360)  - 90) * Math.PI / 180;
		this.offset = options.offset || 0;
		
		this.isCircular = isCircular;
		
		// Automatically connect grid lines?
		if (isCircular && userOptions.max === UNDEFINED && endAngleRad - startAngleRad === 2 * Math.PI) {
			this.autoConnect = true;
		}
	}
	
});

/**
 * Add special cases within the Tick class' methods for radial axes.
 */	
wrap(tickProto, 'getPosition', function (proceed, horiz, pos, tickmarkOffset, old) {
	var axis = this.axis;
	
	return axis.getPosition ? 
		axis.getPosition(pos) :
		proceed.call(this, horiz, pos, tickmarkOffset, old);	
});

/**
 * Wrap the getLabelPosition function to find the center position of the label
 * based on the distance option
 */	
wrap(tickProto, 'getLabelPosition', function (proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
	var axis = this.axis,
		optionsY = labelOptions.y,
		ret,
		align = labelOptions.align,
		angle = (axis.translate(this.pos) + axis.startAngleRad + Math.PI / 2) / Math.PI * 180;
	
	if (axis.isRadial) {
		ret = axis.getPosition(this.pos, (axis.center[2] / 2) + pick(labelOptions.distance, -25));
		
		// Automatically rotated
		if (labelOptions.rotation === 'auto') {
			label.attr({ 
				rotation: angle
			});
		
		// Vertically centered
		} else if (optionsY === null) {
			optionsY = pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
		
		}
		
		// Automatic alignment
		if (align === null) {
			if (axis.isCircular) {
				if (angle > 20 && angle < 160) {
					align = 'left'; // right hemisphere
				} else if (angle > 200 && angle < 340) {
					align = 'right'; // left hemisphere
				} else {
					align = 'center'; // top or bottom
				}
			} else {
				align = 'center';
			}
			label.attr({
				align: align
			});
		}
		
		ret.x += labelOptions.x;
		ret.y += optionsY;
		
	} else {
		ret = proceed.call(this, x, y, label, horiz, labelOptions, tickmarkOffset, index, step);
	}
	return ret;
});

/**
 * Wrap the getMarkPath function to return the path of the radial marker
 */
wrap(tickProto, 'getMarkPath', function (proceed, x, y, tickLength, tickWidth, horiz, renderer) {
	var axis = this.axis,
		endPoint,
		ret;
		
	if (axis.isRadial) {
		endPoint = axis.getPosition(this.pos, axis.center[2] / 2 + tickLength);
		ret = [
			'M',
			x,
			y,
			'L',
			endPoint.x,
			endPoint.y
		];
	} else {
		ret = proceed.call(this, x, y, tickLength, tickWidth, horiz, renderer);
	}
	return ret;
});/* 
 * The AreaRangeSeries class
 * 
 */

/**
 * Extend the default options with map options
 */
defaultPlotOptions.arearange = merge(defaultPlotOptions.area, {
	lineWidth: 1,
	marker: null,
	threshold: null,
	tooltip: {
		pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>' 
	},
	trackByArea: true,
	dataLabels: {
		verticalAlign: null,
		xLow: 0,
		xHigh: 0,
		yLow: 0,
		yHigh: 0	
	},
	shadow: false
});

/**
 * Extend the point object
 */
var RangePoint = Highcharts.extendClass(Highcharts.Point, {
	/**
	 * Apply the options containing the x and low/high data and possible some extra properties.
	 * This is called on point init or from point.update. Extends base Point by adding
	 * multiple y-like values.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options, x) {
		var point = this,
			series = point.series,
			pointArrayMap = series.pointArrayMap,
			i = 0,
			j = 0,
			valueCount = pointArrayMap.length;


		// object input
		if (typeof options === 'object' && typeof options.length !== 'number') {

			// copy options directly to point
			extend(point, options);

			point.options = options;
			
		} else if (options.length) { // array
			// with leading x value
			if (options.length > valueCount) {
				if (typeof options[0] === 'string') {
					point.name = options[0];
				} else if (typeof options[0] === 'number') {
					point.x = options[0];
				}
				i++;
			}
			while (j < valueCount) {
				point[pointArrayMap[j++]] = options[i++];
			}
		}

		// Handle null and make low alias y
		/*if (point.high === null) {
			point.low = null;
		}*/
		point.y = point[series.pointValKey];
		
		// If no x is set by now, get auto incremented value. All points must have an
		// x value, however the y value can be null to create a gap in the series
		if (point.x === UNDEFINED && series) {
			point.x = x === UNDEFINED ? series.autoIncrement() : x;
		}
		
		return point;
	},
	
	/**
	 * Return a plain array for speedy calculation
	 */
	toYData: function () {
		return [this.low, this.high];
	}
});

/**
 * Add the series type
 */
seriesTypes.arearange = Highcharts.extendClass(seriesTypes.area, {
	type: 'arearange',
	pointArrayMap: ['low', 'high'],
	pointClass: RangePoint,
	pointValKey: 'low',
	
	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis;

		seriesTypes.area.prototype.translate.apply(series);

		// Set plotLow and plotHigh
		each(series.points, function (point) {
			
			if (point.y !== null) {
				point.plotLow = point.plotY;
				point.plotHigh = yAxis.translate(point.high, 0, 1, 0, 1);
			}
		});
	},
	
	/**
	 * Extend the line series' getSegmentPath method by applying the segment
	 * path to both lower and higher values of the range
	 */
	getSegmentPath: function (segment) {
		
		var highSegment = [],
			i = segment.length,
			baseGetSegmentPath = Series.prototype.getSegmentPath,
			point,
			linePath,
			lowerPath,
			options = this.options,
			step = options.step,
			higherPath;
			
		// Make a segment with plotX and plotY for the top values
		while (i--) {
			point = segment[i];
			highSegment.push({
				plotX: point.plotX,
				plotY: point.plotHigh
			});
		}
		
		// Get the paths
		lowerPath = baseGetSegmentPath.call(this, segment);
		if (step) {
			if (step === true) {
				step = 'left';
			}
			options.step = { left: 'right', center: 'center', right: 'left' }[step]; // swap for reading in getSegmentPath
		}
		higherPath = baseGetSegmentPath.call(this, highSegment);
		options.step = step;
		
		// Create a line on both top and bottom of the range
		linePath = [].concat(lowerPath, higherPath);
		
		// For the area path, we need to change the 'move' statement into 'lineTo' or 'curveTo'
		higherPath[0] = 'L'; // this probably doesn't work for spline			
		this.areaPath = this.areaPath.concat(lowerPath, higherPath);
		
		return linePath;
	},
	
	/**
	 * Extend the basic drawDataLabels method by running it for both lower and higher
	 * values.
	 */
	drawDataLabels: function () {
		
		var data = this.data,
			length = data.length,
			i,
			originalDataLabels = [],
			seriesProto = Series.prototype,
			dataLabelOptions = this.options.dataLabels,
			point,
			inverted = this.chart.inverted;
			
		if (dataLabelOptions.enabled || this._hasPointLabels) {
			
			// Step 1: set preliminary values for plotY and dataLabel and draw the upper labels
			i = length;
			while (i--) {
				point = data[i];
				
				// Set preliminary values
				point.y = point.high;
				point.plotY = point.plotHigh;
				
				// Store original data labels and set preliminary label objects to be picked up 
				// in the uber method
				originalDataLabels[i] = point.dataLabel;
				point.dataLabel = point.dataLabelUpper;
				
				// Set the default offset
				point.below = false;
				if (inverted) {
					dataLabelOptions.align = 'left';
					dataLabelOptions.x = dataLabelOptions.xHigh;								
				} else {
					dataLabelOptions.y = dataLabelOptions.yHigh;
				}
			}
			seriesProto.drawDataLabels.apply(this, arguments); // #1209
			
			// Step 2: reorganize and handle data labels for the lower values
			i = length;
			while (i--) {
				point = data[i];
				
				// Move the generated labels from step 1, and reassign the original data labels
				point.dataLabelUpper = point.dataLabel;
				point.dataLabel = originalDataLabels[i];
				
				// Reset values
				point.y = point.low;
				point.plotY = point.plotLow;
				
				// Set the default offset
				point.below = true;
				if (inverted) {
					dataLabelOptions.align = 'right';
					dataLabelOptions.x = dataLabelOptions.xLow;
				} else {
					dataLabelOptions.y = dataLabelOptions.yLow;
				}
			}
			seriesProto.drawDataLabels.apply(this, arguments);
		}
	
	},
	
	alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
	
	getSymbol: seriesTypes.column.prototype.getSymbol,
	
	drawPoints: noop
});/**
 * The AreaSplineRangeSeries class
 */

defaultPlotOptions.areasplinerange = merge(defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
seriesTypes.areasplinerange = extendClass(seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: seriesTypes.spline.prototype.getPointSpline
});/**
 * The ColumnRangeSeries class
 */
defaultPlotOptions.columnrange = merge(defaultPlotOptions.column, defaultPlotOptions.arearange, {
	lineWidth: 1,
	pointRange: null
});

/**
 * ColumnRangeSeries object
 */
seriesTypes.columnrange = extendClass(seriesTypes.arearange, {
	type: 'columnrange',
	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			plotHigh;

		colProto.translate.apply(series);

		// Set plotLow and plotHigh
		each(series.points, function (point) {
			var shapeArgs = point.shapeArgs;
			
			point.plotHigh = plotHigh = yAxis.translate(point.high, 0, 1, 0, 1);
			point.plotLow = point.plotY;
			
			// adjust shape
			shapeArgs.y = plotHigh;
			shapeArgs.height = point.plotY - plotHigh;
			
			point.trackerArgs = shapeArgs;
		});
	},
	drawGraph: noop,
	pointAttrToOptions: colProto.pointAttrToOptions,
	drawPoints: colProto.drawPoints,
	drawTracker: colProto.drawTracker,
	animate: colProto.animate
});/* 
 * The GaugeSeries class
 */



/**
 * Extend the default options
 */
defaultPlotOptions.gauge = merge(defaultPlotOptions.line, {
	dataLabels: {
		enabled: true,
		y: 15,
		borderWidth: 1,
		borderColor: 'silver',
		borderRadius: 3,
		style: {
			fontWeight: 'bold'
		},
		verticalAlign: 'top',
		zIndex: 2
	},
	dial: {
		// radius: '80%',
		// backgroundColor: 'black',
		// borderColor: 'silver',
		// borderWidth: 0,
		// baseWidth: 3,
		// topWidth: 1,
		// baseLength: '70%' // of radius
		// rearLength: '10%'
	},
	pivot: {
		//radius: 5,
		//borderWidth: 0
		//borderColor: 'silver',
		//backgroundColor: 'black'
	},
	tooltip: {
		headerFormat: ''
	},
	showInLegend: false
});

/**
 * Extend the point object
 */
var GaugePoint = Highcharts.extendClass(Highcharts.Point, {
	/**
	 * Don't do any hover colors or anything
	 */
	setState: function (state) {
		this.state = state;
	}
});


/**
 * Add the series type
 */
var GaugeSeries = {
	type: 'gauge',
	pointClass: GaugePoint,
	
	// chart.angular will be set to true when a gauge series is present, and this will
	// be used on the axes
	angular: true, 
	
	/* *
	 * Extend the bindAxes method by adding radial features to the axes
	 * /
	_bindAxes: function () {
		Series.prototype.bindAxes.call(this);
		
		extend(this.xAxis, gaugeXAxisMixin);
		extend(this.yAxis, radialAxisMixin);
		this.yAxis.onBind();
	},*/
	
	/**
	 * Calculate paths etc
	 */
	translate: function () {
		
		var series = this,
			yAxis = series.yAxis,
			center = yAxis.center;
			
		series.generatePoints();
		
		each(series.points, function (point) {
			
			var dialOptions = merge(series.options.dial, point.dial),
				radius = (pInt(pick(dialOptions.radius, 80)) * center[2]) / 200,
				baseLength = (pInt(pick(dialOptions.baseLength, 70)) * radius) / 100,
				rearLength = (pInt(pick(dialOptions.rearLength, 10)) * radius) / 100,
				baseWidth = dialOptions.baseWidth || 3,
				topWidth = dialOptions.topWidth || 1;
				
			point.shapeType = 'path';
			point.shapeArgs = {
				d: dialOptions.path || [
					'M', 
					-rearLength, -baseWidth / 2, 
					'L', 
					baseLength, -baseWidth / 2,
					radius, -topWidth / 2,
					radius, topWidth / 2,
					baseLength, baseWidth / 2,
					-rearLength, baseWidth / 2,
					'z'
				],
				translateX: center[0],
				translateY: center[1],
				rotation: (yAxis.startAngleRad + yAxis.translate(point.y, null, null, null, true)) * 180 / Math.PI
			};
			
			// Positions for data label
			point.plotX = center[0];
			point.plotY = center[1];
		});
	},
	
	/**
	 * Draw the points where each point is one needle
	 */
	drawPoints: function () {
		
		var series = this,
			center = series.yAxis.center,
			pivot = series.pivot,
			options = series.options,
			pivotOptions = options.pivot,
			renderer = series.chart.renderer;
		
		each(series.points, function (point) {
			
			var graphic = point.graphic,
				shapeArgs = point.shapeArgs,
				d = shapeArgs.d,
				dialOptions = merge(options.dial, point.dial); // #1233
			
			if (graphic) {
				graphic.animate(shapeArgs);
				shapeArgs.d = d; // animate alters it
			} else {
				point.graphic = renderer[point.shapeType](shapeArgs)
					.attr({
						stroke: dialOptions.borderColor || 'none',
						'stroke-width': dialOptions.borderWidth || 0,
						fill: dialOptions.backgroundColor || 'black',
						rotation: shapeArgs.rotation // required by VML when animation is false
					})
					.add(series.group);
			}
		});
		
		// Add or move the pivot
		if (pivot) {
			pivot.animate({ // #1235
				translateX: center[0],
				translateY: center[1]
			});
		} else {
			series.pivot = renderer.circle(0, 0, pick(pivotOptions.radius, 5))
				.attr({
					'stroke-width': pivotOptions.borderWidth || 0,
					stroke: pivotOptions.borderColor || 'silver',
					fill: pivotOptions.backgroundColor || 'black'
				})
				.translate(center[0], center[1])
				.add(series.group);
		}
	},
	
	/**
	 * Animate the arrow up from startAngle
	 */
	animate: function () {
		var series = this;

		each(series.points, function (point) {
			var graphic = point.graphic;

			if (graphic) {
				// start value
				graphic.attr({
					rotation: series.yAxis.startAngleRad * 180 / Math.PI
				});

				// animate
				graphic.animate({
					rotation: point.shapeArgs.rotation
				}, series.options.animation);
			}
		});

		// delete this function to allow it only once
		series.animate = null;
	},
	
	render: function () {
		this.group = this.plotGroup(
			'group', 
			'series', 
			this.visible ? 'visible' : 'hidden', 
			this.options.zIndex, 
			this.chart.seriesGroup
		);
		seriesTypes.pie.prototype.render.call(this);
		this.group.clip(this.chart.clipRect);
	},
	
	setData: seriesTypes.pie.prototype.setData,
	drawTracker: seriesTypes.column.prototype.drawTracker
};
seriesTypes.gauge = Highcharts.extendClass(seriesTypes.line, GaugeSeries);/**
 * Extensions for polar charts. Additionally, much of the geometry required for polar charts is
 * gathered in RadialAxes.js.
 * 
 */

var seriesProto = Series.prototype,
	mouseTrackerProto = Highcharts.MouseTracker.prototype;



/**
 * Translate a point's plotX and plotY from the internal angle and radius measures to 
 * true plotX, plotY coordinates
 */
seriesProto.toXY = function (point) {
	var xy,
		chart = this.chart,
		plotX = point.plotX,
		plotY = point.plotY;
	
	// Save rectangular plotX, plotY for later computation
	point.rectPlotX = plotX;
	point.rectPlotY = plotY;
	
	// Record the angle in degrees for use in tooltip
	point.deg = plotX / Math.PI * 180;
	
	// Find the polar plotX and plotY
	xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - plotY);
	point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
	point.plotY = point.polarPlotY = xy.y - chart.plotTop;
};


/**
 * Add some special init logic to areas and areasplines
 */
function initArea(proceed, chart, options) {
	proceed.call(this, chart, options);
	if (this.chart.polar) {
		
		/**
		 * Overridden method to close a segment path. While in a cartesian plane the area 
		 * goes down to the threshold, in the polar chart it goes to the center.
		 */
		this.closeSegment = function (path) {
			var center = this.xAxis.center;
			path.push(
				'L',
				center[0],
				center[1]
			);			
		};
		
		// Instead of complicated logic to draw an area around the inner area in a stack,
		// just draw it behind
		this.closedStacks = true;
	}
}
wrap(seriesTypes.area.prototype, 'init', initArea);
wrap(seriesTypes.areaspline.prototype, 'init', initArea);
		

/**
 * Overridden method for calculating a spline from one point to the next
 */
wrap(seriesTypes.spline.prototype, 'getPointSpline', function (proceed, segment, point, i) {
	
	var ret,
		smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc;
		denom = smoothing + 1,
		plotX, 
		plotY,
		lastPoint,
		nextPoint,
		lastX,
		lastY,
		nextX,
		nextY,
		leftContX,
		leftContY,
		rightContX,
		rightContY,
		distanceLeftControlPoint,
		distanceRightControlPoint,
		leftContAngle,
		rightContAngle,
		jointAngle;
		
		
	if (this.chart.polar) {
		
		plotX = point.plotX;
		plotY = point.plotY;
		lastPoint = segment[i - 1];
		nextPoint = segment[i + 1];
			
		// Connect ends
		if (this.connectEnds) {
			if (!lastPoint) {
				lastPoint = segment[segment.length - 2]; // not the last but the second last, because the segment is already connected
			}
			if (!nextPoint) {
				nextPoint = segment[1];
			}	
		}

		// find control points
		if (lastPoint && nextPoint) {
		
			lastX = lastPoint.plotX;
			lastY = lastPoint.plotY;
			nextX = nextPoint.plotX;
			nextY = nextPoint.plotY;
			leftContX = (smoothing * plotX + lastX) / denom;
			leftContY = (smoothing * plotY + lastY) / denom;
			rightContX = (smoothing * plotX + nextX) / denom;
			rightContY = (smoothing * plotY + nextY) / denom;
			distanceLeftControlPoint = Math.sqrt(Math.pow(leftContX - plotX, 2) + Math.pow(leftContY - plotY, 2));
			distanceRightControlPoint = Math.sqrt(Math.pow(rightContX - plotX, 2) + Math.pow(rightContY - plotY, 2));
			leftContAngle = Math.atan2(leftContY - plotY, leftContX - plotX);
			rightContAngle = Math.atan2(rightContY - plotY, rightContX - plotX);
			jointAngle = (Math.PI / 2) + ((leftContAngle + rightContAngle) / 2);
				
				
			// Ensure the right direction, jointAngle should be in the same quadrant as leftContAngle
			if (Math.abs(leftContAngle - jointAngle) > Math.PI / 2) {
				jointAngle -= Math.PI;
			}
			
			// Find the corrected control points for a spline straight through the point
			leftContX = plotX + Math.cos(jointAngle) * distanceLeftControlPoint;
			leftContY = plotY + Math.sin(jointAngle) * distanceLeftControlPoint;
			rightContX = plotX + Math.cos(Math.PI + jointAngle) * distanceRightControlPoint;
			rightContY = plotY + Math.sin(Math.PI + jointAngle) * distanceRightControlPoint;
			
			// Record for drawing in next point
			point.rightContX = rightContX;
			point.rightContY = rightContY;

		}
		
		
		// moveTo or lineTo
		if (!i) {
			ret = ['M', plotX, plotY];
		} else { // curve from last point to this
			ret = [
				'C',
				lastPoint.rightContX || lastPoint.plotX,
				lastPoint.rightContY || lastPoint.plotY,
				leftContX || plotX,
				leftContY || plotY,
				plotX,
				plotY
			];
			lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
		}
		
		
	} else {
		ret = proceed.call(this, segment, point, i);
	}
	return ret;
});

/**
 * Extend translate. The plotX and plotY values are computed as if the polar chart were a
 * cartesian plane, where plotX denotes the angle in radians and (yAxis.len - plotY) is the pixel distance from
 * center. 
 */
wrap(seriesProto, 'translate', function (proceed) {
		
	// Run uber method
	proceed.call(this);
	
	// Postprocess plot coordinates
	if (this.chart.polar && !this.preventPostTranslate) {
		var points = this.points,
			i = points.length;
		while (i--) {
			// Translate plotX, plotY from angle and radius to true plot coordinates
			this.toXY(points[i]);
		}
	}
});

/** 
 * Extend getSegmentPath to allow connecting ends across 0 to provide a closed circle in 
 * line-like series.
 */
wrap(seriesProto, 'getSegmentPath', function (proceed, segment) {
		
	var points = this.points;
	
	// Connect the path
	if (this.chart.polar && this.options.connectEnds !== false && 
			segment[segment.length - 1] === points[points.length - 1] && points[0].y !== null) {
		this.connectEnds = true; // re-used in splines
		segment = [].concat(segment, [points[0]]);
	}
	
	// Run uber method
	return proceed.call(this, segment);
	
});


function polarAnimate(proceed, init) {
	var chart = this.chart,
		animation = this.options.animation,
		group = this.group,
		markerGroup = this.markerGroup,
		center = this.xAxis.center,
		plotLeft = chart.plotLeft,
		plotTop = chart.plotTop,
		attribs;

	// Specific animation for polar charts
	if (chart.polar) {
		
		// Enable animation on polar charts only in SVG. In VML, the scaling is different, plus animation
		// would be so slow it would't matter.
		if (chart.renderer.isSVG) {

			if (animation === true) {
				animation = {};
			}
	
			// Initialize the animation
			if (init) {
				
				// Create an SVG specific attribute setter for scaleX and scaleY
				group.attrSetters.scaleX = group.attrSetters.scaleY = function (value, key) {
					this[key] = value;
					if (this.scaleX !== UNDEFINED && this.scaleY !== UNDEFINED) {
						this.element.setAttribute('transform', 'translate(' + this.translateX + ',' + this.translateY + ') scale(' + 
							this.scaleX + ',' + this.scaleY + ')');
					}
					return false;
				};
				
				// Scale down the group and place it in the center
				attribs = {
					translateX: center[0] + plotLeft,
					translateY: center[1] + plotTop,
					scaleX: 0,
					scaleY: 0
				};
					
				group.attr(attribs);
				if (markerGroup) {
					markerGroup.attrSetters = group.attrSetters;
					markerGroup.attr(attribs);
				}
				
			// Run the animation
			} else {
				attribs = {
					translateX: plotLeft,
					translateY: plotTop,
					scaleX: 1,
					scaleY: 1
				};
				group.animate(attribs, animation);
				if (markerGroup) {
					markerGroup.animate(attribs, animation);
				}
				
				// Delete this function to allow it only once
				this.animate = null;
			}
		}
	
	// For non-polar charts, revert to the basic animation
	} else {
		proceed.call(this, init);
	} 
}

// Define the animate method for both regular series and column series and their derivatives
wrap(seriesProto, 'animate', polarAnimate);
wrap(colProto, 'animate', polarAnimate);


/**
 * Throw in a couple of properties to let setTooltipPoints know we're indexing the points
 * in degrees (0-360), not plot pixel width.
 */
wrap(seriesProto, 'setTooltipPoints', function (proceed, renew) {
		
	if (this.chart.polar) {
		extend(this.xAxis, {
			tooltipLen: 360, // degrees are the resolution unit of the tooltipPoints array
			tooltipPosName: 'deg'
		});	
	}
	
	// Run uber method
	return proceed.call(this, renew);
});


/**
 * Extend the column prototype's translate method
 */
wrap(colProto, 'translate', function (proceed) {
		
	var xAxis = this.xAxis,
		len = this.yAxis.len,
		center = xAxis.center,
		startAngleRad = xAxis.startAngleRad,
		renderer = this.chart.renderer,
		start,
		points,
		point,
		i;
	
	this.preventPostTranslate = true;
	
	// Run uber method
	proceed.call(this);
	
	// Postprocess plot coordinates
	if (xAxis.isRadial) {
		points = this.points;
		i = points.length;
		while (i--) {
			point = points[i];
			start = point.barX + startAngleRad;
			point.shapeType = 'path';
			point.shapeArgs = {
				d: renderer.symbols.arc(
					center[0],
					center[1],
					len - point.plotY,
					null, 
					{
						start: start,
						end: start + point.pointWidth,
						innerR: len - pick(point.yBottom, len)
					}
				)
			};
			this.toXY(point); // provide correct plotX, plotY for tooltip
		}
	}
});


/**
 * Align column data labels outside the columns. #1199.
 */
wrap(colProto, 'alignDataLabel', function (proceed, point, dataLabel, options, alignTo, isNew) {
	
	if (this.chart.polar) {
		var angle = point.rectPlotX / Math.PI * 180,
			align,
			verticalAlign;
		
		// Align nicely outside the perimeter of the columns
		if (options.align === null) {
			if (angle > 20 && angle < 160) {
				align = 'left'; // right hemisphere
			} else if (angle > 200 && angle < 340) {
				align = 'right'; // left hemisphere
			} else {
				align = 'center'; // top or bottom
			}
			options.align = align;
		}
		if (options.verticalAlign === null) {
			if (angle < 45 || angle > 315) {
				verticalAlign = 'bottom'; // top part
			} else if (angle > 135 && angle < 225) {
				verticalAlign = 'top'; // bottom part
			} else {
				verticalAlign = 'middle'; // left or right
			}
			options.verticalAlign = verticalAlign;
		}
		
		seriesProto.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
	} else {
		proceed.call(this, point, dataLabel, options, alignTo, isNew);
	}
	
});

/**
 * Extend the mouse tracker to return the tooltip position index in terms of
 * degrees rather than pixels
 */
wrap(mouseTrackerProto, 'getIndex', function (proceed, e) {
	var ret,
		chart = this.chart,
		center,
		x,
		y;
	
	if (chart.polar) {
		center = chart.xAxis[0].center;
		x = e.chartX - center[0] - chart.plotLeft;
		y = e.chartY - center[1] - chart.plotTop;
		
		ret = 180 - Math.round(Math.atan2(x, y) / Math.PI * 180);
	
	} else {
	
		// Run uber method
		ret = proceed.call(this, e);
	}
	return ret;
});

/**
 * Extend getMouseCoordinates to prepare for polar axis values
 */
wrap(mouseTrackerProto, 'getMouseCoordinates', function (proceed, e) {
	var chart = this.chart,
		ret = {
			xAxis: [],
			yAxis: []
		};
	
	if (chart.polar) {	

		each(chart.axes, function (axis) {
			var isXAxis = axis.isXAxis,
				center = axis.center,
				x = e.chartX - center[0] - chart.plotLeft,
				y = e.chartY - center[1] - chart.plotTop;
			
			ret[isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: axis.translate(
					isXAxis ?
						Math.PI - Math.atan2(x, y) : // angle 
						Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), // distance from center
					true
				)
			});
		});
		
	} else {
		ret = proceed.call(this, e);
	}
	
	return ret;
});
}(Highcharts));
