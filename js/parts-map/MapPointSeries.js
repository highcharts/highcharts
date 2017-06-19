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
import '../parts/ScatterSeries.js';
var merge = H.merge,
	Point = H.Point,
	seriesType = H.seriesType;

// The mappoint series type
seriesType('mappoint', 'scatter', 

	/**
	 * @extends plotOptions.scatter
	 * @optionparent plotOptions.mappoint
	 */
	{

	/**
	 */
	dataLabels: {

		/**
		 */
		enabled: true,

		/**
		 */
		formatter: function () { // #2945
			return this.point.name;
		},

		/**
		 */
		crop: false,

		/**
		 */
		defer: false,

		/**
		 */
		overflow: false,

		/**
		 */
		style: {

			/**
			 */
			color: '${palette.neutralColor100}'
		}
	}

// Prototype members
}, {
	type: 'mappoint',
	forceDL: true

// Point class
}, {
	applyOptions: function (options, x) {
		var mergedOptions = options.lat !== undefined && options.lon !== undefined ? merge(options, this.series.chart.fromLatLonToPoint(options)) : options;
		return Point.prototype.applyOptions.call(this, mergedOptions, x);
	}
});
