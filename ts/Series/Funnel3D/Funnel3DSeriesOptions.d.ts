/* *
 *
 *  Imports
 *
 * */

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type Funnel3DPointOptions from './Funnel3DPointOptions';
import type Funnel3DSeries from './Funnel3DSeries';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Funnel3DSeriesOptions extends ColumnSeriesOptions {
    center?: Array<(number|string|null)>;
    data?: Array<(Funnel3DPointOptions|PointShortOptions)>;
    gradientForSides?: boolean;
    height?: (number|string);
    ignoreHiddenPoint?: boolean;
    neckHeight?: (number|string);
    neckWidth?: (number|string);
    reversed?: boolean;
    states?: SeriesStatesOptions<Funnel3DSeries>;
    width?: (number|string);
}

export default Funnel3DSeriesOptions;
