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

import type {
    FilterCondition
} from '../../../Data/Modifiers/FilterModifierOptions.js';
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
     * A map of the filtering conditions for each column.
     */
    private columnConditions: {[key: string]: FilterCondition} = {};

    /**
     * The modifier that is used to filter the data.
     */
    public modifier?: FilterModifier;

    /**
     * The flag that indicates if the data should be updated because of the
     * change in the filtering options.
     */
    public shouldBeUpdated: boolean = false;


    /* *
    *
    *  Functions
    *
    * */

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

        // Allow `null` (empty) and boolean `false` values.
        if (
            typeof value === 'undefined' &&
            !stringifiedValue &&
            condition !== 'empty' &&
            condition !== 'notEmpty'
        ) {
            return;
        }

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
    public addColumnFilterCondition(
        columnId: string,
        options: FilteringLiteConditionOptions
    ): void {
        const condition = FilteringController.mapOptionsToFilter(
            columnId,
            options
        );

        if (condition) {
            this.columnConditions[columnId] = condition;
        } else {
            delete this.columnConditions[columnId];
        }

        this.updateModifier();
    }

    /**
     * Clears the filtering condition for the specified column. If no column ID
     * is provided, clears all the column filtering conditions.
     *
     * @param columnId
     * The column ID to clear or `undefined` to clear all the column filtering
     * conditions.
     */
    public clearColumnFiltering(columnId?: string): void {
        if (!columnId) {
            this.columnConditions = {};
        } else {
            delete this.columnConditions[columnId];
        }

        this.updateModifier();
    }


    /**
     * Updates the modifier based on the current column conditions.
     */
    private updateModifier(): void {
        const columnConditions = Object.values(this.columnConditions);
        this.shouldBeUpdated = true;

        if (columnConditions.length < 1) {
            delete this.modifier;
            return;
        }

        this.modifier = new FilterModifier({
            condition: {
                operator: 'and',
                conditions: columnConditions
            }
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
