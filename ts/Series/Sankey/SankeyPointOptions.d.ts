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
import type NodesComposition from '../NodesComposition';

/* *
 *
 *  Declarations
 *
 * */

export interface SankeyPointOptions extends ColumnPointOptions, NodesComposition.PointCompositionOptions {
    column?: number;
    from?: string;
    height?: number;
    level?: number;
    offset?: (number|string);
    offsetHorizontal?: (number|string);
    offsetVertical?: (number|string);
    to?: string;
    width?: number;
}

export default SankeyPointOptions;
