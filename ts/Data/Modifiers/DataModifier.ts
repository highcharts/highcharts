/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type ModifierType from './ModifierType';
import type DataTable from '../DataTable';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge
} = U;

/** eslint-disable valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class to provide an interface for modifying DataTable.
 */
abstract class DataModifier<TEventObject extends DataEventEmitter.EventObject = DataModifier.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Regular expression to extract the modifier name (group 1) from the
     * stringified class type.
     */
    private static readonly nameRegExp = /^function\s+(\w*?)(?:Data)?(?:Modifier)?\s*\(/;

    /**
     * Registry as a record object with modifier names and their class.
     */
    private static readonly registry = {} as Record<string, ModifierType>;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Adds a modifier class to the registry. The modifier has to provide the
     * `DataModifier.options` property and the `DataModifier.execute` method to
     * modify the DataTable.
     *
     * @param {DataModifier} modifier
     * Modifier class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a modifier registered with this name.
     */
    public static addModifier(modifier: ModifierType): boolean {
        const name = DataModifier.getName(modifier),
            registry = DataModifier.registry;

        if (
            typeof name === 'undefined' ||
            registry[name]
        ) {
            return false;
        }

        registry[name] = modifier;

        return true;
    }

    /**
     * Returns all registered modifier names.
     *
     * @return {Array<string>}
     * All registered modifier names.
     */
    public static getAllModifierNames(): Array<string> {
        return Object.keys(DataModifier.registry);
    }

    /**
     * Returns a copy of the modifier registry as record object with
     * modifier names and their modifier class.
     *
     * @return {Record<string,DataModifierRegistryType>}
     * Copy of the modifier registry.
     */
    public static getAllModifiers(): Record<string, ModifierType> {
        return merge(DataModifier.registry);
    }

    /**
     * Returns a modifier class (aka class constructor) of the given modifier
     * name.
     *
     * @param {string} name
     * Registered class name of the class type.
     *
     * @return {DataModifier|undefined}
     * Class type, if the class name was found, otherwise `undefined`.
     */
    public static getModifier(name: string): (ModifierType|undefined) {
        return DataModifier.registry[name];
    }

    /**
     * Extracts the name from a given modifier class.
     *
     * @param {DataModifier} modifier
     * Modifier class to extract the name from.
     *
     * @return {string}
     * Modifier name, if the extraction was successful, otherwise an empty
     * string.
     */
    private static getName(modifier: (NewableFunction|ModifierType)): string {
        return (
            modifier.toString().match(DataModifier.nameRegExp) ||
            ['', '']
        )[1];
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Modifier options.
     */
    public abstract readonly options: DataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Applies modifications to the table rows and returns a new table with the
     * modified rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @return {DataTable}
     * New modified table.
     */
    public abstract execute(table: DataTable): DataTable;

    /**
     * Runs a timed execution of the modifier on the given datatable.
     * Can be configured to run multiple times.
     *
     * @param {DataTable} dataTable
     * The datatable to execute
     *
     * @param {DataModifier.BenchmarkOptions} options
     * Options. Currently supports `iterations` for number of iterations.
     *
     * @return {Array<number>}
     * An array of times in milliseconds
     *
     */
    public benchmark(
        dataTable: DataTable,
        options?: DataModifier.BenchmarkOptions
    ): Array<number> {
        const results: Array<number> = [];
        const modifier = this as DataModifier<DataModifier.BenchmarkEventObject|DataModifier.EventObject>;
        const execute = (): void => {
            modifier.execute(dataTable);
            modifier.emit({ type: 'afterBenchmarkIteration' });
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
                modifier.emit({ type: 'afterBenchmark', results });
                return;
            }

            // Run again
            execute();
        });

        const times: {
            startTime: number;
            endTime: number;
        } = {
            startTime: 0,
            endTime: 0
        };

        // Add timers
        modifier.on('execute', (): void => {
            times.startTime = window.performance.now();
        });

        modifier.on('afterExecute', (): void => {
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
     * @param {DataEventEmitter.EventObject} [e]
     * Event object containing additonal event information.
     */
    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific modifier event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Converts the modifier instance to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this modifier instance.
     */
    public abstract toJSON(): DataModifier.ClassJSON;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace DataModifier {

    /**
     * Class constructor of modifiers.
     *
     * @param {DeepPartial<Options>} [options]
     * Options to configure the modifier.
     */
    export interface ClassConstructor {
        new(options?: DeepPartial<Options>): DataModifier;
    }

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        /**
         * Options to configure the modifier.
         */
        options: Options;
    }

    /**
     * Event object with additional event information.
     */
    export interface EventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'execute'|'afterExecute'
        );
        readonly table: DataTable;
    }

    export interface BenchmarkEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'afterBenchmark'|'afterBenchmarkIteration'
        );
        readonly results?: Array<number>;
    }

    export interface BenchmarkOptions {
        iterations: number;
    }

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataJSON.JSONObject {
        /**
         * Name of the related modifier for these options.
         */
        modifier: string;
    }

}

/* *
 *
 *  Register
 *
 * */

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        '': typeof DataModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataModifier;
