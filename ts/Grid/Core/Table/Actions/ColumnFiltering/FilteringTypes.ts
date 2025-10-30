/* *
 *
 *  Grid Filtering Types and Constants
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Column from '../../Column';

/* *
 *
 *  Types and Constants
 *
 * */

/**
 * String filtering conditions.
 */
export type StringCondition = typeof stringConditions[number];

/**
 * Number filtering conditions.
 */
export type NumberCondition = typeof numberConditions[number];

/**
 * DateTime filtering conditions.
 */
export type DateTimeCondition = typeof dateTimeConditions[number];

/**
 * Boolean filtering conditions.
 */
export type BooleanCondition = typeof booleanConditions[number];

/**
 * The event object for the 'afterRender' event.
 */
export type AfterRenderEvent = Event & {
    column: Column;
    filtering: boolean;
};

/**
 * Combined filtering conditions.
 */
export type Condition =
    StringCondition | NumberCondition | DateTimeCondition | BooleanCondition;

/**
 * String conditions values for the condition select options.
 */
export const stringConditions = [
    'contains',
    'doesNotContain',
    'equals',
    'doesNotEqual',
    'beginsWith',
    'endsWith',
    'empty',
    'notEmpty'
] as const;

/**
 * Number conditions values for the condition select options.
 */
export const numberConditions = [
    'equals',
    'doesNotEqual',
    'greaterThan',
    'greaterThanOrEqualTo',
    'lessThan',
    'lessThanOrEqualTo',
    'empty',
    'notEmpty'
] as const;

/**
 * DateTime conditions values for the condition select options.
 */
export const dateTimeConditions = [
    'equals',
    'doesNotEqual',
    'before',
    'after',
    'empty',
    'notEmpty'
] as const;

/**
 * Boolean conditions values for the condition select options.
 */
export const booleanConditions = [
    'all',
    'true',
    'false',
    'empty'
] as const;

/**
 * Corresponding values for the boolean select options.
 */
export const booleanValueMap: Record<
    BooleanCondition,
    'all' | boolean | null
> = {
    'all': 'all',
    'true': true,
    'false': false,
    'empty': null
} as const;

/**
 * Conditions map for the condition select options.
 */
export const conditionsMap: Record<Column.DataType, readonly Condition[]> = {
    string: stringConditions,
    number: numberConditions,
    datetime: dateTimeConditions,
    'boolean': booleanConditions
} as const;
