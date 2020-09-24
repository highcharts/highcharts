/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type AnimationOptionsObject from '../Core/Animation/AnimationOptionsObject';
import type { AxisType } from '../Core/Axis/Types';
import type BaseSeries from '../Core/Series/Series';
import type Chart from '../Core/Chart/Chart';
import type ColorType from '../Core/Color/ColorType';
import type Point from '../Core/Series/Point';
import type { SeriesOptionsType } from '../Core/Series/Types';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import CartesianSeries from '../Core/Series/CartesianSeries.js';
import H from '../Core/Globals.js';

/**
 * @private
 */
declare module '../Core/Series/Types' {
    interface SeriesTypeRegistry {
        line: typeof Highcharts.LineSeries;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class LinePoint extends Point {
            public options: LinePointOptions;
            public series: LineSeries;
        }
        class LineSeries extends Series {
            public data: Array<LinePoint>;
            public options: LineSeriesOptions;
            public pointClass: typeof LinePoint;
            public points: Array<LinePoint>;
        }
        class Series extends BaseSeries {
            public constructor(chart?: Chart, options?: SeriesOptionsType);
            public _i: number;
            public animationTimeout?: number;
            public area?: SVGElement;
            public axisTypes: Array<string>;
            public basePointRange?: number;
            public buildingKdTree?: boolean;
            public chart: Chart;
            public clips?: Array<SVGElement>;
            public closestPointRange?: number;
            public closestPointRangePx?: number;
            public coll: 'series';
            public color?: (ColorType);
            public colorCounter: number;
            public colorIndex?: number;
            public cropped?: boolean;
            public cropShoulder: number;
            public data: Array<Point>;
            public dataMax?: number;
            public dataMin?: number;
            public directTouch: boolean;
            public drawLegendSymbol: (
                LegendSymbolMixin['drawLineMarker']|
                LegendSymbolMixin['drawRectangle']
            );
            public enabledDataSorting?: boolean;
            public eventOptions: Dictionary<EventCallbackFunction<Series>>;
            public eventsToUnbind: Array<Function>;
            public fillColor?: ColorType;
            public finishedAnimating?: boolean;
            public getExtremesFromAll?: boolean;
            public graph?: SVGElement;
            public graphPath?: SVGPath;
            public group?: SVGElement;
            public hasCartesianSeries?: Chart['hasCartesianSeries'];
            public hasRendered?: boolean;
            public hcEvents: Dictionary<Array<EventWrapperObject<Series>>>;
            public id?: string;
            public isCartesian: boolean;
            public isDirty: boolean;
            public isDirtyData: boolean;
            public isRadialSeries?: boolean;
            public kdAxisArray: Array<string>;
            public kdTree?: KDNode;
            public linkedSeries: Array<Series>;
            public markerGroup?: SVGElement;
            public name: string;
            public opacity?: number;
            public optionalAxis?: string;
            public options: BaseSeries.Options;
            public parallelArrays: Array<string>;
            public pointClass: typeof Point;
            public pointInterval?: number;
            public points: Array<Point>;
            public pointValKey?: string;
            public processedXData: Array<number>;
            public processedYData: (Array<number>|Array<Array<number>>);
            public requireSorting: boolean;
            public selected: boolean;
            public sharedClipKey?: string;
            public sorted: boolean;
            public state: string;
            public stickyTracking: boolean;
            public symbol?: string;
            public tooltipOptions: TooltipOptions;
            public type: string;
            public userOptions: DeepPartial<BaseSeries.Options>;
            public visible: boolean;
            public xAxis: AxisType;
            public xData?: Array<number>;
            public xIncrement?: (number|null);
            public yAxis: AxisType;
            public yData?: (
                Array<(number|null|undefined)>|
                Array<Array<(number|null|undefined)>>
            );
            public zoneAxis?: string;
            public zones: Array<SeriesZonesOptions>;
            public afterAnimate(): void;
            public animate(init?: boolean): void;
            public applyExtremes(): DataExtremesObject;
            public applyZones(): void;
            public autoIncrement(): number;
            public bindAxes(): void;
            public buildKDTree(e?: PointerEventObject): void;
            public cropData(
                xData: Array<number>,
                yData: (
                    Array<(number|null|undefined)>|
                    Array<Array<(number|null|undefined)>>
                ),
                min: number,
                max: number,
                cropShoulder?: number
            ): SeriesCropDataObject;
            public destroy(keepEventsForUpdate?: boolean): void;
            public drawGraph(): void;
            public drawPoints(): void;
            public findPointIndex(
                optionsObject: PointOptionsObject,
                fromIndex: number
            ): (number|undefined);
            public generatePoints(): void;
            public getClipBox(
                animation?: (boolean|Partial<AnimationOptionsObject>),
                finalBox?: boolean
            ): Dictionary<number>;
            public getColor(): void;
            public getPointsCollection(): Array<Point>;
            public getCyclic(
                prop: string,
                value?: any,
                defaults?: Dictionary<any>
            ): void;
            public getExtremes(
                yData?: (Array<number>|Array<Array<number>>),
                forceExtremesFromAll?: boolean
            ): DataExtremesObject;
            public getName(): string;
            public getGraphPath(
                points: Array<Point>,
                nullsAsZeroes?: boolean,
                connectCliffs?: boolean
            ): SVGPath;
            public getPlotBox(): SeriesPlotBoxObject;
            public getProcessedData(
                forceExtremesFromAll?: boolean
            ): SeriesProcessedDataObject;
            public getSymbol(): void;
            public getValidPoints(
                points?: Array<Point>,
                insideOnly?: boolean,
                allowNull?: boolean
            ): Array<Point>;
            public getXExtremes(xData: Array<number>): RangeObject;
            public getFirstValidPoint (
                this: Highcharts.Series,
                data: Array<PointOptionsType>
            ): PointOptionsType;
            public getZonesGraphs(
                props: Array<Array<string>>
            ): Array<Array<string>>;
            public hasData(): boolean;
            public init(chart: Chart, options: SeriesOptionsType): void;
            public insert(collection: Array<BaseSeries>): number;
            public invertGroups(inverted?: boolean): void;
            public is (type: string): boolean;
            public isPointInside (point: Dictionary<number>|Point): boolean;
            public markerAttribs(point: Point, state?: string): SVGAttributes;
            public plotGroup(
                prop: string,
                name: string,
                visibility: string,
                zIndex?: number,
                parent?: SVGElement
            ): SVGElement;
            public pointAttribs(point?: Point, state?: string): SVGAttributes;
            public pointPlacementToXValue(): number;
            public processData(force?: boolean): (boolean|undefined);
            public redraw(): void;
            public redrawPoints(): void;
            public removeEvents(keepEventsForUpdate?: boolean): void;
            public render(): void;
            public searchKDTree(
                point: KDPointSearchObject,
                compareX?: boolean,
                e?: PointerEventObject
            ): (Point|undefined);
            public searchPoint(
                e: PointerEventObject,
                compareX?: boolean
            ): (Point|undefined);
            public setClip(animation?: (boolean|AnimationOptionsObject)): void;
            public setData(
                data: Array<PointOptionsType>,
                redraw?: boolean,
                animation?: (boolean|Partial<AnimationOptionsObject>),
                updatePoints?: boolean
            ): void;
            public setDataSortingOptions(): void;
            public setOptions(
                itemOptions: SeriesOptionsType
            ): this['options'];
            public sortData(
                data: Array<PointOptionsType>
            ): Array<PointOptionsObject>;
            public toYData(point: Point): Array<number>;
            public translate(): void;
            public updateData(
                data: Array<PointOptionsType>,
                animation?: (boolean|Partial<AnimationOptionsObject>)
            ): boolean;
            public updateParallelArrays(point: Point, i: (number|string)): void;
        }
        interface LinePointOptions extends PointOptionsObject {
        }
        interface LineSeriesOptions extends SeriesOptions {
            states?: SeriesStatesOptionsObject<LineSeries>;
        }
    }
}

H.Series = CartesianSeries as typeof Highcharts.LineSeries; // backwards compatibility

export default H.Series as typeof Highcharts.LineSeries;
