/* ****************************************************************************
 * Start Range Selector code												  *
 *****************************************************************************/
extend(defaultOptions, {
	rangeSelector: {
		// allButtonsEnabled: false,
		// enabled: true,
		// buttons: {Object}
		// buttonSpacing: 0,
		buttonTheme: {
			width: 28,
			height: 18,
			fill: '#f7f7f7',
			padding: 2,
			r: 0,
			'stroke-width': 0,
			style: {
				color: '#444',
				cursor: 'pointer',
				fontWeight: 'normal'
			},
			zIndex: 7, // #484, #852
			states: {
				hover: {
					fill: '#e7e7e7'
				},
				select: {
					fill: '#e7f0f9',
					style: {
						color: 'black',
						fontWeight: 'bold'
					}
				}
			}
		},
		inputPosition: {
			align: 'right'
		},
		// inputDateFormat: '%b %e, %Y',
		// inputEditDateFormat: '%Y-%m-%d',
		// inputEnabled: true,
		// inputStyle: {},
		labelStyle: {
			color: '#666'
		}
		// selected: undefined
	}
});
defaultOptions.lang = merge(defaultOptions.lang, {
	rangeSelectorZoom: 'Zoom',
	rangeSelectorFrom: 'From',
	rangeSelectorTo: 'To'
});

/**
 * The object constructor for the range selector
 * @param {Object} chart
 */
function RangeSelector(chart) {

	// Run RangeSelector
	this.init(chart);
}

