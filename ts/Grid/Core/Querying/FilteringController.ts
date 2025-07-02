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

import type FilterModifierOptions from '../../../Data/Modifiers/FilterModifierOptions.js';

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
     * The current filtering options.
     */
    public currentFiltering?: Partial<FilterModifierOptions>;

    /**
     * The modifier that is applied to the data table.
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
     * Sets the filtering state.
     *
     * @param contains
     * The string to filter by.
     *
     * @param columnId
     * The column ID to filter in. If not provided, the filtering will be
     * applied to all columns.
     */
    public setFiltering(contains: string, columnId?: string): void {
        if (
            this.currentFiltering?.contains !== contains ||
            this.currentFiltering?.filterIn !== columnId
        ) {
            this.shouldBeUpdated = true;
        }

        this.modifier = new FilterModifier({
            contains,
            filterIn: columnId
        });
    }

    public clearFiltering(): void {
        delete this.modifier;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace FilteringController {

}


/* *
 *
 *  Default Export
 *
 * */

export default FilteringController;
