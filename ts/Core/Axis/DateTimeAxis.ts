/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import Axis from './Axis.js';
import U from '../Utilities.js';
const {
    addEvent,
    getMagnitude,
    normalizeTickInterval,
    timeUnits
} = U;

declare module '../Series/SeriesOptions' {
    interface SeriesOptions {
        pointInterval?: number;
        pointIntervalUnit?: Highcharts.SeriesPointIntervalUnitValue;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type DateTimeLabelFormatsKey = keyof XAxisDateTimeLabelFormatsOptions;
        interface DateTimeAxisNormalizedObject extends TimeNormalizedObject {
            unitName: DateTimeLabelFormatsKey;
        }
        interface DateTimeLabelFormatOptionsObject {
            main?: string;
            range?: boolean;
        }
        interface XAxisDateTimeLabelFormatsOptions {
            day?: (string|DateTimeLabelFormatOptionsObject);
            hour?: (string|DateTimeLabelFormatOptionsObject);
            millisecond?: (string|DateTimeLabelFormatOptionsObject);
            minute?: (string|DateTimeLabelFormatOptionsObject);
            month?: (string|DateTimeLabelFormatOptionsObject);
            second?: (string|DateTimeLabelFormatOptionsObject);
            week?: (string|DateTimeLabelFormatOptionsObject);
            year?: (string|DateTimeLabelFormatOptionsObject);
        }
        interface XAxisOptions {
            dateTimeLabelFormats?: XAxisDateTimeLabelFormatsOptions;
            units?: Array<[DateTimeLabelFormatsKey, (Array<number>|null)]>;
        }
    }
}

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        dateTime?: DateTimeAxis['dateTime'];
    }
    interface AxisTypeRegistry {
        DateTimeAxis: DateTimeAxis;
    }
}

/* eslint-disable valid-jsdoc */

class DateTimeAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: DateTimeAxis) {
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
     * Get a normalized tick interval for dates. Returns a configuration object
     * with unit range (interval), count and name. Used to prepare data for
     * `getTimeTicks`. Previously this logic was part of getTimeTicks, but as
     * `getTimeTicks` now runs of segments in stock charts, the normalizing
     * logic was extracted in order to prevent it for running over again for
     * each segment having the same interval. #662, #697.
     * @private
     */
    /**
     * Get a normalized tick interval for dates. Returns a configuration object
     * with unit range (interval), count and name. Used to prepare data for
     * `getTimeTicks`. Previously this logic was part of getTimeTicks, but as
     * `getTimeTicks` now runs of segments in stock charts, the normalizing
     * logic was extracted in order to prevent it for running over again for
     * each segment having the same interval. #662, #697.
     * @private
     */
    public normalizeTimeTickInterval(
        tickInterval: number,
        unitsOption?: Array<[Highcharts.DateTimeLabelFormatsKey, (Array<number>|null)]>
    ): Highcharts.DateTimeAxisNormalizedObject {
        var units = unitsOption || [[
                'millisecond', // unit name
                [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
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
            ]] as Array<[Highcharts.DateTimeLabelFormatsKey, (Array<number>|null)]>,
            unit = units[units.length - 1], // default unit is years
            interval = timeUnits[unit[0]],
            multiples = unit[1],
            count,
            i;

        // loop through the units to find the one that best fits the
        // tickInterval
        for (i = 0; i < units.length; i++) {
            unit = units[i];
            interval = timeUnits[unit[0]];
            multiples = unit[1];


            if (units[i + 1]) {
                // lessThan is in the middle between the highest multiple and
                // the next unit.
                var lessThan = (
                    interval *
                    (multiples as any)[(multiples as any).length - 1] +
                    timeUnits[units[i + 1][0]]
                ) / 2;

                // break and keep the current unit
                if (tickInterval <= lessThan) {
                    break;
                }
            }
        }

        // prevent 2.5 years intervals, though 25, 250 etc. are allowed
        if (interval === timeUnits.year && tickInterval < 5 * interval) {
            multiples = [1, 2, 5];
        }

        // get the count
        count = normalizeTickInterval(
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

}

/**
 * Date and time support for axes.
 *
 * @private
 * @class
 */
class DateTimeAxis {

    /* *
     *
     *  Static Properties
     *
     * */

    public static AdditionsClass = DateTimeAxisAdditions;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Extends axis class with date and time support.
     * @private
     */
    public static compose(AxisClass: typeof Axis): void {

        AxisClass.keepProps.push('dateTime');

        const axisProto = AxisClass.prototype as DateTimeAxis;

        /**
         * Set the tick positions to a time unit that makes sense, for example
         * on the first of each month or on every Monday. Return an array with
         * the time positions. Used in datetime axes as well as for grouping
         * data on a datetime axis.
         *
         * @private
         * @function Highcharts.Axis#getTimeTicks
         *
         * @param {Highcharts.TimeNormalizeObject} normalizedInterval
         * The interval in axis values (ms) and thecount.
         *
         * @param {number} min
         * The minimum in axis values.
         *
         * @param {number} max
         * The maximum in axis values.
         *
         * @param {number} startOfWeek
         *
         * @return {Highcharts.AxisTickPositionsArray}
         */
        axisProto.getTimeTicks = function (): Highcharts.AxisTickPositionsArray {
            return this.chart.time.getTimeTicks.apply(
                this.chart.time, arguments as any
            );
        };

        /* eslint-disable no-invalid-this */

        addEvent(AxisClass, 'init', function (e: { userOptions: Axis['userOptions'] }): void {
            const axis = this;
            const options = e.userOptions;

            if (options.type !== 'datetime') {
                axis.dateTime = void 0;
                return;
            }

            if (!axis.dateTime) {
                axis.dateTime = new DateTimeAxisAdditions(axis as DateTimeAxis);
            }
        });

        /* eslint-enable no-invalid-this */

    }

}

interface DateTimeAxis extends Axis {
    dateTime: DateTimeAxisAdditions;
}

DateTimeAxis.compose(Axis);

export default DateTimeAxis;
