/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Sebastian Domas
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

import type AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import type BellcurveSeries from './BellcurveSeries';
import type DerivedComposition from '../DerivedComposition';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BellcurveSeriesOptions extends AreaSplineSeriesOptions, DerivedComposition.SeriesOptions {
    baseSeries?: (number|string);
    data?: undefined;
    intervals?: number;
    pointsInInterval?: number;
    states?: SeriesStatesOptions<BellcurveSeries>;
}

export default BellcurveSeriesOptions;
