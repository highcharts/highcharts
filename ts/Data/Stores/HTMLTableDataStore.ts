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

    /**
     * Creates an HTMLTableStore from ClassJSON
     *
     * @param {HTMLTableDataStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {HTMLTableDataStore}
     * HTMLTableStore from the ClassJSON
     */
    public static fromJSON(json: HTMLTableDataStore.ClassJSON): HTMLTableDataStore {
        const options: HTMLTableDataStore.OptionsType = {
                tableHTML: json.tableElement
            },
            parser = HTMLTableParser.fromJSON(json.parser),
            table = DataTable.fromJSON(json.table),
            store = new HTMLTableDataStore(table, options, parser);

        store.describe(DataStore.getMetadataFromJSON(json.metadata));

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
     * @param {HTMLTableDataStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<(HTMLTableDataStore.Options&HTMLTableParser.Options)> = {},
        parser?: HTMLTableParser
    ) {
        super(table);

        this.tableElement = null;
        this.options = merge(HTMLTableDataStore.defaultOptions, HTMLTableParser.defaultOptions, options);
        this.parser = parser || new HTMLTableParser(this.tableElement, this.options);
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
    public readonly options: (HTMLTableDataStore.Options&HTMLTableParser.Options);

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: HTMLTableParser;

    /**
     * The table element to create the store from.
     * Is either supplied directly or is fetched by an ID.
     */
    public tableElement: (HTMLElement|null);

    /**
     * Handles retrieving the HTML table by ID if an ID is provided
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

    /**
     * Initiates creating the datastore from the HTML table
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
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

        store.parser.parse(
            merge({ tableHTML: store.tableElement }, store.options)
        );

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
                metadata: store.getMetadataJSON(),
                parser: store.parser.toJSON(),
                table: store.table.toJSON(),
                tableElement: (
                    typeof store.tableElement === 'string' ?
                        store.tableElement :
                        store.tableElement ?
                            store.tableElement.id :
                            ''
                )
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
namespace HTMLTableDataStore {

    /**
     * Type for event object fired from HTMLTableDataStore
     */
    export type EventObjects = (ErrorEventObject|LoadEventObject);

    /**
     * Options used in the constructor of HTMLTableDataStore
     */
    export type OptionsType = Partial<(Options&HTMLTableParser.Options)>

    /**
     * The ClassJSON used to import/export HTMLTableDataStore
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        metadata: DataStore.MetadataJSON;
        parser: HTMLTableParser.ClassJSON;
        table: DataTable.ClassJSON;
        tableElement: string;
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
 *  Export
 *
 * */

export default HTMLTableDataStore;
