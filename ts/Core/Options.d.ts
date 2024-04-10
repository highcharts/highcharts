/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type ColorString from './Color/ColorString';
import type CSSObject from './Renderer/CSSObject';
import type { SeriesTypePlotOptions } from './Series/SeriesType';
import type { SymbolKey } from './Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface LabelsItemsOptions {
    html?: string;
    style?: CSSObject;
}

export interface LangOptions {
    decimalPoint: string;
    invalidDate?: string;
    loading: string;
    months: Array<string>;
    numericSymbolMagnitude?: number;
    numericSymbols: Array<string> | undefined;
    resetZoom: string;
    resetZoomTitle: string;
    shortMonths: Array<string>;
    shortWeekdays?: Array<string>;
    thousandsSep: string;
    weekdays: Array<string>;
    zoomIn?: string;
    zoomOut?: string;
}

export interface LoadingOptions {
    hideDuration?: number;
    labelStyle?: CSSObject;
    showDuration?: number;
    style?: CSSObject;
}

export interface NumberFormatterCallbackFunction {
    (
        number: number,
        decimals: number,
        decimalPoint?: string,
        thousandsSep?: string
    ): string;
}

export interface Options {
    colors?: Array<ColorString>;
    lang: LangOptions;
    loading?: LoadingOptions;
    plotOptions: SeriesTypePlotOptions;
    symbols?: Array<SymbolKey>;
    global: GlobalOptions;
}

export interface DefaultOptions extends Options {
}

export type OptionsOverflowValue = ('allow'|'justify');

export type OptionsPosition3dValue = ('chart'|'flap'|'offset'|'ortho');

/* *
 *
 *  Default Export
 *
 * */

export default Options;
