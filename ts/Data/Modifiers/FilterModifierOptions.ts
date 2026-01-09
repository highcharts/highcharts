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

import type DataModifierOptions from './DataModifierOptions';
import type DataTable from '../DataTable';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Condition that uses an universal comparison operators.
 */
export interface ComparisonCondition {
    /**
     * Type of the operator used in the condition, comparing the value of the
     * cell with the provided value.
     */
    operator: '==' | '!=' | '===' | '!==' | '>' | '>=' | '<' | '<=' | 'empty';

    /**
     * Name of the column to compare the value of the cell with.
     */
    columnId: string;

    /**
     * Value to compare the cell with.
     */
    value: DataTable.CellType;
}

/**
 * Condition that uses string comparison operators.
 */
export interface StringCondition {
    /**
     * Type of the operator used in the condition, comparing the value of the
     * cell with the provided value. Non-string values are converted to
     * strings before comparison.
     */
    operator: 'contains' | 'startsWith' | 'endsWith';

    /**
     * Name of the column to compare the value of the cell with.
     */
    columnId: string;

    /**
     * Whether the comparison should ignore case.
     * @default true
     */
    ignoreCase?: boolean;

    /**
     * Value to compare the cell with.
     */
    value: string;
}

/**
 * Condition that combines multiple conditions with logical operators.
 */
export interface LogicalMultipleCondition {
    /**
     * Type of the operator used to combine the conditions.
     */
    operator: 'and' | 'or';

    /**
     * Array of conditions that are combined with the logical operator.
     */
    conditions: FilterCondition[]
}

/**
 * Condition that transforms a single condition with a logical operator.
 */
export interface LogicalSingleCondition {
    /**
     * Type of the operator used to transform the condition.
     */
    operator: 'not';

    /**
     * Condition that is transformed by the logical operator.
     */
    condition: FilterCondition;
}

/**
 * Callback condition that is used to filter rows in a table.
 *
 * @param row
 * Row object to check.
 *
 * @param table
 * Data table that the row belongs to.
 *
 * @param rowIndex
 * Index of the row in the table.
 */
export type CallbackCondition = (
    row: DataTable.RowObject,
    table: DataTable,
    rowIndex: number
) => boolean;

/**
 * Serializable condition that can be used to filter rows in a table.
 */
export type SerializableCondition =
    ComparisonCondition |
    StringCondition |
    LogicalSingleCondition |
    LogicalMultipleCondition;

/**
 * Type of the operator used in a filter condition.
 */
export type FilterOperator = SerializableCondition['operator'];

/**
 * Type of the value used in a filter condition.
 */
export type FilterCondition = CallbackCondition | SerializableCondition;

/**
 * Options to configure the modifier.
 */
export interface FilterModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Filter';

    /**
     * Condition that must be met for a row to be included in the modified
     * table.
     */
    condition?: FilterCondition;

}


/* *
 *
 *  Default Export
 *
 * */

export default FilterModifierOptions;
