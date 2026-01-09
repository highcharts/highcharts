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
    AxisOptions,
    YAxisOptions
} from '../../Core/Axis/AxisOptions';
import type ChartOptions from '../../Core/Chart/ChartOptions';
import type ColorType from '../../Core/Color/ColorType';
import type { DeepPartial } from '../../Shared/Types';
import type RangeSelector from '../RangeSelector/RangeSelector';
import type { SymbolTypeRegistry } from '../../Core/Renderer/SVG/SymbolType';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';
import type Utilities from '../../Core/Utilities';

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

        /**
         * Options for the corresponding navigator series if `showInNavigator`
         * is `true` for this series. Available options are the same as any
         * series, documented at [plotOptions](#plotOptions.series) and
         * [series](#series).
         *
         * These options are merged with options in [navigator.series](
         * #navigator.series), and will take precedence if the same option is
         * defined both places.
         *
         * @see [navigator.series](#navigator.series)
         *
         * @since   5.0.0
         * @product highstock
         */
        navigatorOptions?: SeriesOptions;

        showInNavigator?: boolean;
    }
}

export interface NavigatorHandlesOptions {
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: Utilities.RelativeSize;
    enabled?: boolean;
    height?: number;
    inverted?: boolean;
    lineWidth?: number;
    symbols?: Array<keyof SymbolTypeRegistry>;
    width?: number;
}

export interface BaseNavigatorOptions {
    maskFill?: ColorType;
    maskInside?: boolean;
    handles?: NavigatorHandlesOptions;
    height?: number;
    outlineColor?: ColorType;
    outlineWidth?: number;
    series?: SeriesTypeOptions;
    xAxis?: DeepPartial<AxisOptions>;
    yAxis?: DeepPartial<YAxisOptions>;
}

export interface NavigatorOptions extends BaseNavigatorOptions {
    adaptToUpdatedData?: boolean;
    baseSeries?: (number|string);
    enabled?: boolean;
    isInternal?: boolean;
    margin?: number;
    opposite?: boolean;
    stickToMax?: boolean;
    top?: number;
}

export interface StandaloneNavigatorOptions extends BaseNavigatorOptions {
    chart: ChartOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorOptions;
