

// The Heatmap series type
seriesTypes.heatmap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
	pointArrayMap: ['y', 'value'],
	hasPointSpecificOptions: true,
	supportsDrilldown: true,
	getExtremesFromAll: true,
	init: function () {
		seriesTypes.scatter.prototype.init.apply(this, arguments);
		this.pointRange = this.options.colsize || 1;
		this.yAxis.axisPointRange = this.options.rowsize || 1; // general point range
	},
	translate: function () {
		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis;

		series.generatePoints();

		each(series.points, function (point) {
			var xPad = (options.colsize || 1) / 2,
				yPad = (options.rowsize || 1) / 2,
				x1 = Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)),
				x2 = Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)),
				y1 = Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)),
				y2 = Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1));


			point.plotY = 1; // Pass test in Column.drawPoints

			point.shapeType = 'rect';
			point.shapeArgs = {
				x: Math.min(x1, x2),
				y: Math.min(y1, y2),
				width: Math.abs(x2 - x1),
				height: Math.abs(y2 - y1)
			};
		});
		
		series.translateColors();
	},
	drawPoints: seriesTypes.column.prototype.drawPoints,
	animate: noop,
	getBox: noop,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle,

	getExtremes: function () {
		// Get the extremes from the value data
		Series.prototype.getExtremes.call(this, this.valueData);
		this.valueMin = this.dataMin;
		this.valueMax = this.dataMax;

		// Get the extremes from the y data
		Series.prototype.getExtremes.call(this);
	}
		
}));

