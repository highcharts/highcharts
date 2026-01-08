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

import type TickPositionsArray from './Axis/TickPositionsArray';
import type TimeTicksInfoObject from './Axis/TimeTicksInfoObject';

import TimeBase from '../Shared/TimeBase.js';
import U from '../Core/Utilities.js';
const {
    defined,
    extend,
    timeUnits
} = U;


/* *
 *
 *  Declarations
 *
 * */


declare module './Axis/TickPositionsArray'{
    interface TickPositionsArray {
        info?: TimeTicksInfoObject;
    }
}

/* *
 *
 *  Constants
 *
 * */
class Time extends TimeBase {

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
    public getTimeTicks(
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
                    // Spanish weekday index
                    weekdayNo = 'DLMXJVS'.indexOf(weekday);

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
}

/* *
 *
 * Class namespace
 *
 * */

namespace Time {

    export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
        dateStyle?: 'full'|'long'|'medium'|'short';
        fractionalSecondDigits?: 1|2|3;
        prefix?: string;
        suffix?: string;
        timeStyle?: 'full'|'long'|'medium'|'short';
    }

    export type DateTimeFormat = string|DateTimeFormatOptions;

    export interface DateTimeLabelFormatObject {
        from?: DateTimeFormat;
        list?: DateTimeFormat[];
        main: DateTimeFormat;
        range?: boolean;
        to?: DateTimeFormat;
    }

    export type DateTimeLabelFormatOption = (
        DateTimeFormat|
        Array<string>|
        Time.DateTimeLabelFormatObject
    );
    export type DateTimeLabelFormatsOption = (
        Record<TimeUnit, DateTimeLabelFormatOption>
    );
    export interface TimeOptions {
        Date?: any;
        locale?: string|Array<string>;
        timezone?: string;
        timezoneOffset?: number;
        useUTC?: boolean;
    }
    export interface TimeFormatCallbackFunction {
        (this: Time, timestamp: number): string;
    }
    export interface TimeNormalizedObject {
        /**
         * The count of the interval.
         */
        count: number;
        /**
         * The name of the time unit.
         */
        unitName: TimeUnit;
        /**
         * The interval in axis values (ms).
         */
        unitRange: number;
    }
    export type TimeUnit = (
        'millisecond'|
        'second'|
        'minute'|
        'hour'|
        'day'|
        'week'|
        'month'|
        'year'
    );
    export type TimeUnitValue = (
        'Date'|
        'Day'|
        'FullYear'|
        'Hours'|
        'Milliseconds'|
        'Minutes'|
        'Month'|
        'Seconds'
    );
}

/* *
 *
 * Default export
 *
 * */

export default Time;
