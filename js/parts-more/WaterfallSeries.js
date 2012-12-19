/* ****************************************************************************
 * Start Waterfall series code                                                *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
});

// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	upColorProp: 'fill',

	pointArrayMap: ['y', 'low'],

	pointValKey: 'y',

	/**
	 * Translate data points from raw values
	 */
	translate: function () {
		var previous,
			sum = 0;

		seriesTypes.column.prototype.translate.apply(this);

		each(this.points, function (point) {
			var shapeArgs = point.shapeArgs,
				height = shapeArgs.height,
				y = shapeArgs.y,
				axis,
				zero;

			// sum only points with value, not intermediate or total sum
			if (point.y) {
				sum += point.y;
			}


			// if previous point is specified we start from its end value
			if (previous) {
				y = previous;

				// calculate up or down points based on y value
				if (point.y >= 0) {
					y -= height;
					previous = y;
				} else {
					previous = y + height;
				}


				// calculate sum points
				if (point.isSum) {

					axis = point.series.yAxis;

					point.plotY = previous;
					height = axis.len - previous;

					point.y = sum;
				}

				shapeArgs.y = y;
				shapeArgs.height = height;

			// otherwise we start from 0
			} else {
				previous = y;
			}
		});
	},

	/**
	 * Call default processData then override yData to reflect waterfall's extremes on yAxis
	 */
	processData: function (force) {
		Series.prototype.processData.call(this, force);

		var series = this,
			yData = series.yData,
			length = yData.length,
			previous,
			current,
			i;


		for (i = 1; i < length; i++) {
			current = yData[i];
			previous = yData[i - 1];

			if (current[1] === null) {
				current[1] = current[1] + previous[0] + previous[1];
			}

			if (current[0] === null) {
				current[0] = previous[0];
			}

			current[2] = current[0] + current[1];
		}
	},

	/**
	 * Return [y, low] array, if low is not defined, it's replaced with null for further calculations
	 */
	toYData: function (pt) {
		var y = pt.y === UNDEFINED ? null : pt.y;
				low = pt.low === UNDEFINED ? null : pt.low;
		return [y, low];
	},

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	getAttribs: function () {
		seriesTypes.column.prototype.getAttribs.apply(this, arguments);

		var series = this,
			options = series.options,
			stateOptions = options.states,
			upColor = options.upColor || series.color,
			seriesDownPointAttr = merge(series.pointAttr),
			upColorProp = series.upColorProp;

		seriesDownPointAttr[''][upColorProp] = upColor;
		seriesDownPointAttr.hover[upColorProp] = stateOptions.hover.upColor || upColor;
		seriesDownPointAttr.select[upColorProp] = stateOptions.select.upColor || upColor;

		each(series.points, function (point) {
			if (point.y > 0) {
				point.pointAttr = seriesDownPointAttr;
			}
		});
	},

	/**
	 * Draw columns' connector lines
	 */
	getGraphPath: function () {

		var data = this.data,
				length = data.length,
				lineWidth = this.options.lineWidth + this.options.borderWidth,
				normalizer = mathRound(lineWidth) % 2 / 2,
				path = [],
				M = 'M',
				L = 'L',
				prevArgs,
				pointArgs,
				i,
				d;

		for (i = 1; i < length; i++) {
			pointArgs = data[i].shapeArgs;
			prevArgs = data[i - 1].shapeArgs;

			d = [
				M,
				prevArgs.x + prevArgs.width, prevArgs.y + normalizer,
				L,
				pointArgs.x, prevArgs.y + normalizer
			];

			if (data[i - 1].y < 0) {
				d[2] += prevArgs.height;
				d[5] += prevArgs.height;
			}

			path = path.concat(d);
		}

		return path;
	},

	/**
	 * Place sums' dataLabels on the top of column regardles of its value
	 */
	alignDataLabel: function (point, dataLabel, options,  alignTo, isNew) {
		var dlBox;

		if (point.isSum) {
			dlBox = point.dlBox || point.shapeArgs;

			if (dlBox) {
				alignTo = merge(dlBox);
			}

			alignTo.height = 0;
			options.verticalAlign = 'bottom';
			options.align = pick(options.align, 'center');

			Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
		} else {
			seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
		}
	},

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code                                                  *
 *****************************************************************************/
