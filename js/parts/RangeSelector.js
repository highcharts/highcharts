/* ****************************************************************************
 * Start Range Selector code												  *
 *****************************************************************************/
extend(defaultOptions, {
	rangeSelector: {
		// enabled: true,
		// buttons: {Object}
		// buttonSpacing: 0,
		buttonTheme: {
			width: 28,
			height: 16,
			padding: 1,
			r: 0,
			zIndex: 7 // #484, #852
		//	states: {
		//		hover: {},
		//		select: {}
		// }
		}
		// inputDateFormat: '%b %e, %Y',
		// inputEditDateFormat: '%Y-%m-%d',
		// inputEnabled: true,
		// inputStyle: {}
		// labelStyle: {}
		// selected: undefined
		// todo:
		// - button styles for normal, hover and select state
		// - CSS text styles
		// - styles for the inputs and labels
	}
});
defaultOptions.lang = merge(defaultOptions.lang, {
	rangeSelectorZoom: 'Zoom',
	rangeSelectorFrom: 'From:',
	rangeSelectorTo: 'To:'
});

/**
 * The object constructor for the range selector
 * @param {Object} chart
 */
function RangeSelector(chart) {
	var defaultButtons = [{
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
		}];

	chart.resetZoomEnabled = false;

	this.chart = chart;
	this.buttons = [];
	this.boxSpanElements = {};

	// Run RangeSelector
	this.init(defaultButtons);
}

