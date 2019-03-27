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
         * When a series contains more points than this, we no longer expose
         * information about individual points to screen readers.
         *
         * Set to `false` to disable.
         *
         * @type  {boolean|number}
         * @since 5.0.0
         */
        pointDescriptionThreshold: 500, // set to false to disable

        /**
         * Whether or not to add a shortcut button in the screen reader
         * information region to show the data table.
         * @since next
         */
        addTableShortcut: true,

        /**
         * Date format to use to describe range of datetime axes.
         *
         * For an overview of the replacement codes, see
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [pointDateFormat](#accessibility.pointDateFormat)
         * @since next
         */
        axisRangeDateFormat: '%Y-%m-%d %H:%M:%S',

        /**
         * Whether or not to add series descriptions to charts with a single
         * series.
         *
         * @since     5.0.0
         */
        describeSingleSeries: false,

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
         * @since next
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
         * @since next
         * @type {object}
         * @sample highcharts/accessibility/custom-component
         *         Custom accessibility component
         * @apioption accessibility.customComponents
         */

        /**
         * A text description of the chart.
         *
         * If the Accessibility module is loaded, this is included by default
         * as a long description of the chart in the hidden screen reader
         * information region.
         *
         * Note: It is considered a best practice to make the description of the
         * chart visible to all users, so consider if this can be placed in text
         * around the chart instead.
         *
         * @see [typeDescription](#accessibility.typeDescription)
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accessibility.description
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
         * @since     5.0.0
         * @apioption accessibility.onTableAnchorClick
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
         * @see [pointDateFormatter](#accessibility.pointDateFormatter)
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accessibility.pointDateFormat
         */

        /**
         * Formatter function to determine the date/time format used with
         * points on datetime axes when describing them to screen reader users.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a date format string compatible with
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [pointDateFormat](#accessibility.pointDateFormat)
         *
         * @type      {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Point>}
         * @since     5.0.0
         * @apioption accessibility.pointDateFormatter
         */

        /**
         * Prefix to add to the values in the point descriptions. Uses
         * [tooltip.valuePrefix](#tooltip.valuePrefix) if not defined.
         *
         * @type      {string}
         * @since     next
         * @apioption accessibility.pointValuePrefix
         */

        /**
         * Suffix to add to the values in the point descriptions. Uses
         * [tooltip.valueSuffix](#tooltip.valueSuffix) if not defined.
         *
         * @type      {string}
         * @since     next
         * @apioption accessibility.pointValueSuffix
         */

        /**
         * Decimals to use for the values in the point descriptions. Uses
         * [tooltip.valueDecimals](#tooltip.valueDecimals) if not defined.
         *
         * @type      {string}
         * @since     next
         * @apioption accessibility.pointValueDecimals
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
         * @since     5.0.0
         * @apioption accessibility.pointDescriptionFormatter
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
         * @since     5.0.0
         * @apioption accessibility.seriesDescriptionFormatter
         */

        /**
         * A formatter function to create the HTML contents of the hidden screen
         * reader information region. Receives one argument, `chart`, referring
         * to the chart object. Should return a string with the HTML content
         * of the region. By default this returns an automatic description of
         * the chart.
         *
         * The button to view the chart as a data table will be added
         * automatically after the custom HTML content if enabled.
         *
         * @type    {Highcharts.ScreenReaderFormatterCallbackFunction<Highcharts.Chart>}
         * @default undefined
         * @since   5.0.0
         * @apioption accessibility.screenReaderSectionFormatter
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
             * Set the keyboard navigation mode for the chart. Can be "normal"
             * or "serialize". In normal mode, left/right arrow keys move
             * between points in a series, while up/down arrow keys move between
             * series. Up/down navigation acts intelligently to figure out which
             * series makes sense to move to from any given point.
             *
             * In "serialize" mode, points are instead navigated as a single
             * list. Left/right behaves as in "normal" mode. Up/down arrow keys
             * will behave like left/right. This can be useful for unifying
             * navigation behavior with/without screen readers enabled.
             *
             * @type       {string}
             * @default    normal
             * @since      6.0.4
             * @validvalue ["normal", "serialize"]
             * @apioption  accessibility.keyboardNavigation.mode
             */

            /**
             * Skip null points when navigating through points with the
             * keyboard.
             *
             * @since 5.0.0
             */
            skipNullPoints: true,

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
             * @since next
             */
            order: ['series', 'zoom', 'rangeSelector', 'chartMenu', 'legend'],

            /**
             * Whether or not to wrap around when reaching the end of arrow-key
             * navigation for an element in the chart.
             * @since next
             */
            wrapAround: true
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
         * @since next
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
     * @since      next
     * @default    undefined
     * @apioption  series.line.data.accessibility.description
     */

    /**
     * Accessibility options for a series. Requires the accessibility module.
     *
     * @requires module:modules/accessibility
     *
     * @type       {object}
     * @since      next
     * @apioption  plotOptions.series.accessibility
     */

    /**
     * Enable/disable accessibility functionality for a specific series.
     *
     * @type       {boolean}
     * @since      next
     * @default    undefined
     * @apioption  plotOptions.series.accessibility.enabled
     */

    /**
     * Provide a description of the series, announced to screen readers.
     *
     * @type       {string}
     * @since      next
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
     * @since     next
     * @default   undefined
     * @apioption plotOptions.series.accessibility.pointDescriptionFormatter
     */

    /**
     * Expose only the series element to screen readers, not its points.
     *
     * @type       {boolean}
     * @since      next
     * @default    undefined
     * @apioption  plotOptions.series.accessibility.exposeAsGroupOnly
     */

    /**
     * Keyboard navigation for a series
     *
     * @type       {object}
     * @since      next
     * @apioption  plotOptions.series.accessibility.keyboardNavigation
     */

    /**
     * Enable/disable keyboard navigation support for a specific series.
     *
     * @type       {boolean}
     * @default    undefined
     * @since      next
     * @apioption  plotOptions.series.accessibility.keyboardNavigation.enabled
     */

    /**
     * Accessibility options for an axis. Requires the accessibility module.
     *
     * @requires module:modules/accessibility
     * @since      next
     * @type       {object}
     * @apioption  xAxis.accessibility
     */

    /**
     * Enable axis accessibility features, including axis information in the
     * screen reader information region. If this is disabled on the xAxis, the
     * x values are not exposed to screen readers for the individual data points
     * by default.
     *
     * @since      next
     * @type       {boolean}
     * @default    undefined
     * @apioption  xAxis.accessibility.enabled
     */

    /**
     * Description for an axis to expose to screen reader users.
     *
     * @since      next
     * @type       {string}
     * @default    undefined
     * @apioption  xAxis.accessibility.description
     */

    /**
     * Range description for an axis. Overrides the default range description.
     * Set to empty to disable range description for this axis.
     *
     * @since      next
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
         * @since next
         * @type {object}
         * @apioption legend.accessibility
         */
        accessibility: {

            /**
             * Enable accessibility support for the legend.
             *
             * @since next
             * @apioption legend.accessibility.enabled
             */
            enabled: true,

            /**
             * Options for keyboard navigation for the legend.
             *
             * @since next
             * @apioption legend.accessibility.keyboardNavigation
             */
            keyboardNavigation: {
                /**
                 * Enable keyboard navigation for the legend.
                 *
                 * @since next
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
         * @since next
         * @type {object}
         * @apioption exporting.accessibility
         */
        accessibility: {
            /**
             * Enable accessibility support for the export menu.
             *
             * @since next
             * @apioption exporting.accessibility.enabled
             */
            enabled: true
        }
    }

};

export default options;
