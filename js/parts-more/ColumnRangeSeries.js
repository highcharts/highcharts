/**
 * The ColumnRangeSeries class
 */
defaultPlotOptions.columnrange = merge(defaultPlotOptions.column, defaultPlotOptions.arearange, {
	lineWidth: 1,
	pointRange: null
});

/**
 * ColumnRangeSeries object
 */
seriesTypes.columnrange = extendClass(seriesTypes.arearange, {
	type: 'columnrange',
	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			plotHigh;

		colProto.translate.apply(series);

		// Set plotLow and plotHigh
		each(series.points, function (point) {
			var shapeArgs = point.shapeArgs,
				options = series.options,
				minPointLength = pick(options.minPointLength, 0),
				dh;

			point.plotHigh = plotHigh = yAxis.translate(point.high, 0, 1, 0, 1);
			point.plotLow = point.plotY;

			// adjust shape
			shapeArgs.y = plotHigh;
			shapeArgs.height = point.plotY - plotHigh;

			if (shapeArgs.height < minPointLength) {
				dh = (minPointLength - shapeArgs.height);
				shapeArgs.height += dh;
				shapeArgs.y -= dh / 2;
			}
		});
	},
	trackerGroups: ['group', 'dataLabels'],
	drawGraph: noop,
	pointAttrToOptions: colProto.pointAttrToOptions,
	drawPoints: colProto.drawPoints,
	drawTracker: colProto.drawTracker,
	animate: colProto.animate,
	getColumnMetrics: colProto.getColumnMetrics
});
