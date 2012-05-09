/**
 * Create a new axis object
 * @param {Object} chart
 * @param {Object} options
 */
function Axis() {
	this.init.apply(this, arguments);
}

Axis.prototype = {
	
	/**
	 * Default options for the X axis - the Y axis has extended defaults 
	 */
	defaultOptions: {
		// allowDecimals: null,
		// alternateGridColor: null,
		// categories: [],
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%e. %b',
			week: '%e. %b',
			month: '%b \'%y',
			year: '%Y'
		},
		endOnTick: false,
		gridLineColor: '#C0C0C0',
		// gridLineDashStyle: 'solid',
		// gridLineWidth: 0,
		// reversed: false,
	
		labels: defaultLabelOptions,
			// { step: null },
		lineColor: '#C0D0E0',
		lineWidth: 1,
		//linkedTo: null,
		//max: undefined,
		//min: undefined,
		minPadding: 0.01,
		maxPadding: 0.01,
		//minRange: null,
		minorGridLineColor: '#E0E0E0',
		// minorGridLineDashStyle: null,
		minorGridLineWidth: 1,
		minorTickColor: '#A0A0A0',
		//minorTickInterval: null,
		minorTickLength: 2,
		minorTickPosition: 'outside', // inside or outside
		//minorTickWidth: 0,
		//opposite: false,
		//offset: 0,
		//plotBands: [{
		//	events: {},
		//	zIndex: 1,
		//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
		//}],
		//plotLines: [{
		//	events: {}
		//  dashStyle: {}
		//	zIndex:
		//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
		//}],
		//reversed: false,
		// showFirstLabel: true,
		// showLastLabel: true,
		startOfWeek: 1,
		startOnTick: false,
		tickColor: '#C0D0E0',
		//tickInterval: null,
		tickLength: 5,
		tickmarkPlacement: 'between', // on or between
		tickPixelInterval: 100,
		tickPosition: 'outside',
		tickWidth: 1,
		title: {
			//text: null,
			align: 'middle', // low, middle or high
			//margin: 0 for horizontal, 10 for vertical axes,
			//rotation: 0,
			//side: 'outside',
			style: {
				color: '#6D869F',
				//font: defaultFont.replace('normal', 'bold')
				fontWeight: 'bold'
			}
			//x: 0,
			//y: 0
		},
		type: 'linear' // linear, logarithmic or datetime
	},
	
	/**
	 * This options set extends the defaultOptions for Y axes
	 */
	defaultYAxisOptions: {
		endOnTick: true,
		gridLineWidth: 1,
		tickPixelInterval: 72,
		showLastLabel: true,
		labels: {
			align: 'right',
			x: -8,
			y: 3
		},
		lineWidth: 0,
		maxPadding: 0.05,
		minPadding: 0.05,
		startOnTick: true,
		tickWidth: 0,
		title: {
			rotation: 270,
			text: 'Y-values'
		},
		stackLabels: {
			enabled: false,
			//align: dynamic,
			//y: dynamic,
			//x: dynamic,
			//verticalAlign: dynamic,
			//textAlign: dynamic,
			//rotation: 0,
			formatter: function () {
				return this.total;
			},
			style: defaultLabelOptions.style
		}
	},
	
	/**
	 * These options extend the defaultOptions for left axes
	 */
	defaultLeftAxisOptions: {
		labels: {
			align: 'right',
			x: -8,
			y: null
		},
		title: {
			rotation: 270
		}
	},
	
	/**
	 * These options extend the defaultOptions for right axes
	 */
	defaultRightAxisOptions: {
		labels: {
			align: 'left',
			x: 8,
			y: null
		},
		title: {
			rotation: 90
		}
	},
	
	/**
	 * These options extend the defaultOptions for bottom axes
	 */
	defaultBottomAxisOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: 14
			// overflow: undefined // docs - can be 'justify'
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},
	/**
	 * These options extend the defaultOptions for left axes
	 */
	defaultTopAxisOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: -5,
			overflow: 'justify'
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},
	
	/**
	 * Initialize the axis
	 */
	init: function (chart, userOptions) {
			
		
		var isXAxis = userOptions.isX,
			axis = this;
	
		// Flag, is the axis horizontal
		axis.horiz = chart.inverted ? !isXAxis : isXAxis;
		
		// Flag, isXAxis
		axis.isXAxis = isXAxis;
		axis.xOrY = isXAxis ? 'x' : 'y';
	
	
		axis.opposite = userOptions.opposite; // needed in setOptions
		axis.side = axis.horiz ?
				(axis.opposite ? 0 : 2) : // top : bottom
				(axis.opposite ? 1 : 3);  // right : left
	
		axis.setOptions(userOptions);
		
	
		var options = this.options,
			type = options.type,
			isDatetimeAxis = type === 'datetime';
	
		axis.labelFormatter = options.labels.formatter || axis.defaultLabelFormatter; // can be overwritten by dynamic format
	
	
		// Flag, stagger lines or not
		axis.staggerLines = axis.horiz && options.labels.staggerLines;
		axis.userOptions = userOptions;
	
		//axis.axisTitleMargin = UNDEFINED,// = options.title.margin,
		axis.minPixelPadding = 0;
		//axis.ignoreMinPadding = UNDEFINED; // can be set to true by a column or bar series
		//axis.ignoreMaxPadding = UNDEFINED;
	
		axis.chart = chart;
		axis.reversed = options.reversed;
	
		// Initial categories
		axis.categories = options.categories;
	
		// Elements
		//axis.axisGroup = UNDEFINED;
		//axis.gridGroup = UNDEFINED;
		//axis.axisTitle = UNDEFINED;
		//axis.axisLine = UNDEFINED;
	
		// Flag if type === logarithmic
		axis.isLog = type === 'logarithmic';
	
		// Flag, if axis is linked to another axis
		axis.isLinked = defined(options.linkedTo);
		// Linked axis.
		//axis.linkedParent = UNDEFINED;
	
		// Flag if type === datetime
		axis.isDatetimeAxis = isDatetimeAxis;
	
		// Flag if percentage mode
		//axis.usePercentage = UNDEFINED;
	
		
		// Tick positions
		//axis.tickPositions = UNDEFINED; // array containing predefined positions
		// Tick intervals
		//axis.tickInterval = UNDEFINED;
		//axis.minorTickInterval = UNDEFINED;
	
		// Major ticks
		axis.ticks = {};
		// Minor ticks
		axis.minorTicks = {};
		//axis.tickAmount = UNDEFINED;
	
		// List of plotLines/Bands
		axis.plotLinesAndBands = [];
	
		// Alternate bands
		axis.alternateBands = {};
	
		// Axis metrics
		//axis.left = UNDEFINED;
		//axis.top = UNDEFINED;
		//axis.width = UNDEFINED;
		//axis.height = UNDEFINED;
		//axis.bottom = UNDEFINED;
		//axis.right = UNDEFINED;
		//axis.transA = UNDEFINED;
		//axis.transB = UNDEFINED;
		//axis.oldTransA = UNDEFINED;
		axis.len = 0;
		//axis.oldMin = UNDEFINED;
		//axis.oldMax = UNDEFINED;
		//axis.oldUserMin = UNDEFINED;
		//axis.oldUserMax = UNDEFINED;
		//axis.oldAxisLength = UNDEFINED;
		axis.minRange = options.minRange || options.maxZoom;
		axis.range = options.range;
		axis.offset = options.offset || 0;
	
	
		// Dictionary for stacks
		axis.stacks = {};
	
		// Min and max in the data
		//axis.dataMin = UNDEFINED,
		//axis.dataMax = UNDEFINED,
	
		// The axis range
		axis.max = null;
		axis.min = null;
	
		// User set min and max
		//axis.userMin = UNDEFINED,
		//axis.userMax = UNDEFINED,

		// Run Axis
		
		var eventType,
			events = axis.options.events;

		// Register
		chart.axes.push(axis);
		chart[isXAxis ? 'xAxis' : 'yAxis'].push(axis);

		axis.series = []; // populated by Series

		// inverted charts have reversed xAxes as default
		if (chart.inverted && isXAxis && axis.reversed === UNDEFINED) {
			axis.reversed = true;
		}

		axis.removePlotBand = axis.removePlotBandOrLine;
		axis.removePlotLine = axis.removePlotBandOrLine;
		axis.addPlotBand = axis.addPlotBandOrLine;
		axis.addPlotLine = axis.addPlotBandOrLine;


		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}

		// extend logarithmic axis
		if (axis.isLog) {
			axis.val2lin = log2lin;
			axis.lin2val = lin2log;
		}
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		this.options = merge(
			this.defaultOptions,
			this.isXAxis ? {} : this.defaultYAxisOptions,
			[this.defaultTopAxisOptions, this.defaultRightAxisOptions,
				this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side],
			userOptions
		);
	},
	
	
	/** 
	 * The default label formatter. The context is a special config object for the label.
	 */
	defaultLabelFormatter: function () {
		var axis = this.axis,
			value = this.value,
			categories = axis.categories,
			tickInterval = axis.tickInterval,
			dateTimeLabelFormat = this.dateTimeLabelFormat,
			ret;

		if (categories) {
			ret = value;
		
		} else if (dateTimeLabelFormat) { // datetime axis
			ret = dateFormat(dateTimeLabelFormat, value);

		} else if (tickInterval % 1000000 === 0) { // use M abbreviation
			ret = (value / 1000000) + 'M';

		} else if (tickInterval % 1000 === 0) { // use k abbreviation
			ret = (value / 1000) + 'k';

		} else if (value >= 1000) { // add thousands separators
			ret = numberFormat(value, 0);

		} else { // small numbers
			ret = numberFormat(value, -1);
		}
		return ret;
	},
	
	/**
	 * Get the minimum and maximum for the series of each axis
	 */
	getSeriesExtremes: function () {
		var axis = this,
			chart = axis.chart,
			stacks = axis.stacks,
			posStack = [],
			negStack = [],
			i;

		// reset dataMin and dataMax in case we're redrawing
		axis.dataMin = axis.dataMax = null;

		// loop through this axis' series
		each(axis.series, function (series) {

			if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

				var seriesOptions = series.options,
					stacking,
					posPointStack,
					negPointStack,
					stackKey,
					stackOption,
					negKey,
					xData,
					yData,
					x,
					y,
					threshold = seriesOptions.threshold,
					yDataLength,
					activeYData = [],
					activeCounter = 0;
					
				// Validate threshold in logarithmic axes
				if (axis.isLog && threshold <= 0) {
					threshold = seriesOptions.threshold = null;
				}

				// Get dataMin and dataMax for X axes
				if (axis.isXAxis) {
					xData = series.xData;
					if (xData.length) {
						axis.dataMin = mathMin(pick(axis.dataMin, xData[0]), arrayMin(xData));
						axis.dataMax = mathMax(pick(axis.dataMax, xData[0]), arrayMax(xData));
					}

				// Get dataMin and dataMax for Y axes, as well as handle stacking and processed data
				} else {
					var isNegative,
						pointStack,
						key,
						cropped = series.cropped,
						xExtremes = series.xAxis.getExtremes(),
						//findPointRange,
						//pointRange,
						j,
						hasModifyValue = !!series.modifyValue;


					// Handle stacking
					stacking = seriesOptions.stacking;
					axis.usePercentage = stacking === 'percent';

					// create a stack for this particular series type
					if (stacking) {
						stackOption = seriesOptions.stack;
						stackKey = series.type + pick(stackOption, '');
						negKey = '-' + stackKey;
						series.stackKey = stackKey; // used in translate

						posPointStack = posStack[stackKey] || []; // contains the total values for each x
						posStack[stackKey] = posPointStack;

						negPointStack = negStack[negKey] || [];
						negStack[negKey] = negPointStack;
					}
					if (axis.usePercentage) {
						axis.dataMin = 0;
						axis.dataMax = 99;
					}

					// processData can alter series.pointRange, so this goes after
					//findPointRange = series.pointRange === null;

					xData = series.processedXData;
					yData = series.processedYData;
					yDataLength = yData.length;

					// loop over the non-null y values and read them into a local array
					for (i = 0; i < yDataLength; i++) {
						x = xData[i];
						y = yData[i];
						if (y !== null && y !== UNDEFINED) {

							// read stacked values into a stack based on the x value,
							// the sign of y and the stack key
							if (stacking) {
								isNegative = y < threshold;
								pointStack = isNegative ? negPointStack : posPointStack;
								key = isNegative ? negKey : stackKey;

								y = pointStack[x] =
									defined(pointStack[x]) ?
									pointStack[x] + y : y;


								// add the series
								if (!stacks[key]) {
									stacks[key] = {};
								}

								// If the StackItem is there, just update the values,
								// if not, create one first
								if (!stacks[key][x]) {
									stacks[key][x] = new StackItem(axis, axis.options.stackLabels, isNegative, x, stackOption);
								}
								stacks[key][x].setTotal(y);


							// general hook, used for Highstock compare values feature
							} else if (hasModifyValue) {
								y = series.modifyValue(y);
							}

							// get the smallest distance between points
							/*if (i) {
								distance = mathAbs(xData[i] - xData[i - 1]);
								pointRange = pointRange === UNDEFINED ? distance : mathMin(distance, pointRange);
							}*/

							// for points within the visible range, including the first point outside the
							// visible range, consider y extremes
							if (cropped || ((xData[i + 1] || x) >= xExtremes.min && (xData[i - 1] || x) <= xExtremes.max)) {

								j = y.length;
								if (j) { // array, like ohlc or range data
									while (j--) {
										if (y[j] !== null) {
											activeYData[activeCounter++] = y[j];
										}
									}
								} else {
									activeYData[activeCounter++] = y;
								}
							}
						}
					}

					// record the least unit distance
					/*if (findPointRange) {
						series.pointRange = pointRange || 1;
					}
					series.closestPointRange = pointRange;*/

					// Get the dataMin and dataMax so far. If percentage is used, the min and max are
					// always 0 and 100. If the length of activeYData is 0, continue with null values.
					if (!axis.usePercentage && activeYData.length) {
						axis.dataMin = mathMin(pick(axis.dataMin, activeYData[0]), arrayMin(activeYData));
						axis.dataMax = mathMax(pick(axis.dataMax, activeYData[0]), arrayMax(activeYData));
					}

					// Adjust to threshold
					if (defined(threshold)) {
						if (axis.dataMin >= threshold) {
							axis.dataMin = threshold;
							axis.ignoreMinPadding = true;
						} else if (axis.dataMax < threshold) {
							axis.dataMax = threshold;
							axis.ignoreMaxPadding = true;
						}
					}
				}
			}
		});
	},

	/**
	 * Translate from axis value to pixel position on the chart, or back
	 *
	 */
	translate: function (val, backwards, cvsCoord, old, handleLog) {
		var axis = this,
			axisLength = axis.len,
			sign = 1,
			cvsOffset = 0,
			localA = old ? axis.oldTransA : axis.transA,
			localMin = old ? axis.oldMin : axis.min,
			returnValue,
			postTranslate = axis.options.ordinal || (axis.isLog && handleLog);

		if (!localA) {
			localA = axis.transA;
		}

		if (cvsCoord) {
			sign *= -1; // canvas coordinates inverts the value
			cvsOffset = axisLength;
		}
		if (axis.reversed) { // reversed axis
			sign *= -1;
			cvsOffset -= sign * axisLength;
		}

		if (backwards) { // reverse translation
			if (axis.reversed) {
				val = axisLength - val;
			}
			returnValue = val / localA + localMin; // from chart pixel to value
			if (postTranslate) { // log and ordinal axes
				returnValue = axis.lin2val(returnValue);
			}

		} else { // normal translation, from axis value to pixel, relative to plot
			if (postTranslate) { // log and ordinal axes
				val = axis.val2lin(val);
			}

			returnValue = sign * (val - localMin) * localA + cvsOffset + (sign * axis.minPixelPadding);
		}

		return returnValue;
	},

	/**
	 * Create the path for a plot line that goes from the given value on
	 * this axis, across the plot to the opposite side
	 * @param {Number} value
	 * @param {Number} lineWidth Used for calculation crisp line
	 * @param {Number] old Use old coordinates (for resizing and rescaling)
	 */
	getPlotLinePath: function (value, lineWidth, old) {
		var axis = this,
			chart = axis.chart,
			axisLeft = axis.left,
			axisTop = axis.top,
			x1,
			y1,
			x2,
			y2,
			translatedValue = axis.translate(value, null, null, old),
			cHeight = (old && chart.oldChartHeight) || chart.chartHeight,
			cWidth = (old && chart.oldChartWidth) || chart.chartWidth,
			skip,
			transB = axis.transB;

		x1 = x2 = mathRound(translatedValue + transB);
		y1 = y2 = mathRound(cHeight - translatedValue - transB);

		if (isNaN(translatedValue)) { // no min or max
			skip = true;

		} else if (axis.horiz) {
			y1 = axisTop;
			y2 = cHeight - axis.bottom;
			if (x1 < axisLeft || x1 > axisLeft + axis.width) {
				skip = true;
			}
		} else {
			x1 = axisLeft;
			x2 = cWidth - axis.right;

			if (y1 < axisTop || y1 > axisTop + axis.height) {
				skip = true;
			}
		}
		return skip ?
			null :
			chart.renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
	},
	
	/**
	 * Create the path for a plot band
	 */
	getPlotBandPath: function (from, to) {

		var toPath = this.getPlotLinePath(to),
			path = this.getPlotLinePath(from);
			
		if (path && toPath) {
			path.push(
				toPath[4],
				toPath[5],
				toPath[1],
				toPath[2]
			);
		} else { // outside the axis area
			path = null;
		}
		
		return path;
	},
	
	/**
	 * Set the tick positions of a linear axis to round values like whole tens or every five.
	 */
	getLinearTickPositions: function (tickInterval, min, max) {
		var pos,
			lastPos,
			roundedMin = correctFloat(mathFloor(min / tickInterval) * tickInterval),
			roundedMax = correctFloat(mathCeil(max / tickInterval) * tickInterval),
			tickPositions = [];

		// Populate the intermediate values
		pos = roundedMin;
		while (pos <= roundedMax) {

			// Place the tick on the rounded value
			tickPositions.push(pos);

			// Always add the raw tickInterval, not the corrected one.
			pos = correctFloat(pos + tickInterval);

			// If the interval is not big enough in the current min - max range to actually increase
			// the loop variable, we need to break out to prevent endless loop. Issue #619
			if (pos === lastPos) {
				break;
			}

			// Record the last value
			lastPos = pos;
		}
		return tickPositions;
	},
	
	/**
	 * Set the tick positions of a logarithmic axis
	 */
	getLogTickPositions: function (interval, min, max, minor) {
		var axis = this,
			options = axis.options,
			axisLength = axis.len;

		// Since we use this method for both major and minor ticks,
		// use a local variable and return the result
		var positions = []; 
		
		// Reset
		if (!minor) {
			axis._minorAutoInterval = null;
		}
		
		// First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
		if (interval >= 0.5) {
			interval = mathRound(interval);
			positions = axis.getLinearTickPositions(interval, min, max);
			
		// Second case: We need intermediary ticks. For example 
		// 1, 2, 4, 6, 8, 10, 20, 40 etc. 
		} else if (interval >= 0.08) {
			var roundedMin = mathFloor(min),
				intermediate,
				i,
				j,
				len,
				pos,
				lastPos,
				break2;
				
			if (interval > 0.3) {
				intermediate = [1, 2, 4];
			} else if (interval > 0.15) { // 0.2 equals five minor ticks per 1, 10, 100 etc
				intermediate = [1, 2, 4, 6, 8];
			} else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
				intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
			
			for (i = roundedMin; i < max + 1 && !break2; i++) {
				len = intermediate.length;
				for (j = 0; j < len && !break2; j++) {
					pos = log2lin(lin2log(i) * intermediate[j]);
					
					if (pos > min) {
						positions.push(lastPos);
					}
					
					if (lastPos > max) {
						break2 = true;
					}
					lastPos = pos;
				}
			}
			
		// Third case: We are so deep in between whole logarithmic values that
		// we might as well handle the tick positions like a linear axis. For
		// example 1.01, 1.02, 1.03, 1.04.
		} else {
			var realMin = lin2log(min),
				realMax = lin2log(max),
				tickIntervalOption = options[minor ? 'minorTickInterval' : 'tickInterval'],
				filteredTickIntervalOption = tickIntervalOption === 'auto' ? null : tickIntervalOption,
				tickPixelIntervalOption = options.tickPixelInterval / (minor ? 5 : 1),
				totalPixelLength = minor ? axisLength / axis.tickPositions.length : axisLength;
			
			interval = pick(
				filteredTickIntervalOption,
				axis._minorAutoInterval,
				(realMax - realMin) * tickPixelIntervalOption / (totalPixelLength || 1)
			);
			
			interval = normalizeTickInterval(
				interval, 
				null, 
				math.pow(10, mathFloor(math.log(interval) / math.LN10))
			);
			
			positions = map(axis.getLinearTickPositions(
				interval, 
				realMin,
				realMax	
			), log2lin);
			
			if (!minor) {
				axis._minorAutoInterval = interval / 5;
			}
		}
		
		// Set the axis-level tickInterval variable 
		if (!minor) {
			axis.tickInterval = interval;
		}
		return positions;
	},

	/**
	 * Return the minor tick positions. For logarithmic axes, reuse the same logic
	 * as for major ticks.
	 */
	getMinorTickPositions: function () {
		var axis = this,
			tickPositions = axis.tickPositions,
			minorTickInterval = axis.minorTickInterval;

		var minorTickPositions = [],
			pos,
			i,
			len;
		
		if (axis.isLog) {
			len = tickPositions.length;
			for (i = 1; i < len; i++) {
				minorTickPositions = minorTickPositions.concat(
					axis.getLogTickPositions(minorTickInterval, tickPositions[i - 1], tickPositions[i], true)
				);	
			}
		
		} else {			
			for (pos = axis.min + (tickPositions[0] - axis.min) % minorTickInterval; pos <= axis.max; pos += minorTickInterval) {
				minorTickPositions.push(pos);	
			}
		}
		
		return minorTickPositions;
	},

	/**
	 * Adjust the min and max for the minimum range. Keep in mind that the series data is 
	 * not yet processed, so we don't have information on data cropping and grouping, or 
	 * updated axis.pointRange or series.pointRange. The data can't be processed until
	 * we have finally established min and max.
	 */
	adjustForMinRange: function () {
		var axis = this,
			options = axis.options,
			min = axis.min,
			max = axis.max,
			zoomOffset,
			spaceAvailable = axis.dataMax - axis.dataMin >= axis.minRange,
			closestDataRange,
			i,
			distance,
			xData,
			loopLength,
			minArgs,
			maxArgs;

		// Set the automatic minimum range based on the closest point distance
		if (axis.isXAxis && axis.minRange === UNDEFINED && !axis.isLog) {

			if (defined(options.min) || defined(options.max)) {
				axis.minRange = null; // don't do this again

			} else {

				// Find the closest distance between raw data points, as opposed to
				// closestPointRange that applies to processed points (cropped and grouped)
				each(axis.series, function (series) {
					xData = series.xData;
					loopLength = series.xIncrement ? 1 : xData.length - 1;
					for (i = loopLength; i > 0; i--) {
						distance = xData[i] - xData[i - 1];
						if (closestDataRange === UNDEFINED || distance < closestDataRange) {
							closestDataRange = distance;
						}
					}
				});
				axis.minRange = mathMin(closestDataRange * 5, axis.dataMax - axis.dataMin);
			}
		}

		// if minRange is exceeded, adjust
		if (max - min < axis.minRange) {
			var minRange = axis.minRange;
			zoomOffset = (minRange - max + min) / 2;

			// if min and max options have been set, don't go beyond it
			minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
			if (spaceAvailable) { // if space is available, stay within the data range
				minArgs[2] = axis.dataMin;
			}
			axis.min = min = arrayMax(minArgs);

			maxArgs = [min + minRange, pick(options.max, min + minRange)];
			if (spaceAvailable) { // if space is availabe, stay within the data range
				maxArgs[2] = axis.dataMax;
			}

			axis.max = max = arrayMin(maxArgs);

			// now if the max is adjusted, adjust the min back
			if (max - min < minRange) {
				minArgs[0] = max - minRange;
				minArgs[1] = pick(options.min, max - minRange);
				axis.min = arrayMax(minArgs);
			}
		}
	},

	/**
	 * Update translation information
	 */
	setAxisTranslation: function () {
		var axis = this,
			range = axis.max - axis.min,
			pointRange = 0,
			closestPointRange,
			seriesClosestPointRange,
			transA = axis.transA;

		// adjust translation for padding
		if (axis.isXAxis) {
			if (axis.isLinked) {
				pointRange = axis.linkedParent.pointRange;
			} else {
				each(axis.series, function (series) {
					pointRange = mathMax(pointRange, series.pointRange);
					seriesClosestPointRange = series.closestPointRange;
					if (!series.noSharedTooltip && defined(seriesClosestPointRange)) {
						closestPointRange = defined(closestPointRange) ?
							mathMin(closestPointRange, seriesClosestPointRange) :
							seriesClosestPointRange;
					}
				});
			}

			// pointRange means the width reserved for each point, like in a column chart
			axis.pointRange = pointRange;

			// closestPointRange means the closest distance between points. In columns
			// it is mostly equal to pointRange, but in lines pointRange is 0 while closestPointRange
			// is some other value
			axis.closestPointRange = closestPointRange;
		}

		// secondary values
		axis.oldTransA = transA;
		axis.translationSlope = axis.transA = transA = axis.len / ((range + pointRange) || 1);
		axis.transB = axis.horiz ? axis.left : axis.bottom; // translation addend
		axis.minPixelPadding = transA * (pointRange / 2);
	},

	/**
	 * Set the tick positions to round values and optionally extend the extremes
	 * to the nearest tick
	 */
	setTickPositions: function (secondPass) {
		var axis = this,
			chart = axis.chart,
			options = axis.options,
			isLog = axis.isLog,
			isDatetimeAxis = axis.isDatetimeAxis,
			isXAxis = axis.isXAxis,
			isLinked = axis.isLinked,
			tickPositioner = axis.options.tickPositioner,
			magnitude,
			maxPadding = options.maxPadding,
			minPadding = options.minPadding,
			length,
			linkedParentExtremes,
			tickIntervalOption = options.tickInterval,
			tickPixelIntervalOption = options.tickPixelInterval,
			tickPositions,
			categories = axis.categories,
			min,
			max;

		// linked axis gets the extremes from the parent axis
		if (isLinked) {
			axis.linkedParent = chart[isXAxis ? 'xAxis' : 'yAxis'][options.linkedTo];
			linkedParentExtremes = axis.linkedParent.getExtremes();
			axis.min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
			axis.max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
			if (options.type !== axis.linkedParent.options.type) {
				error(11, 1); // Can't link axes of different type
			}
		} else { // initial min and max from the extreme data values
			axis.min = pick(axis.userMin, options.min, axis.dataMin);
			axis.max = pick(axis.userMax, options.max, axis.dataMax);
		}

		min = axis.min;
		max = axis.max;

		if (isLog) {
			if (!secondPass && mathMin(min, axis.dataMin) <= 0) {
				error(10, 1); // Can't plot negative values on log axis
			}
			axis.min = min = correctFloat(log2lin(min)); // correctFloat cures #934
			axis.max = max = correctFloat(log2lin(max));
		}

		// handle zoomed range
		if (axis.range) {
			axis.userMin = axis.min = min = mathMax(min, max - axis.range); // #618
			axis.userMax = max;
			if (secondPass) {
				axis.range = null;  // don't use it when running setExtremes
			}
		}

		// adjust min and max for the minimum range
		axis.adjustForMinRange();

		// pad the values to get clear of the chart's edges
		if (!categories && !axis.usePercentage && !isLinked && defined(min) && defined(max)) {
			length = (max - min) || 1;
			if (!defined(options.min) && !defined(axis.userMin) && minPadding && (axis.dataMin < 0 || !axis.ignoreMinPadding)) {
				min = axis.min -= length * minPadding;
			}
			if (!defined(options.max) && !defined(axis.userMax)  && maxPadding && (axis.dataMax > 0 || !axis.ignoreMaxPadding)) {
				max = axis.max += length * maxPadding;
			}
		}

		// get tickInterval
		if (min === max || min === undefined || max === undefined) {
			axis.tickInterval = 1;
		} else if (isLinked && !tickIntervalOption &&
				tickPixelIntervalOption === axis.linkedParent.options.tickPixelInterval) {
			axis.tickInterval = axis.linkedParent.tickInterval;
		} else {
			axis.tickInterval = pick(
				tickIntervalOption,
				categories ? // for categoried axis, 1 is default, for linear axis use tickPix
					1 :
					(max - min) * tickPixelIntervalOption / (axis.len || 1)
			);
		}

		// Now we're finished detecting min and max, crop and group series data. This
		// is in turn needed in order to find tick positions in ordinal axes. 
		if (isXAxis && !secondPass) {
			each(axis.series, function (series) {
				series.processData(min !== axis.oldMin || max !== axis.oldMax);
			});
		}

		// set the translation factor used in translate function
		axis.setAxisTranslation();

		// hook for ordinal axes. To do: merge with below
		if (axis.beforeSetTickPositions) {
			axis.beforeSetTickPositions();
		}
		
		// hook for extensions, used in Highstock ordinal axes
		if (axis.postProcessTickInterval) {
			axis.tickInterval = axis.postProcessTickInterval(axis.tickInterval);
		}

		// for linear axes, get magnitude and normalize the interval
		if (!isDatetimeAxis && !isLog) { // linear
			magnitude = math.pow(10, mathFloor(math.log(axis.tickInterval) / math.LN10));
			if (!defined(options.tickInterval)) {
				axis.tickInterval = normalizeTickInterval(axis.tickInterval, null, magnitude, options);
			}
		}

		// get minorTickInterval
		axis.minorTickInterval = options.minorTickInterval === 'auto' && axis.tickInterval ?
				axis.tickInterval / 5 : options.minorTickInterval;

		// find the tick positions
		axis.tickPositions = tickPositions = options.tickPositions || (tickPositioner && tickPositioner.apply(axis, [min, max]));
		if (!tickPositions) {
			if (isDatetimeAxis) {
				tickPositions = (axis.getNonLinearTimeTicks || getTimeTicks)(
					normalizeTimeTickInterval(axis.tickInterval, options.units),
					min,
					max,
					options.startOfWeek,
					axis.ordinalPositions,
					axis.closestPointRange,
					true
				);
			} else if (isLog) {
				tickPositions = axis.getLogTickPositions(axis.tickInterval, min, max);
			} else {
				tickPositions = axis.getLinearTickPositions(axis.tickInterval, min, max);
			}
			axis.tickPositions = tickPositions;
		}

		if (!isLinked) {

			// reset min/max or remove extremes based on start/end on tick
			var roundedMin = tickPositions[0],
				roundedMax = tickPositions[tickPositions.length - 1];

			if (options.startOnTick) {
				axis.min = roundedMin;
			} else if (axis.min > roundedMin) {
				tickPositions.shift();
			}

			if (options.endOnTick) {
				axis.max = max = roundedMax;
			} else if (max < roundedMax) {
				tickPositions.pop();
			}
			
		}
	},
	
	/**
	 * Set the max ticks of either the x and y axis collection
	 */
	setMaxTicks: function () {
		
		var chart = this.chart,
			maxTicks = chart.maxTicks,
			tickPositions = this.tickPositions,
			xOrY = this.xOrY;
		
		if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
			maxTicks = {
				x: 0,
				y: 0
			};
		}

		if (!this.isLinked && !this.isDatetimeAxis && tickPositions.length > maxTicks[xOrY] && this.options.alignTicks !== false) {
			maxTicks[xOrY] = tickPositions.length;
		}
		chart.maxTicks = maxTicks;
	},

	/**
	 * When using multiple axes, adjust the number of ticks to match the highest
	 * number of ticks in that group
	 */
	adjustTickAmount: function () {
		var axis = this,
			chart = axis.chart,
			xOrY = axis.xOrY,
			tickPositions = axis.tickPositions,
			maxTicks = chart.maxTicks;

		if (maxTicks && maxTicks[xOrY] && !axis.isDatetimeAxis && !axis.categories && !axis.isLinked && axis.options.alignTicks !== false) { // only apply to linear scale
			var oldTickAmount = axis.tickAmount,
				calculatedTickAmount = tickPositions.length,
				tickAmount;

			// set the axis-level tickAmount to use below
			axis.tickAmount = tickAmount = maxTicks[xOrY];

			if (calculatedTickAmount < tickAmount) {
				while (tickPositions.length < tickAmount) {
					tickPositions.push(correctFloat(
						tickPositions[tickPositions.length - 1] + axis.tickInterval
					));
				}
				axis.transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
				axis.max = tickPositions[tickPositions.length - 1];

			}
			if (defined(oldTickAmount) && tickAmount !== oldTickAmount) {
				axis.isDirty = true;
			}
		}
	},

	/**
	 * Set the scale based on data min and max, user set min and max or options
	 *
	 */
	setScale: function () {
		var axis = this,
			stacks = axis.stacks,
			type,
			i,
			isDirtyData,
			isDirtyAxisLength;

		axis.oldMin = axis.min;
		axis.oldMax = axis.max;
		axis.oldAxisLength = axis.len;

		// set the new axisLength
		axis.setAxisSize();
		//axisLength = horiz ? axisWidth : axisHeight;
		isDirtyAxisLength = axis.len !== axis.oldAxisLength;

		// is there new data?
		each(axis.series, function (series) {
			if (series.isDirtyData || series.isDirty ||
					series.xAxis.isDirty) { // when x axis is dirty, we need new data extremes for y as well
				isDirtyData = true;
			}
		});
		
		// do we really need to go through all this?
		if (isDirtyAxisLength || isDirtyData || axis.isLinked ||
			axis.userMin !== axis.oldUserMin || axis.userMax !== axis.oldUserMax) {

			// get data extremes if needed
			axis.getSeriesExtremes();

			// get fixed positions based on tickInterval
			axis.setTickPositions();

			// record old values to decide whether a rescale is necessary later on (#540)
			axis.oldUserMin = axis.userMin;
			axis.oldUserMax = axis.userMax;

			// Mark as dirty if it is not already set to dirty and extremes have changed. #595.
			if (!axis.isDirty) {
				axis.isDirty = isDirtyAxisLength || axis.min !== axis.oldMin || axis.max !== axis.oldMax;
			}
		}
		
		
		// reset stacks
		if (!axis.isXAxis) {
			for (type in stacks) {
				for (i in stacks[type]) {
					stacks[type][i].cum = stacks[type][i].total;
				}
			}
		}
		
		// Set the maximum tick amount
		axis.setMaxTicks();
	},

	/**
	 * Set the extremes and optionally redraw
	 * @param {Number} newMin
	 * @param {Number} newMax
	 * @param {Boolean} redraw
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 * @param {Object} eventArguments 
	 *
	 */
	setExtremes: function (newMin, newMax, redraw, animation, eventArguments) {
		var axis = this,
			chart = axis.chart;

		redraw = pick(redraw, true); // defaults to true

		// Extend the arguments with min and max
		eventArguments = extend(eventArguments, {
			min: newMin,
			max: newMax
		});

		// Fire the event
		fireEvent(axis, 'setExtremes', eventArguments, function () { // the default event handler

			axis.userMin = newMin;
			axis.userMax = newMax;

			// Mark for running afterSetExtremes
			axis.isDirtyExtremes = true;

			// redraw
			if (redraw) {
				chart.redraw(animation);
			}
		});
	},
	
	/**
	 * Update the axis metrics
	 */
	setAxisSize: function () {
		var axis = this,
			chart = axis.chart,
			options = axis.options;

		var offsetLeft = options.offsetLeft || 0,
			offsetRight = options.offsetRight || 0;

		// basic values
		// expose to use in Series object and navigator
		axis.left = pick(options.left, chart.plotLeft + offsetLeft);
		axis.top = pick(options.top, chart.plotTop);
		axis.width = pick(options.width, chart.plotWidth - offsetLeft + offsetRight);
		axis.height = pick(options.height, chart.plotHeight);
		axis.bottom = chart.chartHeight - axis.height - axis.top;
		axis.right = chart.chartWidth - axis.width - axis.left;
		axis.len = mathMax(axis.horiz ? axis.width : axis.height, 0); // mathMax fixes #905
	},

	/**
	 * Get the actual axis extremes
	 */
	getExtremes: function () {
		var axis = this,
			isLog = axis.isLog;

		return {
			min: isLog ? correctFloat(lin2log(axis.min)) : axis.min,
			max: isLog ? correctFloat(lin2log(axis.max)) : axis.max,
			dataMin: axis.dataMin,
			dataMax: axis.dataMax,
			userMin: axis.userMin,
			userMax: axis.userMax
		};
	},

	/**
	 * Get the zero plane either based on zero or on the min or max value.
	 * Used in bar and area plots
	 */
	getThreshold: function (threshold) {
		var axis = this,
			isLog = axis.isLog;

		var realMin = isLog ? lin2log(axis.min) : axis.min,
			realMax = isLog ? lin2log(axis.max) : axis.max;
		
		if (realMin > threshold || threshold === null) {
			threshold = realMin;
		} else if (realMax < threshold) {
			threshold = realMax;
		}

		return axis.translate(threshold, 0, 1, 0, 1);
	},

	/**
	 * Add a plot band or plot line after render time
	 *
	 * @param options {Object} The plotBand or plotLine configuration object
	 */
	addPlotBandOrLine: function (options) {
		var obj = new PlotLineOrBand(this, options).render();
		this.plotLinesAndBands.push(obj);
		return obj;
	},

	/**
	 * Render the tick labels to a preliminary position to get their sizes
	 */
	getOffset: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			tickPositions = axis.tickPositions,
			ticks = axis.ticks,
			horiz = axis.horiz,
			side = axis.side,
			hasData,
			showAxis,
			titleOffset = 0,
			titleOffsetOption,
			titleMargin = 0,
			axisTitleOptions = options.title,
			labelOptions = options.labels,
			labelOffset = 0, // reset
			axisOffset = chart.axisOffset,
			directionFactor = [-1, 1, 1, -1][side],
			n;
			
			
		// For reuse in Axis.render
		axis.hasData = hasData = (axis.series.length || (defined(axis.min) && defined(axis.max))) && tickPositions;
		axis.showAxis = showAxis = hasData || pick(options.showEmpty, true);

		// Create the axisGroup and gridGroup elements on first iteration
		if (!axis.axisGroup) {
			axis.axisGroup = renderer.g('axis')
				.attr({ zIndex: options.zIndex || 7 })
				.add();
			axis.gridGroup = renderer.g('grid')
				.attr({ zIndex: options.gridZIndex || 1 })
				.add();
		}

		if (hasData || axis.isLinked) {
			each(tickPositions, function (pos) {
				if (!ticks[pos]) {
					ticks[pos] = new Tick(axis, pos);
				} else {
					ticks[pos].addLabel(); // update labels depending on tick interval
				}

			});

			each(tickPositions, function (pos) {
				// left side must be align: right and right side must have align: left for labels
				if (side === 0 || side === 2 || { 1: 'left', 3: 'right' }[side] === labelOptions.align) {

					// get the highest offset
					labelOffset = mathMax(
						ticks[pos].getLabelSize(),
						labelOffset
					);
				}

			});

			if (axis.staggerLines) {
				labelOffset += (axis.staggerLines - 1) * 16;
			}

		} else { // doesn't have data
			for (n in ticks) {
				ticks[n].destroy();
				delete ticks[n];
			}
		}

		if (axisTitleOptions && axisTitleOptions.text) {
			if (!axis.axisTitle) {
				axis.axisTitle = renderer.text(
					axisTitleOptions.text,
					0,
					0,
					axisTitleOptions.useHTML
				)
				.attr({
					zIndex: 7,
					rotation: axisTitleOptions.rotation || 0,
					align:
						axisTitleOptions.textAlign ||
						{ low: 'left', middle: 'center', high: 'right' }[axisTitleOptions.align]
				})
				.css(axisTitleOptions.style)
				.add(axis.axisGroup);
				axis.axisTitle.isNew = true;
			}

			if (showAxis) {
				titleOffset = axis.axisTitle.getBBox()[horiz ? 'height' : 'width'];
				titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
				titleOffsetOption = axisTitleOptions.offset;
			}

			// hide or show the title depending on whether showEmpty is set
			axis.axisTitle[showAxis ? 'show' : 'hide']();
		}
		
		// handle automatic or user set offset
		axis.offset = directionFactor * pick(options.offset, axisOffset[side]);
		
		
		axis.axisTitleMargin =
			pick(titleOffsetOption,
				labelOffset + titleMargin +
				(side !== 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x'])
			);

		axisOffset[side] = mathMax(
			axisOffset[side],
			axis.axisTitleMargin + titleOffset + directionFactor * axis.offset
		);

	},
	
	/**
	 * Get the path for the axis line
	 */
	getLinePath: function (lineWidth) {
		var chart = this.chart,
			opposite = this.opposite,
			offset = this.offset,
			horiz = this.horiz,
			lineLeft = this.left + (opposite ? this.width : 0) + offset,
			lineTop = chart.chartHeight - this.bottom - (opposite ? this.height : 0) + offset;

		return chart.renderer.crispLine([
				M,
				horiz ?
					this.left :
					lineLeft,
				horiz ?
					lineTop :
					this.top,
				L,
				horiz ?
					chart.chartWidth - this.right :
					lineLeft,
				horiz ?
					lineTop :
					chart.chartHeight - this.bottom
			], lineWidth);
	},
	
	/**
	 * Position the title
	 */
	getTitlePosition: function () {
		// compute anchor points for each of the title align options
		var horiz = this.horiz,
			axisLeft = this.left,
			axisTop = this.top,
			axisLength = this.len,
			axisTitleOptions = this.options.title,			
			margin = horiz ? axisLeft : axisTop,
			opposite = this.opposite,
			offset = this.offset,
			fontSize = pInt(axisTitleOptions.style.fontSize || 12),
			
			// the position in the length direction of the axis
			alongAxis = {
				low: margin + (horiz ? 0 : axisLength),
				middle: margin + axisLength / 2,
				high: margin + (horiz ? axisLength : 0)
			}[axisTitleOptions.align],
	
			// the position in the perpendicular direction of the axis
			offAxis = (horiz ? axisTop + this.height : axisLeft) +
				(horiz ? 1 : -1) * // horizontal axis reverses the margin
				(opposite ? -1 : 1) * // so does opposite axes
				this.axisTitleMargin +
				(this.side === 2 ? fontSize : 0);

		return {
			x: horiz ?
				alongAxis :
				offAxis + (opposite ? this.width : 0) + offset +
					(axisTitleOptions.x || 0), // x
			y: horiz ?
				offAxis - (opposite ? this.height : 0) + offset :
				alongAxis + (axisTitleOptions.y || 0) // y
		};
	},
	
	/**
	 * Render the axis
	 */
	render: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			isLog = axis.isLog,
			isLinked = axis.isLinked,
			tickPositions = axis.tickPositions,
			axisTitle = axis.axisTitle,
			stacks = axis.stacks,
			ticks = axis.ticks,
			minorTicks = axis.minorTicks,
			alternateBands = axis.alternateBands,
			stackLabelOptions = options.stackLabels,
			alternateGridColor = options.alternateGridColor,
			lineWidth = options.lineWidth,
			linePath,
			hasRendered = chart.hasRendered,
			slideInTicks = hasRendered && defined(axis.oldMin) && !isNaN(axis.oldMin),
			hasData = axis.hasData,
			showAxis = axis.showAxis,
			from,
			to;

		// If the series has data draw the ticks. Else only the line and title
		if (hasData || isLinked) {

			// minor ticks
			if (axis.minorTickInterval && !axis.categories) {
				each(axis.getMinorTickPositions(), function (pos) {
					if (!minorTicks[pos]) {
						minorTicks[pos] = new Tick(axis, pos, 'minor');
					}

					// render new ticks in old position
					if (slideInTicks && minorTicks[pos].isNew) {
						minorTicks[pos].render(null, true);
					}


					minorTicks[pos].isActive = true;
					minorTicks[pos].render();
				});
			}

			// Major ticks. Pull out the first item and render it last so that
			// we can get the position of the neighbour label. #808.
			each(tickPositions.slice(1).concat([tickPositions[0]]), function (pos, i) {

				// Reorganize the indices
				i = (i === tickPositions.length - 1) ? 0 : i + 1;

				// linked axes need an extra check to find out if
				if (!isLinked || (pos >= axis.min && pos <= axis.max)) {

					if (!ticks[pos]) {
						ticks[pos] = new Tick(axis, pos);
					}

					// render new ticks in old position
					if (slideInTicks && ticks[pos].isNew) {
						ticks[pos].render(i, true);
					}

					ticks[pos].isActive = true;
					ticks[pos].render(i);
				}

			});

			// alternate grid color
			if (alternateGridColor) {
				each(tickPositions, function (pos, i) {
					if (i % 2 === 0 && pos < axis.max) {
						if (!alternateBands[pos]) {
							alternateBands[pos] = new PlotLineOrBand(axis);
						}
						from = pos;
						to = tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : axis.max;
						alternateBands[pos].options = {
							from: isLog ? lin2log(from) : from,
							to: isLog ? lin2log(to) : to,
							color: alternateGridColor
						};
						alternateBands[pos].render();
						alternateBands[pos].isActive = true;
					}
				});
			}

			// custom plot lines and bands
			if (!axis._addedPlotLB) { // only first time
				each((options.plotLines || []).concat(options.plotBands || []), function (plotLineOptions) {
					//plotLinesAndBands.push(new PlotLineOrBand(plotLineOptions).render());
					axis.addPlotBandOrLine(plotLineOptions);
				});
				axis._addedPlotLB = true;
			}

		} // end if hasData

		// remove inactive ticks
		each([ticks, minorTicks, alternateBands], function (coll) {
			var pos;
			for (pos in coll) {
				if (!coll[pos].isActive) {
					coll[pos].destroy();
					delete coll[pos];
				} else {
					coll[pos].isActive = false; // reset
				}
			}
		});

		// Static items. As the axis group is cleared on subsequent calls
		// to render, these items are added outside the group.
		// axis line
		if (lineWidth) {
			linePath = axis.getLinePath(lineWidth);
			if (!axis.axisLine) {
				axis.axisLine = renderer.path(linePath)
					.attr({
						stroke: options.lineColor,
						'stroke-width': lineWidth,
						zIndex: 7
					})
					.add();
			} else {
				axis.axisLine.animate({ d: linePath });
			}

			// show or hide the line depending on options.showEmpty
			axis.axisLine[showAxis ? 'show' : 'hide']();

		}

		if (axisTitle && showAxis) {
			
			axisTitle[axisTitle.isNew ? 'attr' : 'animate'](
				axis.getTitlePosition()
			);
			axisTitle.isNew = false;
		}

		// Stacked totals:
		if (stackLabelOptions && stackLabelOptions.enabled) {
			var stackKey, oneStack, stackCategory,
				stackTotalGroup = axis.stackTotalGroup;

			// Create a separate group for the stack total labels
			if (!stackTotalGroup) {
				axis.stackTotalGroup = stackTotalGroup =
					renderer.g('stack-labels')
						.attr({
							visibility: VISIBLE,
							zIndex: 6
						})
						.add();
			}

			// plotLeft/Top will change when y axis gets wider so we need to translate the
			// stackTotalGroup at every render call. See bug #506 and #516
			stackTotalGroup.translate(chart.plotLeft, chart.plotTop);

			// Render each stack total
			for (stackKey in stacks) {
				oneStack = stacks[stackKey];
				for (stackCategory in oneStack) {
					oneStack[stackCategory].render(stackTotalGroup);
				}
			}
		}
		// End stacked totals

		axis.isDirty = false;
	},

	/**
	 * Remove a plot band or plot line from the chart by id
	 * @param {Object} id
	 */
	removePlotBandOrLine: function (id) {
		var plotLinesAndBands = this.plotLinesAndBands,
			i = plotLinesAndBands.length;
		while (i--) {
			if (plotLinesAndBands[i].id === id) {
				plotLinesAndBands[i].destroy();
			}
		}
	},

	/**
	 * Update the axis title by options
	 */
	setTitle: function (newTitleOptions, redraw) {
		var axis = this,
			chart = axis.chart,
			options = axis.options,
			axisTitle;

		options.title = merge(options.title, newTitleOptions);

		axis.axisTitle = axisTitle && axisTitle.destroy(); // #922
		axis.isDirty = true;

		if (pick(redraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Redraw the axis to reflect changes in the data or axis extremes
	 */
	redraw: function () {
		var axis = this,
			chart = axis.chart;

		// hide tooltip and hover states
		if (chart.tracker.resetTracker) {
			chart.tracker.resetTracker(true);
		}

		// render the axis
		axis.render();

		// move plot lines and bands
		each(axis.plotLinesAndBands, function (plotLine) {
			plotLine.render();
		});

		// mark associated series as dirty and ready for redraw
		each(axis.series, function (series) {
			series.isDirty = true;
		});

	},

	/**
	 * Set new axis categories and optionally redraw
	 * @param {Array} newCategories
	 * @param {Boolean} doRedraw
	 */
	setCategories: function (newCategories, doRedraw) {
		var axis = this,
			chart = axis.chart;

		// set the categories
		axis.categories = axis.userOptions.categories = newCategories;

		// force reindexing tooltips
		each(axis.series, function (series) {
			series.translate();
			series.setTooltipPoints(true);
		});


		// optionally redraw
		axis.isDirty = true;

		if (pick(doRedraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Destroys an Axis instance.
	 */
	destroy: function () {
		var axis = this,
			stacks = axis.stacks,
			stackKey;

		// Remove the events
		removeEvent(axis);

		// Destroy each stack total
		for (stackKey in stacks) {
			destroyObjectProperties(stacks[stackKey]);

			stacks[stackKey] = null;
		}

		// Destroy collections
		each([axis.ticks, axis.minorTicks, axis.alternateBands, axis.plotLinesAndBands], function (coll) {
			destroyObjectProperties(coll);
		});

		// Destroy local variables
		each(['stackTotalGroup', 'axisLine', 'axisGroup', 'gridGroup', 'axisTitle'], function (prop) {
			if (axis[prop]) {
				axis[prop] = axis[prop].destroy();
			}
		});
	}

	
}; // end Axis

