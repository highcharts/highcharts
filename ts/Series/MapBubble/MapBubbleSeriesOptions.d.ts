/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type BubbleSeriesOptions from '../Bubble/BubbleSeriesOptions.js';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions.js';

/* *
 *
 *  Declarations
 *
 * */

export interface MapBubbleSeriesOptions extends BubbleSeriesOptions {
    states?: SeriesStatesOptions<MapBubbleSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapBubbleSeriesOptions;
