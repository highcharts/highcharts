/* *
 *
 *  (c) 2010-2023 Torstein Honsi
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

import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type F from '../../Core/FormatUtilities';
import type Point from '../../Core/Series/Point';
import type ShadowOptionsObject from '../../Core/Renderer/ShadowOptionsObject';
import type Time from '../../Core/Time';
import type Tooltip from './Tooltip';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        tooltip?: TooltipOptions;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        tooltip?: DeepPartial<TooltipOptions>;
    }
}

export interface TooltipOptions {
    animation: boolean;
    backgroundColor: ColorType;
    borderColor?: ColorType;
    borderRadius: number;
    borderWidth: number;
    className?: string;
    changeDecimals?: number;
    /** @deprecated */
    crosshairs?: any;
    dateTimeLabelFormats: Time.DateTimeLabelFormatsOption;
    distance?: number;
    enabled: boolean;
    followPointer?: boolean;
    followTouchMove?: boolean;
    footerFormat: string;
    formatter?: Tooltip.FormatterCallbackFunction;
    headerFormat: string;
    headerShape: Tooltip.ShapeValue;
    hideDelay: number;
    nullFormat?: string;
    nullFormatter?: Tooltip.FormatterCallbackFunction;
    outside?: boolean;
    padding: number;
    pointFormat: string;
    pointFormatter?: F.FormatterCallback<Point>;
    positioner?: Tooltip.PositionerCallbackFunction;
    shadow: (boolean|Partial<ShadowOptionsObject>);
    shape: Tooltip.ShapeValue;
    shared: boolean;
    snap: number;
    split?: boolean;
    stickOnContact: boolean;
    style: CSSObject;
    useHTML: boolean;
    /** @deprecated */
    userOptions?: TooltipOptions;
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
