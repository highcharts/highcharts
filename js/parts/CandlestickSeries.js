/* ****************************************************************************
 * Start Candlestick series code											  *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.candlestick = merge(defaultPlotOptions.column, {
	lineColor: 'black',
	lineWidth: 1,
	states: {
		hover: {
			lineWidth: 2
		}
	},
	tooltip: defaultPlotOptions.ohlc.tooltip,
	threshold: null,
	upColor: 'white'
});

// 2 - Create the CandlestickSeries object
var CandlestickSeries = extendClass(OHLCSeries, {
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
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			topBox,
			bottomBox,
			crispCorr,
			crispX,
			graphic,
			path,
			halfWidth;


		each(points, function (point) {

			graphic = point.graphic;
			if (point.plotY !== UNDEFINED) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				plotOpen = mathRound(point.plotOpen) + crispCorr;
				plotClose = mathRound(point.plotClose) + crispCorr;
				topBox = math.min(plotOpen, plotClose);
				bottomBox = math.max(plotOpen, plotClose);
				halfWidth = mathRound(point.shapeArgs.width / 2);

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
					'L',
					crispX - halfWidth, bottomBox,
					'M',
					crispX, bottomBox,
					'L',
					crispX, mathRound(point.yBottom),
					'M',
					crispX, topBox,
					'L',
					crispX, mathRound(point.plotY),
					'Z'
				];

				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}
		});

	}


});

seriesTypes.candlestick = CandlestickSeries;

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/
