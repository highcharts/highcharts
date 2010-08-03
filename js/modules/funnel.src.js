/** 
 * @license Highcharts JS v2.0 (prerelease)
 * Funnel module
 * 
 * (c) 2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

/*
 * To do:
 * - Bugs on width and height. Experiment with different container size and funnel positions.
 * - Tooltip missing on last point
 */

(function(){

// create shortcuts
var HC = Highcharts, 
	addEvent = HC.addEvent,
	defaultOptions = HC.getOptions(),
	defaultPlotOptions = defaultOptions.plotOptions,
	seriesTypes = HC.seriesTypes,
	map = HC.map,
	merge = HC.merge,
	each = HC.each,
	math = Math;

// set default options
defaultPlotOptions.funnel = merge(defaultPlotOptions.pie, {
	width: '90%',
	neckWidth: '30%',
	height: '100%',
	neckHeight: '25%',
	
	dataLabels: {
		connectorWidth: 1,
		connectorColor: '#606060'
	}
});

var FunnelSeries = Highcharts.extendClass(seriesTypes.pie, {
	type: 'funnel',	

	
	/**
	 * Overrides the pie translate method
	 */
	translate: function() {
		// get positions - either an integer or a percentage string must be given
		function getLength(length, relativeTo) {
			return /%$/.test(length) ? 
				relativeTo * parseInt(length, 10) / 100:
				parseInt(length, 10);
		};
		

		var sum = 0,
			series = this,
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,			
			cumulative = 0, // start at top
			options = series.options,
			center = options.center,
			centerX = getLength(center[0], plotWidth),
			centerY = getLength(center[0], plotHeight),
			width = getLength(options.width, plotWidth),
			tempWidth,
			getWidthAt,
			height = getLength(options.height, plotHeight),
			neckWidth = getLength(options.neckWidth, plotWidth),
			neckHeight = getLength(options.neckHeight, plotHeight),
			neckY = height - neckHeight,
			data = series.data,
			path,
			
			x1, y1, x2, x3, y3, x4, y5;
			
		// Return the width at a specific y coordinate
		series.getWidthAt = getWidthAt = function(y) {
			return y > height - neckHeight ?
				neckWidth : 
				neckWidth + (width - neckWidth) * ((height - neckHeight - y) / (height - neckHeight));
		
		};
		
		// Expose
		series.centerX = centerX;
			
		/*
		 * Individual point coordinate naming:
		 * 
		 * x1,y1 _________________ x2,y1
		 *  \                         /
		 *   \                       /
		 *    \                     /
		 *     \                   /
		 *      \                 /
		 *     x3,y3 _________ x4,y3
		 *     
		 * Additional for the base of the neck:
		 *     
		 *       |               |
		 *       |               |
		 *       |               |
		 *     x3,y5 _________ x4,y5
		 */
			

		
					
		// get the total sum
		each (data, function(point) {
			sum += point.y;
		});
		
		each (data, function(point) {
			// set start and end positions
			y5 = null;
			fraction = sum ? point.y / sum : 0;
			y1 = cumulative * height;
			y3 = y1 + fraction * height;
			//tempWidth = neckWidth + (width - neckWidth) * ((height - neckHeight - y1) / (height - neckHeight));
			tempWidth = getWidthAt(y1);
			x1 = centerX - tempWidth / 2;
			x2 = x1 + tempWidth;
			tempWidth = getWidthAt(y3);
			x3 = centerX - tempWidth / 2;
			x4 = x3 + tempWidth;
			
			// the entire point is within the neck
			if (y1 > neckY) {
				x1 = x3 = centerX - neckWidth / 2;
				x2 = x4 = centerX + neckWidth / 2; 
			}
			
			// the base of the neck
			else if (y3 > neckY) {
				y5 = y3;
				
				tempWidth = getWidthAt(neckY);
				x3 = centerX - tempWidth / 2;
				x4 = x3 + tempWidth;
				
				y3 = neckY;
			}
			
			// save the path
			path = [
				'M',
				x1, y1,
				'L',
				x2, y1,
				x4, y3
			];
			if (y5) {
				path.push(x4, y5, x3, y5);
			}
			path.push(x3, y3, 'Z');
			
			// prepare for using shared dr
			point.shapeType = 'path';
			point.shapeArgs = path;
			
			
			// for tooltips and data labels
			point.percentage = fraction * 100;
			
			// Placement of tooltips and data labels
			point.tooltipPos = [
				centerX,
				(y1 + (y5 || y3)) / 2 + 10
			];
			
			cumulative += fraction;
		});
		
		
		series.setTooltipPoints();
	},
	/**
	 * Draw a single point (wedge)
	 * @param {Object} point The point object
	 * @param {Object} color The color of the point
	 * @param {Number} brightness The brightness relative to the color
	 */
	drawPoints: function(point) {
		var series = this,
			options = series.options,
			chart = series.chart,
			renderer = chart.renderer,
			trackerRect = chart.trackerRect,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop;
			//y = point.y,
			//height = point.height;
			
		each (series.data, function(point) {
			
			if (!point.group) {
				
				point.group = renderer.g('point').add(series.group).
					translate(plotLeft, plotTop);
					
				
				point.graphic = renderer.path(point.shapeArgs).
					attr({ 
						//fill: Color(color).brighten(brightness).get(ctx),
						fill: point.color,
						stroke: options.borderColor,
						'stroke-width': options.borderWidth
					}).
					add(point.group);
									
			}
		});	
	},
	
	
	/**
	 * Draw a connector from an individual point to its data label
	 */
	drawConnector: function(point) {
		var series = this,
			dataLabelOptions = series.options.dataLabels,
			bBox = point.dataLabel.getBBox(),
			connectorWidth = dataLabelOptions.connectorWidth,
			y = bBox.y + bBox.height / 2 + connectorWidth / 2 % 1;			
		
		point.connector = series.chart.renderer.path([
			'M',
			bBox.x + bBox.width + 5, y,
			'L',
			series.centerX - series.getWidthAt(y) / 2 - 5, y
		]).attr({
			'stroke-width': connectorWidth,
			stroke: dataLabelOptions.connectorColor
		}).add(point.group);
	}
	
});
seriesTypes.funnel = FunnelSeries;


})();
