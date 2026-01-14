/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type DataConnectorType from './Connectors/DataConnectorType';
import type { DataConnectorTypeOptions } from './Connectors/DataConnectorType';
import type DataPoolOptions from './DataPoolOptions';

import DataConnector from './Connectors/DataConnector.js';
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
 * @param {DataPoolOptions} options
 * Pool options with all connectors.
 */
class DataPool implements DataEvent.Emitter<DataPool.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: DataPoolOptions = {
        connectors: []
    };

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
    public readonly options: DataPoolOptions;


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

    public constructor(options?: DataPoolOptions) {
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
    public getConnector(connectorId: string): Promise<DataConnectorType> {
        const connector = this.connectors[connectorId];

        // Already loaded
        if (connector?.loaded) {
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

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this
                .loadConnector(connectorOptions)
                .then((connector): void => {
                    delete this.waiting[connectorId];
                    for (let i = 0, iEnd = waitingList.length; i < iEnd; ++i) {
                        waitingList[i][0](connector);
                    }
                })['catch']((error): void => {
                    delete this.waiting[connectorId];
                    for (let i = 0, iEnd = waitingList.length; i < iEnd; ++i) {
                        waitingList[i][1](error);
                    }
                });
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
     * @return {DataConnectorTypeOptions | undefined}
     * Returns the options of the connector, or `undefined` if not found.
     */
    protected getConnectorOptions(
        connectorId: string
    ): DataConnectorTypeOptions | undefined {
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
     * Instantiates the connector class for the given options and loads its
     * data.
     *
     * @private
     *
     * @param {Data.DataPoolConnectorOptions} options
     * Options of connector.
     *
     * @return {Promise<Data.DataConnectorType>}
     * Returns the connector.
     */
    protected loadConnector(
        options: DataConnectorTypeOptions
    ): Promise<DataConnectorType> {
        return new Promise((resolve, reject): void => {
            this.emit({
                type: 'load',
                options
            });

            const ConnectorClass =
                DataConnector.types[options.type] as Class<DataConnectorType>;

            if (!ConnectorClass) {
                throw new Error(`Connector type not found. (${options.type})`);
            }

            const connector = this.connectors[options.id] =
                new ConnectorClass(options);

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            connector
                .load()
                .then(({ converter }): void => {
                    connector.converter = converter;
                    connector.loaded = true;

                    this.emit({
                        type: 'afterLoad',
                        options
                    });

                    resolve(connector);
                })['catch'](reject);
        });
    }

    /**
     * Cancels all data connectors pending requests.
     */
    public cancelPendingRequests(): void {
        const { connectors } = this;
        for (const connectorKey of Object.keys(connectors)) {
            connectors[connectorKey].stopPolling();
        }
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
    public setConnectorOptions(options: DataConnectorTypeOptions): void {
        const connectorsOptions = this.options.connectors;
        const connectorsInstances = this.connectors;

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

        // TODO: Check if can be refactored
        if (connectorsInstances[options.id]) {
            connectorsInstances[options.id].stopPolling();
            delete connectorsInstances[options.id];
        }

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
     *  Declarations
     *
     * */

    export interface Event {
        type: (
            'load' | 'afterLoad' | 'setConnectorOptions' |
            'afterSetConnectorOptions'
        );
        options: DataConnectorTypeOptions;
    }

}


/* *
 *
 *  Default Export
 *
 * */


export default DataPool;
