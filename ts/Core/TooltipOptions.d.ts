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

import type ColorType from './Color/ColorType';
import type CSSObject from './Renderer/CSSObject';
import type F from './FormatUtilities';
import type ShadowOptionsObject from './Renderer/ShadowOptionsObject';
import type Tooltip from './Tooltip';
import Point from '../Core/Series/Point.js';

/* *
 *
 *  Declarations
 *
 * */

declare module './Options' {
    interface Options {
        tooltip?: TooltipOptions;
    }
}

export interface TooltipOptions {
    animation?: boolean;
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    className?: string;
    changeDecimals?: number;
    /** @deprecated */
    crosshairs?: any;
    dateTimeLabelFormats?: Record<string, string>;
    enabled?: boolean;
    followPointer?: boolean;
    followTouchMove?: boolean;
    footerFormat?: string;
    formatter?: Tooltip.TooltipFormatterCallbackFunction;
    headerFormat?: string;
    headerShape?: Tooltip.TooltipShapeValue;
    hideDelay?: number;
    nullFormat?: string;
    nullFormatter?: Tooltip.TooltipFormatterCallbackFunction;
    outside?: boolean;
    padding?: number;
    pointFormat?: string;
    pointFormatter?: F.FormatterCallback<Point>;
    positioner?: Tooltip.TooltipPositionerCallbackFunction;
    shadow?: (boolean|Partial<ShadowOptionsObject>);
    shape?: Tooltip.TooltipShapeValue;
    shared?: boolean;
    snap?: number;
    split?: boolean;
    stickOnContact?: boolean;
    style?: CSSObject;
    useHTML?: boolean;
    valueDecimals?: number;
    valuePrefix?: string;
    valueSuffix?: string;
    xDateFormat?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default TooltipOptions;
