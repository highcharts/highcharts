/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

interface WGLDebugOptions extends BoostDebugOptions {
    timeBufferCopy: boolean;
    timeKDTree: boolean;
    timeRendering: boolean;
    timeSeriesProcessing: boolean;
    timeSetup: boolean;
    showSkipSummary: boolean;
}

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

export default WGLOptions;
