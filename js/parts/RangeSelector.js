/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Axis.js';
import './Chart.js';
var addEvent = H.addEvent,
	Axis = H.Axis,
	Chart = H.Chart,
	css = H.css,
	createElement = H.createElement,
	dateFormat = H.dateFormat,
	defaultOptions = H.defaultOptions,
	useUTC = defaultOptions.global.useUTC,
	defined = H.defined,
	destroyObjectProperties = H.destroyObjectProperties,
	discardElement = H.discardElement,
	each = H.each,
	extend = H.extend,
	fireEvent = H.fireEvent,
	HCDate = H.Date,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	pInt = H.pInt,
	splat = H.splat,
	wrap = H.wrap;
		
/* ****************************************************************************
 * Start Range Selector code												  *
 *****************************************************************************/
extend(defaultOptions, {

	/**
	 * The range selector is a tool for selecting ranges to display within
	 * the chart. It provides buttons to select preconfigured ranges in
	 * the chart, like 1 day, 1 week, 1 month etc. It also provides input
	 * boxes where min and max dates can be manually input.
	 *
	 * @optionparent rangeSelector
	 * @product highstock
	 */
	rangeSelector: {
		// allButtonsEnabled: false,
		// enabled: true,
		// buttons: {Object}
		// buttonSpacing: 0,

		/**
		 * A collection of attributes for the buttons. The object takes SVG
		 * attributes like `fill`, `stroke`, `stroke-width`, as well as `style`,
		 * a collection of CSS properties for the text.
		 * 
		 * The object can also be extended with states, so you can set presentational
		 * options for `hover`, `select` or `disabled` button states.
		 * 
		 * CSS styles for the text label.
		 * 
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the buttons are styled by the `.highcharts-
		 * range-selector-buttons .highcharts-button` rule with its different
		 * states.
		 * 
		 * @type {Object}
		 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
		 * @product highstock
		 */
		buttonTheme: {

			/**
			 */
			'stroke-width': 0,

			/**
			 */
			width: 28,

			/**
			 */
			height: 18,

			/**
			 */
			padding: 2,

			/**
			 */
			zIndex: 7 // #484, #852
		},

		/**
		 * The height of the range selector, used to reserve space for buttons
		 * and input.
		 * 
		 * @type {Number}
		 * @default 35
		 * @since 2.1.9
		 * @product highstock
		 */
		height: 35, // reserved space for buttons and input

		/**
		 * Positioning for the input boxes. Allowed properties are `align`,
		 *  `verticalAlign`, `x` and `y`.
		 * 
		 * @type {Object}
		 * @default { align: "right" }
		 * @since 1.2.5
		 * @product highstock
		 */
		inputPosition: {

			/**
			 */
			align: 'right'
		},
		// inputDateFormat: '%b %e, %Y',
		// inputEditDateFormat: '%Y-%m-%d',
		// inputEnabled: true,
		// selected: undefined,
		/*= if (build.classic) { =*/
		// inputStyle: {},

		/**
		 * CSS styles for the labels - the Zoom, From and To texts.
		 * 
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the labels are styled by the `.highcharts-
		 * range-label` class.
		 * 
		 * @type {CSSObject}
		 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
		 * @product highstock
		 */
		labelStyle: {

			/**
			 */
			color: '${palette.neutralColor60}'
		}
		/*= } =*/
	}
});

