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

import DataStore from './DataStore.js';
import DataTable from './DataTable.js';
import DataRow from './DataRow.js';

import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';

const { win } = H;
const { uniqueKey } = U;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class HTMLTableDataStore extends DataStore {


    /* *
    *
    *  Constructors
    *
    * */

    public constructor(
        dataSet: DataTable = new DataTable(),
        options: Highcharts.DataOptions = {}
    ) {
        super(dataSet);

        this.table = options.table || '';
        this.startRow = options.startRow || 0;
        this.endRow = options.endRow || Number.MAX_VALUE;
        this.startColumn = options.startColumn || 0;
        this.endColumn = options.endColumn || Number.MAX_VALUE;
    }

    /* *
    *
    *  Properties
    *
    * */
    public table: HTMLElement | string;
    public startRow: number
    public endRow: number
    public startColumn: number
    public endColumn: number

    private htmlToDataTable(table: HTMLElement): DataTable {
        const columns: [] = [],
            headers: string[] = [],
            startRow = this.startRow,
            endRow = this.endRow,
            startColumn = this.startColumn,
            endColumn = this.endColumn;

        [].forEach.call(table.getElementsByTagName('tr'), function (
            tr: HTMLTableRowElement,
            rowNo: number
        ): void {
            if (rowNo >= startRow && rowNo <= endRow) {
                [].forEach.call(tr.children, function (
                    item: Element,
                    colNo: number
                ): void {
                    const row = (columns as any)[colNo - startColumn];
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
                });
            }
        });

        return this.colsToDataTable(columns, headers);
    }

    /**
     * Handle supplied table being either an ID or an actual table
     */
    private fetchTable(): void {
        let tableToFetch;
        if (typeof this.table === 'string') {
            tableToFetch = win.document.getElementById(this.table);
        } else {
            tableToFetch = this.table;
        }

        this.rows = tableToFetch ? this.htmlToDataTable(tableToFetch) : new DataTable();
    }

    /**
     * Load
     * TODO: add callback / fire event
     */
    public load(): void {
        try {
            this.fetchTable();
        } catch (error) {
            throw new Error('Could not fetch table');
        }
    }

    /**
     * Save
     * @todo implement
     */
    public save(): void {

    }
}

export default HTMLTableDataStore;
