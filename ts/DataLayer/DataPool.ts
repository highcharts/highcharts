/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from './DataEvent';
import type DataConnectorOptions from './Connectors/DataConnectorOptions';
import type DataConnectorType from './Connectors/DataConnectorType';

import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */


/**
 * Data pool to load connectors on-demand.
 *
 * @class
 * @name Data.DataPool
 *
 * @param {Data.DataPoolOptions} options
 * Pool options with all connectors.
 */
class DataPool implements DataEvent.Emitter<DataPool.Event> {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Internal dictionary with the connectors and their IDs.
     */
    protected readonly connectors: Record<string, DataConnectorType>;


    /**
     * Pool options with all connectors.
     */
    public readonly options: DataPool.Options;


    /**
     * Internal dictionary with the promise resolves waiting for connectors to
     * be done loading.
     */
    protected readonly waiting: Record<string, [Function, Function][]>;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(options?: DataPool.Options) {
        this.options = merge(DataPool.defaultOptions, options);
        this.connectors = {};
        this.waiting = {};
    }


    /* *
     *
     *  Methods
     *
     * */


    /**
     * Emits an event on this data pool to all registered callbacks of the given
     * event.
     *
     * @param {DataTable.Event} e
     * Event object with event information.
     *
     * @internal
     */
    public emit(e: DataPool.Event): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Loads the connector.
     *
     * @function Data.DataPool#getConnector
     *
     * @param {string} connectorId
     * ID of the connector.
     *
     * @return {Promise<Data.DataConnectorType>}
     * Returns the connector.
     */
    public getConnector(
        connectorId: string
    ): Promise<DataConnectorType> {
        const connector = this.connectors[connectorId];

        // Already loaded
        if (connector) {
            return Promise.resolve(connector);
        }

        let waitingList = this.waiting[connectorId];

        // Start loading
        if (!waitingList) {
            waitingList = this.waiting[connectorId] = [];

            const connectorOptions = this.getConnectorOptions(connectorId);

            if (!connectorOptions) {
                throw new Error(`Connector '${connectorId}' not found.`);
            }

            // TODO: Get back to this when the connectors are ready
            // this
            //     .loadConnector(connectorOptions)
            //     .then((connector): void => {
            //         delete this.waiting[connectorId];
            //       for (let i = 0, iEnd = waitingList.length; i < iEnd; ++i) {
            //             waitingList[i][0](connector);
            //         }
            //     })['catch']((error): void => {
            //         delete this.waiting[connectorId];
            //       for (let i = 0, iEnd = waitingList.length; i < iEnd; ++i) {
            //             waitingList[i][1](error);
            //         }
            //     });
        }

        // Add request to waiting list
        return new Promise((resolve, reject): void => {
            waitingList.push([resolve, reject]);
        });
    }


    /**
     * Returns the IDs of all connectors.
     *
     * @private
     *
     * @return {Array<string>}
     * Names of all connectors.
     */
    public getConnectorIds(): Array<string> {
        const connectors = this.options.connectors,
            connectorIds: Array<string> = [];

        for (let i = 0, iEnd = connectors.length; i < iEnd; ++i) {
            connectorIds.push(connectors[i].id);
        }

        return connectorIds;
    }


    /**
     * Loads the options of the connector.
     *
     * @private
     *
     * @param {string} connectorId
     * ID of the connector.
     *
     * @return {DataPoolConnectorOptions|undefined}
     * Returns the options of the connector, or `undefined` if not found.
     */
    protected getConnectorOptions(
        connectorId: string
    ): DataConnectorOptions | undefined {
        const connectors = this.options.connectors;

        for (let i = 0, iEnd = connectors.length; i < iEnd; ++i) {
            if (connectors[i].id === connectorId) {
                return connectors[i];
            }
        }
    }


    /**
     * Tests whether the connector has never been requested.
     *
     * @param {string} connectorId
     * Name of the connector.
     *
     * @return {boolean}
     * Returns `true`, if the connector has never been requested, otherwise
     * `false`.
     */
    public isNewConnector(
        connectorId: string
    ): boolean {
        return !this.connectors[connectorId];
    }

    /**
     * Creates and loads the connector.
     */
    protected loadConnector(
    /// options: DataConnectorOptions
    ): Promise<DataConnectorType> {
        return new Promise((/* /// resolve, reject /// */): void => {

            // TODO: Get back to this when the connectors are ready

            // this.emit({
            //     type: 'load',
            //     options
            // });

            // const ConnectorClass = DataConnector.types[options.type];

            // if (!ConnectorClass) {
            //     throw new Error(`Connector type not found. (${options.type})`);
            // }

            // const connector = new ConnectorClass(options);

            // // eslint-disable-next-line @typescript-eslint/no-floating-promises
            // connector
            //     .load()
            //     .then((connector): void => {
            //         this.connectors[options.id] = connector;

            //         this.emit({
            //             type: 'afterLoad',
            //             options
            //         });

            //         resolve(connector);
            //     })['catch'](reject);
        });
    }


    /**
     * Registers a callback for a specific event.
     *
     * @function Highcharts.DataPool#on
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.DataPool>} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on<T extends DataPool.Event['type']>(
        type: T,
        callback: DataEvent.Callback<this, Extract<DataPool.Event, {
            type: T
        }>>
    ): Function {
        return addEvent(this, type, callback);
    }


    /**
     * Sets connector options under the specified `options.id`.
     *
     * @param options
     * Connector options to set.
     */
    public setConnectorOptions(options: DataConnectorOptions): void {
        const connectorsOptions = this.options.connectors;
        /// connectorsInstances = this.connectors;

        this.emit({
            type: 'setConnectorOptions',
            options
        });

        for (let i = 0, iEnd = connectorsOptions.length; i < iEnd; ++i) {
            if (connectorsOptions[i].id === options.id) {
                connectorsOptions.splice(i, 1);
                break;
            }
        }

        // TODO: Get back to this when the connectors are ready

        // if (connectorsInstances[options.id]) {
        //     connectorsInstances[options.id].stopPolling();
        //     delete connectorsInstances[options.id];
        // }

        connectorsOptions.push(options);

        this.emit({
            type: 'afterSetConnectorOptions',
            options
        });
    }


}


/* *
 *
 *  Class Namespace
 *
 * */


namespace DataPool {

    /* *
     *
     *  Definitions
     *
     * */

    export const defaultOptions: Options = {
        connectors: []
    };


    /* *
     *
     *  Declarations
     *
     * */

    export interface Options {
        /**
         * The connectors to use for loading data. Available connectors and its
         * options:
         *
         * {@link CSVConnectorOptions | CSVConnector}
         *
         * {@link GoogleSheetsConnectorOptions | GoogleSheetsConnector}
         *
         * {@link HTMLTableConnectorOptions | HTMLTableConnector}
         *
         * {@link JSONConnectorOptions | JSONConnector}
         *
         **/
        connectors: Array<DataConnectorOptions>;
    }

    export interface Event {
        type: (
            |'load'|'afterLoad'
            |'setConnectorOptions'|'afterSetConnectorOptions'
        );
        options: DataConnectorOptions;
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default DataPool;
