/* ****************************************************************************
 * Start Waterfall series code											      *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
});

// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	translate: function () {
		seriesTypes.column.prototype.translate.apply(this);

		var previous;

		each(this.points, function (point) {
			var shapeArgs = point.shapeArgs,
				height = shapeArgs.height,
				y = shapeArgs.y;

			if (previous && !point.yBottom) {
				y = previous;

				if (point.y >= 0) {
					y -= height;
					previous = y;
				}
				else {
					previous = y + height;
				}

				shapeArgs.y = y;
				shapeArgs.height = height;
			}
			else {
				previous = y;
			}
		});
	},

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code												*
 *****************************************************************************/
