/* ****************************************************************************
 * Start Bubble series code											          *
 *****************************************************************************/

/*
 * http://jsfiddle.net/highcharts/FbjMs/
 * 
 * Todo
 * - Solid lines with gradient color? Consider separate fillColor option.
 * - Move tooltip away from mouse (all scatter-inherited series)
 * - Individual colors. Don't use marker structure?
 * - Animation
 * - For multiple series, the legend marker icons are wrong.
 * - Fill opacity (and perhaps fill color) must be reflected in the legend symbol.
 * - Axis.setAxisTranslation
 *   - Check redrawing/resizing.
 *   - Add minPadding/maxPadding.
 *   - How does this work in combination with columns?
 *   - Stress test with larger bubbles. It might need to be recursive to 
 *     re-check with the new transA, since other bubbles may take the edge 
 *     position when transA changes.
 *   - Do not use with user set extremes.
 */

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
	// fillOpacity: 0.5,
	marker: {
		lineWidth: 1
	},
	minSize: 8,
	maxSize: '20%',
	// negativeColor: null,
	shadow: false,
	tooltip: {
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
		stroke: 'color',
		'stroke-width': 'lineWidth',
		fill: 'color'
	},
	
	/**
	 * Apply the fillOpacity to all fill positions
	 */
	applyOpacity: function (fill) {
		var fillOpacity = pick(this.options.fillOpacity, 0.5);
		
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
