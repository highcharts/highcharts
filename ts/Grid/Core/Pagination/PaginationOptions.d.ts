/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Pagination options.
 */
export interface PaginationOptions {
    /**
     * Whether the pagination should be rendered.
     *
     * @default false
     */
    enabled: boolean;

    /**
     * Displayed items per page.
     */
    itemsPerPage?: number;

    /**
     * Events for the pagination.
     */
    events?: PaginationEvents;
}

/**
 * Pagination events.
 */
export interface PaginationEvents {
    beforePageChange: (currentPage: number) => void;
    afterPageChange: (currentPage: number) => void;
}
