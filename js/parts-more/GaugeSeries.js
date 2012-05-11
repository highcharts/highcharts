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
		extend(this.yAxis, radialAxisMixin);
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