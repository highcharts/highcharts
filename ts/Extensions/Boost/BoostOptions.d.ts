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
 *  Declarations
 *
 * */


export type BoostBlendingValue = ('add'|'darken'|'multiply');

export interface BoostDebugOptions {
    showSkipSummary?: boolean;
    timeBufferCopy?: boolean;
    timeKDTree?: boolean;
    timeRendering?: boolean;
    timeSeriesProcessing?: boolean;
    timeSetup?: boolean;
}

export interface BoostOptions {
    allowForce?: boolean;
    debug?: BoostDebugOptions;
    enabled?: boolean;
    seriesThreshold?: number;
    pixelRatio?: number;
    useGPUTranslations?: boolean;
    usePreallocated?: boolean;
}

declare module '../../Core/Options'{
    interface Options {
        boost?: BoostOptions;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        boostBlending?: BoostBlendingValue;
        boostThreshold?: number;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BoostOptions;
