(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		each = H.each,
		extendClass = H.extendClass,
		merge = H.merge,
		Point = H.Point,
		seriesTypes = H.seriesTypes;

/* ****************************************************************************
 * Start OHLC series code													 *
 *****************************************************************************/

// 1 - Set default options
defaultPlotOptions.ohlc = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	tooltip: {
		/*= if (!build.classic) { =*/
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> <b> {series.name}</b><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>',
		/*= } else { =*/
		pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>'
		/*= } =*/
	},
	states: {
		hover: {
			lineWidth: 3
		}
	},
	threshold: null
	//upColor: undefined
});

// 2 - Create the OHLCSeries object
seriesTypes.ohlc = extendClass(seriesTypes.column, {
	type: 'ohlc',

	// Override the point class
	pointClass: extendClass(Point, {
	 	/**
	 	 * Add up or down to the class name
	 	 */
		getClassName: function () {
			return Point.prototype.getClassName.call(this) +
				(this.open < this.close ? ' highcharts-point-up' : ' highcharts-point-down');
		}
	}),
	pointArrayMap: ['open', 'high', 'low', 'close'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.open, point.high, point.low, point.close];
	},
	pointValKey: 'high',

	/*= if (build.classic) { =*/
	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	pointAttribs: function (point, state) {
		var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state),
			options = this.options;

		delete attribs.fill;
		attribs['stroke-width'] = options.lineWidth;

		attribs.stroke = point.options.color || (point.open < point.close ? (options.upColor || this.color) : this.color);

		return attribs;
	},
	/*= } =*/

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
			if (point.plotY !== undefined) {

				graphic = point.graphic;
				pointAttr = series.pointAttribs(point, point.selected && 'select');

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = Math.round(point.plotX) - crispCorr;  // #2596
				halfWidth = Math.round(point.shapeArgs.width / 2);

				// the vertical stem
				path = [
					'M',
					crispX, Math.round(point.yBottom),
					'L',
					crispX, Math.round(point.plotY)
				];

				// open
				if (point.open !== null) {
					plotOpen = Math.round(point.plotOpen) + crispCorr;
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
					plotClose = Math.round(point.plotClose) + crispCorr;
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
					graphic
						.attr(pointAttr) // #3897
						.animate({ d: path });
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
/* ****************************************************************************
 * End OHLC series code													   *
 *****************************************************************************/

	return H;
}(Highcharts));
