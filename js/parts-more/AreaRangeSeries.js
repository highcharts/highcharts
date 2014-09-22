/* 
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
		pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
	},
	trackByArea: true,
	dataLabels: {
		align: null,
		verticalAlign: null,
		xLow: 0,
		xHigh: 0,
		yLow: 0,
		yHigh: 0	
	},
	states: {
		hover: {
			halo: false
		}
	}
});

/**
 * Add the series type
 */
seriesTypes.arearange = extendClass(seriesTypes.area, {
	type: 'arearange',
	pointArrayMap: ['low', 'high'],
	toYData: function (point) {
		return [point.low, point.high];
	},
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

			var low = point.low,
				high = point.high,
				plotY = point.plotY;

			if (high === null || low === null) {
				point.isNull = true;
			} else {
				point.plotLow = plotY;
				point.plotHigh = yAxis.translate(high, 0, 1, 0, 1);
			}
		});
	},
	
	/**
	 * Extend the line series' getSegmentPath method by applying the segment
	 * path to both lower and higher values of the range
	 */
	getGraphPath: function () {
		
		var points = this.points,
			highPoints = [],
			highAreaPoints = [],
			i = points.length,
			getGraphPath = Series.prototype.getGraphPath,
			point,
			pointShim,
			linePath,
			lowerPath,
			options = this.options,
			step = options.step,
			higherPath,
			higherAreaPath;

		// Create the top line and the top part of the area fill. The area fill compensates for 
		// null points by drawing down to the lower graph, moving across the null gap and 
		// starting again at the lower graph.
		i = points.length;
		while (i--) {
			point = points[i];
		
			if (!point.isNull && (!points[i + 1] || points[i + 1].isNull)) {
				highAreaPoints.push({
					plotX: point.plotX,
					plotY: point.plotLow
				});
			}
			pointShim = {
				plotX: point.plotX,
				plotY: point.plotHigh,
				isNull: point.isNull
			};
			highAreaPoints.push(pointShim);
			highPoints.push(pointShim);
			if (!point.isNull && (!points[i - 1] || points[i - 1].isNull)) {
				highAreaPoints.push({
					plotX: point.plotX,
					plotY: point.plotLow
				});
			}
		}
		
		// Get the paths
		lowerPath = getGraphPath.call(this, points);
		if (step) {
			if (step === true) {
				step = 'left';
			}
			options.step = { left: 'right', center: 'center', right: 'left' }[step]; // swap for reading in getGraphPath
		}
		higherPath = getGraphPath.call(this, highPoints);
		higherAreaPath = getGraphPath.call(this, highAreaPoints);
		options.step = step;

		// Create a line on both top and bottom of the range
		linePath = [].concat(lowerPath, higherPath);
		
		// For the area path, we need to change the 'move' statement into 'lineTo' or 'curveTo'
		higherPath[0] = 'L'; // this probably doesn't work for spline			
		this.areaPath = this.areaPath.concat(lowerPath, higherAreaPath, 'z');
		
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
			align = dataLabelOptions.align,
			point,
			inverted = this.chart.inverted;
			
		if (dataLabelOptions.enabled || this._hasPointLabels) {
			
			// Step 1: set preliminary values for plotY and dataLabel and draw the upper labels
			i = length;
			while (i--) {
				point = data[i];
				
				// Set preliminary values
				point.y = point.high;
				point._plotY = point.plotY;
				point.plotY = point.plotHigh;
				
				// Store original data labels and set preliminary label objects to be picked up 
				// in the uber method
				originalDataLabels[i] = point.dataLabel;
				point.dataLabel = point.dataLabelUpper;
				
				// Set the default offset
				point.below = false;
				if (inverted) {
					if (!align) {
						dataLabelOptions.align = 'left';
					}
					dataLabelOptions.x = dataLabelOptions.xHigh;								
				} else {
					dataLabelOptions.y = dataLabelOptions.yHigh;
				}
			}
			
			if (seriesProto.drawDataLabels) {
				seriesProto.drawDataLabels.apply(this, arguments); // #1209
			}
			
			// Step 2: reorganize and handle data labels for the lower values
			i = length;
			while (i--) {
				point = data[i];
				
				// Move the generated labels from step 1, and reassign the original data labels
				point.dataLabelUpper = point.dataLabel;
				point.dataLabel = originalDataLabels[i];
				
				// Reset values
				point.y = point.low;
				point.plotY = point._plotY;
				
				// Set the default offset
				point.below = true;
				if (inverted) {
					if (!align) {
						dataLabelOptions.align = 'right';
					}
					dataLabelOptions.x = dataLabelOptions.xLow;
				} else {
					dataLabelOptions.y = dataLabelOptions.yLow;
				}
			}
			if (seriesProto.drawDataLabels) {
				seriesProto.drawDataLabels.apply(this, arguments);
			}
		}

		dataLabelOptions.align = align;
	
	},
	
	alignDataLabel: function () {
		seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
	},
	
	getSymbol: noop,
	
	drawPoints: noop
});