/* ****************************************************************************
 * Start Bubble series code											          *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.bubble = merge(defaultPlotOptions.scatter, {
	dataLabels: {
		inside: true,
		style: {
			color: 'white',
			textShadow: '0px 0px 3px black'
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
	tooltip: {
		pointFormat: '({point.x}, {point.y}), Size: {point.z}'
	},
	turboThreshold: 0, // docs: exclude from bubbles
	zThreshold: 0
});

// 2 - Create the series object
seriesTypes.bubble = extendClass(seriesTypes.scatter, {
	type: 'bubble',
	pointArrayMap: ['y', 'z'],
	trackerGroups: ['group', 'dataLabelsGroup'],
	
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
	 * Get the radius for each point based on the minSize, maxSize and each point's Z value. This
	 * must be done prior to Series.translate because the axis needs to add padding in 
	 * accordance with the point sizes.
	 */
	getRadii: function (zMin, zMax, minSize, maxSize) {
		var len,
			i,
			pos,
			zData = this.zData,
			radii = [],
			zRange;
		
		// Set the shape type and arguments to be picked up in drawPoints
		for (i = 0, len = zData.length; i < len; i++) {
			zRange = zMax - zMin;
			pos = zRange > 0 ? // relative size, a number between 0 and 1
				(zData[i] - zMin) / (zMax - zMin) : 
				0.5;
			radii.push(math.ceil(minSize + pos * (maxSize - minSize)) / 2);
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

				if (graphic && shapeArgs) {
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
			radius = radii ? radii[i] : 0; // #1737

			// Flag for negativeColor to be applied in Series.js
			point.negative = point.z < (this.options.zThreshold || 0);
			
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
				point.shapeArgs = point.plotY = point.dlBox = UNDEFINED; // #1691
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
	var axis = this,
		axisLength = this.len,
		chart = this.chart,
		pxMin = 0, 
		pxMax = axisLength,
		isXAxis = this.isXAxis,
		dataKey = isXAxis ? 'xData' : 'yData',
		min = this.min,
		extremes = {},
		smallestSize = math.min(chart.plotWidth, chart.plotHeight),
		zMin = Number.MAX_VALUE,
		zMax = -Number.MAX_VALUE,
		range = this.max - min,
		transA = axisLength / range,
		activeSeries = [];

	// Handle padding on the second pass, or on redraw
	if (this.tickPositions) {
		each(this.series, function (series) {

			var seriesOptions = series.options,
				zData;

			if (series.type === 'bubble' && series.visible) {

				// Correction for #1673
				axis.allowZoomOutside = true;

				// Cache it
				activeSeries.push(series);

				if (isXAxis) { // because X axis is evaluated first
				
					// For each series, translate the size extremes to pixel values
					each(['minSize', 'maxSize'], function (prop) {
						var length = seriesOptions[prop],
							isPercent = /%$/.test(length);
						
						length = pInt(length);
						extremes[prop] = isPercent ?
							smallestSize * length / 100 :
							length;
						
					});
					series.minPxSize = extremes.minSize;
					
					// Find the min and max Z
					zData = series.zData;
					if (zData.length) { // #1735
						zMin = math.min(
							zMin,
							math.max(
								arrayMin(zData), 
								seriesOptions.displayNegative === false ? seriesOptions.zThreshold : -Number.MAX_VALUE
							)
						);
						zMax = math.max(zMax, arrayMax(zData));
					}
				}
			}
		});

		each(activeSeries, function (series) {

			var data = series[dataKey],
				i = data.length,
				radius;

			if (isXAxis) {
				series.getRadii(zMin, zMax, extremes.minSize, extremes.maxSize);
			}
			
			if (range > 0) {
				while (i--) {
					radius = series.radii[i];
					pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
					pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
				}
			}
		});
		
		if (range > 0 && pick(this.options.min, this.userMin) === UNDEFINED && pick(this.options.max, this.userMax) === UNDEFINED) {
			pxMax -= axisLength;
			transA *= (axisLength + pxMin - pxMax) / axisLength;
			this.min += pxMin / transA;
			this.max += pxMax / transA;
		}
	}
};

/* ****************************************************************************
 * End Bubble series code                                                     *
 *****************************************************************************/
