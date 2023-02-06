/* *
 *
 *  (c) 2020-2023 Highsoft AS
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

import type DataTable from './DataTable';

/* *
 *
 *  Class
 *
 * */

/**
 * This class manages state cursors pointing on {@link Data.DataTable}. It
 * creates a relation between states of the user interface and the table cells,
 * columns, or rows.
 *
 * @class
 * @name Data.DataStates
 */
class DataStates {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        this.listenerMap = {};
        this.stateMap = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Contains listeners of states on tables.
     */
    public readonly listenerMap: DataStates.ListenerMap;

    /**
     * Contains lasting states that are kept over multiple changes.
     */
    public readonly stateMap: DataStates.StateMap;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * This function registers a listener for a specific state and table.
     *
     * @example
     * ```TypeScript
     * dataStates.addListener(myTable.id, 'hover', (e: DataStates.Event) => {
     *     if (
     *         e.cursor.tableScope === 'modified' &&
     *         e.cursor.type === 'position'
     *     ) {
     *         console.log(`Hover over row #${e.cursor.row}.`);
     *     }
     * });
     * ```
     *
     * @function #addListener
     *
     * @param {Data.DataStates.TableId} tableId
     * The ID of the table to listen to.
     *
     * @param {Data.DataStates.State} state
     * The state on the table to listen to.
     *
     * @param {Data.DataStates.Listener} listener
     * The listener to register.
     *
     * @return {Data.DataStates}
     * Returns the DataStates instance for a call chain.
     */
    public addListener(
        tableId: DataStates.TableId,
        state: DataStates.State,
        listener: DataStates.Listener
    ): this {
        const listenerMap = this.listenerMap[tableId] = (
            this.listenerMap[tableId] ||
            {}
        );
        const listeners = listenerMap[state] = (
            listenerMap[state] ||
            []
        );

        listeners.push(listener);

        return this;
    }

    /**
     * This function emits a state cursor related to a table. It will provide
     * lasting state cursors of the table to listeners.
     *
     * @example
     * ```TypeScript
     * dataStates.emit(myTable, {
     *     type: 'position',
     *     column: 'city',
     *     row: 4,
     *     state: 'hover',
     *     tableScope: 'modified'
     * });
     * ```
     *
     * @function #emitCursor
     *
     * @param {Data.DataTable} table
     * The related table of the cursor.
     *
     * @param {Data.DataStates.Cursor} cursor
     * The state cursor to emit.
     *
     * @param {Event} [event]
     * Optional event information from a related source.
     *
     * @param {boolean} [lasting]
     * Whether this state cursor should be kept until it is cleared with
     * {@link DataStates#remitCursor}.
     *
     * @return {Data.DataStates}
     * Returns the DataStates instance for a call chain.
     */
    public emitCursor(
        table: DataTable,
        cursor: DataStates.Cursor,
        event?: Event,
        lasting?: boolean
    ): this {
        const tableId = table.id;
        const state = cursor.state;
        const listeners = (
            this.listenerMap[tableId] &&
            this.listenerMap[tableId][state]
        );

        if (listeners) {
            const stateMap = this.stateMap[tableId] = (
                this.stateMap[tableId] ||
                {}
            );

            let cursors = stateMap[cursor.state];

            if (lasting) {

                if (!cursors) {
                    cursors = stateMap[cursor.state] = [];
                }

                cursors.push(cursor);
            }

            const e: DataStates.Event = {
                cursor,
                cursors: cursors || [],
                event,
                table
            };

            for (let i = 0, iEnd = listeners.length; i < iEnd; ++i) {
                listeners[i].call(this, e);
            }
        }

        return this;
    }

    /**
     * Removes a lasting state cursor.
     *
     * @function #remitCursor
     *
     * @param {string} tableId
     * The related table of the cursor.
     *
     * @param {Data.DataStates.Cursor} cursor
     * The copy or reference of the cursor.
     *
     * @return {Data.DataStates}
     * Returns the DataStates instance for a call chain.
     */
    public remitCursor(
        tableId: string,
        cursor: DataStates.Cursor
    ): this {
        const cursors = (
            this.stateMap[tableId] &&
            this.stateMap[tableId][cursor.state]
        );

        if (cursors) {
            const index = DataStates.getIndexOfCursor(cursor, cursors);

            if (index >= 0) {
                cursors.splice(index, 1);
            }
        }

        return this;
    }

    /**
     * This function removes a listener.
     *
     * @function #addListener
     *
     * @param {Data.DataStates.TableId} tableId
     * The ID of the table the listener is connected to.
     *
     * @param {Data.DataStates.State} state
     * The state on the table the listener is listening to.
     *
     * @param {Data.DataStates.Listener} listener
     * The listener to deregister.
     *
     * @return {Data.DataStates}
     * Returns the DataStates instance for a call chain.
     */
    public removeListener(
        tableId: DataStates.TableId,
        state: DataStates.State,
        listener: DataStates.Listener
    ): this {
        const listeners = (
            this.listenerMap[tableId] &&
            this.listenerMap[tableId][state]
        );

        if (listeners) {
            const index = listeners.indexOf(listener);

            if (index) {
                listeners.splice(index, 1);
            }
        }

        return this;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * @class Data.DataStates
 */
namespace DataStates {

    /* *
     *
     *  Declarations
     *
     * */

    export type Cursor = (
        | CursorPosition
        | CursorRange
    );

    export interface CursorPosition {
        type: 'position';
        column?: string;
        row?: number;
        state: State;
        tableScope: TableScope;
    }

    export interface CursorRange {
        type: 'range';
        columns?: Array<string>;
        firstRow: number;
        lastRow: number;
        state: State;
        tableScope: TableScope;
    }

    export interface Event {
        event?: globalThis.Event;
        cursor: Cursor;
        cursors: Array<Cursor>;
        table: DataTable;
    }

    export type Listener = (this: DataStates, e: Event) => void;

    export type ListenerMap = Record<TableId, Record<State, Array<Listener>>>;

    export type State = string;

    export type StateMap = Record<TableId, Record<State, Array<Cursor>>>;

    export type TableId = string;

    export type TableMap = Record<TableId, DataTable>;

    export type TableScope = (
        | 'original'
        | 'modified'
    );

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Finds the index of an cursor in an array.
     * @private
     */
    export function getIndexOfCursor(
        needle: DataStates.Cursor,
        cursors: Array<DataStates.Cursor>
    ): number {

        if (needle.type === 'position') {
            for (let cursor, i = 0, iEnd = cursors.length; i < iEnd; ++i) {
                cursor = cursors[i];

                if (
                    cursor.type === 'position' &&
                    cursor.state === needle.state &&
                    cursor.column === needle.column &&
                    cursor.row === needle.row
                ) {
                    return i;
                }
            }
        } else {
            const columnNeedle = JSON.stringify(needle.columns);

            for (let cursor, i = 0, iEnd = cursors.length; i < iEnd; ++i) {
                cursor = cursors[i];

                if (
                    cursor.type === 'range' &&
                    cursor.state === needle.state &&
                    cursor.firstRow === needle.firstRow &&
                    cursor.lastRow === needle.lastRow &&
                    JSON.stringify(cursor.columns) === columnNeedle
                ) {
                    return i;
                }
            }
        }

        return -1;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataStates;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @typedef {
 *     Data.DataState.CursorPosition|
 *     Data.DataState.CursorRange
 * } Data.DataState.Cursor
 */

/**
 * @interface Data.DataState.CursorPosition
 */
/**
 * @name Data.DataState.CursorPosition#type
 * @type {'position'}
 */
/**
 * @name Data.DataState.CursorPosition#column
 * @type {string|undefined}
 */
/**
 * @name Data.DataState.CursorPosition#row
 * @type {number|undefined}
 */
/**
 * @name Data.DataState.CursorPosition#state
 * @type {string}
 */
/**
 * @name Data.DataState.CursorPosition#tableScope
 * @type {'original'|'modified'}
 */

/**
 * @interface Data.DataState.CursorRange
 */
/**
 * @name Data.DataState.CursorRange#type
 * @type {'range'}
 */
/**
 * @name Data.DataState.CursorRange#columns
 * @type {Array<string>|undefined}
 */
/**
 * @name Data.DataState.CursorRange#firstRow
 * @type {number}
 */
/**
 * @name Data.DataState.CursorRange#lastRow
 * @type {number}
 */
/**
 * @name Data.DataState.CursorRange#state
 * @type {string}
 */
/**
 * @name Data.DataState.CursorRange#tableScope
 * @type {'original'|'modified'}
 */

'';
