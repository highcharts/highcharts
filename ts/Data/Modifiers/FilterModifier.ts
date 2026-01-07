/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from '../DataEvent';
import type {
    CallbackCondition,
    FilterCondition,
    FilterModifierOptions
} from './FilterModifierOptions';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    isFunction,
    merge
} = U;


/* *
 *
 *  Class
 *
 * */


/**
 * Filters out table rows matching a given condition.
 */
class FilterModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the filter modifier.
     */
    public static readonly defaultOptions: FilterModifierOptions = {
        type: 'Filter'
    };


    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Compiles a filter condition into a callback function.
     *
     * @param {FilterCondition} condition
     * Condition to compile.
     */
    private static compile(condition: FilterCondition): CallbackCondition {
        if (isFunction(condition)) {
            return condition;
        }

        const op = condition.operator;
        switch (op) {
            case 'and': {
                const subs = condition.conditions.map(
                    (c): CallbackCondition => this.compile(c)
                );
                return (row, table, i): boolean => subs.every(
                    (cond): boolean => cond(row, table, i)
                );
            }
            case 'or': {
                const subs = condition.conditions.map(
                    (c): CallbackCondition => this.compile(c)
                );
                return (row, table, i): boolean => subs.some(
                    (cond): boolean => cond(row, table, i)
                );
            }
            case 'not': {
                const sub = this.compile(condition.condition);
                return (row, table, i): boolean => !sub(row, table, i);
            }
        }

        const { columnId: col, value } = condition;
        switch (op) {
            case '==':
                // eslint-disable-next-line eqeqeq
                return (row): boolean => row[col] == value;
            case '===':
                return (row): boolean => row[col] === value;
            case '!=':
                // eslint-disable-next-line eqeqeq
                return (row): boolean => row[col] != value;
            case '!==':
                return (row): boolean => row[col] !== value;
            case '>':
                return (row): boolean => (row[col] || 0) > (value || 0);
            case '>=':
                return (row): boolean => (row[col] || 0) >= (value || 0);
            case '<':
                return (row): boolean => (row[col] || 0) < (value || 0);
            case '<=':
                return (row): boolean => (row[col] || 0) <= (value || 0);
            case 'empty':
                return (row): boolean => row[col] === null || row[col] === '';
        }

        const { ignoreCase } = condition;
        const str = (val: DataTable.CellType): string => {
            const s = '' + val;
            return (ignoreCase ?? true) ? s.toLowerCase() : s;
        };

        switch (op) {
            case 'contains':
                return (row): boolean => str(row[col]).includes(str(value));
            default:
                return (row): boolean => str(row[col])[op](str(value));
        }
    }


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the filter modifier.
     *
     * @param {Partial<FilterModifier.Options>} [options]
     * Options to configure the filter modifier.
     */
    public constructor(
        options?: Partial<FilterModifierOptions>
    ) {
        super();

        this.options = merge(FilterModifier.defaultOptions, options);
    }


    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the filter modifier.
     */
    public readonly options: FilterModifierOptions;


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Filters out table rows matching a given condition. If the given table
     * does not have defined a `modified` property, the filtering is applied
     * in-place on the original table rather than on a `modified` copy.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference or modified table, if
     * `modified` property of the original table is undefined.
     */
    public override modifyTable(
        table: DataTable,
        eventDetail?: DataEvent.Detail
    ): DataTable {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const { condition } = modifier.options;
        if (!condition) {
            // If no condition is set, return the unmodified table.
            return table;
        }

        const matchRow = FilterModifier.compile(condition);

        const modified = table.getModified();

        const rows: DataTable.RowObject[] = [];
        const indexes: Array<number|undefined> = [];

        for (
            let i = 0,
                iEnd = table.getRowCount();
            i < iEnd;
            ++i
        ) {
            const row = table.getRowObject(i);
            if (!row) {
                continue;
            }

            if (matchRow(row, table, i)) {
                rows.push(row);
                indexes.push(table.getOriginalRowIndex(i));
            }
        }

        modified.deleteRows();
        modified.setRows(rows);
        modified.setOriginalRowIndexes(indexes);

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }
}


/* *
 *
 *  Registry
 *
 * */


declare module './DataModifierType' {
    interface DataModifierTypes {
        Filter: typeof FilterModifier;
    }
}

DataModifier.registerType('Filter', FilterModifier);


/* *
 *
 *  Default Export
 *
 * */


export default FilterModifier;
