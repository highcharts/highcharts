/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

/** @internal */
declare module './ChartBase'{
    interface ChartBase {
        navigation?: ChartNavigationComposition.Additions;
    }
}

/* *
 *
 *  Composition
 *
 * */

/** @internal */
namespace ChartNavigationComposition {

    /* *
     *
     *  Declarations
     *
     * */

    /** @internal */
    export interface Composition extends Chart {
        navigation: Additions;
    }

    /** @internal */
    export interface UpdateFunction {
        (this: Composition, options: NavigationOptions, redraw?: boolean): void;
    }

    /** @internal */
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

    /** @internal */
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
     * @internal
     */
    export class Additions {

        /* *
         *
         *  Constructor
         *
         * */

        /** @internal */
        constructor(chart: Composition) {
            this.chart = chart;
        }

        /* *
         *
         *  Properties
         *
         * */

        private chart: Composition;

        /** @internal */
        public updates: Array<UpdateFunction> = [];

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Registers an `update()` method in the `chart.navigation` object.
         *
         * @internal
         * @param {UpdateFunction} updateFn
         * The `update()` method that will be called in `chart.update()`.
         */
        public addUpdate(updateFn: UpdateFunction): void {
            this.chart.navigation.updates.push(updateFn);
        }

        /** @internal */
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

/** @internal */
export default ChartNavigationComposition;
