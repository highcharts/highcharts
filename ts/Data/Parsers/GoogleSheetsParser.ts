/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataTableRow from '../DataTableRow';
import type DataValueType from '../DataValueType';

import DataJSON from '../DataJSON.js';
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
 * Handles parsing and transformation of an Google Sheets to a DataTable
 */
class GoogleSheetsParser extends DataParser<DataParser.EventObject> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: GoogleSheetsParser.ClassJSONOptions = {
        ...DataParser.defaultOptions,
        json: {}
    }

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates a GoogleSheetsParser instance from ClassJSON.
     *
     * @param {GoogleSheetsParser.ClassJSON} json
     * Class JSON to convert to the parser instance.
     *
     * @return {GoogleSheetsParser}
     * An instance of GoogleSheetsParser.
     */
    public static fromJSON(json: GoogleSheetsParser.ClassJSON): GoogleSheetsParser {
        return new GoogleSheetsParser(
            json.options
        );
    }

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
        this.headers = [];
        this.options = merge(GoogleSheetsParser.defaultOptions, options);
        this.converter = converter || new DataConverter();
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTableRow.CellType[][];
    private headers: string[];
    public converter: DataConverter;
    public options: GoogleSheetsParser.ClassJSONOptions;

    /* *
     *
     *  Functions
     *
     * */

    private getSheetColumns(json: Highcharts.JSONType): Array<Array<DataValueType>> {
        const parser = this,
            {
                startColumn,
                endColumn,
                startRow,
                endRow
            } = parser.options,
            columns: Array<Array<DataValueType>> = [],
            cells = json.feed.entry,
            cellCount = (cells || []).length;

        let cell,
            colCount = 0,
            rowCount = 0,
            val,
            gr,
            gc,
            cellInner,
            i: number,
            j: number;

        // First, find the total number of columns and rows that
        // are actually filled with data
        for (i = 0; i < cellCount; i++) {
            cell = cells[i];
            colCount = Math.max(colCount, cell.gs$cell.col);
            rowCount = Math.max(rowCount, cell.gs$cell.row);
        }

        // Set up arrays containing the column data
        for (i = 0; i < colCount; i++) {
            if (i >= startColumn && i <= endColumn) {
                // Create new columns with the length of either
                // end-start or rowCount
                columns[i - startColumn] = [];
            }
        }

        // Loop over the cells and assign the value to the right
        // place in the column arrays
        for (i = 0; i < cellCount; i++) {
            cell = cells[i];
            gr = cell.gs$cell.row - 1; // rows start at 1
            gc = cell.gs$cell.col - 1; // columns start at 1

            // If both row and col falls inside start and end set the
            // transposed cell value in the newly created columns
            if (gc >= startColumn && gc <= endColumn &&
                gr >= startRow && gr <= endRow) {

                cellInner = cell.gs$cell || cell.content;

                val = null;

                if (cellInner.numericValue) {
                    if (cellInner.$t.indexOf('/') >= 0 || (
                        cellInner.$t.indexOf('-') >= 0 && cellInner.$t.indexOf('.') === -1
                    )) {
                        // This is a date - for future reference.
                        val = cellInner.$t;
                    } else if (cellInner.$t.indexOf('%') > 0) {
                        // Percentage
                        val = parseFloat(cellInner.numericValue) * 100;
                    } else {
                        val = parseFloat(cellInner.numericValue);
                    }
                } else if (cellInner.$t && cellInner.$t.length) {
                    val = cellInner.$t;
                }

                columns[gc - startColumn][gr - startRow] = val;
            }
        }

        // Insert null for empty spreadsheet cells (#5298)
        for (i = 0; i < colCount; i++) {
            const column = columns[i];
            // TODO: should this check be necessary?
            if (column.length) {
                for (i = 0; i < column.length; i++) {
                    if (typeof column[i] === 'undefined') {
                        column[i] = null as any;
                    }
                }
            }
        }

        return columns;
    }

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
        jsonProp: Highcharts.JSONType,
        eventDetail?: DataEventEmitter.EventDetail
    ): (boolean|undefined) {
        const parser = this,
            parserOptions = merge(true, parser.options, { json: jsonProp }),
            converter = parser.converter,
            json = parserOptions.json,
            cells = json.feed.entry,
            headers = parser.headers;

        let column;

        if (!cells || cells.length === 0) {
            return false;
        }

        parser.emit<DataParser.EventObject>({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });

        parser.columns = parser.getSheetColumns(json);

        for (let i = 0, iEnd = parser.columns.length; i < iEnd; i++) {
            headers.push(parser.columns[i][0]?.toString() || uniqueKey());

            column = parser.columns[i];
            for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                if (column[j] && typeof column[j] === 'string') {
                    parser.columns[i][j] = converter.asGuessedType(column[j] as string);
                }
            }
        }

        parser.emit<DataParser.EventObject>({
            type: 'afterParse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
    }

    /**
     * Handles converting the parsed data to a DataTable
     *
     * @return {DataTable}
     * A DataTable from the parsed Google Sheet
     */
    public getTable(): DataTable {
        return DataParser.getTableFromColumns(this.columns, this.headers);
    }

    /**
     * Converts the parser instance to ClassJSON.
     *
     * @return {GoogleSheetsParser.ClassJSON}
     * ClassJSON from the parser instance.
     */
    public toJSON(): GoogleSheetsParser.ClassJSON {
        const parser = this,
            json: GoogleSheetsParser.ClassJSON = {
                $class: 'GoogleSheetsParser',
                options: parser.options
            };

        return json;
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
     * ClassJSON for GoogleSheetsParser
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        options: ClassJSONOptions;
    }

    /**
     * Options for the parser compatible with ClassJSON
     */
    export interface ClassJSONOptions extends DataParser.Options {
        json: Highcharts.JSONType;
    }
}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(GoogleSheetsParser);

/* *
 *
 *  Export
 *
 * */

export default GoogleSheetsParser;
