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

import type {
    FilterModifierOptions,
    LogicalMultipleCondition
} from '../../../../Data/Modifiers/FilterModifierOptions';

import U from '../../../../Core/Utilities.js';
const { defined } = U;


/* *
*
*  Namespace
*
* */
namespace NavigatorSyncUtils {

    /* *
    *
    *  Utility Functions
    *
    * */


    /**
     * Adds or updates range options for a specific column.
     * @param filterOptions Filter modifier options object reference.
     * @param column Column name.
     * @param minValue Minimum value.
     * @param maxValue Maximum value.
     * @internal
     */
    export function setRangeOptions(
        filterOptions: FilterModifierOptions,
        column: string,
        minValue: (boolean | number | string),
        maxValue: (boolean | number | string)
    ): void {
        let changedMin = false;
        let changedMax = false;

        if (
            typeof filterOptions.condition !== 'object' ||
            filterOptions.condition.operator !== 'and'
        ) {
            filterOptions.condition = {
                operator: 'and',
                conditions: []
            };
        }

        const { conditions } = filterOptions.condition;

        for (let i = 0, iEnd = conditions.length; i < iEnd; ++i) {
            const condition = conditions[i];
            if (
                !condition ||
                typeof condition !== 'object' ||
                !(condition.operator === '<=' || condition.operator === '>=') ||
                condition.columnId !== column
            ) {
                continue;
            }

            if (condition.operator === '<=') {
                condition.value = maxValue;
                changedMax = true;
            } else {
                condition.value = minValue;
                changedMin = true;
            }

            if (changedMin && changedMax) {
                return;
            }
        }

        if (!changedMax) {
            conditions.push({
                operator: '<=',
                columnId: column,
                value: maxValue
            });
        }

        if (!changedMin) {
            conditions.push({
                operator: '>=',
                columnId: column,
                value: minValue
            });
        }
    }


    /**
     * Removes range options for a specific column.
     * @param filterOptions Filter modifier options object reference.
     * @param column Column name.
     * @internal
     */
    export function unsetRangeOptions(
        filterOptions: FilterModifierOptions,
        column: string
    ): void {
        if (
            typeof filterOptions.condition !== 'object' ||
            filterOptions.condition.operator !== 'and'
        ) {
            return;
        }

        const { conditions } = filterOptions.condition;

        for (let i = 0, iEnd = conditions.length; i < iEnd; ++i) {
            const condition = conditions[i];

            if (
                !condition ||
                typeof condition !== 'object' ||
                !(condition.operator === '<=' || condition.operator === '>=') ||
                condition.columnId !== column
            ) {
                continue;
            }

            conditions.splice(i, 1)[0];
        }
    }

    /**
     * Converts filter options to ranges array.
     *
     * @param filterOptions
     * Filter modifier options object reference.
     */
    export function toRange(filterOptions: FilterModifierOptions): Range[] {
        const rangesMap: Record<string, Range> = {};

        if (
            typeof filterOptions.condition !== 'object' ||
            filterOptions.condition.operator !== 'and'
        ) {
            return [];
        }

        const { conditions } =
            filterOptions.condition as LogicalMultipleCondition;

        for (let i = 0, iEnd = conditions.length; i < iEnd; ++i) {
            const condition = conditions[i];

            if (
                !condition ||
                typeof condition !== 'object' ||
                !(condition.operator === '<=' || condition.operator === '>=') ||
                typeof condition.columnId !== 'string' ||
                !defined(condition.value)
            ) {
                continue;
            }

            const colName = condition.columnId;
            if (!rangesMap[colName]) {
                rangesMap[colName] = {
                    maxValue: Infinity,
                    minValue: -Infinity,
                    columnId: colName
                };
            }

            if (condition.operator === '<=') {
                rangesMap[colName].maxValue = condition.value;
            } else {
                rangesMap[colName].minValue = condition.value;
            }
        }

        return Object.values(rangesMap);
    }

    /**
     * Helper interface for translating filter options to range options.
     * @internal
     */
    export interface Range {
        /**
         * Column containing the values to filter.
         */
        columnId: string;

        /**
         * Maximum including value (`<=` operator).
         */
        maxValue: (boolean|number|string);

        /**
         * Minimum including value (`>=` operator).
         */
        minValue: (boolean|number|string);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default NavigatorSyncUtils;
