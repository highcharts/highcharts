/**
 * Extensions for polar charts. Additionally, much of the geometry required for polar charts is
 * gathered in RadialAxes.js.
 * 
 * - http://jsfiddle.net/highcharts/2Y5yF/
 * 
 * TODO:
 * - Supply additional ticks to connect across 0.
 * - Animation
 * - Stacked areas?
 * - Splines are bulgy and connected ends are sharp
 * - Overlapping shadows on columns (same problem as bar charts)
 * - Click events with axis positions - use the positioning logic as tooltips. Perhaps include this in axis
 *   backwards translate.
 * - Test chart.polar in combination with all options on axes and series and others. Run entire API suite with chart.polar.
 */

var seriesProto = Series.prototype,
	columnProto = seriesTypes.column.prototype,
	mouseTrackerProto = Highcharts.MouseTracker.prototype;



/**
 * Translate a point's plotX and plotY from the internal angle and radius measures to 
 * true plotX, plotY coordinates
 */
seriesProto.toXY = function (point) {
	var xy,
		chart = this.chart,
		plotX = point.plotX,
		plotY = point.plotY;
	
	// Save rectangular plotX, plotY for later computation
	point.rectPlotX = plotX;
	point.rectPlotY = plotY;
	
	// Record the angle in degrees for use in tooltip
	point.deg = plotX / Math.PI * 180;
	
	// Find the polar plotX and plotY
	xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - plotY);
	point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
	point.plotY = point.polarPlotY = xy.y - chart.plotTop;
};

/**
 * Overridden method to close a segment path. While in a cartesian plane the area 
 * goes down to the threshold, in the polar chart it goes to the center.
 */
seriesTypes.area.prototype.closeSegment = (function (func) { 
	
	return function (path) {
		
		if (this.chart.polar) {
			var center = this.xAxis.center;
			path.push(
				'L',
				center[0],
				center[1]
			);
		} else {
			func.apply(this, arguments);
		}
	};
}(seriesTypes.area.prototype.closeSegment));

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

/**
 * Throw in a couple of properties to let setTooltipPoints know we're indexing the points
 * in degrees (0-360), not plot pixel width.
 */
seriesProto.setTooltipPoints = (function (func) {
	return function () {
		
		if (this.chart.polar) {
			extend(this.xAxis, {
				tooltipLen: 360, // degrees are the resolution unit of the tooltipPoints array
				tooltipPosName: 'deg'
			});	
		}
		
		// Run uber method
		return func.apply(this, arguments);
	};
}(seriesProto.setTooltipPoints));


/**
 * Extend the column prototype's translate method
 */
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

/**
 * Extend the mouse tracker to return the tooltip position index in terms of
 * degrees rather than pixels
 */
mouseTrackerProto.getIndex = (function (func) {
	return function (e) {
		var ret,
			chart = this.chart,
			center,
			x,
			y;
		
		if (chart.polar) {
			center = chart.xAxis[0].center;
			x = e.chartX - center[0] - chart.plotLeft;
			y = e.chartY - center[1] - chart.plotTop;
			
			ret = 180 - Math.round(Math.atan2(x, y) / Math.PI * 180);
		
		} else {
		
			// Run uber method
			ret = func.apply(this, arguments);
		}
		return ret;
	};
}(mouseTrackerProto.getIndex));