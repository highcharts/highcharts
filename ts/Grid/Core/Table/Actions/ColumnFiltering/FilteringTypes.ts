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
export type StringCondition =
    | 'contains'
    | 'doesNotContain'
    | 'equals'
    | 'doesNotEqual'
    | 'beginsWith'
    | 'endsWith'
    | 'empty'
    | 'notEmpty';

/**
 * Number filtering conditions.
 */
export type NumberCondition =
    | 'equals'
    | 'doesNotEqual'
    | 'greaterThan'
    | 'greaterThanOrEqualTo'
    | 'lessThan'
    | 'lessThanOrEqualTo'
    | 'empty'
    | 'notEmpty';

/**
 * DateTime filtering conditions.
 */
export type DateTimeCondition =
    | 'equals'
    | 'doesNotEqual'
    | 'before'
    | 'after'
    | 'empty'
    | 'notEmpty';

/**
 * The options for the boolean select.
 */
export type BooleanSelectOptions = 'all' | 'true' | 'false' | 'empty';

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
export type Condition = StringCondition | NumberCondition | DateTimeCondition;

/**
 * Corresponding values for the boolean select options.
 */
export const booleanValueMap: Record<
    BooleanSelectOptions,
    'all' | boolean | null
> = {
    'all': 'all',
    'true': true,
    'false': false,
    empty: null
} as const;

/**
 * String conditions values for the condition select options.
 */
export const stringConditions: StringCondition[] = [
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
export const numberConditions: NumberCondition[] = [
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
export const dateTimeConditions: DateTimeCondition[] = [
    'equals',
    'doesNotEqual',
    'before',
    'after',
    'empty',
    'notEmpty'
] as const;

/**
 * Conditions map for the condition select options.
 */
export const conditionsMap = {
    string: stringConditions,
    number: numberConditions,
    datetime: dateTimeConditions
} as const;
