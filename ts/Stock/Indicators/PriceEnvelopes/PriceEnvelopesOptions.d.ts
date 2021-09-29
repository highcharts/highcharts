/* *
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

import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type CSSObject from '../../../Core/Renderer/CSSObject';

/* *
 *
 *  Declarations
 *
 * */

export interface PriceEnvelopesOptions extends SMAOptions {
    bottomLine?: Record<string, CSSObject>;
    topLine?: Record<string, CSSObject>;
    params?: PriceEnvelopesParamsOptions;
}

export interface PriceEnvelopesParamsOptions extends SMAParamsOptions {
    topBand?: number;
    bottomBand?: number;
    // for inheritance
}

export default PriceEnvelopesOptions;
