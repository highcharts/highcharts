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

import AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import BellcurveSeries from './BellcurveSeries';
import { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BellcurveSeriesOptions extends AreaSplineSeriesOptions, Highcharts.DerivedSeriesOptions {
    baseSeries?: (number|string);
    data?: undefined;
    intervals?: number;
    pointsInInterval?: number;
    states?: SeriesStatesOptions<BellcurveSeries>;
}

export default BellcurveSeriesOptions;
