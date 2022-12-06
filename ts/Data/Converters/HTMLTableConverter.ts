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

import type DataEvent from '../DataEvent';
import type DataStore from '../Stores/DataStore';
import type OldDataConverter from './OldDataConverter';

import DataConverter from './DataConverter.js';
import DataTable from '../DataTable.js';
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
class HTMLTableConverter extends DataConverter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: HTMLTableConverter.Options = {
        ...DataConverter.defaultOptions,
        useRowspanHeaders: true,
        useMultiLevelHeaders: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the HTML table parser.
     *
     * @param {HTMLTableConverter.OptionsType} [options]
     * Options for the CSV parser.
     *
     * @param {HTMLElement | null} tableElement
     * The HTML table to parse
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    constructor(
        options?: Partial<HTMLTableConverter.OptionsType>,
        tableElement: (HTMLElement | null) = null,
        converter?: OldDataConverter
    ) {
        super();
        this.columns = [];
        this.headers = [];
        this.options = merge(HTMLTableConverter.defaultOptions, options);
        this.converter = this;

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
    public readonly converter: this;
    public readonly options: HTMLTableConverter.Options;
    public tableElement?: HTMLElement;
    public tableElementID?: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Exports the datastore as an HTML string, using the options
     * provided on import unless other options are provided.
     *
     * @param {HTMLTableStore.ExportOptions} [htmlExportOptions]
     * Options that override default or existing export options.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {string}
     * HTML from the current dataTable.
     *
     */
    public export(
        store: DataStore,
        options: HTMLTableConverter.Options = this.options
    ): string {
        const decimalPoint = options.useLocalDecimalPoint ?
                (1.1).toLocaleString()[1] :
                '.',
            exportNames = (options.firstRowAsNames !== false),
            useMultiLevelHeaders = options.useMultiLevelHeaders,
            useRowspanHeaders = options.useRowspanHeaders;

        const isRowEqual = function (
            row1: Array<(number|string|undefined)>,
            row2: Array<(number|string|undefined)>
        ): boolean {
            let i = row1.length;

            if (row2.length === i) {
                while (i--) {
                    if (row1[i] !== row2[i]) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        };

        // Get table header markup from row data
        const getTableHeaderHTML = function (
            topheaders: (Array<(number|string)>|null|undefined),
            subheaders: Array<(number|string|undefined)>,
            rowLength?: number
        ): string {
            let html = '<thead>',
                i = 0,
                len = rowLength || subheaders && subheaders.length,
                next,
                cur,
                curColspan = 0,
                rowspan;

            // Clean up multiple table headers. Chart.getDataRows() returns two
            // levels of headers when using multilevel, not merged. We need to
            // merge identical headers, remove redundant headers, and keep it
            // all marked up nicely.
            if (
                useMultiLevelHeaders &&
                topheaders &&
                subheaders &&
                !isRowEqual(topheaders, subheaders)
            ) {
                html += '<tr>';
                for (; i < len; ++i) {
                    cur = topheaders[i];
                    next = topheaders[i + 1];
                    if (cur === next) {
                        ++curColspan;
                    } else if (curColspan) {
                        // Ended colspan
                        // Add cur to HTML with colspan.
                        html += getCellHTMLFromValue(
                            'th',
                            'highcharts-table-topheading',
                            'scope="col" ' +
                            'colspan="' + (curColspan + 1) + '"',
                            cur
                        );
                        curColspan = 0;
                    } else {
                        // Cur is standalone. If it is same as sublevel,
                        // remove sublevel and add just toplevel.
                        if (cur === subheaders[i]) {
                            if (useRowspanHeaders) {
                                rowspan = 2;
                                delete subheaders[i];
                            } else {
                                rowspan = 1;
                                subheaders[i] = '';
                            }
                        } else {
                            rowspan = 1;
                        }
                        html += getCellHTMLFromValue(
                            'th',
                            'highcharts-table-topheading',
                            'scope="col"' +
                            (rowspan > 1 ?
                                ' valign="top" rowspan="' + rowspan + '"' :
                                ''),
                            cur
                        );
                    }
                }
                html += '</tr>';
            }

            // Add the subheaders (the only headers if not using multilevels)
            if (subheaders) {
                html += '<tr>';
                for (i = 0, len = subheaders.length; i < len; ++i) {
                    if (typeof subheaders[i] !== 'undefined') {
                        html += getCellHTMLFromValue(
                            'th', null, 'scope="col"', subheaders[i]
                        );
                    }
                }
                html += '</tr>';
            }
            html += '</thead>';
            return html;
        };

        const getCellHTMLFromValue = function (
            tag: string,
            classes: (string|null),
            attrs: string,
            value: (number|string|undefined)
        ): string {
            let val = value,
                className = 'text' + (classes ? ' ' + classes : '');

            // Convert to string if number
            if (typeof val === 'number') {
                val = val.toString();
                if (decimalPoint === ',') {
                    val = val.replace('.', decimalPoint);
                }
                className = 'number';
            } else if (!value) {
                val = '';
                className = 'empty';
            }
            return '<' + tag + (attrs ? ' ' + attrs : '') +
                ' class="' + className + '">' +
                val + '</' + tag + '>';
        };

        const columns = store.getSortedColumns(options.usePresentationOrder),
            columnNames = Object.keys(columns),
            htmlRows: Array<string> = [],
            columnsCount = columnNames.length;

        const rowArray: Array<DataTable.Row> = [];

        let tableHead = '';

        // Add the names as the first row if they should be exported
        if (exportNames) {
            const subcategories: (string|undefined)[] = [];

            // If using multilevel headers, the first value
            // of each column is a subcategory
            if (useMultiLevelHeaders) {
                for (const name of columnNames) {
                    const subhead = (columns[name].shift() || '').toString();
                    subcategories.push(subhead);
                }

                tableHead = getTableHeaderHTML(columnNames, subcategories);
            } else {
                tableHead = getTableHeaderHTML(null, columnNames);
            }
        }

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnName = columnNames[columnIndex],
                column = columns[columnName],
                columnLength = column.length;

            const columnMeta = store.whatIs(columnName);
            let columnDataType;

            if (columnMeta) {
                columnDataType = columnMeta.dataType;
            }

            for (let rowIndex = 0; rowIndex < columnLength; rowIndex++) {
                let cellValue = column[rowIndex];

                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }

                // Handle datatype
                // if(columnDataType && typeof cellValue !== columnDataType) {
                //     do something?
                // }
                if (
                    !(
                        typeof cellValue === 'string' ||
                        typeof cellValue === 'number' ||
                        typeof cellValue === 'undefined'
                    )
                ) {
                    cellValue = (cellValue || '').toString();
                }

                rowArray[rowIndex][columnIndex] = getCellHTMLFromValue(
                    columnIndex ? 'td' : 'th',
                    null,
                    columnIndex ? '' : 'scope="row"',
                    cellValue
                );

                // On the final column, push the row to the array
                if (columnIndex === columnsCount - 1) {
                    htmlRows.push('<tr>' +
                        rowArray[rowIndex].join('') +
                        '</tr>');
                }
            }
        }

        let caption = '';

        // Add table caption
        // Current exportdata falls back to chart title
        // but that should probably be handled elsewhere?
        if (options.tableCaption) {
            caption = '<caption class="highcharts-table-caption">' +
                options.tableCaption +
                '</caption>';
        }

        return (
            '<table>' +
            caption +
            tableHead +
            '<tbody>' +
            htmlRows.join('') +
            '</tbody>' +
            '</table>'
        );
    }

    /**
     * Initiates the parsing of the HTML table
     *
     * @param {HTMLTableConverter.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     * @emits HTMLTableParser#parseError
     */
    public parse(
        options: HTMLTableConverter.OptionsType,
        eventDetail?: DataEvent.Detail
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
            parser.emit<DataConverter.Event>({
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

        this.emit<DataConverter.Event>({
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

        this.emit<DataConverter.Event>({
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
        return DataConverter.getTableFromColumns(this.columns, this.headers);
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace HTMLTableConverter {

    /**
     * The available options for the parser
     */
    export type OptionsType = Partial<Options & SpecialOptions>;

    /**
     * Options for the parser compatible with ClassJSON
     */
    export interface Options extends DataConverter.Options {
        decimalPoint?: string;
        exportIDColumn?: boolean;
        tableCaption?: string;
        useLocalDecimalPoint?: boolean;
        useMultiLevelHeaders?: boolean;
        useRowspanHeaders?: boolean;
        usePresentationOrder?: boolean;
    }

    /**
     * Options not compatible with ClassJSON
     */
    export interface SpecialOptions {
        tableHTML?: (HTMLElement|null);
    }

}

/* *
 *
 *  Export
 *
 * */

export default HTMLTableConverter;
