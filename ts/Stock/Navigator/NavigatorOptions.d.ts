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
    AxisOptions,
    YAxisOptions
} from '../../Core/Axis/AxisOptions';
import type ColorType from '../../Core/Color/ColorType';
import type RangeSelector from '../RangeSelector/RangeSelector';
import type { SymbolTypeRegistry } from '../../Core/Renderer/SVG/SymbolType';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        maxRange?: number;
        toFixedRange?: (
            pxMin: number,
            pxMax: number,
            fixedMin: number,
            fixedMax: number
        ) => RangeSelector.RangeObject;
    }
}

declare module '../../Core/Options'{
    interface Options {
        navigator?: NavigatorOptions;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        fillOpacity?: number;
        navigatorOptions?: SeriesOptions;
        showInNavigator?: boolean;
    }
}

export interface NavigatorHandlesOptions {
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    enabled?: boolean;
    height?: number;
    inverted?: boolean;
    lineWidth?: number;
    symbols?: Array<keyof SymbolTypeRegistry>;
    width?: number;
}

export interface NavigatorOptions {
    adaptToUpdatedData?: boolean;
    baseSeries?: (number|string);
    enabled?: boolean;
    handles?: NavigatorHandlesOptions;
    height?: number;
    isInternal?: boolean;
    margin?: number;
    maskFill?: ColorType;
    maskInside?: boolean;
    opposite?: boolean;
    outlineColor?: ColorType;
    outlineWidth?: number;
    series?: SeriesTypeOptions;
    stickToMax?: boolean;
    top?: number;
    xAxis?: DeepPartial<AxisOptions>;
    yAxis?: DeepPartial<YAxisOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorOptions;
