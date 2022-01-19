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
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const { pie } = SeriesRegistry.seriesTypes;

import U from '../Core/Utilities.js';
const {
    addEvent,
    isObject
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
            pie.prototype.getCenter = getCenter;
            // const seriesProto = SeriesClass.prototype as SeriesComposition;
            // seriesProto.setCompare = seriesSetCompare;

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

    function getCenter(this: any): any {
        const connectedPoint = this.chart.get(this.options.onPoint.id),
            position = this.options.onPoint.position;

        let x = connectedPoint.plotX,
            y = connectedPoint.plotY;

        if (isObject(position)) {
            if (position.x) {
                x = position.x;
            }

            if (position.y) {
                y = position.y;
            }

            if (position.offsetX) {
                x += position.offsetX;
            }

            if (position.offsetY) {
                y += position.offsetY;
            }
        }

        // 0: centerX, relative to width
        // 1: centerY, relative to height
        // 2: size, relative to smallestSize
        // 3: innerSize, relative to size
        return [x, y, 50, 0];
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
