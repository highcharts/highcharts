/* ****************************************************************************
 * Start Candlestick series code											  *
 *****************************************************************************/

// 1 - set default options
Highcharts.defaultPlotOptions.candlestick = Highcharts.merge(Highcharts.defaultPlotOptions.column, {
	lineColor: 'black',
	lineWidth: 1,
	states: {
		hover: {
			lineWidth: 2
		}
	},
	tooltip: Highcharts.defaultPlotOptions.ohlc.tooltip,
	threshold: null,
	upColor: 'white'
	// upLineColor: null
});

// 2 - Create the CandlestickSeries object
var CandlestickSeries = Highcharts.extendClass(Highcharts.seriesTypes.ohlc, {
	type: 'candlestick',

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'color',
		stroke: 'lineColor',
		'stroke-width': 'lineWidth'
	},
	upColorProp: 'fill',

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	getAttribs: function () {
		Highcharts.seriesTypes.ohlc.prototype.getAttribs.apply(this, arguments);
		var series = this,
			options = series.options,
			stateOptions = options.states,			
			upLineColor = options.upLineColor || options.lineColor,
			hoverStroke = stateOptions.hover.upLineColor || upLineColor, 
			selectStroke = stateOptions.select.upLineColor || upLineColor;

		// Add custom line color for points going up (close > open).
		// Fill is handled by OHLCSeries' getAttribs.
		Highcharts.each(series.points, function (point) {
			if (point.open < point.close) {
				point.pointAttr[''].stroke = upLineColor;
				point.pointAttr.hover.stroke = hoverStroke;
				point.pointAttr.select.stroke = selectStroke;
			}
		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart,
			pointAttr,
			seriesPointAttr = series.pointAttr[''],
			plotOpen,
			plotClose,
			topBox,
			bottomBox,
			hasTopWhisker,
			hasBottomWhisker,
			crispCorr,
			crispX,
			graphic,
			path,
			halfWidth;


		Highcharts.each(points, function (point) {

			graphic = point.graphic;
			if (point.plotY !== undefined) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''] || seriesPointAttr;

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = Math.round(point.plotX) - crispCorr; // #2596
				plotOpen = point.plotOpen;
				plotClose = point.plotClose;
				topBox = Math.min(plotOpen, plotClose);
				bottomBox = Math.max(plotOpen, plotClose);
				halfWidth = Math.round(point.shapeArgs.width / 2);
				hasTopWhisker = Math.round(topBox) !== Math.round(point.plotY);
				hasBottomWhisker = bottomBox !== point.yBottom;
				topBox = Math.round(topBox) + crispCorr;
				bottomBox = Math.round(bottomBox) + crispCorr;

				// create the path
				path = [
					'M',
					crispX - halfWidth, bottomBox,
					'L',
					crispX - halfWidth, topBox,
					'L',
					crispX + halfWidth, topBox,
					'L',
					crispX + halfWidth, bottomBox,
					'Z', // Use a close statement to ensure a nice rectangle #2602
					'M',
					crispX, topBox,
					'L',
					crispX, hasTopWhisker ? Math.round(point.plotY) : topBox, // #460, #2094
					'M',
					crispX, bottomBox,
					'L',
					crispX, hasBottomWhisker ? Math.round(point.yBottom) : bottomBox // #460, #2094
				];

				if (graphic) {
					graphic
						.attr(pointAttr) // #3897
						.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group)
						.shadow(series.options.shadow);
				}

			}
		});

	}


});

Highcharts.seriesTypes.candlestick = CandlestickSeries;

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/
