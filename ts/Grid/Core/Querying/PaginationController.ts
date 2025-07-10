/* *
 *
 *  Grid Pagination Controller class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import QueryingController from './QueryingController.js';
import RangeModifier from '../../../Data/Modifiers/RangeModifier.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages one of the data grid querying types - pagination.
 */
class PaginationController {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The grid instance.
     */
    private querying: QueryingController;

    /**
     * The modifier that is applied to the data table.
     */
    public modifier?: RangeModifier;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs the PaginationController instance.
     *
     * @param querying
     * The querying controller instance.
     */
    constructor(querying: QueryingController) {
        this.querying = querying;
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Sets the range options.
     *
     */
    public setRange(): void {
        this.modifier = this.createModifier();
    }

    /**
     * Loads range options from the grid options.
     */
    public loadOptions(): void {
        this.setRange();
    }

    /**
     * Returns the range modifier.
     */
    private createModifier(): RangeModifier | undefined {
        return new RangeModifier({
            // start: isNext ? start : start - pgOptions.itemsPerPage,
            // end: start + (isNext ? pgOptions.itemsPerPage : 0)
        });
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace PaginationController {

}


/* *
 *
 *  Default Export
 *
 * */

export default PaginationController;
