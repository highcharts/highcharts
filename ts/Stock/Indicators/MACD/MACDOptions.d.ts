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

import type ColorString from '../../../Core/Color/ColorString';
import type MACDIndicator from './MACDIndicator';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type {
    SeriesStatesOptions,
    SeriesZonesOptions
} from '../../../Core/Series/SeriesOptions';

/* *
*
*  Declarations
*
* */

export interface MACDGappedExtensionObject {
    options?: MACDGappedExtensionOptions;
}

export interface MACDGappedExtensionOptions {
    gapSize?: number;
}

export interface MACDParamsOptions extends SMAParamsOptions {
    period?: number;
    shortPeriod?: number;
    longPeriod?: number;
    signalPeriod?: number;
}

export interface MACDOptions extends SMAOptions {
    params?: MACDParamsOptions;
    states?: SeriesStatesOptions<MACDIndicator>;
    threshold?: number;
    groupPadding?: number;
    pointPadding?: number;
    minPointLength?: number;
    signalLine?: MACDLineOptions;
    macdLine?: MACDLineOptions;
}

export interface MACDLineOptions {
    styles?: MACDLineStyleOptions;
    zones?: Array<SeriesZonesOptions>;
}
export interface MACDLineStyleOptions extends CSSObject {
    lineColor?: ColorString
}

export interface MACDZonesOptions {
    startIndex?: number;
    zones?: MACDLineOptions['zones'];
}

/* *
*
*  Default Export
*
* */

export default MACDOptions;
