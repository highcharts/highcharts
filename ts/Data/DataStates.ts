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

class DataStates {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        this.listenerMap = {};
        this.stateMap = {};
        this.tableMap = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Contains listeners of states on tables.
     */
    public listenerMap: DataStates.ListenerMap;

    /**
     * Contains lasting states that are kept over multiple changes.
     */
    public stateMap: DataStates.StateMap;

    /**
     * Contains tables that emit states on positions.
     */
    public tableMap: DataStates.TableMap;

    /* *
     *
     *  Functions
     *
     * */

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

    public addTable(
        table: DataTable
    ): this {

        this.tableMap[table.id] = table;

        return this;
    }

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

    public removeTable(
        table: DataTable
    ): this;
    public removeTable(
        tableId: string
    ): this;
    public removeTable(
        tableOrId: (DataTable|string)
    ): this {

        if (typeof tableOrId === 'object') {
            tableOrId = tableOrId.id;
        }

        delete this.tableMap[tableOrId];

        return this;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

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
