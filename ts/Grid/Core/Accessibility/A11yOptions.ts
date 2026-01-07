/* *
 *
 *  Grid Accessibility options
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';


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
    announcements?: A11yAnnouncementsOptions;

    /**
     * Options for screen reader sections before and after the Grid.
     */
    screenReaderSection?: ScreenReaderSectionOptions;
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

    /**
     * Language options for screen reader sections before and after the Grid.
     */
    screenReaderSection?: ScreenReaderSectionLangOptions;
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

/**
 * Options for screen reader sections before and after the Grid.
 */
export interface ScreenReaderSectionOptions {
    /**
     * A formatter function to create the HTML contents of the hidden screen
     * reader information region before the Grid.
     */
    beforeGridFormatter?: ScreenReaderFormatterCallback;

    /**
     * Format for the screen reader information region before the Grid.
     * Supported HTML tags are h1-h6, p, div. Attributes are not supported.
     *
     * Available template variables:
     * - {gridTitle}: The Grid caption/title.
     * - {gridDescription}: The Grid description.
     * - {rowCount}: Number of rows in the Grid.
     * - {columnCount}: Number of columns in the Grid.
     *
     * @default '<div>{gridTitle}</div><div>{gridDescription}</div><div>Grid with {rowCount} rows and {columnCount} columns.</div>'
     */
    beforeGridFormat?: string;

    /**
     * A formatter function to create the HTML contents of the hidden screen
     * reader information region after the Grid.
     */
    afterGridFormatter?: ScreenReaderFormatterCallback;

    /**
     * Format for the screen reader information region after the Grid.
     *
     * @default 'End of Grid.'
     */
    afterGridFormat?: string;
}

/**
 * Formatter callback function for screen reader sections.
 *
 * @param grid
 * A Grid instance.
 *
 * @returns
 * A string with the HTML content of the region.
 */
export type ScreenReaderFormatterCallback = (grid: Grid) => string;

/**
 * Language options for screen reader sections.
 */
export interface ScreenReaderSectionLangOptions {
    /**
     * Text for the aria-label attribute of the before screen reader region.
     *
     * @default ''
     */
    beforeRegionLabel?: string;

    /**
     * Text for the aria-label attribute of the after screen reader region.
     *
     * @default ''
     */
    afterRegionLabel?: string;
}
