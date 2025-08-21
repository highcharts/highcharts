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

import type { FilterCondition, LogicalMultipleCondition } from '../../../Data/Modifiers/FilterModifierOptions.js';

import FilterModifier from '../../../Data/Modifiers/FilterModifier.js';
import { FilteringLiteConditionOptions } from '../Options.js';


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
     * A map of the simple conditions for each column.
     */
    private simpleConditions: {[key: string]: FilterCondition[]} = {};

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
        this._modifier = new FilterModifier({
            condition: {
                operator: 'and',
                conditions: []
            }
        });
    }


    /* *
    *
    *  Functions
    *
    * */

    public get modifier(): FilterModifier | undefined {
        if (Object.keys(this.simpleConditions).length === 0) {
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
    ): FilterCondition {
        const { condition } = options;

        switch (condition) {
            case 'contains':
                return {
                    columnName: columnId,
                    operator: 'contains',
                    value: options.value || ''
                };

            case 'doesNotContain':
                return {
                    operator: 'not',
                    condition: {
                        columnName: columnId,
                        operator: 'contains',
                        value: options.value || ''
                    }
                };

            case 'equals':
                return {
                    columnName: columnId,
                    operator: '===',
                    value: options.value
                };

            case 'doesNotEqual':
                return {
                    columnName: columnId,
                    operator: '!==',
                    value: options.value
                };

            case 'beginsWith':
                return {
                    columnName: columnId,
                    operator: 'startsWith',
                    value: options.value || ''
                };

            case 'endsWith':
                return {
                    columnName: columnId,
                    operator: 'endsWith',
                    value: options.value || ''
                };

            case 'greaterThan':
                return {
                    columnName: columnId,
                    operator: '>',
                    value: options.value
                };

            case 'greaterThanOrEqualTo':
                return {
                    columnName: columnId,
                    operator: '>=',
                    value: options.value
                };

            case 'lessThan':
                return {
                    columnName: columnId,
                    operator: '<',
                    value: options.value
                };

            case 'lessThanOrEqualTo':
                return {
                    columnName: columnId,
                    operator: '<=',
                    value: options.value
                };

            case 'before':
                return {
                    columnName: columnId,
                    operator: '<',
                    value: options.value
                };

            case 'after':
                return {
                    columnName: columnId,
                    operator: '>',
                    value: options.value
                };

            case 'empty':
                return {
                    columnName: columnId,
                    operator: 'empty',
                    value: options.value
                };

            case 'notEmpty':
                return {
                    operator: 'not',
                    condition: {
                        columnName: columnId,
                        operator: 'empty',
                        value: options.value
                    }
                };

            default:
                return {
                    columnName: columnId,
                    operator: 'contains',
                    value: ''
                };
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

        const index = this.simpleConditions?.[columnId]?.findIndex(
            (c): boolean => {
                const columnName = this.getColumnName(c);

                return columnName === columnId;
            }
        );

        if (index > -1) {
            if (condition) {
                // If the condition already exists, update it.
                this.simpleConditions[columnId][index] = condition;
            } else {
                // If the condition is empty, remove it.
                this.simpleConditions[columnId].splice(index, 1);
            }
        } else if (condition) {
            if (!this.simpleConditions[columnId]) {
                this.simpleConditions[columnId] = [];
            }
            // If the condition does not exist, add it.
            this.simpleConditions[columnId].push(condition);

            this._modifier = new FilterModifier({
                condition: {
                    operator: 'and',
                    conditions: Object.values(this.simpleConditions)
                        .map((group): LogicalMultipleCondition => ({
                            operator: 'and',
                            conditions: group
                        }))
                }
            });
        }

        this.shouldBeUpdated = true;
    }

    /**
     * Clears all the meaningful filtering options.
     *
     * @param columnId
     * The column ID to clear.
     */
    public clearFiltering(columnId: string): void {
        if (this.simpleConditions[columnId].length < 1) {
            return;
        }

        this.simpleConditions[columnId].length = 0;
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
