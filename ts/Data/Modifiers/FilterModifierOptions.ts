/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
    operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';
    columnName: string;
    value: DataTable.CellType;
}

/**
 * Condition that uses string comparison operators.
 */
export interface StringCondition {
    operator: 'contains' | 'startsWith' | 'endsWith';
    columnName: string;
    ignoreCase?: boolean;
    value: string;
}

/**
 * Condition that combines multiple conditions with logical operators.
 */
export interface LogicalMultipleCondition {
    operator: 'and' | 'or';
    conditions: FilterCondition[]
}

/**
 * Condition that transforms a single condition with a logical operator.
 */
export interface LogicalSingleCondition {
    operator: 'not';
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
