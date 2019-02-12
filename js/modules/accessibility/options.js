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
     * @since        5.0.0
     * @optionparent accessibility
     */
    accessibility: {
        /**
         * Enable accessibility functionality for the chart.
         *
         * @since next
         */
        enabled: true,

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
        },

        /**
         * Whether or not to add a shortcut button in the screen reader
         * information region to show the data table.
         * @since next
         */
        addTableShortcut: true
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
