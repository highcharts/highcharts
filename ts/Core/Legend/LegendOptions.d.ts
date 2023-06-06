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
} from '../Renderer/AlignObject';
import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type F from '../Templating';
import type Legend from './Legend';
import type ShadowOptionsObject from '../Renderer/ShadowOptionsObject';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Options' {
    interface Options {
        legend: LegendOptions;
    }
}

export interface LegendOptions {
    align: AlignValue;
    alignColumns: boolean;
    backgroundColor?: ColorType;
    borderColor: ColorType;
    borderRadius: number;
    borderWidth?: number;
    className: string;
    enabled: boolean;
    floating?: boolean;
    itemCheckboxStyle: CSSObject;
    itemDistance?: number;
    itemHiddenStyle: CSSObject;
    itemHoverStyle: CSSObject;
    itemMarginBottom: number;
    itemMarginTop: number;
    itemStyle: CSSObject;
    itemWidth?: number;
    layout: ('horizontal'|'vertical'|'proximate');
    labelFormat?: string;
    labelFormatter: F.FormatterCallback<Legend.Item>;
    /** @deprecated */
    lineHeight?: number;
    margin?: number;
    maxHeight?: number;
    navigation: LegendNavigationOptions;
    padding?: number;
    reversed?: boolean;
    rtl?: boolean;
    shadow: (boolean|Partial<ShadowOptionsObject>);
    squareSymbol: boolean;
    /** @deprecated */
    style?: CSSObject;
    symbolHeight?: number;
    symbolPadding: number;
    symbolRadius?: number;
    symbolWidth?: number;
    title: LegendTitleOptions;
    useHTML?: boolean;
    valueDecimals?: number;
    valueSuffix?: string;
    verticalAlign: VerticalAlignValue;
    width?: (number|string);
    x: number;
    y: number;
}

export interface LegendNavigationOptions {
    activeColor: ColorType;
    animation?: (boolean|Partial<AnimationOptions>);
    arrowSize?: number;
    enabled?: boolean;
    inactiveColor: ColorType;
    style?: CSSObject;
}

export interface LegendTitleOptions {
    style: CSSObject;
    text?: string;
    width?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default LegendOptions;
