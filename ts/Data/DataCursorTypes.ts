/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Kamil Kubik
 *
 * */


/* *
 *
 *  Imports
 *
 * */

import type DataCursor from './DataCursor';
import type DataTable from './DataTable';

/* *
 *
 *  Declarations
 *
 * */

export type DataCursorType = (
  | DataCursorPosition
  | DataCursorRange
);

export interface DataCursorPosition {
    type: 'position';
    column?: string;
    row?: number;
    state: DataCursorState;
    sourceId?: string;
}

export interface DataCursorRange {
    type: 'range';
    columns?: Array<string>;
    firstRow: number;
    lastRow: number;
    state: DataCursorState;
    sourceId?: string;
}

export interface DataCursorEvent {
    cursor: DataCursorType;
    cursors: Array<DataCursorType>;
    event?: globalThis.Event;
    table: DataTable;
}

export type DataCursorListener = (this: DataCursor, e: DataCursorEvent) => void;

export type DataCursorListenerMap = Record<
    DataCursorTableId, Record<DataCursorState, Array<DataCursorListener>>
>;

export type DataCursorState = string;

export type DataCursorStateMap = Record<
    DataCursorTableId, Record<DataCursorState, Array<DataCursorType>>
>;

export type DataCursorTableId = string;

export type DataCursorTableMap = Record<DataCursorTableId, DataTable>;


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
    needle: DataCursorType,
    cursors: Array<DataCursorType>
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
    cursorA: DataCursorType,
    cursorB: DataCursorType
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
    needle: DataCursorType,
    range: DataCursorType
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
    cursor: DataCursorType
): Array<DataCursorPosition> {

    if (cursor.type === 'position') {
        return [cursor];
    }

    const columns = (cursor.columns || []);
    const positions: Array<DataCursorPosition> = [];
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
    cursor: DataCursorType,
    defaultRange?: DataCursorRange
): DataCursorRange {

    if (cursor.type === 'range') {
        return cursor;
    }

    const range: DataCursorRange = {
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
