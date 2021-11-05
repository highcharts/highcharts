/* *
 *
 *  (c) 2012-2021 Highsoft AS
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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type JSON from '../../Core/JSON';

import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import DataConverter from '../DataConverter.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    uniqueKey
} = U;

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

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
class GoogleSheetsParser extends DataParser<DataParser.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: GoogleSheetsParser.ClassJSONOptions = {
        ...DataParser.defaultOptions
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the GoogleSheetsParser.
     *
     * @param {GoogleSheetsParser.OptionsType} [options]
     * Options for the Google Sheets parser.
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    constructor(
        options?: GoogleSheetsParser.OptionsType,
        converter?: DataConverter
    ) {
        super();
        this.columns = [];
        this.header = [];
        this.options = merge(GoogleSheetsParser.defaultOptions, options);
        this.converter = converter || new DataConverter();
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.CellType[][];
    private header: string[];
    public converter: DataConverter;
    public options: GoogleSheetsParser.ClassJSONOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the parsing of the Google Sheet
     *
     * @param {GoogleSheetsParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits GoogleSheetsParser#parse
     * @emits GoogleSheetsParser#afterParse
     */
    public parse(
        json: Partial<GoogleSheetsParser.ClassJSONOptions>,
        eventDetail?: DataEventEmitter.EventDetail
    ): (boolean|undefined) {
        const parser = this,
            parserOptions = merge(parser.options, json),
            converter = parser.converter,
            columns = ((
                parserOptions.json &&
                parserOptions.json.values
            ) || []).map(
                (column): DataTable.Column => column.slice()
            );

        if (columns.length === 0) {
            return false;
        }

        parser.header = [];
        parser.columns = [];

        parser.emit<DataParser.Event>({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.header
        });

        parser.columns = columns;

        let column;

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            column = columns[i];
            parser.header[i] = (
                parserOptions.firstRowAsNames ?
                    `${column.shift()}` :
                    uniqueKey()
            );

            for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                if (column[j] && typeof column[j] === 'string') {
                    let cellValue = converter.asGuessedType(column[j] as string);
                    if (cellValue instanceof Date) {
                        cellValue = cellValue.getTime();
                    }
                    parser.columns[i][j] = cellValue;
                }
            }
        }

        parser.emit<DataParser.Event>({
            type: 'afterParse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.header
        });
    }

    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed Google Sheet
     */
    public getTable(): DataTable {
        return DataParser.getTableFromColumns(this.columns, this.header);
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace GoogleSheetsParser {

    /**
     * The available options for the parser
     */
    export type OptionsType = Partial<ClassJSONOptions>;

    /**
     * Options for the parser compatible with ClassJSON
     */
    export interface ClassJSONOptions extends DataParser.Options {
        json?: GoogleSpreadsheetJSON;
    }

    export interface GoogleSpreadsheetJSON extends JSON.Object {
        majorDimension: ('COLUMNS'|'ROWS');
        values: Array<Array<JSON.Primitive>>;
    }

}

/* *
 *
 *  Export
 *
 * */

export default GoogleSheetsParser;
