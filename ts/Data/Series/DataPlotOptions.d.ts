/* *
 *
 *  Imports
 *
 * */

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DataPlotOptions {
    dataLabels?: DataLabelOptions;
    markerOptions?: PointMarkerOptions;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPlotOptions;
