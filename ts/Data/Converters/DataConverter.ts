/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Sebastian Bochan
 *  - Gøran Slettemark
 *  - Torstein Hønsi
 *  - Wojciech Chmiel
 *  - Jomar Hønsi
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConverterTypes } from './DataConverterType';
import type DataEvent from '../DataEvent';
import type { ColumnIdsOptions } from '../Connectors/JSONConnectorOptions';

import DataTable from '../DataTable.js';
import DataConverterUtils from './DataConverterUtils.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Base class providing an interface and basic methods for a DataConverter
 *
 * @private
 */
class DataConverter implements DataEvent.Emitter<DataConverter.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: DataConverter.Options = {
        dateFormat: '',
        firstRowAsNames: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the DataConverter.
     *
     * @param {DataConverter.UserOptions} [options]
     * Options for the DataConverter.
     */
    public constructor(options?: DataConverter.UserOptions) {
        const mergedOptions = merge(DataConverter.defaultOptions, options);

        let regExpPoint = mergedOptions.decimalPoint;

        if (regExpPoint === '.' || regExpPoint === ',') {
            regExpPoint = regExpPoint === '.' ? '\\.' : ',';

            this.decimalRegExp =
                new RegExp('^(-?[0-9]+)' + regExpPoint + '([0-9]+)$');
        }

        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * A collection of available date formats.
     */
    public dateFormats: Record<string, DataConverter.DateFormatObject> = {
        'YYYY/mm/dd': {
            regex: /^(\d{4})([\-\.\/])(\d{1,2})\2(\d{1,2})$/,
            parser: function (match: RegExpMatchArray | null): number {
                return (
                    match ?
                        Date.UTC(
                            +match[1],
                            +match[3] - 1,
                            +match[4]
                        ) : NaN
                );
            }
        },
        'dd/mm/YYYY': {
            regex: /^(\d{1,2})([\-\.\/])(\d{1,2})\2(\d{4})$/,
            parser: function (match: RegExpMatchArray | null): number {
                return (
                    match ?
                        Date.UTC(
                            +match[4],
                            +match[3] - 1,
                            +match[1]
                        ) : NaN
                );
            },
            alternative: 'mm/dd/YYYY' // Different format with the same regex
        },
        'mm/dd/YYYY': {
            regex: /^(\d{1,2})([\-\.\/])(\d{1,2})\2(\d{4})$/,
            parser: function (match: RegExpMatchArray | null): number {
                return (
                    match ?
                        Date.UTC(
                            +match[4],
                            +match[1] - 1,
                            +match[3]
                        ) : NaN
                );
            }
        },
        'dd/mm/YY': {
            regex: /^(\d{1,2})([\-\.\/])(\d{1,2})\2(\d{2})$/,
            parser: function (match: RegExpMatchArray | null): number {
                const d = new Date();

                if (!match) {
                    return NaN;
                }

                let year = +match[4];

                if (year > (d.getFullYear() - 2000)) {
                    year += 1900;
                } else {
                    year += 2000;
                }

                return Date.UTC(year, +match[3] - 1, +match[1]);
            },
            alternative: 'mm/dd/YY' // Different format with the same regex
        },
        'mm/dd/YY': {
            regex: /^(\d{1,2})([\-\.\/])(\d{1,2})\2(\d{2})$/,
            parser: function (match: RegExpMatchArray | null): number {
                return (
                    match ?
                        Date.UTC(
                            +match[4] + 2000,
                            +match[1] - 1,
                            +match[3]
                        ) :
                        NaN
                );
            }
        }
    };

    /**
     * Regular expression used in the trim method to change a decimal point.
     */
    public decimalRegExp?: RegExp;

    /**
     * Options for the DataConverter.
     */
    public readonly options: DataConverter.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Converts a string value based on its guessed type.
     *
     * @param {*} value
     * The value to examine.
     *
     * @return {number | string | Date}
     * The converted value.
     */
    public convertByType(value: DataConverter.Type): number | string | Date {
        const converter = this,
            typeMap: Record<ReturnType<typeof DataConverterUtils.guessType>, Function> = {
                'number': (value: DataConverter.Type): number =>
                    DataConverterUtils.asNumber(value, converter.decimalRegExp),
                'Date': (value: DataConverter.Type): Date =>
                    DataConverterUtils.asDate(value, converter),
                'string': DataConverterUtils.asString
            };

        return typeMap[DataConverterUtils.guessType(value, converter)]
            .call(converter, value);
    }

    /**
     * Tries to guess the date format
     *  - Check if either month candidate exceeds 12
     *  - Check if year is missing (use current year)
     *  - Check if a shortened year format is used (e.g. 1/1/99)
     *  - If no guess can be made, the user must be prompted
     * data is the data to deduce a format based on
     * @private
     *
     * @param {string[]} data
     * Data to check the format.
     *
     * @param {number} limit
     * Max data to check the format.
     *
     * @param {boolean} save
     * Whether to save the date format in the converter options.
     */
    public deduceDateFormat(
        data: string[],
        limit?: number | null,
        save?: boolean
    ): string {
        const parser = this,
            stable = [],
            max: number[] = [];

        let format = 'YYYY/mm/dd',
            thing: string[],
            guessedFormat: string[] = [],
            i = 0,
            madeDeduction = false,
            elem,
            j;

        if (!limit || limit > data.length) {
            limit = data.length;
        }

        for (; i < limit; i++) {
            if (
                typeof data[i] !== 'undefined' &&
                data[i] && data[i].length
            ) {
                thing = data[i]
                    .trim()
                    .replace(/[\-\.\/]/g, ' ')
                    .split(' ');

                guessedFormat = [
                    '',
                    '',
                    ''
                ];

                for (j = 0; j < thing.length; j++) {
                    if (j < guessedFormat.length) {
                        elem = parseInt(thing[j], 10);

                        if (elem) {

                            max[j] = (!max[j] || max[j] < elem) ? elem : max[j];

                            if (typeof stable[j] !== 'undefined') {
                                if (stable[j] !== elem) {
                                    stable[j] = false;
                                }
                            } else {
                                stable[j] = elem;
                            }

                            if (elem > 31) {
                                if (elem < 100) {
                                    guessedFormat[j] = 'YY';
                                } else {
                                    guessedFormat[j] = 'YYYY';
                                }
                            } else if (
                                elem > 12 &&
                                elem <= 31
                            ) {
                                guessedFormat[j] = 'dd';
                                madeDeduction = true;
                            } else if (!guessedFormat[j].length) {
                                guessedFormat[j] = 'mm';
                            }
                        }
                    }
                }
            }
        }

        if (madeDeduction) {

            // This handles a few edge cases with hard to guess dates
            for (j = 0; j < stable.length; j++) {
                if (stable[j] !== false) {
                    if (
                        max[j] > 12 &&
                        guessedFormat[j] !== 'YY' &&
                        guessedFormat[j] !== 'YYYY'
                    ) {
                        guessedFormat[j] = 'YY';
                    }
                } else if (max[j] > 12 && guessedFormat[j] === 'mm') {
                    guessedFormat[j] = 'dd';
                }
            }

            // If the middle one is dd, and the last one is dd,
            // the last should likely be year.
            if (
                guessedFormat.length === 3 &&
                guessedFormat[1] === 'dd' &&
                guessedFormat[2] === 'dd'
            ) {
                guessedFormat[2] = 'YY';
            }

            format = guessedFormat.join('/');

            // If the caculated format is not valid, we need to present an
            // error.
        }

        // Save the deduced format in the converter options.
        if (save) {
            parser.options.dateFormat = format;
        }

        return format;
    }

    /**
     * Emits an event on the DataConverter instance.
     *
     * @param {DataConverter.Event} [e]
     * Event object containing additional event data
     */
    public emit(e: DataConverter.Event): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.Callback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on<T extends DataConverter.Event['type']>(
        type: T,
        callback: DataEvent.Callback<this, Extract<DataConverter.Event, {
            type: T
        }>>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Parse a date and return it as a number.
     *
     * @param {string} value
     * Value to parse.
     *
     * @param {string} dateFormatProp
     * Which of the predefined date formats
     * to use to parse date values.
     */
    public parseDate(value: string, dateFormatProp?: string): number {
        const converter = this,
            options = converter.options;

        let dateFormat = dateFormatProp || options.dateFormat,
            result = NaN,
            key: string,
            match: RegExpMatchArray | null = null;

        type DateFormat = {
            regex: RegExp;
            parser: (match: RegExpMatchArray) => number;
        };

        if (options.parseDate) {
            result = options.parseDate(value);
        } else {
            const dateFormats: Record<string, DateFormat> = converter.dateFormats;

            // Auto-detect the date format the first time
            if (!dateFormat) {
                for (key in dateFormats) { // eslint-disable-line guard-for-in
                    const format = dateFormats[key];
                    match = value.match(format.regex);
                    if (match) {
                        dateFormat = key;
                        result = format.parser(match);
                        break;
                    }
                }

            // Next time, use the one previously found
            } else {
                let format = dateFormats[dateFormat];

                if (!format) {
                    // The selected format is invalid
                    format = dateFormats['YYYY/mm/dd'];
                }

                match = value.match(format.regex);
                if (match) {
                    result = format.parser(match);
                }
            }

            // Fall back to Date.parse
            if (!match) {
                const parsed = Date.parse(value);

                if (!isNaN(parsed)) {
                    result =
                        parsed - new Date(parsed).getTimezoneOffset() * 60000;

                    // Reset dates without year in Chrome
                    if (
                        !value.includes('2001') &&
                        new Date(result).getFullYear() === 2001
                    ) {
                        result = NaN;
                    }
                }
            }
        }

        return result;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for events and conversion.
 */
namespace DataConverter {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * The basic event object for a DataConverter instance.
     * Valid types are `parse`, `afterParse`, and `parseError`
     */
    export interface Event extends DataEvent {
        readonly type: (
            'export' | 'afterExport' | 'exportError' |
            'parse' | 'afterParse' | 'parseError'
        );
        readonly columns: DataTable.Column[];
        readonly error?: string | Error;
        readonly headers: string[] | ColumnIdsOptions;
    }

    export interface DateFormatCallbackFunction {
        (match: ReturnType<string['match']>): number;
    }

    export interface DateFormatObject {
        alternative?: string;
        parser: DateFormatCallbackFunction;
        regex: RegExp;
    }

    /**
     * The shared options for all DataConverter instances
     */
    export interface Options {
        dateFormat?: string;
        decimalPoint?: string;
        firstRowAsNames: boolean;
        /**
         * A function to parse string representations of dates into JavaScript
         * timestamps. If not set, the default implementation will be used.
         */
        parseDate?: DataConverter.ParseDateFunction;
    }

    /**
     * A function to parse string representations of dates
     * into JavaScript timestamps.
     */
    export interface ParseDateFunction {
        (dateValue: string): number;
    }

    /**
     * Contains supported types to convert values from and to.
     */
    export type Type = (
        boolean | null | number | string |
        DataTable | Date | undefined
    );

    /**
     * Options of the DataConverter.
     */
    export type UserOptions = Partial<Options>;

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Registry as a record object with connector names and their class.
     */
    export const types = {} as DataConverterTypes;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a converter class to the registry.
     *
     * @private
     *
     * @param {string} key
     * Registry key of the converter class.
     *
     * @param {DataConverterTypes} DataConverterClass
     * Connector class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a converter registered with this key.
     */
    export function registerType<T extends keyof DataConverterTypes>(
        key: T,
        DataConverterClass: DataConverterTypes[T]
    ): boolean {
        return (
            !!key &&
            !types[key] &&
            !!(types[key] = DataConverterClass)
        );
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataConverter;
