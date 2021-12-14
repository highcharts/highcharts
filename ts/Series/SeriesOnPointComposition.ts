/* *
 *
 *  (c) 2010-2021 Rafal i Pjoter
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

import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';

import U from '../Core/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointLike' {
    interface PointLike {

    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        seriesOnPoint?: SeriesOnPointComposition.Additions;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        valueToAdd?: number;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace SeriesOnPointComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends Point {

    }

    export declare class SeriesComposition extends Series {
        seriesOnPoint: Additions;
        initSeriesOnPoint(valueToAdd: number): void;
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
     * @param PointClass
     * Point class to use.
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T
        // PointClass: typeof Point
    ): (typeof SeriesComposition&T) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            // const seriesProto = SeriesClass.prototype as SeriesComposition;

            addEvent(SeriesClass, 'afterInit', afterInit);

        }

        return SeriesClass as (typeof SeriesComposition&T);
    }


    /**
     * Extend series.init by adding a methods to add a value.
     *
     * @ignore
     * @function Highcharts.Series#init
    */
    function afterInit(this: Series): void {
        const valueToAdd = this.options.valueToAdd;
        let seriesOnPoint: Additions|undefined;

        if (valueToAdd) {
            seriesOnPoint = new Additions(this as SeriesComposition);
            seriesOnPoint.initSeriesOnPoint(valueToAdd);
        }

        this.seriesOnPoint = seriesOnPoint;
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

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(series: SeriesComposition) {
            this.series = series;
        }

        /* *
         *
         *  Properties
         *
         * */

        public series: SeriesComposition;

        /**
         * @ignore
         * @function Highcharts.Series#initCompare
         *
         * @param {number} [valueToAdd]
         *        Will be added to 10.
         */
        public initSeriesOnPoint(valueToAdd: number): void {
            console.log(10 + valueToAdd); // eslint-disable-line no-console
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesOnPointComposition;

/* *
 *
 *  API Options
 *
 * */

''; // keeps doclets above in transpiled file
