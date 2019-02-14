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

var options = {

    /**
     * Options for configuring accessibility for the chart. Requires the
     * [accessibility module](https://code.highcharts.com/modules/accessibility.js)
     * to be loaded. For a description of the module and information
     * on its features, see
     * [Highcharts Accessibility](http://www.highcharts.com/docs/chart-concepts/accessibility).
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
         * @type  {false|number}
         * @since 5.0.0
         */
        pointDescriptionThreshold: false, // set to false to disable

        /**
         * Whether or not to add a shortcut button in the screen reader
         * information region to show the data table.
         * @since next
         */
        addTableShortcut: true,

        /**
         * A text description of the chart.
         *
         * If the Accessibility module is loaded, this is included by default
         * as a long description of the chart and its contents in the hidden
         * screen reader information region.
         *
         * @see [typeDescription](#accesibility.typeDescription)
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accesibility.description
         */

        /**
         * A text description of the chart type.
         *
         * If the Accessibility module is loaded, this will be included in the
         * description of the chart in the screen reader information region.
         *
         *
         * Highcharts will by default attempt to guess the chart type, but for
         * more complex charts it is recommended to specify this property for
         * clarity.
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accesibility.typeDescription
         */

        /**
         * Whether or not to add series descriptions to charts with a single
         * series.
         *
         * @type      {boolean}
         * @default   false
         * @since     5.0.0
         * @apioption accessibility.describeSingleSeries
         */

        /**
         * Function to run upon clicking the "View as Data Table" link in the
         * screen reader region.
         *
         * By default Highcharts will insert and set focus to a data table
         * representation of the chart.
         *
         * @type      {Function}
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
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.pointDateFormatter
         */

        /**
         * Formatter function to use instead of the default for point
         * descriptions.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a String with the description of the point for a screen
         * reader user. If `false` is returned, the default formatter will be
         * used for that point.
         *
         * @see [point.description](#series.line.data.description)
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.pointDescriptionFormatter
         */

        /**
         * Formatter function to use instead of the default for series
         * descriptions. Receives one argument, `series`, referring to the
         * series to describe. Should return a String with the description of
         * the series for a screen reader user. If `false` is returned, the
         * default formatter will be used for that series.
         *
         * @see [series.description](#plotOptions.series.description)
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.seriesDescriptionFormatter
         */

        /**
         * A formatter function to create the HTML contents of the hidden screen
         * reader information region. Receives one argument, `chart`, referring
         * to the chart object. Should return a String with the HTML content
         * of the region. By default this returns an automatic description of
         * the chart.
         *
         * The button to view the chart as a data table will be added
         * automatically after the custom HTML content if enabled.
         *
         * @type    {Function}
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
             * will behave like left/right. This is useful for unifying
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
             * `rangeSelector`, `chartMenu`, `legend`
             *
             * @since next
             */
            order: ['series', 'zoom', 'rangeSelector', 'chartMenu', 'legend'],

            /**
             * Whether or not to wrap around when reaching the end of arrow
             * navigation for an element in the chart.
             * @since next
             */
            wrapAround: true
        }

    },


    /**
     * Accessibility options for a series. Requires the accessibility module.
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
     * @apioption  plotOptions.series.accessibility.enabled
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
     * @apioption plotOptions.series.accessibility.pointDescriptionFormatter
     */

    /**
     * Expose only the series element to screen readers, not its points.
     *
     * @type       {boolean}
     * @since      next
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
     * @since      next
     * @apioption  plotOptions.series.accessibility.keyboardNavigation.enabled
     */


    legend: {
        /**
         * Accessibility options for the legend. Requires the Accessibility
         * module.
         *
         * @since next
         * @apioption legend.accessibility
         */
        accessibility: {

            /**
             * Enable accessibility support for the legend.
             *
             * @since next
             */
            enabled: true,

            /**
             * Options for keyboard navigation for the legend.
             *
             * @since next
             */
            keyboardNavigation: {
                /**
                 * Enable keyboard navigation for the legend.
                 *
                 * @since next
                 * @see [accessibility.keyboardNavigation](
                 *      #accessibility.keyboardNavigation.enabled)
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
         * @since next
         * @apioption exporting.accessibility
         */
        accessibility: {
            /**
             * Enable accessibility support for the export menu.
             *
             * @since next
             */
            enabled: true
        }
    }

};

export default options;
