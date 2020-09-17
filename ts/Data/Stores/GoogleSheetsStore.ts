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

import type DataEventEmitter from '../DataEventEmitter';
import type DataValueType from '../DataValueType';
import AjaxMixin from '../../Extensions/Ajax.js';
const {
    ajax
} = AjaxMixin;
import DataJSON from './../DataJSON.js';
import DataParser from '../Parsers/DataParser.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class GoogleSheetsStore extends DataStore<GoogleDataStore.EventObject> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleDataStore.Options = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        enablePolling: false,
        dataRefreshRate: 2
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: GoogleDataStore.ClassJSON): GoogleSheetsStore {
        const options = json.options,
            table = DataTable.fromJSON(json.table),
            store = new GoogleSheetsStore(table, options);

        store.metadata = merge(json.metadata);

        return store;
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        table: DataTable,
        options: (
            Partial<GoogleDataStore.Options>&
            { googleSpreadsheetKey: string }
        )
    ) {
        super(table);

        this.options = merge(GoogleSheetsStore.defaultOptions, options);
        this.columns = [];
    }

    /* *
     *
     *  Properties
     *
     * */

    public columns: Array<Array<DataValueType>>;
    public readonly options: GoogleDataStore.Options;
    public readonly parser: DataParser<DataParser.EventObject> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    private getSheetColumns(json: Highcharts.JSONType): Array<Array<DataValueType>> {
        const store = this,
            {
                startColumn,
                endColumn,
                startRow,
                endRow
            } = store.options,
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

    private parseSheet(json: Highcharts.JSONType): (boolean|undefined) {
        var store = this,
            cells = json.feed.entry,
            columns: Array<Array<DataValueType>> = [];

        if (!cells || cells.length === 0) {
            return false;
        }

        // parser.emit({ type: 'parse', json });

        columns = store.getSheetColumns(json);
        store.columns = columns;

        // parser.emit({ type: 'afterParse', columns });
    }

    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    private fetchSheet(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this,
            headers: string[] = [],
            {
                enablePolling,
                dataRefreshRate,
                googleSpreadsheetKey,
                worksheet
            } = store.options,
            url = [
                'https://spreadsheets.google.com/feeds/cells',
                googleSpreadsheetKey,
                worksheet,
                'public/values?alt=json'
            ].join('/');

        let i: number,
            colsCount: number;

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url
        });

        ajax({
            url: url,
            dataType: 'json',
            success: function (json: Highcharts.JSONType): void {
                store.parseSheet(json);
                colsCount = store.columns.length;

                for (i = 0; i < colsCount; i++) {
                    headers.push('' + store.columns[i][0]);
                }

                const table = DataTable.fromColumns(store.columns, headers);

                // Polling
                if (enablePolling) {
                    setTimeout(
                        function (): void {
                            store.fetchSheet();
                        },
                        dataRefreshRate * 1000
                    );
                }

                store.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    table,
                    url
                });
            },
            error: function (
                xhr: XMLHttpRequest,
                error: (string|Error)
            ): void {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);

                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: store.table,
                    xhr
                });
            }
        });

        // return true;
    }

    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        if (this.options.googleSpreadsheetKey) {
            this.fetchSheet(eventDetail);
        }
    }

    public toJSON(): GoogleDataStore.ClassJSON {
        return {
            $class: 'GoogleSheetsStore',
            metadata: merge(this.metadata),
            options: merge(this.options),
            table: this.table.toJSON()
        };
    }

    /* *
     * TODO:
     * public save() {}
     * ...
     *
     * requires oAuth2 auth
     *
     * */
}

namespace GoogleDataStore {

    export interface ClassJSON extends DataStore.ClassJSON {
        options: Options;
    }

    export type EventObject = (ErrorEventObject|LoadEventObject);

    export interface ErrorEventObject extends DataStore.EventObject {
        readonly type: 'loadError';
        readonly error: (string|Error);
        readonly xhr: XMLHttpRequest;
    }

    export interface LoadEventObject extends DataStore.EventObject {
        readonly type: ('load'|'afterLoad');
        readonly url: string;
    }

    export interface Options extends DataJSON.JSONObject {
        googleSpreadsheetKey: string;
        worksheet: number;
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataJSON.addClass(GoogleSheetsStore);
DataStore.addStore(GoogleSheetsStore);

declare module './Types' {
    interface DataStoreTypeRegistry {
        Google: typeof GoogleSheetsStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default GoogleSheetsStore;
