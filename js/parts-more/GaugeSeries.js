/* 
 * The GaugeSeries class
 * 
 * http://jsfiddle.net/highcharts/qPeFM/
 * 
 * TODO:
 * - Handle grid lines on the angular axis
 * - Make tickInterval and tickPixelInterval relate to the circumference of the gauge
 * - Individual dial options per point
 * - Implement rotation of VML elements
 * - Allow pixel and percentage thickness for plot bands. Find naming that makes sense in cartesian plots, 
 *   since width is already used for plotLines. Possible combination with from-to on the crossing axis
 *   in the cartesian plane.
 * - Rotation of axis labels along the perimeter
 * - Consistent way of adding background objects
 * - Radial gradients
 * - Size to the actual space given, for example by vu-meters
 * - Option to wrap (like clock)
 * - Tooltip
 */


var tickProto = Tick.prototype;

/**
 * Extend the default options
 */
defaultPlotOptions.gauge = merge(defaultPlotOptions.line, {
	dataLabels: {
		enabled: true,
		y: 30,
		borderWidth: 1,
		borderColor: 'silver',
		borderRadius: 3,
		style: {
			fontWeight: 'bold'
		}
	},
	dial: {
		// radius: '80%',
		// backgroundColor: 'black',
		// borderColor: 'silver',
		// borderWidth: 0,
		// baseWidth: 3,
		// topWidth: 1,
		// baseLength: '70%'
	},
	pivot: {
		//radius: 5,
		//borderWidth: 0
		//borderColor: 'silver',
		//backgroundColor: 'black'
	},
	showInLegend: false
});

/**
 * Extend the point object
 */
var GaugePoint = Highcharts.extendClass(Highcharts.Point, {
	
});

/**
 * Augmented methods for the value axis
 */
var gaugeValueAxisMixin = {
	isRadial: true,
	
	/**
	 * Set special default options for the radial axis. Since the radial axis is
	 * extended after the initial options are merged, we need to do it here. If
	 * we create a RadialAxis class we should handle it in a setOptions method and
	 * merge in these options the usual way
	 */
	onBind: function () {
		var userOptions = this.userOptions,
			userOptionsTitle = userOptions.title,
			userOptionsLabels = userOptions.labels,
			options = this.options;
			
		if (!userOptionsTitle || userOptionsTitle.rotation === UNDEFINED) {
			options.title.rotation = 0;
		}
		if (!userOptions.center) {
			options.center = ['50%', '50%'];
		}
		if (!userOptions.size) {
			options.size = ['90%'];
		}
		if (!userOptionsLabels || !userOptionsLabels.align) {
			options.labels.align = 'center';
		}
		if (!userOptionsLabels || userOptionsLabels.x === UNDEFINED) {
			options.labels.x = 0;
		}
		
		
		// Special initiation for the radial axis. Start and end angle options are
		// given in degrees relative to top, while internal computations are
		// in radians relative to right (like SVG).
		this.startAngleRad = (options.startAngle - 90) * Math.PI / 180;
		this.endAngleRad = (options.endAngle - 90) * Math.PI / 180;
	},
	
	/**
	 * Wrap the getOffset method to return zero offset for title or labels in a radial 
	 * axis
	 */
	getOffset: function () {
		
		// Call the Axis prototype method (the method we're in now is on the instance)
		Axis.prototype.getOffset.call(this);
		
		// Title or label offsets are not counted
		this.chart.axisOffset[this.side] = 0;
		
		// Set the center array
		this.center = seriesTypes.pie.prototype.getCenter.call(this);
	},
	
	/**
	 * Get the path for the axis line
	 */
	getLinePath: function () {
		var center = this.center,
			radius = center[2] / 2;
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radius,
			radius,
			{
				start: this.startAngleRad,
				end: this.endAngleRad,
				innerR: 0
			}
		);
	},
	
	/**
	 * Override setAxisSize by setting the width and height to the difference
	 * in rotation. This allows the translate method to return angle for 
	 * any given value.
	 */
	setAxisTranslation: function () {
		
		Axis.prototype.setAxisTranslation.call(this);
		
		this.transA = (this.endAngleRad - this.startAngleRad) / ((this.max - this.min) || 1);
	},
	
	/**
	 * Returns the x, y coordinate of a point given by a value and a pixel distance
	 * from center
	 */
	getPosition: function (value, length) {
		var chart = this.chart,
			center = this.center,
			angle = this.startAngleRad + this.translate(value),
			radius = pick(length, center[2] / 2);
		
		return {
			x: chart.plotLeft + center[0] + Math.cos(angle) * radius,
			y: chart.plotTop + center[1] + Math.sin(angle) * radius
		};
		
	},
	
	/**
	 * Find the path for plot bands along the radial axis
	 */
	getPlotBandPath: function (from, to, options) {
		var center = this.center,
			startAngleRad = this.startAngleRad,
			fullRadius = center[2] / 2,
			radii = [
				pick(options.outerRadius, '100%'),
				pick(options.innerRadius, '90%')
			],
			percentRegex = /%$/;
			
		// Convert percentages to pixel values
		radii = map(radii, function (radius) {
			if (percentRegex.test(radius)) {
				radius = (pInt(radius, 10) * fullRadius) / 100;
			}
			return radius;
		});
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radii[0],
			radii[1],
			{
				start: startAngleRad + this.translate(from),
				end: startAngleRad + this.translate(to),
				innerR: radii[1]
			}
		);		
	},
	
	/**
	 * Find the position for the axis title, by default inside the gauge
	 */
	getTitlePosition: function () {
		var center = this.center,
			chart = this.chart;
		
		return { 
			x: chart.plotLeft + center[0], 
			y: chart.plotTop + center[1] - ({ high: 0.5, middle: 0.25, low: 0 }[this.options.title.align] * center[2])  
		};
	}
	
};

