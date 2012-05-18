/**
 * Extensions for polar charts. Additionally, much of the geometry required for polar charts is
 * gathered in RadialAxes.js.
 * 
 * - http://jsfiddle.net/highcharts/2Y5yF/
 * 
 * TODO:
 * - Supply additional ticks to connect across 0.
 * - Animation
 * - Areas back to zero point is wrong
 * - Stacked areas?
 * - Splines are bulgy and connected ends are sharp
 * - Test chart.polar in combination with all options on axes and series and others. Run entire API suite with chart.polar.
 */

var seriesProto = Series.prototype,
	columnProto = seriesTypes.column.prototype;



/**
 * Translate a point's plotX and plotY from the internal angle and radius measures to 
 * true plotX, plotY coordinates
 */
seriesProto.toXY = function (point) {
	var xy,
		chart = this.chart;
	
	// save rectangular plotX, plotY for later computation
	point.rectPlotX = point.plotX;
	point.rectPlotY = point.plotY;
	
	// find the polar plotX and plotY
	xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - point.plotY);
	point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
	point.plotY = point.polarPlotY = xy.y - chart.plotTop;
};

/**
 * Override translate. The plotX and plotY values are computed as if the polar chart were a
 * cartesian plane, where plotX denotes the angle in radians and (yAxis.len - plotY) is the pixel distance from
 * center. 
 */
seriesProto.translate = (function (func) {
	return function () {
		
		// Run uber method
		func.apply(this, arguments);
		
		// Postprocess plot coordinates
		if (this.xAxis.getPosition && this.type !== 'column') { // TODO: do not use this.type
			var points = this.points,
				i = points.length;
			while (i--) {
				// Translate plotX, plotY from angle and radius to true plot coordinates
				this.toXY(points[i]);
			}
		}
	};
}(seriesProto.translate));

seriesProto.getSegmentPath = (function (func) {
	return function (segment) {
		
		var points = this.points;
		
		// Connect the path across 0 to provide a closed circle
		if (this.chart.polar && this.options.connectEnds !== false && 
				segment[segment.length - 1] === points[points.length - 1] && points[0].y !== null) {
			segment = [].concat(segment, [points[0]]);
		}
		
		// Run uber method
		return func.call(this, segment);
		
	};
}(seriesProto.getSegmentPath));

columnProto.translate = (function (func) {
	return function () {
		
		var xAxis = this.xAxis,
			len = this.yAxis.len,
			center = xAxis.center,
			startAngleRad = xAxis.startAngleRad,
			renderer = this.chart.renderer,
			points,
			point,
			i;
		
		// Run uber method
		func.apply(this, arguments);
		
		// Postprocess plot coordinates
		if (xAxis.isRadial) {
			points = this.points;
			i = points.length;
			while (i--) {
				point = points[i];
				point.shapeType = 'path';
				point.shapeArgs = {
					d: renderer.symbols.arc(
						center[0],
						center[1],
						len - point.plotY,
						null, 
						{
							start: startAngleRad + point.barX,
							end: startAngleRad + point.barX + point.pointWidth,
							innerR: len - point.yBottom
						}
					)
				};
				this.toXY(point); // provide correct plotX, plotY for tooltip
			}
		}
	};
}(columnProto.translate));
