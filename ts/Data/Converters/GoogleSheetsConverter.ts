/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

        this.columns = [];
        this.header = [];
        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.BasicColumn[];
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
    ): (boolean | undefined) {
        const converter = this,
            parseOptions = merge(converter.options, options);

        let columns = ((
            parseOptions.json?.values
        ) || []).map(
            (column): DataTable.BasicColumn => column.slice()
        );

        if (columns.length === 0) {
            return false;
        }

        converter.header = [];
        converter.columns = [];

        converter.emit({
            type: 'parse',
            columns: converter.columns,
            detail: eventDetail,
            headers: converter.header
        });

        // If beforeParse is defined, use it to modify the data
        const { beforeParse, json } = parseOptions;
        if (beforeParse && json) {
            columns = beforeParse(json.values);
        }

        let column;
        converter.columns = columns;

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            column = columns[i];
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
                converter.columns[i][j] = cellValue;
            }
        }

        converter.emit({
            type: 'afterParse',
            columns: converter.columns,
            detail: eventDetail,
            headers: converter.header
        });
    }

    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed Google Sheet
     */
    public getTable(): DataTable {
        const { columns, header } = this;
        return DataConverterUtils.getTableFromColumns(columns, header);
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
