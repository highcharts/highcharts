/* *
 *
 *  Grid Accessibility options
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


/* *
 *
 *  Declarations
 *
 * */


/**
 * Accessibility options for the Grid.
 */
export interface A11yOptions {
    /**
     * Enable accessibility features for the Grid.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The default option is auto, which applies the high contrast theme the
     * user's system has a high contrast theme active.
     */
    highContrastMode?: boolean | 'auto';

    /**
     * VoiceOver announcer options for Grid actions.
     */
    announcements?: A11yAnnouncementsOptions
}

/**
 * VoiceOver announcer options for Grid actions.
 */
export interface A11yAnnouncementsOptions {
    /**
     * Enable accessibility announcements for the sorting.
     *
     * @default true
     */
    sorting?: boolean;

    /**
     * Enable accessibility announcements for the filtering.
     *
     * @default true
     */
    filtering?: boolean;
}

/**
 * Accessibility language options for the Grid.
 */
export interface LangAccessibilityOptions {
    /**
     * Language options for the accessibility descriptions in sorting.
     */
    sorting?: SortingLangA11yOptions;

    /**
     * Language options for the accessibility descriptions in pagination.
     */
    pagination?: PaginationLangA11yOptions;

    /**
     * Language options for the accessibility descriptions in filtering.
     */
    filtering?: FilteringLangA11yOptions;
}

/**
 * Accessibility options for the Grid sorting functionality.
 */
export interface SortingLangA11yOptions {

    /**
     * An additional hint (a visually hidden span) read by the voice over
     * after the column name.
     *
     * @default 'Sortable.'
     */
    sortable?: string;

    /**
     * Accessibility lang options for the sorting announcements.
     */
    announcements?: {

        /**
         * The message when the column was sorted in ascending order.
         *
         * @default 'Sorted ascending.'
         */
        ascending?: string;

        /**
         * The message when the column was sorted in descending order.
         *
         * @default 'Sorted descending.'
         */
        descending?: string;

        /**
         * The message when the column was unsorted.
         *
         * @default 'Not sorted.'
         */
        none?: string;
    }
}

/**
 * Accessibility options for the Grid pagination functionality.
 */
export interface PaginationLangA11yOptions {
    /**
     * Language options for the accessibility descriptions in pagination.
     */
    announcements?: {
        /**
         * The message when the page size was changed.
         *
         * @default 'Page size changed to.'
         */
        pageSizeChange?: string;

        /**
         * The message when the page was changed.
         *
         * @default 'Page changed to.'
         */
        pageChange?: string;
    }
}

/**
 * Accessibility options for the Grid filtering functionality.
 */
export interface FilteringLangA11yOptions {
    /**
     * Language options for the accessibility descriptions in filtering.
     */
    announcements?: {
        /**
         * The message when the filter was applied.
         *
         * @default 'Filter applied for {columnId}, {condition} {value}. {rowsCount} results found.'
         */
        filterApplied?: string;

        /**
         * The message when the filter was applied for empty-like conditions.
         *
         * @default 'Filter applied for {columnId}, {condition} values. {rowsCount} results found.'
         */
        emptyFilterApplied?: string;

        /**
         * The message when the filter was cleared.
         *
         * @default 'Filter cleared for {columnId}. {rowsCount} results found.'
         */
        filterCleared?: string;
    }
}

/**
 * Accessibility options for the Grid header cell.
 */
export interface HeaderCellA11yOptions {
    /**
     * The aria description of the header cell.
     */
    description?: string;
}
