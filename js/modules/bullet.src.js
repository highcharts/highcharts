/**
 * (c) 2010-2017 Kacper Madej
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	columnProto = seriesTypes.column.prototype,
	lineargaugeProto = seriesTypes.lineargauge.prototype;

H.SVGRenderer.prototype.symbols.rectangle = function (x, y, w, h, inverted) {
	return inverted ? [
		'M', -w / 2, y, 
		'L', -w / 2, h / 2,
		w / 2, h / 2,
		w / 2, -h / 2,
		-w / 2, -h / 2,
		'Z'
	] : [
		'M', x, w / 2, 
		'L', -h / 2, w / 2,
		-h / 2, -w / 2,
		h / 2, -w / 2,
		h / 2, w / 2,
		'Z'
	];
};

/**
 * The bullet series type.
 *
 * @constructor seriesTypes.bullet
 * @augments seriesTypes.lineargauge
 */
seriesType('bullet', 'lineargauge',
	/**
	 * A bullet graph is a variation of a bar graph. The bullet graph features
	 * a single measure, compares it to a target, and displays it in the context
	 * of qualitative ranges of performance that could be set using
	 * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
	 * 
	 * @extends {plotOptions.lineargauge}
	 * @product highcharts
	 * @sample {highcharts} highcharts/demo/bullet/ Bullet graph
	 * @since 6.0.0
	 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase,
				  onPoint,showColumn,showLine
	 * @optionparent plotOptions.bullet
	 */
	{
		/**
		 * All options related with look and positiong of targets.
		 * 
		 * @type {Object}
		 * @since 6.0.0
		 * @excluding baseLength,indent,lineColor,lineWidth,lineZIndex
		 * @product highcharts
		 */
		targetOptions: {
			width: 3,
			length: '140%',
			borderWidth: 0
		},
		tooltip: {
			/**
			 * The HTML of the point's line in the tooltip. Variables are
			 * enclosed by curly brackets. Available variables are `point.x`,
			 * `point.y`, `point.change`, `series.name` and `series.color`
			 * and other properties on the same form. Furthermore, `point.y`
			 * can be extended by the
			 * [`tooltip.valuePrefix`](#tooltip.valuePrefix) and
			 * [`tooltip.valueSuffix`](#tooltip.valueSuffix) variables.
			 * 
			 * In styled mode, defaults to `'<span
			 * class="highcharts-color-{point.colorIndex}">\u25CF</span>
			 * {series.name}: <span class="highcharts-strong">{point.y}</span>.
			 * Target: <span class="highcharts-strong">{point.target}
			 * </span><br/>'`.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @default '<span style="color:{series.color}">\u25CF</span>
			 * {series.name}: <b>{point.y}</b>.
			 * Target: <b>{point.target}</b><br/>'
			 * @product highcharts
			 * @apioption plotOptions.bullet.tooltip.pointFormat
			 */
			/*= if (build.classic) { =*/
			pointFormat: '<span style="color:{series.color}">\u25CF</span>' +
				' {series.name}: <b>{point.y}</b>.' +
				' Target: <b>{point.target}</b><br/>',
			/*= } else { =*/

			pointFormat: '' + // eslint-disable-line no-dupe-keys
				'<span class="highcharts-color-{point.colorIndex}">' +
				'\u25CF</span> {series.name}: ' +
				'<span class="highcharts-strong">{point.y}</span>. ' +
				'Target: <span class="highcharts-strong">' +
				'{point.target}</span><br/>'
			/*= } =*/
		}
	}, {
		pointArrayMap: ['y', 'target'],
		parallelArrays: ['x', 'y', 'target'],

		/**
		 * Includes target values to extend extremes from y values.
		 */
		getExtremes: function (yData) {
			var series = this,
				targetData = series.targetData,
				yMax,
				yMin;

			columnProto.getExtremes.call(this, yData);

			if (targetData && targetData.length) {
				yMax = series.dataMax;
				yMin = series.dataMin;
				columnProto.getExtremes.call(this, targetData);
				series.dataMax = Math.max(series.dataMax, yMax);
				series.dataMin = Math.min(series.dataMin, yMin);
			}
		}
	}, {
		/**
		 * Bullet shape
		 */
		shape: 'rectangle',
		destroy: function () {
			lineargaugeProto.pointClass.prototype.destroy.apply(this, arguments);
		}
	});

/**
 * A `bullet` series. If the [type](#series.bullet.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bullet](#plotOptions.bullet).
 * 
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.bullet
 * @excluding dataParser,dataURL
 * @product highcharts
 * @apioption series.bullet
 */

/**
 * An array of data points for the series. For the `bullet` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,target`. If the first value is a string,
 * it is applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 *  ```js
 *     data: [
 *         [0, 40, 75],
 *         [1, 50, 50],
 *         [2, 60, 40]
 *     ]
 *  ```
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.bullet.turboThreshold),
 * this option is not available.
 * 
 *  ```js
 *     data: [{
 *         x: 0,
 *         y: 40,
 *         target: 75,
 *         name: "Point1",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 60,
 *         target: 40,
 *         name: "Point2",
 *         color: "#FF00FF"
 *     }]
 *  ```
 * 
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.column.data
 * @product highcharts
 * @apioption series.bullet.data
 */

/**
 * The target value of a point.
 * 
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.bullet.data.target
 */
