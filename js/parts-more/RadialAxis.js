
var axisProto = Axis.prototype,
	tickProto = Tick.prototype;
	
/**
 * Augmented methods for the x axis in order to hide it completely, used for the X axis in gauges
 */
var hiddenAxisMixin = {
	getOffset: noop,
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
/*jslint unparam: true*/
var radialAxisMixin = {
	isRadial: true,
	
	/**
	 * The default options extend defaultYAxisOptions
	 */
	defaultRadialGaugeOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: null // auto
		},
		minorGridLineWidth: 0,
		minorTickInterval: 'auto',
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickWidth: 1,
		plotBands: [],
		tickLength: 10,
		tickPosition: 'inside',
		tickWidth: 2,
		title: {
			rotation: 0
		},
		zIndex: 2 // behind dials, points in the series group
	},
	
	// Circular axis around the perimeter of a polar chart
	defaultRadialXOptions: {
		gridLineWidth: 1, // spokes
		labels: {
			align: null, // auto
			distance: 15,
			x: 0,
			y: null // auto
		},
		maxPadding: 0,
		minPadding: 0,
		plotBands: [],
		showLastLabel: false, 
		tickLength: 0
	},
	
	// Radial axis, like a spoke in a polar chart
	defaultRadialYOptions: {
		gridLineInterpolation: 'circle',
		labels: {
			align: 'right',
			x: -3,
			y: -2
		},
		plotBands: [],
		showLastLabel: false,
		title: {
			x: 4,
			text: null,
			rotation: 90
		}
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		
		this.options = merge(
			this.defaultOptions,
			this.defaultRadialOptions,
			userOptions
		);
		
	},
	
	/**
	 * Wrap the getOffset method to return zero offset for title or labels in a radial 
	 * axis
	 */
	getOffset: function () {
		// Call the Axis prototype method (the method we're in now is on the instance)
		axisProto.getOffset.call(this);
		
		// Title or label offsets are not counted
		this.chart.axisOffset[this.side] = 0;
		
		// Set the center array
		this.center = this.pane.center = seriesTypes.pie.prototype.getCenter.call(this.pane);
	},


	/**
	 * Get the path for the axis line. This method is also referenced in the getPlotLinePath
	 * method.
	 */
	getLinePath: function (lineWidth, radius) {
		var center = this.center;
		radius = pick(radius, center[2] / 2 - this.offset);
		
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
		
		// Call uber method		
		axisProto.setAxisTranslation.call(this);
			
		// Set transA and minPixelPadding
		if (this.center) { // it's not defined the first time
			if (this.isCircular) {
				
				this.transA = (this.endAngleRad - this.startAngleRad) / 
					((this.max - this.min) || 1);
					
				
			} else { 
				this.transA = (this.center[2] / 2) / ((this.max - this.min) || 1);
			}
			
			if (this.isXAxis) {
				this.minPixelPadding = this.transA * this.minPointOffset +
					(this.reversed ? (this.endAngleRad - this.startAngleRad) / 4 : 0); // ???
			}
		}
	},
	
	/**
	 * In case of auto connect, add one closestPointRange to the max value right before
	 * tickPositions are computed, so that ticks will extend passed the real max.
	 */
	beforeSetTickPositions: function () {
		if (this.autoConnect) {
			this.max += (this.categories && 1) || this.pointRange || this.closestPointRange; // #1197
		}
	},
	
	/**
	 * Override the setAxisSize method to use the arc's circumference as length. This
	 * allows tickPixelInterval to apply to pixel lengths along the perimeter
	 */
	setAxisSize: function () {
		
		axisProto.setAxisSize.call(this);
		
		if (this.center) { // it's not defined the first time
			this.len = this.width = this.height = this.isCircular ?
				this.center[2] * (this.endAngleRad - this.startAngleRad) / 2 :
				this.center[2] / 2;
		}
	},
	
	/**
	 * Returns the x, y coordinate of a point given by a value and a pixel distance
	 * from center
	 */
	getPosition: function (value, length) {
		if (!this.isCircular) {
			length = this.translate(value);
			value = this.min;	
		}
		
		return this.postTranslate(
			this.translate(value),
			pick(length, this.center[2] / 2) - this.offset
		);		
	},
	
	/**
	 * Translate from intermediate plotX (angle), plotY (axis.len - radius) to final chart coordinates. 
	 */
	postTranslate: function (angle, radius) {
		
		var chart = this.chart,
			center = this.center;
			
		angle = this.startAngleRad + angle;
		
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
			open,
			isCircular = this.isCircular, // X axis in a polar chart
			ret;
			
		// Polygonal plot bands
		if (this.options.gridLineInterpolation === 'polygon') {
			ret = this.getPlotLinePath(from).concat(this.getPlotLinePath(to, true));
		
		// Circular grid bands
		} else {
			
			// Plot bands on Y axis (radial axis) - inner and outer radius depend on to and from
			if (!isCircular) {
				radii[0] = this.translate(from);
				radii[1] = this.translate(to);
			}
			
			// Convert percentages to pixel values
			radii = map(radii, function (radius) {
				if (percentRegex.test(radius)) {
					radius = (pInt(radius, 10) * fullRadius) / 100;
				}
				return radius;
			});
			
			// Handle full circle
			if (options.shape === 'circle' || !isCircular) {
				start = -Math.PI / 2;
				end = Math.PI * 1.5;
				open = true;
			} else {
				start = startAngleRad + this.translate(from);
				end = startAngleRad + this.translate(to);
			}
		
		
			ret = this.chart.renderer.symbols.arc(
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
		}
		 
		return ret;
	},
	
	/**
	 * Find the path for plot lines perpendicular to the radial axis.
	 */
	getPlotLinePath: function (value, reverse) {
		var axis = this,
			center = axis.center,
			chart = axis.chart,
			end = axis.getPosition(value),
			xAxis,
			xy,
			tickPositions,
			ret;
		
		// Spokes
		if (axis.isCircular) {
			ret = ['M', center[0] + chart.plotLeft, center[1] + chart.plotTop, 'L', end.x, end.y];
		
		// Concentric circles			
		} else if (axis.options.gridLineInterpolation === 'circle') {
			value = axis.translate(value);
			if (value) { // a value of 0 is in the center
				ret = axis.getLinePath(0, value);
			}
		// Concentric polygons 
		} else {
			xAxis = chart.xAxis[0];
			ret = [];
			value = axis.translate(value);
			tickPositions = xAxis.tickPositions;
			if (xAxis.autoConnect) {
				tickPositions = tickPositions.concat([tickPositions[0]]);
			}
			// Reverse the positions for concatenation of polygonal plot bands
			if (reverse) {
				tickPositions = [].concat(tickPositions).reverse();
			}
				
			each(tickPositions, function (pos, i) {
				xy = xAxis.getPosition(pos, value);
				ret.push(i ? 'L' : 'M', xy.x, xy.y);
			});
			
		}
		return ret;
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
			y: chart.plotTop + center[1] - ({ high: 0.5, middle: 0.25, low: 0 }[titleOptions.align] * 
				center[2]) + (titleOptions.y || 0)  
		};
	}
	
};
/*jslint unparam: false*/

