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

import type DataValueType from '../DataValueType.js';
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

class HTMLTableParser extends DataParser<DataParser.EventObject> {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: HTMLTableParser.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: HTMLTableParser.ClassJSON): HTMLTableParser {
        return new HTMLTableParser(
            document.getElementById(json.tableElement),
            json.options
        );
    }

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        tableElement: (HTMLElement|null) = null,
        options?: Partial<HTMLTableParser.Options>
    ) {
        super();
        this.columns = [];
        this.headers = [];
        this.options = merge(HTMLTableParser.defaultOptions, options);
        this.tableElement = tableElement;
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataValueType[][];
    private headers: string[];
    public options: HTMLTableParser.Options;
    public tableElement: (HTMLElement|null);

    /* *
     *
     *  Functions
     *
     * */

    public parse(
        options: Partial<(HTMLTableParser.Options&HTMLTableParser.ParseOptions)>
    ): void {
        const parser = this,
            columns: [] = [],
            headers: string[] = [],
            parseOptions = merge(parser.options, options),
            {
                startRow,
                endRow,
                startColumn,
                endColumn,
                tableHTML
            } = parseOptions;

        if (!(tableHTML instanceof HTMLElement)) {
            parser.emit({
                type: 'parseError',
                columns,
                headers,
                error: 'Not a valid HTML Table'
            });
            return;
        }

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
    }

    public getTable(): DataTable {
        return DataTable.fromColumns(this.columns, this.headers);
    }

    public toJSON(): HTMLTableParser.ClassJSON {
        const parser = this,
            {
                options,
                tableElement
            } = parser,
            json: HTMLTableParser.ClassJSON = {
                $class: 'HTMLTableParser',
                options,
                tableElement: (
                    tableElement &&
                    tableElement.getAttribute('id') ||
                    ''
                )
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

    export interface ClassJSON extends DataJSON.ClassJSON {
        tableElement: string;
        options: Options;
    }

    export interface Options extends DataParser.Options {
        firstRowAsNames: boolean;
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
    }

    export interface ParseOptions {
        tableHTML?: (HTMLElement|null);
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
