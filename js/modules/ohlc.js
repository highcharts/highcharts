/** 
 * @license Highcharts JS v2.0 (prerelease)
 * OHLC series module
 * 
 * (c) 2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

// create shortcuts
var HC = Highcharts, 
	addEvent = HC.addEvent,
	defaultOptions = HC.defaultOptions,
	defaultPlotOptions = defaultOptions.plotOptions,
	seriesTypes = HC.seriesTypes,
	map = HC.map,
	merge = HC.merge,
	each = HC.each,
	math = Math;
	
// set default options
defaultPlotOptions.OHLC = merge(defaultPlotOptions.line, {
	lineWidth: 1,
	lineColor: null
});

// Create the OHLCPoint object
var OHLCPoint = Highcharts.extendClass(Highcharts.Point, {
	/**
	 * Apply the options containing the x and OHLC data and possible some extra properties.
	 * This is called on point init or from point.update. Extends base Point by adding
	 * multiple y-like values.
	 * 
	 * @param {Object} options
	 */
	applyOptions: function(options) {
		var point = this,
			series = point.series,
			n, 
			i = 0;
	
		
		// object input for example:
		// { x: Date(2010, 0, 1), open: 7.88, high: 7.99, low: 7.02, close: 7.65 } 
		if (typeof options == 'object' && typeof options.length != 'number') {
			
			// copy options directly to point
			extend(point, options);
			
			point.options = options;
		}
		
		// array 
		else if (options.length) {
			// with leading x value
			if (options.length == 5) {
				if (typeof options[0] == 'string') {
					point.name = options[0];
				} else if (typeof options[0] == 'number') {
					point.x = options[0];
				}
				i++;
			}
			point.open = options[i++];
			point.high = options[i++];
			point.low = options[i++];
			point.close = options[i++];
		}
		
		/* 
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		point.y = point.high;
		if (point.x === undefined) {
			point.x = series.autoIncrement();
		}
		
	}	
	
});
	
// Create the OHLCSeries object
var OHLCSeries = Highcharts.extendClass(Highcharts.Series, {
	type: 'OHLC',
	pointClass: OHLCPoint,
	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function() {
		var chart = this.chart, 
			series = this, 
			categories = series.xAxis.categories,
			yAxis = series.yAxis,
			stack = yAxis.stacks[series.type];
			
		// do the translation
		each(this.data, function(point) {
			var xValue = point.x, 
				yValue = point.high; 
				
			point.plotX = series.xAxis.translate(xValue);
			
			// set the y value
			if (yValue !== null) {
				point.plotY = yAxis.translate(yValue, 0, 1);
			}
			// the graphics
			point.plotOpen = yAxis.translate(point.open, 0, 1);
			point.plotHigh = yAxis.translate(point.high, 0, 1);
			point.plotLow = yAxis.translate(point.low, 0, 1);
			point.plotClose = yAxis.translate(point.close, 0, 1);
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ? 
				chart.plotHeight - point.plotX : 
				point.plotX; // for mouse tracking
				
			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ? 
				categories[point.x] : point.x;
				
			
		});
	},
	
	drawPoints: function() {
		var series = this,  //state = series.state,
			//layer = series.stateLayers[state], 
			seriesOptions = series.options, 
			seriesStateAttr = series.stateAttr,
			data = series.data, 
			chart = series.chart,
			crispX;
		
		
		// cache the 'normal' state attributes
		if (!seriesStateAttr['']) {
			seriesOptions.lineColor = series.color;	
			seriesStateAttr[''] = series.getStateAttributes(seriesOptions);
		}
				
		each(data, function(point) {
			
			if (point.plotY !== undefined && 
					point.plotX >= 0 && point.plotX <= chart.plotSizeX &&
					point.plotY >= 0 && point.plotY <= chart.plotSizeY) {
				
				
				crispX = Math.round(point.plotX) + (seriesOptions.lineWidth % 2) / 2;
				
				point.graphic = chart.renderer.path([
						'M',
						crispX, point.plotLow,
						'L', 
						crispX, point.plotHigh,
						'M',
						crispX, point.plotOpen,
						'L',
						crispX - 2, point.plotOpen,
						'M',
						crispX, point.plotClose,
						'L',
						crispX + 2, point.plotClose,						
						'Z'
					])
					.attr(series.stateAttr[''])
					.add(series.group);
				
				
			}
			
			// draw the selected mode marker on top of the default one
			if (point.selected)	{
				series.drawPointState(point, 'select');
			}
			
		});

	},
	
	drawLine: function() {
	}
});
seriesTypes.OHLC = OHLCSeries;