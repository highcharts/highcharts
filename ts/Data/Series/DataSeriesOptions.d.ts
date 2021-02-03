/* *
 *
 *  Imports
 *
 * */

import type DataPlotOptions from './DataPlotOptions';
import type DataPointOptions from './DataPointOptions';
import type PointShortOptions from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DataSeriesOptions extends DataPlotOptions {
    data?: Array<(DataPointOptions|PointShortOptions)>;
    type: 'data';
}

/* *
 *
 *  Default Export
 *
 * */

export default DataSeriesOptions;
