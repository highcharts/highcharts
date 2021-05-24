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

import type ColorString from './Color/ColorString';
import type CSSObject from './Renderer/CSSObject';
import type LangOptions from './LangOptions';
import type { SeriesTypePlotOptions } from './Series/SeriesType';
import type SVGRenderer from './Renderer/SVG/SVGRenderer';

/* *
 *
 *  Declarations
 *
 * */


export interface Options {
    colors?: Array<ColorString>;
    lang?: LangOptions;
    loading?: LoadingOptions;
    plotOptions?: SeriesTypePlotOptions;
    symbols?: Array<SVGRenderer.SymbolKeyValue>;
}

export interface LabelsItemsOptions {
    html?: string;
    style?: CSSObject;
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

export type OptionsOverflowValue = ('allow'|'justify');
export type OptionsPosition3dValue = ('chart'|'flap'|'offset'|'ortho');

/* *
 *
 *  Default Export
 *
 * */

export default Options;
