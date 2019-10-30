/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Default options for accessibility.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

/**
 * @callback Highcharts.ScreenReaderClickCallbackFunction
 *
 * @param {global.MouseEvent} evt
 *        Mouse click event
 *
 * @return {void}
 */

/**
 * Creates a formatted string for the screen reader module.
 *
 * @callback Highcharts.ScreenReaderFormatterCallbackFunction<T>
 *
 * @param {T} context
 *        Context to format
 *
 * @return {string}
 *         Formatted string for the screen reader module.
 */


var options = {

    /**
     * Options for configuring accessibility for the chart. Requires the
     * [accessibility module](https://code.highcharts.com/modules/accessibility.js)
     * to be loaded. For a description of the module and information
     * on its features, see
     * [Highcharts Accessibility](http://www.highcharts.com/docs/chart-concepts/accessibility).
     *
     * @requires module:modules/accessibility
     *
     * @since        5.0.0
     * @optionparent accessibility
     */
    accessibility: {
        /**
         * Enable accessibility functionality for the chart.
         *
         * @since 5.0.0
         */
        enabled: true,

        /**
         * Accessibility options for the screen reader information sections
         * added before and after the chart.
         *
         * @since next
         */
        screenReaderSection: {
            /**
             * A formatter function to create the HTML contents of the hidden
             * screen reader information region before the chart. Receives one
             * argument, `chart`, referring to the chart object. Should return a
             * string with the HTML content of the region. By default this
             * returns an automatic description of the chart based on
             * [beforeChartFormat](#accessibility.screenReaderSection.beforeChartFormat).
             *
             * @type    {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Chart>}
             * @default undefined
             * @since   next
             * @apioption accessibility.screenReaderSection.beforeChartFormatter
             */

            /**
             * Format for the screen reader information region before the chart.
             * Supported HTML tags are `<h1-7>`, `<p>`, `<div>`, `<a>`, and
             * `<button>`. Attributes are not supported, except for id on
             * `<div>`, `<a>`, and `<button>`. Id is required on `<a>` and
             * `<button>` in the format `<tag id="abcd">`. Numbers, lower- and
             * uppercase letters, "-" and "#" are valid characters in IDs.
             *
             * @since next
             */
            beforeChartFormat:
                '<h5>{chartTitle}</h5>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{xAxisDescription}</div>' +
                '<div>{yAxisDescription}</div>' +
                '<div>{viewTableButton}</div>',

            /**
             * A formatter function to create the HTML contents of the hidden
             * screen reader information region after the chart. Analogous to
             * [beforeChartFormatter](#accessibility.screenReaderSection.beforeChartFormatter).
             *
             * @type    {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Chart>}
             * @default undefined
             * @since   next
             * @apioption accessibility.screenReaderSection.afterChartFormatter
             */

            /**
             * Format for the screen reader information region after the chart.
             * Analogous to [beforeChartFormat](#accessibility.screenReaderSection.beforeChartFormat).
             *
             * @since next
             */
            afterChartFormat: '{endOfChartMarker}',

            /**
             * Date format to use to describe range of datetime axes.
             *
             * For an overview of the replacement codes, see
             * [dateFormat](/class-reference/Highcharts#dateFormat).
             *
             * @see [point.dateFormat](#accessibility.point.dateFormat)
             * @since next
             */
            axisRangeDateFormat: '%Y-%m-%d %H:%M:%S'
        },

        /**
         * Accessibility options global to all data series. Individual series
         * can also have specific [accessibility options](#plotOptions.series.accessibility)
         * set.
         *
         * @since next
         */
        series: {
            /**
             * Whether or not to add series descriptions to charts with a single
             * series.
             *
             * @since     next
             */
            describeSingleSeries: false,

            /**
             * When a series contains more points than this, we no longer expose
             * information about individual points to screen readers.
             *
             * Set to `false` to disable.
             *
             * @type  {boolean|number}
             * @since next
             */
            pointDescriptionEnabledThreshold: 200
        },

        /**
         * Amount of landmarks/regions to create for screen reader users. More
         * landmarks can make navigation with screen readers easier, but can
         * be distracting if there are lots of charts on the page. Three modes
         * are available:
         *  - `all`: Adds regions for all series, legend, menu, information
         *      region.
         *  - `one`: Adds a single landmark per chart.
         *  - `disabled`: No landmarks are added.
         *
         * @since 7.1.0
         * @validvalue ["all", "one", "disabled"]
         */
        landmarkVerbosity: 'all',

        /**
         * A hook for adding custom components to the accessibility module.
         * Should be an object mapping component names to instances of classes
         * inheriting from the Highcharts.AccessibilityComponent base class.
         * Remember to add the component to the
         * [keyboardNavigation.order](#accessibility.keyboardNavigation.order)
         * for the keyboard navigation to be usable.
         *
         * @since 7.1.0
         * @type {object}
         * @sample highcharts/accessibility/custom-component
         *         Custom accessibility component
         * @apioption accessibility.customComponents
         */

        /**
         * Theme to apply to the chart when Windows High Contrast Mode is
         * detected. By default, a high contrast theme matching the high
         * contrast system system colors is used.
         *
         * @since 7.1.3
         * @type {object}
         * @apioption accessibility.highContrastTheme
         */

        /**
         * A text description of the chart.
         *
         * **Note: Prefer using [linkedDescription](#accessibility.linkedDescription)
         * or [caption](#caption.text) instead.**
         *
         * If the Accessibility module is loaded, this option is included by
         * default as a long description of the chart in the hidden screen
         * reader information region.
         *
         * Note: Since Highcharts now supports captions and linked descriptions,
         * it is preferred to define the description using those methods, as a
         * visible caption/description benefits all users. If the
         * `accessibility.description` option is defined, the linked description
         * is ignored, and the caption is hidden from screen reader users.
         *
         * @see [linkedDescription](#accessibility.linkedDescription)
         * @see [caption](#caption)
         * @see [typeDescription](#accessibility.typeDescription)
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accessibility.description
         */

        /**
         * The ID of an HTML element describing the contents of the chart.
         *
         * It is always recommended to describe charts using visible text, to
         * improve SEO as well as accessibility for users with disabilities.
         * This option lets an HTML element with a description be linked to the
         * chart, so that screen reader users can connect the two.
         *
         * If you need the description to be part of the exported image,
         * consider using the [caption](#caption) feature.
         *
         * If you need the description to be hidden visually, use the
         * [accessibility.description](#accessibility.description) option.
         *
         * @see [caption](#caption)
         * @see [description](#accessibility.description)
         * @see [typeDescription](#accessibility.typeDescription)
         *
         * @type      {string}
         * @since     next
         * @sample highcharts/accessibility/accessible-line
         *         Accessible line chart
         * @apioption accessibility.linkedDescription
         */

        /**
         * A text description of the chart type.
         *
         * If the Accessibility module is loaded, this will be included in the
         * description of the chart in the screen reader information region.
         *
         * Highcharts will by default attempt to guess the chart type, but for
         * more complex charts it is recommended to specify this property for
         * clarity.
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accessibility.typeDescription
         */

        /**
         * Function to run upon clicking the "View as Data Table" link in the
         * screen reader region.
         *
         * By default Highcharts will insert and set focus to a data table
         * representation of the chart.
         *
         * @type      {Highcharts.ScreenReaderClickCallbackFunction}
         * @since     next
         * @apioption accessibility.screenReaderSection.onViewDataTableClick
         */

        /**
         * Options for descriptions of individual data points.
         *
         * @since next
         * @type {object}
         * @apioption accessibility.point
         */

        /**
         * Date format to use for points on datetime axes when describing them
         * to screen reader users.
         *
         * Defaults to the same format as in tooltip.
         *
         * For an overview of the replacement codes, see
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [dateFormatter](#accessibility.point.dateFormatter)
         *
         * @type      {string}
         * @since     next
         * @apioption accessibility.point.dateFormat
         */

        /**
         * Formatter function to determine the date/time format used with
         * points on datetime axes when describing them to screen reader users.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a date format string compatible with
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [dateFormat](#accessibility.point.dateFormat)
         *
         * @type      {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Point>}
         * @since     next
         * @apioption accessibility.point.dateFormatter
         */

        /**
         * Prefix to add to the values in the point descriptions. Uses
         * [tooltip.valuePrefix](#tooltip.valuePrefix) if not defined.
         *
         * @type        {string}
         * @since       next
         * @apioption   accessibility.point.valuePrefix
         */

        /**
         * Suffix to add to the values in the point descriptions. Uses
         * [tooltip.valueSuffix](#tooltip.valueSuffix) if not defined.
         *
         * @type        {string}
         * @since       next
         * @apioption   accessibility.point.valueSuffix
         */

        /**
         * Decimals to use for the values in the point descriptions. Uses
         * [tooltip.valueDecimals](#tooltip.valueDecimals) if not defined.
         *
         * @type        {string}
         * @since       next
         * @apioption   accessibility.point.valueDecimals
         */

        /**
         * Formatter function to use instead of the default for point
         * descriptions.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a string with the description of the point for a screen
         * reader user. If `false` is returned, the default formatter will be
         * used for that point.
         *
         * @see [point.description](#series.line.data.description)
         *
         * @type      {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Point>}
         * @since     next
         * @apioption accessibility.point.descriptionFormatter
         */

        /**
         * Formatter function to use instead of the default for series
         * descriptions. Receives one argument, `series`, referring to the
         * series to describe. Should return a string with the description of
         * the series for a screen reader user. If `false` is returned, the
         * default formatter will be used for that series.
         *
         * @see [series.description](#plotOptions.series.description)
         *
         * @type      {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Series>}
         * @since     next
         * @apioption accessibility.series.descriptionFormatter
         */

        /**
         * Options for keyboard navigation.
         *
         * @since 5.0.0
         */
        keyboardNavigation: {

            /**
             * Enable keyboard navigation for the chart.
             *
             * @since 5.0.0
             */
            enabled: true,

            /**
             * Options for the focus border drawn around elements while
             * navigating through them.
             *
             * @sample highcharts/accessibility/custom-focus
             *         Custom focus ring
             *
             * @since 6.0.3
             */
            focusBorder: {

                /**
                 * Enable/disable focus border for chart.
                 *
                 * @since 6.0.3
                 */
                enabled: true,

                /**
                 * Hide the browser's default focus indicator.
                 *
                 * @since 6.0.4
                 */
                hideBrowserFocusOutline: true,

                /**
                 * Style options for the focus border drawn around elements
                 * while navigating through them. Note that some browsers in
                 * addition draw their own borders for focused elements. These
                 * automatic borders can not be styled by Highcharts.
                 *
                 * In styled mode, the border is given the
                 * `.highcharts-focus-border` class.
                 *
                 * @type    {Highcharts.CSSObject}
                 * @default {"color": "#335cad", "lineWidth": 2, "borderRadius": 3}
                 * @since   6.0.3
                 */
                style: {
                    /** @ignore-option */
                    color: '${palette.highlightColor80}',
                    /** @ignore-option */
                    lineWidth: 2,
                    /** @ignore-option */
                    borderRadius: 3
                },

                /**
                 * Focus border margin around the elements.
                 *
                 * @since 6.0.3
                 */
                margin: 2

            },

            /**
             * Order of tab navigation in the chart. Determines which elements
             * are tabbed to first. Available elements are: `series`, `zoom`,
             * `rangeSelector`, `chartMenu`, `legend`. In addition, any custom
             * components can be added here.
             *
             * @since 7.1.0
             * @type {Array<string>}
             */
            order: ['series', 'zoom', 'rangeSelector', 'legend', 'chartMenu'],

            /**
             * Whether or not to wrap around when reaching the end of arrow-key
             * navigation for an element in the chart.
             * @since 7.1.0
             */
            wrapAround: true,

            /**
             * Options for the keyboard navigation of data points and series.
             *
             * @since next
             */
            seriesNavigation: {
                /**
                 * Set the keyboard navigation mode for the chart. Can be
                 * "normal" or "serialize". In normal mode, left/right arrow
                 * keys move between points in a series, while up/down arrow
                 * keys move between series. Up/down navigation acts
                 * intelligently to figure out which series makes sense to move
                 * to from any given point.
                 *
                 * In "serialize" mode, points are instead navigated as a single
                 * list. Left/right behaves as in "normal" mode. Up/down arrow
                 * keys will behave like left/right. This can be useful for
                 * unifying navigation behavior with/without screen readers
                 * enabled.
                 *
                 * @type       {string}
                 * @default    normal
                 * @since      next
                 * @validvalue ["normal", "serialize"]
                 * @apioption  accessibility.keyboardNavigation.seriesNavigation.mode
                 */

                /**
                 * Skip null points when navigating through points with the
                 * keyboard.
                 *
                 * @since next
                 */
                skipNullPoints: true,

                /**
                 * When a series contains more points than this, we no longer
                 * allow keyboard navigation for it.
                 *
                 * Set to `false` to disable.
                 *
                 * @type  {boolean|number}
                 * @since next
                 */
                pointNavigationEnabledThreshold: false
            }
        },

        /**
         * Options for announcing new data to screen reader users. Useful
         * for dynamic data applications and drilldown.
         *
         * Keep in mind that frequent announcements will not be useful to
         * users, as they won't have time to explore the new data. For these
         * applications, consider making snapshots of the data accessible, and
         * do the announcements in batches.
         *
         * @since 7.1.0
         */
        announceNewData: {
            /**
             * Optional formatter callback for the announcement. Receives
             * up to three arguments. The first argument is always an array
             * of all series that received updates. If an announcement is
             * already queued, the series that received updates for that
             * announcement are also included in this array. The second
             * argument is provided if `chart.addSeries` was called, and
             * there is a new series. In that case, this argument is a
             * reference to the new series. The third argument, similarly,
             * is provided if `series.addPoint` was called, and there is a
             * new point. In that case, this argument is a reference to the
             * new point.
             *
             * The function should return a string with the text to announce
             * to the user. Return empty string to not announce anything.
             * Return `false` to use the default announcement format.
             *
             * @type {Function}
             * @default undefined
             * @sample highcharts/accessibility/custom-dynamic
             *         High priority live alerts
             * @apioption accessibility.announceNewData.announcementFormatter
             */

            /**
             * Enable announcing new data to screen reader users
             * @sample highcharts/accessibility/accessible-dynamic
             *         Dynamic data accessible
             */
            enabled: false,

            /**
             * Minimum interval between announcements in milliseconds. If
             * new data arrives before this amount of time has passed, it is
             * queued for announcement. If another new data event happens
             * while an announcement is queued, the queued announcement is
             * dropped, and the latest announcement is queued instead. Set
             * to 0 to allow all announcements, but be warned that frequent
             * announcements are disturbing to users.
             */
            minAnnounceInterval: 5000,

            /**
             * Choose whether or not the announcements should interrupt the
             * screen reader. If not enabled, the user will be notified once
             * idle. It is recommended not to enable this setting unless
             * there is a specific reason to do so.
             */
            interruptUser: false
        }
    },

    /**
     * Provide a description of the data point, announced to screen readers.
     *
     * @type       {string}
     * @since 7.1.0
     * @default    undefined
     * @apioption  series.line.data.accessibility.description
     */

    /**
     * Accessibility options for a series. Requires the accessibility module.
     *
     * @requires module:modules/accessibility
     *
     * @type       {object}
     * @since 7.1.0
     * @apioption  plotOptions.series.accessibility
     */

    /**
     * Enable/disable accessibility functionality for a specific series.
     *
     * @type       {boolean}
     * @since 7.1.0
     * @default    undefined
     * @apioption  plotOptions.series.accessibility.enabled
     */

    /**
     * Provide a description of the series, announced to screen readers.
     *
     * @type       {string}
     * @since 7.1.0
     * @default    undefined
     * @apioption  plotOptions.series.accessibility.description
     */

    /**
     * Formatter function to use instead of the default for point
     * descriptions. Same as `accessibility.pointDescriptionFormatter`, but for
     * a single series.
     *
     * @see [accessibility.pointDescriptionFormatter](#accessibility.pointDescriptionFormatter)
     *
     * @type      {Function}
     * @since 7.1.0
     * @default   undefined
     * @apioption plotOptions.series.accessibility.pointDescriptionFormatter
     */

    /**
     * Expose only the series element to screen readers, not its points.
     *
     * @type       {boolean}
     * @since 7.1.0
     * @default    undefined
     * @apioption  plotOptions.series.accessibility.exposeAsGroupOnly
     */

    /**
     * Keyboard navigation for a series
     *
     * @type       {object}
     * @since 7.1.0
     * @apioption  plotOptions.series.accessibility.keyboardNavigation
     */

    /**
     * Enable/disable keyboard navigation support for a specific series.
     *
     * @type       {boolean}
     * @default    undefined
     * @since 7.1.0
     * @apioption  plotOptions.series.accessibility.keyboardNavigation.enabled
     */

    /**
     * Accessibility options for an axis. Requires the accessibility module.
     *
     * @requires module:modules/accessibility
     * @since 7.1.0
     * @type       {object}
     * @apioption  xAxis.accessibility
     */

    /**
     * Enable axis accessibility features, including axis information in the
     * screen reader information region. If this is disabled on the xAxis, the
     * x values are not exposed to screen readers for the individual data points
     * by default.
     *
     * @since 7.1.0
     * @type       {boolean}
     * @default    undefined
     * @apioption  xAxis.accessibility.enabled
     */

    /**
     * Description for an axis to expose to screen reader users.
     *
     * @since 7.1.0
     * @type       {string}
     * @default    undefined
     * @apioption  xAxis.accessibility.description
     */

    /**
     * Range description for an axis. Overrides the default range description.
     * Set to empty to disable range description for this axis.
     *
     * @since 7.1.0
     * @type       {string}
     * @default    undefined
     * @apioption  xAxis.accessibility.rangeDescription
     */


    legend: {
        /**
         * Accessibility options for the legend. Requires the Accessibility
         * module.
         *
         * @requires module:modules/accessibility
         * @since 7.1.0
         * @type {object}
         * @apioption legend.accessibility
         */
        accessibility: {

            /**
             * Enable accessibility support for the legend.
             *
             * @since 7.1.0
             * @apioption legend.accessibility.enabled
             */
            enabled: true,

            /**
             * Options for keyboard navigation for the legend.
             *
             * @since 7.1.0
             * @apioption legend.accessibility.keyboardNavigation
             */
            keyboardNavigation: {
                /**
                 * Enable keyboard navigation for the legend.
                 *
                 * @since 7.1.0
                 * @see [accessibility.keyboardNavigation](
                 *      #accessibility.keyboardNavigation.enabled)
                 * @apioption legend.accessibility.keyboardNavigation.enabled
                 */
                enabled: true
            }
        }
    },

    exporting: {
        /**
         * Accessibility options for the exporting menu. Requires the
         * Accessibility module.
         *
         * @requires module:modules/accessibility
         * @since 7.1.0
         * @type {object}
         * @apioption exporting.accessibility
         */
        accessibility: {
            /**
             * Enable accessibility support for the export menu.
             *
             * @since 7.1.0
             * @apioption exporting.accessibility.enabled
             */
            enabled: true
        }
    }

};

export default options;
