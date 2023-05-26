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

import type { AlignValue } from '../Renderer/AlignObject';
import type Axis from './Axis';
import type Chart from '../Chart/Chart';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type EventCallback from '../EventCallback';
import type FormatterCallback from '../FormatterCallback';
import type GradientColor from '../Color/GradientColor';
import type { OptionsOverflowValue } from '../Options';
import type Point from '../Series/Point';
import type { SymbolKey } from '../Renderer/SVG/SymbolType';
import type Tick from './Tick';
import type TickPositionsArray from './TickPositionsArray';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options'{
    interface Options {
        xAxis?: (DeepPartial<XAxisOptions>|Array<DeepPartial<XAxisOptions>>);
        yAxis?: (DeepPartial<YAxisOptions>|Array<DeepPartial<YAxisOptions>>);
    }
}

export type AxisCollectionKey = ('colorAxis'|'xAxis'|'yAxis'|'zAxis');

export interface AxisCrosshairLabelOptions {
    align?: AlignValue;
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    enabled?: boolean;
    format?: string;
    formatter?: FormatterCallback<Axis, number>;
    padding?: number;
    shape?: SymbolKey;
    style?: CSSObject;
}

export interface AxisCrosshairOptions {
    className?: string;
    color?: ColorType;
    dashStyle?: DashStyleValue;
    label?: AxisCrosshairLabelOptions;
    snap?: boolean;
    width?: number;
    zIndex?: number;
}

export interface AxisEventsOptions {
    afterBreaks?: EventCallback<Axis>;
    afterSetExtremes?: AxisSetExtremesEventCallback;
    pointBreak?: AxisPointBreakEventCallback;
    pointInBreak?: AxisPointBreakEventCallback;
    setExtremes?: AxisSetExtremesEventCallback;
}

export type AxisLabelFormatterCallback = FormatterCallback<
AxisLabelFormatterContextObject,
AxisLabelFormatterContextObject
>;

export interface AxisLabelFormatterContextObject {
    axis: Axis;
    chart: Chart;
    dateTimeLabelFormat?: string;
    isFirst: boolean;
    isLast: boolean;
    pos: number;
    text?: string;
    tick: Tick;
    value: number|string;
}

export interface AxisLabelOptions {
    align?: AlignValue;
    allowOverlap?: boolean;
    autoRotation?: Array<number>;
    autoRotationLimit: number;
    distance: number;
    enabled: boolean;
    format?: string;
    formatter?: FormatterCallback<AxisLabelFormatterContextObject, AxisLabelFormatterContextObject>;
    indentation: number;
    overflow: OptionsOverflowValue;
    padding: number;
    reserveSpace?: boolean;
    rotation?: number|'auto';
    staggerLines: number;
    step: number;
    style: CSSObject;
    useHTML: boolean;
    x?: number;
    y?: number;
    zIndex: number;
}

export interface AxisOptions {
    alignTicks: boolean;
    allowDecimals?: boolean;
    alternateGridColor?: ColorType;
    categories?: Array<string>;
    ceiling?: number;
    className?: string;
    crosshair?: (boolean|AxisCrosshairOptions);
    crossing?: number;
    endOnTick: boolean;
    events?: AxisEventsOptions;
    floor?: number;
    gridLineColor: ColorType;
    gridLineDashStyle: DashStyleValue;
    gridLineWidth?: number;
    gridZIndex: number;
    height?: (number|string);
    id?: string;
    labels: AxisLabelOptions;
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
    minorTickPosition: AxisTickPositionValue;
    minorTicks?: boolean;
    minorTicksPerMajor: number;
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
    tickmarkPlacement: ('between'|'on');
    tickPixelInterval: number;
    tickPosition: AxisTickPositionValue;
    tickPositioner?: AxisTickPositionerCallback;
    tickPositions?: TickPositionsArray;
    tickWidth?: number;
    title: AxisTitleOptions;
    top?: (number|string);
    type: ('linear'|'logarithmic'|'datetime'|'category'|'treegrid');
    uniqueNames: boolean;
    visible: boolean;
    width?: (number|string);
    zIndex: number;
    zoomEnabled: boolean;
}

export interface AxisPointBreakEventCallback {
    (this: Axis, evt: AxisPointBreakEventObject): void;
}

export interface AxisPointBreakEventObject {
    brk: Record<string, number>;
    point: Point;
    preventDefault: Function;
    target: SVGElement;
    type: ('pointBreak'|'pointInBreak');
}

export interface AxisSetExtremesEventCallback {
    (this: Axis, evt: AxisSetExtremesEventObject): void;
}

export interface AxisSetExtremesEventObject extends Axis.ExtremesObject {
    preventDefault: Function;
    target: SVGElement;
    trigger: string;
    type: 'setExtremes';
}

export interface AxisTickPositionerCallback {
    (
        this: Axis,
        min: number,
        max: number
    ): (TickPositionsArray|undefined);
}

export type AxisTickPositionValue = ('inside'|'outside');

export interface AxisTitleOptions {
    align: ('high'|'low'|'middle');
    enabled?: boolean;
    margin?: number;
    offset?: number;
    reserveSpace?: boolean;
    rotation: number;
    style: CSSObject;
    text?: (string|null);
    textAlign?: AlignValue;
    useHTML: boolean;
    x: number;
    y: number;
}

export interface XAxisOptions extends AxisOptions {
    // nothing here yet
}

export interface YAxisOptions extends AxisOptions {
    maxColor?: ColorType;
    minColor?: ColorType;
    staticScale?: number;
    stops?: GradientColor['stops'];
    tooltipValueFormat?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisOptions;
