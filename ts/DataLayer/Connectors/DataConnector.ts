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
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypes } from './DataConnectorType';
import type { DataConnectorOptions } from './DataConnectorOptions';
import type DataEvent from '../DataEvent';

import DataModifier from '../Modifiers/DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class providing an interface for managing a DataConnector.
 */
abstract class DataConnector implements DataEvent.Emitter<DataConnector.EventType> {


    /* *
     *
     *  Properties
     *
     * */

    /**
     * Tables managed by this DataConnector instance.
     */
    public readonly dataTables: Record<string, DataTable> = {};

    /**
     * ID of the polling timeout.
     */
    private _polling?: number;

    /**
     * Whether the connector is currently polling for new data.
     */
    public get polling(): boolean {
        return !!this._polling;
    }

    /**
     * The polling controller used to abort the request when data polling stops.
     * It gets assigned when data polling starts.
     */
    public pollingController?: AbortController;

    /**
     * The options of the connector.
     */
    public readonly options: DataConnectorOptions;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructor of the connector class.
     *
     * @param options
     * Options to use in the connector.
     */
    public constructor(options: DataConnectorOptions) {
        this.options = options;

        let dataTableIndex = 0;
        for (const tableOptions of options.dataTables || []) {
            this.dataTables[
                tableOptions.key ||
                dataTableIndex++
            ] = new DataTable();
        }
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * The default load method, which fires the `afterLoad` event
     *
     * @return {Promise<DataConnector>}
     * The loaded connector.
     *
     * @emits DataConnector#afterLoad
     */
    public load(): Promise<this> {
        this.emit({ type: 'afterLoad' });
        return Promise.resolve(this);
    }

    /**
     * Applies the data modifiers to the data tables according to the
     * connector data tables options.
     */
    public async applyTableModifiers(): Promise<this> {
        const tableOptionsArray = this.options?.dataTables;

        for (const [key, table] of Object.entries(this.dataTables)) {
            const tableOptions = tableOptionsArray.find(
                (dataTable): boolean => dataTable.key === key
            );

            const ModifierClass = (
                tableOptions?.dataModifier &&
                DataModifier.types[tableOptions.dataModifier.type]
            );

            await table.setModifier(
                ModifierClass ?
                    new ModifierClass(tableOptions.dataModifier as AnyRecord) :
                    void 0
            );
        }

        return this;
    }

    /**
     * Starts polling new data after the specific time span in milliseconds.
     *
     * @param {number} refreshTime
     * Refresh time in milliseconds between polls.
     */
    public startPolling(
        refreshTime: number = 1000
    ): void {
        const connector = this;

        // Assign a new abort controller.
        this.pollingController = new AbortController();

        // Clear the polling timeout.
        window.clearTimeout(connector._polling);

        connector._polling = window.setTimeout(
            (): Promise<void> => connector
                .load()['catch'](
                    (error): void => connector.emit({
                        type: 'loadError',
                        error
                    })
                )
                .then((): void => {
                    if (connector._polling) {
                        connector.startPolling(refreshTime);
                    }
                })
            , refreshTime
        );
    }

    /**
     * Stops polling data.
     */
    public stopPolling(): void {
        const connector = this;

        // Abort the existing request.
        connector?.pollingController?.abort();

        // Clear the polling timeout.
        window.clearTimeout(connector._polling);
        delete connector._polling;
    }

    /**
     * Emits an event on the connector to all registered callbacks of this
     * event.
     *
     * @param e
     * Event object containing additional event information.
     */
    public emit(e: DataConnector.EventType): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific connector event.
     *
     * @param type
     * Event type.
     *
     * @param callback
     * Function to register for the connector callback.
     *
     * @return
     * Function to unregister callback from the connector event.
     */
    public on<T extends DataConnector.EventType['type']>(
        type: T,
        callback: DataEvent.Callback<this, Extract<DataConnector.EventType, {
            type: T
        }>>
    ): Function {
        return addEvent(this, type, callback);
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * The event type that is provided on events within DataConnector.
     */
    export type EventType =
        ErrorEvent |
        LoadEvent;

    /**
     * The event object that is provided on errors within DataConnector.
     */
    export interface ErrorEvent extends DataEvent {
        type: 'loadError';
        error: string | Error;
    }

    /**
     * The event object that is provided on load events within DataConnector.
     */
    export interface LoadEvent extends DataEvent {
        type: 'load' | 'afterLoad';
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Registry as a record object with connector names and their class.
     */
    export const types = {} as DataConnectorTypes;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a connector class to the registry. The connector has to provide the
     * `DataConnector.options` property and the `DataConnector.load` method to
     * modify the table.
     *
     * @private
     *
     * @param {string} key
     * Registry key of the connector class.
     *
     * @param {DataConnectorType} DataConnectorClass
     * Connector class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a connector registered with this key.
     */
    export function registerType<T extends keyof DataConnectorTypes>(
        key: T,
        DataConnectorClass: DataConnectorTypes[T]
    ): boolean {
        return (
            !!key &&
            !types[key] &&
            !!(types[key] = DataConnectorClass)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataConnector;
