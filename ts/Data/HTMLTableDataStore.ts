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

import DataParser from './Parsers/DataParser.js';
import DataStore from './DataStore.js';
import DataTable from './DataTable.js';
import H from '../Core/Globals.js';
const { win } = H;
import U from '../Core/Utilities.js';
const {
    fireEvent,
    merge
} = U;

import type DataValueType from './DataValueType.js';

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class HTMLTableDataStore extends DataStore {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableDataStore.Options = {
        table: '',
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE
    };

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<HTMLTableDataStore.Options> = {}
    ) {
        super(table);

        this.element = options.table || '';
        this.options = merge(HTMLTableDataStore.defaultOptions, options);
        this.dataParser = new DataParser();

        this.addEvents();
    }

    /* *
    *
    *  Properties
    *
    * */

    public element: HTMLElement | string;

    public options: HTMLTableDataStore.Options

    private columns?: DataValueType[][];
    private headers?: string[];

    private dataParser: DataParser;

    private addEvents(): void {
        this.on('load', (e: DataStore.LoadEventObject): void => {
            // console.log(e)
        });
        this.on('afterLoad', (e: DataStore.LoadEventObject): void => {
            this.table = e.table;
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
            } = store.options;

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
        let element: HTMLElement | null;
        if (typeof this.element === 'string') {
            element = win.document.getElementById(this.element);
        } else {
            element = this.element;
        }

        fireEvent(
            this,
            'load',
            { tableElement: element },
            (): void => {
                if (element) {
                    this.htmlToDataTable(element);
                    const table = this.columns ?
                        this.dataParser.columnArrayToDataTable(this.columns, this.headers) :
                        new DataTable();
                    fireEvent(this, 'afterLoad', { table });
                } else {
                    fireEvent(this, 'fail', {
                        error: 'HTML table not provided, or element with ID not found'
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

namespace HTMLTableDataStore {

    export interface Options {
        table: (string|HTMLElement);
        startColumn: number;
        endColumn: number;
        startRow: number;
        endRow: number;
    }
}

export default HTMLTableDataStore;
