import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/ScatterSeries.js';
	var defaultPlotOptions = H.defaultPlotOptions,
		extend = H.extend,
		extendClass = H.extendClass,
		merge = H.merge,
		Point = H.Point,
		seriesTypes = H.seriesTypes;

// The mappoint series type
defaultPlotOptions.mappoint = merge(defaultPlotOptions.scatter, {
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
});
seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
	type: 'mappoint',
	forceDL: true,
	pointClass: extendClass(Point, {
		applyOptions: function (options, x) {
			var point = Point.prototype.applyOptions.call(this, options, x);
			if (options.lat !== undefined && options.lon !== undefined) {
				point = extend(point, this.series.chart.fromLatLonToPoint(point));
			}
			return point;
		}
	})
});
