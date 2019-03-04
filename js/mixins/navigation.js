/**
 * (c) 2010-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';

var chartNavigation = {
    /**
     * Initializes `chart.navigation` object which delegates `update()` methods
     * to all other common classes (used in exporting and navigationBindings).
     *
     * @private
     *
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     */
    initUpdate: function (chart) {
        if (!chart.navigation) {
            chart.navigation = {
                updates: [],
                update: function (options, redraw) {
                    this.updates.forEach(function (updateConfig) {
                        updateConfig.update.call(
                            updateConfig.context,
                            options,
                            redraw
                        );
                    });
                }
            };
        }
    },
    /**
     * Registers an `update()` method in the `chart.navigation` object.
     *
     * @private
     *
     * @param {function} update
     *        The `update()` method that will be called in `chart.update()`.
     *
     * @param {Highcharts.Chart} chart
     *        The chart instance. `update()` will use that as a context
     *        (`this`).
     */
    addUpdate: function (update, chart) {
        if (!chart.navigation) {
            this.initUpdate(chart);
        }

        chart.navigation.updates.push({
            update: update,
            context: chart
        });
    }
};

export default chartNavigation;
