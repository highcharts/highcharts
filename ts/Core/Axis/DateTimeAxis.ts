/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type Axis from './Axis';
import type AxisOptions from './AxisOptions';
import type TickPositionsArray from './TickPositionsArray';
import type TimeTicksInfoObject from './TimeTicksInfoObject';

import Time from '../Time';
import U from '../Utilities.js';
const {
    addEvent,
    getMagnitude,
    normalizeTickInterval,
    extend,
    defined,
    timeUnits
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisComposition' {
    interface AxisComposition {
        dateTime?: DateTimeAxis.Composition['dateTime'];
    }
}

declare module './AxisOptions' {
    interface AxisOptions {
        dateTimeLabelFormats?: Time.DateTimeLabelFormatsOption;
        units?: Array<[Time.TimeUnit, (Array<number>|null)]>;
    }
}

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

declare module './TickPositionsArray'{
    interface TickPositionsArray {
        info?: TimeTicksInfoObject;
    }
}

declare module '../Time' {
    export default interface Time {
        getTimeTicks(
            normalizedInterval: Time.TimeNormalizedObject,
            min: number,
            max: number,
            startOfWeek?: number
        ): TickPositionsArray;
    }
}

/* *
 *
 *  Composition
 *
 * */

/* eslint-disable valid-jsdoc */

namespace DateTimeAxis {

    /* *
     *
     *  Declarations
     *
     * */

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
     * @private
     */
    export function compose<T extends typeof Axis>(
        AxisClass: T
    ): (typeof Composition&T) {

        if (!AxisClass.keepProps.includes('dateTime')) {
            AxisClass.keepProps.push('dateTime');

            const axisProto = AxisClass.prototype as DateTimeAxis.Composition;

            axisProto.getTimeTicks = getDateTimeTicks;

            addEvent(AxisClass, 'afterSetType', onAfterSetType);
        }

        extend(Time.prototype, {
            getTimeTicks: getTimeTicks
        });

        return AxisClass as (typeof Composition&T);
    }

    /**
     * Set the tick positions to a time unit that makes sense, for example
     * on the first of each month or on every Monday. Return an array with
     * the time positions. Used in datetime axes as well as for grouping
     * data on a datetime axis.
     *
     * @private
     * @function Highcharts.Axis#getTimeTicks
     * @param {Highcharts.TimeNormalizeObject} normalizedInterval
     * The interval in axis values (ms) and the count.
     * @param {number} min
     * The minimum in axis values.
     * @param {number} max
     * The maximum in axis values.
     */
    function getDateTimeTicks(
        this: Axis
    ): TickPositionsArray {
        return this.chart.time.getTimeTicks.apply(
            this.chart.time, arguments
        );
    }

