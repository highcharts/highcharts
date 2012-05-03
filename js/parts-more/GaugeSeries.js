/* 
 * The GaugeSeries class
 * 
 * Speedometer: http://jsfiddle.net/highcharts/qPeFM/
 * Clock:       http://jsfiddle.net/highcharts/BFN2F/
 * 
 * TODO:
 * - Radial gradients.
 *	 - Fix issue with linearGradient being present from merging background options
 *	 - Experiment more with pattern in VML
 * - Size to the actual space given, for example by vu-meters
 * - Dials are not perfectly centered in IE. Consider altering translation in updateTransform.
 * - Missing axis line in IE, dual axes example
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
		// baseLength: '70%' // of radius
		// rearLength: '10%'
	},
	pivot: {
		//radius: 5,
		//borderWidth: 0
		//borderColor: 'silver',
		//backgroundColor: 'black'
	},
	tooltip: {
		headerFormat: ''
	},
	showInLegend: false
});

/**
 * Extend the point object
 */
var GaugePoint = Highcharts.extendClass(Highcharts.Point, {
	/**
	 * Don't do any hover colors or anything
	 */
	setState: function (state) {
		this.state = state;
	}
});


/**
 * Augmented methods for the x axis in order to hide it completely
 */
var gaugeXAxisMixin = {
	redraw: function () {
		this.isDirty = false; // prevent setting Y axis dirty
	},
	render: function () {
		this.isDirty = false; // prevent setting Y axis dirty
	},
	setScale: noop,
	setCategories: noop,
	setTitle: noop
};

/**
 * Augmented methods for the value axis
 */
