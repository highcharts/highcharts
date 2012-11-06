/* ****************************************************************************
 * Start Bubble series code											          *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.bubble = merge(defaultPlotOptions.scatter, {
	dataLabels: {
		inside: true,
		style: {
			color: 'white'
		},
		verticalAlign: 'middle'
	},
	// displayNegative: true,
	marker: {
		// fillOpacity: 0.5,
		lineColor: null, // inherit from series.color
		lineWidth: 1
	},
	minSize: 8,
	maxSize: '20%',
	// negativeColor: null,
	shadow: false,
	stickyTracking: false,
	tooltip: {
		followPointer: true,
		pointFormat: 'x: {point.x}, y: {point.y}, z: {point.z}'
	},
	zThreshold: 0
});

// 2 - Create the series object
seriesTypes.bubble = extendClass(seriesTypes.scatter, {
	type: 'bubble',
	pointArrayMap: ['y', 'z'],
	trackerGroupKey: 'group',
	
	/**
	 * Mapping between SVG attributes and the corresponding options
	 */
	pointAttrToOptions: { 
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor'
	},
	
	/**
	 * Apply the fillOpacity to all fill positions
	 */
	applyOpacity: function (fill) {
		var markerOptions = this.options.marker,
			fillOpacity = pick(markerOptions.fillOpacity, 0.5);
		
		// When called from Legend.colorizeItem, the fill isn't predefined
		fill = fill || markerOptions.fillColor || this.color; 
		
		if (fillOpacity !== 1) {
			fill = Highcharts.Color(fill).setOpacity(fillOpacity).get('rgba');
		}
		return fill;
	},
	
	/**
	 * Extend the convertAttribs method by applying opacity to the fill
	 */
	convertAttribs: function () {
		var obj = Series.prototype.convertAttribs.apply(this, arguments);
		
		obj.fill = this.applyOpacity(obj.fill);
		
		return obj;
	},
	
	/**
	 * Postprocess mapping between options and SVG attributes in order to apply Z threshold
	 */
	getAttribs: function () {
		
		var options = this.options,
			stateOptions = options.states,
			negColor = options.negativeColor,
			seriesNegPointAttr;

		Series.prototype.getAttribs.apply(this, arguments);
		
		if (negColor) {
			seriesNegPointAttr = merge(this.pointAttr);
			
			seriesNegPointAttr[''].fill = this.applyOpacity(negColor);
			seriesNegPointAttr.hover.fill = this.applyOpacity(stateOptions.hover.negativeColor || negColor);
			seriesNegPointAttr.select.fill = this.applyOpacity(stateOptions.select.negativeColor || negColor);
	
			each(this.points, function (point) {
				if (point.z < options.zThreshold) {
					point.pointAttr = seriesNegPointAttr;
				}
			});
		}
	},
	
	/**
	 * Extend the Series.setData method by finding Z data
	 */
	setData: function () {
		
		var chart = this.chart,
			options = this.options,
			data = this.data,
			extremes = {},
			smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
			cutThreshold = options.displayNegative === false ? options.zThreshold : -Number.MAX_VALUE,
			len,
			i,
			z,
			minSize,
			pos,
			radius,
			zData,
			radii = [],
			zMin = Number.MAX_VALUE,
			zMax = -Number.MAX_VALUE,
			zRange;
			
		// Translate the size extremes to pixel values
		each(['minSize', 'maxSize'], function (prop) {
			var length = options[prop],
				isPercent = /%$/.test(length);
			
			length = pInt(length);
			extremes[prop] = isPercent ?
				smallestSize * length / 100 :
				length;
			
		});
		this.minPxSize = minSize = extremes.minSize;
		
		// Run the parent method
		Series.prototype.setData.apply(this, arguments);
		
		// Find the min and max Z
		zData = this.zData;
		zMin = arrayMin(zData);
		zMax = arrayMax(zData);
		
		// Set the shape type and arguments to be picked up in drawPoints
		for (i = 0, len = zData.length; i < len; i++) {
			zRange = zMax - zMin;
			pos = zRange > 0 ? // relative size, a number between 0 and 1
				(zData[i] - zMin) / (zMax - zMin) : 
				0.5;
			radii.push(Math.round(minSize + pos * (extremes.maxSize - minSize)) / 2);
		}
		this.radii = radii;
	},
	
	/**
	 * Perform animation on the bubbles
	 */
	animate: function (init) {
		var animation = this.options.animation;
		
		if (!init) { // run the animation
			each(this.points, function (point) {
				var graphic = point.graphic,
					shapeArgs = point.shapeArgs;

				if (graphic) {
					// start values
					graphic.attr('r', 1);

					// animate
					graphic.animate({
						r: shapeArgs.r
					}, animation);
				}
			});

			// delete this function to allow it only once
			this.animate = null;
		}
	},
	
	/**
	 * Extend the base translate method to handle bubble size
	 */
	translate: function () {
		
		var i,
			data = this.data,
			point,
			radius,
			radii = this.radii;
		
		// Run the parent method
		seriesTypes.scatter.prototype.translate.call(this);
		
		// Set the shape type and arguments to be picked up in drawPoints
		i = data.length;
		while (i--) {
			point = data[i];
			radius = radii[i];
			
			if (radius >= this.minPxSize / 2) {
				// Shape arguments
				point.shapeType = 'circle';
				point.shapeArgs = {
					x: point.plotX,
					y: point.plotY,
					r: radius
				};
				
				// Alignment box for the data label
				point.dlBox = {
					x: point.plotX - radius,
					y: point.plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				};
			} else { // below zThreshold
				point.shapeArgs = point.plotY = point.dlBox = null;
			}
		}
	},
	
	/**
	 * Get the series' symbol in the legend
	 * 
	 * @param {Object} legend The legend object
	 * @param {Object} item The series (this) or point
	 */
	drawLegendSymbol: function (legend, item) {
		var radius = pInt(legend.itemStyle.fontSize) / 2;
		
		item.legendSymbol = this.chart.renderer.circle(
			radius,
			legend.baseline - radius,
			radius
		).attr({
			zIndex: 3
		}).add(item.legendGroup);		
		
	},
	
	drawPoints: seriesTypes.column.prototype.drawPoints,
	alignDataLabel: seriesTypes.column.prototype.alignDataLabel
});

/**
 * Add logic to pad each axis with the amount of pixels
 * necessary to avoid the bubbles to overflow.
 */
Axis.prototype.beforePadding = function () {
	var chart = this.chart,
		axisLength = this.len,
		pxMin = 0, 
		pxMax = axisLength,
		dataKey = this.isXAxis ? 'xData' : 'yData',
		plotLength = this.horiz ? chart.plotWidth : chart.plotHeight,
		min = this.min,
		transA = axisLength / (this.max - min);
	
	if (pick(this.options.min, this.userMin) === UNDEFINED) {
		each(this.series, function (series) {
			var data = series[dataKey],
				i = data.length,
				radius,
				radii = series.radii;
			if (series.type === 'bubble' && series.visible) {
				while (i--) {
					radius = radii[i];
					pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
					pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
				}
			}
		});
		
		pxMax -= axisLength;
		transA *= (axisLength + pxMin - pxMax) / axisLength;
		this.min += pxMin / transA;
		this.max += pxMax / transA;
	}
};

/* ****************************************************************************
 * End Bubble series code                                                     *
 *****************************************************************************/
