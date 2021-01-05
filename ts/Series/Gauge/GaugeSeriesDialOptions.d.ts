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
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface GaugeSeriesDialOptions {
    backgroundColor?: ColorType;
    baseLength?: string;
    baseWidth?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    path?: SVGPath;
    radius?: string;
    rearLength?: string;
    topWidth?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default GaugeSeriesDialOptions;
