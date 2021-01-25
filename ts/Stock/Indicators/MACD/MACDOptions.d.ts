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
    tooltip?: Highcharts.TooltipOptions;
    signalLine?: MACDLineOptions;
    macdLine?: MACDLineOptions;
}

export interface MACDLineOptions {
    styles?: CSSObject;
    zones?: Array<SeriesZonesOptions>;
}

export interface MACDZonesOptions {
    startIndex?: number;
    zones?: MACDLineOptions['zones'];
}

export default MACDOptions;
