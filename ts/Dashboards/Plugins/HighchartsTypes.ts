/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type ColorString from '../../Core/Color/ColorString';


/* *
 *
 *  Declarations
 *
 * */


export interface AnimationOptions {
}

export interface Axis {
    coll: AxisCollectionKey;
    dateTime?: unknown;
    max: (number|null);
    min: (number|null);
    options: Axis;
    series: Array<Series>;
    setExtremes(
        newMin?: number,
        newMax?: number,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>),
        eventArguments?: any
    ): void;
}

export type AxisCollectionKey = ('colorAxis'|'xAxis'|'yAxis'|'zAxis');

export interface AxisOptions {
    id?: string;
    events?: Partial<Record<string, (this: Axis) => void>>;
}

export interface Chart {
    new (
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Function
    ): Chart;
    axes: Array<Axis>;
    options: Options;
    resetZoomButton?: SVGElement;
    series: Array<Series>;
    tooltip: Tooltip;
    xAxis: Array<Axis>;
    yAxis: Array<Axis>;
    addSeries(
        options: SeriesOptions,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): Series;
    destroy(): void;
    redraw(
        animation?: (boolean|Partial<AnimationOptions>)
    ): void;
    reflow(
        e?: Event
    ): void;
    setSize(
        width?: (number|null),
        height?: (number|null),
        animation?: (boolean|Partial<AnimationOptions>)
    ): void;
    showResetZoom(): void;
    update(
        options: Partial<Options>,
        redraw?: boolean,
        oneToOne?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void;
    zoomOut(): void;
}

export interface ChartOptions {
    animation?: AnimationOptions;
    backgroundColor?: ColorString;
    type?: string;
}

export interface CreditsOptions {
    enabled?: boolean;
}

export interface LegendOptions {
    enabled?: boolean;
}

export interface Options {
    chart?: ChartOptions;
    credits?: CreditsOptions;
    legend?: LegendOptions;
    plotOptions?: Record<string, SeriesOptions>;
    series?: Array<SeriesOptions>;
    title?: TitleOptions;
    tooltip?: TooltipOptions;
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
}

export interface Point {
    index: number;
    isInside?: boolean;
    x: number;
    y: (number|null);
    series: Series;
}

export interface PointOptions {
    events?: Partial<Record<string, (this: Point) => void>>;
}

export type PointShortOptions = (
    number|
    string|
    Array<(number|string|null)>|
    null
);

export interface Series {
    new (options: SeriesOptions): Series;
    options: SeriesOptions;
    points: Array<Point>;
    visible?: boolean;
    destroy(): void;
    remove(
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>),
        withEvent?: boolean,
        keepEvents?: boolean
    ): void;
    setData(
        data: Array<(PointOptions|PointShortOptions)>,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>),
        updatePoints?: boolean
    ): void;
    setVisible(
        vis?: boolean,
        redraw?: boolean
    ): void;
    update(
        options: Partial<SeriesOptions>,
        redraw?: boolean
    ): void;
}

export interface SeriesMarkerOptions {
    enabled?: boolean;
}

export interface SeriesOptions {
    data?: Array<(PointOptions|PointShortOptions)>;
    id?: string;
    events?: Partial<Record<string, (this: Series) => void>>;
    name?: string;
    marker?: SeriesMarkerOptions;
    point?: PointOptions;
    type?: string;
}

export interface TitleOptions {
    text?: string;
}

export interface Tooltip {
    options: TooltipOptions;
    hide(
        delay?: number
    ): void;
    refresh(
        pointOrPoints: (Point|Array<Point>),
        mouseEvent?: PointerEvent
    ): void;
}

export interface TooltipOptions {
    outside?: boolean;
}


/* *
 *
 *  Namespace
 *
 * */


export declare namespace Highcharts {

    export function chart(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Function
    ): Chart;

    export function ganttChart(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Function
    ): Chart;

    export function mapChart(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Function
    ): Chart;

    export function stockChart(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Function
    ): Chart;

}


/* *
 *
 *  Default Export
 *
 * */


export default Highcharts;
