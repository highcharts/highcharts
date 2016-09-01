'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/ScatterSeries.js';
	var extend = H.extend,
		extendClass = H.extendClass,
		Point = H.Point,
		seriesType = H.seriesType;

// The mappoint series type
seriesType('mappoint', 'scatter', {
	dataLabels: {
		enabled: true,
		formatter: function () { // #2945
			return this.point.name;
		},
		crop: false,
		defer: false,
		overflow: false,
		style: {
			color: '${palette.textHeavyColor}'
		}
	}

// Prototype members
}, {
	type: 'mappoint',
	forceDL: true

// Point class
}, {
	applyOptions: function (options, x) {
		var point = Point.prototype.applyOptions.call(this, options, x);
		if (options.lat !== undefined && options.lon !== undefined) {
			point = extend(point, this.series.chart.fromLatLonToPoint(point));
		}
		return point;
	}
});