var gaugeValueAxisMixin = {
	isRadial: true,
	
	/* *
	 * Set special default options for the radial axis. Since the radial axis is
	 * extended after the initial options are merged, we need to do it here. If
	 * we create a RadialAxis class we should handle it in a setOptions method and
	 * merge in these options the usual way
	 * /
	onBind: function () {
		var axis = this,
			userOptions = axis.userOptions,
			userOptionsTitle = userOptions.title,
			userOptionsLabels = userOptions.labels,
			background = userOptions.background || {}, // start out with one default background
			defaultBackground,
			options = axis.options;
			
		if ((!userOptionsTitle || userOptionsTitle.rotation === UNDEFINED) && options.title) {
			options.title.rotation = 0;
		}
		if (!userOptions.center) {
			options.center = ['50%', '50%'];
		}
		if (!userOptions.zIndex) {
			options.zIndex = 2; // behind dials, points in the series group
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
		axis.startAngleRad = (options.startAngle - 90) * Math.PI / 180;
		axis.endAngleRad = (options.endAngle - 90) * Math.PI / 180;
		
		// Handle background objects. If we move to a RadialAxis class, this should
		// be done in the init method. Backgrounds are special plot band config objects.
		defaultBackground = {
			shape: 'circle',
			borderWidth: 1,
			borderColor: 'silver',
			backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0, '#FFF'],
					[1, '#DDD']
				]
			},
			from: Number.MIN_VALUE, // corrected to axis min
			innerRadius: 0,
			to: Number.MAX_VALUE, // corrected to axis max
			outerRadius: '105%'
		};
		
		background = userOptions.background || {}, // start out with one default background
			
		each(Highcharts.splat(background).reverse(), function (config) {
			config = merge(defaultBackground, config);
			config.color = config.backgroundColor; // due to naming in plotBands
			
			options.plotBands.unshift(config);
		});
	},*/
	
	/**
	 * The default options extend defaultYAxisOptions
	 */
	defaultCircularAxisOptions: {
		center: ['50%', '50%'],
		labels: {
			align: 'center',
			x: 0
		},
		minorGridLineWidth: 0,
		minorTickInterval: 'auto',
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickWidth: 1,
		plotBands: [],
		size: ['90%'],
		tickLength: 10,
		tickPosition: 'inside',
		tickWidth: 2,
		title: {
			rotation: 0
		},
		zIndex: 2 // behind dials, points in the series group
	},
	
	/**
	 * The default background options
	 */
	defaultBackgroundOptions: {
		shape: 'circle',
		borderWidth: 1,
		borderColor: 'silver',
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, '#FFF'],
				[1, '#DDD']
			]
		},
		from: Number.MIN_VALUE, // corrected to axis min
		innerRadius: 0,
		to: Number.MAX_VALUE, // corrected to axis max
		outerRadius: '105%'
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		
		var axis = this,
			options;
		
		axis.options = options = merge(
			axis.defaultOptions,
			axis.defaultCircularAxisOptions,
			userOptions
		);
		
		// Handle backgrounds
		// In the first parameter, pick up the background options, or use one empty object that is
		// filled with default background options. Concatenate this with an empty array, which creates
		// a copy so that the .reverse() operation is not repeated for export.
		each([].concat(Highcharts.splat(userOptions.background || {})).reverse(), function (config) {
			config = merge(axis.defaultBackgroundOptions, config);
			config.color = config.backgroundColor; // due to naming in plotBands
			
			options.plotBands.unshift(config);
		});
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
			radius = center[2] / 2 - this.offset;
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radius,
			radius, 
			{
				start: this.startAngleRad,
				end: this.endAngleRad,
				open: true,
				innerR: 0
			}
		);
	},
	
	/**
	 * Override setAxisTranslation by setting the translation to the difference
	 * in rotation. This allows the translate method to return angle for 
	 * any given value.
	 */
	setAxisTranslation: function () {
		
		Axis.prototype.setAxisTranslation.call(this);
		
		this.transA = (this.endAngleRad - this.startAngleRad) / ((this.max - this.min) || 1);
	},
	
	/**
	 * Override the setAxisSize method to use the arc's circumference as length. This
	 * allows tickPixelInterval to apply to pixel lengths along the perimeter
	 */
	setAxisSize: function () {
		
		Axis.prototype.setAxisSize.call(this);
		
		if (this.center) { // it's not defined the first time
			this.len = this.height = this.center[2] * (this.endAngleRad - this.startAngleRad) / 2;
		}
	},
	
	/**
	 * Returns the x, y coordinate of a point given by a value and a pixel distance
	 * from center
	 */
	getPosition: function (value, length) {
		var chart = this.chart,
			center = this.center,
			angle = this.startAngleRad + this.translate(value),
			radius = pick(length, center[2] / 2) - this.offset;
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
				options.innerRadius,
				pick(options.thickness, 10)
			],
			percentRegex = /%$/,
			start,
			end,
			open;
			
		// Convert percentages to pixel values
		radii = map(radii, function (radius) {
			if (percentRegex.test(radius)) {
				radius = (pInt(radius, 10) * fullRadius) / 100;
			}
			return radius;
		});
		
		// Handle full circle
		if (options.shape === 'circle') {
			start = -Math.PI / 2;
			end = Math.PI * 1.5;
			open = true;
		} else {
			start = startAngleRad + this.translate(from);
			end = startAngleRad + this.translate(to);
		}
		
		return this.chart.renderer.symbols.arc(
			this.left + center[0],
			this.top + center[1],
			radii[0],
			radii[0],
			{
				start: start,
				end: end,
				innerR: pick(radii[1], radii[0] - radii[2]),
				open: open
			}
		);		
	},
	
	/**
	 * Find the path for plot lines perpendicular to the radial axis. These will
	 * appear as spokes in a wheel.
	 */
	getPlotLinePath: function (value) {
		var center = this.center,
			chart = this.chart,
			end = this.getPosition(value);
		return ['M', center[0] + chart.plotLeft, center[1] + chart.plotTop, 'L', end.x, end.y];
	},
	
	/**
	 * Find the position for the axis title, by default inside the gauge
	 */
	getTitlePosition: function () {
		var center = this.center,
			chart = this.chart,
			titleOptions = this.options.title;
		
		return { 
			x: chart.plotLeft + center[0] + (titleOptions.x || 0), 
			y: chart.plotTop + center[1] - ({ high: 0.5, middle: 0.25, low: 0 }[this.options.title.align] * 
				center[2]) + (titleOptions.y || 0)  
		};
	}
	
};

/**
 * Override Axis.prototype.init to mix in special axis instance functions and function overrides
 */
