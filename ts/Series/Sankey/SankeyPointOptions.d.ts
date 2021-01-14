/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SankeyPointOptions extends ColumnPointOptions, Highcharts.NodesPointOptions {
    column?: number;
    from?: string;
    height?: number;
    level?: number;
    offset?: (number|string);
    to?: string;
    width?: number;
}

export default SankeyPointOptions;
