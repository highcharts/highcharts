/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type ButtonThemeObject from '../Core/Renderer/SVG/ButtonThemeObject';
import type ColorString from '../Core/Color/ColorString';
import type CSSObject from '../Core/Renderer/CSSObject';
import type {
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import Axis from '../Core/Axis/Axis.js';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import O from '../Core/Options.js';
const { defaultOptions } = O;
import palette from '../Core/Color/Palette.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    createElement,
    css,
    defined,
    destroyObjectProperties,
    discardElement,
    extend,
    find,
    fireEvent,
    isNumber,
    merge,
    objectEach,
    pad,
    pick,
    pInt,
    splat
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        extraBottomMargin?: boolean;
        extraTopMargin?: boolean;
        fixedRange?: number;
        rangeSelector?: Highcharts.RangeSelector;
    }
}

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
        interface Options {
            rangeSelector?: DeepPartial<RangeSelectorOptions>;
        }
        interface LangOptions {
            rangeSelectorFrom?: string;
            rangeSelectorTo?: string;
            rangeSelectorZoom?: string;
        }
        interface RangeSelectorClickCallbackFunction {
            (e: Event): (boolean|undefined);
        }
        interface RangeSelectorParseCallbackFunction {
            (value: string, useUTC: boolean, time?: Time): number;
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
            title?: string;
            events?: RangeSelectorButtonsEventsOptions;
            offsetMax?: number;
            offsetMin?: number;
            preserveDataGrouping?: boolean;
            text: string;
            type?: RangeSelectorButtonTypeValue;
        }
        interface RangeSelectorInputElements {
            dateBox: SVGElement;
            input: HTMLInputElement;
            label: SVGElement;
        }
        interface RangeSelectorOptions {
            allButtonsEnabled: boolean;
            buttonPosition: RangeSelectorPositionOptions;
            buttons?: Array<RangeSelectorButtonsOptions>;
            buttonSpacing: number;
            buttonTheme: ButtonThemeObject;
            dropdown: 'always'|'never'|'responsive';
            enabled?: boolean;
            floating: boolean;
            height?: number;
            inputBoxBorderColor: ColorString;
            inputBoxHeight: number;
            inputBoxWidth?: number;
            inputDateFormat: string;
            inputDateParser?: RangeSelectorParseCallbackFunction;
            inputEditDateFormat: string;
            inputEnabled: boolean;
            inputPosition: RangeSelectorPositionOptions;
            inputSpacing: number;
            inputStyle: CSSObject;
            labelStyle: CSSObject;
            selected?: number;
            verticalAlign: VerticalAlignValue;
            x: number;
            y: number;
        }
        interface RangeSelectorPositionOptions {
            align: AlignValue;
            x: number;
            y: number;
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
            public dropdown?: HTMLSelectElement;
            public eventsToUnbind?: Array<Function>;
            public forcedDataGrouping?: boolean;
            public frozenStates?: boolean;
            public group?: SVGElement;
            public hasVisibleDropdown?: boolean;
            public inputGroup?: SVGElement;
            public isActive?: boolean;
            public maxDateBox?: SVGElement;
            public maxInput?: HTMLInputElement;
            public minDateBox?: SVGElement;
            public minInput?: HTMLInputElement;
            public options: RangeSelectorOptions;
            public rendered?: boolean;
            public selected?: number;
            public zoomText?: SVGElement;
            public clickButton(i: number, redraw?: boolean): void;
            public computeButtonRange(
                rangeOptions: RangeSelectorButtonsOptions
            ): void;
            public destroy(): void;
            public drawInput(name: ('min'|'max')): RangeSelectorInputElements;
            public getHeight(): number;
            public getInputValue(name: string): number;
            public getPosition(): Record<string, number>;
            public getYTDExtremes(
                dataMax: number,
                dataMin: number,
                useUTC?: boolean
            ): RangeObject;
            public hideInput(name: string): void;
            public init(chart: Chart): void;
            public render(min?: number, max?: number): void;
            public setInputExtremes(name: string, min: number, max: number): void;
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
         * @since     2.0.3
         */
        allButtonsEnabled: false,

        /**
         * An array of configuration objects for the buttons.
         *
         * Defaults to:
         * ```js
         * buttons: [{
         *     type: 'month',
         *     count: 1,
         *     text: '1m',
         *     title: 'View 1 month'
         * }, {
         *     type: 'month',
         *     count: 3,
         *     text: '3m',
         *     title: 'View 3 months'
         * }, {
         *     type: 'month',
         *     count: 6,
         *     text: '6m',
         *     title: 'View 6 months'
         * }, {
         *     type: 'ytd',
         *     text: 'YTD',
         *     title: 'View year to date'
         * }, {
         *     type: 'year',
         *     count: 1,
         *     text: '1y',
         *     title: 'View 1 year'
         * }, {
         *     type: 'all',
         *     text: 'All',
         *     title: 'View all'
         * }]
         * ```
         *
         * @sample {highstock} stock/rangeselector/datagrouping/
         *         Data grouping by buttons
         *
         * @type      {Array<*>}
         */
        buttons: void 0,

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
         * Explanation for the button, shown as a tooltip on hover, and used by
         * assistive technology.
         *
         * @type      {string}
         * @apioption rangeSelector.buttons.title
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
         */
        buttonSpacing: 5,

        /**
         * Whether to collapse the range selector buttons into a dropdown when
         * there is not enough room to show everything in a single row, instead
         * of dividing the range selector into multiple rows.
         * Can be one of the following:
         *  - `always`: Always collapse
         *  - `responsive`: Only collapse when there is not enough room
         *  - `never`: Never collapse
         *
         * @sample {highstock} stock/rangeselector/dropdown/
         *         Dropdown option
         *
         * @validvalue ["always", "responsive", "never"]
         * @since 9.0.0
         */
        dropdown: 'responsive',

        /**
         * Enable or disable the range selector. Default to `true` for stock
         * charts, using the `stockChart` factory.
         *
         * @sample {highstock} stock/rangeselector/enabled/
         *         Disable the range selector
         *
         * @type {boolean|undefined}
         * @default {highstock} true
         */
        enabled: void 0,

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
         * @since     1.3.7
         */
        inputBoxBorderColor: 'none',

        /**
         * The pixel height of the date input boxes.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @since     1.3.7
         */
        inputBoxHeight: 17,

        /**
         * The pixel width of the date input boxes. When `undefined`, the width
         * is fitted to the rendered content.
         *
         * @sample {highstock} stock/rangeselector/styling/
         *         Styling the buttons and inputs
         *
         * @type   {number|undefined}
         * @since  1.3.7
         */
        inputBoxWidth: void 0,

        /**
         * The date format in the input boxes when not selected for editing.
         * Defaults to `%b %e, %Y`.
         *
         * This is used to determine which type of input to show,
         * `datetime-local`, `date` or `time` and falling back to `text` when
         * the browser does not support the input type or the format contains
         * milliseconds.
         *
         * @sample {highstock} stock/rangeselector/input-type/
         *         Input types
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         */
        inputDateFormat: '%b %e, %Y',

        /**
         * A custom callback function to parse values entered in the input boxes
         * and return a valid JavaScript time as milliseconds since 1970.
         * The first argument passed is a value to parse,
         * second is a boolean indicating use of the UTC time.
         *
         * This will only get called for inputs of type `text`. Since v8.2.3,
         * the input type is dynamically determined based on the granularity
         * of the `inputDateFormat` and the browser support.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         * @type      {Highcharts.RangeSelectorParseCallbackFunction}
         * @since     1.3.3
         */
        inputDateParser: void 0,

        /**
         * The date format in the input boxes when they are selected for
         * editing. This must be a format that is recognized by JavaScript
         * Date.parse.
         *
         * This will only be used for inputs of type `text`. Since v8.2.3,
         * the input type is dynamically determined based on the granularity
         * of the `inputDateFormat` and the browser support.
         *
         * @sample {highstock} stock/rangeselector/input-format/
         *         Milliseconds in the range selector
         *
         */
        inputEditDateFormat: '%Y-%m-%d',

        /**
         * Enable or disable the date input boxes.
         */
        inputEnabled: true,

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
         * The space in pixels between the labels and the date input boxes in
         * the range selector.
         *
         * @since 9.0.0
         */
        inputSpacing: 5,

        /**
         * The index of the button to appear pre-selected.
         *
         * @type      {number}
         */
        selected: void 0,

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
        inputStyle: {
            /** @ignore */
            color: palette.highlightColor80,
            /** @ignore */
            cursor: 'pointer'
        },

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
            color: palette.neutralColor60
        }
    } as Highcharts.RangeSelectorOptions
});

