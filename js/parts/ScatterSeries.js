/**
 * Set the default options for scatter
 */
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	},
	tooltip: {
		headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}
});

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	sorted: false,
	requireSorting: false,
	noSharedTooltip: true,
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
			graphic,
			markerGroup = series.markerGroup,
			onMouseOver = function (e) {
				series.onMouseOver();
				if (e.target._i !== UNDEFINED) { // undefined on graph in scatterchart
					points[e.target._i].onMouseOver(e);
				}
			},
			onMouseOut = function () {
				if (!series.options.stickyTracking) {
					series.onMouseOut();
				}
			};

		// Set an expando property for the point index, used below
		while (i--) {
			graphic = points[i].graphic;
			if (graphic) { // doesn't exist for null points
				graphic.element._i = i; 
			}
		}
		
		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			series[series.trackerGroupKey || 'markerGroup']
				.attr({
					isTracker: true
				})
				.on('mouseover', onMouseOver)
				.on('mouseout', onMouseOut)
				.css(css);
			if (hasTouch) {
				markerGroup.on('touchstart', onMouseOver);
			}
			
		} else {
			series._hasTracking = true;
		}
	},
	
	setTooltipPoints: noop
});
seriesTypes.scatter = ScatterSeries;

