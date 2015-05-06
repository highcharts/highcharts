(function () {
	
	var colProto = Highcharts.seriesTypes.column.prototype;

	/**
	 * The ColumnRangeSeries class
	 */
	Highcharts.defaultPlotOptions.columnrange = Highcharts.merge(Highcharts.defaultPlotOptions.column, Highcharts.defaultPlotOptions.arearange, {
		lineWidth: 1,
		pointRange: null
	});

	/**
	 * ColumnRangeSeries object
	 */
	Highcharts.seriesTypes.columnrange = Highcharts.extendClass(Highcharts.seriesTypes.arearange, {
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
			Highcharts.each(series.points, function (point) {
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
		drawGraph: Highcharts.noop,
		pointAttrToOptions: colProto.pointAttrToOptions,
		drawPoints: colProto.drawPoints,
		drawTracker: colProto.drawTracker,
		animate: colProto.animate,
		getColumnMetrics: colProto.getColumnMetrics
	});
}());

