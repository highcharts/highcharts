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
    StringCondition
} from '../../../Data/Modifiers/FilterModifierOptions.js';

import FilterModifier from '../../../Data/Modifiers/FilterModifier.js';
import { FilteringLiteConditionOptions, FilteringLiteRangeConditionOptions, FilteringOptions } from '../Options.js';


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
    private simpleConditions: StringCondition[];

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
        options: FilteringLiteConditionOptions |
        FilteringLiteRangeConditionOptions
    ): any {
        const { condition } = options;

        switch (condition) {
            case 'contains':
                return {
                    columnName: columnId,
                    operator: 'contains',
                    value: options.value
                };

            case 'doesNotContain':
                return {
                    operator: 'not',
                    conditions: [{
                        columnName: columnId,
                        operator: 'contains',
                        value: options.value
                    }]
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
                    value: options.value
                };

            case 'endsWith':
                return {
                    columnName: columnId,
                    operator: 'endsWith',
                    value: options.value
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

            case 'between':
                return {
                    operator: 'and',
                    conditions: [{
                        columnName: columnId,
                        operator: '>=',
                        value: options.from
                    }, {
                        columnName: columnId,
                        operator: '<=',
                        value: options.to
                    }]
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
                    conditions: [{
                        columnName: columnId,
                        operator: 'empty',
                        value: options.value
                    }]
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
        options: FilteringOptions
    ): void {
        const condition =
            FilteringController.mapOptionsToFilter(columnId, options);

        const index = this.simpleConditions.findIndex(
            (c): boolean => c.columnName === columnId
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
}

/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
