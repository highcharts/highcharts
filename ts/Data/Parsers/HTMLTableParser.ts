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

import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import DataConverter from '../DataConverter.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Handles parsing and transformation of an HTML table to a table.
 *
 * @private
 */
class HTMLTableParser extends DataParser<DataParser.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: (
        HTMLTableParser.ClassJSONOptions
    ) = {
            ...DataParser.defaultOptions
        };

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
     *
     * @param {HTMLElement | null} tableElement
     * The HTML table to parse
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    constructor(
        options?: Partial<HTMLTableParser.OptionsType>,
        tableElement: (HTMLElement | null) = null,
        converter?: DataConverter
    ) {
        super();
        this.columns = [];
        this.headers = [];
        this.options = merge(HTMLTableParser.defaultOptions, options);
        this.converter = converter || new DataConverter();

        if (tableElement) {
            this.tableElement = tableElement;
            this.tableElementID = tableElement.id;
        } else if (options && options.tableHTML) {
            this.tableElement = options.tableHTML;
            this.tableElementID = options.tableHTML.id;
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataTable.CellType[][];
    private headers: string[];
    public converter: DataConverter;
    public options: HTMLTableParser.ClassJSONOptions;
    public tableElement?: HTMLElement;
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
            converter = this.converter,
            columns: Array<DataTable.Column> = [],
            headers: string[] = [],
            parseOptions = merge(parser.options, options),
            {
                endRow,
                startColumn,
                endColumn,
                firstRowAsNames
            } = parseOptions,
            tableHTML = parseOptions.tableHTML || this.tableElement;


        if (!(tableHTML instanceof HTMLElement)) {
            parser.emit<DataParser.Event>({
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

        this.emit<DataParser.Event>({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
        const rows = tableHTML.getElementsByTagName('tr'),
            rowsCount = rows.length;

        let rowIndex: number = 0,
            item: Element,
            { startRow } = parseOptions;

        // Insert headers from the first row
        if (firstRowAsNames && rowsCount) {
            const items = rows[0].children,
                itemsLength = items.length;

            for (let i = startColumn; i < itemsLength; i++) {
                if (i > endColumn) {
                    break;
                }

                item = items[i];
                if (
                    item.tagName === 'TD' ||
                    item.tagName === 'TH'
                ) {
                    headers.push(item.innerHTML);
                }
            }

            startRow++;
        }

        while (rowIndex < rowsCount) {
            if (rowIndex >= startRow && rowIndex <= endRow) {
                const columnsInRow = rows[rowIndex].children,
                    columnsInRowLength = columnsInRow.length;

                let columnIndex = 0;

                while (columnIndex < columnsInRowLength) {
                    const relativeColumnIndex = columnIndex - startColumn,
                        row = columns[relativeColumnIndex];

                    item = columnsInRow[columnIndex];

                    if (
                        (
                            item.tagName === 'TD' ||
                            item.tagName === 'TH'
                        ) &&
                        (
                            columnIndex >= startColumn &&
                            columnIndex <= endColumn
                        )
                    ) {
                        if (!columns[relativeColumnIndex]) {
                            columns[relativeColumnIndex] = [];
                        }

                        let cellValue = converter.asGuessedType(item.innerHTML);
                        if (cellValue instanceof Date) {
                            cellValue = cellValue.getTime();
                        }
                        columns[relativeColumnIndex][
                            rowIndex - startRow
                        ] = cellValue;

                        // Loop over all previous indices and make sure
                        // they are nulls, not undefined.
                        let i = 1;
                        while (
                            rowIndex - startRow >= i &&
                            row[rowIndex - startRow - i] === void 0
                        ) {
                            row[rowIndex - startRow - i] = null;
                            i++;
                        }
                    }

                    columnIndex++;
                }
            }

            rowIndex++;
        }
        this.columns = columns;
        this.headers = headers;

        this.emit<DataParser.Event>({
            type: 'afterParse',
            columns,
            detail: eventDetail,
            headers
        });
    }

    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed HTML table
     */
    public getTable(): DataTable {
        return DataParser.getTableFromColumns(this.columns, this.headers);
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
    export type OptionsType = Partial<ParserOptions & DataParser.Options>;

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
 *  Export
 *
 * */

export default HTMLTableParser;
