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
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type FormatUtilities from '../../FormatUtilities';
import type PlotLineOrBand from './PlotLineOrBand';

/* *
 *
 *  Declarations
 *
 * */

export interface PlotBandLabelOptions {
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

export interface PlotBandOptions {
    acrossPanes?: boolean;
    borderColor?: ColorString;
    borderWidth?: number;
    className?: string;
    color?: ColorType;
    events?: any;
    from?: number;
    id?: string;
    label?: PlotBandLabelOptions;
    to?: number;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PlotBandOptions;
