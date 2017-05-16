/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
var each = H.each,
	noop = H.noop,
	pick = H.pick,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;
/* 
 * The arearangeseries series type
 */
seriesType('arearange', 'area', {
	/*= if (build.classic) { =*/
	lineWidth: 1,
	/*= } =*/
	marker: null,
	threshold: null,
	tooltip: {
		/*= if (!build.classic) { =*/
		pointFormat: '<span class="highcharts-color-{series.colorIndex}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>',
		/*= } else { =*/
		pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>' // eslint-disable-line no-dupe-keys
		/*= } =*/
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

// Prototype members
}, {
	pointArrayMap: ['low', 'high'],
	dataLabelCollections: ['dataLabel', 'dataLabelUpper'],
	toYData: function (point) {
		return [point.low, point.high];
	},
	pointValKey: 'low',
	deferTranslatePolar: true,

	/**
	 * Translate a point's plotHigh from the internal angle and radius measures to
	 * true plotHigh coordinates. This is an addition of the toXY method found in
	 * Polar.js, because it runs too early for arearanges to be considered (#3419).
	 */
	highToXY: function (point) {
		// Find the polar plotX and plotY
		var chart = this.chart,
			xy = this.xAxis.postTranslate(point.rectPlotX, this.yAxis.len - point.plotHigh);
		point.plotHighX = xy.x - chart.plotLeft;
		point.plotHigh = xy.y - chart.plotTop;
	},

	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			hasModifyValue = !!series.modifyValue;

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
				point.plotHigh = yAxis.translate(
					hasModifyValue ? series.modifyValue(high, point) : high,
					0,
					1,
					0,
					1
				);
				if (hasModifyValue) {
					point.yBottom = point.plotHigh;
				}
			}
		});

		// Postprocess plotHigh
		if (this.chart.polar) {
			each(this.points, function (point) {
				series.highToXY(point);
			});
		}
	},

	/**
	 * Extend the line series' getSegmentPath method by applying the segment
	 * path to both lower and higher values of the range
	 */
	getGraphPath: function (points) {
		
		var highPoints = [],
			highAreaPoints = [],
			i,
			getGraphPath = seriesTypes.area.prototype.getGraphPath,
			point,
			pointShim,
			linePath,
			lowerPath,
			options = this.options,
			connectEnds = this.chart.polar && options.connectEnds !== false,
			connectNulls = options.connectNulls,
			step = options.step,
			higherPath,
			higherAreaPath;

		points = points || this.points;
		i = points.length;

		// Create the top line and the top part of the area fill. The area fill compensates for 
		// null points by drawing down to the lower graph, moving across the null gap and 
		// starting again at the lower graph.
		i = points.length;
		while (i--) {
			point = points[i];
		
			if (
				!point.isNull &&
				!connectEnds &&
				!connectNulls &&
				(!points[i + 1] || points[i + 1].isNull)
			) {
				highAreaPoints.push({
					plotX: point.plotX,
					plotY: point.plotY,
					doCurve: false // #5186, gaps in areasplinerange fill
				});
			}
			
			pointShim = {
				polarPlotY: point.polarPlotY,
				rectPlotX: point.rectPlotX,
				yBottom: point.yBottom,
				plotX: pick(point.plotHighX, point.plotX), // plotHighX is for polar charts
				plotY: point.plotHigh,
				isNull: point.isNull
			};
			
			highAreaPoints.push(pointShim);

			highPoints.push(pointShim);
			
			if (
				!point.isNull &&
				!connectEnds &&
				!connectNulls &&
				(!points[i - 1] || points[i - 1].isNull)
			) {
				highAreaPoints.push({
					plotX: point.plotX,
					plotY: point.plotY,
					doCurve: false // #5186, gaps in areasplinerange fill
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
		if (!this.chart.polar && higherAreaPath[0] === 'M') {
			higherAreaPath[0] = 'L'; // this probably doesn't work for spline			
		}

		this.graphPath = linePath;
		this.areaPath = this.areaPath.concat(lowerPath, higherAreaPath);

		// Prepare for sideways animation
		linePath.isArea = true;
		linePath.xMap = lowerPath.xMap;
		this.areaPath.xMap = lowerPath.xMap;

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
			verticalAlign = dataLabelOptions.verticalAlign,
			inside = dataLabelOptions.inside,
			point,
			up,
			inverted = this.chart.inverted;

		if (dataLabelOptions.enabled || this._hasPointLabels) {

			// Step 1: set preliminary values for plotY and dataLabel and draw the upper labels
			i = length;
			while (i--) {
				point = data[i];
				if (point) {
					up = inside ? point.plotHigh < point.plotLow : point.plotHigh > point.plotLow;

					// Set preliminary values
					point.y = point.high;
					point._plotY = point.plotY;
					point.plotY = point.plotHigh;

					// Store original data labels and set preliminary label objects to be picked up
					// in the uber method
					originalDataLabels[i] = point.dataLabel;
					point.dataLabel = point.dataLabelUpper;

					// Set the default offset
					point.below = up;
					if (inverted) {
						if (!align) {
							dataLabelOptions.align = up ? 'right' : 'left';
						}
					} else {
						if (!verticalAlign) {
							dataLabelOptions.verticalAlign = up ? 'top' : 'bottom';
						}
					}

					dataLabelOptions.x = dataLabelOptions.xHigh;
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
				if (point) {
					up = inside ? point.plotHigh < point.plotLow : point.plotHigh > point.plotLow;

					// Move the generated labels from step 1, and reassign the original data labels
					point.dataLabelUpper = point.dataLabel;
					point.dataLabel = originalDataLabels[i];

					// Reset values
					point.y = point.low;
					point.plotY = point._plotY;

					// Set the default offset
					point.below = !up;
					if (inverted) {
						if (!align) {
							dataLabelOptions.align = up ? 'left' : 'right';
						}
					} else {
						if (!verticalAlign) {
							dataLabelOptions.verticalAlign = up ? 'bottom' : 'top';
						}
						
					}

					dataLabelOptions.x = dataLabelOptions.xLow;
					dataLabelOptions.y = dataLabelOptions.yLow;
				}
			}
			if (seriesProto.drawDataLabels) {
				seriesProto.drawDataLabels.apply(this, arguments);
			}
		}

		dataLabelOptions.align = align;
		dataLabelOptions.verticalAlign = verticalAlign;
	},

	alignDataLabel: function () {
		seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
	},

	setStackedPoints: noop,

	getSymbol: noop,

	drawPoints: noop
});
