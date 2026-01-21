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

import type {
    DataEventCallback,
    DataEventDetail,
    DataEventEmitter
} from '../DataEvent';
import type DataModifierEvent from './DataModifierEvent';
import type DataModifierOptions from './DataModifierOptions';
import type DataTable from '../DataTable';
import type { DataModifierTypes } from './DataModifierType';

import U from '../../Core/Utilities.js';
import { merge } from '../../Shared/Utilities.js';
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
 * Abstract class to provide an interface for modifying a table.
 */
abstract class DataModifier implements DataEventEmitter<DataModifierEvent> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Registry as a record object with modifier names and their class
     * constructor.
     */
    public static types = {} as DataModifierTypes;

    /**
     * Adds a modifier class to the registry. The modifier class has to provide
     * the `DataModifier.options` property and the `DataModifier.modifyTable`
     * method to modify the table.
     *
     * @private
     *
     * @param {string} key
     * Registry key of the modifier class.
     *
     * @param {DataModifierType} DataModifierClass
     * Modifier class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a modifier registered with this key.
     */
    public static registerType<T extends keyof DataModifierTypes>(
        key: T,
        DataModifierClass: DataModifierTypes[T]
    ): boolean {
        return (
            !!key &&
            !DataModifier.types[key] &&
            !!(DataModifier.types[key] = DataModifierClass)
        );
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Modifier options.
     */
    public abstract readonly options: DataModifierOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Runs a timed execution of the modifier on the given datatable.
     * Can be configured to run multiple times.
     *
     * @param {DataTable} dataTable
     * The datatable to execute
     *
     * @param {BenchmarkOptions} options
     * Options. Currently supports `iterations` for number of iterations.
     *
     * @return {Array<number>}
     * An array of times in milliseconds
     *
     */
    public benchmark(
        dataTable: DataTable,
        options?: BenchmarkOptions
    ): Array<number> {
        const results: Array<number> = [];
        const modifier = this;
        const execute = (): void => {
            modifier.modifyTable(dataTable);
            modifier.emit<DataModifierEvent>({
                type: 'afterBenchmarkIteration'
            });
        };

        const defaultOptions = {
            iterations: 1
        };

        const { iterations } = merge(
            defaultOptions,
            options
        );

        modifier.on('afterBenchmarkIteration', (): void => {
            if (results.length === iterations) {
                modifier.emit<DataModifierEvent>({
                    type: 'afterBenchmark',
                    results
                });
                return;
            }

            // Run again
            execute();
        });

        const times = {
            startTime: 0,
            endTime: 0
        };

        // Add timers
        modifier.on('modify', (): void => {
            times.startTime = window.performance.now();
        });

        modifier.on('afterModify', (): void => {
            times.endTime = window.performance.now();
            results.push(times.endTime - times.startTime);
        });

        // Initial run
        execute();

        return results;
    }

    /**
     * Emits an event on the modifier to all registered callbacks of this event.
     *
     * @param {DataModifierEvent} [e]
     * Event object containing additonal event information.
     */
    public emit<E extends DataModifierEvent>(e: E): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Modifies the given table and sets its `modified` property as a reference
     * to the modified table. If `modified` property does not exist on the
     * original table, it's always created.
     *
     * @param {Highcharts.DataTable} table
     * Table to modify.
     *
     * @param {DataEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Promise<Highcharts.DataTable>}
     * Table with `modified` property as a reference.
     */
    public modify(
        table: DataTable,
        eventDetail?: DataEventDetail
    ): Promise<DataTable> {
        const modifier = this;
        return new Promise((resolve, reject): void => {
            if (!table.modified) {
                table.modified = table.clone(false, eventDetail);
            }
            try {
                resolve(modifier.modifyTable(table, eventDetail));
            } catch (e) {
                modifier.emit<DataModifierEvent>({
                    type: 'error',
                    detail: eventDetail,
                    table
                });
                reject(e instanceof Error ? e : new Error('' + e));
            }
        });
    }

    /**
     * Creates a modified copy of the given table and sets its `modified`
     * property as a reference to the modified table. If `modified` property
     * does not exist, the original table is changed.
     *
     * @param {Highcharts.DataTable} table
     * Table to modify.
     *
     * @param {DataEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference or modified table, if
     * `modified` property of the original table is undefined.
     */
    public abstract modifyTable(
        table: DataTable,
        eventDetail?: DataEventDetail
    ): DataTable;

    /**
     * Registers a callback for a specific modifier event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on<T extends DataModifierEvent['type']>(
        type: T,
        callback: DataEventCallback<this, Extract<DataModifierEvent, {
            type: T
        }>>
    ): Function {
        return addEvent(this, type, callback);
    }

}

/* *
 *
 *  Declarations
 *
 * */

/**
 * Additionally provided types for modifier events and options.
 */
export interface BenchmarkOptions {
    iterations: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataModifier;
