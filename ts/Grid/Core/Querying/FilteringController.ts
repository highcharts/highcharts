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
     * A map of the filtering conditions for each column.
     */
    private columnConditions: {[key: string]: FilterCondition} = {};

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
        if (Object.keys(this.columnConditions).length === 0) {
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
        const filterExists = this.columnConditions?.[columnId];

        if (filterExists) {
            if (condition) {
                // If the condition already exists, update it.
                this.columnConditions[columnId] = condition;
            } else {
                // If the condition is empty, remove it.
                delete this.columnConditions[columnId];
            }
        } else if (condition) {
            // If the condition does not exist, add it.
            this.columnConditions[columnId] = condition;

            this._modifier = new FilterModifier({
                condition: {
                    operator: 'and',
                    conditions: Object.values(this.columnConditions)
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
        if (!this.columnConditions[columnId]) {
            return;
        }

        delete this.columnConditions[columnId];
        this.shouldBeUpdated = true;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
