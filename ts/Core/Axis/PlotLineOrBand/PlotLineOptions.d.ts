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
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type ColorString from '../../Color/ColorString';
import type CSSObject from '../../Renderer/CSSObject';
import type DashStyleValue from '../../Renderer/DashStyleValue';
import type FormatUtilities from '../../FormatUtilities';
import type PlotLineOrBand from './PlotLineOrBand';

/* *
 *
 *  Declarations
 *
 * */

export interface PlotLineLabelOptions {
    align?: AlignValue;
    clip?: boolean;
    formatter?: FormatUtilities.FormatterCallback<PlotLineOrBand>;
    rotation?: number;
    style?: CSSObject;
    text?: string;
    textAlign?: AlignValue;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
}

export interface PlotLineOptions {
    acrossPanes?: boolean;
    className?: string;
    color?: ColorString;
    dashStyle?: DashStyleValue;
    events?: any;
    id?: string;
    label?: PlotLineLabelOptions;
    translatedValue?: number;
    value?: number;
    width?: number;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PlotLineOptions;
