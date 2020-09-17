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
 * Class that handles creating a datastore from an HTML table
 */
class HTMLTableStore extends DataStore<HTMLTableStore.EventObjects> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableStore.Options = {
        tableHTML: ''
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates an HTMLTableStore from ClassJSON
     *
     * @param {HTMLTableStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {HTMLTableStore}
     * HTMLTableStore from the ClassJSON
     */
    public static fromJSON(json: HTMLTableStore.ClassJSON): HTMLTableStore {
        const options = json.options,
            parser = HTMLTableParser.fromJSON(json.parser),
            table = DataTable.fromJSON(json.table),
            store = new HTMLTableStore(table, options, parser);

        store.metadata = merge(json.metadata);

        return store;
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of HTMLTableDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {HTMLTableStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: HTMLTableStore.OptionsType = {},
        parser?: HTMLTableParser
    ) {
        super(table);

        this.tableElement = null;

        this.options = merge(HTMLTableStore.defaultOptions, options);
        this.parser = parser || new HTMLTableParser(this.options, this.tableElement);
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Options for the HTMLTable datastore
     * @todo this should not include parsing options
     */
    public readonly options: (HTMLTableStore.Options&HTMLTableParser.OptionsType);

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: HTMLTableParser;

    /**
     * The table element to create the store from.
     * Is either supplied directly or is fetched by an ID.
     */
    public tableElement: (HTMLElement|null);

    public tableID?: string;

    /**
     * Handles retrieving the HTML table by ID if an ID is provided
     */
    private fetchTable(): void {
        const store = this,
            { tableHTML } = store.options;

        let tableElement: (HTMLElement|null);

        if (typeof tableHTML === 'string') {
            store.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        } else {
            tableElement = tableHTML;
            store.tableID = tableElement.id;
        }

        store.tableElement = tableElement;
    }

    /**
     * Initiates creating the datastore from the HTML table
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this;

        store.fetchTable();

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });

        if (!store.tableElement) {
            store.emit({
                type: 'loadError',
                detail: eventDetail,
                error: 'HTML table not provided, or element with ID not found',
                table: store.table
            });
            return;
        }

        store.parser.parse(
            merge({ tableHTML: store.tableElement }, store.options),
            eventDetail
        );

        store.table = store.parser.getTable();

        store.emit({
            type: 'afterLoad',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });
    }

    /**
     * Save
     * @todo implement
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public save(eventDetail?: DataEventEmitter.EventDetail): void {

    }

    public toJSON(): HTMLTableStore.ClassJSON {
        const store = this,
            json: HTMLTableStore.ClassJSON = {
                $class: 'HTMLTableStore',
                metadata: merge(store.metadata),
                options: merge(this.options),
                parser: store.parser.toJSON(),
                table: store.table.toJSON(),
                tableElementID: store.tableID || ''
            };

        return json;
    }
}


/**
 *
 *  Namespace
 *
 */

/**
 * Types for class-specific options and events
 */
namespace HTMLTableStore {

    /**
     * Type for event object fired from HTMLTableDataStore
     */
    export type EventObjects = (ErrorEventObject|LoadEventObject);

    /**
     * Options used in the constructor of HTMLTableDataStore
     */
    export type OptionsType = Partial<(HTMLTableStore.Options&HTMLTableParser.OptionsType)>

    /**
     * The ClassJSON used to import/export HTMLTableDataStore
     */
    export interface ClassJSON extends DataStore.ClassJSON {
        options: HTMLTableStore.OptionsType;
        parser: HTMLTableParser.ClassJSON;
        tableElementID: string;
    }

    /**
     * Provided event object on errors within HTMLTableDataStore
     */
    export interface ErrorEventObject extends DataStore.EventObject {
        type: 'loadError';
        error: (string|Error);
    }

    /**
     * Provided event object on load events within HTMLTableDataStore
     */
    export interface LoadEventObject extends DataStore.EventObject {
        type: ('load'|'afterLoad');
        tableElement?: (HTMLElement|null);
    }

    /**
     * Internal options for the HTMLTableDataStore class
     */
    export interface Options {
        tableHTML: (string | HTMLElement);
    }

}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(HTMLTableStore);
DataStore.addStore(HTMLTableStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        HTMLTable: typeof HTMLTableStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default HTMLTableStore;
