/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type RangeSelectorButtonTypeValue = (
            'all'|'day'|'hour'|'millisecond'|'minute'|'month'|'second'|'week'|
            'year'|'ytd'
        );
        interface Axis {
            newMax?: number;
            range?: (null|number|RangeSelectorButtonsOptions);
        }
        interface Chart {
            extraBottomMargin?: boolean;
            extraTopMargin?: boolean;
            fixedRange?: number;
            rangeSelector?: RangeSelector;
        }
        interface Options {
            rangeSelector?: RangeSelectorOptions;
        }
        interface RangeSelectorClickCallbackFunction {
            (e: Event): (boolean|undefined);
        }
        interface RangeSelectorParseCallbackFunction {
            (value: string): number;
        }
        interface RangeSelectorButtonPositionOptions {
            align?: AlignValue;
            x?: number;
            y?: number;
        }
        interface RangeSelectorButtonsEventsOptions {
            click?: RangeSelectorClickCallbackFunction;
        }
        interface RangeSelectorButtonsOptions {
            _offsetMax?: number;
            _offsetMin?: number;
            _range?: number;
            count?: number;
            dataGrouping?: DataGroupingOptionsObject;
            events?: RangeSelectorButtonsEventsOptions;
            offsetMax?: number;
            offsetMin?: number;
            preserveDataGrouping?: boolean;
            text?: string;
            type?: RangeSelectorButtonTypeValue;
        }
        interface RangeSelectorInputElement extends HTMLDOMElement {
            previousValue?: number;
            value?: string;
        }
        interface RangeSelectorInputPositionOptions {
            align?: AlignValue;
            x?: number;
            y?: number;
        }
        interface RangeSelectorOptions {
            allButtonsEnabled?: boolean;
            buttonPosition?: RangeSelectorButtonPositionOptions;
            buttons?: Array<RangeSelectorButtonsOptions>;
            buttonSpacing?: number;
            buttonTheme?: SVGAttributes;
            enabled?: boolean;
            floating?: boolean;
            height?: (number|undefined);
            inputBoxBorderColor?: ColorString;
            inputBoxHeight?: number;
            inputBoxStyle?: CSSObject;
            inputBoxWidth?: number;
            inputDateFormat?: string;
            inputDateParser?: RangeSelectorParseCallbackFunction;
            inputEditDateFormat?: string;
            inputEnabled?: boolean;
            inputPosition?: RangeSelectorInputPositionOptions;
            inputStyle?: CSSObject;
            labelStyle?: CSSObject;
            selected?: number;
            verticalAlign?: VerticalAlignValue;
            x?: number;
            y?: number;
        }
        class RangeSelector {
            public constructor(chart: Chart);
            public buttons: Array<SVGElement>;
            public buttonGroup?: SVGElement;
            public buttonOptions: Array<RangeSelectorButtonsOptions>;
            public chart: Chart;
            public defaultButtons: Array<RangeSelectorButtonsOptions>;
            public deferredYTDClick?: number;
            public div?: HTMLDOMElement;
            public forcedDataGrouping?: boolean;
            public frozenStates?: boolean;
            public group?: SVGElement;
            public inputGroup?: SVGElement;
            public isActive?: boolean;
            public options: RangeSelectorOptions;
            public rendered?: boolean;
            public selected?: number;
            public unMouseDown?: Function;
            public unResize?: Function;
            public zoomText?: SVGElement;
            public clickButton(i: number, redraw?: boolean): void;
            public computeButtonRange(
                rangeOptions: RangeSelectorButtonsOptions
            ): void;
            public destroy(): void;
            public drawInput(name: string): void;
            public getHeight(): number;
            public getPosition(): Dictionary<number>;
            public getYTDExtremes(
                dataMax: number,
                dataMin: number,
                useUTC?: boolean
            ): RangeObject;
            public hideInput(name: string): void;
            public init(chart: Chart): void;
            public render(min?: number, max?: number): void;
            public setInputValue(name: string, inputTime?: number): void;
            public setSelected(selected: number): void;
            public showInput(name: string): void;
            public titleCollision(chart: Chart): boolean;
            public update(options: Highcharts.RangeSelectorOptions): void;
            public updateButtonStates(): void;
        }
    }
}

/**
 * Define the time span for the button
 *
 * @typedef {"all"|"day"|"hour"|"millisecond"|"minute"|"month"|"second"|"week"|"year"|"ytd"} Highcharts.RangeSelectorButtonTypeValue
 */

/**
 * Callback function to react on button clicks.
 *
 * @callback Highcharts.RangeSelectorClickCallbackFunction
 *
 * @param {global.Event} e
 *        Event arguments.
 *
 * @param {boolean|undefined}
 *        Return false to cancel the default button event.
 */

/**
 * Callback function to parse values entered in the input boxes and return a
 * valid JavaScript time as milliseconds since 1970.
 *
 * @callback Highcharts.RangeSelectorParseCallbackFunction
 *
 * @param {string} value
 *        Input value to parse.
 *
 * @return {number}
 *         Parsed JavaScript time value.
 */

import U from './Utilities.js';
const {
    defined,
    destroyObjectProperties,
    discardElement,
    extend,
    isNumber,
    objectEach,
    pick,
    pInt,
    splat
} = U;

import './Axis.js';
import './Chart.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    Chart = H.Chart,
    css = H.css,
    createElement = H.createElement,
    defaultOptions = H.defaultOptions,
    fireEvent = H.fireEvent,
    merge = H.merge;

/* ************************************************************************** *
 * Start Range Selector code                                                  *
 * ************************************************************************** */
