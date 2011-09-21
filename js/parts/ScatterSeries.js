/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',

	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function () {
		var series = this;

		Series.prototype.translate.apply(series);

		each(series.data, function (point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},


	/**
	 * Create individual tracker elements for each point
	 */
	//drawTracker: ColumnSeries.prototype.drawTracker,
	drawTracker: function () {
		var series = this,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			graphic;

		each(series.data, function (point) {
			graphic = point.graphic;
			if (graphic) { // doesn't exist for null points
				graphic
					.attr({ isTracker: true })
					.on('mouseover', function () {
						series.onMouseOver();
						point.onMouseOver();
					})
					.on('mouseout', function () {
						if (!series.options.stickyTracking) {
							series.onMouseOut();
						}
					})
					.css(css);
			}
		});

	},

	/**
	 * Cleaning the data is not necessary in a scatter plot
	 */
	cleanData: function () {}
});
seriesTypes.scatter = ScatterSeries;

