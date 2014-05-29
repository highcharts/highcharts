/*** 
	EXTENSION FOR 3D PIES
***/

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	
	
	var series = this,
		chart = series.chart,
		options = chart.options,
		pieOptions = options.plotOptions.pie,
		depth = pieOptions.depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = pieOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (pieOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		var shapeArgs = point.shapeArgs;

		shapeArgs.z = z;
		shapeArgs.depth = depth * 0.75;
		shapeArgs.origin = origin;
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta;
	
		var angle = (shapeArgs.end + shapeArgs.start) / 2;

		point.slicedTranslation = {
			translateX : round(cos(angle) * series.options.slicedOffset * cos(alpha * deg2rad)),
			translateY : round(sin(angle) * series.options.slicedOffset * cos(alpha * deg2rad))
		};
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype.pointClass.prototype, 'haloPath', function (proceed) {
	return this.series.chart.is3d() ? [] : proceed.call(this);
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {
		// Set the border color to the fill color to provide a smooth edge
		Highcharts.each(this.data, function (point) {
			var c = point.options.borderColor || point.color || point.series.userOptions.borderColor || point.series.color;
			point.options.borderColor = c;
			point.borderColor = c;
			point.pointAttr[''].stroke = c;
			// same bordercolor on hover and select
			point.pointAttr.hover.stroke = c;
			point.pointAttr.select.stroke = c;
		});	
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this;
	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha * deg2rad,
			b1 = shapeArgs.beta * deg2rad,
			a2 = (shapeArgs.start + shapeArgs.end) / 2; 

		if (point.connector) {
			point.connector.translate(
				(-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? sin(b1) * d : 0),
				(-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0)
			);
		}
		if (point.dataLabel) {
			point.dataLabel.attr({
				x: point.dataLabel.connX + (-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? cos(b1) * d : 0) - (point.dataLabel.width / 2),
				y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)
			});
		}
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'addPoint', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.is3d()) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'animate', function (proceed) {
	if (!this.chart.is3d()) {
		proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			init = args[1],
			animation = this.options.animation,
			attribs,
			center = this.center,
			group = this.group,
			markerGroup = this.markerGroup;

		if (Highcharts.svg) { // VML is too slow anyway
				
				if (animation === true) {
					animation = {};
				}
				// Initialize the animation
				if (init) {
				
					// Scale down the group and place it in the center
					this.oldtranslateX = group.translateX;
					this.oldtranslateY = group.translateY;
					attribs = {
						translateX: center[0],
						translateY: center[1],
						scaleX: 0.001, // #1499
						scaleY: 0.001
					};
					
					group.attr(attribs);
					if (markerGroup) {
						markerGroup.attrSetters = group.attrSetters;
						markerGroup.attr(attribs);
					}
				
				// Run the animation
				} else {
					attribs = {
						translateX: this.oldtranslateX,
						translateY: this.oldtranslateY,
						scaleX: 1,
						scaleY: 1
					};
					group.animate(attribs, animation);
					if (markerGroup) {
						markerGroup.animate(attribs, animation);
					}
				
					// Delete this function to allow it only once
					this.animate = null;
				}
				
		}
	}
});