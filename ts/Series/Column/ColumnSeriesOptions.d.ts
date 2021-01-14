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
import type ColumnSeries from './ColumnSeries';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        borderColor?: ColorType;
        borderDashStyle?: DashStyleValue;
        borderRadius?: number;
        borderWidth?: number;
        centerInCategory?: boolean;
        fillColor?: ColorType;
        grouping?: boolean;
        groupPadding?: number;
        negativeFillColor?: ColorType;
        pointRange?: (number|null);
    }
    interface SeriesStateHoverOptions {
        borderColor?: ColorType;
        borderDashStyle?: DashStyleValue;
        borderRadius?: number;
        borderWidth?: number;
        brightness?: number;
        color?: ColorType;
        dashStyle?: DashStyleValue;
    }
    interface SeriesZonesOptions {
        borderColor?: ColorType;
        borderWidth?: number;
        color?: ColorType;
    }
}

export interface ColumnSeriesOptions extends LineSeriesOptions {
    maxPointWidth?: number;
    minPointLength?: number;
    pointPadding?: number;
    pointWidth?: number;
    states?: SeriesStatesOptions<ColumnSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnSeriesOptions;