RangeSelector.prototype = {
	/**
	 * The method to run when one of the buttons in the range selectors is clicked
	 * @param {Number} i The index of the button
	 * @param {Object} rangeOptions
	 * @param {Boolean} redraw
	 */
	clickButton: function (i, redraw) {
		var rangeSelector = this,
			selected = rangeSelector.selected,
			chart = rangeSelector.chart,
			buttons = rangeSelector.buttons,
			rangeOptions = rangeSelector.buttonOptions[i],
			baseAxis = chart.xAxis[0],
			unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis || {},
			dataMin = unionExtremes.dataMin,
			dataMax = unionExtremes.dataMax,
			newMin,
			newMax = baseAxis && mathRound(mathMin(baseAxis.max, pick(dataMax, baseAxis.max))), // #1568
			now,
			date = new Date(newMax),
			type = rangeOptions.type,
			count = rangeOptions.count,
			baseXAxisOptions,
			range = rangeOptions._range,
			rangeMin,
			year,
			timeName;

		if (dataMin === null || dataMax === null || // chart has no data, base series is removed
				i === rangeSelector.selected) { // same button is clicked twice
			return;
		}

		if (type === 'month' || type === 'year') {
			timeName = { month: 'Month', year: 'FullYear'}[type];
			date['set' + timeName](date['get' + timeName]() - count);

			newMin = date.getTime();
			dataMin = pick(dataMin, Number.MIN_VALUE);
			if (isNaN(newMin) || newMin < dataMin) {
				newMin = dataMin;
				newMax = mathMin(newMin + range, dataMax);
			} else {
				range = newMax - newMin;
			}

		// Fixed times like minutes, hours, days
		} else if (range) {
			newMin = mathMax(newMax - range, dataMin);
			newMax = mathMin(newMin + range, dataMax);
		
		} else if (type === 'ytd') {

			// On user clicks on the buttons, or a delayed action running from the beforeRender 
			// event (below), the baseAxis is defined.
			if (baseAxis) {

				// When "ytd" is the pre-selected button for the initial view, its calculation
				// is delayed and rerun in the beforeRender event (below). When the series
				// are initialized, but before the chart is rendered, we have access to the xData
				// array (#942).
				if (dataMax === UNDEFINED) {
					dataMin = Number.MAX_VALUE;
					dataMax = Number.MIN_VALUE;
					each(chart.series, function (series) {
						var xData = series.xData; // reassign it to the last item
						dataMin = mathMin(xData[0], dataMin);
						dataMax = mathMax(xData[xData.length - 1], dataMax);
					});
					redraw = false;
				}
				now = new Date(dataMax);
				year = now.getFullYear();
				newMin = rangeMin = mathMax(dataMin || 0, Date.UTC(year, 0, 1));
				now = now.getTime();
				newMax = mathMin(dataMax || now, now);

			// "ytd" is pre-selected. We don't yet have access to processed point and extremes data
			// (things like pointStart and pointInterval are missing), so we delay the process (#942)
			} else {
				addEvent(chart, 'beforeRender', function () {
					rangeSelector.clickButton(i);
				});
				return;
			}
		} else if (type === 'all' && baseAxis) {
			newMin = dataMin;
			newMax = dataMax;
		}

		// Deselect previous button
		if (buttons[selected]) {
			buttons[selected].setState(0);
		}
		// Select this button
		if (buttons[i]) {
			buttons[i].setState(2);
		}

		chart.fixedRange = range;

		// update the chart
		if (!baseAxis) { // axis not yet instanciated
			baseXAxisOptions = chart.options.xAxis;
			baseXAxisOptions[0] = merge(
				baseXAxisOptions[0],
				{
					range: range,
					min: rangeMin
				}
			);
			rangeSelector.setSelected(i);
		} else { // existing axis object; after render time
			baseAxis.setExtremes(
				newMin,
				newMax,
				pick(redraw, 1),
				0, 
				{ 
					trigger: 'rangeSelectorButton',
					rangeSelectorButton: rangeOptions
				}
			);
			rangeSelector.setSelected(i);
		}
	},

	/**
	 * Set the selected option. This method only sets the internal flag, it doesn't
	 * update the buttons or the actual zoomed range.
	 */
	setSelected: function (selected) {
		this.selected = this.options.selected = selected;
	},
	
	/**
	 * The default buttons for pre-selecting time frames
	 */
	defaultButtons: [{
		type: 'month',
		count: 1,
		text: '1m'
	}, {
		type: 'month',
		count: 3,
		text: '3m'
	}, {
		type: 'month',
		count: 6,
		text: '6m'
	}, {
		type: 'ytd',
		text: 'YTD'
	}, {
		type: 'year',
		count: 1,
		text: '1y'
	}, {
		type: 'all',
		text: 'All'
	}],

	/**
	 * Initialize the range selector
	 */
	init: function (chart) {
		
		var rangeSelector = this,
			options = chart.options.rangeSelector,
			buttonOptions = options.buttons || [].concat(rangeSelector.defaultButtons),
			selectedOption = options.selected,
			blurInputs = rangeSelector.blurInputs = function () {
				var minInput = rangeSelector.minInput,
					maxInput = rangeSelector.maxInput;
				if (minInput) {
					minInput.blur();
				}
				if (maxInput) {
					maxInput.blur();
				}
			};

		rangeSelector.chart = chart;
		rangeSelector.options = options;
		rangeSelector.buttons = [];
		
		chart.extraTopMargin = 35;
		rangeSelector.buttonOptions = buttonOptions;

		addEvent(chart.container, 'mousedown', blurInputs);
		addEvent(chart, 'resize', blurInputs);

		// Extend the buttonOptions with actual range
		each(buttonOptions, rangeSelector.computeButtonRange);

		// zoomed range based on a pre-selected button index
		if (selectedOption !== UNDEFINED && buttonOptions[selectedOption]) {
			this.clickButton(selectedOption, false);
		}

		// normalize the pressed button whenever a new range is selected
		addEvent(chart, 'load', function () {
			addEvent(chart.xAxis[0], 'afterSetExtremes', function () {
				rangeSelector.updateButtonStates(true);
			});
		});
	},

	/**
	 * Dynamically update the range selector buttons after a new range has been set
	 */
	updateButtonStates: function (updating) {
		var rangeSelector = this,
			chart = this.chart,
			baseAxis = chart.xAxis[0],
			unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis,
			dataMin = unionExtremes.dataMin,
			dataMax = unionExtremes.dataMax,
			selected = rangeSelector.selected,
			allButtonsEnabled = rangeSelector.options.allButtonsEnabled,
			buttons = rangeSelector.buttons;

		if (updating && chart.fixedRange !== mathRound(baseAxis.max - baseAxis.min)) {
			if (buttons[selected]) {
				buttons[selected].setState(0);
			}
			rangeSelector.setSelected(null);
		}

		each(rangeSelector.buttonOptions, function (rangeOptions, i) {
			var range = rangeOptions._range,
				// Disable buttons where the range exceeds what is allowed in the current view
				isTooGreatRange = range > dataMax - dataMin,
				// Disable buttons where the range is smaller than the minimum range
				isTooSmallRange = range < baseAxis.minRange,
				// Disable the All button if we're already showing all 
				isAllButAlreadyShowingAll = rangeOptions.type === 'all' && baseAxis.max - baseAxis.min >= dataMax - dataMin && 
					buttons[i].state !== 2,
				// Disable the YTD button if the complete range is within the same year
				isYTDButNotAvailable = rangeOptions.type === 'ytd' && dateFormat('%Y', dataMin) === dateFormat('%Y', dataMax);

			// The new zoom area happens to match the range for a button - mark it selected.
			// This happens when scrolling across an ordinal gap. It can be seen in the intraday
			// demos when selecting 1h and scroll across the night gap.
			if (range === mathRound(baseAxis.max - baseAxis.min) && i !== selected) {
				rangeSelector.setSelected(i);
				buttons[i].setState(2);
			
			} else if (!allButtonsEnabled && (isTooGreatRange || isTooSmallRange || isAllButAlreadyShowingAll || isYTDButNotAvailable)) {
				buttons[i].setState(3);

			} else if (buttons[i].state === 3) {
				buttons[i].setState(0);
			}
		});
	},

	/** 
	 * Compute and cache the range for an individual button
	 */
	computeButtonRange: function (rangeOptions) {
		var type = rangeOptions.type,
			count = rangeOptions.count || 1,

			// these time intervals have a fixed number of milliseconds, as opposed
			// to month, ytd and year
			fixedTimes = {
				millisecond: 1,
				second: 1000,
				minute: 60 * 1000,
				hour: 3600 * 1000,
				day: 24 * 3600 * 1000,
				week: 7 * 24 * 3600 * 1000
			};
		
		// Store the range on the button object
		if (fixedTimes[type]) {
			rangeOptions._range = fixedTimes[type] * count;				
		} else if (type === 'month' || type === 'year') {
			rangeOptions._range = { month: 30, year: 365 }[type] * 24 * 36e5 * count;
		}
	},
	
	/**
	 * Set the internal and displayed value of a HTML input for the dates
	 * @param {String} name
	 * @param {Number} time
	 */
	setInputValue: function (name, time) {
		var options = this.chart.options.rangeSelector;

		if (defined(time)) {
			this[name + 'Input'].HCTime = time;
		}
		
		this[name + 'Input'].value = dateFormat(options.inputEditDateFormat || '%Y-%m-%d', this[name + 'Input'].HCTime);
		this[name + 'DateBox'].attr({ text: dateFormat(options.inputDateFormat || '%b %e, %Y', this[name + 'Input'].HCTime) });
	},

	/**
	 * Draw either the 'from' or the 'to' HTML input box of the range selector
	 * @param {Object} name
	 */
	drawInput: function (name) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			chartStyle = chart.renderer.style,
			renderer = chart.renderer,
			options = chart.options.rangeSelector,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			isMin = name === 'min',
			input,
			label,
			dateBox,
			inputGroup = this.inputGroup;

		// Create the text label
		this[name + 'Label'] = label = renderer.label(lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'], this.inputGroup.offset)
			.attr({
				padding: 2
			})
			.css(merge(chartStyle, options.labelStyle))
			.add(inputGroup);
		inputGroup.offset += label.width + 5;
		
		// Create an SVG label that shows updated date ranges and and records click events that 
		// bring in the HTML input.
		this[name + 'DateBox'] = dateBox = renderer.label('', inputGroup.offset)
			.attr({
				padding: 2,
				width: options.inputBoxWidth || 90,
				height: options.inputBoxHeight || 17,
				stroke: options.inputBoxBorderColor || 'silver',
				'stroke-width': 1
			})
			.css(merge({
				textAlign: 'center',
				color: '#444'
			}, chartStyle, options.inputStyle))
			.on('click', function () {
				rangeSelector[name + 'Input'].focus();
			})
			.add(inputGroup);
		inputGroup.offset += dateBox.width + (isMin ? 10 : 0);
		

		// Create the HTML input element. This is rendered as 1x1 pixel then set to the right size 
		// when focused.
		this[name + 'Input'] = input = createElement('input', {
			name: name,
			className: PREFIX + 'range-selector',
			type: 'text'
		}, extend({
			position: ABSOLUTE,
			border: 0,
			width: '1px', // Chrome needs a pixel to see it
			height: '1px',
			padding: 0,
			textAlign: 'center',
			fontSize: chartStyle.fontSize,
			fontFamily: chartStyle.fontFamily,
			top: chart.plotTop + PX // prevent jump on focus in Firefox
		}, options.inputStyle), div);

		// Blow up the input box
		input.onfocus = function () {
			css(this, {
				left: (inputGroup.translateX + dateBox.x) + PX,
				top: inputGroup.translateY + PX,
				width: (dateBox.width - 2) + PX,
				height: (dateBox.height - 2) + PX,
				border: '2px solid silver'
			});
		};
		// Hide away the input box
		input.onblur = function () {
			css(this, {
				border: 0,
				width: '1px',
				height: '1px'
			});
			rangeSelector.setInputValue(name);
		};

		// handle changes in the input boxes
		input.onchange = function () {
			var inputValue = input.value,
				value = (options.inputDateParser || Date.parse)(inputValue),
				xAxis = chart.xAxis[0],
				dataMin = xAxis.dataMin,
				dataMax = xAxis.dataMax;

			// If the value isn't parsed directly to a value by the browser's Date.parse method,
			// like YYYY-MM-DD in IE, try parsing it a different way
			if (isNaN(value)) {
				value = inputValue.split('-');
				value = Date.UTC(pInt(value[0]), pInt(value[1]) - 1, pInt(value[2]));
			}

			if (!isNaN(value)) {

				// Correct for timezone offset (#433)
				if (!defaultOptions.global.useUTC) {
					value = value + new Date().getTimezoneOffset() * 60 * 1000;
				}

				// Validate the extremes. If it goes beyound the data min or max, use the
				// actual data extreme (#2438).
				if (isMin) {
					if (value > rangeSelector.maxInput.HCTime) {
						value = UNDEFINED;
					} else if (value < dataMin) {
						value = dataMin;
					}
				} else {
					if (value < rangeSelector.minInput.HCTime) {
						value = UNDEFINED;
					} else if (value > dataMax) {
						value = dataMax;
					}
				}

				// Set the extremes
				if (value !== UNDEFINED) {
					chart.xAxis[0].setExtremes(
						isMin ? value : xAxis.min,
						isMin ? xAxis.max : value,
						UNDEFINED,
						UNDEFINED,
						{ trigger: 'rangeSelectorInput' }
					);
				}
			}
		};
	},

	/**
	 * Render the range selector including the buttons and the inputs. The first time render
	 * is called, the elements are created and positioned. On subsequent calls, they are
	 * moved and updated.
	 * @param {Number} min X axis minimum
	 * @param {Number} max X axis maximum
	 */
	render: function (min, max) {

		var rangeSelector = this,
			chart = rangeSelector.chart,
			renderer = chart.renderer,
			container = chart.container,
			chartOptions = chart.options,
			navButtonOptions = chartOptions.exporting && chartOptions.navigation && chartOptions.navigation.buttonOptions, 
			options = chartOptions.rangeSelector,
			buttons = rangeSelector.buttons,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			inputGroup = rangeSelector.inputGroup,
			buttonTheme = options.buttonTheme,
			inputEnabled = options.inputEnabled !== false,
			states = buttonTheme && buttonTheme.states,
			plotLeft = chart.plotLeft,
			yAlign,
			buttonLeft;

		// create the elements
		if (!rangeSelector.rendered) {
			rangeSelector.zoomText = renderer.text(lang.rangeSelectorZoom, plotLeft, chart.plotTop - 20)
				.css(options.labelStyle)
				.add();

			// button starting position
			buttonLeft = plotLeft + rangeSelector.zoomText.getBBox().width + 5;

			each(rangeSelector.buttonOptions, function (rangeOptions, i) {
				buttons[i] = renderer.button(
						rangeOptions.text,
						buttonLeft,
						chart.plotTop - 35,
						function () {
							rangeSelector.clickButton(i);
							rangeSelector.isActive = true;
						},
						buttonTheme,
						states && states.hover,
						states && states.select
					)
					.css({
						textAlign: 'center'
					})
					.add();

				// increase button position for the next button
				buttonLeft += buttons[i].width + pick(options.buttonSpacing, 5);

				if (rangeSelector.selected === i) {
					buttons[i].setState(2);
				}
			});

			rangeSelector.updateButtonStates();

			// first create a wrapper outside the container in order to make
			// the inputs work and make export correct
			if (inputEnabled) {
				rangeSelector.div = div = createElement('div', null, {
					position: 'relative',
					height: 0,
					zIndex: 1 // above container
				});

				container.parentNode.insertBefore(div, container);

				// Create the group to keep the inputs
				rangeSelector.inputGroup = inputGroup = renderer.g('input-group')
					.add();
				inputGroup.offset = 0;

				rangeSelector.drawInput('min');
				rangeSelector.drawInput('max');	
			}
		}
		
		if (inputEnabled) {
		
			// Update the alignment to the updated spacing box
			yAlign = chart.plotTop - 45;		
			inputGroup.align(extend({
				y: yAlign,
				width: inputGroup.offset,
				// detect collision with the exporting buttons
				x: navButtonOptions && (yAlign < (navButtonOptions.y || 0) + navButtonOptions.height - chart.spacing[0]) ? 
					-40 : 0
			}, options.inputPosition), true, chart.spacingBox);
	
			// Set or reset the input values
			rangeSelector.setInputValue('min', min);
			rangeSelector.setInputValue('max', max);
		}

		rangeSelector.rendered = true;
	},

	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {
		var minInput = this.minInput,
			maxInput = this.maxInput,
			chart = this.chart,
			blurInputs = this.blurInputs,
			key;

		removeEvent(chart.container, 'mousedown', blurInputs);
		removeEvent(chart, 'resize', blurInputs);

		// Destroy elements in collections
		destroyObjectProperties(this.buttons);
		
		// Clear input element events
		if (minInput) {
			minInput.onfocus = minInput.onblur = minInput.onchange = null;
		}
		if (maxInput) {
			maxInput.onfocus = maxInput.onblur = maxInput.onchange = null;
		}

		// Destroy HTML and SVG elements
		for (key in this) {
			if (this[key] && key !== 'chart') {
				if (this[key].destroy) { // SVGElement
					this[key].destroy();
				} else if (this[key].nodeType) { // HTML element
					discardElement(this[key]);
				}
			}
			this[key] = null;
		}
	}
};

