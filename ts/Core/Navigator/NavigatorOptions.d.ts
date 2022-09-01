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
} from '../Axis/AxisOptions';
import type ColorType from '../Color/ColorType';
import type RangeSelector from '../../Extensions/RangeSelector';
import type { SeriesTypeOptions } from '../Series/SeriesType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Axis/AxisOptions' {
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

declare module '../Options'{
    interface Options {
        navigator?: NavigatorOptions;
    }
}

declare module '../Series/SeriesOptions' {
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
    lineWidth?: number;
    symbols?: Array<string>;
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
