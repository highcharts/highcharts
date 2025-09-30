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

    /**
     * The current page.
     */
    public currentPage?: number;

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
     * @param currentPage
     * The current page.
     */
    public setRange(currentPage: number): void {
        this.currentPage = currentPage;
        this.querying.shouldBeUpdated = true;
        this.modifier = this.createModifier();
    }

    /**
     * Loads range options from the grid options.
     */
    public loadOptions(): void {
        const pagination = this.querying.grid.pagination;

        if (
            pagination?.options.enabled &&
            this.currentPage !== pagination.currentPage
        ) {
            this.currentPage = pagination.currentPage;
            this.setRange(this.currentPage);
        }
    }

    /**
     * Returns the range modifier.
     */
    private createModifier(): RangeModifier | undefined {
        const currentPage = this.currentPage || 1; // Start from page 1, not 0
        const pageSize =
            this.querying.grid.pagination?.currentPageSize;

        if (!pageSize) {
            return;
        }

        // Calculate the start index (0-based)
        const start = (currentPage - 1) * pageSize;
        const end = Math.min(
            start + pageSize,
            this.querying.grid.dataTable?.rowCount || 0
        );

        return new RangeModifier({
            start,
            end
        });
    }

    /**
     * Reset the pagination controller.
     */
    public reset(): void {
        delete this.modifier;
        delete this.currentPage;
        this.querying.shouldBeUpdated = true;
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
