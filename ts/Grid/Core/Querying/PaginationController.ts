/* *
 *
 *  Grid Pagination Controller class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
     * Whether the pagination is enabled.
     */
    public enabled: boolean;

    /**
     * The current page (1-based index).
     */
    public currentPage: number = 1;

    /**
     * The current page size.
     */
    public currentPageSize: number = 10;

    /**
     * The number of rows before pagination.
     */
    public totalItemsCount?: number;

    /**
     * Number of pinned rows rendered on every page.
     */
    private pinnedRowsCount: number = 0;

    /**
     * Number of non-pinned rows used for pagination math.
     */
    private nonPinnedItemsCount?: number;


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
        this.enabled = !!querying.grid.options?.pagination?.enabled;
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Total number of items (rows before pagination).
     */
    public get totalItems(): number {
        if (this.nonPinnedItemsCount !== void 0) {
            return this.nonPinnedItemsCount;
        }
        return this.totalItemsCount ?? 0;
    }

    /**
     * Number of scrollable rows available on a page.
     */
    public get effectivePageSize(): number {
        return Math.max(this.currentPageSize - this.pinnedRowsCount, 1);
    }

    /**
     * Gets the total number of pages.
     */
    public get totalPages(): number {
        return this.effectivePageSize > 0 ? Math.ceil(
            this.totalItems / this.effectivePageSize
        ) : 1;
    }

    /**
     * Sets pagination context derived from pinned rows.
     *
     * @param pinnedRowsCount
     * Number of rows pinned on each page.
     *
     * @param nonPinnedItemsCount
     * Number of rows available for scrollable pagination.
     */
    public setPinnedRowsContext(
        pinnedRowsCount: number,
        nonPinnedItemsCount?: number
    ): void {
        this.pinnedRowsCount = Math.max(0, Math.round(pinnedRowsCount));
        this.nonPinnedItemsCount = (
            this.pinnedRowsCount > 0 &&
            nonPinnedItemsCount !== void 0
        ) ?
            nonPinnedItemsCount :
            void 0;
    }

    /**
     * Clamps the current page to the total number of pages.
     */
    public clampPage(): void {
        if (this.totalItemsCount === void 0) {
            return;
        }

        const totalPages = Math.max(1, this.totalPages);
        const currentPage = Math.max(
            1,
            Math.min(this.currentPage, totalPages)
        );
        if (currentPage === this.currentPage) {
            return;
        }

        this.currentPage = currentPage;
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Sets the page.
     *
     * @param currentPage
     * The current page.
     */
    public setPage(currentPage: number): void {
        this.currentPage = currentPage;
        this.clampPage();
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Sets the page size.
     *
     * @param pageSize
     * The page size.
     */
    public setPageSize(pageSize: number): void {
        this.currentPageSize = pageSize;
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Loads range options from the grid options.
     */
    public loadOptions(): void {
        const options = this.querying.grid.options?.pagination || {};

        if (this.enabled === !options.enabled) {
            this.enabled = !!options.enabled;
            this.querying.shouldBeUpdated = true;
        }

        if (this.currentPageSize !== options.pageSize) {
            this.setPageSize(options.pageSize ?? this.currentPageSize);
        }

        if (this.currentPage !== options.page) {
            this.setPage(options.page ?? this.currentPage);
        }
    }

    /**
     * Returns the range modifier.
     *
     * @param rowsCountBeforePagination
     * The number of rows before pagination. Default is the number of rows in
     * the original data table.
     */
    public createModifier(
        rowsCountBeforePagination: number = (
            this.querying.grid.dataTable?.rowCount || 0
        )
    ): RangeModifier | undefined {
        if (!this.enabled) {
            return;
        }

        const currentPage = this.currentPage;
        const pageSize = this.currentPageSize;

        // Calculate the start index (0-based)
        const start = (currentPage - 1) * pageSize;
        const end = Math.min(
            start + pageSize,
            rowsCountBeforePagination
        );

        this.totalItemsCount = rowsCountBeforePagination;

        return new RangeModifier({
            start,
            end
        });
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default PaginationController;
