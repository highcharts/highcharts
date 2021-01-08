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

import type Chart from '../Core/Chart/Chart';

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        navigation?: Highcharts.ChartNavigationObject;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface ChartNavigationMixin {
            addUpdate(update: ChartNavigationUpdateFunction, chart: Chart): void;
            initUpdate(chart: Chart): void;
        }
        interface ChartNavigationObject {
            updates: Array<ChartNavigationUpdateObject>;
            update(options: NavigationOptions, redraw?: boolean): void;
        }
        interface ChartNavigationUpdateFunction {
            (this: NavigationChart, options: NavigationOptions, redraw?: boolean): void;
        }
        interface ChartNavigationUpdateObject {
            context: NavigationChart;
            update: ChartNavigationUpdateFunction;
        }
        interface NavigationChart extends Chart {
            addUpdate: ChartNavigationMixin['addUpdate'];
            initUpdate: ChartNavigationMixin['initUpdate'];
            navigation: ChartNavigationObject;
        }
    }
}

const chartNavigation: Highcharts.ChartNavigationMixin = {
    /**
     * Initializes `chart.navigation` object which delegates `update()` methods
     * to all other common classes (used in exporting and navigationBindings).
     *
     * @private
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     * @return {void}
     */
    initUpdate: function (chart: Chart): void {
        if (!chart.navigation) {
            chart.navigation = {
                updates: [],
                update: function (options, redraw?: boolean): void {
                    this.updates.forEach(function (
                        updateConfig: Highcharts.ChartNavigationUpdateObject
                    ): void {
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
     * @param {Highcharts.ChartNavigationUpdateFunction} update
     *        The `update()` method that will be called in `chart.update()`.
     * @param {Highcharts.Chart} chart
     *        The chart instance. `update()` will use that as a context
     *        (`this`).
     * @return {void}
     */
    addUpdate: function (
        update: Highcharts.ChartNavigationUpdateFunction,
        chart: Highcharts.NavigationChart
    ): void {
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
