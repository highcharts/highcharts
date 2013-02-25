/* ****************************************************************************
 * Start Waterfall series code                                                *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	lineColor: '#333',
	dashStyle: 'dot',
	borderWidth: 1,
	borderColor: '#333',
	shadow: false
});


// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	upColorProp: 'fill',

	pointArrayMap: ['y', 'low'],

	pointValKey: 'y',

	/**
	 * Init waterfall series, force stacking
	 */
	init: function (chart, options) {
		options.stacking = true;
		seriesTypes.column.prototype.init.call(this, chart, options);
	},


	/**
	 * Translate data points from raw values
	 */
	translate: function () {
		var series = this,
			options = series.options,
			stacking = options.stacking,
			axis = series.yAxis,
			len,
			i,

			points,
			point,
			shapeArgs,
			sum = 0,
			sumStart = 0,
			subSum = 0,
			subSumStart = 0,
			edges,
			cumulative,
			prevStack,
			prevY,
			stack,
			y,
			h,
			crispCorr = (options.borderWidth % 2) / 2;

		// run column series translate
		seriesTypes.column.prototype.translate.apply(this);


		points = this.points;
		subSumStart = sumStart = points[0];

		for (i = 1, len = points.length; i < len; i++) {
			// cache current point object
			point = points[i];
			shapeArgs = point.shapeArgs;

			if (stacking) {
				// get current and previous stack
				stack = series.getStack(i);
				prevStack = series.getStack(i - 1);
				prevY = series.getStackY(prevStack);
			}

			// set new intermediate sum values after reset
			if (subSumStart === null) {
				subSumStart = point;
				subSum = 0;
			}

			// sum only points with value, not intermediate or total sum
			if (point.y && !point.isSum && !point.isIntermediateSum) {
				sum += point.y;
				subSum += point.y;
			}

			// calculate sum points
			if (point.isSum || point.isIntermediateSum) {

				if (point.isIntermediateSum) {
					edges = series.getSumEdges(subSumStart, points[i - 1]);
					point.y = subSum;
					subSumStart = null;
				} else {
					edges = series.getSumEdges(sumStart, points[i - 1]);
					point.y = sum;
				}

				shapeArgs.y = point.plotY = edges[1];
				shapeArgs.height = edges[0] - edges[1];

			// calculate other (up or down) points based on y value
			} else if (point.y < 0) {

				if (stacking) {
					// use "_cum" instead of already calculated "cum" to avoid reverse ordering negative columns
					cumulative = stack._cum === null ? prevStack.total : stack._cum;
					stack._cum = cumulative + point.y;
					y = mathCeil(axis.translate(cumulative, 0, 1)) - crispCorr;
					h = axis.translate(stack._cum, 0, 1);
				}

				shapeArgs.y = y;
				shapeArgs.height = mathCeil(h - y);
			} else {
				if (!stacking) {
					shapeArgs.y -= points[i - 1].shapeArgs.height;
				} else if (shapeArgs.y + shapeArgs.height > prevY) {
					shapeArgs.height = mathFloor(prevY - shapeArgs.y);
				}
			}
		}
	},

	/**
	 * Call default processData then override yData to reflect waterfall's extremes on yAxis
	 */
	processData: function (force) {
		Series.prototype.processData.call(this, force);

		var series = this,
			options = series.options,
			yData = series.yData,
			length = yData.length,
			prev,
			curr,
			i;

		prev = options.threshold;

		for (i = 0; i < length; i++) {
			curr = yData[i];

			// processed yData only if it's not already processed
			if (curr !== null && typeof curr !== 'number') {

				if (curr === "sum" || curr === "intermediateSum") {
					yData[i] = null;

				} else {
					yData[i] = curr[0];
				}

				prev = yData[i];
			}
		}
	},

	/**
	 * Return [y, low] array, if low is not defined, it's replaced with null for further calculations
	 */
	toYData: function (pt) {
		if (pt.isSum) {
			return "sum";
		} else if (pt.isIntermediateSum) {
			return "intermediateSum";
		}

		return [pt.y];
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

	getStack: function (i) {
		var axis = this.yAxis,
			stacks = axis.stacks,
			key = this.stackKey;

		if (this.processedYData[i] < 0) {
			key = '-' + key;
		}

		return stacks[key][i];
	},

	getStackY: function (stack) {
		return mathCeil(this.yAxis.translate(stack.total, null, true));
	},

	/**
	 * Return array of top and bottom position for sum column based on given edge points
	 */
	getSumEdges: function (pointA, pointB) {
		var valueA,
			valueB,
			tmp;

		valueA = pointA.y >= 0 ? pointA.shapeArgs.y + pointA.shapeArgs.height : pointA.shapeArgs.y;
		valueB = pointB.y >= 0 ? pointB.shapeArgs.y : pointB.shapeArgs.y + pointB.shapeArgs.height;

		if (valueB > valueA) {
			tmp = valueA;
			valueA = valueB;
			valueB = tmp;
		}

		return [valueA, valueB];
	},

	/**
	 * Place sums' dataLabels on the top of column regardles of its value
	 */
	_alignDataLabel: function (point, dataLabel, options,  alignTo, isNew) {
		var dlBox;

		if (point.isSum || point.isIntermediateSum) {
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