Axis.prototype.init = (function (func) {
	return function (chart, userOptions) {
		var angular = chart.angular,
			options;
			
		// Before prototype.init
		if (angular) {
			extend(this, userOptions.isX ? gaugeXAxisMixin : gaugeValueAxisMixin);
		}
		
		// Run prototype.init
		func.apply(this, arguments);
		
		// After prototype.init
		if (angular) {
			//Start and end angle options are
			// given in degrees relative to top, while internal computations are
			// in radians relative to right (like SVG).
			options = this.options;
			this.startAngleRad = (options.startAngle - 90) * Math.PI / 180;
			this.endAngleRad = (options.endAngle - 90) * Math.PI / 180;
			this.offset = options.offset || 0;
		}
	};
}(Axis.prototype.init));

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
			
			// Automatically rotated
			if (labelOptions.rotation === 'auto') {
				label.attr({ 
					rotation: (axis.translate(this.pos) + axis.startAngleRad + Math.PI / 2) / Math.PI * 180  
				});
			
			// Vertically centered
			} else if (labelOptions.y === null) {
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
 * Add the series type
 */
var GaugeSeries = {
	type: 'gauge',
	pointClass: GaugePoint,
	
	// chart.angular will be set to true when a gauge series is present, and this will
	// be used on the axes
	angular: true, 
	
	/* *
	 * Extend the bindAxes method by adding radial features to the axes
	 * /
	_bindAxes: function () {
		Series.prototype.bindAxes.call(this);
		
		extend(this.xAxis, gaugeXAxisMixin);
		extend(this.yAxis, gaugeValueAxisMixin);
		this.yAxis.onBind();
	},*/
	
	/**
	 * Calculate paths etc
	 */
	translate: function () {
		
		var series = this,
			yAxis = series.yAxis,
			center = yAxis.center;
			
		series.generatePoints();
		
		each(series.points, function (point) {
			
			var dialOptions = merge(series.options.dial, point.dial),
				radius = (pInt(pick(dialOptions.radius, 80)) * center[2]) / 200,
				baseLength = (pInt(pick(dialOptions.baseLength, 70)) * radius) / 100,
				rearLength = (pInt(pick(dialOptions.rearLength, 10)) * radius) / 100,
				baseWidth = dialOptions.baseWidth || 3,
				topWidth = dialOptions.topWidth || 1;
				
			point.shapeType = 'path';
			point.shapeArgs = {
				d: dialOptions.path || [
					'M', 
					-rearLength, -baseWidth / 2, 
					'L', 
					baseLength, -baseWidth / 2,
					radius, -topWidth / 2,
					radius, topWidth / 2,
					baseLength, baseWidth / 2,
					-rearLength, baseWidth / 2
				],
				translateX: center[0],
				translateY: center[1],
				rotation: (yAxis.startAngleRad + yAxis.translate(point.y)) * 180 / Math.PI
			};
			
			// Positions for data label
			point.plotX = center[0];
			point.plotY = center[1];
		});
	},
	
	/**
	 * Draw the points where each point is one needle
	 */
	drawPoints: function () {
		
		var series = this,
			center = series.yAxis.center,
			pivot = series.pivot,
			options = series.options,
			pivotOptions = options.pivot,
			dialOptions = options.dial;
		
		each(series.points, function (point) {
			
			var graphic = point.graphic,
				shapeArgs = point.shapeArgs,
				d = shapeArgs.d;
			
			if (graphic) {
				graphic.animate(shapeArgs);
				shapeArgs.d = d; // animate alters it
			} else {
				point.graphic = series.chart.renderer[point.shapeType](shapeArgs)
					.attr({
						stroke: dialOptions.borderColor || 'none',
						'stroke-width': dialOptions.borderWidth || 0,
						fill: dialOptions.backgroundColor || 'black'
					})
					.add(series.group);
			}
		});
		
		// Add or move the pivot
		if (pivot) {
			pivot.animate({
				cx: center[0],
				cy: center[1]
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
					rotation: point.shapeArgs.rotation
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
	drawTracker: seriesTypes.column.prototype.drawTracker
};
seriesTypes.gauge = Highcharts.extendClass(seriesTypes.line, GaugeSeries);