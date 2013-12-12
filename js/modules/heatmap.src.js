(function (H) {
	var seriesTypes = H.seriesTypes,
		each = H.each;
	
	seriesTypes.heatmap = H.extendClass(seriesTypes.map, {
		useMapGeometry: false,
		pointArrayMap: ['y', 'value'],
		init: function () {
			seriesTypes.map.prototype.init.apply(this, arguments);
			this.pointRange = this.options.colsize || 1;
			// TODO: similar logic for the Y axis
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
			
			series.pointRange = options.colsize || 1;
			series.translateColors();
		},
		
		animate: function () {},
		getBox: function () {},

		getExtremes: function () {
			// Get the extremes from the value data
			H.Series.prototype.getExtremes.call(this, this.valueData);
			this.valueMin = this.dataMin;
			this.valueMax = this.dataMax;

			// Get the extremes from the y data
			H.Series.prototype.getExtremes.call(this);
		}
			
	});
	
}(Highcharts));
