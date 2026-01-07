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

export type IndicateCallback = (
    this: IndicateIndicator,
    context: IndicateContext,
    params: IndicateParamsOptions,
) => IndicateResult;

export interface IndicateResult {
    text: string;
    x: number;
    y: (number|null);
}

export interface IndicateContext {
    periodValues: Array<[(number | null), (number | null)]>;
    series: Series;
    x: (number | null);
    y: (number | null);
}

export interface IndicateOptions extends SMAOptions {
    indicateCallback?: IndicateCallback;
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
