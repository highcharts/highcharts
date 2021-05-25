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

import type ColorType from '../Color/ColorType';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type TickPositionsArray from './TickPositionsArray';

/* *
 *
 *  Declarations
 *
 * */

export type AxisMinorTickPositionValue = ('inside'|'outside');

export interface AxisOptions {
    accessibility?: Highcharts.XAxisAccessibilityOptions;
    alignTicks: boolean;
    allowDecimals?: boolean;
    alternateGridColor?: ColorType;
    breaks?: Array<Highcharts.XAxisBreaksOptions>;
    categories?: Array<string>;
    ceiling?: number;
    className?: string;
    crosshair?: (boolean|Highcharts.XAxisCrosshairOptions);
    endOnTick: boolean;
    events?: Highcharts.XAxisEventsOptions;
    floor?: number;
    gridLineColor: ColorType;
    gridLineDashStyle: DashStyleValue;
    gridLineWidth?: number;
    gridZIndex: number;
    height?: (number|string);
    id?: string;
    isX?: boolean;
    labels: Highcharts.XAxisLabelsOptions;
    left?: (number|string);
    lineColor: ColorType;
    lineWidth: number;
    linkedTo?: number;
    margin?: number;
    max?: (null|number);
    maxPadding: number;
    maxRange?: number;
    maxZoom?: number;
    min?: (null|number);
    minorGridLineColor: ColorType;
    minorGridLineDashStyle: DashStyleValue;
    minorGridLineWidth: number;
    minorTickColor: ColorType;
    minorTickInterval?: ('auto'|null|number);
    minorTickLength: number;
    minorTickPosition: AxisMinorTickPositionValue;
    minorTicks?: boolean;
    minorTickWidth?: number;
    minPadding: number;
    minRange?: number;
    minTickInterval?: number;
    offset?: number;
    offsets?: [number, number, number, number];
    opposite: boolean;
    ordinal?: boolean;
    overscroll?: number;
    pane?: number;
    panningEnabled: boolean;
    range?: number;
    reversed?: boolean;
    reversedStacks: boolean;
    showEmpty: boolean;
    showFirstLabel: boolean;
    showLastLabel: boolean;
    side?: number;
    softMax?: number;
    softMin?: number;
    startOfWeek: number;
    startOnTick: boolean;
    tickAmount?: number;
    tickColor: ColorType;
    tickInterval?: number;
    tickLength: number;
    tickmarkPlacement: Highcharts.AxisTickmarkPlacementValue;
    tickPixelInterval: number;
    tickPosition: Highcharts.AxisTickPositionValue;
    tickPositioner?: Highcharts.AxisTickPositionerCallbackFunction;
    tickPositions?: TickPositionsArray;
    tickWidth?: number;
    title: Highcharts.XAxisTitleOptions;
    top?: (number|string);
    type: Highcharts.AxisTypeValue;
    uniqueNames: boolean;
    visible: boolean;
    width?: (number|string);
    zIndex: number;
    zoomEnabled: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisOptions;