/**
 * Override axisProto.init to mix in special axis instance functions and function overrides
 */
wrap(axisProto, 'init', function (proceed, chart, userOptions) {
	var axis = this,
		angular = chart.angular,
		polar = chart.polar,
		isX = userOptions.isX,
		isHidden = angular && isX,
		isCircular,
		startAngleRad,
		endAngleRad,
		options,
		chartOptions = chart.options,
		paneIndex = userOptions.pane || 0,
		pane,
		paneOptions;
		
	// Before prototype.init
	if (angular) {
		extend(this, isHidden ? hiddenAxisMixin : radialAxisMixin);
		isCircular =  !isX;
		if (isCircular) {
			this.defaultRadialOptions = this.defaultRadialGaugeOptions;
		}
		
	} else if (polar) {
		//extend(this, userOptions.isX ? radialAxisMixin : radialAxisMixin);
		extend(this, radialAxisMixin);
		isCircular = isX;
		this.defaultRadialOptions = isX ? this.defaultRadialXOptions : merge(this.defaultYAxisOptions, this.defaultRadialYOptions);
		
	}
	
	// Run prototype.init
	proceed.call(this, chart, userOptions);
	
	if (!isHidden && (angular || polar)) {
		options = this.options;
		
		// Create the pane and set the pane options.
		if (!chart.panes) {
			chart.panes = [];
		}
		this.pane = pane = chart.panes[paneIndex] = chart.panes[paneIndex] || new Pane(
			splat(chartOptions.pane)[paneIndex],
			chart,
			axis
		);
		paneOptions = pane.options;
		
			
		// Disable certain features on angular and polar axes
		chart.inverted = false;
		chartOptions.chart.zoomType = null;
		
		// Start and end angle options are
		// given in degrees relative to top, while internal computations are
		// in radians relative to right (like SVG).
		this.startAngleRad = startAngleRad = (paneOptions.startAngle - 90) * Math.PI / 180;
		this.endAngleRad = endAngleRad = (pick(paneOptions.endAngle, paneOptions.startAngle + 360)  - 90) * Math.PI / 180;
		this.offset = options.offset || 0;
		
		this.isCircular = isCircular;
		
		// Automatically connect grid lines?
		if (isCircular && userOptions.max === UNDEFINED && endAngleRad - startAngleRad === 2 * Math.PI) {
			this.autoConnect = true;
		}
	}
	
});

