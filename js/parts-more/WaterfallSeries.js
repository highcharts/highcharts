/* ****************************************************************************
 * Start Waterfall series code                                                *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	lineColor: '#333',
	dashStyle: 'dot',
	borderColor: '#333'
});


// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	upColorProp: 'fill',

	pointArrayMap: ['low', 'y'],

	pointValKey: 'y',

	/**
	 * Init waterfall series, force stacking
	 */
	init: function (chart, options) {
		// force stacking
		options.stacking = true;

		seriesTypes.column.prototype.init.call(this, chart, options);
	},


	/**
	 * Translate data points from raw values
	 */
	translate: function () {
		var series = this,
			options = series.options,
			axis = series.yAxis,
			len,
			i,
			points,
			point,
			shapeArgs,
			stack,
			y,
			previousY,
			stackPoint,
			threshold = options.threshold,
			crispCorr = (options.borderWidth % 2) / 2;

		// run column series translate
		seriesTypes.column.prototype.translate.apply(this);

		previousY = threshold;
		points = series.points;

		for (i = 0, len = points.length; i < len; i++) {
			// cache current point object
			point = points[i];
			shapeArgs = point.shapeArgs;

			// get current stack
			stack = series.getStack(i);
			stackPoint = stack.points[series.index];

			// override point value for sums
			if (isNaN(point.y)) {
				point.y = series.yData[i];
			}

			// up points
			y = mathMax(previousY, previousY + point.y) + stackPoint[0];
			shapeArgs.y = axis.translate(y, 0, 1);


			// sum points
			if (point.isSum || point.isIntermediateSum) {
				shapeArgs.y = axis.translate(stackPoint[1], 0, 1);
				shapeArgs.height = axis.translate(stackPoint[0], 0, 1) - shapeArgs.y;

			// if it's not the sum point, update previous stack end position
			} else {
				previousY += stack.total;
			}

			// negative points
			if (shapeArgs.height < 0) {
				shapeArgs.y += shapeArgs.height;
				shapeArgs.height *= -1;
			}

			point.plotY = shapeArgs.y = mathRound(shapeArgs.y) - crispCorr;
			shapeArgs.height = mathRound(shapeArgs.height);
			point.yBottom = shapeArgs.y + shapeArgs.height;
		}
	},

	/**
	 * Call default processData then override yData to reflect waterfall's extremes on yAxis
	 */
	processData: function (force) {
		var series = this,
			options = series.options,
			yData = series.yData,
			dataLength = yData.length,
			threshold = options.threshold,
			subSum,
			sum,
			y,
			i;

		sum = subSum = threshold;

		for (i = 0; i < dataLength; i++) {
			y = yData[i];

			if (y === "sum") {
				yData[i] = sum;
			} else if (y === "intermediateSum") {
				yData[i] = subSum;
				subSum = threshold;
			} else {
				sum += y;
				subSum += y;
			}
		}

		Series.prototype.processData.call(this, force);
	},

	/**
	 * Return y value or string if point is sum
	 */
	toYData: function (pt) {
		if (pt.isSum) {
			return "sum";
		} else if (pt.isIntermediateSum) {
			return "intermediateSum";
		}

		return pt.y;
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
			hoverColor = Highcharts.Color(upColor).brighten(0.1).get(),
			seriesDownPointAttr = merge(series.pointAttr),
			upColorProp = series.upColorProp;

		seriesDownPointAttr[''][upColorProp] = upColor;
		seriesDownPointAttr.hover[upColorProp] = stateOptions.hover.upColor || hoverColor;
		seriesDownPointAttr.select[upColorProp] = stateOptions.select.upColor || upColor;

		each(series.points, function (point) {
			if (point.y > 0 && !point.color) {
				point.pointAttr = seriesDownPointAttr;
				point.color = upColor;
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
	 * Return stack for given index
	 */
	getStack: function (i) {
		var axis = this.yAxis,
			stacks = axis.stacks,
			key = this.stackKey;

		if (this.processedYData[i] < this.options.threshold) {
			key = '-' + key;
		}

		return stacks[key][i];
	},

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code                                                  *
 *****************************************************************************/
