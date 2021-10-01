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

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart';
import type NavigationOptions from '../../Extensions/Exporting/NavigationOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module './ChartLike'{
    interface ChartLike {
        navigation?: ChartNavigationComposition.Additions;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace ChartNavigationComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Composition extends Chart {
        navigation: Additions;
    }

    export interface UpdateFunction {
        (this: Composition, options: NavigationOptions, redraw?: boolean): void;
    }

    export interface UpdateObject {
        context: Composition;
        update: UpdateFunction;
    }

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose<T extends Chart>(
        chart: T
    ): (T&Composition) {
        if (!chart.navigation) {
            chart.navigation = new Additions(chart as Composition);
        }

        return chart as (T&Composition);
    }

    /* *
     *
     *  Class
     *
     * */

    /**
     * Initializes `chart.navigation` object which delegates `update()` methods
     * to all other common classes (used in exporting and navigationBindings).
     * @private
     */
    export class Additions {

        /* *
         *
         *  Constructor
         *
         * */

        constructor(chart: Composition) {
            this.chart = chart;
        }

        /* *
         *
         *  Properties
         *
         * */

        private chart: Composition;

        public updates: Array<UpdateFunction> = [];

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Registers an `update()` method in the `chart.navigation` object.
         *
         * @private
         * @param {UpdateFunction} updateFn
         * The `update()` method that will be called in `chart.update()`.
         */
        public addUpdate(updateFn: UpdateFunction): void {
            this.chart.navigation.updates.push(updateFn);
        }

        /**
         * @private
         */
        public update(
            options: NavigationOptions,
            redraw?: boolean
        ): void {
            this.updates.forEach((updateFn): void => {
                updateFn.call(
                    this.chart,
                    options,
                    redraw
                );
            });
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ChartNavigationComposition;