extend(
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
         * selector. Since v9.0, this string is empty as the label is not
         * rendered by default.
         *
         * @product highstock gantt
         */
        rangeSelectorFrom: '',

        /**
         * The text for the label for the "to" input box in the range selector.
         *
         * @product highstock gantt
         */
        rangeSelectorTo: '→'
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
class RangeSelector {
    public constructor(chart: Chart) {

        this.chart = chart;
        // Run RangeSelector
        this.init(chart);

    }

    /* *
     *
     * Properties
     *
     * */
    public buttons: Array<SVGElement> = void 0 as any;
    public buttonGroup?: SVGElement;
    public buttonOptions: Array<Highcharts.RangeSelectorButtonsOptions> = RangeSelector.prototype.defaultButtons;
    public chart: Chart;
    public deferredYTDClick?: number;
    public div?: HTMLDOMElement;
    public dropdown?: HTMLSelectElement;
    public eventsToUnbind?: Array<Function>;
    public forcedDataGrouping?: boolean;
    public frozenStates?: boolean;
    public group?: SVGElement;
    public hasVisibleDropdown?: boolean;
    public initialButtonGroupWidth = 0;
    public inputGroup?: SVGElement;
    public isActive?: boolean;
    public maxDateBox?: SVGElement;
    public maxInput?: HTMLInputElement;
    public maxLabel?: SVGElement;
    public minDateBox?: SVGElement;
    public minInput?: HTMLInputElement;
    public minLabel?: SVGElement;
    public options: Highcharts.RangeSelectorOptions = void 0 as any;
    public rendered?: boolean;
    public selected?: number;
    public zoomText?: SVGElement;

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
    public clickButton(
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
                    chart.series.forEach(function (series): void {
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

        if (defined(newMin)) {
            newMin += rangeOptions._offsetMin as any;
        }
        if (defined(newMax)) {
            newMax += rangeOptions._offsetMax as any;
        }

        rangeSelector.setSelected(i);
        if (this.dropdown) {
            this.dropdown.selectedIndex = i + 1;
        }

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
                pick(redraw, true),
                void 0, // auto animation
                {
                    trigger: 'rangeSelectorButton',
                    rangeSelectorButton: rangeOptions
                }
            );
        }

        fireEvent(this, 'afterBtnClick');
    }

    /**
     * Set the selected option. This method only sets the internal flag, it
     * doesn't update the buttons or the actual zoomed range.
     *
     * @private
     * @function Highcharts.RangeSelector#setSelected
     * @param {number} [selected]
     * @return {void}
     */
    public setSelected(
        selected?: number
    ): void {
        this.selected = this.options.selected = selected;
    }

    /**
     * Initialize the range selector
     *
     * @private
     * @function Highcharts.RangeSelector#init
     * @param {Highcharts.Chart} chart
     * @return {void}
     */
    public init(
        chart: Chart
    ): void {
        var rangeSelector = this,
            options =
                chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            buttonOptions = options.buttons || rangeSelector.defaultButtons.slice(),
            selectedOption = options.selected,
            blurInputs = function (): void {
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

        rangeSelector.buttonOptions = buttonOptions;

        this.eventsToUnbind = [];
        this.eventsToUnbind.push(addEvent(chart.container, 'mousedown', blurInputs));
        this.eventsToUnbind.push(addEvent(chart, 'resize', blurInputs));

        // Extend the buttonOptions with actual range
        buttonOptions.forEach(rangeSelector.computeButtonRange);

        // zoomed range based on a pre-selected button index
        if (
            typeof selectedOption !== 'undefined' &&
            buttonOptions[selectedOption]
        ) {
            this.clickButton(selectedOption, false);
        }

        this.eventsToUnbind.push(addEvent(chart, 'load', function (): void {
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
        }));
    }

    /**
     * Dynamically update the range selector buttons after a new range has been
     * set
     *
     * @private
     * @function Highcharts.RangeSelector#updateButtonStates
     * @return {void}
     */
    public updateButtonStates(): void {
        var rangeSelector = this,
            chart = this.chart,
            dropdown = this.dropdown,
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

                if (dropdown) {
                    dropdown.options[i + 1].disabled = disable;

                    if (state === 2) {
                        dropdown.selectedIndex = i + 1;
                    }
                }

                // Reset (#9209)
                if (state === 0 && selected === i) {
                    rangeSelector.setSelected();
                }
            }
        });
    }

    /**
     * Compute and cache the range for an individual button
     *
     * @private
     * @function Highcharts.RangeSelector#computeButtonRange
     * @param {Highcharts.RangeSelectorButtonsOptions} rangeOptions
     * @return {void}
     */
    public computeButtonRange(
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
            } as Record<string, number>);

        // Store the range on the button object
        if (fixedTimes[type]) {
            rangeOptions._range = fixedTimes[type] * count;
        } else if (type === 'month' || type === 'year') {
            rangeOptions._range = ({
                month: 30,
                year: 365
            } as Record<string, number>)[type] * 24 * 36e5 * count;
        }

        rangeOptions._offsetMin = pick(rangeOptions.offsetMin, 0);
        rangeOptions._offsetMax = pick(rangeOptions.offsetMax, 0);
        (rangeOptions._range as any) +=
            (rangeOptions._offsetMax as any) - (rangeOptions._offsetMin as any);
    }

    /**
     * Get the unix timestamp of a HTML input for the dates
     *
     * @private
     * @function Highcharts.RangeSelector#getInputValue
     * @param {string} name
     * @return {number}
     */
    public getInputValue(name: string): number {
        const input = name === 'min' ? this.minInput : this.maxInput;
        const options = this.chart.options.rangeSelector as Highcharts.RangeSelectorOptions;
        const time = this.chart.time;

        if (input) {
            return (
                (input.type === 'text' && options.inputDateParser) ||
                this.defaultInputDateParser
            )(input.value, time.useUTC, time);
        }
        return 0;
    }

    /**
     * Set the internal and displayed value of a HTML input for the dates
     *
     * @private
     * @function Highcharts.RangeSelector#setInputValue
     * @param {string} name
     * @param {number} [inputTime]
     * @return {void}
     */
    public setInputValue(
        name: string,
        inputTime?: number
    ): void {
        var options = this.options,
            time = this.chart.time,
            input = name === 'min' ? this.minInput : this.maxInput,
            dateBox = name === 'min' ? this.minDateBox : this.maxDateBox;

        if (input) {
            const hcTimeAttr = input.getAttribute('data-hc-time');
            let updatedTime = defined(hcTimeAttr) ? Number(hcTimeAttr) : void 0;

            if (defined(inputTime)) {
                const previousTime = updatedTime;
                if (defined(previousTime)) {
                    input.setAttribute('data-hc-time-previous', previousTime);
                }
                input.setAttribute('data-hc-time', inputTime);
                updatedTime = inputTime;
            }

            input.value = time.dateFormat(
                this.inputTypeFormats[input.type] || options.inputEditDateFormat,
                updatedTime
            );
            if (dateBox) {
                dateBox.attr({
                    text: time.dateFormat(
                        options.inputDateFormat,
                        updatedTime
                    )
                });
            }
        }
    }

    /**
     * Set the min and max value of a HTML input for the dates
     *
     * @private
     * @function Highcharts.RangeSelector#setInputExtremes
     * @param {string} name
     * @param {number} min
     * @param {number} max
     * @return {void}
     */
    public setInputExtremes(
        name: string,
        min: number,
        max: number
    ): void {
        const input = name === 'min' ? this.minInput : this.maxInput;
        if (input) {
            const format = this.inputTypeFormats[input.type];
            const time = this.chart.time;

            if (format) {
                const newMin = time.dateFormat(format, min);
                if (input.min !== newMin) {
                    input.min = newMin;
                }
                const newMax = time.dateFormat(format, max);
                if (input.max !== newMax) {
                    input.max = newMax;
                }
            }
        }
    }

    /**
     * @private
     * @function Highcharts.RangeSelector#showInput
     * @param {string} name
     * @return {void}
     */
    public showInput(name: ('min'|'max')): void {
        const dateBox = name === 'min' ? this.minDateBox : this.maxDateBox;
        const input = name === 'min' ? this.minInput : this.maxInput;

        if (input && dateBox && this.inputGroup) {
            const isTextInput = input.type === 'text';
            const { translateX, translateY } = this.inputGroup;

            css(input, {
                width: isTextInput ? ((dateBox.width - 2) + 'px') : 'auto',
                height: isTextInput ? ((dateBox.height - 2) + 'px') : 'auto',
                border: '2px solid silver'
            });

            if (isTextInput) {
                css(input, {
                    left: (translateX + dateBox.x) + 'px',
                    top: translateY + 'px'
                });

            // Inputs of types date, time or datetime-local should be centered
            // on top of the dateBox
            } else {
                css(input, {
                    left: Math.min(
                        Math.round(
                            dateBox.x +
                            translateX -
                            (input.offsetWidth - dateBox.width) / 2
                        ),
                        this.chart.chartWidth - input.offsetWidth
                    ) + 'px',
                    top: (
                        translateY - (input.offsetHeight - dateBox.height) / 2
                    ) + 'px'
                });
            }
        }
    }

    /**
     * @private
     * @function Highcharts.RangeSelector#hideInput
     * @param {string} name
     * @return {void}
     */
    public hideInput(name: ('min'|'max')): void {
        const input = name === 'min' ? this.minInput : this.maxInput;
        if (input) {
            css(input, {
                top: '-9999em',
                border: 0,
                width: '1px',
                height: '1px'
            });
        }
    }

    /**
     * @private
     * @function Highcharts.RangeSelector#defaultInputDateParser
     */
    public defaultInputDateParser(inputDate: string, useUTC: boolean, time?: Highcharts.Time): number {
        const hasTimezone = (str: string): boolean =>
            str.length > 6 &&
            (str.lastIndexOf('-') === str.length - 6 ||
            str.lastIndexOf('+') === str.length - 6);

        let input = inputDate.split('/').join('-').split(' ').join('T');
        if (input.indexOf('T') === -1) {
            input += 'T00:00';
        }
        if (useUTC) {
            input += 'Z';
        } else if (H.isSafari && !hasTimezone(input)) {
            const offset = new Date(input).getTimezoneOffset() / 60;
            input += offset <= 0 ? `+${pad(-offset)}:00` : `-${pad(offset)}:00`;
        }
        let date = Date.parse(input);

        // If the value isn't parsed directly to a value by the
        // browser's Date.parse method, like YYYY-MM-DD in IE8, try
        // parsing it a different way
        if (!isNumber(date)) {
            const parts = inputDate.split('-');
            date = Date.UTC(
                pInt(parts[0]),
                pInt(parts[1]) - 1,
                pInt(parts[2])
            );
        }

        if (time && useUTC && isNumber(date)) {
            date += time.getTimezoneOffset(date);
        }

        return date;
    }

    /**
     * Draw either the 'from' or the 'to' HTML input box of the range selector
     *
     * @private
     * @function Highcharts.RangeSelector#drawInput
     * @param {string} name
     * @return {RangeSelectorInputElements}
     */
    public drawInput(name: ('min'|'max')): Highcharts.RangeSelectorInputElements {
        const {
            chart,
            div,
            inputGroup
        } = this;

        var rangeSelector = this,
            chartStyle = chart.renderer.style || {},
            renderer = chart.renderer,
            options =
               chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            lang = defaultOptions.lang,
            isMin = name === 'min';

        /**
         * @private
         */
        function updateExtremes(): void {
            var value: number | undefined = rangeSelector.getInputValue(name),
                chartAxis = chart.xAxis[0],
                dataAxis = chart.scroller && chart.scroller.xAxis ?
                    chart.scroller.xAxis :
                    chartAxis,
                dataMin = dataAxis.dataMin,
                dataMax = dataAxis.dataMax;

            const { maxInput, minInput } = rangeSelector;

            if (
                value !== Number(input.getAttribute('data-hc-time-previous')) &&
                isNumber(value)
            ) {
                input.setAttribute('data-hc-time-previous', value);

                // Validate the extremes. If it goes beyound the data min or
                // max, use the actual data extreme (#2438).
                if (isMin && maxInput && isNumber(dataMin)) {
                    if (value > Number(maxInput.getAttribute('data-hc-time'))) {
                        value = void 0;
                    } else if (value < dataMin) {
                        value = dataMin;
                    }
                } else if (minInput && isNumber(dataMax)) {
                    if (value < Number(minInput.getAttribute('data-hc-time'))) {
                        value = void 0;
                    } else if (value > dataMax) {
                        value = dataMax;
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

        // Create the text label
        const text: string = (lang as any)[
            isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo'
        ];
        const label = renderer
            .label(text, 0)
            .addClass('highcharts-range-label')
            .attr({
                padding: text ? 2 : 0
            })
            .add(inputGroup);

        // Create an SVG label that shows updated date ranges and and records
        // click events that bring in the HTML input.
        const dateBox = renderer
            .label('', 0)
            .addClass('highcharts-range-input')
            .attr({
                padding: 2,
                width: options.inputBoxWidth,
                height: options.inputBoxHeight,
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
                stroke: options.inputBoxBorderColor,
                'stroke-width': 1
            });
        }

        dateBox.add(inputGroup);


        // Create the HTML input element. This is rendered as 1x1 pixel then set
        // to the right size when focused.
        const input = createElement('input', {
            name: name,
            className: 'highcharts-range-selector'
        }, void 0, div) as HTMLInputElement;

        // #14788: Setting input.type to an unsupported type throws in IE, so
        // we need to use setAttribute instead
        input.setAttribute('type', preferredInputType(options.inputDateFormat || '%b %e, %Y'));

        if (!chart.styledMode) {
            // Styles
            label.css(merge(chartStyle, options.labelStyle));

            dateBox.css(merge({
                color: palette.neutralColor80
            }, chartStyle, options.inputStyle));

            css(input, extend<CSSObject>({
                position: 'absolute',
                border: 0,
                boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                width: '1px', // Chrome needs a pixel to see it
                height: '1px',
                padding: 0,
                textAlign: 'center',
                fontSize: chartStyle.fontSize,
                fontFamily: chartStyle.fontFamily,
                top: '-9999em' // #4798
            }, options.inputStyle));
        }

        // Blow up the input box
        input.onfocus = (): void => {
            rangeSelector.showInput(name);
        };

        // Hide away the input box
        input.onblur = (): void => {
            // update extermes only when inputs are active
            if (input === H.doc.activeElement) { // Only when focused
                // Update also when no `change` event is triggered, like when
                // clicking inside the SVG (#4710)
                updateExtremes();
            }
            // #10404 - move hide and blur outside focus
            rangeSelector.hideInput(name);
            rangeSelector.setInputValue(name);
            input.blur(); // #4606
        };

        let keyDown = false;

        // handle changes in the input boxes
        input.onchange = (): void => {
            // Update extremes and blur input when clicking date input calendar
            if (!keyDown) {
                updateExtremes();
                rangeSelector.hideInput(name);
                input.blur();
            }
        };

        input.onkeypress = (event: KeyboardEvent): void => {
            // IE does not fire onchange on enter
            if (event.keyCode === 13) {
                updateExtremes();
            }
        };

        input.onkeydown = (event: KeyboardEvent): void => {
            keyDown = true;

            // Arrow keys
            if (event.keyCode === 38 || event.keyCode === 40) {
                updateExtremes();
            }
        };

        input.onkeyup = (): void => {
            keyDown = false;
        };

        return { dateBox, input, label };
    }

    /**
     * Get the position of the range selector buttons and inputs. This can be
     * overridden from outside for custom positioning.
     *
     * @private
     * @function Highcharts.RangeSelector#getPosition
     *
     * @return {Highcharts.Dictionary<number>}
     */
    public getPosition(): Record<string, number> {
        var chart = this.chart,
            options =
                chart.options.rangeSelector as Highcharts.RangeSelectorOptions,
            top = options.verticalAlign === 'top' ?
                chart.plotTop - chart.axisOffset[0] :
                0; // set offset only for varticalAlign top

        return {
            buttonTop: top + options.buttonPosition.y,
            inputTop: top + options.inputPosition.y - 10
        };
    }
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
    public getYTDExtremes(
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

        min = Math.max(dataMin, startOfYear);
        const ts = now.getTime();
        return {
            max: Math.min(dataMax || ts, ts),
            min: min
        };
    }

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
    public render(
        min?: number,
        max?: number
    ): void {

        var chart = this.chart,
            renderer = chart.renderer,
            container = chart.container,
            chartOptions = chart.options,
            options =
                chartOptions.rangeSelector as Highcharts.RangeSelectorOptions,
            // Place inputs above the container
            inputsZIndex = pick(
                (chartOptions.chart as any).style &&
                (chartOptions.chart as any).style.zIndex,
                0
            ) + 1,
            inputEnabled = options.inputEnabled,
            rendered = this.rendered;

        if (options.enabled === false) {
            return;
        }

        // create the elements
        if (!rendered) {

            this.group = renderer.g('range-selector-group')
                .attr({
                    zIndex: 7
                })
                .add();

            this.div = createElement('div', void 0, {
                position: 'relative',
                height: 0,
                zIndex: inputsZIndex
            });

            if (this.buttonOptions.length) {
                this.renderButtons();
            }

            // First create a wrapper outside the container in order to make
            // the inputs work and make export correct
            if (container.parentNode) {
                container.parentNode.insertBefore(this.div, container);
            }
            if (inputEnabled) {
                // Create the group to keep the inputs
                this.inputGroup = renderer.g('input-group').add(this.group);

                const minElems = this.drawInput('min');
                this.minDateBox = minElems.dateBox;
                this.minLabel = minElems.label;
                this.minInput = minElems.input;

                const maxElems = this.drawInput('max');
                this.maxDateBox = maxElems.dateBox;
                this.maxLabel = maxElems.label;
                this.maxInput = maxElems.input;
            }
        }

        if (inputEnabled) {
            // Set or reset the input values
            this.setInputValue('min', min);
            this.setInputValue('max', max);

            const unionExtremes = (
                chart.scroller && chart.scroller.getUnionExtremes()
            ) || chart.xAxis[0] || {};

            if (defined(unionExtremes.dataMin) && defined(unionExtremes.dataMax)) {
                const minRange = chart.xAxis[0].minRange || 0;

                this.setInputExtremes(
                    'min',
                    unionExtremes.dataMin,
                    Math.min(unionExtremes.dataMax, this.getInputValue('max')) - minRange
                );
                this.setInputExtremes(
                    'max',
                    Math.max(unionExtremes.dataMin, this.getInputValue('min')) + minRange,
                    unionExtremes.dataMax
                );
            }

            // Reflow
            if (this.inputGroup) {
                let x = 0;
                [
                    this.minLabel,
                    this.minDateBox,
                    this.maxLabel,
                    this.maxDateBox
                ].forEach((label): void => {
                    if (label) {
                        const { width } = label.getBBox();
                        if (width) {
                            label.attr({ x });
                            x += width + options.inputSpacing;
                        }
                    }
                });
            }
        }

        this.alignElements();

        this.rendered = true;
    }

    /**
     * Render the range buttons. This only runs the first time, later the
     * positioning is laid out in alignElements.
     *
     * @private
     * @function Highcharts.RangeSelector#renderButtons
     * @return {void}
     */
    public renderButtons(): void {
        const {
            buttons,
            chart,
            options
        } = this;
        const lang = defaultOptions.lang;
        const renderer = chart.renderer;

        const buttonTheme = merge(options.buttonTheme);
        const states = buttonTheme && buttonTheme.states;

        // Prevent the button from resetting the width when the button state
        // changes since we need more control over the width when collapsing
        // the buttons
        const width = buttonTheme.width || 28;
        delete buttonTheme.width;

        this.buttonGroup = renderer.g('range-selector-buttons').add(this.group);

        const dropdown = this.dropdown = createElement('select', void 0, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            border: 0,
            top: '-9999em',
            cursor: 'pointer',
            opacity: 0.0001
        }, this.div) as HTMLSelectElement;

        // Prevent page zoom on iPhone
        addEvent(dropdown, 'touchstart', (): void => {
            dropdown.style.fontSize = '16px';
        });

        // Forward events from select to button
        [
            [H.isMS ? 'mouseover' : 'mouseenter'],
            [H.isMS ? 'mouseout' : 'mouseleave'],
            ['change', 'click']
        ].forEach(([from, to]): void => {
            addEvent(dropdown, from, (): void => {
                const button = buttons[this.currentButtonIndex()];
                if (button) {
                    fireEvent(button.element, to || from);
                }
            });
        });

        this.zoomText = renderer
            .text(
                (lang as any).rangeSelectorZoom,
                0,
                15
            )
            .add(this.buttonGroup);

        if (!this.chart.styledMode) {
            this.zoomText.css(options.labelStyle);

            buttonTheme['stroke-width'] = pick(buttonTheme['stroke-width'], 0);
        }

        createElement('option', {
            textContent: this.zoomText.textStr,
            disabled: true
        }, void 0, dropdown);

        this.buttonOptions.forEach((
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void => {
            createElement('option', {
                textContent: rangeOptions.title || rangeOptions.text
            }, void 0, dropdown);

            buttons[i] = renderer
                .button(
                    rangeOptions.text,
                    0,
                    0,
                    (e: (Event|Record<string, any>)): void => {

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
                            this.clickButton(i);
                        }

                        this.isActive = true;
                    },
                    buttonTheme,
                    states && states.hover,
                    states && states.select,
                    states && states.disabled
                )
                .attr({
                    'text-align': 'center',
                    width
                })
                .add(this.buttonGroup);

            if (rangeOptions.title) {
                buttons[i].attr('title', rangeOptions.title);
            }
        });
    }

    /**
     * Align the elements horizontally and vertically.
     *
     * @private
     * @function Highcharts.RangeSelector#alignElements
     * @return {void}
     */
    public alignElements(): void {
        const {
            buttonGroup,
            buttons,
            chart,
            group,
            inputGroup,
            options,
            zoomText
        } = this;
        const chartOptions = chart.options;
        const navButtonOptions = (
            chartOptions.exporting &&
            chartOptions.exporting.enabled !== false &&
            chartOptions.navigation &&
            chartOptions.navigation.buttonOptions
        );
        const {
            buttonPosition,
            inputPosition,
            verticalAlign
        } = options;

        // Get the X offset required to avoid overlapping with the exporting
        // button. This is is used both by the buttonGroup and the inputGroup.
        const getXOffsetForExportButton = (
            group: SVGElement,
            position: Highcharts.RangeSelectorPositionOptions
        ): number => {
            if (
                navButtonOptions &&
                this.titleCollision(chart) &&
                verticalAlign === 'top' &&
                position.align === 'right' && (
                    (
                        position.y -
                        group.getBBox().height - 12
                    ) <
                    (
                        (navButtonOptions.y || 0) +
                        (navButtonOptions.height || 0) +
                        chart.spacing[0]
                    )
                )
            ) {
                return -40;
            }
            return 0;
        };

        let plotLeft = chart.plotLeft;

        if (group && buttonPosition && inputPosition) {

            let translateX = buttonPosition.x - chart.spacing[3];

            if (buttonGroup) {
                this.positionButtons();

                if (!this.initialButtonGroupWidth) {
                    let width = 0;

                    if (zoomText) {
                        width += zoomText.getBBox().width + 5;
                    }

                    buttons.forEach((
                        button: SVGElement,
                        i: number
                    ): void => {
                        width += button.width;
                        if (i !== buttons.length - 1) {
                            width += options.buttonSpacing;
                        }
                    });

                    this.initialButtonGroupWidth = width;
                }

                plotLeft -= chart.spacing[3];
                this.updateButtonStates();

                // Detect collision between button group and exporting
                const xOffsetForExportButton = getXOffsetForExportButton(
                    buttonGroup,
                    buttonPosition
                );

                this.alignButtonGroup(xOffsetForExportButton);

                // Skip animation
                group.placed = buttonGroup.placed = chart.hasLoaded;
            }

            let xOffsetForExportButton = 0;

            if (inputGroup) {
                // Detect collision between the input group and exporting button
                xOffsetForExportButton = getXOffsetForExportButton(
                    inputGroup,
                    inputPosition
                );

                if (inputPosition.align === 'left') {
                    translateX = plotLeft;
                } else if (inputPosition.align === 'right') {
                    translateX = -Math.max(
                        chart.axisOffset[1],
                        -xOffsetForExportButton
                    );
                }

                // Update the alignment to the updated spacing box
                inputGroup.align({
                    y: inputPosition.y,
                    width: inputGroup.getBBox().width,
                    align: inputPosition.align,
                    // fix wrong getBBox() value on right align
                    x: inputPosition.x + translateX - 2
                }, true, chart.spacingBox);

                // Skip animation
                inputGroup.placed = chart.hasLoaded;
            }

            this.handleCollision(xOffsetForExportButton);

            // Vertical align
            group.align({
                verticalAlign
            }, true, chart.spacingBox);

            const alignTranslateY = group.alignAttr.translateY;

            // Set position
            let groupHeight = group.getBBox().height + 20; // # 20 padding
            let translateY = 0;

            // Calculate bottom position
            if (verticalAlign === 'bottom') {
                const legendOptions = chart.legend && chart.legend.options;
                const legendHeight = (
                    legendOptions &&
                    legendOptions.verticalAlign === 'bottom' &&
                    legendOptions.enabled &&
                    !legendOptions.floating ?
                        (
                            chart.legend.legendHeight +
                            pick(legendOptions.margin, 10)
                        ) :
                        0
                );

                groupHeight = groupHeight + legendHeight - 20;
                translateY = (
                    alignTranslateY -
                    groupHeight -
                    (options.floating ? 0 : options.y) -
                    (chart.titleOffset ? chart.titleOffset[2] : 0) -
                    10 // 10 spacing
                );
            }

            if (verticalAlign === 'top') {
                if (options.floating) {
                    translateY = 0;
                }

                if (chart.titleOffset && chart.titleOffset[0]) {
                    translateY = chart.titleOffset[0];
                }

                translateY += ((chart.margin[0] - chart.spacing[0]) || 0);

            } else if (verticalAlign === 'middle') {
                if (inputPosition.y === buttonPosition.y) {
                    translateY = alignTranslateY;
                } else if (inputPosition.y || buttonPosition.y) {
                    if (
                        inputPosition.y < 0 ||
                        buttonPosition.y < 0
                    ) {
                        translateY -= Math.min(
                            inputPosition.y,
                            buttonPosition.y
                        );
                    } else {
                        translateY = alignTranslateY - groupHeight;
                    }
                }
            }

            group.translate(
                options.x,
                options.y + Math.floor(translateY)
            );

            // Translate HTML inputs
            const { minInput, maxInput, dropdown } = this;
            if (options.inputEnabled && minInput && maxInput) {
                minInput.style.marginTop = group.translateY + 'px';
                maxInput.style.marginTop = group.translateY + 'px';
            }
            if (dropdown) {
                dropdown.style.marginTop = group.translateY + 'px';
            }
        }
    }

    /**
     * Align the button group horizontally and vertically.
     *
     * @private
     * @function Highcharts.RangeSelector#alignButtonGroup
     * @param {number} xOffsetForExportButton
     * @param {number} [width]
     * @return {void}
     */
    public alignButtonGroup(xOffsetForExportButton: number, width?: number): void {
        const { chart, options, buttonGroup, buttons } = this;
        const { buttonPosition } = options;
        const plotLeft = chart.plotLeft - chart.spacing[3];
        let translateX = buttonPosition.x - chart.spacing[3];

        if (buttonPosition.align === 'right') {
            translateX += xOffsetForExportButton - plotLeft; // #13014
        } else if (buttonPosition.align === 'center') {
            translateX -= plotLeft / 2;
        }

        if (buttonGroup) {
            // Align button group
            buttonGroup.align({
                y: buttonPosition.y,
                width: pick(width, this.initialButtonGroupWidth),
                align: buttonPosition.align,
                x: translateX
            }, true, chart.spacingBox);
        }
    }

    /**
     * @private
     * @function Highcharts.RangeSelector#positionButtons
     * @return {void}
     */
    public positionButtons(): void {
        const {
            buttons,
            chart,
            options,
            zoomText
        } = this;
        const verb = chart.hasLoaded ? 'animate' : 'attr';
        const { buttonPosition } = options;

        const plotLeft = chart.plotLeft;
        let buttonLeft = plotLeft;

        if (zoomText && zoomText.visibility !== 'hidden') {
            // #8769, allow dynamically updating margins
            zoomText[verb]({
                x: pick(plotLeft + buttonPosition.x, plotLeft)
            });

            // Button start position
            buttonLeft += buttonPosition.x +
                zoomText.getBBox().width + 5;
        }

        this.buttonOptions.forEach(function (
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void {
            if (buttons[i].visibility !== 'hidden') {
                buttons[i][verb]({ x: buttonLeft });

                // increase button position for the next button
                buttonLeft += buttons[i].width + options.buttonSpacing;
            } else {
                buttons[i][verb]({ x: plotLeft });
            }
        });
    }

    /**
     * Handle collision between the button group and the input group
     *
     * @private
     * @function Highcharts.RangeSelector#handleCollision
     *
     * @param  {number} xOffsetForExportButton
     *                  The X offset of the group required to make room for the
     *                  exporting button
     * @return {void}
     */
    public handleCollision(xOffsetForExportButton: number): void {
        const {
            chart,
            buttonGroup,
            inputGroup
        } = this;

        const {
            buttonPosition,
            dropdown,
            inputPosition
        } = this.options;

        const maxButtonWidth = (): number => {
            let buttonWidth = 0;

            this.buttons.forEach((button): void => {
                const bBox = button.getBBox();
                if (bBox.width > buttonWidth) {
                    buttonWidth = bBox.width;
                }
            });

            return buttonWidth;
        };

        const groupsOverlap = (buttonGroupWidth: number): boolean => {
            if (inputGroup && buttonGroup) {
                const inputGroupX = (
                    inputGroup.alignAttr.translateX +
                    inputGroup.alignOptions.x -
                    xOffsetForExportButton +
                    // getBBox for detecing left margin
                    inputGroup.getBBox().x +
                    // 2px padding to not overlap input and label
                    2
                );

                const inputGroupWidth = inputGroup.alignOptions.width;

                const buttonGroupX = buttonGroup.alignAttr.translateX +
                    buttonGroup.getBBox().x;

                return (buttonGroupX + buttonGroupWidth > inputGroupX) &&
                    (inputGroupX + inputGroupWidth > buttonGroupX) &&
                    (
                        buttonPosition.y <
                        (
                            inputPosition.y +
                            inputGroup.getBBox().height
                        )
                    );
            }
            return false;
        };

        const moveInputsDown = (): void => {
            if (inputGroup && buttonGroup) {
                inputGroup.attr({
                    translateX: inputGroup.alignAttr.translateX + (
                        chart.axisOffset[1] >= -xOffsetForExportButton ?
                            0 :
                            -xOffsetForExportButton
                    ),
                    translateY: inputGroup.alignAttr.translateY +
                        buttonGroup.getBBox().height + 10
                });
            }
        };

        if (buttonGroup) {
            if (dropdown === 'always') {
                this.collapseButtons(xOffsetForExportButton);

                if (groupsOverlap(maxButtonWidth())) {
                    // Move the inputs down if there is still a collision
                    // after collapsing the buttons
                    moveInputsDown();
                }
                return;
            }
            if (dropdown === 'never') {
                this.expandButtons();
            }
        }

        // Detect collision
        if (inputGroup && buttonGroup) {
            if (
                (inputPosition.align === buttonPosition.align) ||
                // 20 is minimal spacing between elements
                groupsOverlap(this.initialButtonGroupWidth + 20)
            ) {
                if (dropdown === 'responsive') {
                    this.collapseButtons(xOffsetForExportButton);

                    if (groupsOverlap(maxButtonWidth())) {
                        moveInputsDown();
                    }
                } else {
                    moveInputsDown();
                }
            } else if (dropdown === 'responsive') {
                this.expandButtons();
            }
        } else if (buttonGroup && dropdown === 'responsive') {
            if (this.initialButtonGroupWidth > chart.plotWidth) {
                this.collapseButtons(xOffsetForExportButton);
            } else {
                this.expandButtons();
            }
        }
    }

    /**
     * Collapse the buttons and put the select element on top.
     *
     * @private
     * @function Highcharts.RangeSelector#collapseButtons
     * @param {number} xOffsetForExportButton
     * @return {void}
     */
    public collapseButtons(xOffsetForExportButton: number): void {
        const {
            buttons,
            buttonOptions,
            dropdown,
            options,
            zoomText
        } = this;

        const getAttribs = (text?: string): SVGAttributes => ({
            text: text ? `${text} ▾` : '▾',
            width: 'auto',
            paddingLeft: 8,
            paddingRight: 8
        } as unknown as SVGAttributes);

        if (zoomText) {
            zoomText.hide();
        }

        let hasActiveButton = false;

        buttonOptions.forEach((
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void => {
            const button = buttons[i];
            if (button.state !== 2) {
                button.hide();
            } else {
                button.show();
                button.attr(getAttribs(rangeOptions.text));

                hasActiveButton = true;
            }
        });

        if (!hasActiveButton) {
            if (dropdown) {
                dropdown.selectedIndex = 0;
            }

            buttons[0].show();
            buttons[0].attr(getAttribs(this.zoomText?.textStr));
        }

        const { align } = options.buttonPosition;

        this.positionButtons();

        if (align === 'right' || align === 'center') {
            this.alignButtonGroup(
                xOffsetForExportButton,
                buttons[this.currentButtonIndex()].getBBox().width
            );
        }

        this.showDropdown();
    }

    /**
     * Show all the buttons and hide the select element.
     *
     * @private
     * @function Highcharts.RangeSelector#expandButtons
     * @return {void}
     */
    public expandButtons(): void {
        const {
            buttons,
            buttonOptions,
            options,
            zoomText
        } = this;

        this.hideDropdown();

        if (zoomText) {
            zoomText.show();
        }

        buttonOptions.forEach((
            rangeOptions: Highcharts.RangeSelectorButtonsOptions,
            i: number
        ): void => {
            const button = buttons[i];

            button.show();
            button.attr({
                text: rangeOptions.text,
                width: options.buttonTheme.width || 28,
                paddingLeft: 'unset',
                paddingRight: 'unset'
            });

            if (button.state < 2) {
                button.setState(0);
            }
        });

        this.positionButtons();
    }

    /**
     * Get the index of the visible button when the buttons are collapsed.
     *
     * @private
     * @function Highcharts.RangeSelector#currentButtonIndex
     * @return {number}
     */
    public currentButtonIndex(): number {
        const { dropdown } = this;

        if (dropdown && dropdown.selectedIndex > 0) {
            return dropdown.selectedIndex - 1;
        }
        return 0;
    }

    /**
     * Position the select element on top of the button.
     *
     * @private
     * @function Highcharts.RangeSelector#showDropdown
     * @return {void}
     */
    public showDropdown(): void {
        const {
            buttonGroup,
            buttons,
            chart,
            dropdown
        } = this;

        if (buttonGroup && dropdown) {
            const { translateX, translateY } = buttonGroup;
            const bBox = buttons[this.currentButtonIndex()].getBBox();
            css(dropdown, {
                left: (chart.plotLeft + translateX) + 'px',
                top: (translateY + 0.5) + 'px',
                width: bBox.width + 'px',
                height: bBox.height + 'px'
            });
            this.hasVisibleDropdown = true;
        }
    }

    /**
     * @private
     * @function Highcharts.RangeSelector#hideDropdown
     * @return {void}
     */
    public hideDropdown(): void {
        const { dropdown } = this;

        if (dropdown) {
            css(dropdown, {
                top: '-9999em',
                width: '1px',
                height: '1px'
            });
            this.hasVisibleDropdown = false;
        }
    }

    /**
     * Extracts height of range selector
     *
     * @private
     * @function Highcharts.RangeSelector#getHeight
     * @return {number}
     *         Returns rangeSelector height
     */
    public getHeight(): number {
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

        if (options.height) {
            return options.height;
        }

        // Align the elements before we read the height in case we're switching
        // between wrapped and non-wrapped layout
        this.alignElements();

        rangeSelectorHeight = rangeSelectorGroup ?
            // 13px to keep back compatibility
            (rangeSelectorGroup.getBBox(true).height) + 13 +
                yPosition :
            0;

        minPosition = Math.min(inputPositionY, buttonPositionY);

        if ((inputPositionY < 0 && buttonPositionY < 0) ||
            (inputPositionY > 0 && buttonPositionY > 0)
        ) {
            rangeSelectorHeight += Math.abs(minPosition);
        }

        return rangeSelectorHeight;
    }

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
    public titleCollision(
        chart: Chart
    ): boolean {
        return !(
            (chart.options.title as any).text ||
            (chart.options.subtitle as any).text
        );
    }

    /**
     * Update the range selector with new options
     *
     * @private
     * @function Highcharts.RangeSelector#update
     * @param {Highcharts.RangeSelectorOptions} options
     * @return {void}
     */
    public update(
        this: Highcharts.RangeSelector,
        options: Highcharts.RangeSelectorOptions
    ): void {
        var chart = this.chart;
        merge(true, chart.options.rangeSelector, options);

        this.destroy();
        this.init(chart);

        this.render();
    }

    /**
     * Destroys allocated elements.
     *
     * @private
     * @function Highcharts.RangeSelector#destroy
     */
    public destroy(): void {
        var rSelector: RangeSelector = this,
            minInput = rSelector.minInput,
            maxInput = rSelector.maxInput;

        if (rSelector.eventsToUnbind) {
            rSelector.eventsToUnbind.forEach((unbind: Function): void => unbind());
            rSelector.eventsToUnbind = void 0;
        }

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
        objectEach(rSelector, function (val, key): void {
            if (val && key !== 'chart') {
                if (val instanceof SVGElement) {
                    // SVGElement
                    val.destroy();
                } else if (
                    val instanceof window.HTMLElement
                ) {
                    // HTML element
                    discardElement(val);
                }
            }
            if (val !== RangeSelector.prototype[key]) {
                (rSelector as any)[key] = null;
            }
        }, this);
    }
}

/**
 * @private
 */
interface RangeSelector {
    defaultButtons: Array<Highcharts.RangeSelectorButtonsOptions>;
    inputTypeFormats: Record<string, string>;
}

/**
 * The default buttons for pre-selecting time frames
 */
RangeSelector.prototype.defaultButtons = [{
    type: 'month',
    count: 1,
    text: '1m',
    title: 'View 1 month'
}, {
    type: 'month',
    count: 3,
    text: '3m',
    title: 'View 3 months'
}, {
    type: 'month',
    count: 6,
    text: '6m',
    title: 'View 6 months'
}, {
    type: 'ytd',
    text: 'YTD',
    title: 'View year to date'
}, {
    type: 'year',
    count: 1,
    text: '1y',
    title: 'View 1 year'
}, {
    type: 'all',
    text: 'All',
    title: 'View all'
}];

/**
 * The date formats to use when setting min, max and value on date inputs
 */
RangeSelector.prototype.inputTypeFormats = {
    'datetime-local': '%Y-%m-%dT%H:%M:%S',
    'date': '%Y-%m-%d',
    'time': '%H:%M:%S'
};

/**
 * Get the preferred input type based on a date format string.
 *
 * @private
 * @function preferredInputType
 * @param {string} format
 * @return {string}
 */
function preferredInputType(format: string): string {
    const ms = format.indexOf('%L') !== -1;

    if (ms) {
        return 'text';
    }

    const date = ['a', 'A', 'd', 'e', 'w', 'b', 'B', 'm', 'o', 'y', 'Y'].some((char: string): boolean =>
        format.indexOf('%' + char) !== -1
    );
    const time = ['H', 'k', 'I', 'l', 'M', 'S'].some((char: string): boolean =>
        format.indexOf('%' + char) !== -1
    );

    if (date && time) {
        return 'datetime-local';
    }
    if (date) {
        return 'date';
    }
    if (time) {
        return 'time';
    }
    return 'text';
}

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
        min,
        max = this.max as any,
        dataMin,
        range,
        time = this.chart.time,
        // Get the true range from a start date
        getTrueRange = function (base: number, count: number): number {
            const timeName: Highcharts.TimeUnitValue = type === 'year' ? 'FullYear' : 'Month';
            const date = new time.Date(base);
            const basePeriod = time.get(timeName, date);

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
    const chartDestroyEvents: [Chart, Function[]][] = [];

    const initRangeSelector = (chart: Chart): void => {
        var extremes,
            rangeSelector = chart.rangeSelector,
            legend,
            alignTo,
            verticalAlign: VerticalAlignValue|undefined;

        /**
         * @private
         */
        function render(): void {
            if (rangeSelector) {
                extremes = chart.xAxis[0].getExtremes();
                legend = chart.legend;
                verticalAlign = rangeSelector?.options.verticalAlign;

                if (isNumber(extremes.min)) {
                    rangeSelector.render(extremes.min, extremes.max);
                }

                // Re-align the legend so that it's below the rangeselector
                if (
                    legend.display &&
                    verticalAlign === 'top' &&
                    verticalAlign === legend.options.verticalAlign
                ) {
                    // Create a new alignment box for the legend.
                    alignTo = merge(chart.spacingBox);
                    if (legend.options.layout === 'vertical') {
                        alignTo.y = chart.plotTop;
                    } else {
                        alignTo.y += rangeSelector.getHeight();
                    }
                    legend.group.placed = false; // Don't animate the alignment.
                    legend.align(alignTo);
                }
            }
        }

        if (rangeSelector) {
            const events = find(chartDestroyEvents, (e: [Chart, Function[]]): boolean => e[0] === chart);

            if (!events) {
                chartDestroyEvents.push([chart, [
                    // redraw the scroller on setExtremes
                    addEvent(
                        chart.xAxis[0],
                        'afterSetExtremes',
                        function (e: Highcharts.RangeObject): void {
                            if (rangeSelector) {
                                rangeSelector.render(e.min, e.max);
                            }
                        }
                    ),
                    // redraw the scroller chart resize
                    addEvent(chart, 'redraw', render)
                ]]);
            }

            // do it now
            render();
        }
    };

    // Initialize rangeselector for stock charts
    addEvent(Chart, 'afterGetContainer', function (): void {
        if (this.options.rangeSelector?.enabled) {
            this.rangeSelector = new RangeSelector(this);
        }
    });

    addEvent(Chart, 'beforeRender', function (): void {

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

    addEvent(Chart, 'update', function (e: Chart): void {

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
            !defined(rangeSelector) &&
            this.options.rangeSelector
        ) {
            this.options.rangeSelector.enabled = true;
            this.rangeSelector = rangeSelector = new RangeSelector(this);
        }

        this.extraBottomMargin = false;
        this.extraTopMargin = false;

        if (rangeSelector) {
            initRangeSelector(this);

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

    addEvent(Chart, 'render', function (): void {
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

    addEvent(Chart, 'getMargins', function (): void {
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

    Chart.prototype.callbacks.push(initRangeSelector);

    // Remove resize/afterSetExtremes at chart destroy
    addEvent(Chart, 'destroy', function destroyEvents(): void {
        for (let i = 0; i < chartDestroyEvents.length; i++) {
            const events = chartDestroyEvents[i];
            if (events[0] === this) {
                events[1].forEach((unbind: Function): void => unbind());
                chartDestroyEvents.splice(i, 1);
                return;
            }
        }
    });
    H.RangeSelector = RangeSelector;
}

export default H.RangeSelector;
