/* *
 *
 *  Grid Filtering Types and Constants
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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

import type { ColumnDataType } from '../../Column';

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
 * DateTime filtering conditions (same operators as number).
 */
export type DateTimeCondition = NumberCondition;

/**
 * Boolean filtering conditions.
 */
export type BooleanCondition = typeof booleanConditions[number];

/**
 * The event object for the 'afterRender' event.
 */
export type AfterRenderEvent = Event & {
    column: ColumnDataType;
    filtering: boolean;
};

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
    'greaterThan',
    'greaterThanOrEqualTo',
    'lessThan',
    'lessThanOrEqualTo',
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
 * Legacy datetime operator aliases (`before` → `lessThan`, `after` → `greaterThan`).
 */
// TODO: Remove, deprecated
export const operatorAliases = {
    before: 'lessThan',
    after: 'greaterThan'
} as const;

/**
 * Combined filtering conditions.
 */
export type Condition =
    StringCondition | NumberCondition | BooleanCondition |
    keyof typeof operatorAliases; // TODO: Remove, deprecated

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
export const conditionsMap: Record<ColumnDataType, readonly Condition[]> = {
    string: stringConditions,
    number: numberConditions,
    datetime: dateTimeConditions,
    'boolean': booleanConditions
} as const;
