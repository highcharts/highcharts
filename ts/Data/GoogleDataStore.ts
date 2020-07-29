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

'use strict';

import DataTable from './DataTable.js';
import DataStore from './DataStore.js';

import AjaxMixin from '../Mixins/Ajax.js';
const { ajax } = AjaxMixin;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class GoogleDataStore extends DataStore {
    public constructor(
        dataSet: DataTable,
        options: GoogleSpreadsheetOptions
    ) {
        super(dataSet);

        this.googleSpreadsheetKey = options.googleSpreadsheetKey;
        this.worksheet = options.worksheet || 1;
        this.startRow = options.startRow || 0;
        this.endRow = options.endRow || Number.MAX_VALUE;
        this.startColumn = options.startColumn || 0;
        this.endColumn = options.endColumn || Number.MAX_VALUE;
        this.enablePolling = options.enablePolling || false;
        this.dataRefreshRate = options.dataRefreshRate || 2;

    }

    /* *
    *
    *  Properties
    *
    * */
    public googleSpreadsheetKey: string;
    public worksheet: number;
    public startRow: number;
    public endRow: number;
    public startColumn: number;
    public endColumn: number;
    public enablePolling: boolean;
    public dataRefreshRate: number;

    /* *
    *
    *  Functions
    *
    * */
    private parseSheet(json: Highcharts.JSONType): (boolean|undefined) {
        var startColumn = this.startColumn,
            endColumn = this.endColumn,
            startRow = this.startRow,
            endRow = this.endRow,
            columns: Array<Array<Highcharts.DataValueType>> = [],
            cells = json.feed.entry,
            cell,
            cellCount = (cells || []).length,
            colCount = 0,
            rowCount = 0,
            val,
            gr,
            gc,
            cellInner,
            i: number;

        if (!cells || cells.length === 0) {
            return false;
        }

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
                    if (cellInner.$t.indexOf('/') >= 0 ||
                        cellInner.$t.indexOf('-') >= 0) {
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
        columns.forEach(function (
            column: Array<Highcharts.DataValueType>
        ): void {
            for (i = 0; i < column.length; i++) {
                if (typeof column[i] === 'undefined') {
                    column[i] = null as any;
                }
            }
        });

        /* *
         * TODO:
         * add data to dataTable
         * ...
         *
         * */
    }

    private fetchSheet(): void {
        const parseSheet = this.parseSheet;
        const fetchSheet = this.fetchSheet;

        const enablePolling = this.enablePolling;
        const dataRefreshRate = this.dataRefreshRate;

        const url = [
            'https://spreadsheets.google.com/feeds/cells',
            this.googleSpreadsheetKey,
            this.worksheet,
            'public/values?alt=json'
        ].join('/');

        ajax({
            url: url,
            dataType: 'json',
            success: function (json: Highcharts.JSONType): void {

                parseSheet(json);

                // Polling
                if (enablePolling) {
                    setTimeout(
                        function (): void {
                            fetchSheet();
                        },
                        dataRefreshRate * 1000
                    );
                }
            },
            error: function (
                xhr: XMLHttpRequest,
                text: (string|Error)
            ): void {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);
            }
        });

        // return true;
    }

    public load(): void {
        return this.googleSpreadsheetKey ?
            this.fetchSheet() : void 0;
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

export interface GoogleSpreadsheetOptions {
    googleSpreadsheetKey: string;
    worksheet?: number;
    startRow?: number;
    endRow?: number;
    startColumn?: number;
    endColumn?: number;
    enablePolling?: boolean;
    dataRefreshRate?: number;
}

export default GoogleDataStore;
