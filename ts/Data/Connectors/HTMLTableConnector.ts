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

import DataConnector from './DataConnector.js';
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
 * Class that handles creating a dataconnector from an HTML table.
 *
 * @private
 */
class HTMLTableConnector extends DataConnector {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableConnector.Options = {
        table: ''
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of HTMLTableConnector.
     *
     * @param {DataTable} table
     * Optional table to create the connector from
     *
     * @param {HTMLTableConnector.OptionsType} options
     * Options for the connector and parser
     *
     * @param {DataConverter} converter
     * Optional converter to replace the default converter
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: HTMLTableConnector.OptionsType = {},
        converter?: HTMLTableConverter
    ) {
        super(table);

        this.options = merge(HTMLTableConnector.defaultOptions, options);
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
     * Options for the HTMLTable dataconnector
     * @todo this should not include parsing options
     */
    public readonly options: (
        HTMLTableConnector.Options&HTMLTableConverter.OptionsType
    );

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly converter: HTMLTableConverter;

    /**
     * The table element to create the connector from. Is either supplied
     * directly or is fetched by an ID.
     */
    public tableElement?: HTMLElement;

    public tableID?: string;

    /**
     * Initiates creating the dataconnector from the HTML table
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits HTMLTableConnector#load
     * @emits HTMLTableConnector#afterLoad
     * @emits HTMLTableConnector#loadError
     */
    public load(
        eventDetail?: DataEvent.Detail
    ): Promise<this> {
        const connector = this;

        // If already loaded, clear the current rows
        connector.table.deleteColumns();

        connector.emit<HTMLTableConnector.Event>({
            type: 'load',
            detail: eventDetail,
            table: connector.table,
            tableElement: connector.tableElement
        });

        const { table: tableHTML } = connector.options;

        let tableElement: (HTMLElement|null);

        if (typeof tableHTML === 'string') {
            connector.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        } else {
            tableElement = tableHTML;
            connector.tableID = tableElement.id;
        }

        connector.tableElement = tableElement || void 0;

        if (!connector.tableElement) {
            const error =
                'HTML table not provided, or element with ID not found';

            connector.emit<HTMLTableConnector.Event>({
                type: 'loadError',
                detail: eventDetail,
                error,
                table: connector.table
            });

            return Promise.reject(new Error(error));
        }

        connector.converter.parse(
            merge({ tableHTML: connector.tableElement }, connector.options),
            eventDetail
        );

        connector.table.setColumns(connector.converter.getTable().getColumns());

        connector.emit<HTMLTableConnector.Event>({
            type: 'afterLoad',
            detail: eventDetail,
            table: connector.table,
            tableElement: connector.tableElement
        });

        return Promise.resolve(this);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Types for class-specific options and events
 */
namespace HTMLTableConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Type for event object fired from HTMLTableConnector
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * Provided event object on errors within HTMLTableConnector
     */
    export type ErrorEvent = DataConnector.ErrorEvent;

    /**
     * Options for exporting the connector as an HTML table
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
     * Provided event object on load events within HTMLTableConnector
     */
    export interface LoadEvent extends DataConnector.LoadEvent {
        tableElement?: (HTMLElement|null);
    }

    /**
     * Internal options for the HTMLTableConnector class
     */
    export interface Options {
        table: (string|HTMLElement);
    }

    /**
     * Options used in the constructor of HTMLTableConnector
     */
    export type OptionsType =
        Partial<(HTMLTableConnector.Options&HTMLTableConverter.OptionsType)>;

}

/* *
 *
 *  Registry
 *
 * */

DataConnector.addConnector(HTMLTableConnector);

declare module './ConnectorType' {
    interface ConnectorTypeRegistry {
        HTMLTable: typeof HTMLTableConnector;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConnector;
