/**
 * Extensions for polar charts
 * 
 * - http://jsfiddle.net/highcharts/2Y5yF/
 */

var radialAxisMixin = {
	
	/**
	 * Borrow the getOffset method from circular axis (label offset is zero, center is shared)
	 */
	getOffset: circularAxisMixin.getOffset,
	
	
	/**
	 * Find the path for plot lines parallel to the axis and the center point. These will
	 * appear as concentric circles
	 */
	getPlotLinePath: function (value) {
			
		return circularAxisMixin.getLinePath.call(this, this.translate(value));
	}, 
	
	
	/**
	 * Returns the x, y coordinate of a point along the axis given by a value
	 */
	getPosition: function (value) {
		
		return circularAxisMixin.getPosition.call(this, this.min, this.translate(value));
		
	},
	
	/**
	 * Override setAxisTranslation by setting the translation relative to the radius
	 */
	setAxisTranslation: function () {
		
		Axis.prototype.setAxisTranslation.call(this);
		
		if (this.center) { // it's not defined the first time
			this.transA = (this.center[2] / 2) / ((this.max - this.min) || 1);
		}
	},
	
	/**
	 * Override the setAxisSize method to use the arc's circumference as length. This
	 * allows tickPixelInterval to apply to pixel lengths along the perimeter
	 */
	setAxisSize: function () {
		
		Axis.prototype.setAxisSize.call(this);
		
		if (this.center) { // it's not defined the first time
			this.len = this.height = this.center[2] / 2;
		}
	}
	
};

/**
 * Override Axis.prototype.init to mix in special axis instance functions and function overrides
 */
Axis.prototype.init = (function (func) {
	return function (chart, userOptions) {
		var polar = chart.options.chart.polar,
			options;
			
		// Before prototype.init
		if (polar) {
			extend(this, userOptions.isX ? circularAxisMixin : radialAxisMixin);
		}
		
		// Run prototype.init
		func.apply(this, arguments);
		
		
		// After prototype.init
		if (polar) {
			// Start and end angle options are
			// given in degrees relative to top, while internal computations are
			// in radians relative to right (like SVG).
			options = this.options;
			this.startAngleRad = ((options.startAngle || 0) - 90) * Math.PI / 180;
			this.endAngleRad = ((options.endAngle || 360) - 90) * Math.PI / 180;
			this.offset = options.offset || 0;
		}
		
	};
}(Axis.prototype.init));

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
