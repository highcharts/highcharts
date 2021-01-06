/* *
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

import type ColorType from '../../Core/Color/ColorType';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type PieDataLabelOptions from './PieDataLabelOptions';
import type PieSeries from './PieSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PieSeriesOptions extends LineSeriesOptions {
    endAngle?: number;
    center?: [(number|string|null), (number|string|null)];
    colorByPoint?: boolean;
    dataLabels?: PieDataLabelOptions;
    fillColor?: ColorType;
    ignoreHiddenPoint?: boolean;
    inactiveOtherPoints?: boolean;
    innerSize?: (number|string);
    minSize?: (number|string);
    size?: (number|string);
    slicedOffset?: number;
    startAngle?: number;
    states?: SeriesStatesOptions<PieSeries>;
}

export default PieSeriesOptions;
