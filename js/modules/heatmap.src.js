(function (H) {
	var seriesTypes = H.seriesTypes,
		each = H.each;
	
	seriesTypes.heatmap = H.extendClass(seriesTypes.map, {
		useMapGeometry: false,
		pointArrayMap: ['y', 'value'],
		translate: function () {
			var series = this,
				options = series.options,
				xAxis = series.xAxis,
				yAxis = series.yAxis;

			series.generatePoints();
	
			each(series.data, function (point) {
				var xPad = (options.colsize || 1) / 2,
					yPad = (options.rowsize || 1) / 2,
					x1 = Math.round(xAxis.toPixels(point.x - xPad, true)),
					x2 = Math.round(xAxis.toPixels(point.x + xPad, true)),
					y1 = Math.round(yAxis.toPixels(point.y - yPad, true)),
					y2 = Math.round(yAxis.toPixels(point.y + yPad, true));

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