/**
 * Add logic to normalize the zoomed range in order to preserve the pressed state of range selector buttons
 */
Axis.prototype.toFixedRange = function (pxMin, pxMax, fixedMin, fixedMax) {
	var fixedRange = this.chart && this.chart.fixedRange,
		newMin = pick(fixedMin, this.translate(pxMin, true)),
		newMax = pick(fixedMax, this.translate(pxMax, true)),
		changeRatio = fixedRange && (newMax - newMin) / fixedRange;

	// If the difference between the fixed range and the actual requested range is
	// too great, the user is dragging across an ordinal gap, and we need to release
	// the range selector button.
	if (changeRatio > 0.7 && changeRatio < 1.3) {
		if (fixedMax) {
			newMin = newMax - fixedRange;
		} else {
			newMax = newMin + fixedRange;
		}
	}

	return {
		min: newMin,
		max: newMax
	};
};

// Initialize scroller for stock charts
wrap(Chart.prototype, 'init', function (proceed, options, callback) {
	
	addEvent(this, 'init', function () {
		if (this.options.rangeSelector.enabled) {
			this.rangeSelector = new RangeSelector(this);
		}
	});

	proceed.call(this, options, callback);
	
});


Highcharts.RangeSelector = RangeSelector;

/* ****************************************************************************
 * End Range Selector code													*
 *****************************************************************************/
