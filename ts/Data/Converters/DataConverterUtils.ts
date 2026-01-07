/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Kamil Kubik
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import DataConverter from './DataConverter';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    isNumber
} = U;

/* *
 *
 *  Namespace
 *
 * */

namespace DataConverterUtils {

    /* *
    *
    *  Properties
    *
    * */

    /* *
    *
    * Functions
    *
    * */

    /**
     * Converts a value to a Date.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {globalThis.Date}
     * Converted value as a Date.
     */
    export function asDate(
        value: DataConverter.Type,
        converter: DataConverter
    ): Date {
        let timestamp;

        if (typeof value === 'string') {
            timestamp = converter.parseDate(value);
        } else if (typeof value === 'number') {
            timestamp = value;
        } else if (value instanceof Date) {
            return value;
        } else {
            timestamp = converter.parseDate(asString(value));
        }

        return new Date(timestamp);
    }

    /**
     * Converts a value to a number.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {number}
     * Converted value as a number.
     */
    export function asNumber(
        value: DataConverter.Type,
        decimalRegExp?: RegExp
    ): number {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }

        if (typeof value === 'string') {
            const decimalRegex = decimalRegExp;

            if (value.indexOf(' ') > -1) {
                value = value.replace(/\s+/g, '');
            }

            if (decimalRegex) {
                if (!decimalRegex.test(value)) {
                    return NaN;
                }
                value = value.replace(decimalRegex, '$1.$2');
            }

            return parseFloat(value);
        }

        if (value instanceof Date) {
            return value.getDate();
        }
        if (value) {
            return value.getRowCount();
        }

        return NaN;
    }

    /**
     * Converts a value to a string.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {string}
     * Converted value as a string.
     */
    export function asString(value: DataConverter.Type): string {
        return '' + value;
    }

    /**
     * Converts a value to a boolean.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {boolean}
     * Converted value as a boolean.
     */
    export function asBoolean(value: DataConverter.Type): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        return !!asNumber(value);
    }

    /**
     * Guesses the potential type of a string value for parsing CSV etc.
     *
     * @param {*} value
     * The value to examine.
     *
     * @return {'number' | 'string' | 'Date'}
     * Type string, either `string`, `Date`, or `number`.
     */
    export function guessType(
        value: unknown,
        converter: DataConverter
    ): 'number' | 'string' | 'Date' {
        let result: 'string' | 'Date' | 'number' = 'string';

        if (typeof value === 'string') {
            const trimedValue = DataConverterUtils.trim(`${value}`),
                decimalRegExp = converter.decimalRegExp;

            let innerTrimedValue = DataConverterUtils.trim(trimedValue, true);

            if (decimalRegExp) {
                innerTrimedValue = (
                    decimalRegExp.test(innerTrimedValue) ?
                        innerTrimedValue.replace(decimalRegExp, '$1.$2') :
                        ''
                );
            }

            const floatValue = parseFloat(innerTrimedValue);

            if (+innerTrimedValue === floatValue) {
                // String is numeric
                value = floatValue;
            } else {
                // Determine if a date string
                const dateValue = converter.parseDate(value);

                result = isNumber(dateValue) ? 'Date' : 'string';
            }
        }

        if (typeof value === 'number') {
            // Greater than milliseconds in a year assumed timestamp
            result = value > 365 * 24 * 3600 * 1000 ? 'Date' : 'number';
        }

        return result;
    }

    /**
     * Trim a string from whitespaces.
     *
     * @param {string} str
     * String to trim.
     *
     * @param {boolean} [inside=false]
     * Remove all spaces between numbers.
     *
     * @return {string}
     * Trimed string
     */
    export function trim(str: string, inside?: boolean): string {
        if (typeof str === 'string') {
            str = str.replace(/^\s+|\s+$/g, '');

            // Clear white space insdie the string, like thousands separators
            if (inside && /^[\d\s]+$/.test(str)) {
                str = str.replace(/\s/g, '');
            }
        }

        return str;
    }

    /**
     * Parses an array of columns to a column collection. If more headers are
     * provided, the corresponding, empty columns are added.
     *
     * @param {DataTable.Column[]} [columnsArray]
     * Array of columns.
     *
     * @param {string[]} [headers]
     * Column ids to use.
     *
     * @return {DataTable.ColumnCollection}
     * Parsed columns.
     */
    export function getColumnsCollection(
        columnsArray: DataTable.Column[] = [],
        headers: string[]
    ): DataTable.ColumnCollection {
        const columns: DataTable.ColumnCollection = {};
        for (
            let i = 0,
                iEnd = Math.max(headers.length, columnsArray.length);
            i < iEnd;
            ++i
        ) {
            const columnId = headers[i] || `${i}`;
            columns[columnId] = columnsArray[i] ? columnsArray[i].slice() : [];
        }

        return columns;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DataConverterUtils;
