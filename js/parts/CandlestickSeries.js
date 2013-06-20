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
			hasTopWhisker,
			hasBottomWhisker,
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
				plotOpen = point.plotOpen;
				plotClose = point.plotClose;
				topBox = math.min(plotOpen, plotClose);
				bottomBox = math.max(plotOpen, plotClose);
				halfWidth = mathRound(point.shapeArgs.width / 2);
				hasTopWhisker = mathRound(topBox) !== mathRound(point.plotY);
				hasBottomWhisker = bottomBox !== point.yBottom;
				topBox = mathRound(topBox) + crispCorr;
				bottomBox = mathRound(bottomBox) + crispCorr;

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
					crispX - halfWidth, bottomBox
				];
				if (hasTopWhisker) {
					path.push(
						'M',
						crispX, 
						topBox,
						'L',
						crispX, 
						mathRound(point.plotY)
					);
				}
				if (hasBottomWhisker) {
					path.push(
						'M',
						crispX, 
						bottomBox,
						'L',
						crispX, 
						mathRound(point.yBottom)
					);
				}
				path.push(
					'Z'
				);

				if (graphic) {
					graphic.animate({ d: path });
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

seriesTypes.candlestick = CandlestickSeries;

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/
