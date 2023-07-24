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
 *  - Christer Vasseng
 *  - Gøran Slettemark
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
import type CSVConnectorOptions from './CSVConnectorOptions';

import CSVConverter from '../Converters/CSVConverter.js';
import DataConnector from './DataConnector.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that handles creating a DataConnector from CSV
 *
 * @private
 */
class CSVConnector extends DataConnector {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: CSVConnectorOptions = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1,
        firstRowAsNames: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of CSVConnector.
     *
     * @param {CSVConnector.UserOptions} [options]
     * Options for the connector and converter.
     */
    public constructor(
        options?: CSVConnector.UserOptions
    ) {
        const mergedOptions = merge(CSVConnector.defaultOptions, options);

        super(mergedOptions);

        this.converter = new CSVConverter(mergedOptions);
        this.options = mergedOptions;

        if (mergedOptions.enablePolling) {
            this.startPolling(
                Math.max(mergedOptions.dataRefreshRate || 0, 1) * 1000
            );
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options related to the handling of the CSV DataConnector,
     * i.e. source, fetching, polling
     */
    public readonly options: CSVConnectorOptions;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly converter: CSVConverter;

    /**
     * The URL to fetch if the source is external
     */
    private liveDataURL?: string;

    /**
     * The current timeout ID if polling is enabled
     */
    private liveDataTimeout?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the loading of the CSV source to the connector
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVConnector#load
     * @emits CSVConnector#afterLoad
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const connector = this,
            converter = connector.converter,
            table = connector.table,
            {
                csv,
                csvURL
            } = connector.options;

        if (csv) {
            // If already loaded, clear the current rows
            table.deleteRows();
            connector.emit<CSVConnector.Event>({
                type: 'load',
                csv,
                detail: eventDetail,
                table
            });
            converter.parse({ csv });
            table.setColumns(converter.getTable().getColumns());
            connector.emit<CSVConnector.Event>({
                type: 'afterLoad',
                csv,
                detail: eventDetail,
                table
            });
        } else if (csvURL) {
            // Clear the table
            connector.table.deleteColumns();

            connector.emit<CSVConnector.Event>({
                type: 'load',
                detail: eventDetail,
                table: connector.table
            });

            return fetch(csvURL || '')
                .then((response): Promise<void> => response.text().then(
                    (csv): void => {
                        connector.converter.parse({ csv });

                        // On inital fetch we need to set the columns
                        connector.table.setColumns(
                            connector.converter.getTable().getColumns()
                        );

                        connector.emit<CSVConnector.Event>({
                            type: 'afterLoad',
                            csv,
                            detail: eventDetail,
                            table: connector.table
                        });
                    }
                ))['catch']((error): Promise<void> => {
                    connector.emit<CSVConnector.Event>({
                        type: 'loadError',
                        detail: eventDetail,
                        error,
                        table: connector.table
                    });

                    return Promise.reject(error);
                })
                .then((): this =>
                    connector
                );
        } else {
            connector.emit<CSVConnector.Event>({
                type: 'loadError',
                detail: eventDetail,
                error: 'Unable to load: no CSV string or URL was provided',
                table
            });
        }

        return Promise.resolve(connector);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Types for class-specific options and events.
 */
namespace CSVConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event objects fired from CSVConnector events.
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * The event object that is provided on errors within CSVConnector.
     */
    export interface ErrorEvent extends DataConnector.ErrorEvent {
        csv?: string;
    }

    /**
     * The event object that is provided on load events within CSVConnector.
     */
    export interface LoadEvent extends DataConnector.LoadEvent {
        csv?: string;
    }

    /**
     * Available options for constructor and converter of the CSVConnector.
     */
    export type UserOptions = (DeepPartial<CSVConnectorOptions>&CSVConverter.UserOptions);

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        CSV: typeof CSVConnector;
    }
}

DataConnector.registerType('CSV', CSVConnector);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnector;
