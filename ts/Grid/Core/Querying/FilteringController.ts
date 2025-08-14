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
import { FilteringOptions } from '../Options.js';


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
        const condition = this.mapOptionsToFilter(columnId, options);

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

    /**
     * Maps filtering options to the filtering condition.
     *
     * @param columnId
     * Id of the column to filter.
     *
     * @param options
     * Filtering options.
     */
    private mapOptionsToFilter(
        columnId: string,
        options: FilteringOptions
    ): any {
        const condition = options.condition;

        if (condition === 'contains') {
            return {
                columnName: columnId,
                operator: 'contains',
                value: options.value || ''
            };
        }

        if (condition === 'doesNotContain') {
            return {
                operator: 'not',
                conditions: [{
                    columnName: columnId,
                    operator: 'contains',
                    value: options.value
                }]
            };
        }

        if (condition === 'equals') {
            return {
                columnName: columnId,
                operator: '===',
                value: options.value
            };
        }

        if (condition === 'doesNotEqual') {
            return {
                columnName: columnId,
                operator: '!==',
                value: options.value
            };
        }

        if (condition === 'beginsWith') {
            return {
                columnName: columnId,
                operator: 'startsWith',
                value: options.value
            };
        }

        if (condition === 'endsWith') {
            return {
                columnName: columnId,
                operator: 'endsWith',
                value: options.value
            };
        }

        if (condition === 'greaterThan') {
            return {
                columnName: columnId,
                operator: '>',
                value: options.value
            };
        }

        if (condition === 'greaterThanOrEqualTo') {
            return {
                columnName: columnId,
                operator: '>=',
                value: options.value
            };
        }

        if (condition === 'lessThan') {
            return {
                columnName: columnId,
                operator: '<',
                value: options.value
            };
        }

        if (condition === 'lessThanOrEqualTo') {
            return {
                columnName: columnId,
                operator: '<=',
                value: options.value
            };
        }

        if (condition === 'before') {
            return {
                columnName: columnId,
                operator: '<',
                value: options.value
            };
        }

        if (condition === 'after') {
            return {
                columnName: columnId,
                operator: '>',
                value: options.value
            };
        }

        if (condition === 'between') {
            return {
                operator: 'and',
                conditions: [
                    {
                        columnName: columnId,
                        operator: '>=',
                        value: options.from
                    },
                    {
                        columnName: columnId,
                        operator: '<=',
                        value: options.to
                    }
                ]
            };
        }

        if (condition === 'empty') {
            return {
                columnName: columnId,
                operator: 'empty',
                value: options.value
            };
        }

        if (condition === 'notEmpty') {
            return {
                operator: 'not',
                conditions: [{
                    columnName: columnId,
                    operator: 'empty',
                    value: options.value
                }]
            };
        }

        return {
            columnName: columnId,
            operator: 'contains',
            value: options.value
        };
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
