/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type { EventCallback } from '../Callback';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type F from '../Templating';
import type Legend from './Legend';
import type PointerEvent from '../PointerEvent';
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

declare module '../Series/SeriesOptions' {
    interface SeriesEventsOptions {
        legendItemClick?: LegendItemClickCallback;
    }
}

export interface LegendEventsOptions {
    itemClick?: EventCallback<Legend, Event>
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
    events?: LegendEventsOptions;
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
    maxWidth?: number|string;
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

export type LegendItemClickCallback = EventCallback<PointerEvent>;

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
