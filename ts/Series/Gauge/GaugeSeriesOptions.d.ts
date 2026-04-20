/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
    baseLength: number|string;
    baseWidth: number|string;
    borderColor: ColorType;
    borderRadius: number|string;
    borderWidth: number;
    path?: SVGPath;
    radius: number|string;
    rearLength: number|string;
    topWidth: number|string;
}

export interface GaugeSeriesPivotOptions {
    backgroundColor: ColorType;
    borderColor: ColorType;
    borderWidth: number;
    radius: number|string;
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
