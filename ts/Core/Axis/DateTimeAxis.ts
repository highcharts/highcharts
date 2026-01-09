/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from './Axis';
import type AxisOptions from './AxisOptions';
import type TickPositionsArray from './TickPositionsArray';
import type Time from '../Time';
import type Types from '../../Shared/Types';

import U from '../Utilities.js';
const {
    addEvent,
    getMagnitude,
    normalizeTickInterval,
    timeUnits
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './AxisComposition' {
    interface AxisComposition {
        dateTime?: DateTimeAxis.Composition['dateTime'];
        getTimeTicks(
            normalizedInterval: Time.TimeNormalizedObject,
            min: number,
            max: number,
            startOfWeek?: number,
            positions?: Array<number>|Types.TypedArray,
            closestDistance?: number,
            findHigherRanks?: boolean
        ): TickPositionsArray;
    }
}

/** @internal */
declare module './AxisOptions' {
    interface AxisOptions {
        dateTimeLabelFormats?: Time.DateTimeLabelFormatsOption;
        units?: Array<[Time.TimeUnit, (Array<number>|null)]>;
    }
}

/** @internal */
declare module './AxisType' {
    interface AxisTypeRegistry {
        DateTimeAxis: DateTimeAxis.Composition;
    }
}

declare module '../Series/SeriesOptions' {
    interface SeriesOptions {
        pointInterval?: number;
        pointIntervalUnit?: DateTimeAxis.PointIntervalUnitValue;
    }
}

declare module './TimeTicksInfoObject' {
    interface TimeTicksInfoObject extends Time.TimeNormalizedObject {
        // Nothing to add
    }
}

/* *
 *
 *  Composition
 *
 * */

/* eslint-disable valid-jsdoc */

namespace DateTimeAxis{

    /* *
     *
     *  Declarations
     *
     * */

    /** @internal */
    export declare class Composition extends Axis {
        dateTime: Additions;
    }

    export type PointIntervalUnitValue = ('day'|'month'|'year');

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extends axis class with date and time support.
     * @internal
     */
    export function compose<T extends typeof Axis>(
        AxisClass: T
    ): (typeof Composition&T) {

        if (!AxisClass.keepProps.includes('dateTime')) {
            AxisClass.keepProps.push('dateTime');

            const axisProto = AxisClass.prototype as DateTimeAxis.Composition;

            axisProto.getTimeTicks = getTimeTicks;

            addEvent(AxisClass, 'afterSetType', onAfterSetType);
        }

        return AxisClass as (typeof Composition&T);
    }

    /**
     * Set the tick positions to a time unit that makes sense, for example
     * on the first of each month or on every Monday. Return an array with
     * the time positions. Used in datetime axes as well as for grouping
     * data on a datetime axis.
     *
     * @internal
     * @function Highcharts.Axis#getTimeTicks
     * @param {Highcharts.TimeNormalizeObject} normalizedInterval
     * The interval in axis values (ms) and the count.
     * @param {number} min
     * The minimum in axis values.
     * @param {number} max
     * The maximum in axis values.
     */
    function getTimeTicks(
        this: Axis
    ): TickPositionsArray {
        return this.chart.time.getTimeTicks.apply(
            this.chart.time, arguments
        );
    }

    /** @internal */
    function onAfterSetType(
        this: Axis
    ): void {
        if (this.type !== 'datetime') {
            this.dateTime = void 0;
            return;
        }

        if (!this.dateTime) {
            this.dateTime = new Additions(this as DateTimeAxis.Composition);
        }
    }

    /* *
     *
     *  Classes
     *
     * */

    /** @internal */
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        public constructor(axis: DateTimeAxis.Composition) {
            this.axis = axis;
        }

        /* *
         *
         *  Properties
         *
         * */

        public axis: Axis;

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Get a normalized tick interval for dates. Returns a configuration
         * object with unit range (interval), count and name. Used to prepare
         * data for `getTimeTicks`. Previously this logic was part of
         * getTimeTicks, but as `getTimeTicks` now runs of segments in stock
         * charts, the normalizing logic was extracted in order to prevent it
         * for running over again for each segment having the same interval.
         * #662, #697.
         * @internal
         */
        public normalizeTimeTickInterval(
            tickInterval: number,
            unitsOption?: AxisOptions['units']
        ): Time.TimeNormalizedObject {
            const units = (
                unitsOption || [[
                    // Unit name
                    'millisecond',
                    // Allowed multiples
                    [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]
                ], [
                    'second',
                    [1, 2, 5, 10, 15, 30]
                ], [
                    'minute',
                    [1, 2, 5, 10, 15, 30]
                ], [
                    'hour',
                    [1, 2, 3, 4, 6, 8, 12]
                ], [
                    'day',
                    [1, 2]
                ], [
                    'week',
                    [1, 2]
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ], [
                    'year',
                    null
                ]] as Required<AxisOptions>['units']
            );

            let unit = units[units.length - 1], // Default unit is years
                interval = timeUnits[unit[0]],
                multiples = unit[1],
                i;

            // Loop through the units to find the one that best fits the
            // tickInterval
            for (i = 0; i < units.length; i++) {
                unit = units[i];
                interval = timeUnits[unit[0]];
                multiples = unit[1];


                if (units[i + 1]) {
                    // `lessThan` is in the middle between the highest multiple
                    // and the next unit.
                    const lessThan = (
                        interval *
                        (multiples as any)[(multiples as any).length - 1] +
                        timeUnits[units[i + 1][0]]
                    ) / 2;

                    // Break and keep the current unit
                    if (tickInterval <= lessThan) {
                        break;
                    }
                }
            }

            // Prevent 2.5 years intervals, though 25, 250 etc. are allowed
            if (interval === timeUnits.year && tickInterval < 5 * interval) {
                multiples = [1, 2, 5];
            }

            // Get the count
            const count = normalizeTickInterval(
                tickInterval / interval,
                multiples as any,
                unit[0] === 'year' ? // #1913, #2360
                    Math.max(getMagnitude(tickInterval / interval), 1) :
                    1
            );

            return {
                unitRange: interval,
                count: count,
                unitName: unit[0]
            };
        }

        /**
         * Get the best date format for a specific X value based on the closest
         * point range on the axis.
         *
         * @internal
         */
        public getXDateFormat(
            x: number,
            dateTimeLabelFormats: Time.DateTimeLabelFormatsOption
        ): Time.DateTimeFormat {
            const { axis } = this,
                time = axis.chart.time;

            return axis.closestPointRange ?
                time.getDateFormat(
                    axis.closestPointRange,
                    x,
                    axis.options.startOfWeek,
                    dateTimeLabelFormats
                ) ||
                // #2546, 2581
                time.resolveDTLFormat(dateTimeLabelFormats.year).main :
                time.resolveDTLFormat(dateTimeLabelFormats.day).main;
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DateTimeAxis;
