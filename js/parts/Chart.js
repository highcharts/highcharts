

/**
 * The chart class
 * @param {Object} options
 * @param {Function} callback Function to run when the chart has loaded
 */
function Chart(options, callback) {

	defaultXAxisOptions = merge(defaultXAxisOptions, defaultOptions.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, defaultOptions.yAxis);
	defaultOptions.xAxis = defaultOptions.yAxis = null;

	// Handle regular options
	options = merge(defaultOptions, options);

	// Define chart variables
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
		tooltip,
		mouseIsDown,
		loadingDiv,
		loadingSpan,
		loadingShown,
		plotHeight,
		plotWidth,
		tracker,
		trackerGroup,
		placeTrackerGroup,
		legend,
		legendWidth,
		legendHeight,
		chartPosition,// = getPosition(container),
		hasCartesianSeries = optionsChart.showAxes,
		isResizing = 0,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [],
		inverted,
		renderer,
		tooltipTick,
		tooltipInterval,
		hoverX,
		drawChartBox, // function
		getMargins, // function
		resetMargins, // function
		setChartSize, // function
		resize,
		zoom, // function
		zoomOut; // function


	/**
	 * Create a new axis object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function Axis(chart, options) {

		// Define variables
		var isXAxis = options.isX,
			opposite = options.opposite, // needed in setOptions
			horiz = inverted ? !isXAxis : isXAxis,
			side = horiz ?
				(opposite ? 0 : 2) : // top : bottom
				(opposite ? 1 : 3),  // right : left
			stacks = {};


		options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				[defaultTopAxisOptions, defaultRightAxisOptions,
					defaultBottomAxisOptions, defaultLeftAxisOptions][side],
				options
			);

		var axis = this,
			axisTitle,
			type = options.type,
			isDatetimeAxis = type === 'datetime',
			isLog = type === 'logarithmic',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength,
			transA, // translation factor
			oldTransA, // used for prerendering
			transB = horiz ? plotLeft : marginBottom, // translation addend
			translate, // fn
			getPlotLinePath, // fn
			axisGroup,
			gridGroup,
			axisLine,
			dataMin,
			dataMax,
			associatedSeries,
			userMin,
			userMax,
			max = null,
			min = null,
			oldMin,
			oldMax,
			minPadding = options.minPadding,
			maxPadding = options.maxPadding,
			isLinked = defined(options.linkedTo),
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
			ticks = {},
			minorTicks = {},
			alternateBands = {},
			tickAmount,
			labelOffset,
			axisTitleMargin,// = options.title.margin,
			dateTimeLabelFormat,
			categories = options.categories,
			labelFormatter = options.labels.formatter ||  // can be overwritten by dynamic format
				function () {
					var value = this.value,
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
			tickmarkOffset = (categories && options.tickmarkPlacement === 'between') ? 0.5 : 0;

		/**
		 * The Tick class
		 */
		function Tick(pos, minor) {
			var tick = this;
			tick.pos = pos;
			tick.minor = minor;
			tick.isNew = true;

			if (!minor) {
				tick.addLabel();
			}
		}
		Tick.prototype = {
			/**
			 * Write the tick label
			 */
			addLabel: function () {
				var pos = this.pos,
					labelOptions = options.labels,
					str,
					withLabel = !((pos === min && !pick(options.showFirstLabel, 1)) ||
						(pos === max && !pick(options.showLastLabel, 0))),
					width = (categories && horiz && categories.length &&
						!labelOptions.step && !labelOptions.staggerLines &&
						!labelOptions.rotation &&
						plotWidth / categories.length) ||
						(!horiz && plotWidth / 2),
					css,
					label = this.label;


				// get the string
				str = labelFormatter.call({
						isFirst: pos === tickPositions[0],
						isLast: pos === tickPositions[tickPositions.length - 1],
						dateTimeLabelFormat: dateTimeLabelFormat,
						value: (categories && categories[pos] ? categories[pos] : pos)
					});


				// prepare CSS
				css = width && { width: mathMax(1, mathRound(width - 2 * (labelOptions.padding || 10))) + PX };
				css = extend(css, labelOptions.style);

				// first call
				if (label === UNDEFINED) {
					this.label =
						defined(str) && withLabel && labelOptions.enabled ?
							renderer.text(
									str,
									0,
									0
								)
								.attr({
									align: labelOptions.align,
									rotation: labelOptions.rotation
								})
								// without position absolute, IE export sometimes is wrong
								.css(css)
								.add(axisGroup) :
							null;

				// update
				} else if (label) {
					label.attr({ text: str })
						.css(css);
				}
			},
			/**
			 * Get the offset height or width of the label
			 */
			getLabelSize: function () {
				var label = this.label;
				return label ?
					((this.labelBBox = label.getBBox()))[horiz ? 'height' : 'width'] :
					0;
				},
			/**
			 * Put everything in place
			 *
			 * @param index {Number}
			 * @param old {Boolean} Use old coordinates to prepare an animation into new position
			 */
			render: function (index, old) {
				var tick = this,
					major = !tick.minor,
					label = tick.label,
					pos = tick.pos,
					labelOptions = options.labels,
					gridLine = tick.gridLine,
					gridLineWidth = major ? options.gridLineWidth : options.minorGridLineWidth,
					gridLineColor = major ? options.gridLineColor : options.minorGridLineColor,
					dashStyle = major ?
						options.gridLineDashStyle :
						options.minorGridLineDashStyle,
					gridLinePath,
					mark = tick.mark,
					markPath,
					tickLength = major ? options.tickLength : options.minorTickLength,
					tickWidth = major ? options.tickWidth : (options.minorTickWidth || 0),
					tickColor = major ? options.tickColor : options.minorTickColor,
					tickPosition = major ? options.tickPosition : options.minorTickPosition,
					step = labelOptions.step,
					cHeight = (old && oldChartHeight) || chartHeight,
					attribs,
					x,
					y;

				// get x and y position for ticks and labels
				x = horiz ?
					translate(pos + tickmarkOffset, null, null, old) + transB :
					plotLeft + offset + (opposite ? ((old && oldChartWidth) || chartWidth) - marginRight - plotLeft : 0);

				y = horiz ?
					cHeight - marginBottom + offset - (opposite ? plotHeight : 0) :
					cHeight - translate(pos + tickmarkOffset, null, null, old) - transB;

				// create the grid line
				if (gridLineWidth) {
					gridLinePath = getPlotLinePath(pos + tickmarkOffset, gridLineWidth, old);

					if (gridLine === UNDEFINED) {
						attribs = {
							stroke: gridLineColor,
							'stroke-width': gridLineWidth
						};
						if (dashStyle) {
							attribs.dashstyle = dashStyle;
						}
						tick.gridLine = gridLine =
							gridLineWidth ?
								renderer.path(gridLinePath)
									.attr(attribs).add(gridGroup) :
								null;
					}
					if (gridLine && gridLinePath) {
						gridLine.animate({
							d: gridLinePath
						});
					}
				}

				// create the tick mark
				if (tickWidth) {

					// negate the length
					if (tickPosition === 'inside') {
						tickLength = -tickLength;
					}
					if (opposite) {
						tickLength = -tickLength;
					}

					markPath = renderer.crispLine([
						M,
						x,
						y,
						L,
						x + (horiz ? 0 : -tickLength),
						y + (horiz ? tickLength : 0)
					], tickWidth);

					if (mark) { // updating
						mark.animate({
							d: markPath
						});
					} else { // first time
						tick.mark = renderer.path(
							markPath
						).attr({
							stroke: tickColor,
							'stroke-width': tickWidth
						}).add(axisGroup);
					}
				}

				// the label is created on init - now move it into place
				if (label && !isNaN(x)) {
					x = x + labelOptions.x - (tickmarkOffset && horiz ?
						tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
					y = y + labelOptions.y - (tickmarkOffset && !horiz ?
						tickmarkOffset * transA * (reversed ? 1 : -1) : 0);

					// vertically centered
					if (!defined(labelOptions.y)) {
						y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
					}


					// correct for staggered labels
					if (staggerLines) {
						y += (index / (step || 1) % staggerLines) * 16;
					}
					// apply step
					if (step) {
						// show those indices dividable by step
						label[index % step ? 'hide' : 'show']();
					}

					label[tick.isNew ? 'attr' : 'animate']({
						x: x,
						y: y
					});
				}

				tick.isNew = false;
			},
			/**
			 * Destructor for the tick prototype
			 */
			destroy: function () {
				var tick = this,
					n;
				for (n in tick) {
					if (tick[n] && tick[n].destroy) {
						tick[n].destroy();
					}
				}
			}
		};

		/**
		 * The object wrapper for plot lines and plot bands
		 * @param {Object} options
		 */
		function PlotLineOrBand(options) {
			var plotLine = this;
			if (options) {
				plotLine.options = options;
				plotLine.id = options.id;
			}

			//plotLine.render()
			return plotLine;
		}

		PlotLineOrBand.prototype = {

		/**
		 * Render the plot line or plot band. If it is already existing,
		 * move it.
		 */
		render: function () {
			var plotLine = this,
				options = plotLine.options,
				optionsLabel = options.label,
				label = plotLine.label,
				width = options.width,
				to = options.to,
				toPath, // bands only
				from = options.from,
				dashStyle = options.dashStyle,
				svgElem = plotLine.svgElem,
				path = [],
				addEvent,
				eventType,
				xs,
				ys,
				x,
				y,
				color = options.color,
				zIndex = options.zIndex,
				events = options.events,
				attribs;

			// plot line
			if (width) {
				path = getPlotLinePath(options.value, width);
				attribs = {
					stroke: color,
					'stroke-width': width
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}
			} else if (defined(from) && defined(to)) { // plot band
				// keep within plot area
				from = mathMax(from, min);
				to = mathMin(to, max);

				toPath = getPlotLinePath(to);
				path = getPlotLinePath(from);
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
				attribs = {
					fill: color
				};
			} else {
				return;
			}
			// zIndex
			if (defined(zIndex)) {
				attribs.zIndex = zIndex;
			}

			// common for lines and bands
			if (svgElem) {
				if (path) {
					svgElem.animate({
						d: path
					}, null, svgElem.onGetPath);
				} else {
					svgElem.hide();
					svgElem.onGetPath = function () {
						svgElem.show();
					};
				}
			} else if (path && path.length) {
				plotLine.svgElem = svgElem = renderer.path(path)
					.attr(attribs).add();

				// events
				if (events) {
					addEvent = function (eventType) {
						svgElem.on(eventType, function (e) {
							events[eventType].apply(plotLine, [e]);
						});
					};
					for (eventType in events) {
						addEvent(eventType);
					}
				}
			}

			// the plot band/line label
			if (optionsLabel && defined(optionsLabel.text) && path && path.length && plotWidth > 0 && plotHeight > 0) {
				// apply defaults
				optionsLabel = merge({
					align: horiz && toPath && 'center',
					x: horiz ? !toPath && 4 : 10,
					verticalAlign : !horiz && toPath && 'middle',
					y: horiz ? toPath ? 16 : 10 : toPath ? 6 : -4,
					rotation: horiz && !toPath && 90
				}, optionsLabel);

				// add the SVG element
				if (!label) {
					plotLine.label = label = renderer.text(
							optionsLabel.text,
							0,
							0
						)
						.attr({
							align: optionsLabel.textAlign || optionsLabel.align,
							rotation: optionsLabel.rotation,
							zIndex: zIndex
						})
						.css(optionsLabel.style)
						.add();
				}

				// get the bounding box and align the label
				xs = [path[1], path[4], pick(path[6], path[1])];
				ys = [path[2], path[5], pick(path[7], path[2])];
				x = mathMin.apply(math, xs);
				y = mathMin.apply(math, ys);

				label.align(optionsLabel, false, {
					x: x,
					y: y,
					width: mathMax.apply(math, xs) - x,
					height: mathMax.apply(math, ys) - y
				});
				label.show();

			} else if (label) { // move out of sight
				label.hide();
			}

			// chainable
			return plotLine;
		},

		/**
		 * Remove the plot line or band
		 */
		destroy: function () {
			var obj = this,
				n;

			for (n in obj) {
				if (obj[n] && obj[n].destroy) {
					obj[n].destroy(); // destroy SVG wrappers
				}
				delete obj[n];
			}
			// remove it from the lookup
			erase(plotLinesAndBands, obj);
		}
		};

		/**
		 * The class for stack items
		 */
		function StackItem(options, isNegative, x) {
			var stackItem = this;

			// Tells if the stack is negative
			stackItem.isNegative = isNegative;

			// Save the options to be able to style the label
			stackItem.options = options;

			// Save the x value to be able to position the label later
			stackItem.x = x;

			// The align options and text align varies on whether the stack is negative and
			// if the chart is inverted or not.
			// First test the user supplied value, then use the dynamic.
			stackItem.alignOptions = {
				align: options.align || (inverted ? (isNegative ? 'left' : 'right') : 'center'),
				verticalAlign: options.verticalAlign || (inverted ? 'middle' : (isNegative ? 'bottom' : 'top')),
				y: pick(options.y, inverted ? 4 : (isNegative ? 14 : -6)),
				x: pick(options.x, inverted ? (isNegative ? -6 : 6) : 0)
			};

			stackItem.textAlign = options.textAlign || (inverted ? (isNegative ? 'right' : 'left') : 'center');
		}

		StackItem.prototype = {
			/**
			 * Sets the total of this stack. Should be called when a serie is hidden or shown
			 * since that will affect the total of other stacks.
			 */
			setTotal: function (total) {
				this.total = total;
				this.cum = total;
			},

			/**
			 * Renders the stack total label and adds it to the stack label group.
			 */
			render: function (group) {
				var stackItem = this,									// aliased this
					str = stackItem.options.formatter.call(stackItem);	// format the text in the label

				// Change the text to reflect the new total and set visibility to hidden in case the serie is hidden
				if (stackItem.label) {
					stackItem.label.attr({text: str, visibility: HIDDEN});
				// Create new label
				} else {
					stackItem.label =
						chart.renderer.text(str, 0, 0)				// dummy positions, actual position updated with setOffset method in columnseries
							.css(stackItem.options.style)			// apply style
							.attr({align: stackItem.textAlign,			// fix the text-anchor
								rotation: stackItem.options.rotation,	// rotation
								visibility: HIDDEN })					// hidden until setOffset is called
							.add(group);							// add to the labels-group
				}
			},

			/**
			 * Sets the offset that the stack has from the x value and repositions the label.
			 */
			setOffset: function (xOffset, xWidth) {
				var stackItem = this,										// aliased this
					neg = stackItem.isNegative,								// special treatment is needed for negative stacks
					y = axis.translate(stackItem.total),					// stack value translated mapped to chart coordinates
					yZero = axis.translate(0),								// stack origin
					h = mathAbs(y - yZero),									// stack height
					x = chart.xAxis[0].translate(stackItem.x) + xOffset,	// stack x position
					plotHeight = chart.plotHeight,
					stackBox = {	// this is the box for the complete stack
							x: inverted ? (neg ? y : y - h) : x,
							y: inverted ? plotHeight - x - xWidth : (neg ? (plotHeight - y - h) : plotHeight - y),
							width: inverted ? h : xWidth,
							height: inverted ? xWidth : h
					};

				if (stackItem.label) {
					stackItem.label
						.align(stackItem.alignOptions, null, stackBox)	// align the label to the box
						.attr({visibility: VISIBLE});					// set visibility
				}
			}
		};

		/**
		 * Get the minimum and maximum for the series of each axis
		 */
		function getSeriesExtremes() {
			var posStack = [],
				negStack = [],
				run;

			// reset dataMin and dataMax in case we're redrawing
			dataMin = dataMax = null;

			// get an overview of what series are associated with this axis
			associatedSeries = [];

			each(series, function (serie) {
				run = false;


				// match this axis against the series' given or implicated axis
				each(['xAxis', 'yAxis'], function (strAxis) {
					if (
						// the series is a cartesian type, and...
						serie.isCartesian &&
						// we're in the right x or y dimension, and...
						((strAxis === 'xAxis' && isXAxis) || (strAxis === 'yAxis' && !isXAxis)) && (
							// the axis number is given in the options and matches this axis index, or
							(serie.options[strAxis] === options.index) ||
							// the axis index is not given
							(serie.options[strAxis] === UNDEFINED && options.index === 0)
						)
					) {
						serie[strAxis] = axis;
						associatedSeries.push(serie);

						// the series is visible, run the min/max detection
						run = true;
					}
				});
				// ignore hidden series if opted
				if (!serie.visible && optionsChart.ignoreHiddenSeries) {
					run = false;
				}

				if (run) {

					var stacking,
						posPointStack,
						negPointStack,
						stackKey,
						negKey;

					if (!isXAxis) {
						stacking = serie.options.stacking;
						usePercentage = stacking === 'percent';

						// create a stack for this particular series type
						if (stacking) {
							stackKey = serie.type + pick(serie.options.stack, '');
							negKey = '-' + stackKey;
							serie.stackKey = stackKey; // used in translate

							posPointStack = posStack[stackKey] || []; // contains the total values for each x
							posStack[stackKey] = posPointStack;

							negPointStack = negStack[negKey] || [];
							negStack[negKey] = negPointStack;
						}
						if (usePercentage) {
							dataMin = 0;
							dataMax = 99;
						}
					}
					if (serie.isCartesian) { // line, column etc. need axes, pie doesn't
						each(serie.data, function (point, i) {
							var pointX = point.x,
								pointY = point.y,
								isNegative = pointY < 0,
								pointStack = isNegative ? negPointStack : posPointStack,
								key = isNegative ? negKey : stackKey,
								totalPos,
								pointLow;

							// initial values
							if (dataMin === null) {

								// start out with the first point
								dataMin = dataMax = point[xOrY];
							}

							// x axis
							if (isXAxis) {
								if (pointX > dataMax) {
									dataMax = pointX;
								} else if (pointX < dataMin) {
									dataMin = pointX;
								}
							} else if (defined(pointY)) { // y axis
								if (stacking) {
									pointStack[pointX] =
										defined(pointStack[pointX]) ?
										pointStack[pointX] + pointY : pointY;
								}
								totalPos = pointStack ? pointStack[pointX] : pointY;
								pointLow = pick(point.low, totalPos);
								if (!usePercentage) {
									if (totalPos > dataMax) {
										dataMax = totalPos;
									} else if (pointLow < dataMin) {
										dataMin = pointLow;
									}
								}
								if (stacking) {
									// add the series
									if (!stacks[key]) {
										stacks[key] = {};
									}

									// If the StackItem is there, just update the values,
									// if not, create one first
									if (!stacks[key][pointX]) {
										stacks[key][pointX] = new StackItem(options.stackLabels, isNegative, pointX);
									}
									stacks[key][pointX].setTotal(totalPos);
								}
							}
						});


						// For column, areas and bars, set the minimum automatically to zero
						// and prevent that minPadding is added in setScale
						if (/(area|column|bar)/.test(serie.type) && !isXAxis) {
							var threshold = 0; // use series.options.threshold?
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
				returnValue;

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
				if (isLog && handleLog) {
					returnValue = lin2log(returnValue);
				}

			} else { // normal translation
				if (isLog && handleLog) {
					val = log2lin(val);
				}
				returnValue = sign * (val - localMin) * localA + cvsOffset; // from value to chart pixel
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
				y1 = plotTop;
				y2 = cHeight - marginBottom;
				if (x1 < plotLeft || x1 > plotLeft + plotWidth) {
					skip = true;
				}
			} else {
				x1 = plotLeft;
				x2 = cWidth - marginRight;
				if (y1 < plotTop || y1 > plotTop + plotHeight) {
					skip = true;
				}
			}
			return skip ?
				null :
				renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
		};


		/**
		 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
		 * @param {Number} interval
		 */
		function normalizeTickInterval(interval, multiples) {
			var normalized, i;

			// round to a tenfold of 1, 2, 2.5 or 5
			magnitude = multiples ? 1 : math.pow(10, mathFloor(math.log(interval) / math.LN10));
			normalized = interval / magnitude;

			// multiples for a linear scale
			if (!multiples) {
				multiples = [1, 2, 2.5, 5, 10];
				//multiples = [1, 2, 2.5, 4, 5, 7.5, 10];

				// the allowDecimals option
				if (options.allowDecimals === false || isLog) {
					if (magnitude === 1) {
						multiples = [1, 2, 5, 10];
					} else if (magnitude <= 0.1) {
						multiples = [1 / magnitude];
					}
				}
			}

			// normalize the interval to the nearest multiple
			for (i = 0; i < multiples.length; i++) {
				interval = multiples[i];
				if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
					break;
				}
			}

			// multiply back to the correct magnitude
			interval *= magnitude;

			return interval;
		}

		/**
		 * Set the tick positions to a time unit that makes sense, for example
		 * on the first of each month or on every Monday.
		 */
		function setDateTimeTickPositions() {
			tickPositions = [];
			var i,
				useUTC = defaultOptions.global.useUTC,
				oneSecond = 1000 / timeFactor,
				oneMinute = 60000 / timeFactor,
				oneHour = 3600000 / timeFactor,
				oneDay = 24 * 3600000 / timeFactor,
				oneWeek = 7 * 24 * 3600000 / timeFactor,
				oneMonth = 30 * 24 * 3600000 / timeFactor,
				oneYear = 31556952000 / timeFactor,

				units = [[
					'second',						// unit name
					oneSecond,						// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'minute',						// unit name
					oneMinute,						// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'hour',							// unit name
					oneHour,						// fixed incremental unit
					[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
				], [
					'day',							// unit name
					oneDay,							// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'week',							// unit name
					oneWeek,						// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'month',
					oneMonth,
					[1, 2, 3, 4, 6]
				], [
					'year',
					oneYear,
					null
				]],

				unit = units[6], // default unit is years
				interval = unit[1],
				multiples = unit[2];

			// loop through the units to find the one that best fits the tickInterval
			for (i = 0; i < units.length; i++) {
				unit = units[i];
				interval = unit[1];
				multiples = unit[2];


				if (units[i + 1]) {
					// lessThan is in the middle between the highest multiple and the next unit.
					var lessThan = (interval * multiples[multiples.length - 1] +
								units[i + 1][1]) / 2;

					// break and keep the current unit
					if (tickInterval <= lessThan) {
						break;
					}
				}
			}

			// prevent 2.5 years intervals, though 25, 250 etc. are allowed
			if (interval === oneYear && tickInterval < 5 * interval) {
				multiples = [1, 2, 5];
			}

			// get the minimum value by flooring the date
			var multitude = normalizeTickInterval(tickInterval / interval, multiples),
				minYear, // used in months and years as a basis for Date.UTC()
				minDate = new Date(min * timeFactor);

			minDate.setMilliseconds(0);

			if (interval >= oneSecond) { // second
				minDate.setSeconds(interval >= oneMinute ? 0 :
					multitude * mathFloor(minDate.getSeconds() / multitude));
			}

			if (interval >= oneMinute) { // minute
				minDate[setMinutes](interval >= oneHour ? 0 :
					multitude * mathFloor(minDate[getMinutes]() / multitude));
			}

			if (interval >= oneHour) { // hour
				minDate[setHours](interval >= oneDay ? 0 :
					multitude * mathFloor(minDate[getHours]() / multitude));
			}

			if (interval >= oneDay) { // day
				minDate[setDate](interval >= oneMonth ? 1 :
					multitude * mathFloor(minDate[getDate]() / multitude));
			}

			if (interval >= oneMonth) { // month
				minDate[setMonth](interval >= oneYear ? 0 :
					multitude * mathFloor(minDate[getMonth]() / multitude));
				minYear = minDate[getFullYear]();
			}

			if (interval >= oneYear) { // year
				minYear -= minYear % multitude;
				minDate[setFullYear](minYear);
			}

			// week is a special case that runs outside the hierarchy
			if (interval === oneWeek) {
				// get start of current week, independent of multitude
				minDate[setDate](minDate[getDate]() - minDate[getDay]() +
					options.startOfWeek);
			}


			// get tick positions
			i = 1; // prevent crash just in case
			minYear = minDate[getFullYear]();
			var time = minDate.getTime() / timeFactor,
				minMonth = minDate[getMonth](),
				minDateDate = minDate[getDate]();

			// iterate and add tick positions at appropriate values
			while (time < max && i < plotWidth) {
				tickPositions.push(time);

				// if the interval is years, use Date.UTC to increase years
				if (interval === oneYear) {
					time = makeTime(minYear + i * multitude, 0) / timeFactor;

				// if the interval is months, use Date.UTC to increase months
				} else if (interval === oneMonth) {
					time = makeTime(minYear, minMonth + i * multitude) / timeFactor;

				// if we're using global time, the interval is not fixed as it jumps
				// one hour at the DST crossover
				} else if (!useUTC && (interval === oneDay || interval === oneWeek)) {
					time = makeTime(minYear, minMonth, minDateDate +
						i * multitude * (interval === oneDay ? 1 : 7));

				// else, the interval is fixed and we use simple addition
				} else {
					time += interval * multitude;
				}

				i++;
			}
			// push the last time
			tickPositions.push(time);


			// dynamic label formatter
			dateTimeLabelFormat = options.dateTimeLabelFormats[unit[0]];
		}

		/**
		 * Fix JS round off float errors
		 * @param {Number} num
		 */
		function correctFloat(num) {
			var invMag, ret = num;
			magnitude = pick(magnitude, math.pow(10, mathFloor(math.log(tickInterval) / math.LN10)));

			if (magnitude < 1) {
				invMag = mathRound(1 / magnitude)  * 10;
				ret = mathRound(num * invMag) / invMag;
			}
			return ret;
		}

		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function setLinearTickPositions() {

			var i,
				roundedMin = correctFloat(mathFloor(min / tickInterval) * tickInterval),
				roundedMax = correctFloat(mathCeil(max / tickInterval) * tickInterval);

			tickPositions = [];

			// populate the intermediate values
			i = correctFloat(roundedMin);
			while (i <= roundedMax) {
				tickPositions.push(i);
				i = correctFloat(i + tickInterval);
			}

		}

		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions(secondPass) {
			var length,
				catPad,
				linkedParent,
				linkedParentExtremes,
				tickIntervalOption = options.tickInterval,
				tickPixelIntervalOption = options.tickPixelInterval,
				maxZoom = options.maxZoom || (
					isXAxis && !defined(options.min) && !defined(options.max) ?
						mathMin(chart.smallestInterval * 5, dataMax - dataMin) :
						null
				),
				zoomOffset;


			axisLength = horiz ? plotWidth : plotHeight;

			// linked axis gets the extremes from the parent axis
			if (isLinked) {
				linkedParent = chart[isXAxis ? 'xAxis' : 'yAxis'][options.linkedTo];
				linkedParentExtremes = linkedParent.getExtremes();
				min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
				max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
			} else { // initial min and max from the extreme data values
				min = pick(userMin, options.min, dataMin);
				max = pick(userMax, options.max, dataMax);
			}

			if (isLog) {
				min = log2lin(min);
				max = log2lin(max);
			}

			// maxZoom exceeded, just center the selection
			if (max - min < maxZoom) {
				zoomOffset = (maxZoom - max + min) / 2;
				// if min and max options have been set, don't go beyond it
				min = mathMax(min - zoomOffset, pick(options.min, min - zoomOffset), dataMin);
				max = mathMin(min + maxZoom, pick(options.max, min + maxZoom), dataMax);
			}

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
			if (min === max) {
				tickInterval = 1;
			} else if (isLinked && !tickIntervalOption &&
					tickPixelIntervalOption === linkedParent.options.tickPixelInterval) {
				tickInterval = linkedParent.tickInterval;
			} else {
				tickInterval = pick(
					tickIntervalOption,
					categories ? // for categoried axis, 1 is default, for linear axis use tickPix
						1 :
						(max - min) * tickPixelIntervalOption / axisLength
				);
			}

			if (!isDatetimeAxis && !defined(options.tickInterval)) { // linear
				tickInterval = normalizeTickInterval(tickInterval);
			}
			axis.tickInterval = tickInterval; // record for linked axis

			// get minorTickInterval
			minorTickInterval = options.minorTickInterval === 'auto' && tickInterval ?
					tickInterval / 5 : options.minorTickInterval;

			// find the tick positions
			if (isDatetimeAxis) {
				setDateTimeTickPositions();
			} else {
				setLinearTickPositions();
			}

			if (!isLinked) {
				// pad categorised axis to nearest half unit
				if (categories || (isXAxis && chart.hasColumn)) {
					catPad = (categories ? 1 : tickInterval) * 0.5;
					if (categories || !defined(pick(options.min, userMin))) {
						min -= catPad;
					}
					if (categories || !defined(pick(options.max, userMax))) {
						max += catPad;
					}
				}

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

				if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY]) {
					maxTicks[xOrY] = tickPositions.length;
				}
			}


		}

		/**
		 * When using multiple axes, adjust the number of ticks to match the highest
		 * number of ticks in that group
		 */
		function adjustTickAmount() {

			if (maxTicks && !isDatetimeAxis && !categories && !isLinked) { // only apply to linear scale
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
				i;

			oldMin = min;
			oldMax = max;

			// get data extremes if needed
			getSeriesExtremes();

			// get fixed positions based on tickInterval
			setTickPositions();

			// the translation factor used in translate function
			oldTransA = transA;
			transA = axisLength / ((max - min) || 1);

			// reset stacks
			if (!isXAxis) {
				for (type in stacks) {
					for (i in stacks[type]) {
						stacks[type][i].cum = stacks[type][i].total;
					}
				}
			}

			// mark as dirty if it is not already set to dirty and extremes have changed
			if (!axis.isDirty) {
				axis.isDirty = (min !== oldMin || max !== oldMax);
			}

		}

		/**
		 * Set the extremes and optionally redraw
		 * @param {Number} newMin
		 * @param {Number} newMax
		 * @param {Boolean} redraw
		 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
		 *    configuration
		 *
		 */
		function setExtremes(newMin, newMax, redraw, animation) {

			redraw = pick(redraw, true); // defaults to true

			fireEvent(axis, 'setExtremes', { // fire an event to enable syncing of multiple charts
				min: newMin,
				max: newMax
			}, function () { // the default event handler

				userMin = newMin;
				userMax = newMax;


				// redraw
				if (redraw) {
					chart.redraw(animation);
				}
			});

		}

		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: min,
				max: max,
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
			if (min > threshold) {
				threshold = min;
			} else if (max < threshold) {
				threshold = max;
			}

			return translate(threshold, 0, 1);
		}

		/**
		 * Add a plot band or plot line after render time
		 *
		 * @param options {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(options) {
			var obj = new PlotLineOrBand(options).render();
			plotLinesAndBands.push(obj);
			return obj;
		}

		/**
		 * Render the tick labels to a preliminary position to get their sizes
		 */
		function getOffset() {

			var hasData = associatedSeries.length && defined(min) && defined(max),
				titleOffset = 0,
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
					.attr({ zIndex: 1 })
					.add();
			}

			labelOffset = 0; // reset

			if (hasData || isLinked) {
				each(tickPositions, function (pos) {
					if (!ticks[pos]) {
						ticks[pos] = new Tick(pos);
					} else {
						ticks[pos].addLabel(); // update labels depending on tick interval
					}

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
						0
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

				titleOffset = axisTitle.getBBox()[horiz ? 'height' : 'width'];
				titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);

			}

			// handle automatic or user set offset
			offset = directionFactor * (options.offset || axisOffset[side]);

			axisTitleMargin =
				labelOffset +
				(side !== 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x']) +
				titleMargin;

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
				hasData = associatedSeries.length && defined(min) && defined(max);

			// update metrics
			axisLength = horiz ? plotWidth : plotHeight;
			transA = axisLength / ((max - min) || 1);
			transB = horiz ? plotLeft : marginBottom; // translation addend

			// If the series has data draw the ticks. Else only the line and title
			if (hasData || isLinked) {

				// minor ticks
				if (minorTickInterval && !categories) {
					var pos = min + (tickPositions[0] - min) % minorTickInterval;
					for (; pos <= max; pos += minorTickInterval) {
						if (!minorTicks[pos]) {
							minorTicks[pos] = new Tick(pos, true);
						}

						// render new ticks in old position
						if (slideInTicks && minorTicks[pos].isNew) {
							minorTicks[pos].render(null, true);
						}


						minorTicks[pos].isActive = true;
						minorTicks[pos].render();
					}
				}

				// major ticks
				each(tickPositions, function (pos, i) {
					// linked axes need an extra check to find out if
					if (!isLinked || (pos >= min && pos <= max)) {

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
							/*plotLinesAndBands.push(new PlotLineOrBand({
								from: pos,
								to: tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max,
								color: alternateGridColor
							}));*/

							if (!alternateBands[pos]) {
								alternateBands[pos] = new PlotLineOrBand();
							}
							alternateBands[pos].options = {
								from: pos,
								to: tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max,
								color: alternateGridColor
							};
							alternateBands[pos].render();
							alternateBands[pos].isActive = true;
						}
					});
				}

				// custom plot bands (behind grid lines)
				/*if (!hasRendered) { // only first time
					each(options.plotBands || [], function(plotBandOptions) {
						plotLinesAndBands.push(new PlotLineOrBand(
							extend({ zIndex: 1 }, plotBandOptions)
						).render());
					});
				}*/




				// custom plot lines and bands
				if (!hasRendered) { // only first time
					each((options.plotLines || []).concat(options.plotBands || []), function (plotLineOptions) {
						plotLinesAndBands.push(new PlotLineOrBand(plotLineOptions).render());
					});
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
				lineLeft = plotLeft + (opposite ? plotWidth : 0) + offset;
				lineTop = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;

				linePath = renderer.crispLine([
						M,
						horiz ?
							plotLeft :
							lineLeft,
						horiz ?
							lineTop :
							plotTop,
						L,
						horiz ?
							chartWidth - marginRight :
							lineLeft,
						horiz ?
							lineTop :
							chartHeight - marginBottom
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

			}

			if (axisTitle) {
				// compute anchor points for each of the title align options
				var margin = horiz ? plotLeft : plotTop,
					fontSize = pInt(axisTitleOptions.style.fontSize || 12),
				// the position in the length direction of the axis
				alongAxis = {
					low: margin + (horiz ? 0 : axisLength),
					middle: margin + axisLength / 2,
					high: margin + (horiz ? axisLength : 0)
				}[axisTitleOptions.align],

				// the position in the perpendicular direction of the axis
				offAxis = (horiz ? plotTop + plotHeight : plotLeft) +
					(horiz ? 1 : -1) * // horizontal axis reverses the margin
					(opposite ? -1 : 1) * // so does opposite axes
					axisTitleMargin +
					//(isIE ? fontSize / 3 : 0)+ // preliminary fix for vml's centerline
					(side === 2 ? fontSize : 0);

				axisTitle[axisTitle.isNew ? 'attr' : 'animate']({
					x: horiz ?
						alongAxis :
						offAxis + (opposite ? plotWidth : 0) + offset +
							(axisTitleOptions.x || 0), // x
					y: horiz ?
						offAxis - (opposite ? plotHeight : 0) + offset :
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
			each(associatedSeries, function (series) {
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
				axis.categories = categories = newCategories;

				// force reindexing tooltips
				each(associatedSeries, function (series) {
					series.translate();
					series.setTooltipPoints(true);
				});


				// optionally redraw
				axis.isDirty = true;

				if (pick(doRedraw, true)) {
					chart.redraw();
				}
		}



		// Run Axis

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
			setCategories: setCategories,
			setExtremes: setExtremes,
			setScale: setScale,
			setTickPositions: setTickPositions,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			reversed: reversed,
			stacks: stacks
		});

		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}

		// set min and max
		setScale();

	} // end Axis


	/**
	 * The toolbar object
	 *
	 * @param {Object} chart
	 */
	function Toolbar(chart) {
		var buttons = {};

		function add(id, text, title, fn) {
			if (!buttons[id]) {
				var button = renderer.text(
					text,
					0,
					0
				)
				.css(options.toolbar.itemStyle)
				.align({
					align: 'right',
					x: -marginRight - 20,
					y: plotTop + 30
				})
				.on('click', fn)
				/*.on('touchstart', function(e) {
					e.stopPropagation(); // don't fire the container event
					fn();
				})*/
				.attr({
					align: 'right',
					zIndex: 20
				})
				.add();
				buttons[id] = button;
			}
		}
		function remove(id) {
			discardElement(buttons[id].element);
			buttons[id] = null;
		}

		// public
		return {
			add: add,
			remove: remove
		};
	}

	/**
	 * The tooltip object
	 * @param {Object} options Tooltip options
	 */
	function Tooltip(options) {
		var currentSeries,
			borderWidth = options.borderWidth,
			crosshairsOptions = options.crosshairs,
			crosshairs = [],
			style = options.style,
			shared = options.shared,
			padding = pInt(style.padding),
			boxOffLeft = borderWidth + padding, // off left/top position as IE can't
				//properly handle negative positioned shapes
			tooltipIsHidden = true,
			boxWidth,
			boxHeight,
			currentX = 0,
			currentY = 0;

		// remove padding CSS and apply padding on box instead
		style.padding = 0;

		// create the elements
		var group = renderer.g('tooltip')
			.attr({	zIndex: 8 })
			.add(),

			box = renderer.rect(boxOffLeft, boxOffLeft, 0, 0, options.borderRadius, borderWidth)
				.attr({
					fill: options.backgroundColor,
					'stroke-width': borderWidth
				})
				.add(group)
				.shadow(options.shadow),
			label = renderer.text('', padding + boxOffLeft, pInt(style.fontSize) + padding + boxOffLeft)
				.attr({ zIndex: 1 })
				.css(style)
				.add(group);

		group.hide();

		/**
		 * In case no user defined formatter is given, this will be used
		 */
		function defaultFormatter() {
			var pThis = this,
				items = pThis.points || splat(pThis),
				xAxis = items[0].series.xAxis,
				x = pThis.x,
				isDateTime = xAxis && xAxis.options.type === 'datetime',
				useHeader = isString(x) || isDateTime,
				series,
				s;

			// build the header
			s = useHeader ?
				['<span style="font-size: 10px">' +
				(isDateTime ? dateFormat('%A, %b %e, %Y', x) :  x) +
				'</span>'] : [];

			// build the values
			each(items, function (item) {
				s.push(item.point.tooltipFormatter(useHeader));
			});
			return s.join('<br/>');
		}

		/**
		 * Provide a soft movement for the tooltip
		 *
		 * @param {Number} finalX
		 * @param {Number} finalY
		 */
		function move(finalX, finalY) {

			currentX = tooltipIsHidden ? finalX : (2 * currentX + finalX) / 3;
			currentY = tooltipIsHidden ? finalY : (currentY + finalY) / 2;

			group.translate(currentX, currentY);


			// run on next tick of the mouse tracker
			if (mathAbs(finalX - currentX) > 1 || mathAbs(finalY - currentY) > 1) {
				tooltipTick = function () {
					move(finalX, finalY);
				};
			} else {
				tooltipTick = null;
			}
		}

		/**
		 * Hide the tooltip
		 */
		function hide() {
			if (!tooltipIsHidden) {
				var hoverPoints = chart.hoverPoints;

				group.hide();

				each(crosshairs, function (crosshair) {
					if (crosshair) {
						crosshair.hide();
					}
				});

				// hide previous hoverPoints and set new
				if (hoverPoints) {
					each(hoverPoints, function (point) {
						point.setState();
					});
				}
				chart.hoverPoints = null;


				tooltipIsHidden = true;
			}

		}

		/**
		 * Refresh the tooltip's text and position.
		 * @param {Object} point
		 *
		 */
		function refresh(point) {
			var x,
				y,
				boxX,
				boxY,
				show,
				bBox,
				plotX,
				plotY = 0,
				textConfig = {},
				text,
				pointConfig = [],
				tooltipPos = point.tooltipPos,
				formatter = options.formatter || defaultFormatter,
				hoverPoints = chart.hoverPoints,
				placedTooltipPoint;

			// shared tooltip, array is sent over
			if (shared) {

				// hide previous hoverPoints and set new
				if (hoverPoints) {
					each(hoverPoints, function (point) {
						point.setState();
					});
				}
				chart.hoverPoints = point;

				each(point, function (item, i) {
					/*var series = item.series,
						hoverPoint = series.hoverPoint;
					if (hoverPoint) {
						hoverPoint.setState();
					}
					series.hoverPoint = item;*/
					item.setState(HOVER_STATE);
					plotY += item.plotY; // for average

					pointConfig.push(item.getLabelConfig());
				});

				plotX = point[0].plotX;
				plotY = mathRound(plotY) / point.length; // mathRound because Opera 10 has problems here

				textConfig = {
					x: point[0].category
				};
				textConfig.points = pointConfig;
				point = point[0];

			// single point tooltip
			} else {
				textConfig = point.getLabelConfig();
			}
			text = formatter.call(textConfig);

			// register the current series
			currentSeries = point.series;

			// get the reference point coordinates (pie charts use tooltipPos)
			plotX = shared ? plotX : point.plotX;
			plotY = shared ? plotY : point.plotY;
			x = mathRound(tooltipPos ? tooltipPos[0] : (inverted ? plotWidth - plotY : plotX));
			y = mathRound(tooltipPos ? tooltipPos[1] : (inverted ? plotHeight - plotX : plotY));


			// hide tooltip if the point falls outside the plot
			show = shared || !point.series.isCartesian || isInsidePlot(x, y);

			// update the inner HTML
			if (text === false || !show) {
				hide();
			} else {

				// show it
				if (tooltipIsHidden) {
					group.show();
					tooltipIsHidden = false;
				}

				// update text
				label.attr({
					text: text
				});

				// get the bounding box
				bBox = label.getBBox();
				boxWidth = bBox.width + 2 * padding;
				boxHeight = bBox.height + 2 * padding;

				// set the size of the box
				box.attr({
					width: boxWidth,
					height: boxHeight,
					stroke: options.borderColor || point.color || currentSeries.color || '#606060'
				});

				placedTooltipPoint = placeBox(boxWidth, boxHeight, plotLeft, plotTop, plotWidth, plotHeight, {x: x, y: y});

				// do the move
				move(mathRound(placedTooltipPoint.x - boxOffLeft), mathRound(placedTooltipPoint.y - boxOffLeft));
			}


			// crosshairs
			if (crosshairsOptions) {
				crosshairsOptions = splat(crosshairsOptions); // [x, y]

				var path,
					i = crosshairsOptions.length,
					attribs,
					axis;

				while (i--) {
					axis = point.series[i ? 'yAxis' : 'xAxis'];
					if (crosshairsOptions[i] && axis) {
						path = axis
							.getPlotLinePath(point[i ? 'y' : 'x'], 1);
						if (crosshairs[i]) {
							crosshairs[i].attr({ d: path, visibility: VISIBLE });

						} else {
							attribs = {
								'stroke-width': crosshairsOptions[i].width || 1,
								stroke: crosshairsOptions[i].color || '#C0C0C0',
								zIndex: 2
							};
							if (crosshairsOptions[i].dashStyle) {
								attribs.dashstyle = crosshairsOptions[i].dashStyle;
							}
							crosshairs[i] = renderer.path(path)
								.attr(attribs)
								.add();
						}
					}
				}
			}
		}



		// public members
		return {
			shared: shared,
			refresh: refresh,
			hide: hide
		};
	}

	/**
	 * The mouse tracker object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function MouseTracker(chart, options) {


		var mouseDownX,
			mouseDownY,
			hasDragged,
			selectionMarker,
			zoomType = optionsChart.zoomType,
			zoomX = /x/.test(zoomType),
			zoomY = /y/.test(zoomType),
			zoomHor = (zoomX && !inverted) || (zoomY && inverted),
			zoomVert = (zoomY && !inverted) || (zoomX && inverted);

		/**
		 * Add crossbrowser support for chartX and chartY
		 * @param {Object} e The event object in standard browsers
		 */
		function normalizeMouseEvent(e) {
			var ePos,
				pageZoomFix = isWebKit && doc.width / doc.documentElement.clientWidth - 1,
				chartPosLeft,
				chartPosTop,
				chartX,
				chartY;

			// common IE normalizing
			e = e || win.event;
			if (!e.target) {
				e.target = e.srcElement;
			}

			// iOS
			ePos = e.touches ? e.touches.item(0) : e;

			// in certain cases, get mouse position
			if (e.type !== 'mousemove' || win.opera || pageZoomFix) { // only Opera needs position on mouse move, see below
				chartPosition = getPosition(container);
				chartPosLeft = chartPosition.left;
				chartPosTop = chartPosition.top;
			}

			// chartX and chartY
			if (isIE) { // IE including IE9 that has chartX but in a different meaning
				chartX = e.x;
				chartY = e.y;
			} else {
				if (ePos.layerX === UNDEFINED) { // Opera and iOS
					chartX = ePos.pageX - chartPosLeft;
					chartY = ePos.pageY - chartPosTop;
				} else {
					chartX = e.layerX;
					chartY = e.layerY;
				}
			}

			// correct for page zoom bug in WebKit
			if (pageZoomFix) {
				chartX += mathRound((pageZoomFix + 1) * chartPosLeft - chartPosLeft);
				chartY += mathRound((pageZoomFix + 1) * chartPosTop - chartPosTop);
			}

			return extend(e, {
				chartX: chartX,
				chartY: chartY
			});
		}

		/**
		 * Get the click position in terms of axis values.
		 *
		 * @param {Object} e A mouse event
		 */
		function getMouseCoordinates(e) {
			var coordinates = {
				xAxis: [],
				yAxis: []
			};
			each(axes, function (axis, i) {
				var translate = axis.translate,
					isXAxis = axis.isXAxis,
					isHorizontal = inverted ? !isXAxis : isXAxis;

				coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
					axis: axis,
					value: translate(
						isHorizontal ?
							e.chartX - plotLeft  :
							plotHeight - e.chartY + plotTop,
						true
					)
				});
			});
			return coordinates;
		}

		/**
		 * With line type charts with a single tracker, get the point closest to the mouse
		 */
		function onmousemove(e) {
			var point,
				points,
				hoverPoint = chart.hoverPoint,
				hoverSeries = chart.hoverSeries,
				i,
				j,
				distance = chartWidth,
				index = inverted ? e.chartY : e.chartX - plotLeft; // wtf?

			// shared tooltip
			if (tooltip && options.shared) {
				points = [];

				// loop over all series and find the ones with points closest to the mouse
				i = series.length;
				for (j = 0; j < i; j++) {
					if (series[j].visible && series[j].tooltipPoints.length) {
						point = series[j].tooltipPoints[index];
						point._dist = mathAbs(index - point.plotX);
						distance = mathMin(distance, point._dist);
						points.push(point);
					}
				}
				// remove furthest points
				i = points.length;
				while (i--) {
					if (points[i]._dist > distance) {
						points.splice(i, 1);
					}
				}
				// refresh the tooltip if necessary
				if (points.length && (points[0].plotX !== hoverX)) {
					tooltip.refresh(points);
					hoverX = points[0].plotX;
				}
			}

			// separate tooltip and general mouse events
			if (hoverSeries && hoverSeries.tracker) { // only use for line-type series with common tracker

				// get the point
				point = hoverSeries.tooltipPoints[index];

				// a new point is hovered, refresh the tooltip
				if (point && point !== hoverPoint) {

					// trigger the events
					point.onMouseOver();

				}
			}
		}



		/**
		 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
		 */
		function resetTracker() {
			var hoverSeries = chart.hoverSeries,
				hoverPoint = chart.hoverPoint;

			if (hoverPoint) {
				hoverPoint.onMouseOut();
			}

			if (hoverSeries) {
				hoverSeries.onMouseOut();
			}

			if (tooltip) {
				tooltip.hide();
			}

			hoverX = null;
		}

		/**
		 * Mouse up or outside the plot area
		 */
		function drop() {
			if (selectionMarker) {
				var selectionData = {
						xAxis: [],
						yAxis: []
					},
					selectionBox = selectionMarker.getBBox(),
					selectionLeft = selectionBox.x - plotLeft,
					selectionTop = selectionBox.y - plotTop;


				// a selection has been made
				if (hasDragged) {

					// record each axis' min and max
					each(axes, function (axis, i) {
						var translate = axis.translate,
							isXAxis = axis.isXAxis,
							isHorizontal = inverted ? !isXAxis : isXAxis,
							selectionMin = translate(
								isHorizontal ?
									selectionLeft :
									plotHeight - selectionTop - selectionBox.height,
								true,
								0,
								0,
								1
							),
							selectionMax = translate(
								isHorizontal ?
									selectionLeft + selectionBox.width :
									plotHeight - selectionTop,
								true,
								0,
								0,
								1
							);

							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: mathMin(selectionMin, selectionMax), // for reversed axes,
								max: mathMax(selectionMin, selectionMax)
							});

					});
					fireEvent(chart, 'selection', selectionData, zoom);

				}
				selectionMarker = selectionMarker.destroy();
			}

			chart.mouseIsDown = mouseIsDown = hasDragged = false;
			removeEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);

		}

		/**
		 * Set the JS events on the container element
		 */
		function setDOMEvents() {
			var lastWasOutsidePlot = true;

			/*
			 * Record the starting position of a dragoperation
			 */
			container.onmousedown = function (e) {
				e = normalizeMouseEvent(e);

				// issue #295, dragging not always working in Firefox
				if (!hasTouch && e.preventDefault) {
					e.preventDefault();
				}

				// record the start position
				chart.mouseIsDown = mouseIsDown = true;
				mouseDownX = e.chartX;
				mouseDownY = e.chartY;

				addEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
			};

			// The mousemove, touchmove and touchstart event handler
			var mouseMove = function (e) {

				// let the system handle multitouch operations like two finger scroll
				// and pinching
				if (e && e.touches && e.touches.length > 1) {
					return;
				}

				// normalize
				e = normalizeMouseEvent(e);
				if (!hasTouch) { // not for touch devices
					e.returnValue = false;
				}

				var chartX = e.chartX,
					chartY = e.chartY,
					isOutsidePlot = !isInsidePlot(chartX - plotLeft, chartY - plotTop);

				// cache chart position for issue #149 fix
				if (!chartPosition) {
					chartPosition = getPosition(container);
				}

				// on touch devices, only trigger click if a handler is defined
				if (hasTouch && e.type === 'touchstart') {
					if (attr(e.target, 'isTracker')) {
						if (!chart.runTrackerClick) {
							e.preventDefault();
						}
					} else if (!runChartClick && !isOutsidePlot) {
						e.preventDefault();
					}
				}

				// cancel on mouse outside
				if (isOutsidePlot) {

					/*if (!lastWasOutsidePlot) {
						// reset the tracker
						resetTracker();
					}*/

					// drop the selection if any and reset mouseIsDown and hasDragged
					//drop();
					if (chartX < plotLeft) {
						chartX = plotLeft;
					} else if (chartX > plotLeft + plotWidth) {
						chartX = plotLeft + plotWidth;
					}

					if (chartY < plotTop) {
						chartY = plotTop;
					} else if (chartY > plotTop + plotHeight) {
						chartY = plotTop + plotHeight;
					}

				}

				if (mouseIsDown && e.type !== 'touchstart') { // make selection

					// determine if the mouse has moved more than 10px
					hasDragged = Math.sqrt(
						Math.pow(mouseDownX - chartX, 2) +
						Math.pow(mouseDownY - chartY, 2)
					);
					if (hasDragged > 10) {

						// make a selection
						if (hasCartesianSeries && (zoomX || zoomY) &&
								isInsidePlot(mouseDownX - plotLeft, mouseDownY - plotTop)) {
							if (!selectionMarker) {
								selectionMarker = renderer.rect(
									plotLeft,
									plotTop,
									zoomHor ? 1 : plotWidth,
									zoomVert ? 1 : plotHeight,
									0
								)
								.attr({
									fill: 'rgba(69,114,167,0.25)',
									zIndex: 7
								})
								.add();
							}
						}

						// adjust the width of the selection marker
						if (selectionMarker && zoomHor) {
							var xSize = chartX - mouseDownX;
							selectionMarker.attr({
								width: mathAbs(xSize),
								x: (xSize > 0 ? 0 : xSize) + mouseDownX
							});
						}
						// adjust the height of the selection marker
						if (selectionMarker && zoomVert) {
							var ySize = chartY - mouseDownY;
							selectionMarker.attr({
								height: mathAbs(ySize),
								y: (ySize > 0 ? 0 : ySize) + mouseDownY
							});
						}
					}

				} else if (!isOutsidePlot) {
					// show the tooltip
					onmousemove(e);
				}

				lastWasOutsidePlot = isOutsidePlot;

				// when outside plot, allow touch-drag by returning true
				return isOutsidePlot || !hasCartesianSeries;
			};

			/*
			 * When the mouse enters the container, run mouseMove
			 */
			container.onmousemove = mouseMove;

			/*
			 * When the mouse leaves the container, hide the tracking (tooltip).
			 */
			addEvent(container, 'mouseleave', resetTracker);

			// issue #149 workaround
			// The mouseleave event above does not always fire. Whenever the mouse is moving
			// outside the plotarea, hide the tooltip
			addEvent(doc, 'mousemove', function (e) {
				if (chartPosition &&
						!isInsidePlot(e.pageX - chartPosition.left - plotLeft,
							e.pageY - chartPosition.top - plotTop)) {
					resetTracker();
				}
			});


			container.ontouchstart = function (e) {
				// For touch devices, use touchmove to zoom
				if (zoomX || zoomY) {
					container.onmousedown(e);
				}
				// Show tooltip and prevent the lower mouse pseudo event
				mouseMove(e);
			};

			/*
			 * Allow dragging the finger over the chart to read the values on touch
			 * devices
			 */
			container.ontouchmove = mouseMove;

			/*
			 * Allow dragging the finger over the chart to read the values on touch
			 * devices
			 */
			container.ontouchend = function () {
				if (hasDragged) {
					resetTracker();
				}
			};


			// MooTools 1.2.3 doesn't fire this in IE when using addEvent
			container.onclick = function (e) {
				var hoverPoint = chart.hoverPoint;
				e = normalizeMouseEvent(e);

				e.cancelBubble = true; // IE specific


				if (!hasDragged) {
					if (hoverPoint && attr(e.target, 'isTracker')) {
						var plotX = hoverPoint.plotX,
							plotY = hoverPoint.plotY;

						// add page position info
						extend(hoverPoint, {
							pageX: chartPosition.left + plotLeft +
								(inverted ? plotWidth - plotY : plotX),
							pageY: chartPosition.top + plotTop +
								(inverted ? plotHeight - plotX : plotY)
						});

						// the series click event
						fireEvent(hoverPoint.series, 'click', extend(e, {
							point: hoverPoint
						}));

						// the point click event
						hoverPoint.firePointEvent('click', e);

					} else {
						extend(e, getMouseCoordinates(e));

						// fire a click event in the chart
						if (isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
							fireEvent(chart, 'click', e);
						}
					}


				}
				// reset mouseIsDown and hasDragged
				hasDragged = false;
			};

		}

		/**
		 * Create the image map that listens for mouseovers
		 */
		placeTrackerGroup = function () {

			// first create - plot positions is not final at this stage
			if (!trackerGroup) {
				chart.trackerGroup = trackerGroup = renderer.g('tracker')
					.attr({ zIndex: 9 })
					.add();

			// then position - this happens on load and after resizing and changing
			// axis or box positions
			} else {
				trackerGroup.translate(plotLeft, plotTop);
				if (inverted) {
					trackerGroup.attr({
						width: chart.plotWidth,
						height: chart.plotHeight
					}).invert();
				}
			}
		};


		// Run MouseTracker
		placeTrackerGroup();
		if (options.enabled) {
			chart.tooltip = tooltip = Tooltip(options);
		}

		setDOMEvents();

		// set the fixed interval ticking for the smooth tooltip
		tooltipInterval = setInterval(function () {
			if (tooltipTick) {
				tooltipTick();
			}
		}, 32);

		// expose properties
		extend(this, {
			zoomX: zoomX,
			zoomY: zoomY,
			resetTracker: resetTracker
		});
	}



	/**
	 * The overview of the chart's series
	 * @param {Object} chart
	 */
	var Legend = function (chart) {

		var options = chart.options.legend;

		if (!options.enabled) {
			return;
		}

		var horizontal = options.layout === 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			allItems,
			style = options.style,
			itemStyle = options.itemStyle,
			itemHoverStyle = options.itemHoverStyle,
			itemHiddenStyle = options.itemHiddenStyle,
			padding = pInt(style.padding),
			rightPadding = 20,
			//lineHeight = options.lineHeight || 16,
			y = 18,
			initialItemX = 4 + padding + symbolWidth + symbolPadding,
			itemX,
			itemY,
			lastItemY,
			itemHeight = 0,
			box,
			legendBorderWidth = options.borderWidth,
			legendBackgroundColor = options.backgroundColor,
			legendGroup,
			offsetWidth,
			widthOption = options.width,
			series = chart.series,
			reversedLegend = options.reversed;



		/**
		 * Set the colors for the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function colorizeItem(item, visible) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				hiddenColor = itemHiddenStyle.color,
				textColor = visible ? options.itemStyle.color : hiddenColor,
				lineColor = visible ? item.color : hiddenColor,
				symbolAttr = visible ? item.pointAttr[NORMAL_STATE] : {
					stroke: hiddenColor,
					fill: hiddenColor
				};

			if (legendItem) {
				legendItem.css({ fill: textColor });
			}
			if (legendLine) {
				legendLine.attr({ stroke: lineColor });
			}
			if (legendSymbol) {
				legendSymbol.attr(symbolAttr);
			}

		}

		/**
		 * Position the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function positionItem(item, itemX, itemY) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				checkbox = item.checkbox;
			if (legendItem) {
				legendItem.attr({
					x: itemX,
					y: itemY
				});
			}
			if (legendLine) {
				legendLine.translate(itemX, itemY - 4);
			}
			if (legendSymbol) {
				legendSymbol.attr({
					x: itemX + legendSymbol.xOff,
					y: itemY + legendSymbol.yOff
				});
			}
			if (checkbox) {
				checkbox.x = itemX;
				checkbox.y = itemY;
			}
		}

		/**
		 * Destroy a single legend item
		 * @param {Object} item The series or point
		 */
		function destroyItem(item) {
			var checkbox = item.checkbox;

			// pull out from the array
			//erase(allItems, item);

			// destroy SVG elements
			each(['legendItem', 'legendLine', 'legendSymbol'], function (key) {
				if (item[key]) {
					item[key].destroy();
				}
			});

			if (checkbox) {
				discardElement(item.checkbox);
			}


		}


		/**
		 * Position the checkboxes after the width is determined
		 */
		function positionCheckboxes() {
			each(allItems, function (item) {
				var checkbox = item.checkbox,
					alignAttr = legendGroup.alignAttr;
				if (checkbox) {
					css(checkbox, {
						left: (alignAttr.translateX + item.legendItemWidth + checkbox.x - 40) + PX,
						top: (alignAttr.translateY + checkbox.y - 11) + PX
					});
				}
			});
		}

		/**
		 * Render a single specific legend item
		 * @param {Object} item A series or point
		 */
		function renderItem(item) {
			var bBox,
				itemWidth,
				legendSymbol,
				symbolX,
				symbolY,
				attribs,
				simpleSymbol,
				li = item.legendItem,
				series = item.series || item,
				i = allItems.length,
				itemOptions = series.options,
				strokeWidth = (itemOptions && itemOptions.borderWidth) || 0;

			if (!li) { // generate it once, later move it

				// let these series types use a simple symbol
				simpleSymbol = /^(bar|pie|area|column)$/.test(series.type);

				// generate the list item text
				item.legendItem = li = renderer.text(
						options.labelFormatter.call(item),
						0,
						0
					)
					.css(item.visible ? itemStyle : itemHiddenStyle)
					.on('mouseover', function () {
						item.setState(HOVER_STATE);
						li.css(itemHoverStyle);
					})
					.on('mouseout', function () {
						li.css(item.visible ? itemStyle : itemHiddenStyle);
						item.setState();
					})
					.on('click', function (event) {
						var strLegendItemClick = 'legendItemClick',
							fnLegendItemClick = function () {
								item.setVisible();
							};

						// click the name or symbol
						if (item.firePointEvent) { // point
							item.firePointEvent(strLegendItemClick, null, fnLegendItemClick);
						} else {
							fireEvent(item, strLegendItemClick, null, fnLegendItemClick);
						}
					})
					.attr({ zIndex: 2 })
					.add(legendGroup);

				// draw the line
				if (!simpleSymbol && itemOptions && itemOptions.lineWidth) {
					var attrs = {
							'stroke-width': itemOptions.lineWidth,
							zIndex: 2
						};
					if (itemOptions.dashStyle) {
						attrs.dashstyle = itemOptions.dashStyle;
					}
					item.legendLine = renderer.path([
						M,
						-symbolWidth - symbolPadding,
						0,
						L,
						-symbolPadding,
						0
					])
					.attr(attrs)
					.add(legendGroup);
				}

				// draw a simple symbol
				if (simpleSymbol) { // bar|pie|area|column

					legendSymbol = renderer.rect(
						(symbolX = -symbolWidth - symbolPadding),
						(symbolY = -11),
						symbolWidth,
						12,
						2
					).attr({
						//'stroke-width': 0,
						zIndex: 3
					}).add(legendGroup);

				// draw the marker
				} else if (itemOptions && itemOptions.marker && itemOptions.marker.enabled) {
					legendSymbol = renderer.symbol(
						item.symbol,
						(symbolX = -symbolWidth / 2 - symbolPadding),
						(symbolY = -4),
						itemOptions.marker.radius
					)
					//.attr(item.pointAttr[NORMAL_STATE])
					.attr({ zIndex: 3 })
					.add(legendGroup);

				}
				if (legendSymbol) {
					legendSymbol.xOff = symbolX + (strokeWidth % 2 / 2);
					legendSymbol.yOff = symbolY + (strokeWidth % 2 / 2);
				}

				item.legendSymbol = legendSymbol;

				// colorize the items
				colorizeItem(item, item.visible);


				// add the HTML checkbox on top
				if (itemOptions && itemOptions.showCheckbox) {
					item.checkbox = createElement('input', {
						type: 'checkbox',
						checked: item.selected,
						defaultChecked: item.selected // required by IE7
					}, options.itemCheckboxStyle, container);

					addEvent(item.checkbox, 'click', function (event) {
						var target = event.target;
						fireEvent(item, 'checkboxClick', {
								checked: target.checked
							},
							function () {
								item.select();
							}
						);
					});
				}
			}


			// calculate the positions for the next line
			bBox = li.getBBox();

			itemWidth = item.legendItemWidth =
				options.itemWidth || symbolWidth + symbolPadding + bBox.width + rightPadding;
			itemHeight = bBox.height;

			// if the item exceeds the width, start a new line
			if (horizontal && itemX - initialItemX + itemWidth >
					(widthOption || (chartWidth - 2 * padding - initialItemX))) {
				itemX = initialItemX;
				itemY += itemHeight;
			}
			lastItemY = itemY;

			// position the newly generated or reordered items
			positionItem(item, itemX, itemY);

			// advance
			if (horizontal) {
				itemX += itemWidth;
			} else {
				itemY += itemHeight;
			}

			// the width of the widest item
			offsetWidth = widthOption || mathMax(
				horizontal ? itemX - initialItemX : itemWidth,
				offsetWidth
			);



			// add it all to an array to use below
			//allItems.push(item);
		}

		/**
		 * Render the legend. This method can be called both before and after
		 * chart.render. If called after, it will only rearrange items instead
		 * of creating new ones.
		 */
		function renderLegend() {
			itemX = initialItemX;
			itemY = y;
			offsetWidth = 0;
			lastItemY = 0;

			if (!legendGroup) {
				legendGroup = renderer.g('legend')
					.attr({ zIndex: 7 })
					.add();
			}


			// add each series or point
			allItems = [];
			each(series, function (serie) {
				var seriesOptions = serie.options;

				if (!seriesOptions.showInLegend) {
					return;
				}

				// use points or series for the legend item depending on legendType
				allItems = allItems.concat(seriesOptions.legendType === 'point' ?
					serie.data :
					serie
				);

			});

			// sort by legendIndex
			stableSort(allItems, function (a, b) {
				return (a.options.legendIndex || 0) - (b.options.legendIndex || 0);
			});

			// reversed legend
			if (reversedLegend) {
				allItems.reverse();
			}

			// render the items
			each(allItems, renderItem);



			// Draw the border
			legendWidth = widthOption || offsetWidth;
			legendHeight = lastItemY - y + itemHeight;

			if (legendBorderWidth || legendBackgroundColor) {
				legendWidth += 2 * padding;
				legendHeight += 2 * padding;

				if (!box) {
					box = renderer.rect(
						0,
						0,
						legendWidth,
						legendHeight,
						options.borderRadius,
						legendBorderWidth || 0
					).attr({
						stroke: options.borderColor,
						'stroke-width': legendBorderWidth || 0,
						fill: legendBackgroundColor || NONE
					})
					.add(legendGroup)
					.shadow(options.shadow);
					box.isNew = true;

				} else if (legendWidth > 0 && legendHeight > 0) {
					box[box.isNew ? 'attr' : 'animate'](
						box.crisp(null, null, null, legendWidth, legendHeight)
					);
					box.isNew = false;
				}

				// hide the border if no items
				box[allItems.length ? 'show' : 'hide']();
			}

			// 1.x compatibility: positioning based on style
			var props = ['left', 'right', 'top', 'bottom'],
				prop,
				i = 4;
			while (i--) {
				prop = props[i];
				if (style[prop] && style[prop] !== 'auto') {
					options[i < 2 ? 'align' : 'verticalAlign'] = prop;
					options[i < 2 ? 'x' : 'y'] = pInt(style[prop]) * (i % 2 ? -1 : 1);
				}
			}

			if (allItems.length) {
				legendGroup.align(extend(options, {
					width: legendWidth,
					height: legendHeight
				}), true, spacingBox);
			}

			if (!isResizing) {
				positionCheckboxes();
			}
		}


		// run legend
		renderLegend();

		// move checkboxes
		addEvent(chart, 'endResize', positionCheckboxes);

		// expose
		return {
			colorizeItem: colorizeItem,
			destroyItem: destroyItem,
			renderLegend: renderLegend
		};
	};






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
	 * @param {Number} x Pixel x relative to the coordinateSystem
	 * @param {Number} y Pixel y relative to the coordinateSystem
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
				serie.cleanData();
				serie.getSegments();

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
				if (axis.isDirty || isDirtyBox) {
					axis.redraw();
					isDirtyBox = true; // always redraw box to reflect changes in the axis labels
				}
			});


		}

		// the plot areas size has changed
		if (isDirtyBox) {
			drawChartBox();
			placeTrackerGroup();

			// move clip rect
			if (clipRect) {
				stop(clipRect);
				clipRect.animate({ // for chart resize
					width: chart.plotSizeX,
					height: chart.plotSizeY
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

		// fire the event
		fireEvent(chart, 'redraw');
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
				className: 'highcharts-loading'
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
				duration: loadingOptions.showDuration
			});
			loadingShown = true;
		}
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		animate(loadingDiv, {
			opacity: 0
		}, {
			duration: options.loading.hideDuration,
			complete: function () {
				css(loadingDiv, { display: NONE });
			}
		});
		loadingShown = false;
	}

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			data;

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
			data = series[i].data;
			for (j = 0; j < data.length; j++) {
				if (data[j].id === id) {
					return data[j];
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
		axes = xAxisOptions.concat(yAxisOptions);

		// loop the options and construct axis objects
		chart.xAxis = [];
		chart.yAxis = [];
		axes = map(axes, function (axisOptions) {
			axis = new Axis(chart, axisOptions);
			chart[axis.isXAxis ? 'xAxis' : 'yAxis'].push(axis);

			return axis;
		});

		adjustTickAmounts();
	}


	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function (serie) {
			points = points.concat(grep(serie.data, function (point) {
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
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		chart.toolbar.remove('zoom');

	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {

		// add button to reset selection
		var lang = defaultOptions.lang,
			animate = chart.pointCount < 100;
		chart.toolbar.add('zoom', lang.resetZoom, lang.resetZoomTitle, zoomOut);

		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function (axis) {
				axis.setExtremes(null, null, false, animate);
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis;

				// don't zoom more than maxZoom
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false, animate);
				}
			});
		}

		// redraw chart
		redraw();
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
				title.destroy(); // remove old
				title = null;
			}
			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = renderer.text(
					chartTitleOptions.text,
					0,
					0
				)
				.attr({
					align: chartTitleOptions.align,
					'class': 'highcharts-' + name,
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
				className: 'highcharts-container' +
					(optionsChart.className ? ' ' + optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN, // needed for context menu (avoid scrollbars) and
					// content overflow in IE
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left'
			}, optionsChart.style),
			renderToClone || renderTo
		);

		chart.renderer = renderer =
			optionsChart.forExport ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight, true) :
				new Renderer(container, chartWidth, chartHeight);

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
						legendWidth - legendX + legendMargin + spacingRight
					);
				}
			} else if (align === 'left') {
				if (!defined(optionsMarginLeft)) {
					plotLeft = mathMax(
						plotLeft,
						legendWidth + legendX + legendMargin + spacingLeft
					);
				}

			} else if (verticalAlign === 'top') {
				if (!defined(optionsMarginTop)) {
					plotTop = mathMax(
						plotTop,
						legendHeight + legendY + legendMargin + spacingTop
					);
				}

			} else if (verticalAlign === 'bottom') {
				if (!defined(optionsMarginBottom)) {
					marginBottom = mathMax(
						marginBottom,
						legendHeight - legendY + legendMargin + spacingBottom
					);
				}
			}
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
		function reflow() {
			var width = optionsChart.width || renderTo.offsetWidth,
				height = optionsChart.height || renderTo.offsetHeight;

			if (width && height) { // means container is display:none
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
		chart.chartWidth = chartWidth = mathRound(width);
		chart.chartHeight = chartHeight = mathRound(height);

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
		setTimeout(function () {
			fireEvent(chart, 'endResize', null, function () {
				isResizing -= 1;
			});
		}, (globalAnimation && globalAnimation.duration) || 500);
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
	 * Render all graphics for the chart
	 */
	function render() {
		var labels = options.labels,
			credits = options.credits,
			creditsHref;

		// Title
		setTitle();


		// Legend
		legend = chart.legend = new Legend(chart);

		// Get margins by pre-rendering axes
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

		// Toolbar (don't redraw)
		if (!chart.toolbar) {
			chart.toolbar = Toolbar(chart);
		}

		// Credits
		if (credits.enabled && !chart.credits) {
			creditsHref = credits.href;
			renderer.text(
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

		placeTrackerGroup();

		// Set flag
		chart.hasRendered = true;

		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
			//updatePosition(container);
		}
	}

	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i = series.length,
			parentNode = container && container.parentNode;

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// remove events
		removeEvent(win, 'unload', destroy);
		removeEvent(chart);

		each(axes, function (axis) {
			removeEvent(axis);
		});

		// destroy each series
		while (i--) {
			series[i].destroy();
		}

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				parentNode.removeChild(container);
			}

			// IE6 leak
			container = null;
		}

		// IE7 leak
		if (renderer) { // can break in IE when destroyed before finished loading
			renderer.alignedObjects = null;
		}

		// memory and CPU leak
		clearInterval(tooltipInterval);

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

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
		if (!hasSVG && win == win.top && doc.readyState !== COMPLETE) {
		/*jslint eqeq: false*/
			doc.attachEvent(ONREADYSTATECHANGE, function () {
				doc.detachEvent(ONREADYSTATECHANGE, firstRender);
				if (doc.readyState === COMPLETE) {
					firstRender();
				}
			});
			return;
		}

		// create the container
		getContainer();

		resetMargins();
		setChartSize();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			initSeries(serieOptions);
		});

		// Set the common inversion and transformation for inverted series after initSeries
		chart.inverted = inverted = pick(inverted, options.chart.inverted);


		getAxes();


		chart.render = render;

		// depends on inverted and on margins being set
		chart.tracker = tracker = new MouseTracker(chart, options.tooltip);

		//globalAnimation = false;
		render();

		fireEvent(chart, 'load');

		//globalAnimation = true;

		// run callbacks
		if (callback) {
			callback.apply(chart, [chart]);
		}
		each(chart.callbacks, function (fn) {
			fn.apply(chart, [chart]);
		});
	}

	// Run chart


	// Destroy the chart and free up memory.
	addEvent(win, 'unload', destroy);

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





	// Expose methods and variables
	chart.addSeries = addSeries;
	chart.animation = pick(optionsChart.animation, true);
	chart.destroy = destroy;
	chart.get = get;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.setSize = resize;
	chart.setTitle = setTitle;
	chart.showLoading = showLoading;
	chart.pointCount = 0;
	chart.counters = new ChartCounters();
	/*
	if ($) $(function() {
		$container = $('#container');
		var origChartWidth,
			origChartHeight;
		if ($container) {
			$('<button>+</button>')
				.insertBefore($container)
				.click(function() {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
				});
			$('<button>-</button>')
				.insertBefore($container)
				.click(function() {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
				});
			$('<button>1:1</button>')
				.insertBefore($container)
				.click(function() {
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
