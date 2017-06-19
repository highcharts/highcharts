/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts-more/BubbleSeries.js';
var merge = H.merge,
	Point = H.Point,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

// The mapbubble series type
if (seriesTypes.bubble) {

	seriesType('mapbubble', 'bubble', 
	/**
	 * @extends {plotOptions.bubble}
	 * @optionparent plotOptions.mapbubble
	 */
	{

		/**
		 */
		animationLimit: 500,

		/**
		 */
		tooltip: {

			/**
			 */
			pointFormat: '{point.name}: {point.z}'
		}

	// Prototype members
	}, {
		xyFromShape: true,
		type: 'mapbubble',
		pointArrayMap: ['z'], // If one single value is passed, it is interpreted as z
		/**
		 * Return the map area identified by the dataJoinBy option
		 */
		getMapData: seriesTypes.map.prototype.getMapData,
		getBox: seriesTypes.map.prototype.getBox,
		setData: seriesTypes.map.prototype.setData

	// Point class
	}, {
		applyOptions: function (options, x) {
			var point;
			if (options && options.lat !== undefined && options.lon !== undefined) {
				point = Point.prototype.applyOptions.call(
					this,
					merge(options, this.series.chart.fromLatLonToPoint(options)),
					x
				);
			} else {
				point = seriesTypes.map.prototype.pointClass.prototype.applyOptions.call(this, options, x);
			}
			return point;
		},
		ttBelow: false
	});
}
