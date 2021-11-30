/* *
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataTable from '../DataTable';
import type JSON from '../../Core/JSON';
import type ModifierType from './ModifierType';

import DataPromise from '../DataPromise.js';
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
 * Abstract class to provide an interface for modifying a table.
 *
 * @private
 */
abstract class DataModifier<TEvent extends DataEventEmitter.Event = DataModifier.Event>
implements DataEventEmitter<(TEvent|DataModifier.Event)> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Regular expression to extract the modifier name (group 1) from the
     * stringified class type.
     */
    private static readonly nameRegExp = (
        /^function\s+(\w*?)(?:Data)?(?:Modifier)?\s*\(/
    );

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
     * modify the table.
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
        const modifier = this as DataModifier<DataModifier.BenchmarkEvent|DataModifier.Event>;
        const execute = (): void => {
            modifier.modifyTable(dataTable);
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
     * @param {DataEventEmitter.Event} [e]
     * Event object containing additonal event information.
     */
    public emit(e: (TEvent|DataModifier.Event)): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns a modified copy of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Promise<Highcharts.DataTable>}
     * Table with `modified` property as a reference.
     */
    public modify<T extends DataTable>(
        table: T,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataPromise<T> {
        const modifier = this;
        return new DataPromise((resolve, reject): void => {
            if (table.modified === table) {
                table.modified = table.clone(false, eventDetail);
            }
            try {
                resolve(modifier.modifyTable(table, eventDetail));
            } catch (e) {
                modifier.emit({
                    type: 'error',
                    detail: eventDetail,
                    table
                });
                reject(e);
            }
        });
    }

    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {string} columnName
     * Column name of changed cell.
     *
     * @param {number|undefined} rowIndex
     * Row index of changed cell.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Changed cell value.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyCell<T extends DataTable>(
        table: T,
        columnName: string,
        rowIndex: number,
        cellValue: DataTable.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): T {
        return this.modifyTable(table);
    }

    /**
     * Applies partial modifications of column changes to the property
     * `modified` of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Changed columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex=0]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyColumns<T extends DataTable>(
        table: T,
        columns: DataTable.ColumnCollection,
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): T {
        return this.modifyTable(table);
    }

    /**
     * Applies partial modifications of row changes to the property `modified`
     * of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Array<(Highcharts.DataTableRow|Highcharts.DataTableRowObject)>} rows
     * Changed rows.
     *
     * @param {number} [rowIndex]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyRows<T extends DataTable>(
        table: T,
        rows: Array<(DataTable.Row|DataTable.RowObject)>,
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): T {
        return this.modifyTable(table);
    }

    /**
     * Applies modifications of row changes to the property `modified` of the
     * given table.
     *
     * @param {Highcharts.DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public abstract modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEventEmitter.EventDetail
    ): T;

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
        type: TEvent['type'],
        callback: DataEventEmitter.EventCallback<this, TEvent>
    ): Function {
        return addEvent(this, type, callback);
    }

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
     * Benchmark event with additional event information.
     */
    export interface BenchmarkEvent extends DataEventEmitter.Event {
        readonly type: (
            'afterBenchmark'|
            'afterBenchmarkIteration'
        );
        readonly results?: Array<number>;
    }

    /**
     * Benchmark options.
     */
    export interface BenchmarkOptions {
        iterations: number;
    }

    /**
     * Error event with additional event information.
     */
    export interface ErrorEvent extends DataEventEmitter.Event {
        readonly type: 'error';
        readonly table: DataTable;
    }

    /**
     * Event information.
     */
    export type Event = (BenchmarkEvent|ErrorEvent|ModifyEvent);

    /**
     * Modify event with additional event information.
     */
    export interface ModifyEvent extends DataEventEmitter.Event {
        readonly type: (
            'modify'|'afterModify'
        );
        readonly table: DataTable;
    }

    /**
     * Options to configure the modifier.
     */
    export interface Options extends JSON.Object {
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