    /**
     * Return an array with time positions distributed on round time values
     * right and right after min and max. Used in datetime axes as well as for
     * grouping data on a datetime axis.
     *
     * @function Highcharts.Time#getTimeTicks
     *
     * @param {Highcharts.TimeNormalizedObject} normalizedInterval
     *        The interval in axis values (ms) and the count
     *
     * @param {number} [min]
     *        The minimum in axis values
     *
     * @param {number} [max]
     *        The maximum in axis values
     *
     * @param {number} [startOfWeek=1]
     *
     * @return {Highcharts.AxisTickPositionsArray}
     * Time positions
     */
    function getTimeTicks(
        this: Time,
        normalizedInterval: Time.TimeNormalizedObject,
        min?: number,
        max?: number,
        startOfWeek?: number
    ): TickPositionsArray {
        const time = this,
            tickPositions = [] as TickPositionsArray,
            higherRanks = {} as Record<string, string>,
            { count = 1, unitRange } = normalizedInterval;

        let [
                year,
                month,
                dayOfMonth,
                hours,
                minutes,
                seconds
            ] = time.toParts(min),
            milliseconds = (min || 0) % 1000,
            variableDayLength: boolean|undefined;

        startOfWeek ??= 1;

        if (defined(min)) { // #1300
            milliseconds = unitRange >= timeUnits.second ?
                0 : // #3935
                count * Math.floor(milliseconds / count);

            if (unitRange >= timeUnits.second) { // Second
                seconds = unitRange >= timeUnits.minute ?
                    0 : // #3935
                    count * Math.floor(seconds / count);
            }


            if (unitRange >= timeUnits.minute) { // Minute
                minutes = unitRange >= timeUnits.hour ?
                    0 :
                    count * Math.floor(minutes / count);
            }

            if (unitRange >= timeUnits.hour) { // Hour
                hours = unitRange >= timeUnits.day ?
                    0 :
                    count * Math.floor(hours / count);
            }

            if (unitRange >= timeUnits.day) { // Day
                dayOfMonth = unitRange >= timeUnits.month ?
                    1 :
                    Math.max(
                        1,
                        count * Math.floor(dayOfMonth / count)
                    );
            }

            if (unitRange >= timeUnits.month) { // Month
                month = unitRange >= timeUnits.year ? 0 :
                    count * Math.floor(month / count);
            }

            if (unitRange >= timeUnits.year) { // Year
                year -= year % count;
            }

            // Week is a special case that runs outside the hierarchy
            if (unitRange === timeUnits.week) {
                if (count) {
                    min = time.makeTime(
                        year,
                        month,
                        dayOfMonth,
                        hours,
                        minutes,
                        seconds,
                        milliseconds
                    );
                }

                // Get start of current week, independent of count
                const weekday = this.dateTimeFormat({
                        timeZone: this.timezone,
                        weekday: 'narrow'
                    }, min, 'es'),
                    weekdayNo = this.spanishWeekdayIndex(weekday);

                dayOfMonth += -weekdayNo + startOfWeek +
                    // We don't want to skip days that are before
                    // startOfWeek (#7051)
                    (weekdayNo < startOfWeek ? -7 : 0);

            }

            min = time.makeTime(
                year,
                month,
                dayOfMonth,
                hours,
                minutes,
                seconds,
                milliseconds
            );

            // Handle local timezone offset
            if (time.variableTimezone && defined(max)) {
                // Detect whether we need to take the DST crossover into
                // consideration. If we're crossing over DST, the day length may
                // be 23h or 25h and we need to compute the exact clock time for
                // each tick instead of just adding hours. This comes at a cost,
                // so first we find out if it is needed (#4951).
                variableDayLength = (
                    // Long range, assume we're crossing over.
                    max - min > 4 * timeUnits.month ||
                    // Short range, check if min and max are in different time
                    // zones.
                    time.getTimezoneOffset(min) !==
                    time.getTimezoneOffset(max)
                );
            }

            // Iterate and add tick positions at appropriate values
            let t = min,
                i = 1;
            while (t < (max as any)) {
                tickPositions.push(t);

                // Increase the years
                if (unitRange === timeUnits.year) {
                    t = time.makeTime(year + i * count, 0);

                // Increase the months
                } else if (unitRange === timeUnits.month) {
                    t = time.makeTime(year, month + i * count);

                // If we're using local time, the interval is not fixed as it
                // jumps one hour at the DST crossover
                } else if (
                    variableDayLength && (
                        unitRange === timeUnits.day ||
                        unitRange === timeUnits.week
                    )
                ) {
                    t = time.makeTime(
                        year,
                        month,
                        dayOfMonth +
                            i * count * (unitRange === timeUnits.day ? 1 : 7)
                    );

                } else if (
                    variableDayLength &&
                    unitRange === timeUnits.hour &&
                    count > 1
                ) {
                    // Make sure higher ranks are preserved across DST (#6797,
                    // #7621)
                    t = time.makeTime(
                        year,
                        month,
                        dayOfMonth,
                        hours + i * count
                    );

                // Else, the interval is fixed and we use simple addition
                } else {
                    t += unitRange * count;
                }

                i++;
            }

            // Push the last time
            tickPositions.push(t);


            // Handle higher ranks. Mark new days if the time is on midnight
            // (#950, #1649, #1760, #3349). Use a reasonable dropout threshold
            // to prevent looping over dense data grouping (#6156).
            if (unitRange <= timeUnits.hour && tickPositions.length < 10000) {
                tickPositions.forEach((t: number): void => {
                    if (
                        // Speed optimization, no need to run dateFormat unless
                        // we're on a full or half hour
                        t % 1800000 === 0 &&
                        // Check for local or global midnight
                        time.dateFormat('%H%M%S%L', t) === '000000000'
                    ) {
                        higherRanks[t] = 'day';
                    }
                });
            }
        }

        // Record information on the chosen unit - for dynamic label formatter
        tickPositions.info = extend<Time.TimeNormalizedObject|TimeTicksInfoObject>(
            normalizedInterval,
            {
                higherRanks,
                totalRange: unitRange * count
            }
        ) as TimeTicksInfoObject;

        return tickPositions;
    }

    /**
     * @private
     */
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
         * @private
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
         * @private
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
