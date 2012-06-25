// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v2.2.5 (2012-06-08)
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
	Axis = Highcharts.Axis,
	Tick = Highcharts.Tick,
	Series = Highcharts.Series,
	noop = function () {};
var axisProto = Axis.prototype,
	tickProto = Tick.prototype;
	
/**
 * Augmented methods for the x axis in order to hide it completely, used for the X axis in gauges
 */
var hiddenAxisMixin = {
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
var radialAxisMixin = {
	isRadial: true,
	
	/**
	 * The default options extend defaultYAxisOptions
	 */
	defaultRadialGaugeOptions: {
		center: ['50%', '50%'],
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
		size: ['90%'],
		tickLength: 10,
		tickPosition: 'inside',
		tickWidth: 2,
		title: {
			rotation: 0
		},
		zIndex: 2 // behind dials, points in the series group
	},
	
	defaultRadialXOptions: {
		center: ['50%', '50%'],
		labels: {
			align: 'center',
			distance: 15,
			x: 0,
			y: null // auto
		},
		maxPadding: 0,
		minPadding: 0,
		size: ['90%']
		
	},
	
	defaultRadialYOptions: {
		center: ['50%', '50%'],
		labels: {
			align: 'left',
			x: 3,
			y: -2
		},
		size: ['90%'],
		title: {
			x: -4,
			text: null
		}
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
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		
		var axis = this,
			options;
		
		axis.options = options = merge(
			axis.defaultOptions,
			axis.isXAxis ? {} : axis.defaultYAxisOptions,
			axis.defaultRadialOptions,
			userOptions
		);
		
		// Handle backgrounds
		// In the first parameter, pick up the background options, or use one empty object that is
		// filled with default background options. Concatenate this with an empty array, which creates
		// a copy so that the .reverse() operation is not repeated for export.
		each([].concat(Highcharts.splat(userOptions.background || {})).reverse(), function (config) {
			config = merge(axis.defaultBackgroundOptions, config);
			config.color = config.backgroundColor; // due to naming in plotBands
			
			options.plotBands.unshift(config);
		});
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
		this.center = seriesTypes.pie.prototype.getCenter.call(this);
	},

	/**
	 * Get the path for the axis line. This method is borrowed by the angularAxisMixin's getPlotLinePath
	 * method.
	 */
	getLinePath: function (radius) {
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
			this.transA = this.isCircular ? 
				(this.endAngleRad - this.startAngleRad) / ((this.max - this.min + (this.closestPointRange || 0)) || 1) : 
				(this.center[2] / 2) / ((this.max - this.min) || 1);
			
			this.minPixelPadding = this.transA * ((this.pointRange || 0) / 2);
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
			open;
			
		// Convert percentages to pixel values
		radii = map(radii, function (radius) {
			if (percentRegex.test(radius)) {
				radius = (pInt(radius, 10) * fullRadius) / 100;
			}
			return radius;
		});
		
		// Handle full circle
		if (options.shape === 'circle') {
			start = -Math.PI / 2;
			end = Math.PI * 1.5;
			open = true;
		} else {
			start = startAngleRad + this.translate(from);
			end = startAngleRad + this.translate(to);
		}
		
		return this.chart.renderer.symbols.arc(
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
	},
	
	/**
	 * Find the path for plot lines perpendicular to the radial axis.
	 */
	getPlotLinePath: function (value) {
		var center = this.center,
			chart = this.chart,
			end = this.getPosition(value),
			ret;
			
		if (this.isCircular) {
			// Spokes 
			ret = ['M', center[0] + chart.plotLeft, center[1] + chart.plotTop, 'L', end.x, end.y];
		
		} else {
			// Concentric circles
			ret = radialAxisMixin.getLinePath.call(this, this.translate(value));
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
			y: chart.plotTop + center[1] - ({ high: 0.5, middle: 0.25, low: 0 }[this.options.title.align] * 
				center[2]) + (titleOptions.y || 0)  
		};
	}
	
};


/**
 * Override axisProto.init to mix in special axis instance functions and function overrides
 */
axisProto.init = (function (func) {
	return function (chart, userOptions) {
		var angular = chart.angular,
			polar = chart.polar,
			isX = userOptions.isX,
			isCircular,
			options;
			
		// Before prototype.init
		if (angular) {
			extend(this, isX ? hiddenAxisMixin : radialAxisMixin);
			isCircular =  !isX;
			if (isCircular) {
				this.defaultRadialOptions = this.defaultGaugeOptions;
			}
			
		} else if (polar) {
			//extend(this, userOptions.isX ? radialAxisMixin : radialAxisMixin);
			extend(this, radialAxisMixin);
			isCircular = isX;
			this.defaultRadialOptions = isX ? this.defaultRadialXOptions : this.defaultRadialYOptions;
		}
		
		// Run prototype.init
		func.apply(this, arguments);
		
		// After prototype.init
		if (angular || polar) {
			// Start and end angle options are
			// given in degrees relative to top, while internal computations are
			// in radians relative to right (like SVG).
			options = this.options;
			this.startAngleRad = (options.startAngle - 90) * Math.PI / 180;
			this.endAngleRad = (options.endAngle - 90) * Math.PI / 180;
			this.offset = options.offset || 0;
			
			this.isCircular = isCircular;
		}
		
		
	};
}(axisProto.init));

/**
 * Add special cases within the Tick class' methods for radial axes. 
 * TODO: If we go for a RadialAxis class, add a RadialTick class too.
 */	
tickProto.getPosition = (function (func) {
	return function () {
		var axis = this.axis,
			args = arguments;
		
		return axis.getPosition ? 
			axis.getPosition(args[1]) :
			func.apply(this, args);	
	};
}(tickProto.getPosition));

/**
 * Wrap the getLabelPosition function to find the center position of the label
 * based on the distance option
 */	
tickProto.getLabelPosition = (function (func) {
	return function () {
		var axis = this.axis,
			labelOptions = axis.options.labels,
			label = this.label,
			optionsY = labelOptions.y,
			ret;
		
		if (axis.isRadial) {
			ret = axis.getPosition(this.pos, (axis.center[2] / 2) + pick(labelOptions.distance, -25));
			
			// Automatically rotated
			if (labelOptions.rotation === 'auto') {
				label.attr({ 
					rotation: (axis.translate(this.pos) + axis.startAngleRad + Math.PI / 2) / Math.PI * 180  
				});
			
			// Vertically centered
			} else if (optionsY === null) {
				optionsY = pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
			}
			
			ret.x += labelOptions.x;
			ret.y += optionsY;
			
		} else {
			ret = func.apply(this, arguments);
		}
		return ret;
	};
}(tickProto.getLabelPosition));

/**
 * Wrap the getMarkPath function to return the path of the radial marker
 */
tickProto.getMarkPath = (function (func) {
	return function (x, y, tickLength) {
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
			ret = func.apply(this, arguments);
		}
		return ret;
	};
}(tickProto.getMarkPath));/* 
 * The AreaRangeSeries class
 * 
 * http://jsfiddle.net/highcharts/DFANM/
 * 
 * TODO:
 * - Check out inverted
 * - Disable stateMarker (or concatenize paths for the markers?)
 * - Test series.data point config formats
 */

/**
 * Extend the default options with map options
 */
defaultPlotOptions.arearange = merge(defaultPlotOptions.area, {
	lineWidth: 0,
	threshold: null,
	tooltip: {
		pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.low} - {point.high}' 
	},
	trackByArea: true,
	dataLabels: {
		yHigh: -6,
		yLow: 16
	}
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
	applyOptions: function (options) {
		var point = this,
			series = point.series,
			i = 0;


		// object input
		if (typeof options === 'object' && typeof options.length !== 'number') {

			// copy options directly to point
			extend(point, options);

			point.options = options;
			
		} else if (options.length) { // array
			// with leading x value
			if (options.length === 3) {
				if (typeof options[0] === 'string') {
					point.name = options[0];
				} else if (typeof options[0] === 'number') {
					point.x = options[0];
				}
				i++;
			}
			point.low = options[i++];
			point.high = options[i++];
		}

		// Handle null and make low alias y
		if (point.high === null) {
			point.low = null;
		}
		point.y = point.low;
		
		// If no x is set by now, get auto incremented value. All points must have an
		// x value, however the y value can be null to create a gap in the series
		if (point.x === UNDEFINED && series) {
			point.x = series.autoIncrement();
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
	valueCount: 2, // two values per point
	pointClass: RangePoint, 
	
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
		higherPath = baseGetSegmentPath.call(this, highSegment);
		
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
		
		var points = this.points,
			length = points.length,
			i,
			originalDataLabels = [],
			uberMethod = Series.prototype.drawDataLabels,
			dataLabelOptions = this.options.dataLabels,
			point;
			
		// Step 1: set preliminary values for plotY and dataLabel and draw the upper labels
		i = length;
		while (i--) {
			point = points[i];
			
			// Set preliminary values
			point.y = point.high;
			point.plotY = point.plotHigh;
			
			// Store original data labels and set preliminary label objects to be picked up 
			// in the uber method
			originalDataLabels[i] = point.dataLabel;
			point.dataLabel = point.dataLabelUpper;
			
			// Set the default y offset
			dataLabelOptions.y = dataLabelOptions.yHigh;
		}
		uberMethod.apply(this, arguments);
		
		// Step 2: reorganize and handle data labels for the lower values
		i = length;
		while (i--) {
			point = points[i];
			
			// Move the generated labels from step 1, and reassign the original data labels
			point.dataLabelUpper = point.dataLabel;
			point.dataLabel = originalDataLabels[i];
			
			// Reset values
			point.y = point.low;
			point.plotY = point.plotLow;
			
			// Set the default y offset
			dataLabelOptions.y = dataLabelOptions.yLow;
		}
		uberMethod.apply(this, arguments);
	
	},
	
	drawPoints: noop
});/* 
 * The GaugeSeries class
 * 
 * Speedometer: http://jsfiddle.net/highcharts/qPeFM/
 * Clock:       http://jsfiddle.net/highcharts/BFN2F/
 * Minimal:     http://jsfiddle.net/highcharts/9XgY7/
 * 
 * TODO:
 * - Radial gradients.
 *	 - Fix issue with linearGradient being present from merging background options
 *	 - Experiment more with pattern in VML
 * - Size to the actual space given, for example by vu-meters
 * - Dials are not perfectly centered in IE. Consider altering translation in updateTransform.
 * - Missing axis line in IE, dual axes example
 */



/**
 * Extend the default options
 */
defaultPlotOptions.gauge = merge(defaultPlotOptions.line, {
	dataLabels: {
		enabled: true,
		y: 30,
		borderWidth: 1,
		borderColor: 'silver',
		borderRadius: 3,
		style: {
			fontWeight: 'bold'
		}
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
					-rearLength, baseWidth / 2
				],
				translateX: center[0],
				translateY: center[1],
				rotation: (yAxis.startAngleRad + yAxis.translate(point.y)) * 180 / Math.PI
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
			dialOptions = options.dial;
		
		each(series.points, function (point) {
			
			var graphic = point.graphic,
				shapeArgs = point.shapeArgs,
				d = shapeArgs.d;
			
			if (graphic) {
				graphic.animate(shapeArgs);
				shapeArgs.d = d; // animate alters it
			} else {
				point.graphic = series.chart.renderer[point.shapeType](shapeArgs)
					.attr({
						stroke: dialOptions.borderColor || 'none',
						'stroke-width': dialOptions.borderWidth || 0,
						fill: dialOptions.backgroundColor || 'black'
					})
					.add(series.group);
			}
		});
		
		// Add or move the pivot
		if (pivot) {
			pivot.animate({
				cx: center[0],
				cy: center[1]
			});
		} else {
			series.pivot = series.chart.renderer.circle(center[0], center[1], pick(pivotOptions.radius, 5))
				.attr({
					'stroke-width': pivotOptions.borderWidth || 0,
					stroke: pivotOptions.borderColor || 'silver',
					fill: pivotOptions.backgroundColor || 'black'
				})
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
		this.createGroup();
		seriesTypes.pie.prototype.render.call(this);
	},
	
	setData: seriesTypes.pie.prototype.setData,
	drawTracker: seriesTypes.column.prototype.drawTracker
};
seriesTypes.gauge = Highcharts.extendClass(seriesTypes.line, GaugeSeries);/**
 * Extensions for polar charts
 * 
 * - http://jsfiddle.net/highcharts/2Y5yF/
 */

var seriesProto = Series.prototype,
	columnProto = seriesTypes.column.prototype;



/**
 * Translate a point's plotX and plotY from the internal angle and radius measures to 
 * true plotX, plotY coordinates
 */
seriesProto.toXY = function (point) {
	var xy,
		chart = this.chart;
	
	// save rectangular plotX, plotY for later computation
	point.rectPlotX = point.plotX;
	point.rectPlotY = point.plotY;
	
	// find the polar plotX and plotY
	xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - point.plotY);
	point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
	point.plotY = point.polarPlotY = xy.y - chart.plotTop;
};

/**
 * Override translate. The plotX and plotY values are computed as if the polar chart were a
 * cartesian plane, where plotX denotes the angle in radians and (yAxis.len - plotY) is the pixel distance from
 * center. 
 */
seriesProto.translate = (function (func) {
	return function () {
		
		// Run uber method
		func.apply(this, arguments);
		
		// Postprocess plot coordinates
		if (this.xAxis.getPosition && this.type !== 'column') { // TODO: do not use this.type
			var points = this.points,
				i = points.length;
			while (i--) {
				// Translate plotX, plotY from angle and radius to true plot coordinates
				this.toXY(points[i]);
			}
		}
	};
}(seriesProto.translate));

columnProto.translate = (function (func) {
	return function () {
		
		var xAxis = this.xAxis,
			len = this.yAxis.len,
			center = xAxis.center,
			startAngleRad = xAxis.startAngleRad,
			renderer = this.chart.renderer,
			points,
			point,
			i;
		
		// Run uber method
		func.apply(this, arguments);
		
		// Postprocess plot coordinates
		if (xAxis.isRadial) {
			points = this.points;
			i = points.length;
			while (i--) {
				point = points[i];
				point.shapeType = 'path';
				point.shapeArgs = {
					d: renderer.symbols.arc(
						center[0],
						center[1],
						len - point.plotY,
						null, 
						{
							start: startAngleRad + point.barX,
							end: startAngleRad + point.barX + point.pointWidth,
							innerR: len - point.yBottom
						}
					)
				};
				this.toXY(point); // provide correct plotX, plotY for tooltip
			}
		}
	};
}(columnProto.translate));


/*seriesProto.getSegmentPath = (function (func) {
	return function () {
		
		var segmentPath,
			i,
			xy,
			chart = this.chart,
			isRadial = this.xAxis.isRadial;
		
		// To rectangle coordinate system
		if (isRadial) {
			each(this.points, function (point) {
				point.plotX = point.rectPlotX;
				point.plotY = point.rectPlotY;
			});
		}
		
		// Run uber method
		segmentPath = func.apply(this, arguments);
		
		if (isRadial) {
			for (i = 0; i < segmentPath.length; i++) {
				if (typeof segmentPath[i] === 'number') {
					xy = this.xAxis.postTranslate(segmentPath[i], this.yAxis.len - segmentPath[i + 1]);
					segmentPath[i] = xy.x - chart.plotLeft;
					segmentPath[i + 1] = xy.y - chart.plotTop;
					i = i + 1;
				}
			}
			
			// To polar coordinate system
			each(this.points, function (point) {
				point.plotX = point.polarPlotX;
				point.plotY = point.polarPlotY;
			});
		}
		return segmentPath;
	};
}(seriesProto.getSegmentPath));*/

}(Highcharts));
