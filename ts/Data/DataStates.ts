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
        this.emittingRegister = [];
        this.listenerMap = {};
        this.stateMap = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Contains arguments currently in use of an emitting loop.
     */
    private readonly emittingRegister: Array<string>;

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
     * @private
     */
    private buildEmittingTag(
        e: DataStates.Event
    ): string {
        return (
            e.cursor.type === 'position' ?
                [
                    e.table.id,
                    e.cursor.column,
                    e.cursor.row,
                    e.cursor.state,
                    e.cursor.type
                ] :
                [
                    e.table.id,
                    e.cursor.columns,
                    e.cursor.firstRow,
                    e.cursor.lastRow,
                    e.cursor.state,
                    e.cursor.type
                ]
        ).join('\0');
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
        const tableId = table.id,
            state = cursor.state,
            listeners = (
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

                if (DataStates.getIndex(cursor, cursors) === -1) {
                    cursors.push(cursor);
                }
            }

            const e: DataStates.Event = {
                cursor,
                cursors: cursors || [],
                states: this,
                table
            };

            if (event) {
                e.event = event;
            }

            const emittingRegister = this.emittingRegister,
                emittingTag = this.buildEmittingTag(e);

            if (emittingRegister.indexOf(emittingTag) >= 0) {
                // break call stack loops
                return this;
            }

            try {
                this.emittingRegister.push(emittingTag);

                for (let i = 0, iEnd = listeners.length; i < iEnd; ++i) {
                    listeners[i].call(this, e);
                }
            } finally {
                const index = this.emittingRegister.indexOf(emittingTag);

                if (index >= 0) {
                    this.emittingRegister.splice(index, 1);
                }
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
     * ID of the related cursor table.
     *
     * @param {Data.DataStates.Cursor} cursor
     * Copy or reference of the cursor.
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
            const index = DataStates.getIndex(cursor, cursors);

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
    }

    export interface CursorRange {
        type: 'range';
        columns?: Array<string>;
        firstRow: number;
        lastRow: number;
        state: State;
    }

    export interface Event {
        event?: globalThis.Event;
        cursor: Cursor;
        cursors: Array<Cursor>;
        states: DataStates;
        table: DataTable;
    }

    export type Listener = (this: DataStates, e: Event) => void;

    export type ListenerMap = Record<TableId, Record<State, Array<Listener>>>;

    export type State = string;

    export type StateMap = Record<TableId, Record<State, Array<Cursor>>>;

    export type TableId = string;

    export type TableMap = Record<TableId, DataTable>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Finds the index of an cursor in an array.
     * @private
     */
    export function getIndex(
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

    /**
     * Checks whether two cursor share the same properties.
     * @private
     */
    export function isEqual(
        cursorA: Cursor,
        cursorB: Cursor
    ): boolean {
        if (cursorA.type === 'position' && cursorB.type === 'position') {
            return (
                cursorA.column === cursorB.column &&
                cursorA.row === cursorB.row &&
                cursorA.state === cursorB.state
            );
        }
        if (cursorA.type === 'range' && cursorB.type === 'range') {
            return (
                (
                    JSON.stringify(cursorA.columns) ===
                    JSON.stringify(cursorB.columns)
                ) &&
                cursorA.firstRow === cursorB.firstRow &&
                cursorA.lastRow === cursorB.lastRow
            );
        }
        return false;
    }

    /**
     * Checks whether a cursor is in a range.
     * @private
     */
    export function isInRange(
        needle: Cursor,
        range: Cursor
    ): boolean {

        if (range.type === 'position') {
            range = toRange(range);
        }

        if (needle.type === 'position') {
            needle = toRange(needle, range);
        }

        const needleColumns = needle.columns;
        const rangeColumns = range.columns;

        return (
            needle.firstRow >= range.firstRow &&
            needle.lastRow <= range.lastRow &&
            (
                !needleColumns ||
                !rangeColumns ||
                needleColumns.every(
                    (column): boolean => rangeColumns.indexOf(column) >= 0
                )
            )
        );
    }

    /**
     * @private
     */
    export function toPositions(
        cursor: Cursor
    ): Array<CursorPosition> {

        if (cursor.type === 'position') {
            return [cursor];
        }

        const columns = (cursor.columns || []);
        const positions: Array<CursorPosition> = [];
        const state = cursor.state;

        for (
            let row = cursor.firstRow,
                rowEnd = cursor.lastRow;
            row < rowEnd;
            ++row
        ) {

            if (!columns.length) {
                positions.push({
                    type: 'position',
                    row,
                    state
                });
                continue;
            }

            for (
                let column = 0,
                    columnEnd = columns.length;
                column < columnEnd;
                ++column
            ) {
                positions.push({
                    type: 'position',
                    column: columns[column],
                    row,
                    state
                });
            }
        }

        return positions;
    }

    /**
     * @private
     */
    export function toRange(
        cursor: Cursor,
        defaultRange?: CursorRange
    ): CursorRange {

        if (cursor.type === 'range') {
            return cursor;
        }

        const range: CursorRange = {
            type: 'range',
            firstRow: (
                cursor.row ??
                (defaultRange && defaultRange.firstRow) ??
                0
            ),
            lastRow: (
                cursor.row ??
                (defaultRange && defaultRange.lastRow) ??
                Number.MAX_VALUE
            ),
            state: cursor.state
        };

        if (typeof cursor.column !== 'undefined') {
            range.columns = [cursor.column];
        }

        return range;
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
