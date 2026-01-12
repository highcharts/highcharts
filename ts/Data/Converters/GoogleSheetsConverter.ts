/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type GoogleSheetsConverterOptions from './GoogleSheetsConverterOptions';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
import DataConverterUtils from './DataConverterUtils.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles parsing and transformation of an Google Sheets to a table.
 *
 * @private
 */
class GoogleSheetsConverter extends DataConverter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: GoogleSheetsConverterOptions = {
        ...DataConverter.defaultOptions
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the GoogleSheetsConverter.
     *
     * @param {Partial<GoogleSheetsConverterOptions>} [options]
     * Options for the GoogleSheetsConverter.
     */
    constructor(options?: Partial<GoogleSheetsConverterOptions>) {
        const mergedOptions =
            merge(GoogleSheetsConverter.defaultOptions, options);

        super(mergedOptions);

        this.header = [];
        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    private header: string[];

    /**
     * Options for the DataConverter.
     */
    public readonly options: GoogleSheetsConverterOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the parsing of the Google Sheet
     *
     * @param {Partial<GoogleSheetsConverterOptions>}[options]
     * Options for the parser
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits GoogleSheetsParser#parse
     * @emits GoogleSheetsParser#afterParse
     */
    public parse(
        options: Partial<GoogleSheetsConverterOptions>,
        eventDetail?: DataEvent.Detail
    ): DataTable.ColumnCollection {
        const converter = this,
            parseOptions = merge(converter.options, options);

        let columnsArray = ((
            parseOptions.json?.values
        ) || []).map(
            (column): DataTable.BasicColumn => column.slice()
        );

        if (columnsArray.length === 0) {
            return {};
        }

        converter.header = [];

        converter.emit({
            type: 'parse',
            columns: [],
            detail: eventDetail,
            headers: converter.header
        });

        // If beforeParse is defined, use it to modify the data
        const { beforeParse, json } = parseOptions;
        if (beforeParse && json) {
            columnsArray = beforeParse(json.values);
        }

        let column;

        for (let i = 0, iEnd = columnsArray.length; i < iEnd; i++) {
            column = columnsArray[i];
            converter.header[i] = (
                parseOptions.firstRowAsNames ?
                    `${column.shift()}` :
                    uniqueKey()
            );

            for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                let cellValue = column[j];
                if (isDateObject(cellValue)) {
                    cellValue = cellValue.getTime();
                }
                columnsArray[i][j] = cellValue;
            }
        }

        converter.emit({
            type: 'afterParse',
            columns: columnsArray,
            detail: eventDetail,
            headers: converter.header
        });

        return DataConverterUtils.getColumnsCollection(
            columnsArray, converter.header
        );
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConverterType' {
    interface DataConverterTypes {
        GoogleSheets: typeof GoogleSheetsConverter;
    }
}

DataConverter.registerType('GoogleSheets', GoogleSheetsConverter);

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConverter;

/**
 * Check if a value is a Date object
 *
 * @param {unknown} value to verify
 * @return {boolean}
 * True if the value is a Date object, false otherwise.
 */
function isDateObject(value: unknown): value is Date {
    return Object.prototype.toString.call(value) === '[object Date]';
}