/**
 * Add special cases within the Tick class' methods for radial axes. 
 * TODO: If we go for a RadialAxis class, add a RadialTick class too.
 */	
tickProto.getPosition = (function (func) {
	return function () {
		var axis = this.axis,
			args = arguments;
		
		return axis.isRadial ? 
			axis.getPosition(args[1]) :
			func.apply(this, args);	
	};
}(tickProto.getPosition));

/**
 * Wrap the getLabelPosition function to find the center position of the label
 * based on the distance option
 */	
tickProto.getLabelPosition = (function (func) {
	return function () {
		var axis = this.axis,
			labelOptions = axis.options.labels,
			label = this.label,
			ret;
		
		if (axis.isRadial) {
			ret = axis.getPosition(this.pos, (axis.center[2] / 2) + pick(labelOptions.distance, -25));
			
			// Vertically centered
			if (labelOptions.y === null) {
				// TODO: new fontMetric logic
				ret.y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
			}
			
		} else {
			ret = func.apply(this, arguments);
		}
		return ret;
	};
}(tickProto.getLabelPosition));

/**
 * Wrap the getMarkPath function to return the path of the radial marker
 */
tickProto.getMarkPath = (function (func) {
	return function (x, y, tickLength) {
		var axis = this.axis,
			endPoint,
			ret;
			
		if (axis.isRadial) {
			endPoint = axis.getPosition(this.pos, axis.center[2] / 2 + tickLength);
			ret = [
				'M',
				x,
				y,
				'L',
				endPoint.x,
				endPoint.y
			];
		} else {
			ret = func.apply(this, arguments);
		}
		return ret;
	};
}(tickProto.getMarkPath));


/**
 * Augmented methods for the x axis in order to hide it completely
 */
var gaugeXAxisMixin = {
	setScale: noop,
	render: noop
};

/**
 * Add the series type
 */
var GaugeSeries = {
	type: 'gauge',
	pointClass: GaugePoint,
	
	bindAxes: function () {
		Series.prototype.bindAxes.call(this);
		
		extend(this.xAxis, gaugeXAxisMixin);
		extend(this.yAxis, gaugeValueAxisMixin);
		this.yAxis.onBind();
	},
	
	translate: function () {
		
		var series = this,
			yAxis = series.yAxis,
			center = yAxis.center,
			dialOptions = series.options.dial;
			
		series.generatePoints();
		
		each(series.points, function (point) {
			
			var radius = (pInt(dialOptions.radius || 80) * center[2]) / 200,
				baseLength = (pInt(dialOptions.baseLength || 70) * radius) / 100,
				baseWidth = dialOptions.baseWidth || 3,
				topWidth = dialOptions.topWidth || 1;
				
			point.path = [
				'M', 
				center[0], center[1] - baseWidth / 2, 
				'L', 
				center[0] + baseLength, center[1] - baseWidth / 2,
				center[0] + radius, center[1] - topWidth / 2,
				center[0] + radius, center[1] + topWidth / 2,
				center[0] + baseLength, center[1] + baseWidth / 2,
				center[0], center[1] + baseWidth / 2
			];
			point.rotation = (yAxis.startAngleRad + yAxis.translate(point.y)) * 180 / Math.PI;
			
			// Positions for data label
			point.plotX = center[0];
			point.plotY = center[1];
		});
		//this.setTooltipPoints();
	},
	
	drawPoints: function () {
		
		var series = this,
			center = series.yAxis.center,
			pivot = series.pivot,
			options = series.options,
			pivotOptions = options.pivot,
			dialOptions = options.dial;
		
		each(series.points, function (point) {
			
			var graphic = point.graphic,
				path = point.path,
				rotation = point.rotation;
			
			if (graphic) {
				graphic.animate({
					d: path,
					x: center[0],
					y: center[1],
					rotation: rotation
				});
			} else {
				point.graphic = series.chart.renderer.path(path)
					.attr({
						stroke: dialOptions.borderColor || 'none',
						'stroke-width': dialOptions.borderWidth || 0,
						fill: dialOptions.backgroundColor || 'black',
						x: center[0],
						y: center[1],
						rotation: rotation
					})
					.add(series.group);
			}
		});
		
		// Add or move the pivot
		if (pivot) {
			pivot.animate({
				x: center[0],
				y: center[1]
			});
		} else {
			series.pivot = series.chart.renderer.circle(center[0], center[1], pick(pivotOptions.radius, 5))
				.attr({
					'stroke-width': pivotOptions.borderWidth || 0,
					stroke: pivotOptions.borderColor || 'silver',
					fill: pivotOptions.backgroundColor || 'black'
				})
				.add(series.group);
		}
	},
	
	/**
	 * Animate the arrow up from startAngle
	 */
	animate: function () {
		var series = this;

		each(series.points, function (point) {
			var graphic = point.graphic;

			if (graphic) {
				// start value
				graphic.attr({
					rotation: series.yAxis.startAngleRad * 180 / Math.PI
				});

				// animate
				graphic.animate({
					rotation: point.rotation
				}, series.options.animation);
			}
		});

		// delete this function to allow it only once
		series.animate = null;
	},
	
	render: function () {
		this.createGroup();
		seriesTypes.pie.prototype.render.call(this);
	},
	
	setData: seriesTypes.pie.prototype.setData,
	drawTracker: noop
};
seriesTypes.gauge = Highcharts.extendClass(seriesTypes.line, GaugeSeries);