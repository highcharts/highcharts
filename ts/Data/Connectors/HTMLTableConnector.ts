/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type HTMLTableConnectorOptions from './HTMLTableConnectorOptions';
import type HTMLTableConverterOptions from '../Converters/HTMLTableConverterOptions';

import DataConnector from './DataConnector.js';
import HTMLTableConverter from '../Converters/HTMLTableConverter.js';
import H from '../../Core/Globals.js';
const { win } = H;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that handles creating a data connector from an HTML table.
 *
 * @private
 */
class HTMLTableConnector extends DataConnector {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableConnectorOptions = {
        id: 'HTML-table-connector',
        type: 'HTMLTable',
        htmlTable: ''
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of HTMLTableConnector.
     *
     * @param {HTMLTableConnector.CombinedHTMLTableConnectorOptions} [options]
     * Options for the connector and converter.
     */
    public constructor(
        options?: HTMLTableConnector.CombinedHTMLTableConnectorOptions
    ) {
        const mergedOptions = merge(HTMLTableConnector.defaultOptions, options);

        super(mergedOptions);
        this.options = mergedOptions;

        this.converter = new HTMLTableConverter(mergedOptions);
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
    public readonly options: HTMLTableConnectorOptions;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public converter: HTMLTableConverter;

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
    public async load(eventDetail?: DataEvent.Detail): Promise<this> {
        const connector = this;
        const options = connector.options;
        const converter = connector.converter;
        const table = connector.getTable();
        const htmlTable = options.htmlTable;

        connector.emit({
            type: 'load',
            detail: eventDetail
        });


        let tableElement: (HTMLElement|null);

        if (typeof htmlTable === 'string') {
            connector.tableID = htmlTable;
            tableElement = win.document.getElementById(htmlTable);
        } else {
            tableElement = htmlTable;
            connector.tableID = tableElement.id;
        }

        connector.tableElement = tableElement || void 0;

        if (!connector.tableElement) {
            const error =
                'HTML table not provided, or element with ID not found';

            connector.emit({
                type: 'loadError',
                detail: eventDetail,
                error
            });

            return Promise.reject(new Error(error));
        }

        const columns = converter.parse(
            merge({ tableElement: connector.tableElement }, options),
            eventDetail
        );

        // If already loaded, clear the current rows
        table.deleteColumns();
        table.setColumns(columns);

        await connector.applyTableModifiers();
        connector.emit({
            type: 'afterLoad',
            detail: eventDetail
        });
        return connector;
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
    export interface Event extends DataConnector.Event {}

    /**
     * Options for exporting the connector as an HTML table
     */
    export interface ExportOptions {
        decimalPoint?: string|null;
        exportIDColumn?: boolean;
        tableCaption?: string;
        useLocalDecimalPoint?: boolean;
        useMultiLevelHeaders?: boolean;
        useRowspanHeaders?: boolean;
    }

    /**
     * Options of the HTMLTable connector and converter.
     */
    export type CombinedHTMLTableConnectorOptions =
        Partial<HTMLTableConnectorOptions> & HTMLTableConverterOptions;

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        HTMLTable: typeof HTMLTableConnector;
    }
}

DataConnector.registerType('HTMLTable', HTMLTableConnector);

/* *
 *
 *  Default Export
 *
 * */

export default HTMLTableConnector;
