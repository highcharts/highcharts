/* *
 *
 *  Imports
 *
 * */

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type { SeriesDataSortingOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DataPlotOptions {
    dataLabels?: DataLabelOptions;
    dataSorting?: SeriesDataSortingOptions;
    index?: number;
    keys?: Array<string>;
    markerOptions?: PointMarkerOptions;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPlotOptions;