extend(defaultOptions, {

    /**
     * The range selector is a tool for selecting ranges to display within
     * the chart. It provides buttons to select preconfigured ranges in
     * the chart, like 1 day, 1 week, 1 month etc. It also provides input
     * boxes where min and max dates can be manually input.
     *
     * @product      highstock gantt
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
         * @type      {boolean}
         * @default   false
         * @since     2.0.3
         * @apioption rangeSelector.allButtonsEnabled
         */

        /**
         * An array of configuration objects for the buttons.
         *
         * Defaults to:
         * ```js
         * buttons: [{
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
         * }]
         * ```
         *
         * @sample {highstock} stock/rangeselector/datagrouping/
         *         Data grouping by buttons
         *
         * @type      {Array<*>}
         * @apioption rangeSelector.buttons
         */

        /**
         * How many units of the defined type the button should span. If `type`
         * is "month" and `count` is 3, the button spans three months.
         *
         * @type      {number}
         * @default   1
         * @apioption rangeSelector.buttons.count
         */

        /**
         * Fires when clicking on the rangeSelector button. One parameter,
         * event, is passed to the function, containing common event
         * information.
         *
         * ```js
         * click: function(e) {
         *   console.log(this);
         * }
         * ```
         *
         * Return false to stop default button's click action.
         *
         * @sample {highstock} stock/rangeselector/button-click/
         *         Click event on the button
         *
         * @type      {Highcharts.RangeSelectorClickCallbackFunction}
         * @apioption rangeSelector.buttons.events.click
         */

        /**
         * Additional range (in milliseconds) added to the end of the calculated
         * time span.
         *
         * @sample {highstock} stock/rangeselector/min-max-offsets/
         *         Button offsets
         *
         * @type      {number}
         * @default   0
         * @since     6.0.0
         * @apioption rangeSelector.buttons.offsetMax
         */

        /**
         * Additional range (in milliseconds) added to the start of the
         * calculated time span.
         *
         * @sample {highstock} stock/rangeselector/min-max-offsets/
         *         Button offsets
         *
         * @type      {number}
         * @default   0
         * @since     6.0.0
         * @apioption rangeSelector.buttons.offsetMin
         */

        /**
         * When buttons apply dataGrouping on a series, by default zooming
         * in/out will deselect buttons and unset dataGrouping. Enable this
         * option to keep buttons selected when extremes change.
         *
         * @sample {highstock} stock/rangeselector/preserve-datagrouping/
         *         Different preserveDataGrouping settings
         *
         * @type      {boolean}
         * @default   false
         * @since     6.1.2
         * @apioption rangeSelector.buttons.preserveDataGrouping
         */

        /**
         * A custom data grouping object for each button.
         *
         * @see [series.dataGrouping](#plotOptions.series.dataGrouping)
         *
         * @sample {highstock} stock/rangeselector/datagrouping/
         *         Data grouping by range selector buttons
         *
         * @type      {*}
         * @extends   plotOptions.series.dataGrouping
         * @apioption rangeSelector.buttons.dataGrouping
         */

        /**
         * The text for the button itself.
         *
         * @type      {string}
         * @apioption rangeSelector.buttons.text
         */

        /**
         * Defined the time span for the button. Can be one of `millisecond`,
         * `second`, `minute`, `hour`, `day`, `week`, `month`, `year`, `ytd`,
         * and `all`.
         *
         * @type       {Highcharts.RangeSelectorButtonTypeValue}
         * @apioption  rangeSelector.buttons.type
         */

        /**
         * The space in pixels between the buttons in the range selector.
         *
         * @type      {number}
         * @default   0
         * @apioption rangeSelector.buttonSpacing
         */

        /**
         * Enable or disable the range selector.
         *
         * @sample {highstock} stock/rangeselector/enabled/
         *         Disable the range selector
         *
         * @type      {boolean}
         * @default   true
         * @apioption rangeSelector.enabled
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
         * @type  {Highcharts.VerticalAlignValue}
         * @since 6.0.0
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
         * @type {Highcharts.SVGAttributes}
         */
        buttonTheme: {
            /** @ignore */
            width: 28,
            /** @ignore */
            height: 18,
            /** @ignore */
            padding: 2,
            /** @ignore */
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
         * @since 6.0.0
         */
        floating: false,

        /**
         * The x offset of the range selector relative to its horizontal
         * alignment within `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @since 6.0.0
         */
        x: 0,

        /**
         * The y offset of the range selector relative to its horizontal
         * alignment within `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @since 6.0.0
         */
        y: 0,

        /**
         * Deprecated. The height of the range selector. Currently it is
         * calculated dynamically.
         *
         * @deprecated
         * @type  {number|undefined}
         * @since 2.1.9
         */
        height: void 0, // reserved space for buttons and input

        /**
         * The border color of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type      {Highcharts.ColorString}
         * @default   #cccccc
         * @since     1.3.7
         * @apioption rangeSelector.inputBoxBorderColor
         */

        /**
         * The pixel height of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type      {number}
         * @default   17
         * @since     1.3.7
         * @apioption rangeSelector.inputBoxHeight
         */

        /**
         * CSS for the container DIV holding the input boxes. Deprecated as
         * of 1.2.5\. Use [inputPosition](#rangeSelector.inputPosition) instead.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @deprecated
         * @type      {Highcharts.CSSObject}
         * @apioption rangeSelector.inputBoxStyle
         */

        /**
         * The pixel width of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type      {number}
         * @default   90
         * @since     1.3.7
         * @apioption rangeSelector.inputBoxWidth
         */

        /**
         * The date format in the input boxes when not selected for editing.
         * Defaults to `%b %e, %Y`.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type      {string}
         * @default   %b %e, %Y
         * @apioption rangeSelector.inputDateFormat
         */

        /**
         * A custom callback function to parse values entered in the input boxes
         * and return a valid JavaScript time as milliseconds since 1970.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type      {Highcharts.RangeSelectorParseCallbackFunction}
         * @since     1.3.3
         * @apioption rangeSelector.inputDateParser
         */

        /**
         * The date format in the input boxes when they are selected for
         * editing. This must be a format that is recognized by JavaScript
         * Date.parse.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type      {string}
         * @default   %Y-%m-%d
         * @apioption rangeSelector.inputEditDateFormat
         */

        /**
         * Enable or disable the date input boxes. Defaults to enabled when
         * there is enough space, disabled if not (typically mobile).
         *
         * @sample {highstock} stock/rangeselector/input-datepicker/
         *         Extending the input with a jQuery UI datepicker
         *
         * @type      {boolean}
         * @default   true
         * @apioption rangeSelector.inputEnabled
         */

        /**
         * Positioning for the input boxes. Allowed properties are `align`,
         *  `x` and `y`.
         *
         * @since 1.2.4
         */
        inputPosition: {

            /**
             * The alignment of the input box. Allowed properties are `left`,
             * `center`, `right`.
             *
             * @sample {highstock} stock/rangeselector/input-button-position/
             *         Alignment
             *
             * @type  {Highcharts.AlignValue}
             * @since 6.0.0
             */
            align: 'right',

            /**
             * X offset of the input row.
             */
            x: 0,

            /**
             * Y offset of the input row.
             */
            y: 0
        },

        /**
         * The index of the button to appear pre-selected.
         *
         * @type      {number}
         * @apioption rangeSelector.selected
         */

        /**
         * Positioning for the button row.
         *
         * @since 1.2.4
         */
        buttonPosition: {

            /**
             * The alignment of the input box. Allowed properties are `left`,
             * `center`, `right`.
             *
             * @sample {highstock} stock/rangeselector/input-button-position/
             *         Alignment
             *
             * @type  {Highcharts.AlignValue}
             * @since 6.0.0
             */
            align: 'left',

            /**
             * X offset of the button row.
             */
            x: 0,

            /**
             * Y offset of the button row.
             */
            y: 0
        },

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
         * @type      {Highcharts.CSSObject}
         * @apioption rangeSelector.inputStyle
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
         * @type {Highcharts.CSSObject}
         */
        labelStyle: {
            /** @ignore */
            color: '${palette.neutralColor60}'
        }
    }
});

