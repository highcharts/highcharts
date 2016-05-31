/**
 * Set the default options for polygon
 */
defaultPlotOptions.polygon = merge(defaultPlotOptions.scatter, {
	marker: {
		enabled: false,
		states: {
			hover: {
				enabled: false
			}
		}
	},
	stickyTracking: false,
	tooltip: {
		followPointer: true,
		pointFormat: ''
	},
	trackByArea: true
});

/**
 * The polygon series class
 */
seriesTypes.polygon = extendClass(seriesTypes.scatter, {
	type: 'polygon',
	getGraphPath: function () {

		var graphPath = Series.prototype.getGraphPath.call(this),
			i = graphPath.length + 1;

		// Close all segments
		while (i--) {
			if (i === graphPath.length || (graphPath[i] === 'M' && i > 0)) {
				graphPath.splice(i, 0, 'z');
			}
		}

		this.areaPath = graphPath;
		return graphPath;
	},
	drawGraph: seriesTypes.area.prototype.drawGraph,
	drawTracker: Series.prototype.drawTracker,
	setStackedPoints: noop // No stacking points on polygons (#5310)
});
