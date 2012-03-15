/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	sorted: false,
	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function () {
		var series = this;

		Series.prototype.translate.apply(series);

		each(series.points, function (point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},

	/**
	 * Add tracking event listener to the series group, so the point graphics
	 * themselves act as trackers
	 */
	drawTracker: function () {
		var series = this,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			points = series.points,
			i = points.length,
			graphic;

		// Set an expando property for the point index, used below
		while (i--) {
			graphic = points[i].graphic;
			if (graphic) { // doesn't exist for null points
				graphic.element._i = i; 
			}
		}
		
		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			series.group
				.attr({
					isTracker: true
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function (e) {
					series.onMouseOver();
					if (e.target._i !== UNDEFINED) { // undefined on graph in scatterchart
						points[e.target._i].onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!series.options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css);
		} else {
			series._hasTracking = true;
		}

	}
});
seriesTypes.scatter = ScatterSeries;

