/* *
 *
 *  (c) 2009-2023 Highsoft AS
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
import type JSON from '../../Core/JSON';

import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
const { win } = H;
import HTMLTableConverter from '../Converters/HTMLTableConverter.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that handles creating a datastore from an HTML table
 *
 * @private
 */
class HTMLTableStore extends DataStore {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableStore.Options = {
        table: ''
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of HTMLTableDataStore
     *
     * @param {DataTable} table
     * Optional table to create the store from
     *
     * @param {HTMLTableStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataConverter} converter
     * Optional converter to replace the default converter
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: HTMLTableStore.OptionsType = {},
        converter?: HTMLTableConverter
    ) {
        super(table);

        this.options = merge(HTMLTableStore.defaultOptions, options);
        this.converter = converter || new HTMLTableConverter(
            this.options,
            this.tableElement
        );
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
    public readonly options: (
        HTMLTableStore.Options&HTMLTableConverter.OptionsType
    );

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly converter: HTMLTableConverter;

    /**
     * The table element to create the store from. Is either supplied directly
     * or is fetched by an ID.
     */
    public tableElement?: HTMLElement;

    public tableID?: string;

    /**
     * Initiates creating the datastore from the HTML table
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
    public load(
        eventDetail?: DataEvent.Detail
    ): Promise<this> {
        const store = this;

        // If already loaded, clear the current rows
        store.table.deleteColumns();

        store.emit<HTMLTableStore.Event>({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });

        const { table: tableHTML } = store.options;

        let tableElement: (HTMLElement|null);

        if (typeof tableHTML === 'string') {
            store.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        } else {
            tableElement = tableHTML;
            store.tableID = tableElement.id;
        }

        store.tableElement = tableElement || void 0;

        if (!store.tableElement) {
            const error =
                'HTML table not provided, or element with ID not found';

            store.emit<HTMLTableStore.Event>({
                type: 'loadError',
                detail: eventDetail,
                error,
                table: store.table
            });

            return Promise.reject(new Error(error));
        }

        store.converter.parse(
            merge({ tableHTML: store.tableElement }, store.options),
            eventDetail
        );

        store.table.setColumns(store.converter.getTable().getColumns());

        store.emit<HTMLTableStore.Event>({
            type: 'afterLoad',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });

        return Promise.resolve(this);
    }

}

/* *
 *
 *  Clas Namespace
 *
 * */

/**
 * Types for class-specific options and events
 */
namespace HTMLTableStore {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Type for event object fired from HTMLTableDataStore
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * Provided event object on errors within HTMLTableDataStore
     */
    export type ErrorEvent = DataStore.ErrorEvent;

    /**
     * Options for exporting the store as an HTML table
     */
    export interface ExportOptions extends JSON.Object {
        decimalPoint?: string|null;
        exportIDColumn?: boolean;
        tableCaption?: string;
        useLocalDecimalPoint?: boolean;
        useMultiLevelHeaders?: boolean;
        useRowspanHeaders?: boolean;
        usePresentationOrder?: boolean;
    }

    /**
     * Provided event object on load events within HTMLTableDataStore
     */
    export interface LoadEvent extends DataStore.LoadEvent {
        tableElement?: (HTMLElement|null);
    }

    /**
     * Internal options for the HTMLTableDataStore class
     */
    export interface Options {
        table: (string|HTMLElement);
    }

    /**
     * Options used in the constructor of HTMLTableDataStore
     */
    export type OptionsType =
        Partial<(HTMLTableStore.Options&HTMLTableConverter.OptionsType)>;

}

/* *
 *
 *  Registry
 *
 * */

DataStore.addStore(HTMLTableStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        HTMLTable: typeof HTMLTableStore;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableStore;
