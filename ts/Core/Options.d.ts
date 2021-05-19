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
import type {
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from './Renderer/AlignObject';
import type ColorString from './Color/ColorString';
import type CSSObject from './Renderer/CSSObject';
import type LangOptions from './LangOptions';
import type { SeriesTypePlotOptions } from './Series/SeriesType';
import type SVGRenderer from './Renderer/SVG/SVGRenderer';
import type ChartOptions from '../Core/Chart/ChartOptions';

/* *
 *
 *  Declarations
 *
 * */


export interface Options {
    chart: ChartOptions;
    credits?: CreditsOptions;
    colors?: Array<ColorString>;
    caption?: CaptionOptions;
    lang?: LangOptions;
    loading?: LoadingOptions;
    plotOptions?: SeriesTypePlotOptions;
    subtitle?: SubtitleOptions;
    symbols?: Array<SVGRenderer.SymbolKeyValue>;
    title?: TitleOptions;
}

export interface CreditsOptions {
    enabled?: boolean;
    href?: string;
    mapText?: string;
    mapTextFull?: string;
    position?: AlignObject;
    style?: CSSObject;
    text?: string;
}
export interface CaptionOptions {
    align?: AlignValue;
    floating?: boolean;
    margin?: number;
    style?: CSSObject;
    text?: string;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    widthAdjust?: number;
    x?: number;
    y?: number;
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
export interface SubtitleOptions {
    align?: AlignValue;
    floating?: boolean;
    style?: CSSObject;
    text?: string;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    widthAdjust?: number;
    x?: number;
    y?: number;
}
export interface TitleOptions {
    align?: AlignValue;
    floating?: boolean;
    margin?: number;
    style?: CSSObject;
    text?: string;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    widthAdjust?: number;
    x?: number;
    y?: number;
}
export type DescriptionOptionsType = (TitleOptions|SubtitleOptions|CaptionOptions);
export type OptionsOverflowValue = ('allow'|'justify');
export type OptionsPosition3dValue = ('chart'|'flap'|'offset'|'ortho');

/* *
 *
 *  Default Export
 *
 * */

export default Options;
