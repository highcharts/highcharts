/* *
 *
 *  Grid Value List Filter options
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type { FilteringRuleItem } from '../../Core/Options';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Language options for the value list of the `oneOf` filtering operator.
 */
export interface ValueListFilterLangOptions {

    /**
     * Label of the button opening the list when no value is excluded.
     *
     * @default 'All'
     */
    all?: string;

    /**
     * Label of the entry matching the empty cells.
     *
     * @default '(Blanks)'
     */
    blanks?: string;

    /**
     * Label of the entry toggling every listed value.
     *
     * @default '(Select All)'
     */
    selectAll?: string;

    /**
     * Label of the button opening the list when some values are excluded.
     * Placeholder: {count}.
     *
     * @default '{count} selected'
     */
    selected?: string;
}


declare module '../../Core/Options' {
    interface ColumnFilteringOptions {
        /**
         * The values the `oneOf` operator lists to select from, in their
         * order; the selected ones are in `rule.value`. A `null` entry stands
         * for the empty cells.
         *
         * Without it, the values are read from the column data, which
         * requires a local data provider.
         *
         * @sample grid-pro/options/filtering-value-list
         *         Filtering by a value list
         */
        values?: FilteringRuleItem[];
    }

    interface LangOptions {
        /**
         * Language options for the value list of the `oneOf` filtering
         * operator.
         */
        valueListFilter?: ValueListFilterLangOptions;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ValueListFilterLangOptions;
