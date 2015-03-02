(function () {
	
	var colProto = seriesTypes.column.prototype;

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
					minPointLength = series.options.minPointLength,
					heightDifference,
					height,
					y;

				point.tooltipPos = null; // don't inherit from column
				point.plotHigh = plotHigh = yAxis.translate(point.high, 0, 1, 0, 1);
				point.plotLow = point.plotY;

				// adjust shape
				y = plotHigh;
				height = point.plotY - plotHigh;

				if (height < minPointLength) {
					heightDifference = (minPointLength - height);
					height += heightDifference;
					y -= heightDifference / 2;
				}
				shapeArgs.height = height;
				shapeArgs.y = y;
			});
		},
		directTouch: true,
		trackerGroups: ['group', 'dataLabelsGroup'],
		drawGraph: noop,
		pointAttrToOptions: colProto.pointAttrToOptions,
		drawPoints: colProto.drawPoints,
		drawTracker: colProto.drawTracker,
		animate: colProto.animate,
		getColumnMetrics: colProto.getColumnMetrics
	});
}());

