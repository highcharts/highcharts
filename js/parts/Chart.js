
/**
 * The chart class
 * @param {Object} options
 * @param {Function} callback Function to run when the chart has loaded
 */
function Chart(options, callback) {

	// Handle regular options
	var seriesOptions = options.series; // skip merging data points to increase performance
	options.series = null;
	options = merge(defaultOptions, options); // do the merge
	options.series = seriesOptions; // set back the series data

	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = isObject(optionsMargin) ?
			optionsMargin :
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin],
		optionsMarginTop = pick(optionsChart.marginTop, margin[0]),
		optionsMarginRight = pick(optionsChart.marginRight, margin[1]),
		optionsMarginBottom = pick(optionsChart.marginBottom, margin[2]),
		optionsMarginLeft = pick(optionsChart.marginLeft, margin[3]),
		spacingTop = optionsChart.spacingTop,
		spacingRight = optionsChart.spacingRight,
		spacingBottom = optionsChart.spacingBottom,
		spacingLeft = optionsChart.spacingLeft,
		spacingBox,
		chartTitleOptions,
		chartSubtitleOptions,
		plotTop,
		marginRight,
		marginBottom,
		plotLeft,
		axisOffset,
		renderTo,
		renderToClone,
		container,
		containerId,
		containerWidth,
		containerHeight,
		chartWidth,
		chartHeight,
		oldChartWidth,
		oldChartHeight,
		chartBackground,
		plotBackground,
		plotBGImage,
		plotBorder,
		chart = this,
		chartEvents = optionsChart.events,
		runChartClick = chartEvents && !!chartEvents.click,
		eventType,
		isInsidePlot, // function
		loadingDiv,
		loadingSpan,
		loadingShown,
		plotHeight,
		plotWidth,
		tracker,
		legend,
		hasCartesianSeries = optionsChart.showAxes,
		isResizing = 0,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [],
		inverted,
		renderer,
		drawChartBox, // function
		getMargins, // function
		resetMargins, // function
		setChartSize, // function
		resize,
		zoom, // function
		zoomOut, // function
		mouseTrackerContext = new MouseTrackerContext(
			chart,
			optionsChart,
			function () { return renderer; },
			function () { return plotLeft; },
			function () { return plotTop; },
			function () { return plotWidth; },
			function () { return plotHeight; },
			function () { return chartWidth; },
			axes,
			function () { return zoom; },
			function () { return hasCartesianSeries; },
			runChartClick
		);

	/**
	 * Create a new axis object
	 * @param {Object} options
	 */
	function Axis(userOptions) {

		// Define variables
		var isXAxis = userOptions.isX,
			opposite = userOptions.opposite, // needed in setOptions
			horiz = inverted ? !isXAxis : isXAxis,
			side = horiz ?
				(opposite ? 0 : 2) : // top : bottom
				(opposite ? 1 : 3),  // right : left
			stacks = {},

			options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				[defaultTopAxisOptions, defaultRightAxisOptions,
					defaultBottomAxisOptions, defaultLeftAxisOptions][side],
				userOptions
			),

			axis = this,
			axisTitle,
			type = options.type,
			isDatetimeAxis = type === 'datetime',
			isLog = type === 'logarithmic',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength = 0,
			oldAxisLength,
			transA, // translation factor
			transB, // translation addend
			oldTransA, // used for prerendering
			axisLeft,
			axisTop,
			axisWidth,
			axisHeight,
			axisBottom,
			axisRight,
			translate, // fn
			setAxisTranslation, // fn
			getPlotLinePath, // fn
			axisGroup,
			gridGroup,
			axisLine,
			dataMin,
			dataMax,
			minRange = options.minRange || options.maxZoom,
			range = options.range,
			userMin,
			userMax,
			oldUserMin,
			oldUserMax,
			max = null,
			min = null,
			oldMin,
			oldMax,
			minPadding = options.minPadding,
			maxPadding = options.maxPadding,
			minPixelPadding = 0,
			isLinked = defined(options.linkedTo),
			linkedParent,
			ignoreMinPadding, // can be set to true by a column or bar series
			ignoreMaxPadding,
			usePercentage,
			events = options.events,
			eventType,
			plotLinesAndBands = [],
			tickInterval,
			minorTickInterval,
			magnitude,
			tickPositions, // array containing predefined positions
			tickPositioner = options.tickPositioner,
			ticks = {},
			minorTicks = {},
			alternateBands = {},
			tickAmount,
			labelOffset,
			axisTitleMargin,// = options.title.margin,
			categories = options.categories,
			labelFormatter = options.labels.formatter ||  // can be overwritten by dynamic format
				function () {
					var value = this.value,
						dateTimeLabelFormat = this.dateTimeLabelFormat,
						ret;

					if (dateTimeLabelFormat) { // datetime axis
						ret = dateFormat(dateTimeLabelFormat, value);

					} else if (tickInterval % 1000000 === 0) { // use M abbreviation
						ret = (value / 1000000) + 'M';

					} else if (tickInterval % 1000 === 0) { // use k abbreviation
						ret = (value / 1000) + 'k';

					} else if (!categories && value >= 1000) { // add thousands separators
						ret = numberFormat(value, 0);

					} else { // strings (categories) and small numbers
						ret = value;
					}
					return ret;
				},

			staggerLines = horiz && options.labels.staggerLines,
			reversed = options.reversed,
			tickmarkOffset = (categories && options.tickmarkPlacement === 'between') ? 0.5 : 0,
			plotLineOrBandContext = new PlotLineOrBandContext(
				chart, 
				axis, 
				isLog,
				function () { return min; },
				function () { return max; },
				function () { return axisWidth; },
				function () { return axisHeight; },
				horiz,
				plotLinesAndBands
			),
			stackItemContext = new StackItemContext(
				chart,
				inverted,
				axis
			),
			tickContext = new TickContext(
				chart,
				axis,
				options,
				categories,
				horiz,
				function () { return plotWidth; },
				function () { return tickPositions; },
				isDatetimeAxis,
				labelFormatter,
				isLog,
				function () { return axisGroup; },
				function () { return gridGroup; },
				function () { return oldChartHeight; },
				function () { return oldChartWidth; },
				function () { return chartHeight; },
				function () { return chartWidth; },
				tickmarkOffset,
				function () { return transA; },
				function () { return transB; },
				function () { return axisLeft; },
				function () { return axisRight; },
				function () { return axisBottom; },
				function () { return axisHeight; },
				opposite,
				staggerLines,
				offset
			);

		/**
		 * Get the minimum and maximum for the series of each axis
		 */
		function getSeriesExtremes() {
			var posStack = [],
				negStack = [],
				i;

			// reset dataMin and dataMax in case we're redrawing
			dataMin = dataMax = null;

			// loop through this axis' series
			each(axis.series, function (series) {

				if (series.visible || !optionsChart.ignoreHiddenSeries) {

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
					if (isLog && threshold <= 0) {
						threshold = seriesOptions.threshold = null;
					}

					// Get dataMin and dataMax for X axes
					if (isXAxis) {
						xData = series.xData;
						if (xData.length) {
							dataMin = mathMin(pick(dataMin, xData[0]), arrayMin(xData));
							dataMax = mathMax(pick(dataMax, xData[0]), arrayMax(xData));
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
						usePercentage = stacking === 'percent';

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
						if (usePercentage) {
							dataMin = 0;
							dataMax = 99;
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
										stacks[key][x] = new StackItem(stackItemContext, options.stackLabels, isNegative, x, stackOption);
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
						if (!usePercentage && activeYData.length) {
							dataMin = mathMin(pick(dataMin, activeYData[0]), arrayMin(activeYData));
							dataMax = mathMax(pick(dataMax, activeYData[0]), arrayMax(activeYData));
						}

						// Adjust to threshold
						if (defined(threshold)) {
							if (dataMin >= threshold) {
								dataMin = threshold;
								ignoreMinPadding = true;
							} else if (dataMax < threshold) {
								dataMax = threshold;
								ignoreMaxPadding = true;
							}
						}
					}
				}
			});

		}

		/**
		 * Translate from axis value to pixel position on the chart, or back
		 *
		 */
		translate = function (val, backwards, cvsCoord, old, handleLog) {
			
			var sign = 1,
				cvsOffset = 0,
				localA = old ? oldTransA : transA,
				localMin = old ? oldMin : min,
				returnValue,
				postTranslate = options.ordinal || (isLog && handleLog);

			if (!localA) {
				localA = transA;
			}

			if (cvsCoord) {
				sign *= -1; // canvas coordinates inverts the value
				cvsOffset = axisLength;
			}
			if (reversed) { // reversed axis
				sign *= -1;
				cvsOffset -= sign * axisLength;
			}

			if (backwards) { // reverse translation
				if (reversed) {
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

				returnValue = sign * (val - localMin) * localA + cvsOffset + (sign * minPixelPadding);
			}

			return returnValue;
		};

		/**
		 * Create the path for a plot line that goes from the given value on
		 * this axis, across the plot to the opposite side
		 * @param {Number} value
		 * @param {Number} lineWidth Used for calculation crisp line
		 * @param {Number] old Use old coordinates (for resizing and rescaling)
		 */
		getPlotLinePath = function (value, lineWidth, old) {
			var x1,
				y1,
				x2,
				y2,
				translatedValue = translate(value, null, null, old),
				cHeight = (old && oldChartHeight) || chartHeight,
				cWidth = (old && oldChartWidth) || chartWidth,
				skip;

			x1 = x2 = mathRound(translatedValue + transB);
			y1 = y2 = mathRound(cHeight - translatedValue - transB);

			if (isNaN(translatedValue)) { // no min or max
				skip = true;

			} else if (horiz) {
				y1 = axisTop;
				y2 = cHeight - axisBottom;
				if (x1 < axisLeft || x1 > axisLeft + axisWidth) {
					skip = true;
				}
			} else {
				x1 = axisLeft;
				x2 = cWidth - axisRight;

				if (y1 < axisTop || y1 > axisTop + axisHeight) {
					skip = true;
				}
			}
			return skip ?
				null :
				renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
		};

		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function getLinearTickPositions(tickInterval, min, max) {

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
		}
		
		/**
		 * Set the tick positions of a logarithmic axis
		 */
		function getLogTickPositions(interval, min, max, minor) {
			
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
				positions = getLinearTickPositions(interval, min, max);
				
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
					totalPixelLength = minor ? axisLength / tickPositions.length : axisLength;
				
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
				
				positions = map(getLinearTickPositions(
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
				tickInterval = interval;
			}
			return positions;
		}
		
		/**
		 * Return the minor tick positions. For logarithmic axes, reuse the same logic
		 * as for major ticks.
		 */
		function getMinorTickPositions() {
			var minorTickPositions = [],
				pos,
				i,
				len;
			
			if (isLog) {
				len = tickPositions.length;
				for (i = 1; i < len; i++) {
					minorTickPositions = minorTickPositions.concat(
						getLogTickPositions(minorTickInterval, tickPositions[i - 1], tickPositions[i], true)
					);	
				}
			
			} else {			
				for (pos = min + (tickPositions[0] - min) % minorTickInterval; pos <= max; pos += minorTickInterval) {
					minorTickPositions.push(pos);	
				}
			}
			
			return minorTickPositions;
		}

		/**
		 * Adjust the min and max for the minimum range. Keep in mind that the series data is 
		 * not yet processed, so we don't have information on data cropping and grouping, or 
		 * updated axis.pointRange or series.pointRange. The data can't be processed until
		 * we have finally established min and max.
		 */
		function adjustForMinRange() {
			var zoomOffset,
				spaceAvailable = dataMax - dataMin >= minRange,
				closestDataRange,
				i,
				distance,
				xData,
				loopLength,
				minArgs,
				maxArgs;
				
			// Set the automatic minimum range based on the closest point distance
			if (isXAxis && minRange === UNDEFINED && !isLog) {
				
				if (defined(options.min) || defined(options.max)) {
					minRange = null; // don't do this again

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
					minRange = mathMin(closestDataRange * 5, dataMax - dataMin);
				}
			}
			
			// if minRange is exceeded, adjust
			if (max - min < minRange) {

				zoomOffset = (minRange - max + min) / 2;

				// if min and max options have been set, don't go beyond it
				minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
				if (spaceAvailable) { // if space is available, stay within the data range
					minArgs[2] = dataMin;
				}
				min = arrayMax(minArgs);

				maxArgs = [min + minRange, pick(options.max, min + minRange)];
				if (spaceAvailable) { // if space is availabe, stay within the data range
					maxArgs[2] = dataMax;
				}
				
				max = arrayMin(maxArgs);

				// now if the max is adjusted, adjust the min back
				if (max - min < minRange) {
					minArgs[0] = max - minRange;
					minArgs[1] = pick(options.min, max - minRange);
					min = arrayMax(minArgs);
				}
			}
		}

		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions(secondPass) {

			var length,
				linkedParentExtremes,
				tickIntervalOption = options.tickInterval,
				tickPixelIntervalOption = options.tickPixelInterval;

			// linked axis gets the extremes from the parent axis
			if (isLinked) {
				linkedParent = chart[isXAxis ? 'xAxis' : 'yAxis'][options.linkedTo];
				linkedParentExtremes = linkedParent.getExtremes();
				min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
				max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
				if (options.type !== linkedParent.options.type) {
					error(11, 1); // Can't link axes of different type
				}
			} else { // initial min and max from the extreme data values
				min = pick(userMin, options.min, dataMin);
				max = pick(userMax, options.max, dataMax);
			}

			if (isLog) {
				if (!secondPass && min <= 0) {
					error(10); // Can't plot negative values on log axis
				}
				min = log2lin(min);
				max = log2lin(max);
			}

			// handle zoomed range
			if (range) {
				userMin = min = mathMax(min, max - range); // #618
				userMax = max;
				if (secondPass) {
					range = null;  // don't use it when running setExtremes
				}
			}

			// adjust min and max for the minimum range
			adjustForMinRange();

			// pad the values to get clear of the chart's edges
			if (!categories && !usePercentage && !isLinked && defined(min) && defined(max)) {
				length = (max - min) || 1;
				if (!defined(options.min) && !defined(userMin) && minPadding && (dataMin < 0 || !ignoreMinPadding)) {
					min -= length * minPadding;
				}
				if (!defined(options.max) && !defined(userMax)  && maxPadding && (dataMax > 0 || !ignoreMaxPadding)) {
					max += length * maxPadding;
				}
			}

			// get tickInterval
			if (min === max || min === undefined || max === undefined) {
				tickInterval = 1;
			} else if (isLinked && !tickIntervalOption &&
					tickPixelIntervalOption === linkedParent.options.tickPixelInterval) {
				tickInterval = linkedParent.tickInterval;
			} else {
				tickInterval = pick(
					tickIntervalOption,
					categories ? // for categoried axis, 1 is default, for linear axis use tickPix
						1 :
						(max - min) * tickPixelIntervalOption / (axisLength || 1)
				);
			}

			// Now we're finished detecting min and max, crop and group series data. This
			// is in turn needed in order to find tick positions in ordinal axes. 
			if (isXAxis && !secondPass) {
				each(axis.series, function (series) {
					series.processData(min !== oldMin || max !== oldMax);             
				});
			}

			// set the translation factor used in translate function
			setAxisTranslation();

			// hook for ordinal axes. To do: merge with below
			if (axis.beforeSetTickPositions) {
				axis.beforeSetTickPositions();
			}
			
			// hook for extensions, used in Highstock ordinal axes
			if (axis.postProcessTickInterval) {
				tickInterval = axis.postProcessTickInterval(tickInterval);				
			}

			// for linear axes, get magnitude and normalize the interval
			if (!isDatetimeAxis && !isLog) { // linear
				magnitude = math.pow(10, mathFloor(math.log(tickInterval) / math.LN10));
				if (!defined(options.tickInterval)) {
					tickInterval = normalizeTickInterval(tickInterval, null, magnitude, options);
				}
			}

			// record the tick interval for linked axis
			axis.tickInterval = tickInterval;

			// get minorTickInterval
			minorTickInterval = options.minorTickInterval === 'auto' && tickInterval ?
					tickInterval / 5 : options.minorTickInterval;

			// find the tick positions
			tickPositions = options.tickPositions || (tickPositioner && tickPositioner.apply(axis, [min, max]));
			if (!tickPositions) {
				if (isDatetimeAxis) {
					tickPositions = (axis.getNonLinearTimeTicks || getTimeTicks)(
						normalizeTimeTickInterval(tickInterval, options.units),
						min,
						max,
						options.startOfWeek,
						axis.ordinalPositions,
						axis.closestPointRange,
						true
					);
				} else if (isLog) {
					tickPositions = getLogTickPositions(tickInterval, min, max);
				} else {
					tickPositions = getLinearTickPositions(tickInterval, min, max);
				}
			}

			// post process positions, used in ordinal axes in Highstock. 
			// TODO: combine with getNonLinearTimeTicks
			fireEvent(axis, 'afterSetTickPositions', {
				tickPositions: tickPositions
			});

			if (!isLinked) {

				// reset min/max or remove extremes based on start/end on tick
				var roundedMin = tickPositions[0],
					roundedMax = tickPositions[tickPositions.length - 1];

				if (options.startOnTick) {
					min = roundedMin;
				} else if (min > roundedMin) {
					tickPositions.shift();
				}

				if (options.endOnTick) {
					max = roundedMax;
				} else if (max < roundedMax) {
					tickPositions.pop();
				}

				// record the greatest number of ticks for multi axis
				if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
					maxTicks = {
						x: 0,
						y: 0
					};
				}

				if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY] && options.alignTicks !== false) {
					maxTicks[xOrY] = tickPositions.length;
				}
			}
		}

		/**
		 * When using multiple axes, adjust the number of ticks to match the highest
		 * number of ticks in that group
		 */
		function adjustTickAmount() {

			if (maxTicks && maxTicks[xOrY] && !isDatetimeAxis && !categories && !isLinked && options.alignTicks !== false) { // only apply to linear scale
				var oldTickAmount = tickAmount,
					calculatedTickAmount = tickPositions.length;

				// set the axis-level tickAmount to use below
				tickAmount = maxTicks[xOrY];

				if (calculatedTickAmount < tickAmount) {
					while (tickPositions.length < tickAmount) {
						tickPositions.push(correctFloat(
							tickPositions[tickPositions.length - 1] + tickInterval
						));
					}
					transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
					max = tickPositions[tickPositions.length - 1];

				}
				if (defined(oldTickAmount) && tickAmount !== oldTickAmount) {
					axis.isDirty = true;
				}
			}


		}

		/**
		 * Set the scale based on data min and max, user set min and max or options
		 *
		 */
		function setScale() {
			var type,
				i,
				isDirtyData;

			oldMin = min;
			oldMax = max;
			oldAxisLength = axisLength;

			// set the new axisLength
			axisLength = horiz ? axisWidth : axisHeight;

			// is there new data?
			each(axis.series, function (series) {
				if (series.isDirtyData || series.isDirty ||
						series.xAxis.isDirty) { // when x axis is dirty, we need new data extremes for y as well
					isDirtyData = true;
				}
			});

			// do we really need to go through all this?
			if (axisLength !== oldAxisLength || isDirtyData || isLinked ||
				userMin !== oldUserMin || userMax !== oldUserMax) {

				// get data extremes if needed
				getSeriesExtremes();

				// get fixed positions based on tickInterval
				setTickPositions();

				// record old values to decide whether a rescale is necessary later on (#540)
				oldUserMin = userMin;
				oldUserMax = userMax;

				// reset stacks
				if (!isXAxis) {
					for (type in stacks) {
						for (i in stacks[type]) {
							stacks[type][i].cum = stacks[type][i].total;
						}
					}
				}

				// Mark as dirty if it is not already set to dirty and extremes have changed. #595.
				if (!axis.isDirty) {
					axis.isDirty = chart.isDirtyBox || min !== oldMin || max !== oldMax;
				}
			}
		}

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
		function setExtremes(newMin, newMax, redraw, animation, eventArguments) {

			redraw = pick(redraw, true); // defaults to true
			
			// Extend the arguments with min and max
			eventArguments = extend(eventArguments, {
				min: newMin,
				max: newMax
			});

			// Fire the event
			fireEvent(axis, 'setExtremes', eventArguments, function () { // the default event handler

				userMin = newMin;
				userMax = newMax;
				
				// redraw
				if (redraw) {
					chart.redraw(animation);
				}
			});
		}
		
		/**
		 * Update translation information
		 */
		setAxisTranslation = function () {
			var range = max - min,
				pointRange = 0,
				closestPointRange,
				seriesClosestPointRange;
			
			// adjust translation for padding
			if (isXAxis) {
				if (isLinked) {
					pointRange = linkedParent.pointRange;
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
			oldTransA = transA;
			axis.translationSlope = transA = axisLength / ((range + pointRange) || 1);
			transB = horiz ? axisLeft : axisBottom; // translation addend
			minPixelPadding = transA * (pointRange / 2);
		};

		/**
		 * Update the axis metrics
		 */
		function setAxisSize() {

			var offsetLeft = options.offsetLeft || 0,
				offsetRight = options.offsetRight || 0;

			// basic values
			axisLeft = pick(options.left, plotLeft + offsetLeft);
			axisTop = pick(options.top, plotTop);
			axisWidth = pick(options.width, plotWidth - offsetLeft + offsetRight);
			axisHeight = pick(options.height, plotHeight);
			axisBottom = chartHeight - axisHeight - axisTop;
			axisRight = chartWidth - axisWidth - axisLeft;
			axisLength = horiz ? axisWidth : axisHeight;

			// expose to use in Series object and navigator
			axis.left = axisLeft;
			axis.top = axisTop;
			axis.len = axisLength;

		}

		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: isLog ? correctFloat(lin2log(min)) : min,
				max: isLog ? correctFloat(lin2log(max)) : max,
				dataMin: dataMin,
				dataMax: dataMax,
				userMin: userMin,
				userMax: userMax
			};
		}

		/**
		 * Get the zero plane either based on zero or on the min or max value.
		 * Used in bar and area plots
		 */
		function getThreshold(threshold) {
			var realMin = isLog ? lin2log(min) : min,
				realMax = isLog ? lin2log(max) : max;
			
			if (realMin > threshold || threshold === null) {
				threshold = realMin;
			} else if (realMax < threshold) {
				threshold = realMax;
			}

			return translate(threshold, 0, 1, 0, 1);
		}

		/**
		 * Add a plot band or plot line after render time
		 *
		 * @param options {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(options) {
			var obj = new PlotLineOrBand(plotLineOrBandContext, options).render();
			plotLinesAndBands.push(obj);
			return obj;
		}

		/**
		 * Render the tick labels to a preliminary position to get their sizes
		 */
		function getOffset() {

			var hasData = axis.series.length && defined(min) && defined(max),
				showAxis = hasData || pick(options.showEmpty, true),
				titleOffset = 0,
				titleOffsetOption,
				titleMargin = 0,
				axisTitleOptions = options.title,
				labelOptions = options.labels,
				directionFactor = [-1, 1, 1, -1][side],
				n;

			if (!axisGroup) {
				axisGroup = renderer.g('axis')
					.attr({ zIndex: 7 })
					.add();
				gridGroup = renderer.g('grid')
					.attr({ zIndex: options.gridZIndex || 1 })
					.add();
			}

			labelOffset = 0; // reset

			if (hasData || isLinked) {
				each(tickPositions, function (pos) {
					if (!ticks[pos]) {
						ticks[pos] = new Tick(tickContext, pos);
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

				if (staggerLines) {
					labelOffset += (staggerLines - 1) * 16;
				}

			} else { // doesn't have data
				for (n in ticks) {
					ticks[n].destroy();
					delete ticks[n];
				}
			}

			if (axisTitleOptions && axisTitleOptions.text) {
				if (!axisTitle) {
					axisTitle = axis.axisTitle = renderer.text(
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
					.add();
					axisTitle.isNew = true;
				}

				if (showAxis) {
					titleOffset = axisTitle.getBBox()[horiz ? 'height' : 'width'];
					titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
					titleOffsetOption = axisTitleOptions.offset;
				}

				// hide or show the title depending on whether showEmpty is set
				axisTitle[showAxis ? 'show' : 'hide']();


			}

			// handle automatic or user set offset
			offset = directionFactor * pick(options.offset, axisOffset[side]);

			axisTitleMargin =
				pick(titleOffsetOption,
					labelOffset + titleMargin +
					(side !== 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x'])
				);

			axisOffset[side] = mathMax(
				axisOffset[side],
				axisTitleMargin + titleOffset + directionFactor * offset
			);

		}

		/**
		 * Render the axis
		 */
		function render() {
			var axisTitleOptions = options.title,
				stackLabelOptions = options.stackLabels,
				alternateGridColor = options.alternateGridColor,
				lineWidth = options.lineWidth,
				lineLeft,
				lineTop,
				linePath,
				hasRendered = chart.hasRendered,
				slideInTicks = hasRendered && defined(oldMin) && !isNaN(oldMin),
				hasData = axis.series.length && defined(min) && defined(max),
				showAxis = hasData || pick(options.showEmpty, true),
				from,
				to;

			// If the series has data draw the ticks. Else only the line and title
			if (hasData || isLinked) {

				// minor ticks
				if (minorTickInterval && !categories) {
					each(getMinorTickPositions(), function (pos) {
						if (!minorTicks[pos]) {
							minorTicks[pos] = new Tick(tickContext, pos, 'minor');
						}

						// render new ticks in old position
						if (slideInTicks && minorTicks[pos].isNew) {
							minorTicks[pos].render(null, true);
						}


						minorTicks[pos].isActive = true;
						minorTicks[pos].render();
					});
				}

				// major ticks
				each(tickPositions, function (pos, i) {
					// linked axes need an extra check to find out if
					if (!isLinked || (pos >= min && pos <= max)) {

						if (!ticks[pos]) {
							ticks[pos] = new Tick(tickContext, pos);
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
						if (i % 2 === 0 && pos < max) {
							if (!alternateBands[pos]) {
								alternateBands[pos] = new PlotLineOrBand(plotLineOrBandContext);
							}
							from = pos;
							to = tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max;
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
						addPlotBandOrLine(plotLineOptions);
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
				lineLeft = axisLeft + (opposite ? axisWidth : 0) + offset;
				lineTop = chartHeight - axisBottom - (opposite ? axisHeight : 0) + offset;

				linePath = renderer.crispLine([
						M,
						horiz ?
							axisLeft :
							lineLeft,
						horiz ?
							lineTop :
							axisTop,
						L,
						horiz ?
							chartWidth - axisRight :
							lineLeft,
						horiz ?
							lineTop :
							chartHeight - axisBottom
					], lineWidth);
				if (!axisLine) {
					axisLine = renderer.path(linePath)
						.attr({
							stroke: options.lineColor,
							'stroke-width': lineWidth,
							zIndex: 7
						})
						.add();
				} else {
					axisLine.animate({ d: linePath });
				}

				// show or hide the line depending on options.showEmpty
				axisLine[showAxis ? 'show' : 'hide']();

			}

			if (axisTitle && showAxis) {
				// compute anchor points for each of the title align options
				var margin = horiz ? axisLeft : axisTop,
					fontSize = pInt(axisTitleOptions.style.fontSize || 12),
				// the position in the length direction of the axis
				alongAxis = {
					low: margin + (horiz ? 0 : axisLength),
					middle: margin + axisLength / 2,
					high: margin + (horiz ? axisLength : 0)
				}[axisTitleOptions.align],

				// the position in the perpendicular direction of the axis
				offAxis = (horiz ? axisTop + axisHeight : axisLeft) +
					(horiz ? 1 : -1) * // horizontal axis reverses the margin
					(opposite ? -1 : 1) * // so does opposite axes
					axisTitleMargin +
					(side === 2 ? fontSize : 0);

				axisTitle[axisTitle.isNew ? 'attr' : 'animate']({
					x: horiz ?
						alongAxis :
						offAxis + (opposite ? axisWidth : 0) + offset +
							(axisTitleOptions.x || 0), // x
					y: horiz ?
						offAxis - (opposite ? axisHeight : 0) + offset :
						alongAxis + (axisTitleOptions.y || 0) // y
				});
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
							.translate(plotLeft, plotTop)
							.add();
				}

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
		}

		/**
		 * Remove a plot band or plot line from the chart by id
		 * @param {Object} id
		 */
		function removePlotBandOrLine(id) {
			var i = plotLinesAndBands.length;
			while (i--) {
				if (plotLinesAndBands[i].id === id) {
					plotLinesAndBands[i].destroy();
				}
			}
		}
		
		/**
		 * Update the axis title by options
		 */
		function setTitle(newTitleOptions, redraw) {
			options.title = merge(options.title, newTitleOptions);
			
			axisTitle = axisTitle.destroy();
			axis.isDirty = true;
			
			if (pick(redraw, true)) {
				chart.redraw();
			}
		}

		/**
		 * Redraw the axis to reflect changes in the data or axis extremes
		 */
		function redraw() {

			// hide tooltip and hover states
			if (tracker.resetTracker) {
				tracker.resetTracker();
			}

			// render the axis
			render();

			// move plot lines and bands
			each(plotLinesAndBands, function (plotLine) {
				plotLine.render();
			});

			// mark associated series as dirty and ready for redraw
			each(axis.series, function (series) {
				series.isDirty = true;
			});

		}

		/**
		 * Set new axis categories and optionally redraw
		 * @param {Array} newCategories
		 * @param {Boolean} doRedraw
		 */
		function setCategories(newCategories, doRedraw) {
				// set the categories
				axis.categories = userOptions.categories = categories = newCategories;

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
		}

		/**
		 * Destroys an Axis instance.
		 */
		function destroy() {
			var stackKey;

			// Remove the events
			removeEvent(axis);

			// Destroy each stack total
			for (stackKey in stacks) {
				destroyObjectProperties(stacks[stackKey]);

				stacks[stackKey] = null;
			}

			// Destroy stack total group
			if (axis.stackTotalGroup) {
				axis.stackTotalGroup = axis.stackTotalGroup.destroy();
			}

			// Destroy collections
			each([ticks, minorTicks, alternateBands, plotLinesAndBands], function (coll) {
				destroyObjectProperties(coll);
			});

			// Destroy local variables
			each([axisLine, axisGroup, gridGroup, axisTitle], function (obj) {
				if (obj) {
					obj.destroy();
				}
			});
			axisLine = axisGroup = gridGroup = axisTitle = null;
		}


		// Run Axis

		// Register
		axes.push(axis);
		chart[isXAxis ? 'xAxis' : 'yAxis'].push(axis);

		// inverted charts have reversed xAxes as default
		if (inverted && isXAxis && reversed === UNDEFINED) {
			reversed = true;
		}


		// expose some variables
		extend(axis, {
			addPlotBand: addPlotBandOrLine,
			addPlotLine: addPlotBandOrLine,
			adjustTickAmount: adjustTickAmount,
			categories: categories,
			getExtremes: getExtremes,
			getPlotLinePath: getPlotLinePath,
			getThreshold: getThreshold,
			isXAxis: isXAxis,
			options: options,
			plotLinesAndBands: plotLinesAndBands,
			getOffset: getOffset,
			render: render,
			setAxisSize: setAxisSize,
			setAxisTranslation: setAxisTranslation,
			setCategories: setCategories,
			setExtremes: setExtremes,
			setScale: setScale,
			setTickPositions: setTickPositions,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			reversed: reversed,
			setTitle: setTitle,
			series: [], // populated by Series
			stacks: stacks,
			destroy: destroy
		});

		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}

		// extend logarithmic axis
		if (isLog) {
			axis.val2lin = log2lin;
			axis.lin2val = lin2log;
		}

	} // end Axis

	/**
	 * Initialize an individual series, called internally before render time
	 */
	function initSeries(options) {
		var type = options.type || optionsChart.type || optionsChart.defaultSeriesType,
			typeClass = seriesTypes[type],
			serie,
			hasRendered = chart.hasRendered;

		// an inverted chart can't take a column series and vice versa
		if (hasRendered) {
			if (inverted && type === 'column') {
				typeClass = seriesTypes.bar;
			} else if (!inverted && type === 'bar') {
				typeClass = seriesTypes.column;
			}
		}

		serie = new typeClass();

		serie.init(chart, options);

		// set internal chart properties
		if (!hasRendered && serie.inverted) {
			inverted = true;
		}
		if (serie.isCartesian) {
			hasCartesianSeries = serie.isCartesian;
		}

		series.push(serie);

		return serie;
	}

	/**
	 * Add a series dynamically after  time
	 *
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 * @return {Object} series The newly created series object
	 */
	function addSeries(options, redraw, animation) {
		var series;

		if (options) {
			setAnimation(animation, chart);
			redraw = pick(redraw, true); // defaults to true

			fireEvent(chart, 'addSeries', { options: options }, function () {
				series = initSeries(options);
				series.isDirty = true;

				chart.isDirtyLegend = true; // the series array is out of sync with the display
				if (redraw) {
					chart.redraw();
				}
			});
		}

		return series;
	}

	/**
	 * Check whether a given point is within the plot area
	 *
	 * @param {Number} x Pixel x relative to the plot area
	 * @param {Number} y Pixel y relative to the plot area
	 */
	isInsidePlot = function (x, y) {
		return x >= 0 &&
			x <= plotWidth &&
			y >= 0 &&
			y <= plotHeight;
	};

	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) {
			each(axes, function (axis) {
				axis.adjustTickAmount();
			});
		}
		maxTicks = null;
	}

	/**
	 * Redraw legend, axes or series based on updated data
	 *
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	function redraw(animation) {
		var redrawLegend = chart.isDirtyLegend,
			hasStackedSeries,
			isDirtyBox = chart.isDirtyBox, // todo: check if it has actually changed?
			seriesLength = series.length,
			i = seriesLength,
			clipRect = chart.clipRect,
			serie;

		setAnimation(animation, chart);

		// link stacked series
		while (i--) {
			serie = series[i];
			if (serie.isDirty && serie.options.stacking) {
				hasStackedSeries = true;
				break;
			}
		}
		if (hasStackedSeries) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}

		// handle updated data in the series
		each(series, function (serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				if (serie.options.legendType === 'point') {
					redrawLegend = true;
				}
			}
		});

		// handle added or removed series
		if (redrawLegend && legend.renderLegend) { // series or pie points are added or removed
			// draw legend graphics
			legend.renderLegend();

			chart.isDirtyLegend = false;
		}


		if (hasCartesianSeries) {
			if (!isResizing) {

				// reset maxTicks
				maxTicks = null;

				// set axes scales
				each(axes, function (axis) {
					axis.setScale();
				});
			}
			adjustTickAmounts();
			getMargins();

			// redraw axes
			each(axes, function (axis) {
				fireEvent(axis, 'afterSetExtremes', axis.getExtremes()); // #747, #751					
				if (axis.isDirty) {					
					axis.redraw();					
				}
			});


		}

		// the plot areas size has changed
		if (isDirtyBox) {
			drawChartBox();

			// move clip rect
			if (clipRect) {
				stop(clipRect);
				clipRect.animate({ // for chart resize
					width: chart.plotSizeX,
					height: chart.plotSizeY + 1
				});
			}

		}


		// redraw affected series
		each(series, function (serie) {
			if (serie.isDirty && serie.visible &&
					(!serie.isCartesian || serie.xAxis)) { // issue #153
				serie.redraw();
			}
		});


		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker();
		}

		// redraw if canvas
		renderer.draw();

		// fire the event
		fireEvent(chart, 'redraw'); // jQuery breaks this when calling it from addEvent. Overwrites chart.redraw
	}



	/**
	 * Dim the chart and show a loading text or symbol
	 * @param {String} str An optional text to show in the loading label instead of the default one
	 */
	function showLoading(str) {
		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingDiv) {
			loadingDiv = createElement(DIV, {
				className: PREFIX + 'loading'
			}, extend(loadingOptions.style, {
				left: plotLeft + PX,
				top: plotTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), container);

			loadingSpan = createElement(
				'span',
				null,
				loadingOptions.labelStyle,
				loadingDiv
			);

		}

		// update text
		loadingSpan.innerHTML = str || options.lang.loading;

		// show it
		if (!loadingShown) {
			css(loadingDiv, { opacity: 0, display: '' });
			animate(loadingDiv, {
				opacity: loadingOptions.style.opacity
			}, {
				duration: loadingOptions.showDuration || 0
			});
			loadingShown = true;
		}
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		if (loadingDiv) {
			animate(loadingDiv, {
				opacity: 0
			}, {
				duration: options.loading.hideDuration || 100,
				complete: function () {
					css(loadingDiv, { display: NONE });
				}
			});
		}
		loadingShown = false;
	}

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			points;

		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id === id) {
				return axes[i];
			}
		}

		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id === id) {
				return series[i];
			}
		}

		// search points
		for (i = 0; i < series.length; i++) {
			points = series[i].points || [];
			for (j = 0; j < points.length; j++) {
				if (points[j].id === id) {
					return points[j];
				}
			}
		}
		return null;
	}

	/**
	 * Create the Axis instances based on the config options
	 */
	function getAxes() {
		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			optionsArray,
			axis;

		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function (axis, i) {
			axis.index = i;
			axis.isX = true;
		});

		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function (axis, i) {
			axis.index = i;
		});

		// concatenate all axis options into one array
		optionsArray = xAxisOptions.concat(yAxisOptions);

		each(optionsArray, function (axisOptions) {
			axis = new Axis(axisOptions);
		});

		adjustTickAmounts();
	}


	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function (serie) {
			points = points.concat(grep(serie.points, function (point) {
				return point.selected;
			}));
		});
		return points;
	}

	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep(series, function (serie) {
			return serie.selected;
		});
	}

	/**
	 * Display the zoom button
	 */
	function showResetZoom() {
		var lang = defaultOptions.lang,
			btnOptions = optionsChart.resetZoomButton,
			theme = btnOptions.theme,
			states = theme.states,
			box = btnOptions.relativeTo === 'chart' ? null : {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};
		chart.resetZoomButton = renderer.button(lang.resetZoom, null, null, zoomOut, theme, states && states.hover)
			.attr({
				align: btnOptions.position.align,
				title: lang.resetZoomTitle
			})
			.add()
			.align(btnOptions.position, false, box);
	}

	/**
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		var resetZoomButton = chart.resetZoomButton;

		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		if (resetZoomButton) {
			chart.resetZoomButton = resetZoomButton.destroy();
		}
	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {

		// add button to reset selection
		var animate = chart.pointCount < 100,
			hasZoomed;

		if (chart.resetZoomEnabled !== false && !chart.resetZoomButton) { // hook for Stock charts etc.
			showResetZoom();
		}

		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function (axis) {
				if (axis.options.zoomEnabled !== false) {
					axis.setExtremes(null, null, false);
					hasZoomed = true;
				}
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis;

				// don't zoom more than minRange
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false);
					hasZoomed = true;
				}
			});
		}

		// Redraw
		if (hasZoomed) {
			redraw(true, animate);
		}
	};

	/**
	 * Pan the chart by dragging the mouse across the pane. This function is called
	 * on mouse move, and the distance to pan is computed from chartX compared to
	 * the first chartX position in the dragging operation.
	 */
	chart.pan = function (chartX) {

		var xAxis = chart.xAxis[0],
			mouseDownX = chart.mouseDownX,
			halfPointRange = xAxis.pointRange / 2,
			extremes = xAxis.getExtremes(),
			newMin = xAxis.translate(mouseDownX - chartX, true) + halfPointRange,
			newMax = xAxis.translate(mouseDownX + plotWidth - chartX, true) - halfPointRange,
			hoverPoints = chart.hoverPoints;

		// remove active points for shared tooltip
		if (hoverPoints) {
			each(hoverPoints, function (point) {
				point.setState();
			});
		}

		if (newMin > mathMin(extremes.dataMin, extremes.min) && newMax < mathMax(extremes.dataMax, extremes.max)) {
			xAxis.setExtremes(newMin, newMax, true, false);
		}

		chart.mouseDownX = chartX; // set new reference for next run
		css(container, { cursor: 'move' });
	};

	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	function setTitle(titleOptions, subtitleOptions) {

		chartTitleOptions = merge(options.title, titleOptions);
		chartSubtitleOptions = merge(options.subtitle, subtitleOptions);

		// add title and subtitle
		each([
			['title', titleOptions, chartTitleOptions],
			['subtitle', subtitleOptions, chartSubtitleOptions]
		], function (arr) {
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];

			if (title && titleOptions) {
				title = title.destroy(); // remove old
			}
			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = renderer.text(
					chartTitleOptions.text,
					0,
					0,
					chartTitleOptions.useHTML
				)
				.attr({
					align: chartTitleOptions.align,
					'class': PREFIX + name,
					zIndex: 1
				})
				.css(chartTitleOptions.style)
				.add()
				.align(chartTitleOptions, false, spacingBox);
			}
		});

	}

	/**
	 * Get chart width and height according to options and container size
	 */
	function getChartSize() {

		containerWidth = (renderToClone || renderTo).offsetWidth;
		containerHeight = (renderToClone || renderTo).offsetHeight;
		chart.chartWidth = chartWidth = optionsChart.width || containerWidth || 600;
		chart.chartHeight = chartHeight = optionsChart.height ||
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(containerHeight > 19 ? containerHeight : 400);
	}


	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;

		if (isString(renderTo)) {
			renderTo = doc.getElementById(renderTo);
		}
		
		// Display an error if the renderTo is wrong
		if (!renderTo) {
			error(13, true);
		}

		// remove previous chart
		renderTo.innerHTML = '';

		// If the container doesn't have an offsetWidth, it has or is a child of a node
		// that has display:none. We need to temporarily move it out to a visible
		// state to determine the size, else the legend and tooltips won't render
		// properly
		if (!renderTo.offsetWidth) {
			renderToClone = renderTo.cloneNode(0);
			css(renderToClone, {
				position: ABSOLUTE,
				top: '-9999px',
				display: ''
			});
			doc.body.appendChild(renderToClone);
		}

		// get the width and height
		getChartSize();

		// create the inner container
		chart.container = container = createElement(DIV, {
				className: PREFIX + 'container' +
					(optionsChart.className ? ' ' + optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN, // needed for context menu (avoid scrollbars) and
					// content overflow in IE
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left',
				lineHeight: 'normal' // #427
			}, optionsChart.style),
			renderToClone || renderTo
		);

		chart.renderer = renderer =
			optionsChart.forExport ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight, true) :
				new Renderer(container, chartWidth, chartHeight);

		if (useCanVG) {
			// If we need canvg library, extend and configure the renderer
			// to get the tracker for translating mouse events
			renderer.create(chart, container, chartWidth, chartHeight);
		}

		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (-(rect.left - pInt(rect.left))) + PX,
					top: (-(rect.top - pInt(rect.top))) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);

			// remove it on chart destroy
			addEvent(chart, 'destroy', function () {
				removeEvent(win, 'resize', subPixelFix);
			});
		}
	}

	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins = function () {
		var legendOptions = options.legend,
			legendMargin = pick(legendOptions.margin, 10),
			legendX = legendOptions.x,
			legendY = legendOptions.y,
			align = legendOptions.align,
			verticalAlign = legendOptions.verticalAlign,
			titleOffset;

		resetMargins();

		// adjust for title and subtitle
		if ((chart.title || chart.subtitle) && !defined(optionsMarginTop)) {
			titleOffset = mathMax(
				(chart.title && !chartTitleOptions.floating && !chartTitleOptions.verticalAlign && chartTitleOptions.y) || 0,
				(chart.subtitle && !chartSubtitleOptions.floating && !chartSubtitleOptions.verticalAlign && chartSubtitleOptions.y) || 0
			);
			if (titleOffset) {
				plotTop = mathMax(plotTop, titleOffset + pick(chartTitleOptions.margin, 15) + spacingTop);
			}
		}
		// adjust for legend
		if (legendOptions.enabled && !legendOptions.floating) {
			if (align === 'right') { // horizontal alignment handled first
				if (!defined(optionsMarginRight)) {
					marginRight = mathMax(
						marginRight,
						legend.getLegendWidth() - legendX + legendMargin + spacingRight
					);
				}
			} else if (align === 'left') {
				if (!defined(optionsMarginLeft)) {
					plotLeft = mathMax(
						plotLeft,
						legend.getLegendWidth() + legendX + legendMargin + spacingLeft
					);
				}

			} else if (verticalAlign === 'top') {
				if (!defined(optionsMarginTop)) {
					plotTop = mathMax(
						plotTop,
						legend.getLegendHeight() + legendY + legendMargin + spacingTop
					);
				}

			} else if (verticalAlign === 'bottom') {
				if (!defined(optionsMarginBottom)) {
					marginBottom = mathMax(
						marginBottom,
						legend.getLegendHeight() - legendY + legendMargin + spacingBottom
					);
				}
			}
		}

		// adjust for scroller
		if (chart.extraBottomMargin) {
			marginBottom += chart.extraBottomMargin;
		}
		if (chart.extraTopMargin) {
			plotTop += chart.extraTopMargin;
		}

		// pre-render axes to get labels offset width
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.getOffset();
			});
		}

		if (!defined(optionsMarginLeft)) {
			plotLeft += axisOffset[3];
		}
		if (!defined(optionsMarginTop)) {
			plotTop += axisOffset[0];
		}
		if (!defined(optionsMarginBottom)) {
			marginBottom += axisOffset[2];
		}
		if (!defined(optionsMarginRight)) {
			marginRight += axisOffset[1];
		}

		setChartSize();

	};

	/**
	 * Add the event handlers necessary for auto resizing
	 *
	 */
	function initReflow() {
		var reflowTimeout;
		function reflow(e) {
			var width = optionsChart.width || renderTo.offsetWidth,
				height = optionsChart.height || renderTo.offsetHeight,
				target = e.target;
				
			// Width and height checks for display:none. Target is doc in IE8 and Opera,
			// win in Firefox, Chrome and IE9.
			if (width && height && (target === win || target === doc)) {
				
				if (width !== containerWidth || height !== containerHeight) {
					clearTimeout(reflowTimeout);
					reflowTimeout = setTimeout(function () {
						resize(width, height, false);
					}, 100);
				}
				containerWidth = width;
				containerHeight = height;
			}
		}
		addEvent(win, 'resize', reflow);
		addEvent(chart, 'destroy', function () {
			removeEvent(win, 'resize', reflow);
		});
	}

	/**
	 * Fires endResize event on chart instance.
	 */
	function fireEndResize() {
		if (chart) {
			fireEvent(chart, 'endResize', null, function () {
				isResizing -= 1;
			});
		}
	}

	/**
	 * Resize the chart to a given width and height
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object|Boolean} animation
	 */
	resize = function (width, height, animation) {
		var chartTitle = chart.title,
			chartSubtitle = chart.subtitle;

		isResizing += 1;

		// set the animation for the current process
		setAnimation(animation, chart);

		oldChartHeight = chartHeight;
		oldChartWidth = chartWidth;
		if (defined(width)) {
			chart.chartWidth = chartWidth = mathRound(width);
		}
		if (defined(height)) {
			chart.chartHeight = chartHeight = mathRound(height);
		}

		css(container, {
			width: chartWidth + PX,
			height: chartHeight + PX
		});
		renderer.setSize(chartWidth, chartHeight, animation);

		// update axis lengths for more correct tick intervals:
		plotWidth = chartWidth - plotLeft - marginRight;
		plotHeight = chartHeight - plotTop - marginBottom;

		// handle axes
		maxTicks = null;
		each(axes, function (axis) {
			axis.isDirty = true;
			axis.setScale();
		});

		// make sure non-cartesian series are also handled
		each(series, function (serie) {
			serie.isDirty = true;
		});

		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border

		getMargins();

		// move titles
		if (chartTitle) {
			chartTitle.align(null, null, spacingBox);
		}
		if (chartSubtitle) {
			chartSubtitle.align(null, null, spacingBox);
		}

		redraw(animation);


		oldChartHeight = null;
		fireEvent(chart, 'resize');

		// fire endResize and set isResizing back
		// If animation is disabled, fire without delay
		if (globalAnimation === false) {
			fireEndResize();
		} else { // else set a timeout with the animation duration
			setTimeout(fireEndResize, (globalAnimation && globalAnimation.duration) || 500);
		}
	};

	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize = function () {

		chart.plotLeft = plotLeft = mathRound(plotLeft);
		chart.plotTop = plotTop = mathRound(plotTop);
		chart.plotWidth = plotWidth = mathRound(chartWidth - plotLeft - marginRight);
		chart.plotHeight = plotHeight = mathRound(chartHeight - plotTop - marginBottom);

		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;

		spacingBox = {
			x: spacingLeft,
			y: spacingTop,
			width: chartWidth - spacingLeft - spacingRight,
			height: chartHeight - spacingTop - spacingBottom
		};

		each(axes, function (axis) {
			axis.setAxisSize();
			axis.setAxisTranslation();
		});
	};

	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins = function () {
		plotTop = pick(optionsMarginTop, spacingTop);
		marginRight = pick(optionsMarginRight, spacingRight);
		marginBottom = pick(optionsMarginBottom, spacingBottom);
		plotLeft = pick(optionsMarginLeft, spacingLeft);
		axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
	};

	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox = function () {
		var chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			mgn,
			plotSize = {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};

		// Chart area
		mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

		if (chartBorderWidth || chartBackgroundColor) {
			if (!chartBackground) {
				chartBackground = renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn,
						optionsChart.borderRadius, chartBorderWidth)
					.attr({
						stroke: optionsChart.borderColor,
						'stroke-width': chartBorderWidth,
						fill: chartBackgroundColor || NONE
					})
					.add()
					.shadow(optionsChart.shadow);
			} else { // resize
				chartBackground.animate(
					chartBackground.crisp(null, null, null, chartWidth - mgn, chartHeight - mgn)
				);
			}
		}


		// Plot background
		if (plotBackgroundColor) {
			if (!plotBackground) {
				plotBackground = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0)
					.attr({
						fill: plotBackgroundColor
					})
					.add()
					.shadow(optionsChart.plotShadow);
			} else {
				plotBackground.animate(plotSize);
			}
		}
		if (plotBackgroundImage) {
			if (!plotBGImage) {
				plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			} else {
				plotBGImage.animate(plotSize);
			}
		}

		// Plot area border
		if (optionsChart.plotBorderWidth) {
			if (!plotBorder) {
				plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, optionsChart.plotBorderWidth)
					.attr({
						stroke: optionsChart.plotBorderColor,
						'stroke-width': optionsChart.plotBorderWidth,
						zIndex: 4
					})
					.add();
			} else {
				plotBorder.animate(
					plotBorder.crisp(null, plotLeft, plotTop, plotWidth, plotHeight)
				);
			}
		}

		// reset
		chart.isDirtyBox = false;
	};

	/**
	 * Detect whether the chart is inverted, either by setting the chart.inverted option
	 * or adding a bar series to the configuration options
	 */
	function setInverted() {
		var BAR = 'bar',
			isInverted = (
				inverted || // it is set before
				optionsChart.inverted ||
				optionsChart.type === BAR || // default series type
				optionsChart.defaultSeriesType === BAR // backwards compatible
			),
			seriesOptions = options.series,
			i = seriesOptions && seriesOptions.length;

		// check if a bar series is present in the config options
		while (!isInverted && i--) {
			if (seriesOptions[i].type === BAR) {
				isInverted = true;
			}
		}

		// set the chart property and the chart scope variable
		chart.inverted = inverted = isInverted;
	}

	/**
	 * Render all graphics for the chart
	 */
	function render() {
		var labels = options.labels,
			credits = options.credits,
			creditsHref;

		// Title
		setTitle();


		// Legend
		var legendContext = new LegendContext(
			chart,
			renderer,
			function () { return spacingBox; },
			function () { return isResizing; }
		);

		legend = chart.legend = new Legend(legendContext);

		// Get margins by pre-rendering axes
		// set axes scales
		each(axes, function (axis) {
			axis.setScale();
		});
		getMargins();
		each(axes, function (axis) {
			axis.setTickPositions(true); // update to reflect the new margins
		});
		adjustTickAmounts();
		getMargins(); // second pass to check for new labels


		// Draw the borders and backgrounds
		drawChartBox();

		// Axes
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.render();
			});
		}


		// The series
		if (!chart.seriesGroup) {
			chart.seriesGroup = renderer.g('series-group')
				.attr({ zIndex: 3 })
				.add();
		}
		each(series, function (serie) {
			serie.translate();
			serie.setTooltipPoints();
			serie.render();
		});


		// Labels
		if (labels.items) {
			each(labels.items, function () {
				var style = extend(labels.style, this.style),
					x = pInt(style.left) + plotLeft,
					y = pInt(style.top) + plotTop + 12;

				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;

				renderer.text(
					this.html,
					x,
					y
				)
				.attr({ zIndex: 2 })
				.css(style)
				.add();

			});
		}

		// Credits
		if (credits.enabled && !chart.credits) {
			creditsHref = credits.href;
			chart.credits = renderer.text(
				credits.text,
				0,
				0
			)
			.on('click', function () {
				if (creditsHref) {
					location.href = creditsHref;
				}
			})
			.attr({
				align: credits.position.align,
				zIndex: 8
			})
			.css(credits.style)
			.add()
			.align(credits.position);
		}

		// Set flag
		chart.hasRendered = true;

	}

	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i,
			parentNode = container && container.parentNode;

		// If the chart is destroyed already, do nothing.
		// This will happen if if a script invokes chart.destroy and
		// then it will be called again on win.unload
		if (chart === null) {
			return;
		}

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// remove events
		removeEvent(chart);

		// ==== Destroy collections:
		// Destroy axes
		i = axes.length;
		while (i--) {
			axes[i] = axes[i].destroy();
		}

		// Destroy each series
		i = series.length;
		while (i--) {
			series[i] = series[i].destroy();
		}

		// ==== Destroy chart properties:
		each(['title', 'subtitle', 'seriesGroup', 'clipRect', 'credits', 'tracker', 'scroller', 'rangeSelector'], function (name) {
			var prop = chart[name];

			if (prop) {
				chart[name] = prop.destroy();
			}
		});

		// ==== Destroy local variables:
		each([chartBackground, plotBorder, plotBackground, legend, renderer, tracker], function (obj) {
			if (obj && obj.destroy) {
				obj.destroy();
			}
		});
		chartBackground = plotBorder = plotBackground = legend = renderer = tracker = null;

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				discardElement(container);
			}

			// IE6 leak
			container = null;
		}

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

		chart = null;
		options = null;
	}
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function firstRender() {
		// VML namespaces can't be added until after complete. Listening
		// for Perini's doScroll hack is not enough.
		var ONREADYSTATECHANGE = 'onreadystatechange',
		COMPLETE = 'complete';
		// Note: in spite of JSLint's complaints, win == win.top is required
		/*jslint eqeq: true*/
		if ((!hasSVG && (win == win.top && doc.readyState !== COMPLETE)) || (useCanVG && !win.canvg)) {
		/*jslint eqeq: false*/
			if (useCanVG) {
				// Delay rendering until canvg library is downloaded and ready
				CanVGController.push(firstRender, options.global.canvasToolsURL);
			} else {
				doc.attachEvent(ONREADYSTATECHANGE, function () {
					doc.detachEvent(ONREADYSTATECHANGE, firstRender);
					if (doc.readyState === COMPLETE) {
						firstRender();
					}
				});
			}
			return;
		}

		// create the container
		getContainer();

		// Run an early event after the container and renderer are established
		fireEvent(chart, 'init');

		// Initialize range selector for stock charts
		if (Highcharts.RangeSelector && options.rangeSelector.enabled) {
			chart.rangeSelector = new Highcharts.RangeSelector(chart);
		}

		resetMargins();
		setChartSize();

		// Set the common inversion and transformation for inverted series after initSeries
		setInverted();

		// get axes
		getAxes();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			initSeries(serieOptions);
		});

		// Run an event where series and axes can be added
		//fireEvent(chart, 'beforeRender');

		// Initialize scroller for stock charts
		if (Highcharts.Scroller && (options.navigator.enabled || options.scrollbar.enabled)) {
			chart.scroller = new Highcharts.Scroller(chart);
		}

		chart.render = render;

		// depends on inverted and on margins being set
		chart.tracker = tracker = new MouseTracker(mouseTrackerContext, options.tooltip);


		render();

		// add canvas
		renderer.draw();
		// run callbacks
		if (callback) {
			callback.apply(chart, [chart]);
		}
		each(chart.callbacks, function (fn) {
			fn.apply(chart, [chart]);
		});
		
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
		}

		fireEvent(chart, 'load');

	}

	// Run chart

	// Set up auto resize
	if (optionsChart.reflow !== false) {
		addEvent(chart, 'load', initReflow);
	}

	// Chart event handlers
	if (chartEvents) {
		for (eventType in chartEvents) {
			addEvent(chart, eventType, chartEvents[eventType]);
		}
	}


	chart.options = options;
	chart.series = series;


	chart.xAxis = [];
	chart.yAxis = [];




	// Expose methods and variables
	chart.addSeries = addSeries;
	chart.animation = useCanVG ? false : pick(optionsChart.animation, true);
	chart.Axis = Axis;
	chart.destroy = destroy;
	chart.get = get;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.initSeries = initSeries;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.setSize = resize;
	chart.setTitle = setTitle;
	chart.showLoading = showLoading;
	chart.pointCount = 0;
	chart.counters = new ChartCounters();
	/*
	if ($) $(function () {
		$container = $('#container');
		var origChartWidth,
			origChartHeight;
		if ($container) {
			$('<button>+</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
				});
			$('<button>-</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
				});
			$('<button>1:1</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(origChartWidth, origChartHeight);
				});
		}
	})
	*/




	firstRender();


} // end Chart

// Hook for exporting module
Chart.prototype.callbacks = [];