RangeSelector.prototype = {
	/**
	 * The method to run when one of the buttons in the range selectors is clicked
	 * @param {Number} i The index of the button
	 * @param {Object} rangeOptions
	 * @param {Boolean} redraw
	 */
	clickButton: function (i, rangeOptions, redraw) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			buttons = rangeSelector.buttons,
			baseAxis = chart.xAxis[0],
			extremes = baseAxis && baseAxis.getExtremes(),
			navAxis = chart.scroller && chart.scroller.xAxis,
			navExtremes = navAxis && navAxis.getExtremes && navAxis.getExtremes(),
			navDataMin = navExtremes && navExtremes.dataMin,
			navDataMax = navExtremes && navExtremes.dataMax,
			baseDataMin = extremes && extremes.dataMin,
			baseDataMax = extremes && extremes.dataMax,
			dataMin = mathMin(baseDataMin, pick(navDataMin, baseDataMin)),
			dataMax = mathMax(baseDataMax, pick(navDataMax, baseDataMax)),
			newMin,
			newMax = baseAxis && mathMin(extremes.max, dataMax),
			now,
			date = new Date(newMax),
			type = rangeOptions.type,
			count = rangeOptions.count,
			baseXAxisOptions,
			range,
			rangeMin,
			year,
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

		if (dataMin === null || dataMax === null || // chart has no data, base series is removed
				i === rangeSelector.selected) { // same button is clicked twice
			return;
		}

		if (fixedTimes[type]) {
			range = fixedTimes[type] * count;
			newMin = mathMax(newMax - range, dataMin);
		} else if (type === 'month') {
			date.setMonth(date.getMonth() - count);
			newMin = mathMax(date.getTime(), dataMin);
			range = 30 * 24 * 3600 * 1000 * count;
		} else if (type === 'ytd') {
			date = new Date(0);
			now = new Date(dataMax);
			year = now.getFullYear();
			date.setFullYear(year);

			// workaround for IE6 bug, which sets year to next year instead of current
			if (String(year) !== dateFormat('%Y', date)) {
				date.setFullYear(year - 1);
			}

			newMin = rangeMin = mathMax(dataMin || 0, date.getTime());
			now = now.getTime();
			newMax = mathMin(dataMax || now, now);
		} else if (type === 'year') {
			date.setFullYear(date.getFullYear() - count);
			newMin = mathMax(dataMin, date.getTime());
			range = 365 * 24 * 3600 * 1000 * count;
		} else if (type === 'all' && baseAxis) {
			newMin = dataMin;
			newMax = dataMax;
		}

		// mark the button pressed
		if (buttons[i]) {
			buttons[i].setState(2);
		}

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
			rangeSelector.selected = i;
		} else { // existing axis object; after render time
			setTimeout(function () { // make sure the visual state is set before the heavy process begins
				baseAxis.setExtremes(
					newMin,
					newMax,
					pick(redraw, 1),
					0,
					{ rangeSelectorButton: rangeOptions }
				);
				rangeSelector.selected = i;
			}, 1);
		}
	},

	/**
	 * Initialize the range selector
	 */
	init: function (defaultButtons) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			options = chart.options.rangeSelector,
			buttonOptions = options.buttons || defaultButtons,
			buttons = rangeSelector.buttons,
			leftBox = rangeSelector.leftBox,
			rightBox = rangeSelector.rightBox,
			selectedOption = options.selected;

		chart.extraTopMargin = 25;
		rangeSelector.buttonOptions = buttonOptions;

		/**
		 * The handler connected to container that handles mousedown.
		 */
		rangeSelector.mouseDownHandler = function () {
			if (leftBox) {
				leftBox.blur();
			}
			if (rightBox) {
				rightBox.blur();
			}
		};

		addEvent(chart.container, MOUSEDOWN, rangeSelector.mouseDownHandler);

		// zoomed range based on a pre-selected button index
		if (selectedOption !== UNDEFINED && buttonOptions[selectedOption]) {
			this.clickButton(selectedOption, buttonOptions[selectedOption], false);
		}

		// normalize the pressed button whenever a new range is selected
		addEvent(chart, 'load', function () {
			addEvent(chart.xAxis[0], 'afterSetExtremes', function () {
				if (buttons[rangeSelector.selected]) {
					buttons[rangeSelector.selected].setState(0);
				}
				rangeSelector.selected = null;
			});
		});
	},


	/**
	 * Set the internal and displayed value of a HTML input for the dates
	 * @param {Object} input
	 * @param {Number} time
	 */
	setInputValue: function (input, time) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			options = chart.options.rangeSelector,
			format = input.hasFocus ? options.inputEditDateFormat || '%Y-%m-%d' : options.inputDateFormat || '%b %e, %Y';

		if (time) {
			input.HCTime = time;
		}

		input.value = dateFormat(format, input.HCTime);
	},

	/**
	 * Draw either the 'from' or the 'to' HTML input box of the range selector
	 * @param {Object} name
	 */
	drawInput: function (name) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			options = chart.options.rangeSelector,
			boxSpanElements = rangeSelector.boxSpanElements,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			isMin = name === 'min',
			input;

		// create the text label
		boxSpanElements[name] = createElement('span', {
			innerHTML: lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo']
		}, options.labelStyle, div);

		// create the input element
		input = createElement('input', {
			name: name,
			className: PREFIX + 'range-selector',
			type: 'text'
		}, extend({
			width: '80px',
			height: '16px',
			border: '1px solid silver',
			marginLeft: '5px',
			marginRight: isMin ? '5px' : '0',
			textAlign: 'center'
		}, options.inputStyle), div);


		input.onfocus = input.onblur = function (e) {
			e = e || window.event;
			input.hasFocus = e.type === 'focus';
			rangeSelector.setInputValue(input);
		};

		// handle changes in the input boxes
		input.onchange = function () {
			var inputValue = input.value,
				value = Date.parse(inputValue),
				extremes = chart.xAxis[0].getExtremes();

			// if the value isn't parsed directly to a value by the browser's Date.parse method,
			// like YYYY-MM-DD in IE, try parsing it a different way
			if (isNaN(value)) {
				value = inputValue.split('-');
				value = Date.UTC(pInt(value[0]), pInt(value[1]) - 1, pInt(value[2]));
			}

			if (!isNaN(value) &&
				((isMin && (value >= extremes.dataMin && value <= rangeSelector.rightBox.HCTime)) ||
				(!isMin && (value <= extremes.dataMax && value >= rangeSelector.leftBox.HCTime)))
			) {
				chart.xAxis[0].setExtremes(
					isMin ? value : extremes.min,
					isMin ? extremes.max : value
				);
			}
		};

		return input;
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
			options = chart.options.rangeSelector,
			buttons = rangeSelector.buttons,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			chartStyle = chart.options.chart.style,
			buttonTheme = options.buttonTheme,
			inputEnabled = options.inputEnabled !== false,
			states = buttonTheme && buttonTheme.states,
			plotLeft = chart.plotLeft,
			buttonLeft;

		// create the elements
		if (!rangeSelector.rendered) {
			rangeSelector.zoomText = renderer.text(lang.rangeSelectorZoom, plotLeft, chart.plotTop - 10)
				.css(options.labelStyle)
				.add();

			// button starting position
			buttonLeft = plotLeft + rangeSelector.zoomText.getBBox().width + 5;

			each(rangeSelector.buttonOptions, function (rangeOptions, i) {
				buttons[i] = renderer.button(
						rangeOptions.text,
						buttonLeft,
						chart.plotTop - 25,
						function () {
							rangeSelector.clickButton(i, rangeOptions);
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
				buttonLeft += buttons[i].width + (options.buttonSpacing || 0);

				if (rangeSelector.selected === i) {
					buttons[i].setState(2);
				}
			});

			// first create a wrapper outside the container in order to make
			// the inputs work and make export correct
			if (inputEnabled) {
				rangeSelector.divRelative = div = createElement('div', null, {
					position: 'relative',
					height: 0,
					fontFamily: chartStyle.fontFamily,
					fontSize: chartStyle.fontSize,
					zIndex: 1 // above container
				});

				container.parentNode.insertBefore(div, container);

				// create an absolutely positionied div to keep the inputs
				rangeSelector.divAbsolute = rangeSelector.div = div = createElement('div', null, extend({
					position: 'absolute',
					top: (chart.plotTop - 25) + 'px',
					right: (chart.chartWidth - chart.plotLeft - chart.plotWidth) + 'px'
				}, options.inputBoxStyle), div);

				rangeSelector.leftBox = rangeSelector.drawInput('min');
				rangeSelector.rightBox = rangeSelector.drawInput('max');
			}
		}

		if (inputEnabled) {
			rangeSelector.setInputValue(rangeSelector.leftBox, min);
			rangeSelector.setInputValue(rangeSelector.rightBox, max);
		}

		rangeSelector.rendered = true;
	},

	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {
		var rangeSelector = this,
			leftBox = rangeSelector.leftBox,
			rightBox = rangeSelector.rightBox,
			boxSpanElements = rangeSelector.boxSpanElements,
			divRelative = rangeSelector.divRelative,
			divAbsolute = rangeSelector.divAbsolute,
			zoomText = rangeSelector.zoomText;

		removeEvent(rangeSelector.chart.container, MOUSEDOWN, rangeSelector.mouseDownHandler);

		// Destroy elements in collections
		each([rangeSelector.buttons], function (coll) {
			destroyObjectProperties(coll);
		});

		// Destroy zoomText
		if (zoomText) {
			rangeSelector.zoomText = zoomText.destroy();
		}

		// Clear input element events
		if (leftBox) {
			leftBox.onfocus = leftBox.onblur = leftBox.onchange = null;
		}
		if (rightBox) {
			rightBox.onfocus = rightBox.onblur = rightBox.onchange = null;
		}

		// Discard divs and spans
		each([leftBox, rightBox, boxSpanElements.min, boxSpanElements.max, divAbsolute, divRelative], function (item) {
			discardElement(item);
		});

		// Null the references
		rangeSelector.leftBox = rangeSelector.rightBox = rangeSelector.boxSpanElements = rangeSelector.div = rangeSelector.divAbsolute = rangeSelector.divRelative = null;
	}
};

Highcharts.RangeSelector = RangeSelector;

/* ****************************************************************************
 * End Range Selector code													*
 *****************************************************************************/
