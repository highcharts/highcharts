(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		each = H.each,
		extendClass = H.extendClass,
		merge = H.merge,
		seriesTypes = H.seriesTypes;

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
	// upLineColor: null
});

// 2 - Create the CandlestickSeries object
seriesTypes.candlestick = extendClass(seriesTypes.ohlc, {
	type: 'candlestick',

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	pointAttribs: function (point, state) {
		var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state),
			options = this.options,
			isUp = point.open < point.close,
			stroke = options.lineColor || this.color;

		attribs['stroke-width'] = options.lineWidth;

		attribs.fill = point.options.color || (isUp ? (options.upColor || this.color) : this.color);
		attribs.stroke = point.lineColor || (isUp ? (options.upLineColor || stroke) : stroke);

		// Select or hover states
		if (state) {
			stateOptions = options.states[state];
			attribs.fill = stateOptions.color || attribs.fill;
			attribs.stroke = stateOptions.stroke || attribs.stroke;
		}


		return attribs;
	},

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
			if (point.plotY !== undefined) {

				pointAttr = series.pointAttribs(point, point.selected && 'select');

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

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/

	return H;
}(Highcharts));
