/**
 *
 *  (c) 2010-2021 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var chartNavigation = {
    /**
     * Initializes `chart.navigation` object which delegates `update()` methods
     * to all other common classes (used in exporting and navigationBindings).
     *
     * @private
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     * @return {void}
     */
    initUpdate: function (chart) {
        if (!chart.navigation) {
            chart.navigation = {
                updates: [],
                update: function (options, redraw) {
                    this.updates.forEach(function (updateConfig) {
                        updateConfig.update.call(updateConfig.context, options, redraw);
                    });
                }
            };
        }
    },
    /**
     * Registers an `update()` method in the `chart.navigation` object.
     *
     * @private
     * @param {Highcharts.ChartNavigationUpdateFunction} update
     *        The `update()` method that will be called in `chart.update()`.
     * @param {Highcharts.Chart} chart
     *        The chart instance. `update()` will use that as a context
     *        (`this`).
     * @return {void}
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
