// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v2.2.0 (2012-02-16)
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
	defaultPlotOptions = Highcharts.getOptions().plotOptions,
	seriesTypes = Highcharts.seriesTypes,
	Axis = Highcharts.Axis,
	Tick = Highcharts.Tick,
	Series = Highcharts.Series,
	noop = function () {};/* 
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
 * http://jsfiddle.net/highcharts/qPeFM/
 * 
 */

/**
 * Extend the default options
 */
defaultPlotOptions.gauge = merge(defaultPlotOptions.line, {
	center: ['50%', '50%'],
	colorByPoint: true,
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
	size: '100%'
});

/**
 * Extend the point object
 */
var GaugePoint = Highcharts.extendClass(Highcharts.Point, {
	
});

/**
 * Augmented methods for the value axis
 */
var gaugeValueAxisMixin = {
	isRadial: true,
	/**
	 * Get the path for the axis line
	 */
	getLinePath: function (lineWidth) {
		var center = this.center,
			options = this.options,
			radius = center[2] / 2;
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			center[2] / 2,
			center[2] / 2,
			{
				start: options.startAngle,
				end: options.endAngle,
				innerR: 0
			}
		);
	},
	
	/**
	 * Override setAxisSize by setting the width and height to the difference
	 * in rotation. This allows the translate method to return angle for 
	 * any given value.
	 */
	setAxisTranslation: function () {
		var options = this.options;
		
		Axis.prototype.setAxisTranslation.call(this);
		
		this.transA = (options.endAngle - options.startAngle) / ((this.max - this.min) || 1);
	},
	
	/**
	 * Returns the x, y coordinate of a point given by a value and a pixel distance
	 * from center
	 */
	getPosition: function (value, length) {
		var chart = this.chart,
			center = this.center,
			angle = this.options.startAngle + this.translate(value);
			
		radius = pick(length, center[2] / 2);
		
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
			startAngle = this.options.startAngle,
			fullRadius = center[2] / 2,
			radii = [
				pick(options.outerRadius, '100%'),
				pick(options.innerRadius, '90%')
			],
			percentRegex = /%$/;
			
		// Convert percentages to pixel values
		radii = map(radii, function (radius) {
			if (percentRegex.test(radius)) {
				radius = (parseInt(radius, 10) * fullRadius) / 100;
			}
			return radius;
		});
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radii[0],
			radii[1],
			{
				start: startAngle + this.translate(from),
				end: startAngle + this.translate(to),
				innerR: radii[1]
			}
		);
		
	}
	
};

/**
 * Add special cases within the Tick class' getPosition method for radial axes
 */
var tickProto = Tick.prototype,
	uberGetPosition = tickProto.getPosition,
	uberGetMarkPath = tickProto.getMarkPath;
	
tickProto.getPosition = function (x, y) {
	var axis = this.axis;
		
	return axis.isRadial ? 
		axis.getPosition(y) :
		uberGetPosition.apply(this, arguments);	
};
/**
 * Return the path of the marker
 */
tickProto.getMarkPath = function (x, y, tickLength, tickWidth) {
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
		ret = uberGetMarkPath.apply(this, arguments);
	}
	return ret;
};

/**
 * Augmented methods for the x axis in order to hide it completely
 */
var gaugeXAxisMixin = {
	setScale: noop,
	render: noop
};

/**
 * Add the series type
 */
seriesTypes.gauge = Highcharts.extendClass(seriesTypes.line, {
	type: 'gauge',
	pointClass: GaugePoint,
	
	bindAxes: function () {
		Series.prototype.bindAxes.call(this);
		
		extend(this.xAxis, gaugeXAxisMixin);
		extend(this.yAxis, gaugeValueAxisMixin);
	},
	
	translate: function () {
		
		var series = this,
			yAxis = series.yAxis,
			center,
			position;
			
		series.generatePoints();
		
		center = series.center = yAxis.center = seriesTypes.pie.prototype.getCenter.call(series);
		
		each(series.points, function (point) {
			point.path = ['M', center[0], center[1], 'L', center[0] + center[2] / 2, center[1]];
			point.rotation = (yAxis.options.startAngle + yAxis.translate(point.y)) * 180 / Math.PI;
			
			// Positions for data label
			point.plotX = center[0];
			point.plotY = center[1];
		});
		//this.setTooltipPoints();
	},
	
	drawPoints: function () {
		
		var series = this,
			center = series.center;
		
		each(series.points, function (point) {
			
			var graphic = point.graphic,
				path = point.path,
				rotation = point.rotation;
			
			if (graphic) {
				graphic
					.animate({
						d: path,
						rotation: rotation
					});
			} else {
				point.graphic = series.chart.renderer.path(path)
					.attr({
						'stroke': point.color,
						'stroke-width': 2,
						x: center[0],
						y: center[1],
						rotation: rotation
					})
					.add(series.group);
			}
		});		
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
					rotation: series.yAxis.options.startAngle * 180 / Math.PI
				});

				// animate
				graphic.animate({
					rotation: point.rotation
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
	drawTracker: noop
});
}(Highcharts));
