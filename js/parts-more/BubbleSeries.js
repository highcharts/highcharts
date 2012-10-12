/* ****************************************************************************
 * Start Bubble series code											          *
 *****************************************************************************/

/*
 * http://jsfiddle.net/highcharts/FbjMs/
 * 
 * Todo
 * - Data labels: Create a box that the label can be aligned to.
 * - Add point padding
 * - Optionally allow bubbles below threshold with a specific color
 */

// 1 - set default options
defaultPlotOptions.bubble = merge(defaultPlotOptions.scatter, {
	dataLabels: {
		verticalAlign: 'middle'
	},
	// fillOpacity: 0.75,
	marker: {
		lineWidth: 1
	},
	minSize: 8,
	maxSize: '20%',
	shadow: false,
	tooltip: {
		pointFormat: 'x: {point.x}, y: {point.y}, z: {point.z}'
	}
});

// 2 - Create the series object
seriesTypes.bubble = extendClass(seriesTypes.scatter, {
	type: 'bubble',
	pointArrayMap: ['y', 'z'],
	useMarkerGroup: true,
	
	/**
	 * Mapping between SVG attributes and the corresponding options
	 */
	pointAttrToOptions: { 
		stroke: 'color',
		'stroke-width': 'lineWidth',
		fill: 'color'
	},
	
	/**
	 * Extend the convertAttribs method by applying opacity to the fill
	 */
	convertAttribs: function () {
		var obj = Series.prototype.convertAttribs.apply(this, arguments),
			fillOpacity = pick(this.options.fillOpacity, 0.75);
		
		if (fillOpacity !== 1) {
			obj.fill = Highcharts.Color(obj.fill).setOpacity(fillOpacity).get('rgba');
		}
		
		return obj;
	},
	
	/**
	 * Extend the base translate method to handle bubble size
	 */
	translate: function () {
		
		var chart = this.chart,
			options = this.options,
			data = this.data,
			extremes = {},
			smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
			i,
			point,
			minSize,
			pos,
			zMin = Number.MAX_VALUE,
			zMax = Number.MIN_VALUE;
			
		// Translate the size extremes to pixel values
		each(['minSize', 'maxSize'], function (prop) {
			var length = options[prop],
				isPercent = /%$/.test(length);
			
			length = pInt(length);
			extremes[prop] = isPercent ?
				smallestSize * length / 100 :
				length;
			
		});
		minSize = extremes.minSize;
		
		// Run the parent method
		seriesTypes.scatter.prototype.translate.call(this);
		
		// Find the min and max Z
		i = data.length;
		while(i--) {
			point = data[i];
			
			if (typeof point.z === 'number') {
				if (point.z < zMin) {
					zMin = point.z;
				}
				if (point.z > zMax) {
					zMax = point.z;
				}
			} else {
				point.y = null; // force hide it
			}
		}
		
		// Set the shape type and arguments to be picked up in drawPoints
		i = data.length;
		while(i--) {
			point = data[i];
			
			pos = (point.z - zMin) / (zMax - zMin); // relative size, a number between 0 and 1
			
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: (minSize + pos * (extremes.maxSize - minSize)) / 2 // the radius
			};
		}
	},
	
	drawPoints: seriesTypes.column.prototype.drawPoints
});

/* ****************************************************************************
 * End Bubble series code                                                     *
 *****************************************************************************/
