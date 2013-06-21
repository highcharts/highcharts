(function (Highcharts) {
	var seriesTypes = Highcharts.seriesTypes,
		each = Highcharts.each;
	
	seriesTypes.heatmap = Highcharts.extendClass(seriesTypes.map, {
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
				

				point.path = [
					'M', point.col - 0.5, point.row - 0.5,
					'L', point.col + 0.5, point.row - 0.5,
					'L', point.col + 0.5, point.row + 0.5,
					'L', point.col - 0.5, point.row + 0.5,
					'Z'
				];
				
				point.shapeType = 'path';
				point.shapeArgs = {
					d: series.translatePath(point.path)
				};
				
				if (typeof point.y === 'number') {
					if (point.y > dataMax) {
						dataMax = point.y;
					} else if (point.y < dataMin) {
						dataMin = point.y;
					}
				}
			});
			
			series.translateColors(dataMin, dataMax);
		},
		
		getBox: function () {}
			
	});
	
}(Highcharts));
