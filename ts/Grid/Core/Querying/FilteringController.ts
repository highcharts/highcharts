/* *
 *
 *  Grid Filtering Controller class
 *
 *  (c) 2020-2025 Highsoft AS
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

import type { FilterCondition } from '../../../Data/Modifiers/FilterModifierOptions.js';
import type { FilteringLiteConditionOptions } from '../Options.js';

import FilterModifier from '../../../Data/Modifiers/FilterModifier.js';
import U from '../../../Core/Utilities.js';
const {
    isString
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages one of the data grid querying types - filtering.
 */
class FilteringController {

    /* *
    *
    *  Properties
    *
    * */
    /**
     * The simple conditions that are used in simple filtering.
     */
    private simpleConditions: FilterCondition[];

    private _modifier: FilterModifier;

    /**
     * The flag that indicates if the data should be updated because of the
     * change in the filtering options.
     */
    public shouldBeUpdated: boolean = false;

    /* *
    *
    *  Properties
    *
    * */

    constructor() {
        this.simpleConditions = [];
        this._modifier = new FilterModifier({
            condition: {
                operator: 'and',
                conditions: this.simpleConditions
            }
        });
    }


    /* *
    *
    *  Functions
    *
    * */

    public get modifier(): FilterModifier | undefined {
        if (this.simpleConditions.length === 0) {
            return;
        }

        return this._modifier;
    }

    /**
     * Maps filtering options to the filtering condition.
     *
     * @param columnId
     * Id of the column to filter.
     *
     * @param options
     * Filtering options.
     */
    public static mapOptionsToFilter(
        columnId: string,
        options: FilteringLiteConditionOptions
    ): FilterCondition | undefined {
        const { condition, value } = options;
        const stringifiedValue = isString(value) ? value : '';

        switch (condition) {
            case 'contains':
                return {
                    columnName: columnId,
                    operator: 'contains',
                    value: stringifiedValue
                };

            case 'doesNotContain':
                return {
                    operator: 'not',
                    condition: {
                        columnName: columnId,
                        operator: 'contains',
                        value: stringifiedValue
                    }
                };

            case 'equals':
                return {
                    columnName: columnId,
                    operator: '===',
                    value
                };

            case 'doesNotEqual':
                return {
                    columnName: columnId,
                    operator: '!==',
                    value
                };

            case 'beginsWith':
                return {
                    columnName: columnId,
                    operator: 'startsWith',
                    value: stringifiedValue
                };

            case 'endsWith':
                return {
                    columnName: columnId,
                    operator: 'endsWith',
                    value: stringifiedValue
                };

            case 'greaterThan':
                return {
                    columnName: columnId,
                    operator: '>',
                    value
                };

            case 'greaterThanOrEqualTo':
                return {
                    columnName: columnId,
                    operator: '>=',
                    value
                };

            case 'lessThan':
                return {
                    columnName: columnId,
                    operator: '<',
                    value
                };

            case 'lessThanOrEqualTo':
                return {
                    columnName: columnId,
                    operator: '<=',
                    value
                };

            case 'before':
                return {
                    columnName: columnId,
                    operator: '<',
                    value
                };

            case 'after':
                return {
                    columnName: columnId,
                    operator: '>',
                    value
                };

            case 'empty':
                return {
                    columnName: columnId,
                    operator: 'empty',
                    value
                };

            case 'notEmpty':
                return {
                    operator: 'not',
                    condition: {
                        columnName: columnId,
                        operator: 'empty',
                        value
                    }
                };

            default:
                return void 0;
        }
    }

    /**
     * Adds a new filtering condition to the specified column.
     *
     * @param columnId
     * The column ID to filter in.
     *
     * @param options
     * The filtering options.
     */
    public addFilterCondition(
        columnId: string,
        options: FilteringLiteConditionOptions
    ): void {
        const condition =
            FilteringController.mapOptionsToFilter(columnId, options);

        const index = this.simpleConditions.findIndex(
            (c): boolean => {
                const columnName = this.getColumnName(c);

                return columnName === columnId;
            }
        );

        if (index > -1) {
            if (condition) {
                // If the condition already exists, update it.
                this.simpleConditions[index] = condition;
            } else {
                // If the condition is empty, remove it.
                this.simpleConditions.splice(index, 1);
            }
        } else if (condition) {
            // If the condition does not exist, add it.
            this.simpleConditions.push(condition);
        }

        this.shouldBeUpdated = true;
    }

    /**
     * Clears all the meaningful filtering options.
     */
    public clearFiltering(): void {
        if (this.simpleConditions.length < 1) {
            return;
        }

        this.simpleConditions.length = 0;
        this.shouldBeUpdated = true;
    }

    /**
     * Based on the condition, returns the column name.
     *
     * @param condition
     * The condition to get the column name from.
     */
    private getColumnName(condition: FilterCondition): string | undefined {
        // CallbackCondition
        if (typeof condition === 'function') {
            return void 0;
        }

        // ComparisonCondition | StringCondition
        if ('columnName' in condition) {
            return condition.columnName;
        }

        // LogicalSingleCondition
        if ('condition' in condition) {
            return this.getColumnName(condition.condition);
        }

        // LogicalMultipleCondition
        if ('conditions' in condition) {
            return condition.conditions.map(this.getColumnName).find(Boolean);
        }

        return void 0;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
