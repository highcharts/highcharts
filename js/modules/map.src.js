/**
 * @license Map plugin v0.1 for Highcharts
 *
 * (c) 2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/* 
 * See www.highcharts.com/studies/world-map.htm for use case.
 *
 * To do:
 * - Implement legend with specified value ranges
 * - Optimize long variable names and alias adapter methods
 * 
 */
 (function() {
	var plotOptions = Highcharts.getOptions().plotOptions;
				
	/**
	 * Extend the default options with map options
	 */
	plotOptions.map = Highcharts.merge(
		plotOptions.pie, {
			animation: false, // makes the complex shapes slow
			colorByPoint: false,
			weightedOpacity: true,
			minOpacity: 0.2,
			nullColor: '#F8F8F8',
			shadow: false,
			showInLegend: false,
			borderColor: 'silver'
		}
	);
	
	
	
	/**
	 * Add the series type
	 */
	Highcharts.seriesTypes.map = Highcharts.extendClass(Highcharts.seriesTypes.pie, {
		type: 'map',
		
		getBox: function() {
			var series = this,
				chart = series.chart,
				factor,
				maxX = -Math.pow(2, 31), 
				minX =  Math.pow(2, 31) - 1, 
				maxY = -Math.pow(2, 31), 
				minY =  Math.pow(2, 31) - 1
			
			
			// Find the bounding box
			$.each(series.data, function(index, point) {
				var path = point.path,
					i = path.length,
					even = false; // while loop reads from the end
					
				while(i--) {
					if (typeof path[i] === 'number') {
						if (even) { // even = x
							maxX = Math.max(maxX, path[i]);
							minX = Math.min(minX, path[i]);
						} else { // odd = Y
							maxY = Math.max(maxY, path[i]);
							minY = Math.min(minY, path[i]);
						}
						even = !even;
					}
				}
			});
			
			// fit into the least of plot width or plot height
			factor = Math.min(
				chart.plotWidth / (maxX - minX),
				chart.plotHeight / (maxY - minY)
			);
			
			series.mapTranslation = {
				minX: minX,
				minY: minY,
				factor: factor 
			}
		},
		
		/**
		 * Translate the path so that it automatically fits into the plot area box
		 * @param {Object} path
		 */
		translatePath: function(path) {
			
			var series = this,
				chart = series.chart,
				even = false, // while loop reads from the end
				mapTranslation = series.mapTranslation,
				minX = mapTranslation.minX,
				minY = mapTranslation.minY,
				factor = mapTranslation.factor;
			
			// Do the translation
			i = path.length;
			while(i--) {
				if (typeof path[i] === 'number') {
					if (even) { // even = x
						path[i] = Math.round(chart.plotLeft + ((path[i] - minX) * factor));
					} else { // odd = Y
						path[i] = Math.round(chart.plotTop + ((path[i] - minY) * factor));
					}
					even = !even;
				}
			}
			return path;
		},
		
		/**
		 * Add the path option for data points. Find the max value for color calculation.
		 */
		translate: function () {
			var series = this,
				options = series.options,
				maxValue = 0,
				opacity,
				minOpacity = options.minOpacity,
				path,
				color;
	
			// Find the bounding box of the total map
			series.getBox();
	
			$.each(series.data, function (i, point) {
				
				point.shapeType = 'path';
				point.shapeArgs = series.translatePath(point.path);
				
				if (point.y > maxValue) {
					maxValue = point.y;
				}
				
			});
							
			// Set weighted opacity
			if (options.weightedOpacity) {
				color = options.color || Highcharts.getOptions().colors[0];
				$.each(series.data, function(i, point) {
					if (point.y === null) {
						point.color = point.options.color = options.nullColor;
						
					} else if (!point.options.color) {
						opacity = minOpacity + (1 - minOpacity) * (point.y / maxValue);
						point.color = point.options.color = Highcharts.Color(color).setOpacity(opacity).get();
						
						if (options.states.hover.color) {
							point.options.states = {
								hover: {
									color: options.states.hover.color
								}
							};
						}
					}
				});
			}
		},
		
		/**
		 * Disable data labels. To enable them, try using the column prototype and extend it
		 * with a label position similar to the tooltipPos in this plugin.
		 */
		drawDataLabels: function() {}, 
		
		/** 
		 * Use the drawPoints method of column, that is able to handle simple shapeArgs.
		 * Extend it by assigning the tooltip position.
		 */
		drawPoints: function() {
			var series = this,
				saturation,
				bBox;
			
			// make points pass test in drawing
			$.each(series.data, function (i, point) {
				point.plotY = 1; // pass null test in column.drawPoints
				if (point.y === null) {
					point.y = 0;
					point.isNull = true;
				}
			});
			
			Highcharts.seriesTypes.column.prototype.drawPoints.apply(series);
			
			$.each(series.data, function (i, point) {
				bBox = point.graphic.getBBox();
				point.tooltipPos = [
					bBox.x + bBox.width / 2,
					bBox.y + bBox.height / 2
				];
				
				// Reset escapted null points
				if (point.isNull) {
					point.y = null;
				}
			});
		},
		
		/**
		 * Inherit the trackers from scatter, which apply the tracking
		 * events to the point shapes directly
		 */
		drawTracker: Highcharts.seriesTypes.scatter.prototype.drawTracker
	});
})();