/**
 * Add special cases within the Tick class' methods for radial axes.
 */	
wrap(tickProto, 'getPosition', function (proceed, horiz, pos, tickmarkOffset, old) {
	var axis = this.axis;
	
	return axis.getPosition ? 
		axis.getPosition(pos) :
		proceed.call(this, horiz, pos, tickmarkOffset, old);	
});

/**
 * Wrap the getLabelPosition function to find the center position of the label
 * based on the distance option
 */	
wrap(tickProto, 'getLabelPosition', function (proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
	var axis = this.axis,
		optionsY = labelOptions.y,
		ret,
		align = labelOptions.align,
		angle = ((axis.translate(this.pos) + axis.startAngleRad + Math.PI / 2) / Math.PI * 180) % 360;
	
	if (axis.isRadial) {
		ret = axis.getPosition(this.pos, (axis.center[2] / 2) + pick(labelOptions.distance, -25));
		
		// Automatically rotated
		if (labelOptions.rotation === 'auto') {
			label.attr({ 
				rotation: angle
			});
		
		// Vertically centered
		} else if (optionsY === null) {
			optionsY = pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
		
		}
		
		// Automatic alignment
		if (align === null) {
			if (axis.isCircular) {
				if (angle > 20 && angle < 160) {
					align = 'left'; // right hemisphere
				} else if (angle > 200 && angle < 340) {
					align = 'right'; // left hemisphere
				} else {
					align = 'center'; // top or bottom
				}
			} else {
				align = 'center';
			}
			label.attr({
				align: align
			});
		}
		
		ret.x += labelOptions.x;
		ret.y += optionsY;
		
	} else {
		ret = proceed.call(this, x, y, label, horiz, labelOptions, tickmarkOffset, index, step);
	}
	return ret;
});

/**
 * Wrap the getMarkPath function to return the path of the radial marker
 */
wrap(tickProto, 'getMarkPath', function (proceed, x, y, tickLength, tickWidth, horiz, renderer) {
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
		ret = proceed.call(this, x, y, tickLength, tickWidth, horiz, renderer);
	}
	return ret;
});