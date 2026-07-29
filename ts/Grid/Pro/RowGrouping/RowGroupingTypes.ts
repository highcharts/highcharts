/* *
 *
 *  Grid Row Grouping Types
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Initial expansion depth of generated group rows.
 *
 * A number expands all group rows above that depth, so `1` expands only the
 * first grouping level. Use `'all'` to expand every group row.
 */
export type RowGroupingExpandedLevels = (number | 'all');

/**
 * Row grouping options.
 */
export interface RowGroupingOptions {
    /**
     * Whether row grouping is enabled.
     *
     * @sample grid-pro/options/row-grouping Row grouping
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Column ID or ordered column IDs used as row grouping levels.
     *
     * Rows sharing the values of these columns are collected under generated
     * group rows, one nesting level per entry. The IDs refer to Grid columns,
     * so columns bound through `columns[].dataId` can be used as well.
     *
     * @sample grid-pro/options/row-grouping Row grouping
     */
    groupBy?: (string | string[]);

    /**
     * ID of the generated column that renders group row labels and the
     * expand/collapse UI.
     *
     * The column can be configured like any other column, by adding an entry
     * with the same `id` to `columns`.
     *
     * @default 'group'
     */
    columnId?: string;

    /**
     * Whether columns used as grouping levels are hidden. When `false`, the
     * grouped columns stay rendered and their values are shown for leaf rows
     * only.
     *
     * @default true
     */
    hideGroupedColumns?: boolean;

    /**
     * Initial expansion depth of generated group rows.
     *
     * @sample grid-pro/options/row-grouping Row grouping
     *
     * @default 0
     */
    expandedLevels?: RowGroupingExpandedLevels;

    /**
     * Whether group rows stick to the top of the viewport while their children
     * are scrolled.
     *
     * @default true
     */
    stickyParents?: boolean;
}