defaultOptions.lang = merge(

    defaultOptions.lang,

    /**
     * Language object. The language object is global and it can't be set
     * on each chart initialization. Instead, use `Highcharts.setOptions` to
     * set it before any chart is initialized.
     *
     * ```js
     * Highcharts.setOptions({
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
     * });
     * ```
     *
     * @optionparent lang
     */
    {

        /**
         * The text for the label for the range selector buttons.
         *
         * @product highstock gantt
         */
        rangeSelectorZoom: 'Zoom',

        /**
         * The text for the label for the "from" input box in the range
         * selector.
         *
         * @product highstock gantt
         */
        rangeSelectorFrom: 'From',

        /**
         * The text for the label for the "to" input box in the range selector.
         *
         * @product highstock gantt
         */
        rangeSelectorTo: 'To'
    }
);

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The range selector.
 *
 * @private
 * @class
 * @name Highcharts.RangeSelector
 * @param {Highcharts.Chart} chart
 */
function RangeSelector(
    this: Highcharts.RangeSelector,
    chart: Highcharts.Chart
): void {

    // Run RangeSelector
    this.init(chart);
}

RangeSelector.prototype = {
    /**
     * The method to run when one of the buttons in the range selectors is
     * clicked
     *
     * @private
     * @function Highcharts.RangeSelector#clickButton
     * @param {number} i
     *        The index of the button
     * @param {boolean} [redraw]
     * @return {void}
     */
    clickButton: function (
        this: Highcharts.RangeSelector,
        i: number,
        redraw?: boolean
    ): void {
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
                Math.min(
                    baseAxis.max as any, pick(dataMax, baseAxis.max as any)
                )
            ), // #1568
            type = rangeOptions.type,
            baseXAxisOptions: Highcharts.AxisOptions,
            range = rangeOptions._range,
            rangeMin,
            minSetting: (number|null|undefined),
            rangeSetting: (number|undefined),
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
                range = rangeOptions as any;
            } else {
                ctx = {
                    range: rangeOptions,
                    max: newMax,
                    chart: chart,
                    dataMin: dataMin,
                    dataMax: dataMax
                } as Highcharts.Axis;
                newMin = baseAxis.minFromRange.call(ctx);
                if (isNumber(ctx.newMax)) {
                    newMax = ctx.newMax as any;
                }
            }

        // Fixed times like minutes, hours, days
        } else if (range) {
            newMin = Math.max(newMax - range, dataMin as any);
            newMax = Math.min(newMin + range, dataMax as any);

        } else if (type === 'ytd') {

            // On user clicks on the buttons, or a delayed action running from
            // the beforeRender event (below), the baseAxis is defined.
            if (baseAxis) {
                // When "ytd" is the pre-selected button for the initial view,
                // its calculation is delayed and rerun in the beforeRender
                // event (below). When the series are initialized, but before
                // the chart is rendered, we have access to the xData array
                // (#942).
                if (typeof dataMax === 'undefined') {
                    dataMin = Number.MAX_VALUE;
                    dataMax = Number.MIN_VALUE;
                    chart.series.forEach(function (
                        series: Highcharts.Series
                    ): void {
                        // reassign it to the last item
                        var xData = series.xData;

                        dataMin = Math.min((xData as any)[0], dataMin as any);
                        dataMax = Math.max(
                            (xData as any)[(xData as any).length - 1],
                            dataMax as any
                        );
                    });
                    redraw = false;
                }
                ytdExtremes = rangeSelector.getYTDExtremes(
                    dataMax,
                    dataMin as any,
                    chart.time.useUTC
                );
                newMin = rangeMin = ytdExtremes.min;
                newMax = ytdExtremes.max;

            // "ytd" is pre-selected. We don't yet have access to processed
            // point and extremes data (things like pointStart and pointInterval
            // are missing), so we delay the process (#942)
            } else {
                rangeSelector.deferredYTDClick = i;
                return;
            }
        } else if (type === 'all' && baseAxis) {
            newMin = dataMin;
            newMax = dataMax as any;
        }

        newMin += rangeOptions._offsetMin as any;
        newMax += rangeOptions._offsetMax as any;

        rangeSelector.setSelected(i);

        // Update the chart
        if (!baseAxis) {
            // Axis not yet instanciated. Temporarily set min and range
            // options and remove them on chart load (#4317).
            baseXAxisOptions = splat(chart.options.xAxis as any)[0];
            rangeSetting = baseXAxisOptions.range;
            baseXAxisOptions.range = range;
            minSetting = baseXAxisOptions.min;
            baseXAxisOptions.min = rangeMin;
            addEvent(chart, 'load', function resetMinAndRange(): void {
                baseXAxisOptions.range = rangeSetting;
                baseXAxisOptions.min = minSetting;
            });
        } else {
            // Existing axis object. Set extremes after render time.
            baseAxis.setExtremes(
                newMin,
                newMax,
                pick(redraw, 1 as any),
                null as any, // auto animation
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
     * @private
     * @function Highcharts.RangeSelector#setSelected
     * @param {number} [selected]
     * @return {void}
     */
    setSelected: function (
        this: Highcharts.RangeSelector,
        selected?: number
    ): void {
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
     * @private
     * @function Highcharts.RangeSelector#init
     * @param {Highcharts.Chart} chart
     * @return {void}
     */
    init: function (
        this: Highcharts.RangeSelector,
        chart: Highcharts.Chart
    ): void {
        var rangeSelector = this,
            options =
                chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            buttonOptions = options.buttons ||
                [].concat(rangeSelector.defaultButtons as any),
            selectedOption = options.selected,
            blurInputs = function (): void {
                var minInput = (rangeSelector as any).minInput,
                    maxInput = (rangeSelector as any).maxInput;

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

        rangeSelector.buttonOptions = buttonOptions;

        this.unMouseDown = addEvent(chart.container, 'mousedown', blurInputs);
        this.unResize = addEvent(chart, 'resize', blurInputs);

        // Extend the buttonOptions with actual range
        buttonOptions.forEach(rangeSelector.computeButtonRange);

        // zoomed range based on a pre-selected button index
        if (
            typeof selectedOption !== 'undefined' &&
            buttonOptions[selectedOption]
        ) {
            this.clickButton(selectedOption, false);
        }


        addEvent(chart, 'load', function (): void {
            // If a data grouping is applied to the current button, release it
            // when extremes change
            if (chart.xAxis && chart.xAxis[0]) {
                addEvent(chart.xAxis[0], 'setExtremes', function (
                    this: Highcharts.Axis,
                    e: any
                ): void {
                    if (
                        (this.max as any) - (this.min as any) !==
                            chart.fixedRange &&
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
     * @private
     * @function Highcharts.RangeSelector#updateButtonStates
     * @return {void}
     */
    updateButtonStates: function (this: Highcharts.RangeSelector): void {
        var rangeSelector = this,
            chart = this.chart,
            baseAxis = chart.xAxis[0],
            actualRange = Math.round(
                (baseAxis.max as any) - (baseAxis.min as any)
            ),
            hasNoData = !baseAxis.hasVisibleSeries,
            day = 24 * 36e5, // A single day in milliseconds
            unionExtremes = (
                chart.scroller &&
                chart.scroller.getUnionExtremes()
            ) || baseAxis,
            dataMin = unionExtremes.dataMin,
            dataMax = unionExtremes.dataMax,
            ytdExtremes = rangeSelector.getYTDExtremes(
                dataMax as any,
                dataMin as any,
                chart.time.useUTC
            ),
            ytdMin = ytdExtremes.min,
            ytdMax = ytdExtremes.max,
            selected = rangeSelector.selected,
            selectedExists = isNumber(selected),
            allButtonsEnabled = rangeSelector.options.allButtonsEnabled,
            buttons = rangeSelector.buttons;

        rangeSelector.buttonOptions.forEach(function (
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void {
            var range = rangeOptions._range,
                type = rangeOptions.type,
                count = rangeOptions.count || 1,
                button = buttons[i],
                state = 0,
                disable,
                select,
                offsetRange =
                    (rangeOptions._offsetMax as any) -
                    (rangeOptions._offsetMin as any),
                isSelected = i === selected,
                // Disable buttons where the range exceeds what is allowed in
                // the current view
                isTooGreatRange = (range as any) >
                    (dataMax as any) - (dataMin as any),
                // Disable buttons where the range is smaller than the minimum
                // range
                isTooSmallRange = (range as any) < (baseAxis.minRange as any),
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
                isSameRange = (
                    (baseAxis.max as any) - (baseAxis.min as any) >=
                    (dataMax as any) - (dataMin as any)
                );
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

                // Reset (#9209)
                if (state === 0 && selected === i) {
                    rangeSelector.setSelected(null as any);
                }
            }
        });
    },

    /**
     * Compute and cache the range for an individual button
     *
     * @private
     * @function Highcharts.RangeSelector#computeButtonRange
     * @param {Highcharts.RangeSelectorButtonsOptions} rangeOptions
     * @return {void}
     */
    computeButtonRange: function (
        this: Highcharts.RangeSelector,
        rangeOptions: Highcharts.RangeSelectorButtonsOptions
    ): void {
        var type = rangeOptions.type as string,
            count = rangeOptions.count || 1,

            // these time intervals have a fixed number of milliseconds, as
            // opposed to month, ytd and year
            fixedTimes = ({
                millisecond: 1,
                second: 1000,
                minute: 60 * 1000,
                hour: 3600 * 1000,
                day: 24 * 3600 * 1000,
                week: 7 * 24 * 3600 * 1000
            } as Highcharts.Dictionary<number>);

        // Store the range on the button object
        if (fixedTimes[type]) {
            rangeOptions._range = fixedTimes[type] * count;
        } else if (type === 'month' || type === 'year') {
            rangeOptions._range = ({
                month: 30,
                year: 365
            } as Highcharts.Dictionary<number>)[type] * 24 * 36e5 * count;
        }

        rangeOptions._offsetMin = pick(rangeOptions.offsetMin, 0);
        rangeOptions._offsetMax = pick(rangeOptions.offsetMax, 0);
        (rangeOptions._range as any) +=
            (rangeOptions._offsetMax as any) - (rangeOptions._offsetMin as any);
    },

    /**
     * Set the internal and displayed value of a HTML input for the dates
     *
     * @private
     * @function Highcharts.RangeSelector#setInputValue
     * @param {string} name
     * @param {number} [inputTime]
     * @return {void}
     */
    setInputValue: function (
        this: Highcharts.RangeSelector,
        name: string,
        inputTime?: number
    ): void {
        var options =
            this.chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            time = this.chart.time,
            input = (this as any)[name + 'Input'];

        if (defined(inputTime)) {
            input.previousValue = input.HCTime;
            input.HCTime = inputTime;
        }

        input.value = time.dateFormat(
            options.inputEditDateFormat || '%Y-%m-%d',
            input.HCTime
        );
        (this as any)[name + 'DateBox'].attr({
            text: time.dateFormat(
                options.inputDateFormat || '%b %e, %Y',
                input.HCTime
            )
        });
    },

    /**
     * @private
     * @function Highcharts.RangeSelector#showInput
     * @param {string} name
     * @return {void}
     */
    showInput: function (this: Highcharts.RangeSelector, name: string): void {
        var inputGroup = this.inputGroup,
            dateBox = (this as any)[name + 'DateBox'];

        css((this as any)[name + 'Input'], {
            left: ((inputGroup as any).translateX + dateBox.x) + 'px',
            top: (inputGroup as any).translateY + 'px',
            width: (dateBox.width - 2) + 'px',
            height: (dateBox.height - 2) + 'px',
            border: '2px solid silver'
        } as Highcharts.CSSObject);
    },

    /**
     * @private
     * @function Highcharts.RangeSelector#hideInput
     * @param {string} name
     * @return {void}
     */
    hideInput: function (this: Highcharts.RangeSelector, name: string): void {
        css((this as any)[name + 'Input'], {
            border: 0,
            width: '1px',
            height: '1px'
        });
        this.setInputValue(name);
    },

    /**
     * Draw either the 'from' or the 'to' HTML input box of the range selector
     *
     * @private
     * @function Highcharts.RangeSelector#drawInput
     * @param {string} name
     * @return {void}
     */
    drawInput: function (this: Highcharts.RangeSelector, name: string): void {
        var rangeSelector = this,
            chart = rangeSelector.chart,
            chartStyle = chart.renderer.style || {},
            renderer = chart.renderer,
            options =
               chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            lang = defaultOptions.lang,
            div = rangeSelector.div,
            isMin = name === 'min',
            input: Highcharts.RangeSelectorInputElement,
            label,
            dateBox,
            inputGroup = this.inputGroup;

        /**
         * @private
         */
        function updateExtremes(): void {
            var inputValue = input.value,
                value: (number|undefined) =
                    (options.inputDateParser || Date.parse)(inputValue as any),
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
                    value = (inputValue as any).split('-');
                    value = Date.UTC(
                        pInt((value as any)[0]),
                        pInt((value as any)[1]) - 1,
                        pInt((value as any)[2])
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
                        if (value > (rangeSelector as any).maxInput.HCTime) {
                            value = void 0;
                        } else if (value < (dataMin as any)) {
                            value = dataMin as any;
                        }
                    } else {
                        if (value < (rangeSelector as any).minInput.HCTime) {
                            value = void 0;
                        } else if (value > (dataMax as any)) {
                            value = dataMax as any;
                        }
                    }

                    // Set the extremes
                    if (typeof value !== 'undefined') { // @todo typof undefined
                        chartAxis.setExtremes(
                            isMin ? value : (chartAxis.min as any),
                            isMin ? (chartAxis.max as any) : value,
                            void 0,
                            void 0,
                            { trigger: 'rangeSelectorInput' }
                        );
                    }
                }
            }
        }

        // Create the text label
        (this as any)[name + 'Label'] = label = renderer
            .label(
                (lang as any)[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'],
                (this.inputGroup as any).offset
            )
            .addClass('highcharts-range-label')
            .attr({
                padding: 2
            })
            .add(inputGroup);
        (inputGroup as any).offset += label.width + 5;

        // Create an SVG label that shows updated date ranges and and records
        // click events that bring in the HTML input.
        (this as any)[name + 'DateBox'] = dateBox = renderer
            .label('', (inputGroup as any).offset)
            .addClass('highcharts-range-input')
            .attr({
                padding: 2,
                width: options.inputBoxWidth || 90,
                height: options.inputBoxHeight || 17,
                'text-align': 'center'
            })
            .on('click', function (): void {
                // If it is already focused, the onfocus event doesn't fire
                // (#3713)
                rangeSelector.showInput(name);
                (rangeSelector as any)[name + 'Input'].focus();
            });

        if (!chart.styledMode) {
            dateBox.attr({
                stroke:
                    options.inputBoxBorderColor || '${palette.neutralColor20}',
                'stroke-width': 1
            });
        }

        dateBox.add(inputGroup);

        (inputGroup as any).offset += dateBox.width + (isMin ? 10 : 0);


        // Create the HTML input element. This is rendered as 1x1 pixel then set
        // to the right size when focused.
        (this as any)[name + 'Input'] = input = createElement('input', {
            name: name,
            className: 'highcharts-range-selector',
            type: 'text'
        }, {
            top: chart.plotTop + 'px' // prevent jump on focus in Firefox
        }, div);

        if (!chart.styledMode) {
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
            } as Highcharts.CSSObject, options.inputStyle as any));
        }

        // Blow up the input box
        input.onfocus = function (): void {
            rangeSelector.showInput(name);
        };
        // Hide away the input box
        input.onblur = function (): void {
            // update extermes only when inputs are active
            if (input === H.doc.activeElement) { // Only when focused
                // Update also when no `change` event is triggered, like when
                // clicking inside the SVG (#4710)
                updateExtremes();
            }
            // #10404 - move hide and blur outside focus
            rangeSelector.hideInput(name);
            input.blur(); // #4606
        };

        // handle changes in the input boxes
        input.onchange = updateExtremes;

        input.onkeypress = function (event: KeyboardEvent): void {
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
     * @private
     * @function Highcharts.RangeSelector#getPosition
     *
     * @return {Highcharts.Dictionary<number>}
     */
    getPosition: function (
        this: Highcharts.RangeSelector
    ): Highcharts.Dictionary<number> {
        var chart = this.chart,
            options =
                chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            top = options.verticalAlign === 'top' ?
                chart.plotTop - chart.axisOffset[0] :
                0; // set offset only for varticalAlign top

        return {
            buttonTop: top + (options.buttonPosition as any).y,
            inputTop: top + (options.inputPosition as any).y - 10
        };
    },
    /**
     * Get the extremes of YTD. Will choose dataMax if its value is lower than
     * the current timestamp. Will choose dataMin if its value is higher than
     * the timestamp for the start of current year.
     *
     * @private
     * @function Highcharts.RangeSelector#getYTDExtremes
     *
     * @param {number} dataMax
     *
     * @param {number} dataMin
     *
     * @return {*}
     *         Returns min and max for the YTD
     */
    getYTDExtremes: function (
        this: Highcharts.RangeSelector,
        dataMax: number,
        dataMin: number,
        useUTC?: boolean
    ): Highcharts.RangeObject {
        var time = this.chart.time,
            min,
            now = new time.Date(dataMax),
            year = time.get('FullYear', now),
            startOfYear = useUTC ?
                time.Date.UTC(year, 0, 1) : // eslint-disable-line new-cap
                +new time.Date(year, 0, 1);

        min = Math.max(dataMin || 0, startOfYear);
        now = now.getTime() as any;
        return {
            max: Math.min(dataMax || (now as any), now as any),
            min: min
        };
    },

    /**
     * Render the range selector including the buttons and the inputs. The first
     * time render is called, the elements are created and positioned. On
     * subsequent calls, they are moved and updated.
     *
     * @private
     * @function Highcharts.RangeSelector#render
     * @param {number} [min]
     *        X axis minimum
     * @param {number} [max]
     *        X axis maximum
     * @return {void}
     */
    render: function (
        this: Highcharts.RangeSelector,
        min?: number,
        max?: number
    ): void {

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
            options =
                chartOptions.rangeSelector as Highcharts.RangeSelectorOptions,
            // Place inputs above the container
            inputsZIndex = pick(
                (chartOptions.chart as any).style &&
                (chartOptions.chart as any).style.zIndex,
                0
            ) + 1,
            floating = options.floating,
            buttons = rangeSelector.buttons,
            inputGroup = rangeSelector.inputGroup as Highcharts.SVGElement,
            buttonTheme = options.buttonTheme,
            buttonPosition = options.buttonPosition,
            inputPosition = options.inputPosition,
            inputEnabled = options.inputEnabled,
            states = buttonTheme && buttonTheme.states,
            plotLeft = chart.plotLeft,
            buttonLeft: number,
            buttonGroup = rangeSelector.buttonGroup as Highcharts.SVGElement,
            group: Highcharts.SVGElement,
            groupHeight,
            rendered = rangeSelector.rendered,
            verticalAlign = rangeSelector.options.verticalAlign,
            legend = chart.legend,
            legendOptions = legend && legend.options,
            buttonPositionY = (buttonPosition as any).y,
            inputPositionY = (inputPosition as any).y,
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

            rangeSelector.zoomText = renderer
                .text(
                    (lang as any).rangeSelectorZoom,
                    0,
                    15
                )
                .add(buttonGroup);

            if (!chart.styledMode) {

                rangeSelector.zoomText.css(options.labelStyle as any);

                (buttonTheme as any)['stroke-width'] =
                    pick((buttonTheme as any)['stroke-width'], 0);
            }

            rangeSelector.buttonOptions.forEach(function (
                rangeOptions: Highcharts.RangeSelectorButtonsOptions,
                i: number
            ): void {

                buttons[i] = renderer
                    .button(
                        rangeOptions.text as any,
                        0,
                        0,
                        function (e: (Event|Highcharts.Dictionary<any>)): void {

                            // extract events from button object and call
                            var buttonEvents = (
                                    rangeOptions.events &&
                                        rangeOptions.events.click
                                ),
                                callDefaultEvent;

                            if (buttonEvents) {
                                callDefaultEvent =
                                    buttonEvents.call(rangeOptions, e as any);
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
                rangeSelector.div = div = createElement('div', null as any, {
                    position: 'relative',
                    height: 0,
                    zIndex: inputsZIndex
                });

                (container.parentNode as any).insertBefore(div, container);

                // Create the group to keep the inputs
                rangeSelector.inputGroup = inputGroup =
                    renderer.g('input-group').add(group);
                inputGroup.offset = 0;

                rangeSelector.drawInput('min');
                rangeSelector.drawInput('max');
            }
        }

        // #8769, allow dynamically updating margins
        (rangeSelector as any).zoomText[verb]({
            x: pick(plotLeft + (buttonPosition as any).x, plotLeft)
        });
        // button start position
        buttonLeft = pick(plotLeft + (buttonPosition as any).x, plotLeft) +
            (rangeSelector.zoomText as any).getBBox().width + 5;
        rangeSelector.buttonOptions.forEach(function (
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void {

            buttons[i][verb]({ x: buttonLeft });

            // increase button position for the next button
            buttonLeft += buttons[i].width + pick(options.buttonSpacing, 5);
        });


        plotLeft = chart.plotLeft - chart.spacing[3];
        rangeSelector.updateButtonStates();

        // detect collisiton with exporting
        if (navButtonOptions &&
            this.titleCollision(chart) &&
            verticalAlign === 'top' &&
            (buttonPosition as any).align === 'right' && (
            ((buttonPosition as any).y +
                buttonGroup.getBBox().height - 12) <
            ((navButtonOptions.y || 0) +
                (navButtonOptions.height as any)))
        ) {
            exportingX = -40;
        }

        if ((buttonPosition as any).align === 'left') {
            translateX = (buttonPosition as any).x - chart.spacing[3];
        } else if ((buttonPosition as any).align === 'right') {
            translateX =
                (buttonPosition as any).x + exportingX - chart.spacing[1];
        }

        // align button group
        buttonGroup.align({
            y: (buttonPosition as any).y,
            width: buttonGroup.getBBox().width,
            align: (buttonPosition as any).align,
            x: translateX
        } as Highcharts.AlignObject, true, chart.spacingBox);

        // skip animation
        (rangeSelector.group as any).placed = animate;
        (rangeSelector.buttonGroup as any).placed = animate;

        if (inputEnabled !== false) {

            var inputGroupX,
                inputGroupWidth,
                buttonGroupX,
                buttonGroupWidth;

            // detect collision with exporting
            if (navButtonOptions &&
                this.titleCollision(chart) &&
                verticalAlign === 'top' &&
                (inputPosition as any).align === 'right' && (
                ((inputPosition as any).y -
                    inputGroup.getBBox().height - 12) <
                ((navButtonOptions.y || 0) +
                    (navButtonOptions.height as any) +
                    chart.spacing[0]))
            ) {
                exportingX = -40;
            } else {
                exportingX = 0;
            }

            if ((inputPosition as any).align === 'left') {
                translateX = plotLeft;
            } else if ((inputPosition as any).align === 'right') {
                translateX = -Math.max(chart.axisOffset[1], -exportingX);
            }

            // Update the alignment to the updated spacing box
            inputGroup.align({
                y: (inputPosition as any).y,
                width: inputGroup.getBBox().width,
                align: (inputPosition as any).align,
                // fix wrong getBBox() value on right align
                x: (inputPosition as any).x + (translateX as any) - 2
            } as Highcharts.AlignObject, true, chart.spacingBox);

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

            if (((inputPosition as any).align ===
                (buttonPosition as any).align) || (
                (buttonGroupX + buttonGroupWidth > inputGroupX) &&
                (inputGroupX + inputGroupWidth > buttonGroupX) &&
                ((buttonPositionY as any) <
                    ((inputPositionY as any) +
                    inputGroup.getBBox().height)))
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
            (rangeSelector.inputGroup as any).placed = animate;
        }

        // vertical align
        (rangeSelector.group as any).align({
            verticalAlign: verticalAlign
        }, true, chart.spacingBox);

        // set position
        groupHeight =
            (rangeSelector.group as any).getBBox().height + 20; // # 20 padding
        alignTranslateY =
            (rangeSelector.group as any).alignAttr.translateY;

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
                (floating ? 0 : (options.y as any)) -
                (chart.titleOffset ? chart.titleOffset[2] : 0) -
                10 // 10 spacing
            );
        }

        if (verticalAlign === 'top') {
            if (floating) {
                translateY = 0;
            }

            if (chart.titleOffset && chart.titleOffset[0]) {
                translateY = chart.titleOffset[0];
            }

            translateY += ((chart.margin[0] - chart.spacing[0]) || 0);

        } else if (verticalAlign === 'middle') {
            if (inputPositionY === buttonPositionY) {
                if ((inputPositionY as any) < 0) {
                    translateY = alignTranslateY + minPosition;
                } else {
                    translateY = alignTranslateY;
                }
            } else if (inputPositionY || buttonPositionY) {
                if ((inputPositionY as any) < 0 ||
                    (buttonPositionY as any) < 0
                ) {
                    translateY -= Math.min(
                        inputPositionY as any,
                        buttonPositionY as any
                    );
                } else {
                    translateY =
                        alignTranslateY - groupHeight + (minPosition as any);
                }
            }
        }

        (rangeSelector.group as any).translate(
            options.x,
            (options.y as any) + Math.floor(translateY)
        );

        // translate HTML inputs
        if (inputEnabled !== false) {
            (rangeSelector as any).minInput.style.marginTop =
                (rangeSelector.group as any).translateY + 'px';
            (rangeSelector as any).maxInput.style.marginTop =
                (rangeSelector.group as any).translateY + 'px';
        }

        rangeSelector.rendered = true;
    },

    /**
     * Extracts height of range selector
     *
     * @private
     * @function Highcharts.RangeSelector#getHeight
     * @return {number}
     *         Returns rangeSelector height
     */
    getHeight: function (this: Highcharts.RangeSelector): number {
        var rangeSelector = this,
            options = rangeSelector.options,
            rangeSelectorGroup = rangeSelector.group,
            inputPosition = options.inputPosition,
            buttonPosition = options.buttonPosition,
            yPosition = options.y,
            buttonPositionY = (buttonPosition as any).y,
            inputPositionY = (inputPosition as any).y,
            rangeSelectorHeight = 0,
            minPosition;

        if (options.height) {
            return options.height;
        }

        rangeSelectorHeight = rangeSelectorGroup ?
            // 13px to keep back compatibility
            (rangeSelectorGroup.getBBox(true).height) + 13 +
                (yPosition as any) :
            0;

        minPosition = Math.min(inputPositionY as any, buttonPositionY as any);

        if (((inputPositionY as any) < 0 && (buttonPositionY as any) < 0) ||
            ((inputPositionY as any) > 0 && (buttonPositionY as any) > 0)
        ) {
            rangeSelectorHeight += Math.abs(minPosition);
        }

        return rangeSelectorHeight;
    },

    /**
     * Detect collision with title or subtitle
     *
     * @private
     * @function Highcharts.RangeSelector#titleCollision
     *
     * @param {Highcharts.Chart} chart
     *
     * @return {boolean}
     *         Returns collision status
     */
    titleCollision: function (
        this: Highcharts.RangeSelector,
        chart: Highcharts.Chart
    ): boolean {
        return !(
            (chart.options.title as any).text ||
            (chart.options.subtitle as any).text
        );
    },

    /**
     * Update the range selector with new options
     *
     * @private
     * @function Highcharts.RangeSelector#update
     * @param {Highcharts.RangeSelectorOptions} options
     * @return {void}
     */
    update: function (
        this: Highcharts.RangeSelector,
        options: Highcharts.RangeSelectorOptions
    ): void {
        var chart = this.chart;
        merge(true, chart.options.rangeSelector, options);

        this.destroy();
        this.init(chart);

        (chart.rangeSelector as any).render();
    },

    /**
     * Destroys allocated elements.
     *
     * @private
     * @function Highcharts.RangeSelector#destroy
     */
    destroy: function (this: Highcharts.RangeSelector): void {
        var rSelector = this,
            minInput = (rSelector as any).minInput,
            maxInput = (rSelector as any).maxInput;

        (rSelector.unMouseDown as any)();
        (rSelector.unResize as any)();

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
        objectEach(rSelector, function (val: unknown, key: string): void {
            if (val && key !== 'chart') {
                if ((val as Highcharts.SVGElement).destroy) {
                    // SVGElement
                    (val as Highcharts.SVGElement).destroy();
                } else if ((val as Highcharts.HTMLDOMElement).nodeType) {
                    // HTML element
                    discardElement((this as any)[key]);
                }
            }
            if (val !== RangeSelector.prototype[key]) {
                (rSelector as any)[key] = null;
            }
        }, this);
    }
};

/**
 * Get the axis min value based on the range option and the current max. For
 * stock charts this is extended via the {@link RangeSelector} so that if the
 * selected range is a multiple of months or years, it is compensated for
 * various month lengths.
 *
 * @private
 * @function Highcharts.Axis#minFromRange
 * @return {number|undefined}
 *         The new minimum value.
 */
Axis.prototype.minFromRange = function (
    this: Highcharts.Axis
): (number|undefined) {
    var rangeOptions = this.range,
        type = (rangeOptions as any).type,
        timeName = ({
            month: 'Month',
            year: 'FullYear'
        } as Highcharts.Dictionary<string>)[type],
        min,
        max = this.max as any,
        dataMin,
        range,
        time = this.chart.time,
        // Get the true range from a start date
        getTrueRange = function (base: number, count: number): number {
            var date = new time.Date(base),
                basePeriod = time.get(timeName, date);

            time.set(timeName, date, basePeriod + count);

            if (basePeriod === time.get(timeName, date)) {
                time.set('Date', date, 0); // #6537
            }

            return date.getTime() - base;
        };

    if (isNumber(rangeOptions)) {
        min = max - (rangeOptions as any);
        range = rangeOptions;
    } else {
        min = max + getTrueRange(max, -(rangeOptions as any).count);

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
        if (typeof range === 'undefined') { // #4501
            range = getTrueRange(min, (rangeOptions as any).count);
        }
        this.newMax = Math.min(min + range, this.dataMax as any);
    }
    if (!isNumber(max)) {
        min = void 0;
    }
    return min;

};

if (!H.RangeSelector) {
    // Initialize rangeselector for stock charts
    addEvent(Chart, 'afterGetContainer', function (
        this: Highcharts.Chart
    ): void {
        if ((this.options.rangeSelector as any).enabled) {
            this.rangeSelector = new (RangeSelector as any)(this);
        }
    });

    addEvent(Chart, 'beforeRender', function (this: Highcharts.Chart): void {

        var chart = this,
            axes = chart.axes,
            rangeSelector = chart.rangeSelector,
            verticalAlign;

        if (rangeSelector) {

            if (isNumber(rangeSelector.deferredYTDClick)) {
                rangeSelector.clickButton(rangeSelector.deferredYTDClick);
                delete rangeSelector.deferredYTDClick;
            }

            axes.forEach(function (axis: Highcharts.Axis): void {
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

    });

    addEvent(Chart, 'update', function (
        this: Highcharts.Chart,
        e: Highcharts.Chart
    ): void {

        var chart = this,
            options = e.options,
            optionsRangeSelector =
                options.rangeSelector as Highcharts.RangeSelectorOptions,
            rangeSelector = chart.rangeSelector,
            verticalAlign,
            extraBottomMarginWas = this.extraBottomMargin,
            extraTopMarginWas = this.extraTopMargin;

        if (
            optionsRangeSelector &&
            optionsRangeSelector.enabled &&
            !defined(rangeSelector)
        ) {
            (this.options.rangeSelector as any).enabled = true;
            this.rangeSelector = new (RangeSelector as any)(this);
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

    addEvent(Chart, 'render', function (this: Highcharts.Chart): void {
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
    });

    addEvent(Chart, 'getMargins', function (
        this: Highcharts.Chart
    ): void {
        var rangeSelector = this.rangeSelector,
            rangeSelectorHeight;

        if (rangeSelector) {
            rangeSelectorHeight = rangeSelector.getHeight();
            if (this.extraTopMargin) {
                this.plotTop += rangeSelectorHeight;
            }

            if (this.extraBottomMargin) {
                (this.marginBottom as any) += rangeSelectorHeight;
            }
        }
    });

    Chart.prototype.callbacks.push(function (chart: Highcharts.Chart): void {
        var extremes,
            rangeSelector = chart.rangeSelector,
            unbindRender: Function,
            unbindSetExtremes: Function;

        /**
         * @private
         */
        function renderRangeSelector(): void {
            extremes = chart.xAxis[0].getExtremes();
            if (isNumber(extremes.min)) {
                (rangeSelector as any).render(extremes.min, extremes.max);
            }
        }

        if (rangeSelector) {
            // redraw the scroller on setExtremes
            unbindSetExtremes = addEvent(
                chart.xAxis[0],
                'afterSetExtremes',
                function (e: Highcharts.RangeObject): void {
                    (rangeSelector as any).render(e.min, e.max);
                }
            );

            // redraw the scroller chart resize
            unbindRender = addEvent(chart, 'redraw', renderRangeSelector);

            // do it now
            renderRangeSelector();
        }

        // Remove resize/afterSetExtremes at chart destroy
        addEvent(chart, 'destroy', function destroyEvents(): void {
            if (rangeSelector) {
                unbindRender();
                unbindSetExtremes();
            }
        });
    });


    H.RangeSelector = RangeSelector as any;
}
