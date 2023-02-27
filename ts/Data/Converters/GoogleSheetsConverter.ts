/* *
 *
 *  (c) 2009-2023 Highsoft AS
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

import type DataEvent from '../DataEvent';
import type JSON from '../../Core/JSON';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
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
    protected static readonly defaultOptions: GoogleSheetsConverter.Options = {
        ...DataConverter.defaultOptions
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the GoogleSheetsParser.
     *
     * @param {GoogleSheetsConverter.OptionsType} [options]
     * Options for the Google Sheets parser.
     */
    constructor(
        options?: GoogleSheetsConverter.OptionsType
    ) {
        super();

        this.columns = [];
        this.header = [];
        this.options = merge(GoogleSheetsConverter.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.CellType[][];
    private header: string[];

    /**
     * Options for the DataConverter.
     */
    public readonly options: GoogleSheetsConverter.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the parsing of the Google Sheet
     *
     * @param {GoogleSheetsConverter.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits GoogleSheetsParser#parse
     * @emits GoogleSheetsParser#afterParse
     */
    public parse(
        json: Partial<GoogleSheetsConverter.Options>,
        eventDetail?: DataEvent.Detail
    ): (boolean|undefined) {
        const converter = this,
            parserOptions = merge(converter.options, json),
            columns = ((
                parserOptions.json &&
                parserOptions.json.values
            ) || []).map(
                (column): DataTable.Column => column.slice()
            );

        if (columns.length === 0) {
            return false;
        }

        converter.header = [];
        converter.columns = [];

        converter.emit<DataConverter.Event>({
            type: 'parse',
            columns: converter.columns,
            detail: eventDetail,
            headers: converter.header
        });

        converter.columns = columns;

        let column;

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            column = columns[i];
            converter.header[i] = (
                parserOptions.firstRowAsNames ?
                    `${column.shift()}` :
                    uniqueKey()
            );

            for (let j = 0, jEnd = column.length; j < jEnd; ++j) {
                if (column[j] && typeof column[j] === 'string') {
                    let cellValue = converter.asGuessedType(
                        column[j] as string
                    );
                    if (cellValue instanceof Date) {
                        cellValue = cellValue.getTime();
                    }
                    converter.columns[i][j] = cellValue;
                }
            }
        }

        converter.emit<DataConverter.Event>({
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
        return DataConverter.getTableFromColumns(this.columns, this.header);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace GoogleSheetsConverter {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * The available options for the parser
     */
    export type OptionsType = Partial<Options>;

    /**
     * Options for the parser compatible with ClassJSON
     */
    export interface Options extends DataConverter.Options {
        json?: GoogleSpreadsheetJSON;
    }

    /**
     * Googles Spreasheet format
     */
    export interface GoogleSpreadsheetJSON extends JSON.Object {
        majorDimension: ('COLUMNS'|'ROWS');
        values: Array<Array<JSON.Primitive>>;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConverter;
