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
 *  - Dawid Dragula
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { TypedArray } from '../Shared/Types';
import type DataEvent from './DataEvent';
import type DataTable from './DataTable';
import type DataModifier from './Modifiers/DataModifier';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to initialize a new DataTable instance.
 */
export interface DataTableOptions {

    /**
     * Initial columns with their values.
     */
    columns?: Record<string, Array<DataTableValue>|TypedArray>;

    /**
     * Custom ID to identify the new DataTable instance.
     */
    id?: string;

    /**
     * A reference to the specific data table key defined in the component's
     * connector options.
     */
    key?: string;

    /**
     * Metadata to describe the dataTable.
     */
    metadata?: Record<string, DataTableValue>;
}


export type DataTableValue = (boolean|null|number|string|undefined);

/**
 * Possible value types for a table cell.
 */
export type DataTableCellType = (boolean|number|null|string|undefined);

/**
 * Conventional array of table cells typed as `CellType`.
 */
export interface DataTableBasicColumn extends Array<DataTableCellType> {
    [index: number]: DataTableCellType;
}

/**
 * Array of table cells in vertical expansion.
 */
export type DataTableColumn = DataTableBasicColumn|TypedArray;

/**
 * Collection of columns, where the key is the column name and
 * the value is an array of column values.
 */
export interface DataTableColumnCollection {
    [columnId: string]: DataTableColumn;
}

/**
 * Event object for cell-related events.
 */
export interface DataTableCellEvent extends DataEvent {
    readonly type: (
            'setCell' | 'afterSetCell'
    );
    readonly cellValue: DataTableCellType;
    readonly columnId: string;
    readonly rowIndex: number;
}

/**
 * Event object for clone-related events.
 */
export interface DataTableCloneEvent extends DataEvent {
    readonly type: (
            'cloneTable' | 'afterCloneTable'
    );
    readonly tableClone?: DataTable;
}

/**
 * Event object for column-related events.
 */
export interface DataTableColumnEvent extends DataEvent {
    readonly type: (
            'deleteColumns'|'afterDeleteColumns'|
            'setColumns'|'afterSetColumns'
    );
    readonly columns?: DataTableColumnCollection;
    readonly columnIds: Array<string>;
    readonly rowIndex?: number;
}

/**
 * All information objects of DataTable events.
 */
export type DataTableEvent = (
        DataTableCellEvent |
        DataTableCloneEvent |
        DataTableColumnEvent |
        DataTableSetModifierEvent |
        DataTableRowEvent
    );

/**
 * Event object for modifier-related events.
 */
export interface DataTableModifierEvent extends DataEvent {
    readonly type: (
            'setModifier' | 'afterSetModifier'
    );
    readonly modifier?: DataModifier;
}

/**
 * Array of table cells in horizontal expansion. Index of the array is the
 * index of the column names.
 */
export interface DataTableRow extends Array<DataTableCellType> {
    [index: number]: DataTableCellType;
}

/**
 * Event object for row-related events.
 */
export interface DataTableRowEvent extends DataEvent {
    readonly type: (
            'deleteRows'|'afterDeleteRows'|
            'setRows'|'afterSetRows'
    );
    readonly rowCount: number;
    readonly rowIndex: number | number[];
    readonly rows?: Array<DataTableRow|DataTableRowObject>;
}

/**
 * Object of row values, where the keys are the column names.
 */
export interface DataTableRowObject extends Record<string, DataTableCellType> {
    [column: string]: DataTableCellType;
}

/**
 * Event object for the setModifier events.
 */
export interface DataTableSetModifierEvent extends DataEvent {
    readonly type: (
            'setModifier' | 'afterSetModifier' |
            'setModifierError'
    );
    readonly error?: unknown;
    readonly modifier?: DataModifier;
    readonly modified?: DataTable;
}


/* *
 *
 *  Default Export
 *
 * */


export default DataTableOptions;
