(function (H) {
	
	var colProto = H.seriesTypes.column.prototype;

	/**
	 * The ColumnRangeSeries class
	 */
	H.defaultPlotOptions.columnrange = H.merge(H.defaultPlotOptions.column, H.defaultPlotOptions.arearange, {
		lineWidth: 1,
		pointRange: null
	});

	/**
	 * ColumnRangeSeries object
	 */
	H.seriesTypes.columnrange = H.extendClass(H.seriesTypes.arearange, {
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
			H.each(series.points, function (point) {
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

				// Adjust for minPointLength
				if (Math.abs(height) < minPointLength) {
					heightDifference = (minPointLength - height);
					height += heightDifference;
					y -= heightDifference / 2;

				// Adjust for negative ranges or reversed Y axis (#1457)
				} else if (height < 0) {
					height *= -1;
					y -= height;
				}

				shapeArgs.height = height;
				shapeArgs.y = y;
			});
		},
		directTouch: true,
		trackerGroups: ['group', 'dataLabelsGroup'],
		drawGraph: H.noop,
		pointAttrToOptions: colProto.pointAttrToOptions,
		drawPoints: colProto.drawPoints,
		drawTracker: colProto.drawTracker,
		animate: colProto.animate,
		getColumnMetrics: colProto.getColumnMetrics
	});

	return H;
}(Highcharts));

