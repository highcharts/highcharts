/* ****************************************************************************
 * Start OHLC series code													 *
 *****************************************************************************/

// 1 - Set default options
defaultPlotOptions.ohlc = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	dataGrouping: {
		approximation: 'ohlc',
		enabled: true,
		groupPixelWidth: 5 // allows to be packed tighter than candlesticks
	},
	tooltip: {
		pointFormat: '<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>'	
	},
	states: {
		hover: {
			lineWidth: 3
		}
	},
	threshold: null
});

// 2- Create the OHLCPoint object
var OHLCPoint = extendClass(Point, {
	/**
	 * Apply the options containing the x and OHLC data and possible some extra properties.
	 * This is called on point init or from point.update. Extends base Point by adding
	 * multiple y-like values.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options) {
		var point = this,
			series = point.series,
			pointArrayMap = series.pointArrayMap,
			i = 0,
			j = 0,
			valueCount = pointArrayMap.length;


		// object input
		if (typeof options === 'object' && typeof options.length !== 'number') {

			// copy options directly to point
			extend(point, options);

			point.options = options;
			
		} else if (options.length) { // array
			// with leading x value
			if (options.length > valueCount) {
				if (typeof options[0] === 'string') {
					point.name = options[0];
				} else if (typeof options[0] === 'number') {
					point.x = options[0];
				}
				i++;
			}
			while (j < valueCount) {
				point[pointArrayMap[j++]] = options[i++];
			}
		}

		point.y = point[series.pointValKey];
		
		// If no x is set by now, get auto incremented value. All points must have an
		// x value, however the y value can be null to create a gap in the series
		if (point.x === UNDEFINED && series) {
			point.x = series.autoIncrement();
		}
		
		return point;
	},

	/**
	 * A specific OHLC tooltip formatter
	 */
	tooltipFormatter: function () {
		var point = this,
			series = point.series;

		return ['<span style="color:' + series.color + ';font-weight:bold">', (point.name || series.name), '</span><br/>',
			'Open: ', point.open, '<br/>',
			'High: ', point.high, '<br/>',
			'Low: ', point.low, '<br/>',
			'Close: ', point.close, '<br/>'].join('');

	},
	
	/**
	 * Return a plain array for speedy calculation
	 */
	toYData: function () {
		return [this.open, this.high, this.low, this.close];
	}

});

// 3 - Create the OHLCSeries object
var OHLCSeries = extendClass(seriesTypes.column, {
	type: 'ohlc',
	pointArrayMap: ['open', 'high', 'low', 'close'], // array point configs are mapped to this
	pointValKey: 'high',
	pointClass: OHLCPoint,

	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'color',
		'stroke-width': 'lineWidth'
	},


	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis;

		seriesTypes.column.prototype.translate.apply(series);

		// do the translation
		each(series.points, function (point) {
			// the graphics
			if (point.open !== null) {
				point.plotOpen = yAxis.translate(point.open, 0, 1, 0, 1);
			}
			if (point.close !== null) {
				point.plotClose = yAxis.translate(point.close, 0, 1, 0, 1);
			}

		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			crispCorr,
			halfWidth,
			path,
			graphic,
			crispX;


		each(points, function (point) {
			if (point.plotY !== UNDEFINED) {

				graphic = point.graphic;
				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				halfWidth = mathRound(point.barW / 2);

				// the vertical stem
				path = [
					'M',
					crispX, mathRound(point.yBottom),
					'L',
					crispX, mathRound(point.plotY)
				];

				// open
				if (point.open !== null) {
					plotOpen = mathRound(point.plotOpen) + crispCorr;
					path.push(
						'M',
						crispX,
						plotOpen,
						'L',
						crispX - halfWidth,
						plotOpen
					);
				}

				// close
				if (point.close !== null) {
					plotClose = mathRound(point.plotClose) + crispCorr;
					path.push(
						'M',
						crispX,
						plotClose,
						'L',
						crispX + halfWidth,
						plotClose
					);
				}

				// create and/or update the graphic
				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}


		});

	},

	/**
	 * Disable animation
	 */
	animate: null


});
seriesTypes.ohlc = OHLCSeries;
/* ****************************************************************************
 * End OHLC series code													   *
 *****************************************************************************/
