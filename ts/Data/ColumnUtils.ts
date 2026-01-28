/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


/* *
*
*  Imports
*
* */

import type {
    CellType as DataTableCellType,
    Column as DataTableColumn
} from './DataTable';
import type Types from '../Shared/Types';


/**
 * Utility functions for columns that can be either arrays or typed arrays.
 * @private
 */

/* *
*
*  Declarations
*
* */

/**
 * Result of the `shift` function.
 */
export interface ShiftResult {
    value: DataTableCellType
    array: DataTableColumn
}

/**
 * Result of the `splice` function.
 */
export interface SpliceResult<T extends DataTableColumn> {
    removed: T
    array: T
}


/* *
*
* Functions
*
* */

/**
 * Sets the length of the column array.
 *
 * @param {DataTableColumn} column
 * Column to be modified.
 *
 * @param {number} length
 * New length of the column.
 *
 * @param {boolean} asSubarray
 * If column is a typed array, return a subarray instead of a new array. It
 * is faster `O(1)`, but the entire buffer will be kept in memory until all
 * views of it are destroyed. Default is `false`.
 *
 * @return {DataTableColumn}
 * Modified column.
 *
 * @private
 */
export function setLength(
    column: DataTableColumn,
    length: number,
    asSubarray?: boolean
): DataTableColumn {
    if (Array.isArray(column)) {
        column.length = length;
        return column;
    }

    return column[asSubarray ? 'subarray' : 'slice'](0, length);
}

/**
 * Splices a column array.
 *
 * @param {DataTableColumn} column
 * Column to be modified.
 *
 * @param {number} start
 * Index at which to start changing the array.
 *
 * @param {number} deleteCount
 * An integer indicating the number of old array elements to remove.
 *
 * @param {boolean} removedAsSubarray
 * If column is a typed array, return a subarray instead of a new array. It
 * is faster `O(1)`, but the entire buffer will be kept in memory until all
 * views to it are destroyed. Default is `true`.
 *
 * @param {Array<number>|TypedArray} items
 * The elements to add to the array, beginning at the start index. If you
 * don't specify any elements, `splice()` will only remove elements from the
 * array.
 *
 * @return {SpliceResult}
 * Object containing removed elements and the modified column.
 *
 * @private
 */
export function splice(
    column: DataTableColumn,
    start: number,
    deleteCount: number,
    removedAsSubarray?: boolean,
    items: DataTableCellType[]|Types.TypedArray = []
): SpliceResult<DataTableColumn> {
    if (Array.isArray(column)) {
        if (!Array.isArray(items)) {
            items = Array.from(items);
        }

        return {
            removed: column.splice(start, deleteCount, ...items),
            array: column
        };
    }

    const Constructor = Object.getPrototypeOf(column)
        .constructor as Types.TypedArrayConstructor;

    const removed = column[
        removedAsSubarray ? 'subarray' : 'slice'
    ](start, start + deleteCount);

    const newLength = column.length - deleteCount + items.length;
    const result = new Constructor(newLength);

    result.set(column.subarray(0, start), 0);
    result.set(items as (number[]|Types.TypedArray), start);
    result.set(column.subarray(start + deleteCount), start + items.length);

    return {
        removed: removed,
        array: result
    };
}

/**
 * Converts a cell value to a number.
 *
 * @param {DataTableCellType} value
 * Cell value to convert to a number.
 *
 * @param {boolean} useNaN
 * If `true`, returns `NaN` for non-numeric values; if `false`,
 * returns `null` instead.
 *
 * @return {number | null}
 * Number or `null` if the value is not a number.
 *
 * @private
 */
export function convertToNumber(
    value?: DataTableCellType,
    useNaN?: boolean
): number | null {
    switch (typeof value) {
        case 'boolean':
            return (value ? 1 : 0);
        case 'number':
            return (isNaN(value) && !useNaN ? null : value);
        default:
            value = parseFloat(`${value ?? ''}`);
            return (isNaN(value) && !useNaN ? null : value);
    }
}


/* *
 *
 *  Default Export
 *
 * */

const ColumnUtils = {
    convertToNumber,
    setLength,
    splice
};

export default ColumnUtils;
