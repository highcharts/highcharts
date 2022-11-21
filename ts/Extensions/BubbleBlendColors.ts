/* *
 *
 *  (c) 2010-2022
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

import SeriesRegistry from '../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        bubble: BubbleSeries
    }
} = SeriesRegistry;

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';

const {
    addEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

/* *
 *
 *  Composition
 *
 * */

namespace BubbleBlendColorsComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class BubbleBlendColorsComposition extends BubbleSeries {

    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends the series with a small addition.
     *
     * @private
     *
     * @param SeriesClass
     * Series class to use.
     *
     * @param ChartClass
     * Chart class to use.
     */
    export function compose<T extends typeof BubbleSeries>(
        SeriesClass: T
    ): (typeof BubbleBlendColorsComposition & T) {
        const {
            seriesAfterInit
        } = Additions.prototype;

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            addEvent(BubbleSeries, 'afterInit', seriesAfterInit);
        }

        return SeriesClass as (typeof BubbleBlendColorsComposition & T);
    }

    /* *
     *
     *  Classes
     *
     * */

    /**
     * @private
     */
    export class Additions {
        chart: Chart;
        series: BubbleBlendColorsComposition;

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(series: BubbleBlendColorsComposition) {
            this.chart = series.chart;
            this.series = series;
        }

        /* *
         *
         *  Properties
         *
         * */

        /**
         * Initialize Series on point on series init.
         *
         * @ignore
         */
        public seriesAfterInit(this: any): void {
            // console.log('Hello composition!');
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BubbleBlendColorsComposition;

/* *
 *
 *  API Options
 *
 * */

''; // keeps doclets above in transpiled file
