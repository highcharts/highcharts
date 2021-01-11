/* *
 *
 *  Highcharts pyramid3d series module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Kacper Madej
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

import type Funnel3DSeriesOptions from '../Funnel3D/Funnel3DSeriesOptions';
import type Pyramid3DSeries from './Pyramid3DSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Pyramid3DSeriesOptions extends Funnel3DSeriesOptions {
    states?: SeriesStatesOptions<Pyramid3DSeries>;
}

export default Pyramid3DSeriesOptions;
