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

import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
const { win } = H;
import U from '../../Core/Utilities.js';
const {
    fireEvent,
    merge
} = U;

import type DataValueType from '../DataValueType.js';
import DataJSON from '../DataJSON.js';

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class HTMLTableDataStore extends DataStore implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableDataStore.Options = {
        tableHTML: ''
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: HTMLTableDataStore.ClassJSON): HTMLTableDataStore {
        const options = {
                tableHTML: json.tableHTMLId
            },
            table = DataTable.fromJSON(json.table),
            store = new HTMLTableDataStore(table, options);

        store.describe(DataStore.getMetadataFromJSON(json.metadata));
        return store;
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<HTMLTableDataStore.Options & HTMLTableParser.Options> = {}
    ) {
        super(table);
        const { tableHTML, ...parserOptions } = options;

        this.element = tableHTML || '';
        this.parserOptions = merge(HTMLTableDataStore.defaultOptions, parserOptions);
        this.dataParser = new HTMLTableParser(table);

        this.addEvents();
    }

    /* *
    *
    *  Properties
    *
    * */

    public element: HTMLElement | string;
    public parserOptions: HTMLTableDataStore.Options;
    private dataParser: HTMLTableParser;

    private addEvents(): void {
        const { dataParser } = this;
        this.on('load', (e: HTMLTableDataStore.LoadEventObject): void => {
            if (e.tableElement) {
                fireEvent(this, 'parse', { tableElement: e.tableElement });
            } else {
                fireEvent(this, 'fail', {
                    error: 'HTML table not provided, or element with ID not found'
                });
            }
        });

        this.on('afterLoad', (e: DataStore.LoadEventObject): void => {
            this.table = e.table;
        });

        this.on('parse', (e: any): void => {
            this.dataParser.parse({ tableElement: e.tableElement, ...this.parserOptions });
            fireEvent(this, 'afterParse', { dataParser });
        });

        this.on('afterParse', (e: any): void => {
            fireEvent(this, 'afterLoad', { table: dataParser.getTable() });
        });

        this.on('fail', (e: any): void => {
            // throw new Error(e.error)
        });
    }

    /**
     * Handle supplied table being either an ID or an actual table
     */
    private fetchTable(): void {
        let tableElement: HTMLElement | null;
        if (typeof this.element === 'string') {
            tableElement = win.document.getElementById(this.element);
        } else {
            tableElement = this.element;
        }

        fireEvent(this, 'load', { tableElement });
    }

    public load(): void {
        this.fetchTable();
    }

    /**
     * Save
     * @todo implement
     */
    public save(): void {

    }

    public toJSON(): HTMLTableDataStore.ClassJSON {
        const json: HTMLTableDataStore.ClassJSON = {
            $class: 'HTMLTableDataStore',
            table: this.table.toJSON(),
            tableHTMLId: typeof this.element === 'string' ? this.element : this.element.id,
            metadata: this.getMetadataJSON()
        };

        return json;
    }
}

namespace HTMLTableDataStore {
    export interface Options {
        tableHTML: (string | HTMLElement);
    }

    export interface LoadEventObject extends DataStore.LoadEventObject {
        tableElement?: HTMLElement;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        table: DataTable.ClassJSON;
        tableHTMLId: string;
        metadata: DataStore.MetadataJSON;
    }
}

export default HTMLTableDataStore;
