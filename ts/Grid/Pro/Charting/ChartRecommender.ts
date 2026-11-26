/* *
 *
 *  Grid Charting recommender
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { ColumnDataType } from '../../Core/Table/Column';
import type { CellType as DataTableCellType } from '../../../Data/DataTable';
import type { ChartingChartType } from './ChartingOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * A Grid column prepared for charting.
 */
export interface ChartColumn {
    /**
     * The column id.
     */
    id: string;

    /**
     * The display name of the column, from its header.
     */
    name: string;

    /**
     * The data type of the column.
     */
    dataType: ColumnDataType;

    /**
     * The `cells.format` of the column, if set.
     */
    format?: string;

    /**
     * The column values, in the order the Grid presents them.
     */
    values: Array<DataTableCellType>;
}

/**
 * The roles the charted columns play in a chart.
 */
export interface ChartColumnRoles {
    /**
     * The column that places the points along the x-axis: the first datetime,
     * string or boolean column.
     */
    dimension?: ChartColumn;

    /**
     * The numeric columns, each one charted as values.
     */
    measures: Array<ChartColumn>;
}


/* *
 *
 *  Constants
 *
 * */

/**
 * The largest number of slices for which a pie chart is recommended.
 */
const maxPieSlices = 8;


/* *
 *
 *  Functions
 *
 * */

/**
 * Splits the columns into a dimension and measures.
 *
 * @param columns
 * The columns to chart.
 *
 * @return
 * The column roles.
 */
export function getColumnRoles(
    columns: Array<ChartColumn>
): ChartColumnRoles {
    const roles: ChartColumnRoles = { measures: [] };

    for (const column of columns) {
        if (column.dataType === 'number') {
            roles.measures.push(column);
        } else if (!roles.dimension) {
            roles.dimension = column;
        }
    }

    return roles;
}

/**
 * Returns the chart types that fit the columns, best match first.
 *
 * @param columns
 * The columns to chart.
 *
 * @return
 * The recommended chart types. Empty when the columns hold no numbers.
 */
export function recommend(
    columns: Array<ChartColumn>
): Array<ChartingChartType> {
    const { dimension, measures } = getColumnRoles(columns);
    const measureCount = measures.length;

    if (!measureCount) {
        return [];
    }

    if (dimension?.dataType === 'datetime') {
        return ['line', 'area', 'column'];
    }

    if (dimension) {
        if (measureCount === 1 && isPieFriendly(measures[0])) {
            return ['column', 'pie', 'bar', 'line'];
        }
        return ['column', 'stackedColumn', 'bar', 'line', 'area'];
    }

    // Numbers only
    switch (measureCount) {
        case 1:
            return ['column', 'line', 'area'];
        case 2:
            return ['scatter', 'line', 'column'];
        case 3:
            return ['bubble', 'scatter', 'line', 'column'];
        default:
            return ['line', 'column', 'area'];
    }
}

/**
 * Whether the column values fit a pie chart: a few values, none negative.
 *
 * @param column
 * The numeric column.
 *
 * @return
 * Whether to recommend a pie chart.
 */
function isPieFriendly(column: ChartColumn): boolean {
    const { values } = column;

    if (values.length > maxPieSlices) {
        return false;
    }

    for (const value of values) {
        if (typeof value === 'number' && value < 0) {
            return false;
        }
    }

    return true;
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    getColumnRoles,
    recommend
} as const;
