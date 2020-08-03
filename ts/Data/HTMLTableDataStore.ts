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
import DataParser from './DataParser.js';

import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';

const { fireEvent } = U;
const { win } = H;

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
        this.dataParser = new DataParser();

        this.addEvents();
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

    private columns?: Highcharts.DataValueType[][];
    private headers?: string[];

    private dataParser: DataParser;

    private addEvents(): void {
        this.on('load', (e: DataStore.LoadEventObject): void => {
            // console.log(e)
        });
        this.on('afterLoad', (e: DataStore.LoadEventObject): void => {
            this.rows = e.table;
        });
        this.on('parse', (e: DataStore.ParseEventObject): void => {
            // console.log(e)
        });
        this.on('afterParse', (e: DataStore.ParseEventObject): void => {
            this.columns = e.columns;
            this.headers = e.headers;
        });
        this.on('fail', (e: any): void => {
            // throw new Error(e.error)
        });
    }

    private htmlToDataTable(table: HTMLElement): void {
        const columns: [] = [],
            headers: string[] = [],
            store = this,
            {
                startRow,
                endRow,
                startColumn,
                endColumn
            } = store;

        fireEvent(
            this,
            'parse',
            { table: table.innerHTML },
            function (): void {
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

                fireEvent(store, 'afterParse', { columns, headers });
            }
        );
    }

    /**
     * Handle supplied table being either an ID or an actual table
     */
    private fetchTable(): void {
        let tableElement: HTMLElement | null;
        if (typeof this.table === 'string') {
            tableElement = win.document.getElementById(this.table);
        } else {
            tableElement = this.table;
        }

        fireEvent(
            this,
            'load',
            { tableElement },
            (): void => {
                if (tableElement) {
                    this.htmlToDataTable(tableElement);
                    const table = this.columns ?
                        this.dataParser.columnArrayToDataTable(this.columns, this.headers) :
                        new DataTable();
                    fireEvent(this, 'afterLoad', { table });
                } else {
                    fireEvent(this, 'fail', {
                        error: 'HTML table not provided, or could not find ID'
                    });
                }
            }
        );
    }

    /**
     * Load
     * TODO: add callback / fire event
     */
    public load(): void {
        this.fetchTable();
    }

    /**
     * Save
     * @todo implement
     */
    public save(): void {

    }
}

export default HTMLTableDataStore;
