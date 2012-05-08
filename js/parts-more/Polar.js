/**
 * Extensions for polar charts
 * 
 * - http://jsfiddle.net/highcharts/2Y5yF/
 */


Series.prototype.translate = (function (func) {
	return function () {
		
		// Run uber method
		func.apply(this, arguments);
		
		// Postprocess plot coordinates
		if (this.xAxis.getPosition) {
			var points = this.points,
				i = points.length,
				point,
				chart = this.chart,
				xy;
			while (i--) {
				point = points[i];
				xy = this.xAxis.getPosition(point.x, this.yAxis.len - point.plotY);
				point.plotX = xy.x - chart.plotLeft;
				point.plotY = xy.y - chart.plotTop;
			}
		}
	};
}(Series.prototype.translate));
