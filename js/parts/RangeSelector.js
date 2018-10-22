/**
 * (c) 2010-2018 Torstein Honsi
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
    defaultOptions = H.defaultOptions,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    discardElement = H.discardElement,
    each = H.each,
    extend = H.extend,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    merge = H.merge,
    pick = H.pick,
    pInt = H.pInt,
    splat = H.splat,
    wrap = H.wrap;

/* ****************************************************************************
 * Start Range Selector code                                                  *
 *****************************************************************************/
extend(defaultOptions, {

    /**
     * The range selector is a tool for selecting ranges to display within
     * the chart. It provides buttons to select preconfigured ranges in
     * the chart, like 1 day, 1 week, 1 month etc. It also provides input
     * boxes where min and max dates can be manually input.
     *
     * @product highstock
     * @optionparent rangeSelector
     */
    rangeSelector: {

        /**
         * Whether to enable all buttons from the start. By default buttons are
         * only enabled if the corresponding time range exists on the X axis,
         * but enabling all buttons allows for dynamically loading different
         * time ranges.
         *
         * @sample {highstock} stock/rangeselector/allbuttonsenabled-true/
         *         All buttons enabled
         *
         * @type       {boolean}
         * @default    false
         * @since      2.0.3
         * @product    highstock
         * @apioption  rangeSelector.allButtonsEnabled
         */

        /**
         * An array of configuration objects for the buttons.
         *
         * Defaults to
         *
         * <pre>buttons: [{
         *     type: 'month',
         *     count: 1,
         *     text: '1m'
         * }, {
         *     type: 'month',
         *     count: 3,
         *     text: '3m'
         * }, {
         *     type: 'month',
         *     count: 6,
         *     text: '6m'
         * }, {
         *     type: 'ytd',
         *     text: 'YTD'
         * }, {
         *     type: 'year',
         *     count: 1,
         *     text: '1y'
         * }, {
         *     type: 'all',
         *     text: 'All'
         * }]</pre>
         *
         * @sample {highstock} stock/rangeselector/datagrouping/
         *         Data grouping by buttons
         *
         * @type       {Array<*>}
         * @product    highstock
         * @apioption  rangeSelector.buttons
         */

        /**
         * How many units of the defined type the button should span. If `type`
         * is "month" and `count` is 3, the button spans three months.
         *
         * @type       {number}
         * @default    1
         * @product    highstock
         * @apioption  rangeSelector.buttons.count
         */

        /**
         * Fires when clicking on the rangeSelector button. One parameter,
         * event, is passed to the function, containing common event
         * information.
         *
         * <pre>
         * click: function(e) {
         *   console.log(this);
         * }
         * </pre>
         *
         * Return false to stop default button's click action.
         *
         * @sample {highstock} stock/rangeselector/button-click/
         *         Click event on the button
         *
         * @type       {Function}
         * @product    highstock
         * @apioption  rangeSelector.buttons.events.click
         */

        /**
         * Additional range (in milliseconds) added to the end of the calculated
         * time span.
         *
         * @sample {highstock} stock/rangeselector/min-max-offsets/
         *         Button offsets
         *
         * @type       {number}
         * @default    0
         * @since      6.0.0
         * @product    highstock
         * @apioption  rangeSelector.buttons.offsetMax
         */

        /**
         * Additional range (in milliseconds) added to the start of the
         * calculated time span.
         *
         * @sample {highstock} stock/rangeselector/min-max-offsets/
         *         Button offsets
         *
         * @type       {number}
         * @default    0
         * @since      6.0.0
         * @product    highstock
         * @apioption  rangeSelector.buttons.offsetMin
         */

        /**
         * When buttons apply dataGrouping on a series, by default zooming
         * in/out will deselect buttons and unset dataGrouping. Enable this
         * option to keep buttons selected when extremes change.
         *
         * @sample {highstock} stock/rangeselector/preserve-datagrouping/
         *         Different preserveDataGrouping settings
         *
         * @type       {boolean}
         * @since      6.1.2
         * @default    false
         * @product    highstock
         * @apioption  rangeSelector.buttons.preserveDataGrouping
         */

        /**
         * A custom data grouping object for each button.
         *
         * @see [series.dataGrouping](#plotOptions.series.dataGrouping)
         *
         * @sample {highstock} stock/rangeselector/datagrouping/
         *         Data grouping by range selector buttons
         *
         * @type       {*}
         * @extends    plotOptions.series.dataGrouping
         * @product    highstock
         * @apioption  rangeSelector.buttons.dataGrouping
         */

        /**
         * The text for the button itself.
         *
         * @type       {string}
         * @product    highstock
         * @apioption  rangeSelector.buttons.text
         */

        /**
         * Defined the time span for the button. Can be one of `millisecond`,
         * `second`, `minute`, `hour`, `day`, `week`, `month`, `ytd`, `all`.
         *
         * @type       {string}
         * @product    highstock
         * @validvalue ["millisecond", "second", "minute", "day", "week", "month", "ytd", "all"]
         * @apioption  rangeSelector.buttons.type
         */

        /**
         * The space in pixels between the buttons in the range selector.
         *
         * @type       {number}
         * @default    0
         * @product    highstock
         * @apioption  rangeSelector.buttonSpacing
         */

        /**
         * Enable or disable the range selector.
         *
         * @sample {highstock} stock/rangeselector/enabled/
         *         Disable the range selector
         *
         * @type       {boolean}
         * @default    true
         * @product    highstock
         * @apioption  rangeSelector.enabled
         */

        /**
         * The vertical alignment of the rangeselector box. Allowed properties
         * are `top`, `middle`, `bottom`.
         *
         * @sample {highstock} stock/rangeselector/vertical-align-middle/
         *         Middle
         * @sample {highstock} stock/rangeselector/vertical-align-bottom/
         *         Bottom
         *
         * @type       {string}
         * @default    top
         * @since      6.0.0
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  rangeSelector.verticalAlign
         */
        verticalAlign: 'top',

        /**
         * A collection of attributes for the buttons. The object takes SVG
         * attributes like `fill`, `stroke`, `stroke-width`, as well as `style`,
         * a collection of CSS properties for the text.
         *
         * The object can also be extended with states, so you can set
         * presentational options for `hover`, `select` or `disabled` button
         * states.
         *
         * CSS styles for the text label.
         *
         * In styled mode, the buttons are styled by the
         * `.highcharts-range-selector-buttons .highcharts-button` rule with its
         * different states.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {Highcharts.CSSObject}
         * @product    highstock
         * @apioption  rangeSelector.buttonTheme
         */
        buttonTheme: {
            /*= if (build.classic) { =*/
            'stroke-width': 0,
            /*= } =*/
            width: 28,
            height: 18,
            padding: 2,
            zIndex: 7 // #484, #852
        },

        /**
         * When the rangeselector is floating, the plot area does not reserve
         * space for it. This opens for positioning anywhere on the chart.
         *
         * @sample {highstock} stock/rangeselector/floating/
         *         Placing the range selector between the plot area and the
         *         navigator
         *
         * @type       {boolean}
         * @default    false
         * @since      6.0.0
         * @product    highstock
         * @apioption  rangeSelector.floating
         */
        floating: false,

        /**
         * The x offset of the range selector relative to its horizontal
         * alignment within `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @type       {number}
         * @default    0
         * @since      6.0.0
         * @product    highstock
         * @apioption  rangeSelector.x
         */
        x: 0,

        /**
         * The y offset of the range selector relative to its horizontal
         * alignment within `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @type       {number}
         * @default    0
         * @since      6.0.0
         * @product    highstock
         * @apioption  rangeSelector.y
         */
        y: 0,

        /**
         * Deprecated. The height of the range selector. Currently it is
         * calculated dynamically.
         *
         * @deprecated
         * @type       {number}
         * @default    undefined
         * @since      2.1.9
         * @product    highstock
         * @apioption  rangeSelector.height
         */
        height: undefined, // reserved space for buttons and input

        /**
         * The border color of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {Highcharts.ColorString}
         * @default    #cccccc
         * @since      1.3.7
         * @product    highstock
         * @apioption  rangeSelector.inputBoxBorderColor
         */

        /**
         * The pixel height of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {number}
         * @default    17
         * @since      1.3.7
         * @product    highstock
         * @apioption  rangeSelector.inputBoxHeight
         */

        /**
         * CSS for the container DIV holding the input boxes. Deprecated as
         * of 1.2.5\. Use [inputPosition](#rangeSelector.inputPosition) instead.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @deprecated
         * @type       {Highcharts.CSSObject}
         * @product    highstock
         * @apioption  rangeSelector.inputBoxStyle
         */

        /**
         * The pixel width of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {number}
         * @default    90
         * @since      1.3.7
         * @product    highstock
         * @apioption  rangeSelector.inputBoxWidth
         */

        /**
         * The date format in the input boxes when not selected for editing.
         * Defaults to `%b %e, %Y`.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type       {string}
         * @default    %b %e %Y,
         * @product    highstock
         * @apioption  rangeSelector.inputDateFormat
         */

        /**
         * A custom callback function to parse values entered in the input boxes
         * and return a valid JavaScript time as milliseconds since 1970.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type       {Function}
         * @since      1.3.3
         * @product    highstock
         * @apioption  rangeSelector.inputDateParser
         */

        /**
         * The date format in the input boxes when they are selected for
         * editing. This must be a format that is recognized by JavaScript
         * Date.parse.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type       {string}
         * @default    %Y-%m-%d
         * @product    highstock
         * @apioption  rangeSelector.inputEditDateFormat
         */

        /**
         * Enable or disable the date input boxes. Defaults to enabled when
         * there is enough space, disabled if not (typically mobile).
         *
         * @sample {highstock} stock/rangeselector/input-datepicker/
         *         Extending the input with a jQuery UI datepicker
         *
         * @type       {boolean}
         * @default    true
         * @product    highstock
         * @apioption  rangeSelector.inputEnabled
         */

        /**
         * Positioning for the input boxes. Allowed properties are `align`,
         *  `x` and `y`.
         *
         * @type       {*}
         * @since      1.2.4
         * @product    highstock
         * @apioption  rangeSelector.inputPosition
         */
        inputPosition: {
            /**
             * The alignment of the input box. Allowed properties are `left`,
             * `center`, `right`.
             *
             * @sample {highstock} stock/rangeselector/input-button-position/
             *         Alignment
             *
             * @type       {string}
             * @default    right
             * @since      6.0.0
             * @validvalue ["left", "center", "right"]
             * @apioption  rangeSelector.inputPosition.align
             */
            align: 'right',

            /**
             * X offset of the input row.
             *
             * @type       {number}
             * @default    0
             * @apioption  rangeSelector.inputPosition.x
             */
            x: 0,

            /**
             * Y offset of the input row.
             *
             * @type       {number}
             * @default    0
             * @apioption  rangeSelector.inputPosition.y
             */
            y: 0
        },

        /**
         * The index of the button to appear pre-selected.
         *
         * @type       {number}
         * @product    highstock
         * @apioption  rangeSelector.selected
         */

        /**
         * Positioning for the button row.
         *
         * @type       {*}
         * @since      1.2.4
         * @product    highstock
         * @apioption  rangeSelector.buttonPosition
         */
        buttonPosition: {

            /**
             * The alignment of the input box. Allowed properties are `left`,
             * `center`, `right`.
             *
             * @sample {highstock} stock/rangeselector/input-button-position/
             *         Alignment
             *
             * @type       {string}
             * @default    left
             * @since      6.0.0
             * @validvalue ["left", "center", "right"]
             * @apioption  rangeSelector.buttonPosition.align
             */
            align: 'left',

            /**
             * X offset of the button row.
             *
             * @type       {number}
             * @default    0
             * @apioption  rangeSelector.buttonPosition.x
             */
            x: 0,

            /**
             * Y offset of the button row.
             *
             * @type       {number}
             * @default    0
             * @apioption  rangeSelector.buttonPosition.y
             */
            y: 0
        },

        /*= if (build.classic) { =*/

        /**
         * CSS for the HTML inputs in the range selector.
         *
         * In styled mode, the inputs are styled by the
         * `.highcharts-range-input text` rule in SVG mode, and
         * `input.highcharts-range-selector` when active.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {Highcharts.CSSObject}
         * @product    highstock
         * @apioption  rangeSelector.inputStyle
         */

        /**
         * CSS styles for the labels - the Zoom, From and To texts.
         *
         * In styled mode, the labels are styled by the
         * `.highcharts-range-label` class.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type       {Highcharts.CSSObject}
         * @product    highstock
         * @apioption  rangeSelector.labelStyle
         */
        labelStyle: {
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
     * set it before any chart is initialized.
     *
     * <pre>Highcharts.setOptions({
     *     lang: {
     *         months: [
     *             'Janvier', 'Février', 'Mars', 'Avril',
     *             'Mai', 'Juin', 'Juillet', 'Août',
     *             'Septembre', 'Octobre', 'Novembre', 'Décembre'
     *         ],
     *         weekdays: [
     *             'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
     *             'Jeudi', 'Vendredi', 'Samedi'
     *         ]
     *     }
     * });</pre>
     *
     * @optionparent lang
     * @product highstock
     */
    {

        /**
         * The text for the label for the range selector buttons.
         *
         * @type       {string}
         * @default    Zoom
         * @product    highstock
         * @apioption  lang.rangeSelectorZoom
         */
        rangeSelectorZoom: 'Zoom',

        /**
         * The text for the label for the "from" input box in the range
         * selector.
         *
         * @type       {string}
         * @default    From
         * @product    highstock
         * @apioption  lang.rangeSelectorFrom
         */
        rangeSelectorFrom: 'From',

        /**
         * The text for the label for the "to" input box in the range selector.
         *
         * @type       {string}
         * @default    To
         * @product    highstock
         * @apioption  lang.rangeSelectorTo
         */
        rangeSelectorTo: 'To'
    }
);

/**
 * The range selector.
 *
 * @class Highcharts.RangeSelector
 *
 * @param {Highcharts.Chart} chart
 */
function RangeSelector(chart) {

    // Run RangeSelector
    this.init(chart);
}

RangeSelector.prototype = {
    /**
     * The method to run when one of the buttons in the range selectors is
     * clicked
     *
     * @function Highcharts.RangeSelector#clickButton
     *
     * @param  {number} i
     *         The index of the button
     *
     * @param  {boolean} redraw
     *
     * @return {void}
     */
    clickButton: function (i, redraw) {
        var rangeSelector = this,
            chart = rangeSelector.chart,
            rangeOptions = rangeSelector.buttonOptions[i],
            baseAxis = chart.xAxis[0],
            unionExtremes = (
                    chart.scroller && chart.scroller.getUnionExtremes()
                ) || baseAxis || {},
            dataMin = unionExtremes.dataMin,
            dataMax = unionExtremes.dataMax,
            newMin,
            newMax = baseAxis && Math.round(
                Math.min(baseAxis.max, pick(dataMax, baseAxis.max))
            ), // #1568
            type = rangeOptions.type,
            baseXAxisOptions,
            range = rangeOptions._range,
            rangeMin,
            minSetting,
            rangeSetting,
            ctx,
            ytdExtremes,
            dataGrouping = rangeOptions.dataGrouping;

        // chart has no data, base series is removed
        if (dataMin === null || dataMax === null) {
            return;
        }

        // Set the fixed range before range is altered
        chart.fixedRange = range;

        // Apply dataGrouping associated to button
        if (dataGrouping) {
            this.forcedDataGrouping = true;
            Axis.prototype.setDataGrouping.call(
                baseAxis || { chart: this.chart },
                dataGrouping,
                false
            );

            this.frozenStates = rangeOptions.preserveDataGrouping;
        }

        // Apply range
        if (type === 'month' || type === 'year') {
            if (!baseAxis) {
                // This is set to the user options and picked up later when the
                // axis is instantiated so that we know the min and max.
                range = rangeOptions;
            } else {
                ctx = {
                    range: rangeOptions,
                    max: newMax,
                    chart: chart,
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

            // On user clicks on the buttons, or a delayed action running from
            // the beforeRender event (below), the baseAxis is defined.
            if (baseAxis) {
                // When "ytd" is the pre-selected button for the initial view,
                // its calculation is delayed and rerun in the beforeRender
                // event (below). When the series are initialized, but before
                // the chart is rendered, we have access to the xData array
                // (#942).
                if (dataMax === undefined) {
                    dataMin = Number.MAX_VALUE;
                    dataMax = Number.MIN_VALUE;
                    each(chart.series, function (series) {
                        // reassign it to the last item
                        var xData = series.xData;
                        dataMin = Math.min(xData[0], dataMin);
                        dataMax = Math.max(xData[xData.length - 1], dataMax);
                    });
                    redraw = false;
                }
                ytdExtremes = rangeSelector.getYTDExtremes(
                    dataMax,
                    dataMin,
                    chart.time.useUTC
                );
                newMin = rangeMin = ytdExtremes.min;
                newMax = ytdExtremes.max;

            // "ytd" is pre-selected. We don't yet have access to processed
            // point and extremes data (things like pointStart and pointInterval
            // are missing), so we delay the process (#942)
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

        newMin += rangeOptions._offsetMin;
        newMax += rangeOptions._offsetMax;

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
     * Set the selected option. This method only sets the internal flag, it
     * doesn't update the buttons or the actual zoomed range.
     *
     * @function Highcharts.RangeSelector#setSelected
     *
     * @param  {boolean} selected
     *
     * @return {void}
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
     *
     * @function Highcharts.RangeSelector#init
     *
     * @param  {Highcharts.Chart} chart
     *
     * @return {void}
     */
    init: function (chart) {
        var rangeSelector = this,
            options = chart.options.rangeSelector,
            buttonOptions = options.buttons ||
                [].concat(rangeSelector.defaultButtons),
            selectedOption = options.selected,
            blurInputs = function () {
                var minInput = rangeSelector.minInput,
                    maxInput = rangeSelector.maxInput;

                // #3274 in some case blur is not defined
                if (minInput && minInput.blur) {
                    fireEvent(minInput, 'blur');
                }
                if (maxInput && maxInput.blur) {
                    fireEvent(maxInput, 'blur');
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
            // If a data grouping is applied to the current button, release it
            // when extremes change
            if (chart.xAxis && chart.xAxis[0]) {
                addEvent(chart.xAxis[0], 'setExtremes', function (e) {
                    if (
                        this.max - this.min !== chart.fixedRange &&
                        e.trigger !== 'rangeSelectorButton' &&
                        e.trigger !== 'updatedData' &&
                        rangeSelector.forcedDataGrouping &&
                        !rangeSelector.frozenStates
                    ) {
                        this.setDataGrouping(false, false);
                    }
                });
            }
        });
    },

    /**
     * Dynamically update the range selector buttons after a new range has been
     * set
     *
     * @function Highcharts.RangeSelector#updateButtonStates
     *
     * @return {void}
     */
    updateButtonStates: function () {
        var rangeSelector = this,
            chart = this.chart,
            baseAxis = chart.xAxis[0],
            actualRange = Math.round(baseAxis.max - baseAxis.min),
            hasNoData = !baseAxis.hasVisibleSeries,
            day = 24 * 36e5, // A single day in milliseconds
            unionExtremes = (
                chart.scroller &&
                chart.scroller.getUnionExtremes()
            ) || baseAxis,
            dataMin = unionExtremes.dataMin,
            dataMax = unionExtremes.dataMax,
            ytdExtremes = rangeSelector.getYTDExtremes(
                dataMax,
                dataMin,
                chart.time.useUTC
            ),
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
                offsetRange = rangeOptions._offsetMax - rangeOptions._offsetMin,
                isSelected = i === selected,
                // Disable buttons where the range exceeds what is allowed in
                // the current view
                isTooGreatRange = range > dataMax - dataMin,
                // Disable buttons where the range is smaller than the minimum
                // range
                isTooSmallRange = range < baseAxis.minRange,
                // Do not select the YTD button if not explicitly told so
                isYTDButNotSelected = false,
                // Disable the All button if we're already showing all
                isAllButAlreadyShowingAll = false,
                isSameRange = range === actualRange;
            // Months and years have a variable range so we check the extremes
            if (
                (type === 'month' || type === 'year') &&
                (
                    actualRange + 36e5 >=
                    { month: 28, year: 365 }[type] * day * count - offsetRange
                ) &&
                (
                    actualRange - 36e5 <=
                    { month: 31, year: 366 }[type] * day * count + offsetRange
                )
            ) {
                isSameRange = true;
            } else if (type === 'ytd') {
                isSameRange = (ytdMax - ytdMin + offsetRange) === actualRange;
                isYTDButNotSelected = !isSelected;
            } else if (type === 'all') {
                isSameRange = baseAxis.max - baseAxis.min >= dataMax - dataMin;
                isAllButAlreadyShowingAll = (
                    !isSelected &&
                    selectedExists &&
                    isSameRange
                );
            }

            // The new zoom area happens to match the range for a button - mark
            // it selected. This happens when scrolling across an ordinal gap.
            // It can be seen in the intraday demos when selecting 1h and scroll
            // across the night gap.
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
                (isSameRange && !selectedExists && !isYTDButNotSelected) ||
                (isSelected && rangeSelector.frozenStates)
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
     *
     * @function Highcharts.RangeSelector#computeButtonRange
     *
     * @param  {Highcharts.RangeSelectorOptions} rangeOptions
     *
     * @return {void}
     */
    computeButtonRange: function (rangeOptions) {
        var type = rangeOptions.type,
            count = rangeOptions.count || 1,

            // these time intervals have a fixed number of milliseconds, as
            // opposed to month, ytd and year
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
            rangeOptions._range =
                { month: 30, year: 365 }[type] * 24 * 36e5 * count;
        }

        rangeOptions._offsetMin = pick(rangeOptions.offsetMin, 0);
        rangeOptions._offsetMax = pick(rangeOptions.offsetMax, 0);
        rangeOptions._range +=
            rangeOptions._offsetMax - rangeOptions._offsetMin;
    },

    /**
     * Set the internal and displayed value of a HTML input for the dates
     *
     * @function Highcharts.RangeSelector#setInputValue
     *
     * @param  {string} name
     *
     * @param  {number} inputTime
     *
     * @return {void}
     */
    setInputValue: function (name, inputTime) {
        var options = this.chart.options.rangeSelector,
            time = this.chart.time,
            input = this[name + 'Input'];

        if (defined(inputTime)) {
            input.previousValue = input.HCTime;
            input.HCTime = inputTime;
        }

        input.value = time.dateFormat(
            options.inputEditDateFormat || '%Y-%m-%d',
            input.HCTime
        );
        this[name + 'DateBox'].attr({
            text: time.dateFormat(
                options.inputDateFormat || '%b %e, %Y',
                input.HCTime
            )
        });
    },

    /**
     * @function Highcharts.RangeSelector#showInput
     *
     * @param  {string} name
     *
     * @return {void}
     */
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

    /**
     * @function Highcharts.RangeSelector#hideInput
     *
     * @param  {string} name
     *
     * @return {void}
     */
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
     *
     * @function Highcharts.RangeSelector#drawInput
     *
     * @param  {string} name
     *
     * @return {void}
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
                dataAxis = chart.scroller && chart.scroller.xAxis ?
                    chart.scroller.xAxis :
                    chartAxis,
                dataMin = dataAxis.dataMin,
                dataMax = dataAxis.dataMax;
            if (value !== input.previousValue) {
                input.previousValue = value;
                // If the value isn't parsed directly to a value by the
                // browser's Date.parse method, like YYYY-MM-DD in IE, try
                // parsing it a different way
                if (!isNumber(value)) {
                    value = inputValue.split('-');
                    value = Date.UTC(
                        pInt(value[0]),
                        pInt(value[1]) - 1,
                        pInt(value[2])
                    );
                }

                if (isNumber(value)) {

                    // Correct for timezone offset (#433)
                    if (!chart.time.useUTC) {
                        value =
                            value + new Date().getTimezoneOffset() * 60 * 1000;
                    }

                    // Validate the extremes. If it goes beyound the data min or
                    // max, use the actual data extreme (#2438).
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
        this[name + 'Label'] = label = renderer.label(
                lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'],
                this.inputGroup.offset
            )
            .addClass('highcharts-range-label')
            .attr({
                padding: 2
            })
            .add(inputGroup);
        inputGroup.offset += label.width + 5;

        // Create an SVG label that shows updated date ranges and and records
        // click events that bring in the HTML input.
        this[name + 'DateBox'] = dateBox = renderer.label('', inputGroup.offset)
            .addClass('highcharts-range-input')
            .attr({
                padding: 2,
                width: options.inputBoxWidth || 90,
                height: options.inputBoxHeight || 17,
                'text-align': 'center',
                /*= if (build.classic) { =*/
                stroke:
                    options.inputBoxBorderColor || '${palette.neutralColor20}',
                'stroke-width': 1
                /*= } =*/
            })
            .on('click', function () {
                // If it is already focused, the onfocus event doesn't fire
                // (#3713)
                rangeSelector.showInput(name);
                rangeSelector[name + 'Input'].focus();
            })
            .add(inputGroup);
        inputGroup.offset += dateBox.width + (isMin ? 10 : 0);


        // Create the HTML input element. This is rendered as 1x1 pixel then set
        // to the right size when focused.
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
            top: '-9999em' // #4798
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
     * Get the position of the range selector buttons and inputs. This can be
     * overridden from outside for custom positioning.
     *
     * @function Highcharts.RangeSelector#getPosition
     *
     * @return {Highcharts.Dictionary<number>}
     */
    getPosition: function () {
        var chart = this.chart,
            options = chart.options.rangeSelector,
            top = options.verticalAlign === 'top' ?
                chart.plotTop - chart.axisOffset[0] :
                0; // set offset only for varticalAlign top

        return {
            buttonTop: top + options.buttonPosition.y,
            inputTop: top + options.inputPosition.y - 10
        };
    },
    /**
     * Get the extremes of YTD. Will choose dataMax if its value is lower than
     * the current timestamp. Will choose dataMin if its value is higher than
     * the timestamp for the start of current year.
     *
     * @function Highcharts.RangeSelector#getYTDExtremes
     *
     * @param  {number} dataMax
     *
     * @param  {number} dataMin
     *
     * @return {*}
     *         Returns min and max for the YTD
     */
    getYTDExtremes: function (dataMax, dataMin, useUTC) {
        var time = this.chart.time,
            min,
            now = new time.Date(dataMax),
            year = time.get('FullYear', now),
            startOfYear = useUTC ?
                time.Date.UTC(year, 0, 1) : // eslint-disable-line new-cap
                +new time.Date(year, 0, 1);
        min = Math.max(dataMin || 0, startOfYear);
        now = now.getTime();
        return {
            max: Math.min(dataMax || now, now),
            min: min
        };
    },

    /**
     * Render the range selector including the buttons and the inputs. The first
     * time render is called, the elements are created and positioned. On
     * subsequent calls, they are moved and updated.
     *
     * @function Highcharts.RangeSelector#render
     *
     * @param  {number} min
     *         X axis minimum
     *
     * @param  {number} max
     *         X axis maximum
     *
     * @return {void}
     */
    render: function (min, max) {

        var rangeSelector = this,
            chart = rangeSelector.chart,
            renderer = chart.renderer,
            container = chart.container,
            chartOptions = chart.options,
            navButtonOptions = (
                chartOptions.exporting &&
                chartOptions.exporting.enabled !== false &&
                chartOptions.navigation &&
                chartOptions.navigation.buttonOptions
            ),
            lang = defaultOptions.lang,
            div = rangeSelector.div,
            options = chartOptions.rangeSelector,
            // Place inputs above the container
            inputsZIndex = pick(
                chartOptions.chart.style &&
                chartOptions.chart.style.zIndex,
                0
            ) + 1,
            floating = options.floating,
            buttons = rangeSelector.buttons,
            inputGroup = rangeSelector.inputGroup,
            buttonTheme = options.buttonTheme,
            buttonPosition = options.buttonPosition,
            inputPosition = options.inputPosition,
            inputEnabled = options.inputEnabled,
            states = buttonTheme && buttonTheme.states,
            plotLeft = chart.plotLeft,
            buttonLeft,
            buttonGroup = rangeSelector.buttonGroup,
            group,
            groupHeight,
            rendered = rangeSelector.rendered,
            verticalAlign = rangeSelector.options.verticalAlign,
            legend = chart.legend,
            legendOptions = legend && legend.options,
            buttonPositionY = buttonPosition.y,
            inputPositionY = inputPosition.y,
            animate = rendered || false,
            verb = animate ? 'animate' : 'attr',
            exportingX = 0,
            alignTranslateY,
            legendHeight,
            minPosition,
            translateY = 0,
            translateX;

        if (options.enabled === false) {
            return;
        }

        // create the elements
        if (!rendered) {

            rangeSelector.group = group = renderer.g('range-selector-group')
                .attr({
                    zIndex: 7
                })
                .add();

            rangeSelector.buttonGroup = buttonGroup =
                renderer.g('range-selector-buttons').add(group);

            rangeSelector.zoomText = renderer.text(
                    lang.rangeSelectorZoom,
                    0,
                    15
                )
                .css(options.labelStyle)
                .add(buttonGroup);

            each(rangeSelector.buttonOptions, function (rangeOptions, i) {

                buttons[i] = renderer.button(
                        rangeOptions.text,
                        0,
                        0,
                        function () {

                            // extract events from button object and call
                            var buttonEvents = (
                                    rangeOptions.events &&
                                    rangeOptions.events.click
                                ),
                                callDefaultEvent;

                            if (buttonEvents) {
                                callDefaultEvent =
                                    buttonEvents.call(rangeOptions);
                            }

                            if (callDefaultEvent !== false) {
                                rangeSelector.clickButton(i);
                            }

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
            });

            // first create a wrapper outside the container in order to make
            // the inputs work and make export correct
            if (inputEnabled !== false) {
                rangeSelector.div = div = createElement('div', null, {
                    position: 'relative',
                    height: 0,
                    zIndex: inputsZIndex
                });

                container.parentNode.insertBefore(div, container);

                // Create the group to keep the inputs
                rangeSelector.inputGroup = inputGroup =
                    renderer.g('input-group').add(group);
                inputGroup.offset = 0;

                rangeSelector.drawInput('min');
                rangeSelector.drawInput('max');
            }
        }

        // #8769, allow dynamically updating margins
        rangeSelector.zoomText[verb]({
            x: pick(plotLeft + buttonPosition.x, plotLeft)
        });
        // button start position
        buttonLeft = pick(plotLeft + buttonPosition.x, plotLeft) +
            rangeSelector.zoomText.getBBox().width + 5;
        each(rangeSelector.buttonOptions, function (rangeOptions, i) {

            buttons[i][verb]({ x: buttonLeft });

            // increase button position for the next button
            buttonLeft += buttons[i].width + pick(options.buttonSpacing, 5);
        });


        plotLeft = chart.plotLeft - chart.spacing[3];
        rangeSelector.updateButtonStates();

        // detect collisiton with exporting
        if
            (
                navButtonOptions &&
                this.titleCollision(chart) &&
                verticalAlign === 'top' &&
                buttonPosition.align === 'right' &&
                (
                    (buttonPosition.y + buttonGroup.getBBox().height - 12) <
                    ((navButtonOptions.y || 0) + navButtonOptions.height)
                )
            ) {
            exportingX = -40;
        }

        if (buttonPosition.align === 'left') {
            translateX = buttonPosition.x - chart.spacing[3];
        } else if (buttonPosition.align === 'right') {
            translateX = buttonPosition.x + exportingX - chart.spacing[1];
        }

        // align button group
        buttonGroup.align({
            y: buttonPosition.y,
            width: buttonGroup.getBBox().width,
            align: buttonPosition.align,
            x: translateX
        }, true, chart.spacingBox);

        // skip animation
        rangeSelector.group.placed = animate;
        rangeSelector.buttonGroup.placed = animate;

        if (inputEnabled !== false) {

            var inputGroupX,
                inputGroupWidth,
                buttonGroupX,
                buttonGroupWidth;

            // detect collision with exporting
            if
                (
                    navButtonOptions &&
                    this.titleCollision(chart) &&
                    verticalAlign === 'top' &&
                    inputPosition.align === 'right' &&
                    (
                        (inputPosition.y - inputGroup.getBBox().height - 12) <
                        (
                            (navButtonOptions.y || 0) +
                            navButtonOptions.height +
                            chart.spacing[0]
                        )
                    )
                ) {
                exportingX = -40;
            } else {
                exportingX = 0;
            }

            if (inputPosition.align === 'left') {
                translateX = plotLeft;
            } else if (inputPosition.align === 'right') {
                translateX = -Math.max(chart.axisOffset[1], -exportingX);
            }

            // Update the alignment to the updated spacing box
            inputGroup.align({
                y: inputPosition.y,
                width: inputGroup.getBBox().width,
                align: inputPosition.align,
                // fix wrong getBBox() value on right align
                x: inputPosition.x + translateX - 2
            }, true, chart.spacingBox);

            // detect collision
            inputGroupX = (
                inputGroup.alignAttr.translateX +
                inputGroup.alignOptions.x -
                exportingX +
                // getBBox for detecing left margin
                inputGroup.getBBox().x +
                // 2px padding to not overlap input and label
                2
            );

            inputGroupWidth = inputGroup.alignOptions.width;

            buttonGroupX = buttonGroup.alignAttr.translateX +
                buttonGroup.getBBox().x;
            // 20 is minimal spacing between elements
            buttonGroupWidth = buttonGroup.getBBox().width + 20;

            if (
                    (inputPosition.align === buttonPosition.align) ||
                    (
                        (buttonGroupX + buttonGroupWidth > inputGroupX) &&
                        (inputGroupX + inputGroupWidth > buttonGroupX) &&
                        (
                            buttonPositionY <
                            (inputPositionY + inputGroup.getBBox().height)
                        )
                    )
                ) {

                inputGroup.attr({
                    translateX: inputGroup.alignAttr.translateX +
                        (chart.axisOffset[1] >= -exportingX ? 0 : -exportingX),
                    translateY: inputGroup.alignAttr.translateY +
                        buttonGroup.getBBox().height + 10
                });

            }

            // Set or reset the input values
            rangeSelector.setInputValue('min', min);
            rangeSelector.setInputValue('max', max);

            // skip animation
            rangeSelector.inputGroup.placed = animate;
        }

        // vertical align
        rangeSelector.group.align({
            verticalAlign: verticalAlign
        }, true, chart.spacingBox);

        // set position
        groupHeight = rangeSelector.group.getBBox().height + 20; // # 20 padding
        alignTranslateY = rangeSelector.group.alignAttr.translateY;

        // calculate bottom position
        if (verticalAlign === 'bottom') {
            legendHeight = (
                legendOptions &&
                legendOptions.verticalAlign === 'bottom' &&
                legendOptions.enabled &&
                !legendOptions.floating ?
                    legend.legendHeight + pick(legendOptions.margin, 10) :
                    0
            );

            groupHeight = groupHeight + legendHeight - 20;
            translateY = (
                alignTranslateY -
                groupHeight -
                (floating ? 0 : options.y) -
                10 // 10 spacing
            );

        }

        if (verticalAlign === 'top') {
            if (floating) {
                translateY = 0;
            }

            if (chart.titleOffset) {
                translateY = chart.titleOffset + chart.options.title.margin;
            }

            translateY += ((chart.margin[0] - chart.spacing[0]) || 0);

        } else if (verticalAlign === 'middle') {
            if (inputPositionY === buttonPositionY) {
                if (inputPositionY < 0) {
                    translateY = alignTranslateY + minPosition;
                } else {
                    translateY = alignTranslateY;
                }
            } else if (inputPositionY || buttonPositionY) {
                if (inputPositionY < 0 || buttonPositionY < 0) {
                    translateY -= Math.min(inputPositionY, buttonPositionY);
                } else {
                    translateY = alignTranslateY - groupHeight + minPosition;
                }
            }
        }

        rangeSelector.group.translate(
            options.x,
            options.y + Math.floor(translateY)
        );

        // translate HTML inputs
        if (inputEnabled !== false) {
            rangeSelector.minInput.style.marginTop =
                rangeSelector.group.translateY + 'px';
            rangeSelector.maxInput.style.marginTop =
                rangeSelector.group.translateY + 'px';
        }

        rangeSelector.rendered = true;
    },

    /**
     * Extracts height of range selector
     *
     * @function Highcharts.RangeSelector#getHeight
     *
     * @return {number}
     *         Returns rangeSelector height
     */
    getHeight: function () {
        var rangeSelector = this,
            options = rangeSelector.options,
            rangeSelectorGroup = rangeSelector.group,
            inputPosition = options.inputPosition,
            buttonPosition = options.buttonPosition,
            yPosition = options.y,
            buttonPositionY = buttonPosition.y,
            inputPositionY = inputPosition.y,
            rangeSelectorHeight = 0,
            minPosition;

        rangeSelectorHeight = rangeSelectorGroup ?
            // 13px to keep back compatibility
            (rangeSelectorGroup.getBBox(true).height) + 13 + yPosition :
            0;

        minPosition = Math.min(inputPositionY, buttonPositionY);

        if (
            (inputPositionY < 0 && buttonPositionY < 0) ||
            (inputPositionY > 0 && buttonPositionY > 0)
        ) {
            rangeSelectorHeight += Math.abs(minPosition);
        }

        return rangeSelectorHeight;
    },

    /**
     * Detect collision with title or subtitle
     *
     * @function Highcharts.RangeSelector#titleCollision
     *
     * @param  {Highcharts.Chart} chart
     *
     * @return {boolean}
     *         Returns collision status
     */
    titleCollision: function (chart) {
        return !(chart.options.title.text || chart.options.subtitle.text);
    },

    /**
     * Update the range selector with new options
     *
     * @function Highcharts.RangeSelector#update
     *
     * @param  {Highcharts.RangeSelectorOptions} options
     *
     * @return {void}
     */
    update: function (options) {
        var chart = this.chart;

        merge(true, chart.options.rangeSelector, options);
        this.destroy();
        this.init(chart);
        chart.rangeSelector.render();
    },

    /**
     * Destroys allocated elements.
     *
     * @function Highcharts.RangeSelector#destroy
     *
     * @return {void}
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
 * Add logic to normalize the zoomed range in order to preserve the pressed
 * state of range selector buttons
 *
 * @function Highcharts.Axis#toFixedRange
 *
 * @param  {number} pxMin
 *
 * @param  {number} pxMax
 *
 * @param  {number} fixedMin
 *
 * @param  {number} fixedMax
 *
 * @return {*}
 */
Axis.prototype.toFixedRange = function (pxMin, pxMax, fixedMin, fixedMax) {
    var fixedRange = this.chart && this.chart.fixedRange,
        newMin = pick(fixedMin, this.translate(pxMin, true, !this.horiz)),
        newMax = pick(fixedMax, this.translate(pxMax, true, !this.horiz)),
        changeRatio = fixedRange && (newMax - newMin) / fixedRange;

    // If the difference between the fixed range and the actual requested range
    // is too great, the user is dragging across an ordinal gap, and we need to
    // release the range selector button.
    if (changeRatio > 0.7 && changeRatio < 1.3) {
        if (fixedMax) {
            newMin = newMax - fixedRange;
        } else {
            newMax = newMin + fixedRange;
        }
    }
    if (!isNumber(newMin) || !isNumber(newMax)) { // #1195, #7411
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
 * @function Highcharts.Axis#minFromRange
 *
 * @return {number}
 *         The new minimum value.
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

// Initialize rangeselector for stock charts
addEvent(Chart, 'afterGetContainer', function () {
    if (this.options.rangeSelector.enabled) {
        this.rangeSelector = new RangeSelector(this);
    }
});

wrap(Chart.prototype, 'render', function (proceed, options, callback) {

    var chart = this,
        axes = chart.axes,
        rangeSelector = chart.rangeSelector,
        verticalAlign;

    if (rangeSelector) {

        each(axes, function (axis) {
            axis.updateNames();
            axis.setScale();
        });

        chart.getAxisMargins();

        rangeSelector.render();
        verticalAlign = rangeSelector.options.verticalAlign;

        if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
                this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
                this.extraTopMargin = true;
            }
        }
    }

    proceed.call(this, options, callback);

});

addEvent(Chart, 'update', function (e) {

    var chart = this,
        options = e.options,
        optionsRangeSelector = options.rangeSelector,
        rangeSelector = chart.rangeSelector,
        verticalAlign,
        extraBottomMarginWas = this.extraBottomMargin,
        extraTopMarginWas = this.extraTopMargin;

    if (
        optionsRangeSelector &&
        optionsRangeSelector.enabled &&
        !defined(rangeSelector)
    ) {
        this.options.rangeSelector.enabled = true;
        this.rangeSelector = new RangeSelector(this);
    }


    this.extraBottomMargin = false;
    this.extraTopMargin = false;

    if (rangeSelector) {

        rangeSelector.render();

        verticalAlign = (
            optionsRangeSelector &&
            optionsRangeSelector.verticalAlign
        ) || (
            rangeSelector.options && rangeSelector.options.verticalAlign
        );

        if (!rangeSelector.options.floating) {
            if (verticalAlign === 'bottom') {
                this.extraBottomMargin = true;
            } else if (verticalAlign !== 'middle') {
                this.extraTopMargin = true;
            }
        }

        if (
            this.extraBottomMargin !== extraBottomMarginWas ||
            this.extraTopMargin !== extraTopMarginWas
        ) {
            this.isDirtyBox = true;
        }

    }

});

wrap(Chart.prototype, 'redraw', function (proceed, options, callback) {
    var chart = this,
        rangeSelector = chart.rangeSelector,
        verticalAlign;

    if (rangeSelector && !rangeSelector.options.floating) {

        rangeSelector.render();
        verticalAlign = rangeSelector.options.verticalAlign;

        if (verticalAlign === 'bottom') {
            this.extraBottomMargin = true;
        } else if (verticalAlign !== 'middle') {
            this.extraTopMargin = true;
        }
    }

    proceed.call(this, options, callback);
});

addEvent(Chart, 'getMargins', function () {
    var rangeSelector = this.rangeSelector,
        rangeSelectorHeight;

    if (rangeSelector) {
        rangeSelectorHeight = rangeSelector.getHeight();

        if (this.extraTopMargin) {
            this.plotTop += rangeSelectorHeight;
        }

        if (this.extraBottomMargin) {
            this.marginBottom += rangeSelectorHeight;
        }
    }
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
 * End Range Selector code                                                     *
 *****************************************************************************/
