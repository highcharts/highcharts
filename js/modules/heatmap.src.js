(function (Highcharts) {
	var seriesTypes = Highcharts.seriesTypes,
		each = Highcharts.each;
	
	seriesTypes.heatmap = Highcharts.extendClass(seriesTypes.map, {
		colorKey: 'z',
		pointArrayMap: ['y', 'z'],
		translate: function () {
			var series = this,
				options = series.options,
				dataMin = Number.MAX_VALUE,
				dataMax = Number.MIN_VALUE,
				opacity,
				minOpacity = options.minOpacity,
				path,
				color;
			

			series.generatePoints();
	
			each(series.data, function (point) {
				var x = point.x,
					y = point.y,
					value = point.z,
					xPad = (series.options.colsize || 1) / 2,
					yPad = (series.options.rowsize || 1) / 2;

				point.path = [
					'M', x - xPad, y - yPad,
					'L', x + xPad, y - yPad,
					'L', x + xPad, y + yPad,
					'L', x - xPad, y + yPad,
					'Z'
				];
				
				point.shapeType = 'path';
				point.shapeArgs = {
					d: series.translatePath(point.path)
				};
				
				if (typeof value === 'number') {
					if (value > dataMax) {
						dataMax = value;
					} else if (value < dataMin) {
						dataMin = value;
					}
				}
			});
			
			series.translateColors(dataMin, dataMax);
		},
		
		getBox: function () {}
			
	});
	
}(Highcharts));
