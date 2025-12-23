/* *
 *
 *  (c) 2019-2025 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    BoostDebugOptions,
    BoostOptions
} from './BoostOptions';
import type ColorString from '../../Core/Color/ColorString';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
interface WGLDebugOptions extends BoostDebugOptions {
    timeBufferCopy: boolean;
    timeKDTree: boolean;
    timeRendering: boolean;
    timeSeriesProcessing: boolean;
    timeSetup: boolean;
    showSkipSummary: boolean;
}

/** @internal */
interface WGLOptions extends BoostOptions {
    debug: WGLDebugOptions;
    fillColor: ColorString;
    lineWidth: number;
    pointSize?: number;
    useAlpha: boolean;
    useGPUTranslations: boolean;
    usePreallocated: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WGLOptions;
