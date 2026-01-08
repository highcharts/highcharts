/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Series from '../../../Core/Series/Series';
import type IndicateIndicator from './IndicateIndicator';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Callback to return indications for given points.
 */
export type IndicateCallback = (
    this: IndicateIndicator,
    context: IndicateContext,
    params: IndicateParamsOptions,
) => (IndicateResult|void);

/**
 * Indication result to attach.
 */
export interface IndicateResult {
    text: string;
    x: number;
    y: (number|null);
}

/**
 * Callback context to calculate indications.
 */
export interface IndicateContext {
    periodValues: Array<[(number | null), (number | null)]>;
    series: Series;
    x: (number | null);
    y: (number | null);
}

export interface IndicateOptions extends SMAOptions {
    /**
     * Callback to return indications for given points.
     */
    indicateCallback?: IndicateCallback;
    /**
     * Distance of annotation in pixels.
     */
    indicateDistance?: number;
    params?: IndicateParamsOptions;
}

export interface IndicateParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default IndicateOptions;
