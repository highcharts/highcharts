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

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type FlagsSeries from './FlagsSeries';
import type { FlagsShapeValue } from './FlagsPointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface FlagsSeriesOptions extends ColumnSeriesOptions {
    allowOverlapX?: boolean;
    fillColor?: ColorType;
    height?: number;
    lineColor?: ColorType;
    lineWidth?: number;
    onKey?: string;
    onSeries?: string;
    shape?: FlagsShapeValue;
    stackDistance?: number;
    states?: SeriesStatesOptions<FlagsSeries>;
    style?: CSSObject;
    textAlign?: AlignValue;
    title?: string;
    useHTML?: boolean;
    width?: number;
    y?: number;
}

export default FlagsSeriesOptions;
