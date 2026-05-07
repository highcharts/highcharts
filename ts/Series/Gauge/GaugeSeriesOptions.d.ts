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

import type ColorType from '../../Core/Color/ColorType';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface GaugeSeriesDialOptions {
    backgroundColor: ColorType;
    baseLength: string;
    baseWidth: number;
    borderColor: ColorType;
    borderWidth: number;
    path?: SVGPath;
    radius: string;
    rearLength: string;
    topWidth: number;
}

export interface GaugeSeriesPivotOptions {
    backgroundColor: ColorType;
    borderColor: ColorType;
    borderWidth: number;
    radius: number;
}

export interface GaugeSeriesOptions extends LineSeriesOptions {
    dial?: GaugeSeriesDialOptions;
    overshoot?: number;
    pivot?: GaugeSeriesPivotOptions;
    states?: SeriesStatesOptions<GaugeSeriesOptions>;
    wrap?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default GaugeSeriesOptions;
