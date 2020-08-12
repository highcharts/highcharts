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

import DataJSON from '../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
const { win } = H;
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

class HTMLTableDataStore extends DataStore<HTMLTableDataStore.EventObjects> implements DataJSON.Class {

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
        const options: HTMLTableDataStore.Options = {
                tableHTML: json.tableElement
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
        options: Partial<(HTMLTableDataStore.Options&HTMLTableParser.Options)> = {}
    ) {
        super(table);

        this.parser = new HTMLTableParser(table);
        this.options = merge(HTMLTableDataStore.defaultOptions, HTMLTableParser.defaultOptions, options);
        this.tableElement = null;
    }

    /* *
    *
    *  Properties
    *
    * */

    public readonly options: (HTMLTableDataStore.Options&HTMLTableParser.Options);
    public readonly parser: HTMLTableParser;
    public tableElement: (HTMLElement|null);

    /**
     * Handle supplied table being either an ID or an actual table
     */
    private fetchTable(): void {
        const store = this,
            { tableHTML } = store.options;

        let tableElement: (HTMLElement|null);

        if (typeof tableHTML === 'string') {
            tableElement = win.document.getElementById(tableHTML);
        } else {
            tableElement = tableHTML;
        }

        store.tableElement = tableElement;
    }

    public load(): void {
        const store = this;

        store.fetchTable();

        store.emit({
            type: 'load',
            table: store.table,
            tableElement: store.tableElement
        });

        if (!store.tableElement) {
            store.emit({
                type: 'loadError',
                error: 'HTML table not provided, or element with ID not found',
                table: store.table
            });
            return;
        }

        store.parser.parse({
            tableElement: store.tableElement,
            ...store.options
        });

        store.table = store.parser.getTable();

        store.emit({
            type: 'afterLoad',
            table: store.table,
            tableElement: store.tableElement
        });
    }

    /**
     * Save
     * @todo implement
     */
    public save(): void {

    }

    public toJSON(): HTMLTableDataStore.ClassJSON {
        const store = this,
            json: HTMLTableDataStore.ClassJSON = {
                $class: 'HTMLTableDataStore',
                table: store.table.toJSON(),
                tableElement: (
                    typeof store.tableElement === 'string' ?
                        store.tableElement :
                        store.tableElement ?
                            store.tableElement.id :
                            ''
                ),
                metadata: store.getMetadataJSON()
            };

        return json;
    }
}

namespace HTMLTableDataStore {

    export type EventObjects = (ErrorEventObject|LoadEventObject);

    export interface ClassJSON extends DataJSON.ClassJSON {
        table: DataTable.ClassJSON;
        tableElement: string;
        metadata: DataStore.MetadataJSON;
    }

    export interface ErrorEventObject extends DataStore.EventObject {
        type: 'loadError';
        error: (string|Error);
    }

    export interface LoadEventObject extends DataStore.EventObject {
        type: ('load'|'afterLoad');
        tableElement?: (HTMLElement|null);
    }

    export interface Options {
        tableHTML: (string | HTMLElement);
    }

}

export default HTMLTableDataStore;
