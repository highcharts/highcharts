/* 
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
});