defaultOptions.lang = merge(
	defaultOptions.lang, 
	/**
	 * Language object. The language object is global and it can't be set
	 * on each chart initiation. Instead, use `Highcharts.setOptions` to
	 * set it before any chart is initiated.
	 * 
	 * <pre>Highcharts.setOptions({
	 * lang: {
	 * months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
	 * 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	 * 
	 * weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi',
	 * 'Samedi']
	 * }
	 * });</pre>
	 *
	 * @optionparent lang
	 * @product highstock
	 */
	{

		/**
		 * The text for the label for the range selector buttons.
		 * 
		 * @type {String}
		 * @default Zoom
		 * @product highstock
		 */
		rangeSelectorZoom: 'Zoom',

		/**
		 * The text for the label for the "from" input box in the range
		 * selector.
		 * 
		 * @type {String}
		 * @default From
		 * @product highstock
		 */
		rangeSelectorFrom: 'From',

		/**
		 * The text for the label for the "to" input box in the range selector.
		 * 
		 * @type {String}
		 * @default To
		 * @product highstock
		 */
		rangeSelectorTo: 'To'
	}
);

/**
 * The range selector.
 * @class
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
			chart = rangeSelector.chart,
			rangeOptions = rangeSelector.buttonOptions[i],
			baseAxis = chart.xAxis[0],
			unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis || {},
			dataMin = unionExtremes.dataMin,
			dataMax = unionExtremes.dataMax,
			newMin,
			newMax = baseAxis && Math.round(Math.min(baseAxis.max, pick(dataMax, baseAxis.max))), // #1568
			type = rangeOptions.type,
			baseXAxisOptions,
			range = rangeOptions._range,
			rangeMin,
			minSetting,
			rangeSetting,
			ctx,
			ytdExtremes,
			dataGrouping = rangeOptions.dataGrouping;

		if (dataMin === null || dataMax === null) { // chart has no data, base series is removed
			return;
		}

		// Set the fixed range before range is altered
		chart.fixedRange = range;
		
		// Apply dataGrouping associated to button
		if (dataGrouping) {
			this.forcedDataGrouping = true;
			Axis.prototype.setDataGrouping.call(baseAxis || { chart: this.chart }, dataGrouping, false);
		}

		// Apply range
		if (type === 'month' || type === 'year') {
			if (!baseAxis) {
				// This is set to the user options and picked up later when the axis is instantiated
				// so that we know the min and max.
				range = rangeOptions;
			} else {
				ctx = {
					range: rangeOptions,
					max: newMax,
					dataMin: dataMin,
					dataMax: dataMax
				};
				newMin = baseAxis.minFromRange.call(ctx);
				if (isNumber(ctx.newMax)) {
					newMax = ctx.newMax;
				}
			}

		// Fixed times like minutes, hours, days
		} else if (range) {
			newMin = Math.max(newMax - range, dataMin);
			newMax = Math.min(newMin + range, dataMax);
		
		} else if (type === 'ytd') {

			// On user clicks on the buttons, or a delayed action running from the beforeRender
			// event (below), the baseAxis is defined.
			if (baseAxis) {
				// When "ytd" is the pre-selected button for the initial view, its calculation
				// is delayed and rerun in the beforeRender event (below). When the series
				// are initialized, but before the chart is rendered, we have access to the xData
				// array (#942).
				if (dataMax === undefined) {
					dataMin = Number.MAX_VALUE;
					dataMax = Number.MIN_VALUE;
					each(chart.series, function (series) {
						var xData = series.xData; // reassign it to the last item
						dataMin = Math.min(xData[0], dataMin);
						dataMax = Math.max(xData[xData.length - 1], dataMax);
					});
					redraw = false;
				}
				ytdExtremes = rangeSelector.getYTDExtremes(dataMax, dataMin, useUTC);
				newMin = rangeMin = ytdExtremes.min;
				newMax = ytdExtremes.max;

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
		rangeSelector.setSelected(i);

		// Update the chart
		if (!baseAxis) {
			// Axis not yet instanciated. Temporarily set min and range
			// options and remove them on chart load (#4317).
			baseXAxisOptions = splat(chart.options.xAxis)[0];
			rangeSetting = baseXAxisOptions.range;
			baseXAxisOptions.range = range;
			minSetting = baseXAxisOptions.min;
			baseXAxisOptions.min = rangeMin;
			addEvent(chart, 'load', function resetMinAndRange() {
				baseXAxisOptions.range = rangeSetting;
				baseXAxisOptions.min = minSetting;
			});
		} else {
			// Existing axis object. Set extremes after render time.
			baseAxis.setExtremes(
				newMin,
				newMax,
				pick(redraw, 1),
				null, // auto animation
				{
					trigger: 'rangeSelectorButton',
					rangeSelectorButton: rangeOptions
				}
			);
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
			blurInputs = function () {
				var minInput = rangeSelector.minInput,
					maxInput = rangeSelector.maxInput;
				if (minInput && minInput.blur) { //#3274 in some case blur is not defined
					fireEvent(minInput, 'blur'); //#3274
				}
				if (maxInput && maxInput.blur) { //#3274 in some case blur is not defined
					fireEvent(maxInput, 'blur'); //#3274
				}
			};

		rangeSelector.chart = chart;
		rangeSelector.options = options;
		rangeSelector.buttons = [];

		chart.extraTopMargin = options.height;
		rangeSelector.buttonOptions = buttonOptions;

		this.unMouseDown = addEvent(chart.container, 'mousedown', blurInputs);
		this.unResize = addEvent(chart, 'resize', blurInputs);

		// Extend the buttonOptions with actual range
		each(buttonOptions, rangeSelector.computeButtonRange);

		// zoomed range based on a pre-selected button index
		if (selectedOption !== undefined && buttonOptions[selectedOption]) {
			this.clickButton(selectedOption, false);
		}


		addEvent(chart, 'load', function () {
			// If a data grouping is applied to the current button, release it when extremes change
			addEvent(chart.xAxis[0], 'setExtremes', function (e) {
				if (this.max - this.min !== chart.fixedRange && e.trigger !== 'rangeSelectorButton' &&
						e.trigger !== 'updatedData' && rangeSelector.forcedDataGrouping) {
					this.setDataGrouping(false, false);
				}
			});
		});
	},

	/**
	 * Dynamically update the range selector buttons after a new range has been set
	 */
	updateButtonStates: function () {
		var rangeSelector = this,
			chart = this.chart,
			baseAxis = chart.xAxis[0],
			actualRange = Math.round(baseAxis.max - baseAxis.min),
			hasNoData = !baseAxis.hasVisibleSeries,
			day = 24 * 36e5, // A single day in milliseconds
			unionExtremes = (chart.scroller && chart.scroller.getUnionExtremes()) || baseAxis,
			dataMin = unionExtremes.dataMin,
			dataMax = unionExtremes.dataMax,
			ytdExtremes = rangeSelector.getYTDExtremes(dataMax, dataMin, useUTC),
			ytdMin = ytdExtremes.min,
			ytdMax = ytdExtremes.max,
			selected = rangeSelector.selected,
			selectedExists = isNumber(selected),
			allButtonsEnabled = rangeSelector.options.allButtonsEnabled,
			buttons = rangeSelector.buttons;

		each(rangeSelector.buttonOptions, function (rangeOptions, i) {
			var range = rangeOptions._range,
				type = rangeOptions.type,
				count = rangeOptions.count || 1,
				button = buttons[i],
				state = 0,
				disable,
				select,
				isSelected = i === selected,
				// Disable buttons where the range exceeds what is allowed in the current view
				isTooGreatRange = range > dataMax - dataMin,
				// Disable buttons where the range is smaller than the minimum range
				isTooSmallRange = range < baseAxis.minRange,
				// Do not select the YTD button if not explicitly told so
				isYTDButNotSelected = false,
				// Disable the All button if we're already showing all
				isAllButAlreadyShowingAll = false,
				isSameRange = range === actualRange;
			// Months and years have a variable range so we check the extremes
			if (
				(type === 'month' || type === 'year') &&
				(actualRange >= { month: 28, year: 365 }[type] * day * count) &&
				(actualRange <= { month: 31, year: 366 }[type] * day * count)
			) {
				isSameRange = true;
			} else if (type === 'ytd') {
				isSameRange = (ytdMax - ytdMin) === actualRange;
				isYTDButNotSelected = !isSelected;
			} else if (type === 'all') {
				isSameRange = baseAxis.max - baseAxis.min >= dataMax - dataMin;
				isAllButAlreadyShowingAll = !isSelected && selectedExists && isSameRange;
			}
			// The new zoom area happens to match the range for a button - mark it selected.
			// This happens when scrolling across an ordinal gap. It can be seen in the intraday
			// demos when selecting 1h and scroll across the night gap.
			disable = (
				!allButtonsEnabled &&
				(
					isTooGreatRange ||
					isTooSmallRange ||
					isAllButAlreadyShowingAll ||
					hasNoData
				)
			);
			select = (
				(isSelected && isSameRange) ||
				(isSameRange && !selectedExists && !isYTDButNotSelected)
			);

			if (disable) {
				state = 3;
			} else if (select) {
				selectedExists = true; // Only one button can be selected
				state = 2;
			}

			// If state has changed, update the button
			if (button.state !== state) {
				button.setState(state);
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
		var options = this.chart.options.rangeSelector,
			input = this[name + 'Input'];

		if (defined(time)) {
			input.previousValue = input.HCTime;
			input.HCTime = time;
		}

		input.value = dateFormat(
			options.inputEditDateFormat || '%Y-%m-%d',
			input.HCTime
		);
		this[name + 'DateBox'].attr({
			text: dateFormat(options.inputDateFormat || '%b %e, %Y', input.HCTime)
		});
	},

	showInput: function (name) {
		var inputGroup = this.inputGroup,
			dateBox = this[name + 'DateBox'];

		css(this[name + 'Input'], {
			left: (inputGroup.translateX + dateBox.x) + 'px',
			top: inputGroup.translateY + 'px',
			width: (dateBox.width - 2) + 'px',
			height: (dateBox.height - 2) + 'px',
			border: '2px solid silver'
		});
	},

	hideInput: function (name) {
		css(this[name + 'Input'], {
			border: 0,
			width: '1px',
			height: '1px'
		});
		this.setInputValue(name);
	},

	/**
	 * Draw either the 'from' or the 'to' HTML input box of the range selector
	 * @param {Object} name
	 */
	drawInput: function (name) {
		var rangeSelector = this,
			chart = rangeSelector.chart,
			chartStyle = chart.renderer.style || {},
			renderer = chart.renderer,
			options = chart.options.rangeSelector,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			isMin = name === 'min',
			input,
			label,
			dateBox,
			inputGroup = this.inputGroup;

		function updateExtremes() {
			var inputValue = input.value,
				value = (options.inputDateParser || Date.parse)(inputValue),
				chartAxis = chart.xAxis[0],
				dataAxis = chart.scroller && chart.scroller.xAxis ? chart.scroller.xAxis : chartAxis,
				dataMin = dataAxis.dataMin,
				dataMax = dataAxis.dataMax;
			if (value !== input.previousValue) {
				input.previousValue = value;
				// If the value isn't parsed directly to a value by the browser's Date.parse method,
				// like YYYY-MM-DD in IE, try parsing it a different way
				if (!isNumber(value)) {
					value = inputValue.split('-');
					value = Date.UTC(pInt(value[0]), pInt(value[1]) - 1, pInt(value[2]));
				}

				if (isNumber(value)) {

					// Correct for timezone offset (#433)
					if (!useUTC) {
						value = value + new Date().getTimezoneOffset() * 60 * 1000;
					}

					// Validate the extremes. If it goes beyound the data min or max, use the
					// actual data extreme (#2438).
					if (isMin) {
						if (value > rangeSelector.maxInput.HCTime) {
							value = undefined;
						} else if (value < dataMin) {
							value = dataMin;
						}
					} else {
						if (value < rangeSelector.minInput.HCTime) {
							value = undefined;
						} else if (value > dataMax) {
							value = dataMax;
						}
					}

					// Set the extremes
					if (value !== undefined) {
						chartAxis.setExtremes(
							isMin ? value : chartAxis.min,
							isMin ? chartAxis.max : value,
							undefined,
							undefined,
							{ trigger: 'rangeSelectorInput' }
						);
					}
				}
			}
		}

		// Create the text label
		this[name + 'Label'] = label = renderer.label(lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'], this.inputGroup.offset)
			.addClass('highcharts-range-label')
			.attr({
				padding: 2
			})
			.add(inputGroup);
		inputGroup.offset += label.width + 5;

		// Create an SVG label that shows updated date ranges and and records click events that
		// bring in the HTML input.
		this[name + 'DateBox'] = dateBox = renderer.label('', inputGroup.offset)
			.addClass('highcharts-range-input')
			.attr({
				padding: 2,
				width: options.inputBoxWidth || 90,
				height: options.inputBoxHeight || 17,
				stroke: options.inputBoxBorderColor || '${palette.neutralColor20}',
				'stroke-width': 1,
				'text-align': 'center'
			})
			.on('click', function () {
				rangeSelector.showInput(name); // If it is already focused, the onfocus event doesn't fire (#3713)
				rangeSelector[name + 'Input'].focus();
			})
			.add(inputGroup);
		inputGroup.offset += dateBox.width + (isMin ? 10 : 0);


		// Create the HTML input element. This is rendered as 1x1 pixel then set to the right size
		// when focused.
		this[name + 'Input'] = input = createElement('input', {
			name: name,
			className: 'highcharts-range-selector',
			type: 'text'
		}, {
			top: chart.plotTop + 'px' // prevent jump on focus in Firefox
		}, div);

		/*= if (build.classic) { =*/
		// Styles
		label.css(merge(chartStyle, options.labelStyle));

		dateBox.css(merge({
			color: '${palette.neutralColor80}'
		}, chartStyle, options.inputStyle));

		css(input, extend({
			position: 'absolute',
			border: 0,
			width: '1px', // Chrome needs a pixel to see it
			height: '1px',
			padding: 0,
			textAlign: 'center',
			fontSize: chartStyle.fontSize,
			fontFamily: chartStyle.fontFamily,
			left: '-9em' // #4798
		}, options.inputStyle));
		/*= } =*/

		// Blow up the input box
		input.onfocus = function () {
			rangeSelector.showInput(name);
		};
		// Hide away the input box
		input.onblur = function () {
			rangeSelector.hideInput(name);
		};

		// handle changes in the input boxes
		input.onchange = updateExtremes;

		input.onkeypress = function (event) {
			// IE does not fire onchange on enter
			if (event.keyCode === 13) {
				updateExtremes();
			}
		};
	},

	/**
	 * Get the position of the range selector buttons and inputs. This can be overridden from outside for custom positioning.
	 */
	getPosition: function () {
		var chart = this.chart,
			options = chart.options.rangeSelector,
			buttonTop = pick((options.buttonPosition || {}).y, chart.plotTop - chart.axisOffset[0] - options.height);

		return {
			buttonTop: buttonTop,
			inputTop: buttonTop - 10
		};
	},
	/**
	 * Get the extremes of YTD. 
	 * Will choose dataMax if its value is lower than the current timestamp.
	 * Will choose dataMin if its value is higher than the timestamp for
	 * 	the start of current year.
	 * @param  {number} dataMax
	 * @param  {number} dataMin
	 * @return {object} Returns min and max for the YTD
	 */
	getYTDExtremes: function (dataMax, dataMin, useUTC) {
		var min,
			now = new HCDate(dataMax),
			year = now[HCDate.hcGetFullYear](),
			startOfYear = useUTC ? HCDate.UTC(year, 0, 1) : +new HCDate(year, 0, 1); // eslint-disable-line new-cap
		min = Math.max(dataMin || 0, startOfYear);
		now = now.getTime();
		return {
			max: Math.min(dataMax || now, now),
			min: min
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
			navButtonOptions = chartOptions.exporting && chartOptions.exporting.enabled !== false &&
				chartOptions.navigation && chartOptions.navigation.buttonOptions,
			options = chartOptions.rangeSelector,
			buttons = rangeSelector.buttons,
			lang = defaultOptions.lang,
			div = rangeSelector.div,
			inputGroup = rangeSelector.inputGroup,
			buttonTheme = options.buttonTheme,
			buttonPosition = options.buttonPosition || {},
			inputEnabled = options.inputEnabled,
			states = buttonTheme && buttonTheme.states,
			plotLeft = chart.plotLeft,
			buttonLeft,
			pos = this.getPosition(),
			buttonGroup = rangeSelector.group,
			buttonBBox,
			rendered = rangeSelector.rendered;

		if (options.enabled === false) {
			return;
		}

		// create the elements
		if (!rendered) {

			rangeSelector.group = buttonGroup = renderer.g('range-selector-buttons').add();

			rangeSelector.zoomText = renderer.text(lang.rangeSelectorZoom, pick(buttonPosition.x, plotLeft), 15)
				.css(options.labelStyle)
				.add(buttonGroup);

			// button starting position
			buttonLeft = pick(buttonPosition.x, plotLeft) + rangeSelector.zoomText.getBBox().width + 5;

			each(rangeSelector.buttonOptions, function (rangeOptions, i) {
				buttons[i] = renderer.button(
						rangeOptions.text,
						buttonLeft,
						0,
						function () {
							rangeSelector.clickButton(i);
							rangeSelector.isActive = true;
						},
						buttonTheme,
						states && states.hover,
						states && states.select,
						states && states.disabled
					)
					.attr({
						'text-align': 'center'
					})
					.add(buttonGroup);

				// increase button position for the next button
				buttonLeft += buttons[i].width + pick(options.buttonSpacing, 5);
			});

			// first create a wrapper outside the container in order to make
			// the inputs work and make export correct
			if (inputEnabled !== false) {
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
		rangeSelector.updateButtonStates();

		// Set or update the group position
		buttonGroup[rendered ? 'animate' : 'attr']({
			translateY: pos.buttonTop
		});

		if (inputEnabled !== false) {

			// Update the alignment to the updated spacing box
			inputGroup.align(extend({
				y: pos.inputTop,
				width: inputGroup.offset,
				// Detect collision with the exporting buttons
				x: navButtonOptions && (pos.inputTop < (navButtonOptions.y || 0) + navButtonOptions.height - chart.spacing[0]) ?
					-40 : 0
			}, options.inputPosition), true, chart.spacingBox);

			// Hide if overlapping - inputEnabled is null or undefined
			if (!defined(inputEnabled)) {
				buttonBBox = buttonGroup.getBBox();
				inputGroup[inputGroup.alignAttr.translateX < buttonBBox.x + buttonBBox.width + 10 ? 'hide' : 'show']();
			}

			// Set or reset the input values
			rangeSelector.setInputValue('min', min);
			rangeSelector.setInputValue('max', max);
		}

		rangeSelector.rendered = true;
	},

	/**
	 * Update the range selector with new options
	 */
	update: function (options) {
		var chart = this.chart;
		merge(true, chart.options.rangeSelector, options);
		this.destroy();
		this.init(chart);
	},

	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {
		var rSelector = this,
			minInput = rSelector.minInput,
			maxInput = rSelector.maxInput;

		rSelector.unMouseDown();
		rSelector.unResize();

		// Destroy elements in collections
		destroyObjectProperties(rSelector.buttons);

		// Clear input element events
		if (minInput) {
			minInput.onfocus = minInput.onblur = minInput.onchange = null;
		}
		if (maxInput) {
			maxInput.onfocus = maxInput.onblur = maxInput.onchange = null;
		}

		// Destroy HTML and SVG elements
		H.objectEach(rSelector, function (val, key) {
			if (val && key !== 'chart') {
				if (val.destroy) { // SVGElement
					val.destroy();
				} else if (val.nodeType) { // HTML element
					discardElement(this[key]);
				}
			}
			if (val !== RangeSelector.prototype[key]) {
				rSelector[key] = null;
			}
		}, this);
	}
};

/**
 * Add logic to normalize the zoomed range in order to preserve the pressed state of range selector buttons
 */
Axis.prototype.toFixedRange = function (pxMin, pxMax, fixedMin, fixedMax) {
	var fixedRange = this.chart && this.chart.fixedRange,
		newMin = pick(fixedMin, this.translate(pxMin, true, !this.horiz)),
		newMax = pick(fixedMax, this.translate(pxMax, true, !this.horiz)),
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
	if (!isNumber(newMin)) { // #1195
		newMin = newMax = undefined;
	}

	return {
		min: newMin,
		max: newMax
	};
};

/**
 * Get the axis min value based on the range option and the current max. For
 * stock charts this is extended via the {@link RangeSelector} so that if the
 * selected range is a multiple of months or years, it is compensated for
 * various month lengths.
 * 
 * @return {number} The new minimum value.
 */
Axis.prototype.minFromRange = function () {
	var rangeOptions = this.range,
		type = rangeOptions.type,
		timeName = { month: 'Month', year: 'FullYear' }[type],
		min,
		max = this.max,
		dataMin,
		range,
		// Get the true range from a start date
		getTrueRange = function (base, count) {
			var date = new Date(base),
				basePeriod = date['get' + timeName]();

			date['set' + timeName](basePeriod + count);

			if (basePeriod === date['get' + timeName]()) {
				date.setDate(0); // #6537
			}

			return date.getTime() - base;
		};

	if (isNumber(rangeOptions)) {
		min = max - rangeOptions;
		range = rangeOptions;
	} else {
		min = max + getTrueRange(max, -rangeOptions.count);

		// Let the fixedRange reflect initial settings (#5930)
		if (this.chart) {
			this.chart.fixedRange = max - min;
		}
	}

	dataMin = pick(this.dataMin, Number.MIN_VALUE);
	if (!isNumber(min)) {
		min = dataMin;
	}
	if (min <= dataMin) {
		min = dataMin;
		if (range === undefined) { // #4501
			range = getTrueRange(min, rangeOptions.count);
		}
		this.newMax = Math.min(min + range, this.dataMax);
	}
	if (!isNumber(max)) {
		min = undefined;
	}
	return min;

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

Chart.prototype.callbacks.push(function (chart) {
	var extremes,
		rangeSelector = chart.rangeSelector,
		unbindRender,
		unbindSetExtremes;

	function renderRangeSelector() {
		extremes = chart.xAxis[0].getExtremes();
		if (isNumber(extremes.min)) {
			rangeSelector.render(extremes.min, extremes.max);
		}
	}

	if (rangeSelector) {
		// redraw the scroller on setExtremes
		unbindSetExtremes = addEvent(
			chart.xAxis[0],
			'afterSetExtremes',
			function (e) {
				rangeSelector.render(e.min, e.max);
			}
		);

		// redraw the scroller chart resize
		unbindRender = addEvent(chart, 'redraw', renderRangeSelector);

		// do it now
		renderRangeSelector();
	}

	// Remove resize/afterSetExtremes at chart destroy
	addEvent(chart, 'destroy', function destroyEvents() {
		if (rangeSelector) {
			unbindRender();
			unbindSetExtremes();
		}
	});
});


H.RangeSelector = RangeSelector;

/* ****************************************************************************
 * End Range Selector code													*
 *****************************************************************************/
