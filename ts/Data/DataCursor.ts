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
 * @name Data.DataCursor
 */
class DataCursor {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        stateMap: DataCursor.StateMap = {}
    ) {
        this.emittingRegister = [];
        this.listenerMap = {};
        this.stateMap = stateMap;
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
    public readonly listenerMap: DataCursor.ListenerMap;

    /**
     * Contains lasting states that are kept over multiple changes.
     */
    public readonly stateMap: DataCursor.StateMap;

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
     * dataCursor.addListener(myTable.id, 'hover', (e: DataCursor.Event) => {
     *     if (e.cursor.type === 'position') {
     *         console.log(`Hover over row #${e.cursor.row}.`);
     *     }
     * });
     * ```
     *
     * @function #addListener
     *
     * @param {Data.DataCursor.TableId} tableId
     * The ID of the table to listen to.
     *
     * @param {Data.DataCursor.State} state
     * The state on the table to listen to.
     *
     * @param {Data.DataCursor.Listener} listener
     * The listener to register.
     *
     * @return {Data.DataCursor}
     * Returns the DataCursor instance for a call chain.
     */
    public addListener(
        tableId: DataCursor.TableId,
        state: DataCursor.State,
        listener: DataCursor.Listener
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
        e: DataCursor.Event
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
     * dataCursor.emit(myTable, {
     *     type: 'position',
     *     column: 'city',
     *     row: 4,
     *     state: 'hover',
     * });
     * ```
     *
     * @param {Data.DataTable} table
     * The related table of the cursor.
     *
     * @param {Data.DataCursor.Type} cursor
     * The state cursor to emit.
     *
     * @param {Event} [event]
     * Optional event information from a related source.
     *
     * @param {boolean} [lasting]
     * Whether this state cursor should be kept until it is cleared with
     * {@link DataCursor#remitCursor}.
     *
     * @return {Data.DataCursor}
     * Returns the DataCursor instance for a call chain.
     */
    public emitCursor(
        table: DataTable,
        cursor: DataCursor.Type,
        event?: Event,
        lasting?: boolean
    ): this;

    /**
     * @param {Data.DataTable} table
     * The related table of the cursor.
     *
     * @param {string} group
     * The related group on the table.
     *
     * @param {Data.DataCursor.Type} cursor
     * The state cursor to emit.
     *
     * @param {Event} [event]
     * Optional event information from a related source.
     *
     * @param {boolean} [lasting]
     * Whether this state cursor should be kept until it is cleared with
     * {@link DataCursor#remitCursor}.
     *
     * @return {Data.DataCursor}
     * Returns the DataCursor instance for a call chain.
     */
    public emitCursor(
        table: DataTable,
        group: string,
        cursor: DataCursor.Type,
        event?: Event,
        lasting?: boolean
    ): this;

    // Implementation
    public emitCursor(
        table: DataTable,
        groupOrCursor: (string|DataCursor.Type),
        cursorOrEvent?: (DataCursor.Type|Event),
        eventOrLasting?: (Event|boolean),
        lasting?: boolean
    ): this {
        const cursor = (
                typeof groupOrCursor === 'object' ?
                    groupOrCursor :
                    cursorOrEvent as DataCursor.Type
            ),
            event = (
                typeof eventOrLasting === 'object' ?
                    eventOrLasting :
                    cursorOrEvent as Event
            ),
            group = (
                typeof groupOrCursor === 'string' ?
                    groupOrCursor :
                    void 0
            ),
            tableId = table.id,
            state = cursor.state,
            listeners = (
                this.listenerMap[tableId] &&
                this.listenerMap[tableId][state]
            );

        lasting = (lasting || eventOrLasting === true);

        if (listeners) {
            const stateMap = this.stateMap[tableId] = (
                this.stateMap[tableId] ||
                {}
            );

            const cursors = stateMap[cursor.state] || [];

            if (lasting) {

                if (!cursors.length) {
                    stateMap[cursor.state] = cursors;
                }

                if (DataCursor.getIndex(cursor, cursors) === -1) {
                    cursors.push(cursor);
                }
            }

            const e: DataCursor.Event = {
                cursor,
                cursors,
                table
            };

            if (event) {
                e.event = event;
            }

            if (group) {
                e.group = group;
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
     * @param {Data.DataCursor.Type} cursor
     * Copy or reference of the cursor.
     *
     * @return {Data.DataCursor}
     * Returns the DataCursor instance for a call chain.
     */
    public remitCursor(
        tableId: string,
        cursor: DataCursor.Type
    ): this {
        const cursors = (
            this.stateMap[tableId] &&
            this.stateMap[tableId][cursor.state]
        );

        if (cursors) {
            const index = DataCursor.getIndex(cursor, cursors);

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
     * @param {Data.DataCursor.TableId} tableId
     * The ID of the table the listener is connected to.
     *
     * @param {Data.DataCursor.State} state
     * The state on the table the listener is listening to.
     *
     * @param {Data.DataCursor.Listener} listener
     * The listener to deregister.
     *
     * @return {Data.DataCursor}
     * Returns the DataCursor instance for a call chain.
     */
    public removeListener(
        tableId: DataCursor.TableId,
        state: DataCursor.State,
        listener: DataCursor.Listener
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
 * @class Data.DataCursor
 */
namespace DataCursor {

    /* *
     *
     *  Declarations
     *
     * */

    export type Type = (
        | Position
        | Range
    );

    export interface Position {
        type: 'position';
        column?: string;
        row?: number;
        state: State;
    }

    export interface Range {
        type: 'range';
        columns?: Array<string>;
        firstRow: number;
        lastRow: number;
        state: State;
    }

    export interface Event {
        cursor: Type;
        cursors: Array<Type>;
        event?: globalThis.Event;
        group?: string;
        table: DataTable;
    }

    export type Listener = (this: DataCursor, e: Event) => void;

    export type ListenerMap = Record<TableId, Record<State, Array<Listener>>>;

    export type State = string;

    export type StateMap = Record<TableId, Record<State, Array<Type>>>;

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
        needle: DataCursor.Type,
        cursors: Array<DataCursor.Type>
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
        cursorA: Type,
        cursorB: Type
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
                cursorA.firstRow === cursorB.firstRow &&
                cursorA.lastRow === cursorB.lastRow &&
                (
                    JSON.stringify(cursorA.columns) ===
                    JSON.stringify(cursorB.columns)
                )
            );
        }
        return false;
    }

    /**
     * Checks whether a cursor is in a range.
     * @private
     */
    export function isInRange(
        needle: Type,
        range: Type
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
        cursor: Type
    ): Array<Position> {

        if (cursor.type === 'position') {
            return [cursor];
        }

        const columns = (cursor.columns || []);
        const positions: Array<Position> = [];
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
        cursor: Type,
        defaultRange?: Range
    ): Range {

        if (cursor.type === 'range') {
            return cursor;
        }

        const range: Range = {
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

export default DataCursor;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @typedef {
 *     Data.DataCursor.Position|
 *     Data.DataCursor.Range
 * } Data.DataCursor.Type
 */

/**
 * @interface Data.DataCursor.Position
 */
/**
 * @name Data.DataCursor.Position#type
 * @type {'position'}
 */
/**
 * @name Data.DataCursor.Position#column
 * @type {string|undefined}
 */
/**
 * @name Data.DataCursor.Position#row
 * @type {number|undefined}
 */
/**
 * @name Data.DataCursor.Position#state
 * @type {string}
 */
/**
 * @name Data.DataCursor.Position#tableScope
 * @type {'original'|'modified'}
 */

/**
 * @interface Data.DataCursor.Range
 */
/**
 * @name Data.DataCursor.Range#type
 * @type {'range'}
 */
/**
 * @name Data.DataCursor.Range#columns
 * @type {Array<string>|undefined}
 */
/**
 * @name Data.DataCursor.Range#firstRow
 * @type {number}
 */
/**
 * @name Data.DataCursor.Range#lastRow
 * @type {number}
 */
/**
 * @name Data.DataCursor.Range#state
 * @type {string}
 */
/**
 * @name Data.DataCursor.Range#tableScope
 * @type {'original'|'modified'}
 */

'';
