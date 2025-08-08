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
     * Adds a new simple string `contains` condition to the filtering options.
     * If the condition already exists, it will be updated. If the `contains`
     * parameter is not provided or empty string, the condition will be removed.
     *
     * @param columnId
     * The column ID to filter in.
     *
     * @param contains
     * The string to filter by.
     */
    public addSimpleCondition(columnId: string, contains?: string): void {
        const conditions = this.simpleConditions;
        const condition: StringCondition = {
            columnName: columnId,
            operator: 'contains',
            value: contains || ''
        };

        const index = conditions.findIndex(
            (c): boolean => c.columnName === columnId
        );

        if (index > -1) {
            if (contains) {
                // If the condition already exists, update it.
                conditions[index] = condition;
            } else {
                // If the condition is empty, remove it.
                conditions.splice(index, 1);
            }
        } else if (contains) {
            // If the condition does not exist, add it.
            conditions.push(condition);
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
