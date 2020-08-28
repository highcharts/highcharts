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
import type DataValueType from '../DataValueType';
import DataJSON from '../DataJSON.js';
import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles parsing and transformation of an HTML table to a DataTable
 */
class HTMLTableParser extends DataParser<DataParser.EventObject> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: HTMLTableParser.ClassJSONOptions = {
        ...DataParser.defaultOptions
    }

    /* *
     *
     *  Static Functions
     *
     * */


    /**
     * Creates a HTMLTableParser instance from ClassJSON.
     *
     * @param {HTMLTableParser.ClassJSON} json
     * Class JSON to convert to the parser instance.
     *
     * @return {HTMLTableParser}
     * An instance of CSVDataParser.
     */
    public static fromJSON(json: HTMLTableParser.ClassJSON): HTMLTableParser {
        return new HTMLTableParser(
            json.options,
            document.getElementById(json.tableElementID)
        );
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the HTML table parser.
     *
     * @param {HTMLTableParser.OptionsType} [options]
     * Options for the CSV parser.
     * @param {HTMLElement | null} tableElement
     * The HTML table to parse
     */
    constructor(
        options?: Partial<HTMLTableParser.OptionsType>,
        tableElement: (HTMLElement | null) = null
    ) {
        super();
        this.columns = [];
        this.headers = [];
        this.options = merge(HTMLTableParser.defaultOptions, options);

        if (tableElement) {
            this.tableElement = tableElement;
            this.tableElementID = tableElement.id;
        } else if (options?.tableHTML) {
            this.tableElement = options.tableHTML;
            this.tableElementID = options?.tableHTML.id;
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataValueType[][];
    private headers: string[];
    public options: HTMLTableParser.ClassJSONOptions;
    public tableElement?: HTMLElement
    public tableElementID?: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the parsing of the HTML table
     *
     * @param {HTMLTableParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     * @emits HTMLTableParser#parseError
     */
    public parse(
        options: HTMLTableParser.OptionsType,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const parser = this,
            columns: [] = [],
            headers: string[] = [],
            parseOptions = merge(parser.options, options),
            {
                startRow,
                endRow,
                startColumn,
                endColumn
            } = parseOptions;

        const tableHTML = parseOptions.tableHTML || this.tableElement;

        if (!(tableHTML instanceof HTMLElement)) {
            parser.emit<DataParser.EventObject>({
                type: 'parseError',
                columns,
                detail: eventDetail,
                headers,
                error: 'Not a valid HTML Table'
            });
            return;
        }
        parser.tableElement = this.tableElement;
        parser.tableElementID = tableHTML.id;

        this.emit<DataParser.EventObject>({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });

        let colsCount: number,
            rowNo: number,
            colNo: number,
            item: Element;
        const rows = tableHTML.getElementsByTagName('tr'),
            rowsCount = rows.length;

        rowNo = 0;

        while (rowNo < rowsCount) {
            if (rowNo >= startRow && rowNo <= endRow) {

                const cols = rows[rowNo].children;
                colsCount = cols.length;
                colNo = 0;

                while (colNo < colsCount) {
                    const row = (columns as any)[colNo - startColumn];
                    item = cols[colNo];
                    let i = 1;

                    if (
                        (
                            item.tagName === 'TD' ||
                            item.tagName === 'TH'
                        ) &&
                        colNo >= startColumn &&
                        colNo <= endColumn
                    ) {
                        if (!(columns as any)[colNo - startColumn]) {
                            (columns as any)[colNo - startColumn] = [];
                        }

                        if (item.tagName === 'TH') {
                            headers.push(item.innerHTML);
                        }

                        (columns as any)[colNo - startColumn][
                            rowNo - startRow
                        ] = item.innerHTML;

                        // Loop over all previous indices and make sure
                        // they are nulls, not undefined.
                        while (
                            rowNo - startRow >= i &&
                            row[rowNo - startRow - i] === void 0
                        ) {
                            row[rowNo - startRow - i] = null;
                            i++;
                        }
                    }

                    colNo++;
                }
            }

            rowNo++;
        }
        this.columns = columns;
        this.headers = headers;

        this.emit<DataParser.EventObject>({
            type: 'afterParse',
            columns,
            detail: eventDetail,
            headers
        });
    }

    /**
     * Handles converting the parsed data to a DataTable
     *
     * @return {DataTable}
     * A DataTable from the parsed HTML table
     */
    public getTable(): DataTable {
        return DataTable.fromColumns(this.columns, this.headers);
    }

    /**
     * Converts the parser instance to ClassJSON.
     *
     * @return {HTMLTableParser.ClassJSON}
     * ClassJSON from the parser instance.
     */
    public toJSON(): HTMLTableParser.ClassJSON {
        const parser = this,
            {
                options,
                tableElementID
            } = parser,
            json: HTMLTableParser.ClassJSON = {
                $class: 'HTMLTableParser',
                options,
                tableElementID: tableElementID ? tableElementID : ''
            };

        return json;
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableParser {

    /**
     * The available options for the parser
     */
    export type OptionsType = Partial<ParserOptions & DataParser.Options>

    /**
     * ClassJSON for HTMLTableParser
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        options: ClassJSONOptions;
        tableElementID: string;
    }

    /**
     * Options for the parser compatible with ClassJSON
     */
    export interface ClassJSONOptions extends DataParser.Options {
    }

    /**
     * Options not compatible with ClassJSON
     */
    export interface ParserOptions {
        tableHTML?: (HTMLElement | null);
    }

}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(HTMLTableParser);

/* *
 *
 *  Export
 *
 * */

export default HTMLTableParser;
