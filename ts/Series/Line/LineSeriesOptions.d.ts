/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type { CursorValue } from '../../Core/Renderer/CSSObject';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type LineSeries from './LineSeries';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type ShadowOptionsObject from '../../Core/Renderer/ShadowOptionsObject';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        allowPointSelect?: boolean;
        dataSorting?: Highcharts.DataSortingOptionsObject; // cartasian series
        getExtremesFromAll?: boolean;
        pointValKey?: string;
        selected?: boolean;
    }
    interface SeriesStateHoverOptions {
        radius?: number;
        radiusPlus?: number;
    }
}

export interface LineSeriesOptions extends SeriesOptions {
    allAreas?: boolean;
    animation?: (boolean|DeepPartial<AnimationOptions>);
    animationLimit?: number;
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    className?: string;
    clip?: boolean;
    colorAxis?: boolean;
    colorByPoint?: boolean;
    colors?: Array<ColorType>;
    connectEnds?: boolean;
    connectNulls?: boolean;
    crisp?: boolean|number;
    cursor?: (string|CursorValue);
    dashStyle?: DashStyleValue;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    dataSorting?: Highcharts.DataSortingOptionsObject;
    description?: string;
    findNearestPointBy?: Highcharts.SeriesFindNearestPointByValue;
    id?: string;
    index?: number;
    includeInDataExport?: boolean;
    isInternal?: boolean;
    joinBy?: (string|Array<string>);
    kdNow?: boolean;
    keys?: Array<string>;
    legendIndex?: number;
    linecap?: Highcharts.SeriesLinecapValue;
    lineColor?: ColorType;
    lineWidth?: number;
    linkedTo?: string;
    navigatorOptions?: SeriesOptions;
    opacity?: number;
    pointDescriptionFormatter?: Function;
    pointPlacement?: (number|string);
    pointStart?: number;
    shadow?: (boolean|Partial<ShadowOptionsObject>);
    showInNavigator?: boolean;
    skipKeyboardNavigation?: boolean;
    states?: SeriesStatesOptions<LineSeries>;
    step?: Highcharts.SeriesStepValue;
    supportingColor?: ColorType;
    visible?: boolean;
    xAxis?: (number|string);
    yAxis?: (number|string);
    zIndex?: number;
    zoneAxis?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
