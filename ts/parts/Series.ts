/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

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
        class Series {
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
            public color?: (ColorString|GradientColorObject|PatternObject);
            public colorCounter: number;
            public colorIndex?: number;
            public cropped?: boolean;
            public cropShoulder: number;
            public data: Array<Point>;
            public dataMax: number;
            public dataMin: number;
            public directTouch: boolean;
            public drawLegendSymbol: (
                LegendSymbolMixin['drawLineMarker']|
                LegendSymbolMixin['drawRectangle']
            );
            public eventOptions: Dictionary<EventCallbackFunction<Series>>;
            public fillColor?: (ColorString|GradientColorObject|PatternObject);
            public finishedAnimating?: boolean;
            public getExtremesFromAll?: boolean;
            public graph?: SVGElement;
            public graphPath?: SVGPathArray;
            public group?: SVGElement;
            public hasCartesianSeries?: Chart['hasCartesianSeries'];
            public hasRendered?: boolean;
            public hcEvents: Dictionary<Array<EventWrapperObject<Series>>>;
            public id?: string;
            public isCartesian: boolean;
            public isDirty: boolean;
            public isDirtyData: boolean;
            public kdAxisArray: Array<string>;
            public kdTree?: KDNode;
            public linkedSeries: Array<Series>;
            public markerGroup?: SVGElement;
            public name: string;
            public optionalAxis?: string;
            public options: SeriesOptionsType;
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
            public userOptions: SeriesOptionsType;
            public visible: boolean;
            public xAxis: Axis;
            public xData?: Array<number>;
            public xIncrement?: (number|null);
            public yAxis: Axis;
            public yData?: (
                Array<(number|null|undefined)>|
                Array<Array<(number|null|undefined)>>
            );
            public zoneAxis?: string;
            public zones: Array<SeriesZonesOptions>;
            public afterAnimate(): void;
            public animate(init?: boolean): void;
            public applyZones(): void;
            public autoIncrement(): void;
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
            public destroy(keepEvents?: boolean): void;
            public drawGraph(): void;
            public drawPoints(): void;
            public findPointIndex(
                optionsObject: PointOptionsObject,
                fromIndex: number
            ): (number|undefined);
            public generatePoints(): void;
            public getClipBox(
                animation?: (boolean|AnimationOptionsObject),
                finalBox?: boolean
            ): Dictionary<number>;
            public getColor(): void;
            public getCyclic(
                prop: string,
                value?: any,
                defaults?: Dictionary<any>
            ): void;
            public getExtremes(yData?: Array<number>): void;
            public getName(): string;
            public getGraphPath(
                points: Array<Point>,
                nullsAsZeroes?: boolean,
                connectCliffs?: boolean
            ): SVGPathArray;
            public getPlotBox(): SeriesPlotBoxObject;
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
            public insert(collection: Array<Series>): number;
            public invertGroups(inverted?: boolean): void;
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
                animation?: (boolean|AnimationOptionsObject),
                updatePoints?: boolean
            ): void;
            public setOptions(
                itemOptions: SeriesOptionsType
            ): this['options'];
            public toYData(point: Point): Array<number>;
            public translate(): void;
            public updateData(data: Array<PointOptionsType>): boolean;
            public updateParallelArrays(point: Point, i: (number|string)): void;
        }
        interface Chart {
            runTrackerClick?: boolean;
        }
        interface KDNode {
            [side: string]: (KDNode|Point|undefined);
            left?: KDNode;
            point: Point;
            right?: KDNode;
        }
        interface KDPointSearchObject {
            clientX: number;
            plotY?: number;
        }
        interface LinePointOptions extends PointOptionsObject {
        }
        interface LineSeriesOptions extends SeriesOptions {
            states?: SeriesStatesOptionsObject<LineSeries>;
        }
        interface Point {
            category?: string;
            clientX?: number;
            dataGroup?: DataGroupingInfoObject;
            dist?: number;
            distX?: number;
            hasImage?: boolean;
            index?: number;
            isInside?: boolean;
            low?: number;
            negative?: boolean;
            options: PointOptionsObject;
            plotX?: number;
            plotY?: number;
            stackTotal?: number;
            stackY?: (number|null);
            yBottom?: number;
            zone?: SeriesZonesOptions;
        }
        interface SeriesAfterAnimateCallbackFunction {
            (this: Series, event: SeriesAfterAnimateEventObject): void;
        }
        interface SeriesAfterAnimateEventObject {
            target: Series;
            type: 'afterAnimate';
        }
        interface SeriesCheckboxClickCallbackFunction {
            (this: Series, event: SeriesCheckboxClickEventObject): void;
        }
        interface SeriesCheckboxClickEventObject {
            checked: boolean;
            item: Series;
            target: Series;
            type: 'checkboxClick';
        }
        interface SeriesClickCallbackFunction {
            (this: Series, event: SeriesClickEventObject): void;
        }
        interface SeriesClickEventObject extends Event {
            point: Point;
        }
        interface SeriesCropDataObject {
            end: number;
            start: number;
            xData: Array<number>;
            yData: (Array<number>|Array<Array<number>>);
        }
        interface SeriesEventsOptions {
            afterAnimate?: SeriesAfterAnimateCallbackFunction;
            checkboxClick?: SeriesCheckboxClickCallbackFunction;
            click?: SeriesClickCallbackFunction;
            hide?: SeriesHideCallbackFunction;
            legendItemClick?: SeriesLegendItemClickCallbackFunction;
            mouseOut?: SeriesMouseOutCallbackFunction;
            mouseOver?: SeriesMouseOverCallbackFunction;
            show?: SeriesShowCallbackFunction;
        }
        interface SeriesHideCallbackFunction {
            (this: Series, event: Event): void;
        }
        interface SeriesLegendItemClickCallbackFunction {
            (this: Series, event: SeriesLegendItemClickEventObject): void;
        }
        interface SeriesLegendItemClickEventObject {
            browserEvent: PointerEvent;
            preventDefault: Function;
            target: Series;
            type: 'checkboxClick';
        }
        interface SeriesMouseOutCallbackFunction {
            (this: Series, event: PointerEvent): void;
        }
        interface SeriesMouseOverCallbackFunction {
            (this: Series, event: PointerEvent): void;
        }
        interface SeriesOptions {
            allAreas?: boolean;
            allowPointSelect?: boolean;
            animation?: (boolean|AnimationOptionsObject);
            animationLimit?: number;
            boostThreshold?: number;
            borderColor?: ColorType;
            borderWidth?: number;
            className?: string;
            clip?: boolean;
            color?: ColorType;
            colorAxis?: boolean;
            colorByPoint?: boolean;
            colorIndex?: number;
            colors?: Array<ColorType>;
            connectEnds?: boolean;
            connectNulls?: boolean;
            cropThreshold?: number;
            cursor?: (string|CursorValue);
            dashStyle?: DashStyleValue;
            data?: Array<PointOptionsType>;
            dataGrouping?: DataGroupingOptionsObject;
            dataLabels?: (
                DataLabelsOptionsObject|Array<DataLabelsOptionsObject>
            );
            description?: string;
            enableMouseTracking?: boolean;
            events?: SeriesEventsOptions;
            findNearestPointBy?: SeriesFindNearestPointByValue;
            getExtremesFromAll?: boolean;
            grouping?: boolean;
            id?: string;
            index?: number;
            includeInDataExport?: boolean;
            isInternal?: boolean;
            joinBy?: (string|Array<string>);
            kdNow?: boolean;
            keys?: Array<string>;
            legendIndex?: number;
            linecap?: SeriesLinecapValue;
            lineColor?: ColorType;
            lineWidth?: number;
            linkedTo?: string;
            marker?: PointMarkerOptionsObject;
            name?: string;
            navigatorOptions?: SeriesOptions;
            negativeColor?: ColorType;
            negativeFillColor?: ColorType;
            opacity?: number;
            point?: PlotSeriesPointOptions;
            pointDescriptionFormatter?: Function;
            pointInterval?: number;
            pointIntervalUnit?: SeriesPointIntervalUnitValue;
            pointPlacement?: (number|string);
            pointRange?: (number|null);
            pointStart?: number;
            pointValKey?: string;
            selected?: boolean;
            shadow?: (boolean|ShadowOptionsObject);
            showCheckbox?: boolean;
            showInLegend?: boolean;
            showInNavigator?: boolean;
            skipKeyboardNavigation?: boolean;
            softThreshold?: boolean;
            stack?: (number|string);
            stacking?: OptionsStackingValue;
            startFromThreshold?: boolean;
            states?: SeriesStatesOptionsObject<Series>;
            step?: SeriesStepValue;
            stickyTracking?: boolean;
            supportingColor?: ColorType;
            threshold?: number;
            turboThreshold?: number;
            type?: string;
            visible?: boolean;
            xAxis?: (number|string);
            yAxis?: (number|string);
            zIndex?: number;
            zoneAxis?: string;
            zones?: Array<SeriesZonesOptions>;
        }
        interface SeriesPlotBoxObject {
            scaleX?: number;
            scaleY?: number;
            translateX?: number;
            translateY?: number;
        }
        interface SeriesShowCallbackFunction {
            (this: Series, event: Event): void;
        }
        interface SeriesStatesHoverHaloOptions {
            attributes?: SVGAttributes;
            opacity?: number;
            size?: number;
        }
        interface SeriesStatesHoverOptionsObject {
            animation?: (boolean|AnimationOptionsObject);
            enabled?: boolean;
            halo?: (boolean|SeriesStatesHoverHaloOptions);
            lineWidth?: SeriesOptions['lineWidth'];
            lineWidthPlus?: number;
            opacity?: SeriesOptions['opacity'];
        }
        interface SeriesStatesInactiveOptionsObject {
        }
        interface SeriesStatesOptionsObject<TSeries extends Series> {
            hover?: (
                SeriesStatesHoverOptionsObject&
                SeriesStateOptionsObject<TSeries>
            );
            inactive?: (
                SeriesStatesInactiveOptionsObject&
                SeriesStateOptionsObject<TSeries>
            );
            normal?: SeriesStateOptionsObject<TSeries>;
            select?: (
                SeriesStatesHoverOptionsObject&
                SeriesStateOptionsObject<TSeries>
            );
        }
        interface SeriesTypesDictionary {
            line: typeof LineSeries;
        }
        interface SeriesZonesOptions {
            className?: string;
            color?: (ColorString|GradientColorObject|PatternObject);
            dashStyle?: DashStyleValue;
            fillColor?: (ColorString|GradientColorObject|PatternObject);
            value?: number;
        }
        type SeriesLinecapValue = ('butt'|'round'|'square'|string);
        type SeriesFindNearestPointByValue = ('x'|'xy');
        type SeriesOptionsType = SeriesOptions;
        type SeriesPointIntervalUnitValue = ('day'|'month'|'year');
        type SeriesStepValue = ('center'|'left'|'right');
        type SeriesStateOptionsObject<TSeries extends Series> = (
            Omit<TSeries['options'], ('states'|'data')>
        );
        type SeriesStateValue = keyof SeriesStatesOptionsObject<Series>;
    }
}

/**
 * This is a placeholder type of the possible series options for
 * [Highcharts](../highcharts/series), [Highstock](../highstock/series),
 * [Highmaps](../highmaps/series), and [Gantt](../gantt/series).
 *
 * In TypeScript is this dynamically generated to reference all possible types
 * of series options.
 *
 * @ignore-declaration
 * @typedef {Highcharts.SeriesOptions|Highcharts.Dictionary<*>} Highcharts.SeriesOptionsType
 */

/**
 * Function callback when a series has been animated.
 *
 * @callback Highcharts.SeriesAfterAnimateCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesAfterAnimateEventObject} event
 *        Event arguments.
 */

/**
 * Event information regarding completed animation of a series.
 *
 * @interface Highcharts.SeriesAfterAnimateEventObject
 *//**
 * Animated series.
 * @name Highcharts.SeriesAfterAnimateEventObject#target
 * @type {Highcharts.Series}
 *//**
 * Event type.
 * @name Highcharts.SeriesAfterAnimateEventObject#type
 * @type {"afterAnimate"}
 */

/**
 * Function callback when the checkbox next to the series' name in the legend is
 * clicked.
 *
 * @callback Highcharts.SeriesCheckboxClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesCheckboxClickEventObject} event
 *        Event arguments.
 */

/**
 * Event information regarding check of a series box.
 *
 * @interface Highcharts.SeriesCheckboxClickEventObject
 *//**
 * Whether the box has been checked.
 * @name Highcharts.SeriesCheckboxClickEventObject#checked
 * @type {boolean}
 *//**
 * Related series.
 * @name Highcharts.SeriesCheckboxClickEventObject#item
 * @type {Highcharts.Series}
 *//**
 * Related series.
 * @name Highcharts.SeriesCheckboxClickEventObject#target
 * @type {Highcharts.Series}
 *//**
 * Event type.
 * @name Highcharts.SeriesCheckboxClickEventObject#type
 * @type {"checkboxClick"}
 */

/**
 * Function callback when a series is clicked. Return false to cancel toogle
 * actions.
 *
 * @callback Highcharts.SeriesClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesClickEventObject} event
 *        Event arguments.
 */

/**
 * Common information for a click event on a series.
 *
 * @interface Highcharts.SeriesClickEventObject
 * @extends global.Event
 *//**
 * Nearest point on the graph.
 * @name Highcharts.SeriesClickEventObject#point
 * @type {Highcharts.Point}
 */

/**
 * Gets fired when the series is hidden after chart generation time, either by
 * clicking the legend item or by calling `.hide()`.
 *
 * @callback Highcharts.SeriesHideCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {global.Event} event
 *        The event that occured.
 */

/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin` of a line
 * graph.
 *
 * @typedef {"butt"|"round"|"square"|string} Highcharts.SeriesLinecapValue
 */

/**
 * Gets fired when the legend item belonging to the series is clicked. The
 * default action is to toggle the visibility of the series. This can be
 * prevented by returning `false` or calling `event.preventDefault()`.
 *
 * @callback Highcharts.SeriesLegendItemClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesLegendItemClickEventObject} event
 *        The event that occured.
 */

/**
 * Information about the event.
 *
 * @interface Highcharts.SeriesLegendItemClickEventObject
 *//**
 * Related browser event.
 * @name Highcharts.SeriesLegendItemClickEventObject#browserEvent
 * @type {global.PointerEvent}
 *//**
 * Prevent the default action of toggle the visibility of the series.
 * @name Highcharts.SeriesLegendItemClickEventObject#preventDefault
 * @type {Function}
 *//**
 * Related series.
 * @name Highcharts.SeriesCheckboxClickEventObject#target
 * @type {Highcharts.Series}
 *//**
 * Event type.
 * @name Highcharts.SeriesCheckboxClickEventObject#type
 * @type {"checkboxClick"}
 */

/**
 * Gets fired when the mouse leaves the graph.
 *
 * @callback Highcharts.SeriesMouseOutCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */

/**
 * Gets fired when the mouse enters the graph.
 *
 * @callback Highcharts.SeriesMouseOverCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */

/**
 * Translation and scale for the plot area of a series.
 *
 * @interface Highcharts.SeriesPlotBoxObject
 *//**
 * @name Highcharts.SeriesPlotBoxObject#scaleX
 * @type {number}
 *//**
 * @name Highcharts.SeriesPlotBoxObject#scaleY
 * @type {number}
 *//**
 * @name Highcharts.SeriesPlotBoxObject#translateX
 * @type {number}
 *//**
 * @name Highcharts.SeriesPlotBoxObject#translateY
 * @type {number}
 */

/**
 * Gets fired when the series is shown after chart generation time, either by
 * clicking the legend item or by calling `.show()`.
 *
 * @callback Highcharts.SeriesShowCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */

/**
 * Possible key values for the series state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.SeriesStateValue
 */

import U from './Utilities.js';
const {
    animObject,
    arrayMax,
    arrayMin,
    clamp,
    correctFloat,
    defined,
    erase,
    extend,
    isArray,
    isNumber,
    isString,
    objectEach,
    pick,
    splat,
    syncTimeout
} = U;

import './Options.js';
import './Legend.js';
import './Point.js';
import './SvgRenderer.js';

var addEvent = H.addEvent,
    defaultOptions = H.defaultOptions,
    defaultPlotOptions = H.defaultPlotOptions,
    fireEvent = H.fireEvent,
    LegendSymbolMixin = H.LegendSymbolMixin, // @todo add as a requirement
    merge = H.merge,
    Point = H.Point, // @todo  add as a requirement
    removeEvent = H.removeEvent,
    SVGElement = H.SVGElement,
    win = H.win;

/**
 * This is the base series prototype that all other series types inherit from.
 * A new series is initialized either through the
 * [series](https://api.highcharts.com/highcharts/series)
 * option structure, or after the chart is initialized, through
 * {@link Highcharts.Chart#addSeries}.
 *
 * The object can be accessed in a number of ways. All series and point event
 * handlers give a reference to the `series` object. The chart object has a
 * {@link Highcharts.Chart#series|series} property that is a collection of all
 * the chart's series. The point objects and axis objects also have the same
 * reference.
 *
 * Another way to reference the series programmatically is by `id`. Add an id
 * in the series configuration options, and get the series object by
 * {@link Highcharts.Chart#get}.
 *
 * Configuration options for the series are given in three levels. Options for
 * all series in a chart are given in the
 * [plotOptions.series](https://api.highcharts.com/highcharts/plotOptions.series)
 * object. Then options for all series of a specific type
 * are given in the plotOptions of that type, for example `plotOptions.line`.
 * Next, options for one single series are given in the series array, or as
 * arguments to `chart.addSeries`.
 *
 * The data in the series is stored in various arrays.
 *
 * - First, `series.options.data` contains all the original config options for
 *   each point whether added by options or methods like `series.addPoint`.
 *
 * - Next, `series.data` contains those values converted to points, but in case
 *   the series data length exceeds the `cropThreshold`, or if the data is
 *   grouped, `series.data` doesn't contain all the points. It only contains the
 *   points that have been created on demand.
 *
 * - Then there's `series.points` that contains all currently visible point
 *   objects. In case of cropping, the cropped-away points are not part of this
 *   array. The `series.points` array starts at `series.cropStart` compared to
 *   `series.data` and `series.options.data`. If however the series data is
 *   grouped, these can't be correlated one to one.
 *
 * - `series.xData` and `series.processedXData` contain clean x values,
 *   equivalent to `series.data` and `series.points`.
 *
 * - `series.yData` and `series.processedYData` contain clean y values,
 *   equivalent to `series.data` and `series.points`.
 *
 * @class
 * @name Highcharts.Series
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @param {Highcharts.SeriesOptionsType|object} options
 *        The series options.
 *//**
 * The line series is the base type and is therefor the series base prototype.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.line
 *
 * @augments Highcharts.Series
 */
H.Series = H.seriesType<Highcharts.LineSeries>(
    'line',

    /**
     * Series options for specific data and the data itself. In TypeScript you
     * have to cast the series options to specific series types, to get all
     * possible options for a series.
     *
     * @example
     * // TypeScript example
     * Highcharts.chart('container', {
     *     series: [{
     *         color: '#06C',
     *         data: [[0, 1], [2, 3]]
     *     } as Highcharts.SeriesLineOptions ]
     * });
     *
     * @type      {Array<*>}
     * @apioption series
     */

    /**
     * An id for the series. This can be used after render time to get a pointer
     * to the series object through `chart.get()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @type      {string}
     * @since     1.2.0
     * @apioption series.id
     */

    /**
     * The index of the series in the chart, affecting the internal index in the
     * `chart.series` array, the visible Z index as well as the order in the
     * legend.
     *
     * @type      {number}
     * @since     2.3.0
     * @apioption series.index
     */

    /**
     * The sequential index of the series in the legend.
     *
     * @see [legend.reversed](#legend.reversed),
     *      [yAxis.reversedStacks](#yAxis.reversedStacks)
     *
     * @sample {highcharts|highstock} highcharts/series/legendindex/
     *         Legend in opposite order
     *
     * @type      {number}
     * @apioption series.legendIndex
     */
    /**
     * The name of the series as shown in the legend, tooltip etc.
     *
     * @sample {highcharts} highcharts/series/name/
     *         Series name
     * @sample {highmaps} maps/demo/category-map/
     *         Series name
     *
     * @type      {string}
     * @apioption series.name
     */

    /**
     * This option allows grouping series in a stacked chart. The stack option
     * can be a string or anything else, as long as the grouped series' stack
     * options match each other after conversion into a string.
     *
     * @sample {highcharts} highcharts/series/stack/
     *         Stacked and grouped columns
     *
     * @type      {number|string}
     * @since     2.1
     * @product   highcharts highstock
     * @apioption series.stack
     */

    /**
     * The type of series, for example `line` or `column`. By default, the
     * series type is inherited from [chart.type](#chart.type), so unless the
     * chart is a combination of series types, there is no need to set it on the
     * series level.
     *
     * @sample {highcharts} highcharts/series/type/
     *         Line and column in the same chart
     * @sample highcharts/series/type-dynamic/
     *         Dynamic types with button selector
     * @sample {highmaps} maps/demo/mapline-mappoint/
     *         Multiple types in the same map
     *
     * @type      {string}
     * @apioption series.type
     */

    /**
     * When using dual or multiple x axes, this number defines which xAxis the
     * particular series is connected to. It refers to either the
     * {@link #xAxis.id|axis id}
     * or the index of the axis in the xAxis array, with 0 being the first.
     *
     * @type      {number|string}
     * @default   0
     * @product   highcharts highstock
     * @apioption series.xAxis
     */

    /**
     * When using dual or multiple y axes, this number defines which yAxis the
     * particular series is connected to. It refers to either the
     * {@link #yAxis.id|axis id}
     * or the index of the axis in the yAxis array, with 0 being the first.
     *
     * @sample {highcharts} highcharts/series/yaxis/
     *         Apply the column series to the secondary Y axis
     *
     * @type      {number|string}
     * @default   0
     * @product   highcharts highstock
     * @apioption series.yAxis
     */

    /**
     * Define the visual z index of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-zindex-default/
     *         With no z index, the series defined last are on top
     * @sample {highcharts} highcharts/plotoptions/series-zindex/
     *         With a z index, the series with the highest z index is on top
     * @sample {highstock} highcharts/plotoptions/series-zindex-default/
     *         With no z index, the series defined last are on top
     * @sample {highstock} highcharts/plotoptions/series-zindex/
     *         With a z index, the series with the highest z index is on top
     *
     * @type      {number}
     * @product   highcharts highstock
     * @apioption series.zIndex
     */

    null as any,

    /**
     * General options for all series types.
     *
     * @optionparent plotOptions.series
     */
    { // base series options

        /**
         * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
         * of a line graph. Round means that lines are rounded in the ends and
         * bends.
         *
         * @type       {Highcharts.SeriesLinecapValue}
         * @default    round
         * @since      3.0.7
         * @apioption  plotOptions.line.linecap
         */

        /**
         * Pixel width of the graph line.
         *
         * @see In styled mode, the line stroke-width can be set with the
         *      `.highcharts-graph` class name.
         *
         * @sample {highcharts} highcharts/plotoptions/series-linewidth-general/
         *         On all series
         * @sample {highcharts} highcharts/plotoptions/series-linewidth-specific/
         *         On one single series
         *
         * @product highcharts highstock
         *
         * @private
         */
        lineWidth: 2,

        /**
         * For some series, there is a limit that shuts down initial animation
         * by default when the total number of points in the chart is too high.
         * For example, for a column chart and its derivatives, animation does
         * not run if there is more than 250 points totally. To disable this
         * cap, set `animationLimit` to `Infinity`.
         *
         * @type      {number}
         * @apioption plotOptions.series.animationLimit
         */

        /**
         * Allow this series' points to be selected by clicking on the graphic
         * (columns, point markers, pie slices, map areas etc).
         *
         * The selected points can be handled by point select and unselect
         * events, or collectively by the [getSelectedPoints](
         * Highcharts.Chart#getSelectedPoints) function.
         *
         * And alternative way of selecting points is through dragging.
         *
         * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-line/
         *         Line
         * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-column/
         *         Column
         * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-pie/
         *         Pie
         * @sample {highcharts} highcharts/chart/events-selection-points/
         *         Select a range of points through a drag selection
         * @sample {highmaps} maps/plotoptions/series-allowpointselect/
         *         Map area
         * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
         *         Map bubble
         *
         * @since 1.2.0
         *
         * @private
         */
        allowPointSelect: false,

        /**
         * If true, a checkbox is displayed next to the legend item to allow
         * selecting the series. The state of the checkbox is determined by
         * the `selected` option.
         *
         * @productdesc {highmaps}
         * Note that if a `colorAxis` is defined, the color axis is represented
         * in the legend, not the series.
         *
         * @sample {highcharts} highcharts/plotoptions/series-showcheckbox-true/
         *         Show select box
         *
         * @since 1.2.0
         *
         * @private
         */
        showCheckbox: false,

        /**
         * Enable or disable the initial animation when a series is displayed.
         * The animation can also be set as a configuration object. Please
         * note that this option only applies to the initial animation of the
         * series itself. For other animations, see [chart.animation](
         * #chart.animation) and the animation parameter under the API methods.
         * The following properties are supported:
         *
         * - `duration`: The duration of the animation in milliseconds.
         *
         * - `easing`: Can be a string reference to an easing function set on
         *   the `Math` object or a function. See the _Custom easing function_
         *   demo below.
         *
         * Due to poor performance, animation is disabled in old IE browsers
         * for several chart types.
         *
         * @sample {highcharts} highcharts/plotoptions/series-animation-disabled/
         *         Animation disabled
         * @sample {highcharts} highcharts/plotoptions/series-animation-slower/
         *         Slower animation
         * @sample {highcharts} highcharts/plotoptions/series-animation-easing/
         *         Custom easing function
         * @sample {highstock} stock/plotoptions/animation-slower/
         *         Slower animation
         * @sample {highstock} stock/plotoptions/animation-easing/
         *         Custom easing function
         * @sample {highmaps} maps/plotoptions/series-animation-true/
         *         Animation enabled on map series
         * @sample {highmaps} maps/plotoptions/mapbubble-animation-false/
         *         Disabled on mapbubble series
         *
         * @type    {boolean|Highcharts.AnimationOptionsObject}
         * @default {highcharts} true
         * @default {highstock} true
         * @default {highmaps} false
         *
         * @private
         */
        animation: {
            /** @internal */
            duration: 1000
        },

        /**
         * An additional class name to apply to the series' graphical elements.
         * This option does not replace default class names of the graphical
         * element.
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption plotOptions.series.className
         */

        /**
         * Disable this option to allow series rendering in the whole plotting
         * area.
         *
         * **Note:** Clipping should be always enabled when
         * [chart.zoomType](#chart.zoomType) is set
         *
         * @sample {highcharts} highcharts/plotoptions/series-clip/
         *         Disabled clipping
         *
         * @default   true
         * @type      {boolean}
         * @since     3.0.0
         * @apioption plotOptions.series.clip
         */

        /**
         * The main color of the series. In line type series it applies to the
         * line and the point markers unless otherwise specified. In bar type
         * series it applies to the bars unless a color is specified per point.
         * The default value is pulled from the `options.colors` array.
         *
         * In styled mode, the color can be defined by the
         * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
         * color can be set with the `.highcharts-series`,
         * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
         * `.highcharts-series-{n}` class, or individual classes given by the
         * `className` option.
         *
         * @productdesc {highmaps}
         * In maps, the series color is rarely used, as most choropleth maps use
         * the color to denote the value of each point. The series color can
         * however be used in a map with multiple series holding categorized
         * data.
         *
         * @sample {highcharts} highcharts/plotoptions/series-color-general/
         *         General plot option
         * @sample {highcharts} highcharts/plotoptions/series-color-specific/
         *         One specific series
         * @sample {highcharts} highcharts/plotoptions/series-color-area/
         *         Area color
         * @sample {highcharts} highcharts/series/infographic/
         *         Pattern fill
         * @sample {highmaps} maps/demo/category-map/
         *         Category map by multiple series
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @apioption plotOptions.series.color
         */

        /**
         * Styled mode only. A specific color index to use for the series, so
         * its graphic representations are given the class name
         * `highcharts-color-{n}`.
         *
         * @type      {number}
         * @since     5.0.0
         * @apioption plotOptions.series.colorIndex
         */


        /**
         * Whether to connect a graph line across null points, or render a gap
         * between the two points on either side of the null.
         *
         * @sample {highcharts} highcharts/plotoptions/series-connectnulls-false/
         *         False by default
         * @sample {highcharts} highcharts/plotoptions/series-connectnulls-true/
         *         True
         *
         * @type      {boolean}
         * @default   false
         * @product   highcharts highstock
         * @apioption plotOptions.series.connectNulls
         */


        /**
         * You can set the cursor to "pointer" if you have click events attached
         * to the series, to signal to the user that the points and lines can
         * be clicked.
         *
         * In styled mode, the series cursor can be set with the same classes
         * as listed under [series.color](#plotOptions.series.color).
         *
         * @sample {highcharts} highcharts/plotoptions/series-cursor-line/
         *         On line graph
         * @sample {highcharts} highcharts/plotoptions/series-cursor-column/
         *         On columns
         * @sample {highcharts} highcharts/plotoptions/series-cursor-scatter/
         *         On scatter markers
         * @sample {highstock} stock/plotoptions/cursor/
         *         Pointer on a line graph
         * @sample {highmaps} maps/plotoptions/series-allowpointselect/
         *         Map area
         * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
         *         Map bubble
         *
         * @type      {string|Highcharts.CursorValue}
         * @apioption plotOptions.series.cursor
         */


        /**
         * A name for the dash style to use for the graph, or for some series
         * types the outline of each shape.
         *
         * In styled mode, the
         * [stroke dash-array](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-dashstyle/)
         * can be set with the same classes as listed under
         * [series.color](#plotOptions.series.color).
         *
         * @sample {highcharts} highcharts/plotoptions/series-dashstyle-all/
         *         Possible values demonstrated
         * @sample {highcharts} highcharts/plotoptions/series-dashstyle/
         *         Chart suitable for printing in black and white
         * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/
         *         Possible values demonstrated
         * @sample {highmaps} highcharts/plotoptions/series-dashstyle-all/
         *         Possible values demonstrated
         * @sample {highmaps} maps/plotoptions/series-dashstyle/
         *         Dotted borders on a map
         *
         * @type      {Highcharts.DashStyleValue}
         * @default   Solid
         * @since     2.1
         * @apioption plotOptions.series.dashStyle
         */

        /**
         * A description of the series to add to the screen reader information
         * about the series.
         *
         * @type      {string}
         * @since     5.0.0
         * @requires  modules/accessibility
         * @apioption plotOptions.series.description
         */

        /**
         * Enable or disable the mouse tracking for a specific series. This
         * includes point tooltips and click events on graphs and points. For
         * large datasets it improves performance.
         *
         * @sample {highcharts} highcharts/plotoptions/series-enablemousetracking-false/
         *         No mouse tracking
         * @sample {highmaps} maps/plotoptions/series-enablemousetracking-false/
         *         No mouse tracking
         *
         * @type      {boolean}
         * @default   true
         * @apioption plotOptions.series.enableMouseTracking
         */

        /**
         * Whether to use the Y extremes of the total chart width or only the
         * zoomed area when zooming in on parts of the X axis. By default, the
         * Y axis adjusts to the min and max of the visible data. Cartesian
         * series only.
         *
         * @type      {boolean}
         * @default   false
         * @since     4.1.6
         * @product   highcharts highstock gantt
         * @apioption plotOptions.series.getExtremesFromAll
         */

        /**
         * An array specifying which option maps to which key in the data point
         * array. This makes it convenient to work with unstructured data arrays
         * from different sources.
         *
         * @see [series.data](#series.line.data)
         *
         * @sample {highcharts|highstock} highcharts/series/data-keys/
         *         An extended data array with keys
         * @sample {highcharts|highstock} highcharts/series/data-nested-keys/
         *         Nested keys used to access object properties
         *
         * @type      {Array<string>}
         * @since     4.1.6
         * @apioption plotOptions.series.keys
         */

        /**
         * The line cap used for line ends and line joins on the graph.
         *
         * @type       {Highcharts.SeriesLinecapValue}
         * @default    round
         * @product    highcharts highstock
         * @apioption  plotOptions.series.linecap
         */

        /**
         * The [id](#series.id) of another series to link to. Additionally,
         * the value can be ":previous" to link to the previous series. When
         * two series are linked, only the first one appears in the legend.
         * Toggling the visibility of this also toggles the linked series.
         *
         * @sample {highcharts|highstock} highcharts/demo/arearange-line/
         *         Linked series
         *
         * @type      {string}
         * @since     3.0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.series.linkedTo
         */

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
         * @type      {Highcharts.PlotSeriesOptions}
         * @since     5.0.0
         * @product   highstock
         * @apioption plotOptions.series.navigatorOptions
         */

        /**
         * The color for the parts of the graph or points that are below the
         * [threshold](#plotOptions.series.threshold). Note that `zones` takes
         * precedence over the negative color. Using `negativeColor` is
         * equivalent to applying a zone with value of 0.
         *
         * @see In styled mode, a negative color is applied by setting this option
         *      to `true` combined with the `.highcharts-negative` class name.
         *
         * @sample {highcharts} highcharts/plotoptions/series-negative-color/
         *         Spline, area and column
         * @sample {highcharts} highcharts/plotoptions/arearange-negativecolor/
         *         Arearange
         * @sample {highcharts} highcharts/css/series-negative-color/
         *         Styled mode
         * @sample {highstock} highcharts/plotoptions/series-negative-color/
         *         Spline, area and column
         * @sample {highstock} highcharts/plotoptions/arearange-negativecolor/
         *         Arearange
         * @sample {highmaps} highcharts/plotoptions/series-negative-color/
         *         Spline, area and column
         * @sample {highmaps} highcharts/plotoptions/arearange-negativecolor/
         *         Arearange
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     3.0
         * @apioption plotOptions.series.negativeColor
         */

        /**
         * Same as
         * [accessibility.pointDescriptionFormatter](#accessibility.pointDescriptionFormatter),
         * but for an individual series. Overrides the chart wide configuration.
         *
         * @type      {Function}
         * @since     5.0.12
         * @apioption plotOptions.series.pointDescriptionFormatter
         */

        /**
         * If no x values are given for the points in a series, `pointInterval`
         * defines the interval of the x values. For example, if a series
         * contains one value every decade starting from year 0, set
         * `pointInterval` to `10`. In true `datetime` axes, the `pointInterval`
         * is set in milliseconds.
         *
         * It can be also be combined with `pointIntervalUnit` to draw irregular
         * time intervals.
         *
         * Please note that this options applies to the _series data_, not the
         * interval of the axis ticks, which is independent.
         *
         * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/
         *         Datetime X axis
         * @sample {highstock} stock/plotoptions/pointinterval-pointstart/
         *         Using pointStart and pointInterval
         *
         * @type      {number}
         * @default   1
         * @product   highcharts highstock gantt
         * @apioption plotOptions.series.pointInterval
         */

        /**
         * On datetime series, this allows for setting the
         * [pointInterval](#plotOptions.series.pointInterval) to irregular time
         * units, `day`, `month` and `year`. A day is usually the same as 24
         * hours, but `pointIntervalUnit` also takes the DST crossover into
         * consideration when dealing with local time. Combine this option with
         * `pointInterval` to draw weeks, quarters, 6 months, 10 years etc.
         *
         * Please note that this options applies to the _series data_, not the
         * interval of the axis ticks, which is independent.
         *
         * @sample {highcharts} highcharts/plotoptions/series-pointintervalunit/
         *         One point a month
         * @sample {highstock} highcharts/plotoptions/series-pointintervalunit/
         *         One point a month
         *
         * @type       {string}
         * @since      4.1.0
         * @product    highcharts highstock gantt
         * @validvalue ["day", "month", "year"]
         * @apioption  plotOptions.series.pointIntervalUnit
         */

        /**
         * Possible values: `"on"`, `"between"`, `number`.
         *
         * In a column chart, when pointPlacement is `"on"`, the point will not
         * create any padding of the X axis. In a polar column chart this means
         * that the first column points directly north. If the pointPlacement is
         * `"between"`, the columns will be laid out between ticks. This is
         * useful for example for visualising an amount between two points in
         * time or in a certain sector of a polar chart.
         *
         * Since Highcharts 3.0.2, the point placement can also be numeric,
         * where 0 is on the axis value, -0.5 is between this value and the
         * previous, and 0.5 is between this value and the next. Unlike the
         * textual options, numeric point placement options won't affect axis
         * padding.
         *
         * Note that pointPlacement needs a [pointRange](
         * #plotOptions.series.pointRange) to work. For column series this is
         * computed, but for line-type series it needs to be set.
         *
         * For the `xrange` series type and gantt charts, if the Y axis is a
         * category axis, the `pointPlacement` applies to the Y axis rather than
         * the (typically datetime) X axis.
         *
         * Defaults to `undefined` in cartesian charts, `"between"` in polar
         * charts.
         *
         * @see [xAxis.tickmarkPlacement](#xAxis.tickmarkPlacement)
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-between/
         *         Between in a column chart
         * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-numeric/
         *         Numeric placement for custom layout
         * @sample {highcharts|highstock} maps/plotoptions/heatmap-pointplacement/
         *         Placement in heatmap
         *
         * @type      {string|number}
         * @since     2.3.0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.series.pointPlacement
         */

        /**
         * If no x values are given for the points in a series, pointStart
         * defines on what value to start. For example, if a series contains one
         * yearly value starting from 1945, set pointStart to 1945.
         *
         * @sample {highcharts} highcharts/plotoptions/series-pointstart-linear/
         *         Linear
         * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/
         *         Datetime
         * @sample {highstock} stock/plotoptions/pointinterval-pointstart/
         *         Using pointStart and pointInterval
         *
         * @type      {number}
         * @default   0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.series.pointStart
         */

        /**
         * Whether to select the series initially. If `showCheckbox` is true,
         * the checkbox next to the series name in the legend will be checked
         * for a selected series.
         *
         * @sample {highcharts} highcharts/plotoptions/series-selected/
         *         One out of two series selected
         *
         * @type      {boolean}
         * @default   false
         * @since     1.2.0
         * @apioption plotOptions.series.selected
         */

        /**
         * Whether to apply a drop shadow to the graph line. Since 2.3 the
         * shadow can be an object configuration containing `color`, `offsetX`,
         * `offsetY`, `opacity` and `width`.
         *
         * @sample {highcharts} highcharts/plotoptions/series-shadow/
         *         Shadow enabled
         *
         * @type      {boolean|Highcharts.ShadowOptionsObject}
         * @default   false
         * @apioption plotOptions.series.shadow
         */

        /**
         * Whether to display this particular series or series type in the
         * legend. Standalone series are shown in legend by default, and linked
         * series are not. Since v7.2.0 it is possible to show series that use
         * colorAxis by setting this option to `true`.
         *
         * @sample {highcharts} highcharts/plotoptions/series-showinlegend/
         *         One series in the legend, one hidden
         *
         * @type      {boolean}
         * @apioption plotOptions.series.showInLegend
         */

        /**
         * Whether or not to show the series in the navigator. Takes precedence
         * over [navigator.baseSeries](#navigator.baseSeries) if defined.
         *
         * @type      {boolean}
         * @since     5.0.0
         * @product   highstock
         * @apioption plotOptions.series.showInNavigator
         */

        /**
         * If set to `true`, the accessibility module will skip past the points
         * in this series for keyboard navigation.
         *
         * @type      {boolean}
         * @since     5.0.12
         * @apioption plotOptions.series.skipKeyboardNavigation
         */

        /**
         * Whether to stack the values of each series on top of each other.
         * Possible values are `undefined` to disable, `"normal"` to stack by
         * value or `"percent"`. When stacking is enabled, data must be sorted
         * in ascending X order. A special stacking option is with the
         * streamgraph series type, where the stacking option is set to
         * `"stream"`. The second one is `"overlap"`, which only applies to
         * waterfall series.
         *
         * @see [yAxis.reversedStacks](#yAxis.reversedStacks)
         *
         * @sample {highcharts} highcharts/plotoptions/series-stacking-line/
         *         Line
         * @sample {highcharts} highcharts/plotoptions/series-stacking-column/
         *         Column
         * @sample {highcharts} highcharts/plotoptions/series-stacking-bar/
         *         Bar
         * @sample {highcharts} highcharts/plotoptions/series-stacking-area/
         *         Area
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-line/
         *         Line
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-column/
         *         Column
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-bar/
         *         Bar
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-area/
         *         Area
         * @sample {highcharts} highcharts/plotoptions/series-waterfall-with-normal-stacking
         *         Waterfall with normal stacking
         * @sample {highcharts} highcharts/plotoptions/series-waterfall-with-overlap-stacking
         *         Waterfall with overlap stacking
         * @sample {highstock} stock/plotoptions/stacking/
         *         Area
         *
         * @type       {string}
         * @product    highcharts highstock
         * @validvalue ["normal", "overlap", "percent", "stream"]
         * @apioption  plotOptions.series.stacking
         */

        /**
         * Whether to apply steps to the line. Possible values are `left`,
         * `center` and `right`.
         *
         * @sample {highcharts} highcharts/plotoptions/line-step/
         *         Different step line options
         * @sample {highcharts} highcharts/plotoptions/area-step/
         *         Stepped, stacked area
         * @sample {highstock} stock/plotoptions/line-step/
         *         Step line
         *
         * @type       {string}
         * @since      1.2.5
         * @product    highcharts highstock
         * @validvalue ["left", "center", "right"]
         * @apioption  plotOptions.series.step
         */

        /**
         * The threshold, also called zero level or base level. For line type
         * series this is only used in conjunction with
         * [negativeColor](#plotOptions.series.negativeColor).
         *
         * @see [softThreshold](#plotOptions.series.softThreshold).
         *
         * @type      {number}
         * @default   0
         * @since     3.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.threshold
         */

        /**
         * Set the initial visibility of the series.
         *
         * @sample {highcharts} highcharts/plotoptions/series-visible/
         *         Two series, one hidden and one visible
         * @sample {highstock} stock/plotoptions/series-visibility/
         *         Hidden series
         *
         * @type      {boolean}
         * @default   true
         * @apioption plotOptions.series.visible
         */

        /**
         * Defines the Axis on which the zones are applied.
         *
         * @see [zones](#plotOptions.series.zones)
         *
         * @sample {highcharts} highcharts/series/color-zones-zoneaxis-x/
         *         Zones on the X-Axis
         * @sample {highstock} highcharts/series/color-zones-zoneaxis-x/
         *         Zones on the X-Axis
         *
         * @type      {string}
         * @default   y
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zoneAxis
         */

        /**
         * General event handlers for the series items. These event hooks can
         * also be attached to the series at run time using the
         * `Highcharts.addEvent` function.
         *
         * @declare Highcharts.SeriesEventsOptionsObject
         *
         * @private
         */
        events: {},

        /**
         * Fires after the series has finished its initial animation, or in case
         * animation is disabled, immediately as the series is displayed.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-afteranimate/
         *         Show label after animate
         * @sample {highstock} highcharts/plotoptions/series-events-afteranimate/
         *         Show label after animate
         *
         * @type      {Highcharts.SeriesAfterAnimateCallbackFunction}
         * @since     4.0
         * @product   highcharts highstock gantt
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.afterAnimate
         */

        /**
         * Fires when the checkbox next to the series' name in the legend is
         * clicked. One parameter, `event`, is passed to the function. The state
         * of the checkbox is found by `event.checked`. The checked item is
         * found by `event.item`. Return `false` to prevent the default action
         * which is to toggle the select state of the series.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/
         *         Alert checkbox status
         *
         * @type      {Highcharts.SeriesCheckboxClickCallbackFunction}
         * @since     1.2.0
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.checkboxClick
         */

        /**
         * Fires when the series is clicked. One parameter, `event`, is passed
         * to the function, containing common event information. Additionally,
         * `event.point` holds a pointer to the nearest point on the graph.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-click/
         *         Alert click info
         * @sample {highstock} stock/plotoptions/series-events-click/
         *         Alert click info
         * @sample {highmaps} maps/plotoptions/series-events-click/
         *         Display click info in subtitle
         *
         * @type      {Highcharts.SeriesClickCallbackFunction}
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.click
         */

        /**
         * Fires when the series is hidden after chart generation time, either
         * by clicking the legend item or by calling `.hide()`.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-hide/
         *         Alert when the series is hidden by clicking the legend item
         *
         * @type      {Highcharts.SeriesHideCallbackFunction}
         * @since     1.2.0
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.hide
         */

        /**
         * Fires when the legend item belonging to the series is clicked. One
         * parameter, `event`, is passed to the function. The default action
         * is to toggle the visibility of the series. This can be prevented
         * by returning `false` or calling `event.preventDefault()`.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-legenditemclick/
         *         Confirm hiding and showing
         *
         * @type      {Highcharts.SeriesLegendItemClickCallbackFunction}
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.legendItemClick
         */

        /**
         * Fires when the mouse leaves the graph. One parameter, `event`, is
         * passed to the function, containing common event information. If the
         * [stickyTracking](#plotOptions.series) option is true, `mouseOut`
         * doesn't happen before the mouse enters another graph or leaves the
         * plot area.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
         *         With sticky tracking by default
         * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
         *         Without sticky tracking
         *
         * @type      {Highcharts.SeriesMouseOutCallbackFunction}
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.mouseOut
         */

        /**
         * Fires when the mouse enters the graph. One parameter, `event`, is
         * passed to the function, containing common event information.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
         *         With sticky tracking by default
         * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
         *         Without sticky tracking
         *
         * @type      {Highcharts.SeriesMouseOverCallbackFunction}
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.mouseOver
         */

        /**
         * Fires when the series is shown after chart generation time, either
         * by clicking the legend item or by calling `.show()`.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-show/
         *         Alert when the series is shown by clicking the legend item.
         *
         * @type      {Highcharts.SeriesShowCallbackFunction}
         * @since     1.2.0
         * @context   Highcharts.Series
         * @apioption plotOptions.series.events.show
         */

        /**
         * Options for the point markers of line-like series. Properties like
         * `fillColor`, `lineColor` and `lineWidth` define the visual appearance
         * of the markers. Other series types, like column series, don't have
         * markers, but have visual options on the series level instead.
         *
         * In styled mode, the markers can be styled with the
         * `.highcharts-point`, `.highcharts-point-hover` and
         * `.highcharts-point-select` class names.
         *
         * @declare Highcharts.PointMarkerOptionsObject
         *
         * @private
         */
        marker: {

            /**
             * Enable or disable the point marker. If `undefined`, the markers
             * are hidden when the data is dense, and shown for more widespread
             * data points.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-enabled/
             *         Disabled markers
             * @sample {highcharts} highcharts/plotoptions/series-marker-enabled-false/
             *         Disabled in normal state but enabled on hover
             * @sample {highstock} stock/plotoptions/series-marker/
             *         Enabled markers
             *
             * @type      {boolean}
             * @default   {highcharts} undefined
             * @default   {highstock} false
             * @apioption plotOptions.series.marker.enabled
             */

            /**
             * The threshold for how dense the point markers should be before
             * they are hidden, given that `enabled` is not defined. The number
             * indicates the horizontal distance between the two closest points
             * in the series, as multiples of the `marker.radius`. In other
             * words, the default value of 2 means points are hidden if
             * overlapping horizontally.
             *
             * @sample highcharts/plotoptions/series-marker-enabledthreshold
             *         A higher threshold
             *
             * @since 6.0.5
             */
            enabledThreshold: 2,

            /**
             * The fill color of the point marker. When `undefined`, the series'
             * or point's color is used.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
             *         White fill
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @apioption plotOptions.series.marker.fillColor
             */

            /**
             * Image markers only. Set the image width explicitly. When using
             * this option, a `width` must also be set.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/
             *         Fixed width and height
             * @sample {highstock} highcharts/plotoptions/series-marker-width-height/
             *         Fixed width and height
             *
             * @type      {number}
             * @since     4.0.4
             * @apioption plotOptions.series.marker.height
             */

            /**
             * The color of the point marker's outline. When `undefined`, the
             * series' or point's color is used.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
             *         Inherit from series color (undefined)
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            lineColor: '${palette.backgroundColor}',

            /**
             * The width of the point marker's outline.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
             *         2px blue marker
             */
            lineWidth: 0,

            /**
             * The radius of the point marker.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-radius/
             *         Bigger markers
             *
             * @default {highstock} 2
             */
            radius: 4,

            /**
             * A predefined shape or symbol for the marker. When undefined, the
             * symbol is pulled from options.symbols. Other possible values are
             * `'circle'`, `'square'`,`'diamond'`, `'triangle'` and
             * `'triangle-down'`.
             *
             * Additionally, the URL to a graphic can be given on this form:
             * `'url(graphic.png)'`. Note that for the image to be applied to
             * exported charts, its URL needs to be accessible by the export
             * server.
             *
             * Custom callbacks for symbol path generation can also be added to
             * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
             * used by its method name, as shown in the demo.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
             *         Predefined, graphic and custom markers
             * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
             *         Predefined, graphic and custom markers
             *
             * @type      {string}
             * @apioption plotOptions.series.marker.symbol
             */

            /**
             * Image markers only. Set the image width explicitly. When using
             * this option, a `height` must also be set.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/
             *         Fixed width and height
             * @sample {highstock} highcharts/plotoptions/series-marker-width-height/
             *         Fixed width and height
             *
             * @type      {number}
             * @since     4.0.4
             * @apioption plotOptions.series.marker.width
             */

            /**
             * States for a single point marker.
             *
             * @declare Highcharts.PointStatesOptionsObject
             */
            states: {

                /**
                 * The normal state of a single point marker. Currently only
                 * used for setting animation when returning to normal state
                 * from hover.
                 *
                 * @declare Highcharts.PointStatesNormalOptionsObject
                 */
                normal: {
                    /**
                     * Animation when returning to normal state after hovering.
                     *
                     * @type {boolean|Highcharts.AnimationOptionsObject}
                     */
                    animation: true
                },

                /**
                 * The hover state for a single point marker.
                 *
                 * @declare Highcharts.PointStatesHoverOptionsObject
                 */
                hover: {

                    /**
                     * Animation when hovering over the marker.
                     *
                     * @type {boolean|Highcharts.AnimationOptionsObject}
                     */
                    animation: {
                        /** @internal */
                        duration: 50
                    },

                    /**
                     * Enable or disable the point marker.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-enabled/
                     *         Disabled hover state
                     */
                    enabled: true,

                    /**
                     * The fill color of the marker in hover state. When
                     * `undefined`, the series' or point's fillColor for normal
                     * state is used.
                     *
                     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                     * @apioption plotOptions.series.marker.states.hover.fillColor
                     */

                    /**
                     * The color of the point marker's outline. When
                     * `undefined`, the series' or point's lineColor for normal
                     * state is used.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linecolor/
                     *         White fill color, black line color
                     *
                     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                     * @apioption plotOptions.series.marker.states.hover.lineColor
                     */

                    /**
                     * The width of the point marker's outline. When
                     * `undefined`, the series' or point's lineWidth for normal
                     * state is used.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linewidth/
                     *         3px line width
                     *
                     * @type      {number}
                     * @apioption plotOptions.series.marker.states.hover.lineWidth
                     */

                    /**
                     * The radius of the point marker. In hover state, it
                     * defaults to the normal state's radius + 2 as per the
                     * [radiusPlus](#plotOptions.series.marker.states.hover.radiusPlus)
                     * option.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-radius/
                     *         10px radius
                     *
                     * @type      {number}
                     * @apioption plotOptions.series.marker.states.hover.radius
                     */

                    /**
                     * The number of pixels to increase the radius of the
                     * hovered point.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
                     *         5 pixels greater radius on hover
                     * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
                     *         5 pixels greater radius on hover
                     *
                     * @since 4.0.3
                     */
                    radiusPlus: 2,

                    /**
                     * The additional line width for a hovered point.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
                     *         2 pixels wider on hover
                     * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
                     *         2 pixels wider on hover
                     *
                     * @since 4.0.3
                     */
                    lineWidthPlus: 1
                },

                /**
                 * The appearance of the point marker when selected. In order to
                 * allow a point to be selected, set the
                 * `series.allowPointSelect` option to true.
                 *
                 * @declare Highcharts.PointStatesSelectOptionsObject
                 */
                select: {

                    /**
                     * Enable or disable visible feedback for selection.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-enabled/
                     *         Disabled select state
                     *
                     * @type      {boolean}
                     * @default   true
                     * @apioption plotOptions.series.marker.states.select.enabled
                     */

                    /**
                     * The radius of the point marker. In hover state, it
                     * defaults to the normal state's radius + 2.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-radius/
                     *         10px radius for selected points
                     *
                     * @type      {number}
                     * @apioption plotOptions.series.marker.states.select.radius
                     */

                    /**
                     * The fill color of the point marker.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-fillcolor/
                     *         Solid red discs for selected points
                     *
                     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                     */
                    fillColor: '${palette.neutralColor20}',

                    /**
                     * The color of the point marker's outline. When
                     * `undefined`, the series' or point's color is used.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linecolor/
                     *         Red line color for selected points
                     *
                     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                     */
                    lineColor: '${palette.neutralColor100}',

                    /**
                     * The width of the point marker's outline.
                     *
                     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linewidth/
                     *         3px line width for selected points
                     */
                    lineWidth: 2
                }
            }
        },

        /**
         * Properties for each single point.
         *
         * @declare Highcharts.PlotSeriesPointOptions
         *
         * @private
         */
        point: {

            /**
             * Fires when a point is clicked. One parameter, `event`, is passed
             * to the function, containing common event information.
             *
             * If the `series.allowPointSelect` option is true, the default
             * action for the point's click event is to toggle the point's
             * select state. Returning `false` cancels this action.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-click/
             *         Click marker to alert values
             * @sample {highcharts} highcharts/plotoptions/series-point-events-click-column/
             *         Click column
             * @sample {highcharts} highcharts/plotoptions/series-point-events-click-url/
             *         Go to URL
             * @sample {highmaps} maps/plotoptions/series-point-events-click/
             *         Click marker to display values
             * @sample {highmaps} maps/plotoptions/series-point-events-click-url/
             *         Go to URL
             *
             * @type      {Highcharts.PointClickCallbackFunction}
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.click
             */

            /**
             * Fires when the mouse leaves the area close to the point. One
             * parameter, `event`, is passed to the function, containing common
             * event information.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
             *         Show values in the chart's corner on mouse over
             *
             * @type      {Highcharts.PointMouseOutCallbackFunction}
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.mouseOut
             */

            /**
             * Fires when the mouse enters the area close to the point. One
             * parameter, `event`, is passed to the function, containing common
             * event information.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
             *         Show values in the chart's corner on mouse over
             *
             * @type      {Highcharts.PointMouseOverCallbackFunction}
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.mouseOver
             */

            /**
             * Fires when the point is removed using the `.remove()` method. One
             * parameter, `event`, is passed to the function. Returning `false`
             * cancels the operation.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-remove/
             *         Remove point and confirm
             *
             * @type      {Highcharts.PointRemoveCallbackFunction}
             * @since     1.2.0
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.remove
             */

            /**
             * Fires when the point is selected either programmatically or
             * following a click on the point. One parameter, `event`, is passed
             * to the function. Returning `false` cancels the operation.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-select/
             *         Report the last selected point
             * @sample {highmaps} maps/plotoptions/series-allowpointselect/
             *         Report select and unselect
             *
             * @type      {Highcharts.PointSelectCallbackFunction}
             * @since     1.2.0
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.select
             */

            /**
             * Fires when the point is unselected either programmatically or
             * following a click on the point. One parameter, `event`, is passed
             * to the function.
             *  Returning `false` cancels the operation.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-unselect/
             *         Report the last unselected point
             * @sample {highmaps} maps/plotoptions/series-allowpointselect/
             *         Report select and unselect
             *
             * @type      {Highcharts.PointUnselectCallbackFunction}
             * @since     1.2.0
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.unselect
             */

            /**
             * Fires when the point is updated programmatically through the
             * `.update()` method. One parameter, `event`, is passed to the
             * function. The new point options can be accessed through
             * `event.options`. Returning `false` cancels the operation.
             *
             * @sample {highcharts} highcharts/plotoptions/series-point-events-update/
             *         Confirm point updating
             *
             * @type      {Highcharts.PointUpdateCallbackFunction}
             * @since     1.2.0
             * @context   Highcharts.Point
             * @apioption plotOptions.series.point.events.update
             */

            /**
             * Events for each single point.
             *
             * @declare Highcharts.PointEventsOptionsObject
             */
            events: {}
        },

        /**
         * Options for the series data labels, appearing next to each data
         * point.
         *
         * Since v6.2.0, multiple data labels can be applied to each single
         * point by defining them as an array of configs.
         *
         * In styled mode, the data labels can be styled with the
         * `.highcharts-data-label-box` and `.highcharts-data-label` class names
         * ([see example](https://www.highcharts.com/samples/highcharts/css/series-datalabels)).
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled
         *         Data labels enabled
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-multiple
         *         Multiple data labels on a bar series
         * @sample {highcharts} highcharts/css/series-datalabels
         *         Style mode example
         *
         * @declare Highcharts.DataLabelsOptionsObject
         * @type    {*|Array<*>}
         * @product highcharts highstock highmaps gantt
         *
         * @private
         */
        dataLabels: {

            /**
             * The alignment of the data label compared to the point. If
             * `right`, the right side of the label should be touching the
             * point. For points with an extent, like columns, the alignments
             * also dictates how to align it inside the box, as given with the
             * [inside](#plotOptions.column.dataLabels.inside)
             * option. Can be one of `left`, `center` or `right`.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-align-left/
             *         Left aligned
             * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/
             *         Data labels inside the bar
             *
             * @name Highcharts.DataLabelsOptionsObject#align
             * @type {Highcharts.AlignValue|null}
             */
            align: 'center',

            /**
             * Whether to allow data labels to overlap. To make the labels less
             * sensitive for overlapping, the
             * [dataLabels.padding](#plotOptions.series.dataLabels.padding)
             * can be set to 0.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-allowoverlap-false/
             *         Don't allow overlap
             *
             * @type      {boolean}
             * @default   false
             * @since     4.1.0
             * @apioption plotOptions.series.dataLabels.allowOverlap
             */

            /**
             * The background color or gradient for the data label.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             * @sample {highmaps} maps/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     2.2.1
             * @apioption plotOptions.series.dataLabels.backgroundColor
             */

            /**
             * The border color for the data label. Defaults to `undefined`.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     2.2.1
             * @apioption plotOptions.series.dataLabels.borderColor
             */

            /**
             * The border radius in pixels for the data label.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             * @sample {highmaps} maps/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @type      {number}
             * @default   0
             * @since     2.2.1
             * @apioption plotOptions.series.dataLabels.borderRadius
             */

            /**
             * The border width in pixels for the data label.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @type      {number}
             * @default   0
             * @since     2.2.1
             * @apioption plotOptions.series.dataLabels.borderWidth
             */

            /**
             * A class name for the data label. Particularly in styled mode,
             * this can be used to give each series' or point's data label
             * unique styling. In addition to this option, a default color class
             * name is added so that we can give the labels a contrast text
             * shadow.
             *
             * @sample {highcharts} highcharts/css/data-label-contrast/
             *         Contrast text shadow
             * @sample {highcharts} highcharts/css/series-datalabels/
             *         Styling by CSS
             *
             * @type      {string}
             * @since     5.0.0
             * @apioption plotOptions.series.dataLabels.className
             */

            /**
             * The text color for the data labels. Defaults to `undefined`. For
             * certain series types, like column or map, the data labels can be
             * drawn inside the points. In this case the data label will be
             * drawn with maximum contrast by default. Additionally, it will be
             * given a `text-outline` style with the opposite color, to further
             * increase the contrast. This can be overridden by setting the
             * `text-outline` style to `none` in the `dataLabels.style` option.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-color/
             *         Red data labels
             * @sample {highmaps} maps/demo/color-axis/
             *         White data labels
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @apioption plotOptions.series.dataLabels.color
             */

            /**
             * Whether to hide data labels that are outside the plot area. By
             * default, the data label is moved inside the plot area according
             * to the
             * [overflow](#plotOptions.series.dataLabels.overflow)
             * option.
             *
             * @type      {boolean}
             * @default   true
             * @since     2.3.3
             * @apioption plotOptions.series.dataLabels.crop
             */

            /**
             * Whether to defer displaying the data labels until the initial
             * series animation has finished.
             *
             * @type      {boolean}
             * @default   true
             * @since     4.0.0
             * @product   highcharts highstock gantt
             * @apioption plotOptions.series.dataLabels.defer
             */

            /**
             * Enable or disable the data labels.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled/
             *         Data labels enabled
             * @sample {highmaps} maps/demo/color-axis/
             *         Data labels enabled
             *
             * @type      {boolean}
             * @default   false
             * @apioption plotOptions.series.dataLabels.enabled
             */

            /**
             * A declarative filter to control of which data labels to display.
             * The declarative filter is designed for use when callback
             * functions are not available, like when the chart options require
             * a pure JSON structure or for use with graphical editors. For
             * programmatic control, use the `formatter` instead, and return
             * `undefined` to disable a single data label.
             *
             * @example
             * filter: {
             *     property: 'percentage',
             *     operator: '>',
             *     value: 4
             * }
             *
             * @sample {highcharts} highcharts/demo/pie-monochrome
             *         Data labels filtered by percentage
             *
             * @declare   Highcharts.DataLabelsFilterOptionsObject
             * @since     6.0.3
             * @apioption plotOptions.series.dataLabels.filter
             */

            /**
             * The operator to compare by. Can be one of `>`, `<`, `>=`, `<=`,
             * `==`, and `===`.
             *
             * @type       {string}
             * @validvalue [">", "<", ">=", "<=", "==", "==="]
             * @apioption  plotOptions.series.dataLabels.filter.operator
             */

            /**
             * The point property to filter by. Point options are passed
             * directly to properties, additionally there are `y` value,
             * `percentage` and others listed under {@link Highcharts.Point}
             * members.
             *
             * @type      {string}
             * @apioption plotOptions.series.dataLabels.filter.property
             */

            /**
             * The value to compare against.
             *
             * @type      {number}
             * @apioption plotOptions.series.dataLabels.filter.value
             */

            /**
             * A
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * for the data label. Available variables are the same as for
             * `formatter`.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/
             *         Add a unit
             * @sample {highmaps} maps/plotoptions/series-datalabels-format/
             *         Formatted value in the data label
             *
             * @type      {string}
             * @default   y
             * @default   point.value
             * @since     3.0
             * @apioption plotOptions.series.dataLabels.format
             */

            // eslint-disable-next-line valid-jsdoc
            /**
             * Callback JavaScript function to format the data label. Note that
             * if a `format` is defined, the format takes precedence and the
             * formatter is ignored.
             *
             * @sample {highmaps} maps/plotoptions/series-datalabels-format/
             *         Formatted value
             *
             * @type {Highcharts.DataLabelsFormatterCallbackFunction}
             */
            formatter: function (
                this: Highcharts.DataLabelsFormatterContextObject
            ): string {
                const { numberFormatter } = this.series.chart;
                return this.y === null ? '' : numberFormatter(this.y, -1);
            },

            /**
             * For points with an extent, like columns or map areas, whether to
             * align the data label inside the box or to the actual value point.
             * Defaults to `false` in most cases, `true` in stacked columns.
             *
             * @type      {boolean}
             * @since     3.0
             * @apioption plotOptions.series.dataLabels.inside
             */

            /**
             * Format for points with the value of null. Works analogously to
             * [format](#plotOptions.series.dataLabels.format). `nullFormat` can
             * be applied only to series which support displaying null points.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/
             *         Format data label and tooltip for null point.
             *
             * @type      {boolean|string}
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.nullFormat
             */

            /**
             * Callback JavaScript function that defines formatting for points
             * with the value of null. Works analogously to
             * [formatter](#plotOptions.series.dataLabels.formatter).
             * `nullPointFormatter` can be applied only to series which support
             * displaying null points.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/
             *         Format data label and tooltip for null point.
             *
             * @type      {Highcharts.DataLabelsFormatterCallbackFunction}
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.nullFormatter
             */

            /**
             * How to handle data labels that flow outside the plot area. The
             * default is `"justify"`, which aligns them inside the plot area.
             * For columns and bars, this means it will be moved inside the bar.
             * To display data labels outside the plot area, set `crop` to
             * `false` and `overflow` to `"allow"`.
             *
             * @type       {Highcharts.DataLabelsOverflowValue}
             * @default    justify
             * @since      3.0.6
             * @apioption  plotOptions.series.dataLabels.overflow
             */

            /**
             * When either the `borderWidth` or the `backgroundColor` is set,
             * this is the padding within the box.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             * @sample {highmaps} maps/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @since 2.2.1
             */
            padding: 5,

            /**
             * Aligns data labels relative to points. If `center` alignment is
             * not possible, it defaults to `right`.
             *
             * @type      {Highcharts.AlignValue}
             * @default   center
             * @apioption plotOptions.series.dataLabels.position
             */

            /**
             * Text rotation in degrees. Note that due to a more complex
             * structure, backgrounds, borders and padding will be lost on a
             * rotated data label.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
             *         Vertical labels
             *
             * @type      {number}
             * @default   0
             * @apioption plotOptions.series.dataLabels.rotation
             */

            /**
             * The shadow of the box. Works best with `borderWidth` or
             * `backgroundColor`. Since 2.3 the shadow can be an object
             * configuration containing `color`, `offsetX`, `offsetY`, `opacity`
             * and `width`.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
             *         Data labels box options
             *
             * @type      {boolean|Highcharts.ShadowOptionsObject}
             * @default   false
             * @since     2.2.1
             * @apioption plotOptions.series.dataLabels.shadow
             */

            /**
             * The name of a symbol to use for the border around the label.
             * Symbols are predefined functions on the Renderer object.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-shape/
             *         A callout for annotations
             *
             * @type      {string}
             * @default   square
             * @since     4.1.2
             * @apioption plotOptions.series.dataLabels.shape
             */

            /**
             * Styles for the label. The default `color` setting is
             * `"contrast"`, which is a pseudo color that Highcharts picks up
             * and applies the maximum contrast to the underlying point item,
             * for example the bar in a bar chart.
             *
             * The `textOutline` is a pseudo property that applies an outline of
             * the given width with the given color, which by default is the
             * maximum contrast to the text. So a bright text color will result
             * in a black text outline for maximum readability on a mixed
             * background. In some cases, especially with grayscale text, the
             * text outline doesn't work well, in which cases it can be disabled
             * by setting it to `"none"`. When `useHTML` is true, the
             * `textOutline` will not be picked up. In this, case, the same
             * effect can be acheived through the `text-shadow` CSS property.
             *
             * For some series types, where each point has an extent, like for
             * example tree maps, the data label may overflow the point. There
             * are two strategies for handling overflow. By default, the text
             * will wrap to multiple lines. The other strategy is to set
             * `style.textOverflow` to `ellipsis`, which will keep the text on
             * one line plus it will break inside long words.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-style/
             *         Bold labels
             * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow/
             *         Long labels truncated with an ellipsis in a pie
             * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow-wrap/
             *         Long labels are wrapped in a pie
             * @sample {highmaps} maps/demo/color-axis/
             *         Bold labels
             *
             * @type      {Highcharts.CSSObject}
             * @since     4.1.0
             * @apioption plotOptions.series.dataLabels.style
             */
            style: {
                /** @internal */
                fontSize: '11px',
                /** @internal */
                fontWeight: 'bold',
                /** @internal */
                color: 'contrast',
                /** @internal */
                textOutline: '1px contrast'
            },

            /**
             * Options for a label text which should follow marker's shape.
             * Border and background are disabled for a label that follows a
             * path.
             *
             * **Note:** Only SVG-based renderer supports this option. Setting
             * `useHTML` to true will disable this option.
             *
             * @declare   Highcharts.DataLabelsTextPathOptionsObject
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.textPath
             */

            /**
             * Presentation attributes for the text path.
             *
             * @type      {Highcharts.SVGAttributes}
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.textPath.attributes
             */

            /**
             * Enable or disable `textPath` option for link's or marker's data
             * labels.
             *
             * @type      {boolean}
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.textPath.enabled
             */

            /**
             * Whether to
             * [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
             * to render the labels.
             *
             * @type      {boolean}
             * @default   false
             * @apioption plotOptions.series.dataLabels.useHTML
             */

            /**
             * The vertical alignment of a data label. Can be one of `top`,
             * `middle` or `bottom`. The default value depends on the data, for
             * instance in a column chart, the label is above positive values
             * and below negative values.
             *
             * @type  {Highcharts.VerticalAlignValue|null}
             * @since 2.3.3
             */
            verticalAlign: 'bottom',

            /**
             * The x position offset of the label relative to the point in
             * pixels.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
             *         Vertical and positioned
             * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/
             *         Data labels inside the bar
             */
            x: 0,

            /**
             * The Z index of the data labels. The default Z index puts it above
             * the series. Use a Z index of 2 to display it behind the series.
             *
             * @type      {number}
             * @default   6
             * @since     2.3.5
             * @apioption plotOptions.series.dataLabels.z
             */

            /**
             * The y position offset of the label relative to the point in
             * pixels.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
             *         Vertical and positioned
             */
            y: 0

        } as Highcharts.DataLabelsOptionsObject,

        /**
         * When the series contains less points than the crop threshold, all
         * points are drawn, even if the points fall outside the visible plot
         * area at the current zoom. The advantage of drawing all points
         * (including markers and columns), is that animation is performed on
         * updates. On the other hand, when the series contains more points than
         * the crop threshold, the series data is cropped to only contain points
         * that fall within the plot area. The advantage of cropping away
         * invisible points is to increase performance on large series.
         *
         * @since   2.2
         * @product highcharts highstock
         *
         * @private
         */
        cropThreshold: 300,

        /**
         * Opacity of a series parts: line, fill (e.g. area) and dataLabels.
         *
         * @see [states.inactive.opacity](#plotOptions.series.states.inactive.opacity)
         *
         * @since 7.1.0
         *
         * @private
         */
        opacity: 1,

        /**
         * The width of each point on the x axis. For example in a column chart
         * with one value each day, the pointRange would be 1 day (= 24 * 3600
         * * 1000 milliseconds). This is normally computed automatically, but
         * this option can be used to override the automatic value.
         *
         * @product highstock
         *
         * @private
         */
        pointRange: 0,

        /**
         * When this is true, the series will not cause the Y axis to cross
         * the zero plane (or [threshold](#plotOptions.series.threshold) option)
         * unless the data actually crosses the plane.
         *
         * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
         * 3 will make the Y axis show negative values according to the
         * `minPadding` option. If `softThreshold` is `true`, the Y axis starts
         * at 0.
         *
         * @since   4.1.9
         * @product highcharts highstock
         *
         * @private
         */
        softThreshold: true,

        /**
         * @declare Highcharts.SeriesStatesOptionsObject
         */
        states: {

            /**
             * The normal state of a series, or for point items in column, pie
             * and similar series. Currently only used for setting animation
             * when returning to normal state from hover.
             *
             * @declare Highcharts.SeriesStatesNormalOptionsObject
             */
            normal: {
                /**
                 * Animation when returning to normal state after hovering.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 */
                animation: true
            },

            /**
             * Options for the hovered series. These settings override the
             * normal state options when a series is moused over or touched.
             *
             * @declare Highcharts.SeriesStatesHoverOptionsObject
             */
            hover: {

                /**
                 * Enable separate styles for the hovered series to visualize
                 * that the user hovers either the series itself or the legend.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled/
                 *         Line
                 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-column/
                 *         Column
                 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-pie/
                 *         Pie
                 *
                 * @type      {boolean}
                 * @default   true
                 * @since     1.2
                 * @apioption plotOptions.series.states.hover.enabled
                 */


                /**
                 * Animation setting for hovering the graph in line-type series.
                 *
                 * @type    {boolean|Highcharts.AnimationOptionsObject}
                 * @since   5.0.8
                 * @product highcharts highstock
                 */
                animation: {

                    /**
                     * The duration of the hover animation in milliseconds. By
                     * default the hover state animates quickly in, and slowly
                     * back to normal.
                     *
                     * @internal
                     */
                    duration: 50
                },

                /**
                 * Pixel width of the graph line. By default this property is
                 * undefined, and the `lineWidthPlus` property dictates how much
                 * to increase the linewidth from normal state.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidth/
                 *         5px line on hover
                 *
                 * @type      {number}
                 * @product   highcharts highstock
                 * @apioption plotOptions.series.states.hover.lineWidth
                 */

                /**
                 * The additional line width for the graph of a hovered series.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         5 pixels wider
                 * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         5 pixels wider
                 *
                 * @since   4.0.3
                 * @product highcharts highstock
                 */
                lineWidthPlus: 1,

                /**
                 * In Highcharts 1.0, the appearance of all markers belonging
                 * to the hovered series. For settings on the hover state of the
                 * individual point, see
                 * [marker.states.hover](#plotOptions.series.marker.states.hover).
                 *
                 * @deprecated
                 *
                 * @extends   plotOptions.series.marker
                 * @excluding states
                 * @product   highcharts highstock
                 */
                marker: {
                    // lineWidth: base + 1,
                    // radius: base + 1
                },

                /**
                 * Options for the halo appearing around the hovered point in
                 * line-type series as well as outside the hovered slice in pie
                 * charts. By default the halo is filled by the current point or
                 * series color with an opacity of 0.25\. The halo can be
                 * disabled by setting the `halo` option to `null`.
                 *
                 * In styled mode, the halo is styled with the
                 * `.highcharts-halo` class, with colors inherited from
                 * `.highcharts-color-{n}`.
                 *
                 * @sample {highcharts} highcharts/plotoptions/halo/
                 *         Halo options
                 * @sample {highstock} highcharts/plotoptions/halo/
                 *         Halo options
                 *
                 * @declare Highcharts.SeriesStatesHoverHaloOptionsObject
                 * @type    {null|*}
                 * @since   4.0
                 * @product highcharts highstock
                 */
                halo: {

                    /**
                     * A collection of SVG attributes to override the appearance
                     * of the halo, for example `fill`, `stroke` and
                     * `stroke-width`.
                     *
                     * @type      {Highcharts.SVGAttributes}
                     * @since     4.0
                     * @product   highcharts highstock
                     * @apioption plotOptions.series.states.hover.halo.attributes
                     */


                    /**
                     * The pixel size of the halo. For point markers this is the
                     * radius of the halo. For pie slices it is the width of the
                     * halo outside the slice. For bubbles it defaults to 5 and
                     * is the width of the halo outside the bubble.
                     *
                     * @since   4.0
                     * @product highcharts highstock
                     */
                    size: 10,

                    /**
                     * Opacity for the halo unless a specific fill is overridden
                     * using the `attributes` setting. Note that Highcharts is
                     * only able to apply opacity to colors of hex or rgb(a)
                     * formats.
                     *
                     * @since   4.0
                     * @product highcharts highstock
                     */
                    opacity: 0.25
                }
            },


            /**
             * Specific options for point in selected states, after being
             * selected by
             * [allowPointSelect](#plotOptions.series.allowPointSelect)
             * or programmatically.
             *
             * @sample maps/plotoptions/series-allowpointselect/
             *         Allow point select demo
             *
             * @declare   Highcharts.SeriesStatesSelectOptionsObject
             * @extends   plotOptions.series.states.hover
             * @excluding brightness
             */
            select: {
                animation: {
                    /** @internal */
                    duration: 0
                }
            },

            /**
             * The opposite state of a hover for series.
             *
             * @sample highcharts/plotoptions/series-states-inactive-opacity
             *         Disabled inactive state by setting opacity
             *
             * @declare Highcharts.SeriesStatesInactiveOptionsObject
             */
            inactive: {
                /**
                 * The animation for entering the inactive state.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 */
                animation: {
                    /** @internal */
                    duration: 50
                },
                /**
                 * Opacity of series elements (dataLabels, line, area). Set to 1
                 * to disable inactive state.
                 *
                 * @apioption plotOptions.series.states.inactive.opacity
                 * @type {number}
                 * @sample highcharts/plotoptions/series-states-inactive-opacity
                 *         Disabled inactive state
                 */
                opacity: 0.2
            }
        },

        /**
         * Sticky tracking of mouse events. When true, the `mouseOut` event on a
         * series isn't triggered until the mouse moves over another series, or
         * out of the plot area. When false, the `mouseOut` event on a series is
         * triggered when the mouse leaves the area around the series' graph or
         * markers. This also implies the tooltip when not shared. When
         * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
         * will be hidden when moving the mouse between series. Defaults to true
         * for line and area type series, but to false for columns, pies etc.
         *
         * **Note:** The boost module will force this option because of
         * technical limitations.
         *
         * @sample {highcharts} highcharts/plotoptions/series-stickytracking-true/
         *         True by default
         * @sample {highcharts} highcharts/plotoptions/series-stickytracking-false/
         *         False
         *
         * @default {highcharts} true
         * @default {highstock} true
         * @default {highmaps} false
         * @since   2.0
         *
         * @private
         */
        stickyTracking: true,

        /**
         * A configuration object for the tooltip rendering of each single
         * series. Properties are inherited from [tooltip](#tooltip), but only
         * the following properties can be defined on a series level.
         *
         * @declare   Highcharts.SeriesTooltipOptionsObject
         * @since     2.3
         * @extends   tooltip
         * @excluding animation, backgroundColor, borderColor, borderRadius,
         *            borderWidth, className, crosshairs, enabled, formatter,
         *            headerShape, hideDelay, outside, padding, positioner,
         *            shadow, shape, shared, snap, split, style, useHTML
         * @apioption plotOptions.series.tooltip
         */

        /**
         * When a series contains a data array that is longer than this, only
         * one dimensional arrays of numbers, or two dimensional arrays with
         * x and y values are allowed. Also, only the first point is tested,
         * and the rest are assumed to be the same format. This saves expensive
         * data checking and indexing in long series. Set it to `0` disable.
         *
         * Note:
         * In boost mode turbo threshold is forced. Only array of numbers or
         * two dimensional arrays are allowed.
         *
         * @since   2.2
         * @product highcharts highstock gantt
         *
         * @private
         */
        turboThreshold: 1000,

        /**
         * An array defining zones within a series. Zones can be applied to the
         * X axis, Y axis or Z axis for bubbles, according to the `zoneAxis`
         * option. The zone definitions have to be in ascending order regarding
         * to the value.
         *
         * In styled mode, the color zones are styled with the
         * `.highcharts-zone-{n}` class, or custom classed from the `className`
         * option
         * ([view live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/color-zones/)).
         *
         * @see [zoneAxis](#plotOptions.series.zoneAxis)
         *
         * @sample {highcharts} highcharts/series/color-zones-simple/
         *         Color zones
         * @sample {highstock} highcharts/series/color-zones-simple/
         *         Color zones
         *
         * @declare   Highcharts.SeriesZonesOptionsObject
         * @type      {Array<*>}
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zones
         */

        /**
         * Styled mode only. A custom class name for the zone.
         *
         * @sample highcharts/css/color-zones/
         *         Zones styled by class name
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption plotOptions.series.zones.className
         */

        /**
         * Defines the color of the series.
         *
         * @see [series color](#plotOptions.series.color)
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zones.color
         */

        /**
         * A name for the dash style to use for the graph.
         *
         * @see [plotOptions.series.dashStyle](#plotOptions.series.dashStyle)
         *
         * @sample {highcharts|highstock} highcharts/series/color-zones-dashstyle-dot/
         *         Dashed line indicates prognosis
         *
         * @type      {Highcharts.DashStyleValue}
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zones.dashStyle
         */

        /**
         * Defines the fill color for the series (in area type series)
         *
         * @see [fillColor](#plotOptions.area.fillColor)
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zones.fillColor
         */

        /**
         * The value up to where the zone extends, if undefined the zones
         * stretches to the last value in the series.
         *
         * @type      {number}
         * @since     4.1.0
         * @product   highcharts highstock
         * @apioption plotOptions.series.zones.value
         */

        /**
         * When using dual or multiple color axes, this number defines which
         * colorAxis the particular series is connected to. It refers to
         * either the
         * {@link #colorAxis.id|axis id}
         * or the index of the axis in the colorAxis array, with 0 being the
         * first. Set this option to false to prevent a series from connecting
         * to the default color axis.
         *
         * Since v7.2.0 the option can also be an axis id or an axis index
         * instead of a boolean flag.
         *
         * @sample highcharts/coloraxis/coloraxis-with-pie/
         *         Color axis with pie series
         * @sample highcharts/coloraxis/multiple-coloraxis/
         *         Multiple color axis
         *
         * @type      {number|string|boolean}
         * @default   0
         * @product   highcharts highstock highmaps
         * @apioption plotOptions.series.colorAxis
         */

        /**
         * Determines what data value should be used to calculate point color
         * if `colorAxis` is used. Requires to set `min` and `max` if some
         * custom point property is used or if approximation for data grouping
         * is set to `'sum'`.
         *
         * @sample highcharts/coloraxis/custom-color-key/
         *         Custom color key
         * @sample highcharts/coloraxis/changed-default-color-key/
         *         Changed default color key
         *
         * @type      {string}
         * @default   y
         * @since     7.2.0
         * @product   highcharts highstock highmaps
         * @apioption plotOptions.series.colorKey
         */

        /**
         * Determines whether the series should look for the nearest point
         * in both dimensions or just the x-dimension when hovering the series.
         * Defaults to `'xy'` for scatter series and `'x'` for most other
         * series. If the data has duplicate x-values, it is recommended to
         * set this to `'xy'` to allow hovering over all points.
         *
         * Applies only to series types using nearest neighbor search (not
         * direct hover) for tooltip.
         *
         * @sample {highcharts} highcharts/series/findnearestpointby/
         *         Different hover behaviors
         * @sample {highstock} highcharts/series/findnearestpointby/
         *         Different hover behaviors
         * @sample {highmaps} highcharts/series/findnearestpointby/
         *         Different hover behaviors
         *
         * @since      5.0.10
         * @validvalue ["x", "xy"]
         *
         * @private
         */
        findNearestPointBy: 'x'

    } as Highcharts.SeriesOptionsType,

    /* eslint-disable no-invalid-this, valid-jsdoc */

    /** @lends Highcharts.Series.prototype */
    {
        axisTypes: ['xAxis', 'yAxis'],
        coll: 'series',
        colorCounter: 0,
        cropShoulder: 1,
        directTouch: false,
        isCartesian: true,
        // each point's x and y values are stored in this.xData and this.yData
        parallelArrays: ['x', 'y'],
        pointClass: Point,
        requireSorting: true,
        sorted: true, // requires the data to be sorted
        init: function (
            this: Highcharts.Series,
            chart: Highcharts.Chart,
            options: Highcharts.SeriesOptionsType
        ): void {

            fireEvent(this, 'init', { options: options });

            var series = this,
                events,
                chartSeries = chart.series,
                lastSeries;

            // A lookup over those events that are added by _options_ (not
            // programmatically). These are updated through Series.update()
            // (#10861).
            this.eventOptions = this.eventOptions || {};

            /**
             * Read only. The chart that the series belongs to.
             *
             * @name Highcharts.Series#chart
             * @type {Highcharts.Chart}
             */
            series.chart = chart;

            /**
             * Read only. The series' type, like "line", "area", "column" etc.
             * The type in the series options anc can be altered using
             * {@link Series#update}.
             *
             * @name Highcharts.Series#type
             * @type {string}
             */

            /**
             * Read only. The series' current options. To update, use
             * {@link Series#update}.
             *
             * @name Highcharts.Series#options
             * @type {Highcharts.SeriesOptionsType}
             */
            series.options = options = series.setOptions(options);
            series.linkedSeries = [];
            // bind the axes
            series.bindAxes();

            // set some variables
            extend(series, {
                /**
                 * The series name as given in the options. Defaults to
                 * "Series {n}".
                 *
                 * @name Highcharts.Series#name
                 * @type {string}
                 */
                name: options.name,
                state: '',
                /**
                 * Read only. The series' visibility state as set by {@link
                 * Series#show}, {@link Series#hide}, or in the initial
                 * configuration.
                 *
                 * @name Highcharts.Series#visible
                 * @type {boolean}
                 */
                visible: options.visible !== false, // true by default
                /**
                 * Read only. The series' selected state as set by {@link
                 * Highcharts.Series#select}.
                 *
                 * @name Highcharts.Series#selected
                 * @type {boolean}
                 */
                selected: options.selected === true // false by default
            });

            // Register event listeners
            events = options.events;

            objectEach(events, function (event: any, eventType: string): void {
                if (H.isFunction(event)) {

                    // If event does not exist, or is changed by Series.update
                    if (series.eventOptions[eventType] !== event) {

                        // Remove existing if set by option
                        if (H.isFunction(series.eventOptions[eventType])) {
                            removeEvent(
                                series,
                                eventType,
                                series.eventOptions[eventType]
                            );
                        }

                        series.eventOptions[eventType] = event;
                        addEvent(series, eventType, event);
                    }
                }
            });
            if (
                (events && events.click) ||
                (
                    options.point &&
                    options.point.events &&
                    options.point.events.click
                ) ||
                options.allowPointSelect
            ) {
                chart.runTrackerClick = true;
            }

            series.getColor();
            series.getSymbol();

            // Initialize the parallel data arrays
            series.parallelArrays.forEach(function (key: string): void {
                if (!(series as any)[key + 'Data']) {
                    (series as any)[key + 'Data'] = [];
                }
            });
            if (!series.points && !series.data) {
                series.setData(options.data as any, false);
            }

            // Mark cartesian
            if (series.isCartesian) {
                chart.hasCartesianSeries = true;
            }

            // Get the index and register the series in the chart. The index is
            // one more than the current latest series index (#5960).
            if (chartSeries.length) {
                lastSeries = chartSeries[chartSeries.length - 1];
            }
            series._i = pick(lastSeries && lastSeries._i, -1) + 1;

            // Insert the series and re-order all series above the insertion
            // point.
            chart.orderSeries(this.insert(chartSeries));

            fireEvent(this, 'afterInit');
        },

        /**
         * Insert the series in a collection with other series, either the chart
         * series or yAxis series, in the correct order according to the index
         * option. Used internally when adding series.
         *
         * @private
         * @function Highcharts.Series#insert
         * @param {Array<Highcharts.Series>} collection
         *        A collection of series, like `chart.series` or `xAxis.series`.
         * @return {number}
         *         The index of the series in the collection.
         */
        insert: function (
            this: Highcharts.Series,
            collection: Array<Highcharts.Series>
        ): number {
            var indexOption = this.options.index,
                i: any;

            // Insert by index option
            if (isNumber(indexOption)) {
                i = collection.length;
                while (i--) {
                    // Loop down until the interted element has higher index
                    if ((indexOption as any) >=
                            pick(collection[i].options.index, collection[i]._i)
                    ) {
                        collection.splice(i + 1, 0, this);
                        break;
                    }
                }
                if (i === -1) {
                    collection.unshift(this);
                }
                i = i + 1;


            // Or just push it to the end
            } else {
                collection.push(this);
            }
            return pick(i, collection.length - 1);
        },

        /**
         * Set the xAxis and yAxis properties of cartesian series, and register
         * the series in the `axis.series` array.
         *
         * @private
         * @function Highcharts.Series#bindAxes
         * @return {void}
         * @exception 18
         */
        bindAxes: function (this: Highcharts.Series): void {
            var series = this,
                seriesOptions = series.options,
                chart = series.chart,
                axisOptions;

            fireEvent(this, 'bindAxes', null as any, function (
                this: Highcharts.Series
            ): void {

                // repeat for xAxis and yAxis
                (series.axisTypes || []).forEach(function (AXIS: string): void {

                    // loop through the chart's axis objects
                    (chart as any)[AXIS].forEach(function (
                        axis: Highcharts.Axis
                    ): void {
                        axisOptions = axis.options;

                        // apply if the series xAxis or yAxis option mathches
                        // the number of the axis, or if undefined, use the
                        // first axis
                        if (
                            (seriesOptions as any)[AXIS] ===
                            axisOptions.index ||
                            (
                                typeof (seriesOptions as any)[AXIS] !==
                                'undefined' &&
                                (seriesOptions as any)[AXIS] === axisOptions.id
                            ) ||
                            (
                                typeof (seriesOptions as any)[AXIS] ===
                                'undefined' &&
                                axisOptions.index === 0
                            )
                        ) {

                            // register this series in the axis.series lookup
                            series.insert(axis.series);

                            // set this series.xAxis or series.yAxis reference
                            /**
                             * Read only. The unique xAxis object associated
                             * with the series.
                             *
                             * @name Highcharts.Series#xAxis
                             * @type {Highcharts.Axis}
                             */
                            /**
                             * Read only. The unique yAxis object associated
                             * with the series.
                             *
                             * @name Highcharts.Series#yAxis
                             * @type {Highcharts.Axis}
                             */
                            (series as any)[AXIS] = axis;

                            // mark dirty for redraw
                            axis.isDirty = true;
                        }
                    });

                    // The series needs an X and an Y axis
                    if (!(series as any)[AXIS] &&
                        series.optionalAxis !== AXIS
                    ) {
                        H.error(18, true, chart);
                    }

                });
            });
        },

        /**
         * For simple series types like line and column, the data values are
         * held in arrays like xData and yData for quick lookup to find extremes
         * and more. For multidimensional series like bubble and map, this can
         * be extended with arrays like zData and valueData by adding to the
         * `series.parallelArrays` array.
         *
         * @private
         * @function Highcharts.Series#updateParallelArrays
         * @param {Highcharts.Point} point
         * @param {number|string} i
         * @return {void}
         */
        updateParallelArrays: function (
            this: Highcharts.Series,
            point: Highcharts.Point,
            i: (number|string)
        ): void {
            var series = point.series,
                args = arguments,
                fn = isNumber(i) ?
                    // Insert the value in the given position
                    function (key: string): void {
                        var val = key === 'y' && series.toYData ?
                            series.toYData(point) :
                            (point as any)[key];

                        (series as any)[key + 'Data'][i] = val;
                    } :
                    // Apply the method specified in i with the following
                    // arguments as arguments
                    function (key: string): void {
                        (Array.prototype as any)[i].apply(
                            (series as any)[key + 'Data'],
                            Array.prototype.slice.call(args, 2)
                        );
                    };

            series.parallelArrays.forEach(fn);
        },
        /**
         * Define hasData functions for series. These return true if there
         * are data points on this series within the plot area.
         *
         * @private
         * @function Highcharts.Series#hasData
         * @return {boolean}
         */
        hasData: function (this: Highcharts.Series): boolean {
            return ((
                this.visible &&
                typeof this.dataMax !== 'undefined' &&
                typeof this.dataMin !== 'undefined'
            ) || ( // #3703
                this.visible &&
                (this.yData as any) &&
                (this.yData as any).length > 0) // #9758
            );
        },

        /**
         * Return an auto incremented x value based on the pointStart and
         * pointInterval options. This is only used if an x value is not given
         * for the point that calls autoIncrement.
         *
         * @private
         * @function Highcharts.Series#autoIncrement
         * @return {number}
         */
        autoIncrement: function (this: Highcharts.Series): number {

            var options = this.options,
                xIncrement = this.xIncrement as number,
                date,
                pointInterval,
                pointIntervalUnit = options.pointIntervalUnit,
                time = this.chart.time;

            xIncrement = pick(xIncrement, options.pointStart, 0);

            this.pointInterval = pointInterval = pick(
                this.pointInterval,
                options.pointInterval,
                1
            );

            // Added code for pointInterval strings
            if (pointIntervalUnit) {
                date = new time.Date(xIncrement);

                if (pointIntervalUnit === 'day') {
                    time.set(
                        'Date',
                        date,
                        time.get('Date', date) + pointInterval
                    );
                } else if (pointIntervalUnit === 'month') {
                    time.set(
                        'Month',
                        date,
                        time.get('Month', date) + pointInterval
                    );
                } else if (pointIntervalUnit === 'year') {
                    time.set(
                        'FullYear',
                        date,
                        time.get('FullYear', date) + pointInterval
                    );
                }

                pointInterval = date.getTime() - xIncrement;

            }

            this.xIncrement = xIncrement + pointInterval;
            return xIncrement;
        },

        /**
         * Set the series options by merging from the options tree. Called
         * internally on initializing and updating series. This function will
         * not redraw the series. For API usage, use {@link Series#update}.
         * @private
         * @function Highcharts.Series#setOptions
         * @param {Highcharts.SeriesOptionsType} itemOptions
         *        The series options.
         * @return {Highcharts.SeriesOptionsType}
         * @fires Highcharts.Series#event:afterSetOptions
         */
        setOptions: function <TSeries extends Highcharts.Series> (
            this: TSeries,
            itemOptions: Highcharts.SeriesOptionsType
        ): TSeries['options'] {
            var chart = this.chart,
                chartOptions = chart.options,
                plotOptions = chartOptions.plotOptions,
                userOptions = chart.userOptions || {},
                seriesUserOptions = merge(itemOptions),
                options: Highcharts.SeriesOptionsType,
                zones,
                zone,
                styledMode = chart.styledMode,
                e = {
                    plotOptions: plotOptions,
                    userOptions: seriesUserOptions
                };

            fireEvent(this, 'setOptions', e);

            // These may be modified by the event
            var typeOptions = (e.plotOptions as any)[this.type],
                userPlotOptions = (
                    userOptions.plotOptions || {} as Highcharts.PlotOptions
                );

            // use copy to prevent undetected changes (#9762)
            this.userOptions = e.userOptions;

            options = merge(
                typeOptions,
                (plotOptions as any).series,
                // #3881, chart instance plotOptions[type] should trump
                // plotOptions.series
                userOptions.plotOptions &&
                (userOptions.plotOptions as any)[this.type],
                seriesUserOptions
            );

            // The tooltip options are merged between global and series specific
            // options. Importance order asscendingly:
            // globals: (1)tooltip, (2)plotOptions.series,
            // (3)plotOptions[this.type]
            // init userOptions with possible later updates: 4-6 like 1-3 and
            // (7)this series options
            this.tooltipOptions = merge(
                defaultOptions.tooltip, // 1
                (defaultOptions.plotOptions as any).series &&
                    (defaultOptions.plotOptions as any).series.tooltip, // 2
                (defaultOptions.plotOptions as any)[this.type].tooltip, // 3
                (chartOptions.tooltip as any).userOptions, // 4
                (plotOptions as any).series &&
                (plotOptions as any).series.tooltip, // 5
                (plotOptions as any)[this.type].tooltip, // 6
                (seriesUserOptions.tooltip as any) // 7
            ) as any;

            // When shared tooltip, stickyTracking is true by default,
            // unless user says otherwise.
            this.stickyTracking = pick(
                seriesUserOptions.stickyTracking,
                (userPlotOptions as any)[this.type] &&
                (userPlotOptions as any)[this.type].stickyTracking,
                userPlotOptions.series && userPlotOptions.series.stickyTracking,
                (
                    this.tooltipOptions.shared && !this.noSharedTooltip ?
                        true :
                        options.stickyTracking
                )
            );

            // Delete marker object if not allowed (#1125)
            if (typeOptions.marker === null) {
                delete options.marker;
            }

            // Handle color zones
            this.zoneAxis = options.zoneAxis;
            zones = this.zones = (options.zones || []).slice();
            if (
                (options.negativeColor || options.negativeFillColor) &&
                !options.zones
            ) {
                zone = {
                    value:
                        (options as any)[this.zoneAxis + 'Threshold'] ||
                        options.threshold ||
                        0,
                    className: 'highcharts-negative'
                } as Highcharts.SeriesZonesOptions;
                if (!styledMode) {
                    zone.color = options.negativeColor;
                    zone.fillColor = options.negativeFillColor;
                }
                zones.push(zone);
            }
            if (zones.length) { // Push one extra zone for the rest
                if (defined(zones[zones.length - 1].value)) {
                    zones.push(styledMode ? {} : {
                        color: this.color,
                        fillColor: this.fillColor
                    });
                }
            }

            fireEvent(this, 'afterSetOptions', { options: options });

            return options;
        },

        /**
         * Return series name in "Series {Number}" format or the one defined by
         * a user. This method can be simply overridden as series name format
         * can vary (e.g. technical indicators).
         *
         * @function Highcharts.Series#getName
         * @return {string}
         *         The series name.
         */
        getName: function (this: Highcharts.Series): string {
            // #4119
            return pick(
                this.options.name,
                'Series ' + ((this.index as any) + 1)
            );
        },

        /**
         * @private
         * @function Highcharts.Series#getCyclic
         * @param {string} prop
         * @param {*} [value]
         * @param {Highcharts.Dictionary<any>} [defaults]
         * @return {void}
         */
        getCyclic: function (
            this: Highcharts.Series,
            prop: string,
            value?: any,
            defaults?: Highcharts.Dictionary<any>
        ): void {
            var i,
                chart = this.chart,
                userOptions = this.userOptions,
                indexName = prop + 'Index',
                counterName = prop + 'Counter',
                len = defaults ? defaults.length : pick(
                    (chart.options.chart as any)[prop + 'Count'],
                    (chart as any)[prop + 'Count']
                ),
                setting;

            if (!value) {
                // Pick up either the colorIndex option, or the _colorIndex
                // after Series.update()
                setting = pick(
                    (userOptions as any)[indexName],
                    (userOptions as any)['_' + indexName]
                );
                if (defined(setting)) { // after Series.update()
                    i = setting;
                } else {
                    // #6138
                    if (!chart.series.length) {
                        (chart as any)[counterName] = 0;
                    }
                    (userOptions as any)['_' + indexName] = i =
                        (chart as any)[counterName] % len;
                    (chart as any)[counterName] += 1;
                }
                if (defaults) {
                    value = defaults[i];
                }
            }
            // Set the colorIndex
            if (typeof i !== 'undefined') {
                (this as any)[indexName] = i;
            }
            (this as any)[prop] = value;
        },

        /**
         * Get the series' color based on either the options or pulled from
         * global options.
         *
         * @private
         * @function Highcharts.Series#getColor
         * @return {void}
         */
        getColor: function (this: Highcharts.Series): void {
            if (this.chart.styledMode) {
                this.getCyclic('color');

            } else if (this.options.colorByPoint) {
                // #4359, selected slice got series.color even when colorByPoint
                // was set.
                this.options.color = null as any;
            } else {
                this.getCyclic(
                    'color',
                    this.options.color ||
                    (defaultPlotOptions as any)[this.type].color,
                    this.chart.options.colors
                );
            }
        },

        /**
         * Get the series' symbol based on either the options or pulled from
         * global options.
         *
         * @private
         * @function Highcharts.Series#getSymbol
         * @return {void}
         */
        getSymbol: function (this: Highcharts.Series): void {
            var seriesMarkerOption = this.options.marker;

            this.getCyclic(
                'symbol',
                (seriesMarkerOption as any).symbol,
                this.chart.options.symbols
            );
        },

        /**
         * Finds the index of an existing point that matches the given point
         * options.
         *
         * @private
         * @function Highcharts.Series#findPointIndex
         * @param    {Highcharts.PointOptionsObject} optionsObject
         *           The options of the point.
         * @param    {number} fromIndex
         *           The index to start searching from, used for optimizing
         *           series with required sorting.
         * @returns  {number|undefined}
         *           Returns the index of a matching point, or undefined if no
         *           match is found.
         */
        findPointIndex: function (
            this: Highcharts.Series,
            optionsObject: Highcharts.PointOptionsObject,
            fromIndex: number
        ): (number|undefined) {
            var id = optionsObject.id,
                x = optionsObject.x,
                oldData = this.points,
                matchingPoint,
                matchedById,
                pointIndex;

            if (id) {
                matchingPoint = this.chart.get(id);
                pointIndex = matchingPoint && matchingPoint.index;
                if (typeof pointIndex !== 'undefined') {
                    matchedById = true;
                }
            }

            // Search for the same X in the existing data set
            if (typeof pointIndex === 'undefined' && isNumber(x)) {
                pointIndex = (this.xData as any).indexOf(x as any, fromIndex);
            }

            // Reduce pointIndex if data is cropped
            if (pointIndex !== -1 &&
                typeof pointIndex !== 'undefined' &&
                this.cropped
            ) {
                pointIndex = (pointIndex >= (this.cropStart as any)) ?
                    pointIndex - (this.cropStart as any) : pointIndex;
            }

            if (!matchedById &&
                oldData[pointIndex] && oldData[pointIndex].touched
            ) {
                pointIndex = void 0;
            }
            return pointIndex;
        },

        /**
         * @private
         * @borrows LegendSymbolMixin.drawLineMarker as Highcharts.Series#drawLegendSymbol
         */
        drawLegendSymbol: LegendSymbolMixin.drawLineMarker,

        /**
         * Internal function called from setData. If the point count is the same
         * as is was, or if there are overlapping X values, just run
         * Point.update which is cheaper, allows animation, and keeps references
         * to points. This also allows adding or removing points if the X-es
         * don't match.
         *
         * @private
         * @function Highcharts.Series#updateData
         *
         * @param {Array<Highcharts.PointOptionsType>} data
         *
         * @return {boolean}
         */
        updateData: function (
            this: Highcharts.Series,
            data: Array<Highcharts.PointOptionsType>
        ): boolean {
            var options = this.options,
                oldData = this.points,
                pointsToAdd = [] as Array<Highcharts.PointOptionsType>,
                hasUpdatedByKey,
                i,
                point,
                lastIndex: number,
                requireSorting = this.requireSorting,
                equalLength = data.length === oldData.length,
                succeeded = true;

            this.xIncrement = null;

            // Iterate the new data
            data.forEach(function (
                pointOptions: Highcharts.PointOptionsType,
                i: number
            ): void {
                var id,
                    x,
                    pointIndex,
                    optionsObject = (
                        defined(pointOptions) &&
                        this.pointClass.prototype.optionsToObject.call(
                            { series: this },
                            pointOptions
                        )
                    ) || {};

                // Get the x of the new data point
                x = optionsObject.x;
                id = optionsObject.id;

                if (id || isNumber(x)) {
                    pointIndex = this.findPointIndex(
                        optionsObject,
                        lastIndex
                    );

                    // Matching X not found
                    // or used already due to ununique x values (#8995),
                    // add point (but later)
                    if (
                        pointIndex === -1 ||
                        typeof pointIndex === 'undefined'
                    ) {
                        pointsToAdd.push(pointOptions);

                    // Matching X found, update
                    } else if (
                        oldData[pointIndex] &&
                        pointOptions !== (options.data as any)[pointIndex]
                    ) {
                        oldData[pointIndex].update(
                            pointOptions,
                            false,
                            null as any,
                            false
                        );

                        // Mark it touched, below we will remove all points that
                        // are not touched.
                        oldData[pointIndex].touched = true;

                        // Speed optimize by only searching after last known
                        // index. Performs ~20% bettor on large data sets.
                        if (requireSorting) {
                            lastIndex = pointIndex + 1;
                        }
                    // Point exists, no changes, don't remove it
                    } else if (oldData[pointIndex]) {
                        oldData[pointIndex].touched = true;
                    }

                    // If the length is equal and some of the nodes had a
                    // match in the same position, we don't want to remove
                    // non-matches.
                    if (
                        !equalLength ||
                        i !== pointIndex ||
                        this.hasDerivedData
                    ) {
                        hasUpdatedByKey = true;
                    }
                } else {
                    // Gather all points that are not matched
                    pointsToAdd.push(pointOptions);
                }
            }, this);

            // Remove points that don't exist in the updated data set
            if (hasUpdatedByKey) {
                i = oldData.length;
                while (i--) {
                    point = oldData[i];
                    if (point && !point.touched) {
                        point.remove(false);
                    }
                }

            // If we did not find keys (ids or x-values), and the length is the
            // same, update one-to-one
            } else if (equalLength) {
                data.forEach(function (
                    point: Highcharts.PointOptionsType,
                    i: number
                ): void {
                    // .update doesn't exist on a linked, hidden series (#3709)
                    // (#10187)
                    if (oldData[i].update && point !== oldData[i].y) {
                        oldData[i].update(point, false, null as any, false);
                    }
                });
                // Don't add new points since those configs are used above
                pointsToAdd.length = 0;

            // Did not succeed in updating data
            } else {
                succeeded = false;
            }

            oldData.forEach(function (point: Highcharts.Point): void {
                if (point) {
                    point.touched = false;
                }
            });

            if (!succeeded) {
                return false;
            }

            // Add new points
            pointsToAdd.forEach(function (point): void {
                this.addPoint(point, false, null as any, null as any, false);
            }, this);

            if (
                this.xIncrement === null &&
                this.xData &&
                this.xData.length
            ) {
                this.xIncrement = arrayMax(this.xData);
                this.autoIncrement();
            }

            return true;
        },

        /**
         * Apply a new set of data to the series and optionally redraw it. The
         * new data array is passed by reference (except in case of
         * `updatePoints`), and may later be mutated when updating the chart
         * data.
         *
         * Note the difference in behaviour when setting the same amount of
         * points, or a different amount of points, as handled by the
         * `updatePoints` parameter.
         *
         * @sample highcharts/members/series-setdata/
         *         Set new data from a button
         * @sample highcharts/members/series-setdata-pie/
         *         Set data in a pie
         * @sample stock/members/series-setdata/
         *         Set new data in Highstock
         * @sample maps/members/series-setdata/
         *         Set new data in Highmaps
         *
         * @function Highcharts.Series#setData
         *
         * @param {Array<Highcharts.PointOptionsType>} data
         *        Takes an array of data in the same format as described under
         *        `series.{type}.data` for the given series type, for example a
         *        line series would take data in the form described under
         *        [series.line.data](https://api.highcharts.com/highcharts/series.line.data).
         *
         * @param {boolean} [redraw=true]
         *        Whether to redraw the chart after the series is altered. If
         *        doing more operations on the chart, it is a good idea to set
         *        redraw to false and call {@link Chart#redraw} after.
         *
         * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
         *        When the updated data is the same length as the existing data,
         *        points will be updated by default, and animation visualizes
         *        how the points are changed. Set false to disable animation, or
         *        a configuration object to set duration or easing.
         *
         * @param {boolean} [updatePoints=true]
         *        When this is true, points will be updated instead of replaced
         *        whenever possible. This occurs a) when the updated data is the
         *        same length as the existing data, b) when points are matched
         *        by their id's, or c) when points can be matched by X values.
         *        This allows updating with animation and performs better. In
         *        this case, the original array is not passed by reference. Set
         *        `false` to prevent.
         *
         * @return {void}
         */
        setData: function (
            this: Highcharts.Series,
            data: Array<Highcharts.PointOptionsType>,
            redraw?: boolean,
            animation?: (boolean|Highcharts.AnimationOptionsObject),
            updatePoints?: boolean
        ): void {
            var series = this,
                oldData = series.points,
                oldDataLength = (oldData && oldData.length) || 0,
                dataLength,
                options = series.options,
                chart = series.chart,
                firstPoint = null,
                xAxis = series.xAxis,
                i,
                turboThreshold = options.turboThreshold,
                pt,
                xData = this.xData,
                yData = this.yData,
                pointArrayMap = series.pointArrayMap,
                valueCount = pointArrayMap && pointArrayMap.length,
                keys = options.keys,
                indexOfX = 0,
                indexOfY = 1,
                updatedData;

            data = data || [];
            dataLength = data.length;
            redraw = pick(redraw, true);

            // First try to run Point.update which is cheaper, allows animation,
            // and keeps references to points.
            if (
                updatePoints !== false &&
                dataLength &&
                oldDataLength &&
                !series.cropped &&
                !series.hasGroupedData &&
                series.visible &&
                // Soft updating has no benefit in boost, and causes JS error
                // (#8355)
                !series.isSeriesBoosting
            ) {
                updatedData = this.updateData(data);
            }

            if (!updatedData) {

                // Reset properties
                series.xIncrement = null;

                series.colorCounter = 0; // for series with colorByPoint (#1547)

                // Update parallel arrays
                this.parallelArrays.forEach(function (key: string): void {
                    (series as any)[key + 'Data'].length = 0;
                });

                // In turbo mode, only one- or twodimensional arrays of numbers
                // are allowed. The first value is tested, and we assume that
                // all the rest are defined the same way. Although the 'for'
                // loops are similar, they are repeated inside each if-else
                // conditional for max performance.
                if (turboThreshold && dataLength > turboThreshold) {

                    firstPoint = series.getFirstValidPoint(data);

                    if (isNumber(firstPoint)) { // assume all points are numbers
                        for (i = 0; i < dataLength; i++) {
                            (xData as any)[i] = this.autoIncrement();
                            (yData as any)[i] = data[i];
                        }

                    // Assume all points are arrays when first point is
                    } else if (isArray(firstPoint)) {
                        if (valueCount) { // [x, low, high] or [x, o, h, l, c]
                            for (i = 0; i < dataLength; i++) {
                                pt = data[i];
                                (xData as any)[i] = (pt as any)[0];
                                (yData as any)[i] =
                                    (pt as any).slice(1, valueCount + 1);
                            }
                        } else { // [x, y]
                            if (keys) {
                                indexOfX = keys.indexOf('x');
                                indexOfY = keys.indexOf('y');

                                indexOfX = indexOfX >= 0 ? indexOfX : 0;
                                indexOfY = indexOfY >= 0 ? indexOfY : 1;
                            }

                            for (i = 0; i < dataLength; i++) {
                                pt = data[i];
                                (xData as any)[i] = (pt as any)[indexOfX];
                                (yData as any)[i] = (pt as any)[indexOfY];
                            }
                        }
                    } else {
                        // Highcharts expects configs to be numbers or arrays in
                        // turbo mode
                        H.error(12, false, chart);
                    }
                } else {
                    for (i = 0; i < dataLength; i++) {
                        // stray commas in oldIE:
                        if (typeof data[i] !== 'undefined') {
                            pt = { series: series };
                            series.pointClass.prototype.applyOptions.apply(
                                pt,
                                [data[i]]
                            );
                            series.updateParallelArrays(pt as any, i);
                        }
                    }
                }

                // Forgetting to cast strings to numbers is a common caveat when
                // handling CSV or JSON
                if (yData && isString(yData[0])) {
                    H.error(14, true, chart);
                }

                series.data = [];
                series.options.data = series.userOptions.data = data;

                // destroy old points
                i = oldDataLength;
                while (i--) {
                    if (oldData[i] && oldData[i].destroy) {
                        oldData[i].destroy();
                    }
                }

                // reset minRange (#878)
                if (xAxis) {
                    xAxis.minRange = xAxis.userMinRange;
                }

                // redraw
                series.isDirty = chart.isDirtyBox = true;
                series.isDirtyData = !!oldData;
                animation = false;
            }

            // Typically for pie series, points need to be processed and
            // generated prior to rendering the legend
            if (options.legendType === 'point') {
                this.processData();
                this.generatePoints();
            }

            if (redraw) {
                chart.redraw(animation);
            }
        },

        /**
         * Internal function to process the data by cropping away unused data
         * points if the series is longer than the crop threshold. This saves
         * computing time for large series. In Highstock, this function is
         * extended to provide data grouping.
         *
         * @private
         * @function Highcharts.Series#processData
         * @param {boolean} [force]
         *        Force data grouping.
         * @return {boolean|undefined}
         */
        processData: function (
            this: Highcharts.Series,
            force?: boolean
        ): (boolean|undefined) {
            var series = this,
                // copied during slice operation:
                processedXData: Array<number> = series.xData as any,
                processedYData: (
                    Array<number>|Array<Array<number>>
                ) = (series.yData as any),
                dataLength = (processedXData as any).length,
                croppedData: Highcharts.SeriesCropDataObject,
                cropStart = 0,
                cropped,
                distance,
                closestPointRange,
                xAxis = series.xAxis,
                i, // loop variable
                options = series.options,
                cropThreshold = options.cropThreshold,
                getExtremesFromAll =
                    series.getExtremesFromAll ||
                    options.getExtremesFromAll, // #4599
                isCartesian = series.isCartesian,
                xExtremes,
                val2lin = xAxis && xAxis.val2lin,
                isLog = xAxis && xAxis.isLog,
                throwOnUnsorted = series.requireSorting,
                min,
                max;

            // If the series data or axes haven't changed, don't go through
            // this. Return false to pass the message on to override methods
            // like in data grouping.
            if (isCartesian &&
                !series.isDirty &&
                !xAxis.isDirty &&
                !series.yAxis.isDirty &&
                !force
            ) {
                return false;
            }

            if (xAxis) {
                // corrected for log axis (#3053)
                xExtremes = xAxis.getExtremes();
                min = xExtremes.min;
                max = xExtremes.max;
            }

            // optionally filter out points outside the plot area
            if (isCartesian &&
                series.sorted &&
                !getExtremesFromAll &&
                (
                    !cropThreshold ||
                    dataLength > cropThreshold ||
                    series.forceCrop
                )
            ) {

                // it's outside current extremes
                if ((processedXData as any)[dataLength - 1] < (min as any) ||
                    (processedXData as any)[0] > (max as any)
                ) {
                    processedXData = [];
                    processedYData = [];

                // only crop if it's actually spilling out
                } else if (
                    series.yData && (
                        (processedXData as any)[0] < (min as any) ||
                        (processedXData as any)[dataLength - 1] > (max as any)
                    )
                ) {
                    croppedData = this.cropData(
                        series.xData as any,
                        series.yData as any,
                        min as any,
                        max as any
                    );
                    processedXData = croppedData.xData;
                    processedYData = croppedData.yData;
                    cropStart = croppedData.start;
                    cropped = true;
                }
            }


            // Find the closest distance between processed points
            i = (processedXData as any).length || 1;
            while (--i) {
                distance = (
                    isLog ?
                        (val2lin((processedXData as any)[i]) -
                        val2lin((processedXData as any)[i - 1])) :
                        ((processedXData as any)[i] -
                        (processedXData as any)[i - 1])
                );

                if (distance > 0 &&
                    (
                        typeof closestPointRange === 'undefined' ||
                        distance < closestPointRange
                    )
                ) {
                    closestPointRange = distance;

                // Unsorted data is not supported by the line tooltip, as well
                // as data grouping and navigation in Stock charts (#725) and
                // width calculation of columns (#1900)
                } else if (distance < 0 && throwOnUnsorted) {
                    H.error(15, false, series.chart);
                    throwOnUnsorted = false; // Only once
                }
            }

            // Record the properties
            series.cropped = cropped; // undefined or true
            series.cropStart = cropStart;
            series.processedXData = processedXData;
            series.processedYData = processedYData;

            series.closestPointRange =
                series.basePointRange = closestPointRange;

        },

        /**
         * Iterate over xData and crop values between min and max. Returns
         * object containing crop start/end cropped xData with corresponding
         * part of yData, dataMin and dataMax within the cropped range.
         *
         * @private
         * @function Highcharts.Series#cropData
         * @param {Array<number>} xData
         * @param {Array<number>} yData
         * @param {number} min
         * @param {number} max
         * @param {number} [cropShoulder]
         * @return {Highcharts.SeriesCropDataObject}
         */
        cropData: function (
            this: Highcharts.Series,
            xData: Array<number>,
            yData: Array<number>,
            min: number,
            max: number,
            cropShoulder?: number
        ): Highcharts.SeriesCropDataObject {
            var dataLength = xData.length,
                cropStart = 0,
                cropEnd = dataLength,
                i,
                j;

            // line-type series need one point outside
            cropShoulder = pick(cropShoulder, this.cropShoulder);

            // iterate up to find slice start
            for (i = 0; i < dataLength; i++) {
                if (xData[i] >= min) {
                    cropStart = Math.max(0, i - (cropShoulder as any));
                    break;
                }
            }

            // proceed to find slice end
            for (j = i; j < dataLength; j++) {
                if (xData[j] > max) {
                    cropEnd = j + (cropShoulder as any);
                    break;
                }
            }

            return {
                xData: xData.slice(cropStart, cropEnd),
                yData: yData.slice(cropStart, cropEnd),
                start: cropStart,
                end: cropEnd
            };
        },


        /**
         * Generate the data point after the data has been processed by cropping
         * away unused points and optionally grouped in Highcharts Stock.
         *
         * @private
         * @function Highcharts.Series#generatePoints
         * @return {void}
         */
        generatePoints: function (this: Highcharts.Series): void {
            var series = this,
                options = series.options,
                dataOptions = options.data,
                data = series.data,
                dataLength,
                processedXData = series.processedXData,
                processedYData = series.processedYData,
                PointClass = series.pointClass,
                processedDataLength = (processedXData as any).length,
                cropStart = series.cropStart || 0,
                cursor,
                hasGroupedData = series.hasGroupedData,
                keys = options.keys,
                point,
                points = [],
                i;

            if (!data && !hasGroupedData) {
                var arr = [] as Array<Highcharts.Point>;

                arr.length = (dataOptions as any).length;
                data = series.data = arr;
            }

            if (keys && hasGroupedData) {
                // grouped data has already applied keys (#6590)
                series.options.keys = false as any;
            }

            for (i = 0; i < processedDataLength; i++) {
                cursor = cropStart + i;
                if (!hasGroupedData) {
                    point = data[cursor];
                    // #970:
                    if (
                        !point &&
                        typeof (dataOptions as any)[cursor] !== 'undefined'
                    ) {
                        data[cursor] = point = (new PointClass()).init(
                            series,
                            (dataOptions as any)[cursor],
                            (processedXData as any)[i]
                        );
                    }
                } else {
                    // splat the y data in case of ohlc data array
                    point = (new PointClass()).init(
                        series,
                        [(processedXData as any)[i]].concat(
                            splat((processedYData as any)[i])
                        )
                    );

                    /**
                     * Highstock only. If a point object is created by data
                     * grouping, it doesn't reflect actual points in the raw
                     * data. In this case, the `dataGroup` property holds
                     * information that points back to the raw data.
                     *
                     * - `dataGroup.start` is the index of the first raw data
                     *   point in the group.
                     *
                     * - `dataGroup.length` is the amount of points in the
                     *   group.
                     *
                     * @product highstock
                     *
                     * @name Highcharts.Point#dataGroup
                     * @type {Highcharts.DataGroupingInfoObject|undefined}
                     */
                    point.dataGroup = (series.groupMap as any)[i];
                    if ((point.dataGroup as any).options) {
                        point.options = (point.dataGroup as any).options;
                        extend(point, (point.dataGroup as any).options);
                        // Collision of props and options (#9770)
                        delete point.dataLabels;
                    }
                }
                if (point) { // #6279
                    /**
                     * Contains the point's index in the `Series.points` array.
                     *
                     * @name Highcharts.Point#index
                     * @type {number}
                     * @readonly
                     */
                    point.index = cursor; // For faster access in Point.update
                    points[i] = point;
                }
            }

            // restore keys options (#6590)
            series.options.keys = keys;

            // Hide cropped-away points - this only runs when the number of
            // points is above cropThreshold, or when swithching view from
            // non-grouped data to grouped data (#637)
            if (
                data &&
                (
                    processedDataLength !== (dataLength = data.length) ||
                    hasGroupedData
                )
            ) {
                for (i = 0; i < dataLength; i++) {
                    // when has grouped data, clear all points
                    if (i === cropStart && !hasGroupedData) {
                        i += processedDataLength;
                    }
                    if (data[i]) {
                        data[i].destroyElements();
                        data[i].plotX = void 0; // #1003
                    }
                }
            }

            /**
             * Read only. An array containing those values converted to points.
             * In case the series data length exceeds the `cropThreshold`, or if
             * the data is grouped, `series.data` doesn't contain all the
             * points. Also, in case a series is hidden, the `data` array may be
             * empty. To access raw values, `series.options.data` will always be
             * up to date. `Series.data` only contains the points that have been
             * created on demand. To modify the data, use
             * {@link Highcharts.Series#setData} or
             * {@link Highcharts.Point#update}.
             *
             * @see Series.points
             *
             * @name Highcharts.Series#data
             * @type {Array<Highcharts.Point>}
             */
            series.data = data;

            /**
             * An array containing all currently visible point objects. In case
             * of cropping, the cropped-away points are not part of this array.
             * The `series.points` array starts at `series.cropStart` compared
             * to `series.data` and `series.options.data`. If however the series
             * data is grouped, these can't be correlated one to one. To modify
             * the data, use {@link Highcharts.Series#setData} or
             * {@link Highcharts.Point#update}.
             *
             * @name Highcharts.Series#points
             * @type {Array<Highcharts.Point>}
             */
            series.points = points;

            fireEvent(this, 'afterGeneratePoints');
        },

        /**
         * Get current X extremes for the visible data.
         *
         * @private
         * @function Highcharts.Series#getExtremes
         *
         * @param {Array<number>} xData
         *        The data to inspect. Defaults to the current data within the
         *        visible range.
         * @return {Highcharts.RangeObject}
         */
        getXExtremes: function (
            this: Highcharts.Series,
            xData: Array<number>
        ): Highcharts.RangeObject {
            return {
                min: arrayMin(xData),
                max: arrayMax(xData)
            };
        },

        /**
         * Calculate Y extremes for the visible data. The result is set as
         * `dataMin` and `dataMax` on the Series item.
         *
         * @private
         * @function Highcharts.Series#getExtremes
         * @param {Array<number>} [yData]
         *        The data to inspect. Defaults to the current data within the
         *        visible range.
         * @return {void}
         */
        getExtremes: function (
            this: Highcharts.Series,
            yData?: (Array<number>|Array<Array<number>>)
        ): void {
            var xAxis = this.xAxis,
                yAxis = this.yAxis,
                xData = this.processedXData || this.xData,
                yDataLength,
                activeYData = [],
                activeCounter = 0,
                // #2117, need to compensate for log X axis
                xExtremes,
                xMin = 0,
                xMax = 0,
                validValue,
                withinRange,
                // Handle X outside the viewed area. This does not work with
                // non-sorted data like scatter (#7639).
                shoulder = this.requireSorting ? this.cropShoulder : 0,
                positiveValuesOnly = yAxis ? yAxis.positiveValuesOnly : false,
                x,
                y: (number|Array<number>),
                i,
                j;

            yData = yData || this.stackedYData || this.processedYData || [];
            yDataLength = yData.length;

            if (xAxis) {
                xExtremes = xAxis.getExtremes();
                xMin = xExtremes.min;
                xMax = xExtremes.max;
            }

            for (i = 0; i < yDataLength; i++) {

                x = (xData as any)[i];
                y = yData[i];

                // For points within the visible range, including the first
                // point outside the visible range (#7061), consider y extremes.
                validValue = (
                    (isNumber(y) || isArray(y)) &&
                    (((y as any).length || y > 0) || !positiveValuesOnly)
                );
                withinRange = (
                    this.getExtremesFromAll ||
                    this.options.getExtremesFromAll ||
                    this.cropped ||
                    !xAxis || // for colorAxis support
                    (
                        ((xData as any)[i + shoulder] || x) >= xMin &&
                        ((xData as any)[i - shoulder] || x) <= xMax
                    )
                );

                if (validValue && withinRange) {

                    j = (y as any).length;
                    if (j) { // array, like ohlc or range data
                        while (j--) {
                            if (isNumber((y as any)[j])) { // #7380, #11513
                                activeYData[activeCounter++] = (y as any)[j];
                            }
                        }
                    } else {
                        activeYData[activeCounter++] = y;
                    }
                }
            }

            this.dataMin = arrayMin(activeYData);
            this.dataMax = arrayMax(activeYData);

            fireEvent(this, 'afterGetExtremes');
        },

        /**
         * Find and return the first non null point in the data
         *
         * @private
         * @function Highcharts.Series.getFirstValidPoint
         * @param {Array<Highcharts.PointOptionsType>} data
         *        Array of options for points
         *
         * @return {Highcharts.PointOptionsType}
         */
        getFirstValidPoint: function (
            this: Highcharts.Series,
            data: Array<Highcharts.PointOptionsType>
        ): Highcharts.PointOptionsType {
            var firstPoint = null,
                dataLength = data.length,
                i = 0;

            while (firstPoint === null && i < dataLength) {
                firstPoint = data[i];
                i++;
            }

            return firstPoint;
        },

        /**
         * Translate data points from raw data values to chart specific
         * positioning data needed later in the `drawPoints` and `drawGraph`
         * functions. This function can be overridden in plugins and custom
         * series type implementations.
         *
         * @function Highcharts.Series#translate
         * @return {void}
         * @fires Highcharts.Series#events:translate
         */
        translate: function (this: Highcharts.Series): void {
            if (!this.processedXData) { // hidden series
                this.processData();
            }
            this.generatePoints();
            var series = this,
                options = series.options,
                stacking = options.stacking,
                xAxis = series.xAxis,
                categories = xAxis.categories,
                yAxis = series.yAxis,
                points = series.points,
                dataLength = points.length,
                hasModifyValue = !!series.modifyValue,
                i,
                pointPlacement = series.pointPlacementToXValue(), // #7860
                dynamicallyPlaced = isNumber(pointPlacement),
                threshold = options.threshold,
                stackThreshold = options.startFromThreshold ? threshold : 0,
                plotX,
                plotY,
                lastPlotX,
                stackIndicator,
                zoneAxis = this.zoneAxis || 'y',
                closestPointRangePx = Number.MAX_VALUE;

            /**
             * Plotted coordinates need to be within a limited range. Drawing
             * too far outside the viewport causes various rendering issues
             * (#3201, #3923, #7555).
             * @private
             */
            function limitedRange(val: number): number {
                return clamp(val, -1e5, 1e5);
            }

            // Translate each point
            for (i = 0; i < dataLength; i++) {
                var point = points[i],
                    xValue = point.x,
                    yValue = point.y,
                    yBottom = point.low,
                    stack = stacking && yAxis.stacks[(
                        series.negStacks &&
                        (yValue as any) <
                        (stackThreshold ? 0 : (threshold as any)) ?
                            '-' :
                            ''
                    ) + series.stackKey],
                    pointStack,
                    stackValues;

                // Discard disallowed y values for log axes (#3434)
                if (yAxis.positiveValuesOnly &&
                    yValue !== null &&
                    (yValue as any) <= 0
                ) {
                    point.isNull = true;
                }

                // Get the plotX translation
                point.plotX = plotX = correctFloat( // #5236
                    limitedRange((xAxis.translate as any)( // #3923
                        xValue,
                        0,
                        0,
                        0,
                        1,
                        pointPlacement,
                        this.type === 'flags'
                    )) // #3923
                );

                // Calculate the bottom y value for stacked series
                if (stacking &&
                    series.visible &&
                    stack &&
                    stack[xValue as any]
                ) {
                    stackIndicator = series.getStackIndicator(
                        stackIndicator,
                        xValue as any,
                        series.index as any
                    );

                    if (!point.isNull) {
                        pointStack = stack[xValue as any];
                        stackValues =
                            pointStack.points[stackIndicator.key as any];
                    }
                }

                if (isArray(stackValues)) {
                    yBottom = stackValues[0];
                    yValue = stackValues[1];

                    if (yBottom === stackThreshold &&
                        (stackIndicator as any).key ===
                            (stack as any)[xValue as any].base
                    ) {
                        yBottom = pick<number|undefined, number>(
                            (isNumber(threshold) && threshold) as any,
                            yAxis.min as any
                        );
                    }

                    // #1200, #1232
                    if (yAxis.positiveValuesOnly && yBottom <= 0) {
                        yBottom = null as any;
                    }

                    point.total = point.stackTotal = (pointStack as any).total;
                    point.percentage =
                        (pointStack as any).total &&
                        ((point.y as any) / (pointStack as any).total * 100);
                    point.stackY = yValue;

                    // Place the stack label

                    // in case of variwide series (where widths of points are
                    // different in most cases), stack labels are positioned
                    // wrongly, so the call of the setOffset is omited here and
                    // labels are correctly positioned later, at the end of the
                    // variwide's translate function (#10962)
                    if (!(series as any).irregularWidths) {
                        (pointStack as any).setOffset(
                            series.pointXOffset || 0,
                            series.barW || 0
                        );
                    }

                }

                // Set translated yBottom or remove it
                point.yBottom = defined(yBottom) ?
                    limitedRange(yAxis.translate(
                        (yBottom as any), 0 as any, 1 as any, 0 as any, 1 as any
                    ) as any) :
                    null as any;

                // general hook, used for Highstock compare mode
                if (hasModifyValue) {
                    yValue = (series.modifyValue as any)(yValue, point);
                }

                // Set the the plotY value, reset it for redraws
                // #3201
                point.plotY = plotY = (
                    (typeof yValue === 'number' && yValue !== Infinity) ?
                        limitedRange(yAxis.translate(
                            yValue, 0 as any, 1 as any, 0 as any, 1 as any
                        ) as any) :
                        void 0
                );

                point.isInside =
                    typeof plotY !== 'undefined' &&
                    plotY >= 0 &&
                    plotY <= yAxis.len && // #3519
                    plotX >= 0 &&
                    plotX <= xAxis.len;


                // Set client related positions for mouse tracking
                point.clientX = dynamicallyPlaced ?
                    correctFloat(xAxis.translate(
                        xValue as any,
                        0 as any,
                        0 as any,
                        0 as any,
                        1 as any,
                        pointPlacement
                    ) as any) :
                    plotX; // #1514, #5383, #5518

                // Negative points. For bubble charts, this means negative z
                // values (#9728)
                point.negative = (point as any)[zoneAxis] < (
                    (options as any)[zoneAxis + 'Threshold'] ||
                    threshold ||
                    0
                );

                // some API data
                point.category = (
                    categories &&
                    typeof (categories as any)[point.x as any] !== 'undefined' ?
                        (categories as any)[point.x as any] :
                        point.x
                );

                // Determine auto enabling of markers (#3635, #5099)
                if (!point.isNull && point.visible !== false) {
                    if (typeof lastPlotX !== 'undefined') {
                        closestPointRangePx = Math.min(
                            closestPointRangePx,
                            Math.abs(plotX - lastPlotX)
                        );
                    }
                    lastPlotX = plotX;
                }

                // Find point zone
                point.zone = (this.zones.length && point.getZone() as any);
            }
            series.closestPointRangePx = closestPointRangePx;

            fireEvent(this, 'afterTranslate');
        },

        /**
         * Return the series points with null points filtered out.
         *
         * @function Highcharts.Series#getValidPoints
         *
         * @param {Array<Highcharts.Point>} [points]
         *        The points to inspect, defaults to {@link Series.points}.
         *
         * @param {boolean} [insideOnly=false]
         *        Whether to inspect only the points that are inside the visible
         *        view.
         *
         * @param {boolean} [allowNull=false]
         *        Whether to allow null points to pass as valid points.
         *
         * @return {Array<Highcharts.Point>}
         *         The valid points.
         */
        getValidPoints: function (
            this: Highcharts.Series,
            points?: Array<Highcharts.Point>,
            insideOnly?: boolean,
            allowNull?: boolean
        ): Array<Highcharts.Point> {
            var chart = this.chart;

            // #3916, #5029, #5085
            return (points || this.points || []).filter(
                function isValidPoint(point: Highcharts.Point): boolean {
                    if (insideOnly && !chart.isInsidePlot(
                        point.plotX as any,
                        point.plotY as any,
                        chart.inverted
                    )) {
                        return false;
                    }
                    return point.visible !== false &&
                        (allowNull || !point.isNull);
                }
            );
        },

        /**
         * Get the clipping for the series. Could be called for a series to
         * initiate animating the clip or to set the final clip (only width
         * and x).
         *
         * @private
         * @function Highcharts.Series#getClip
         * @param  {boolean|Highcharts.AnimationOptionsObject} [animation]
         *         Initialize the animation.
         * @param  {boolean} [finalBox]
         *         Final size for the clip - end state for the animation.
         * @return {Highcharts.Dictionary<number>}
         */
        getClipBox: function (
            this: Highcharts.Series,
            animation?: (boolean|Highcharts.AnimationOptionsObject),
            finalBox?: boolean
        ): Highcharts.Dictionary<number> {
            var series = this,
                options = series.options,
                chart = series.chart,
                inverted = chart.inverted,
                xAxis = series.xAxis,
                yAxis = xAxis && series.yAxis,
                clipBox;

            if (animation && options.clip === false && yAxis) {
                // support for not clipped series animation (#10450)
                clipBox = inverted ? {
                    y: -chart.chartWidth + yAxis.len + (yAxis.pos as any),
                    height: chart.chartWidth,
                    width: chart.chartHeight,
                    x: -chart.chartHeight + xAxis.len + (xAxis.pos as any)
                } : {
                    y: -(yAxis.pos as any),
                    height: chart.chartHeight,
                    width: chart.chartWidth,
                    x: -(xAxis.pos as any)
                };
                // x and width will be changed later when setting for animation
                // initial state in Series.setClip
            } else {
                clipBox = series.clipBox || chart.clipBox;

                if (finalBox) {
                    clipBox.width = chart.plotSizeX as any;
                    clipBox.x = 0;
                }
            }

            return !finalBox ? clipBox : {
                width: clipBox.width,
                x: clipBox.x
            };
        },

        /**
         * Set the clipping for the series. For animated series it is called
         * twice, first to initiate animating the clip then the second time
         * without the animation to set the final clip.
         *
         * @private
         * @function Highcharts.Series#setClip
         * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
         * @return {void}
         */
        setClip: function (
            this: Highcharts.Series,
            animation?: (boolean|Highcharts.AnimationOptionsObject)
        ): void {
            var chart = this.chart,
                options = this.options,
                renderer = chart.renderer,
                inverted = chart.inverted,
                seriesClipBox = this.clipBox,
                clipBox = this.getClipBox(animation),
                sharedClipKey =
                    this.sharedClipKey ||
                    [
                        '_sharedClip',
                        animation && (animation as any).duration,
                        animation && (animation as any).easing,
                        clipBox.height,
                        options.xAxis,
                        options.yAxis
                    ].join(','), // #4526
                clipRect = (chart as any)[sharedClipKey],
                markerClipRect = (chart as any)[sharedClipKey + 'm'];

            // If a clipping rectangle with the same properties is currently
            // present in the chart, use that.
            if (!clipRect) {

                // When animation is set, prepare the initial positions
                if (animation) {
                    clipBox.width = 0;
                    if (inverted) {
                        clipBox.x = (chart.plotSizeX as any) +
                            (options.clip !== false ? 0 : chart.plotTop);
                    }

                    (chart as any)[sharedClipKey + 'm'] = markerClipRect =
                        renderer.clipRect(
                            // include the width of the first marker
                            inverted ? (chart.plotSizeX as any) + 99 : -99,
                            inverted ? -chart.plotLeft : -chart.plotTop,
                            99,
                            inverted ? chart.chartWidth : chart.chartHeight
                        );
                }
                (chart as any)[sharedClipKey] = clipRect =
                    (renderer.clipRect as any)(clipBox);
                // Create hashmap for series indexes
                clipRect.count = { length: 0 };

            }
            if (animation) {
                if (!clipRect.count[this.index as any]) {
                    clipRect.count[this.index as any] = true;
                    clipRect.count.length += 1;
                }
            }

            if (options.clip !== false || animation) {
                (this.group as any).clip(
                    animation || seriesClipBox ? clipRect : chart.clipRect
                );
                (this.markerGroup as any).clip(markerClipRect);
                this.sharedClipKey = sharedClipKey;
            }

            // Remove the shared clipping rectangle when all series are shown
            if (!animation) {
                if (clipRect.count[this.index as any]) {
                    delete clipRect.count[this.index as any];
                    clipRect.count.length -= 1;
                }

                if (
                    clipRect.count.length === 0 &&
                    sharedClipKey &&
                    (chart as any)[sharedClipKey]
                ) {
                    if (!seriesClipBox) {
                        (chart as any)[sharedClipKey] =
                            (chart as any)[sharedClipKey].destroy();
                    }
                    if ((chart as any)[sharedClipKey + 'm']) {
                        (chart as any)[sharedClipKey + 'm'] =
                            (chart as any)[sharedClipKey + 'm'].destroy();
                    }
                }
            }
        },

        /**
         * Animate in the series. Called internally twice. First with the `init`
         * parameter set to true, which sets up the initial state of the
         * animation. Then when ready, it is called with the `init` parameter
         * undefined, in order to perform the actual animation. After the
         * second run, the function is removed.
         *
         * @function Highcharts.Series#animate
         *
         * @param {boolean} [init]
         *        Initialize the animation.
         *
         * @return {void}
         */
        animate: function (this: Highcharts.Series, init?: boolean): void {
            var series = this,
                chart = series.chart,
                animation = animObject(series.options.animation),
                clipRect,
                sharedClipKey,
                finalBox;

            // Initialize the animation. Set up the clipping rectangle.
            if (init) {

                series.setClip(animation);

            // Run the animation
            } else {
                sharedClipKey = this.sharedClipKey;
                clipRect = (chart as any)[sharedClipKey as any];

                finalBox = series.getClipBox(animation, true);

                if (clipRect) {
                    clipRect.animate(finalBox, animation);
                }
                if ((chart as any)[sharedClipKey + 'm']) {
                    (chart as any)[sharedClipKey + 'm'].animate({
                        width: finalBox.width + 99,
                        x: finalBox.x - (chart.inverted ? 0 : 99)
                    }, animation);
                }

                // Delete this function to allow it only once
                series.animate = null as any;
            }
        },

        /**
         * This runs after animation to land on the final plot clipping.
         *
         * @private
         * @function Highcharts.Series#afterAnimate
         * @return {void}
         * @fires Highcharts.Series#event:afterAnimate
         */
        afterAnimate: function (this: Highcharts.Series): void {
            this.setClip();
            fireEvent(this, 'afterAnimate');
            this.finishedAnimating = true;
        },

        /**
         * Draw the markers for line-like series types, and columns or other
         * graphical representation for {@link Point} objects for other series
         * types. The resulting element is typically stored as
         * {@link Point.graphic}, and is created on the first call and updated
         * and moved on subsequent calls.
         *
         * @function Highcharts.Series#drawPoints
         */
        drawPoints: function (this: Highcharts.Series): void {
            var series = this,
                points = series.points,
                chart = series.chart,
                i,
                point,
                graphic,
                verb,
                options = series.options,
                seriesMarkerOptions = options.marker,
                pointMarkerOptions,
                hasPointMarker,
                markerGroup = (
                    (series as any)[series.specialGroup as any] ||
                    series.markerGroup
                ),
                xAxis = series.xAxis,
                markerAttribs,
                globallyEnabled = pick(
                    (seriesMarkerOptions as any).enabled,
                    !xAxis || xAxis.isRadial ? true : null,
                    // Use larger or equal as radius is null in bubbles (#6321)
                    (series.closestPointRangePx as any) >= (
                        (seriesMarkerOptions as any).enabledThreshold *
                        (seriesMarkerOptions as any).radius
                    )
                );

            if ((seriesMarkerOptions as any).enabled !== false ||
                series._hasPointMarkers
            ) {

                for (i = 0; i < points.length; i++) {
                    point = points[i];
                    graphic = point.graphic;
                    verb = graphic ? 'animate' : 'attr';
                    pointMarkerOptions = point.marker || {};
                    hasPointMarker = !!point.marker;
                    const shouldDrawMarker = (
                        (
                            globallyEnabled &&
                            typeof pointMarkerOptions.enabled === 'undefined'
                        ) || pointMarkerOptions.enabled
                    ) && !point.isNull && point.visible !== false;

                    // only draw the point if y is defined
                    if (shouldDrawMarker) {
                        // Shortcuts
                        const symbol = pick<string|undefined, string>(
                            pointMarkerOptions.symbol, series.symbol as any
                        );

                        markerAttribs = series.markerAttribs(
                            point,
                            (point.selected && 'select') as any
                        );

                        const isInside = point.isInside !== false;
                        if (graphic) { // update
                            // Since the marker group isn't clipped, each
                            // individual marker must be toggled
                            graphic[isInside ? 'show' : 'hide'](isInside)
                                .animate(markerAttribs);

                        } else if (
                            isInside &&
                            (markerAttribs.width > 0 || point.hasImage)
                        ) {

                            /**
                             * The graphic representation of the point.
                             * Typically this is a simple shape, like a `rect`
                             * for column charts or `path` for line markers, but
                             * for some complex series types like boxplot or 3D
                             * charts, the graphic may be a `g` element
                             * containing other shapes. The graphic is generated
                             * the first time {@link Series#drawPoints} runs,
                             * and updated and moved on subsequent runs.
                             *
                             * @name Point#graphic
                             * @type {SVGElement}
                             */
                            point.graphic = graphic = chart.renderer
                                .symbol(
                                    symbol,
                                    markerAttribs.x,
                                    markerAttribs.y,
                                    markerAttribs.width,
                                    markerAttribs.height,
                                    hasPointMarker ?
                                        pointMarkerOptions :
                                        seriesMarkerOptions
                                )
                                .add(markerGroup);
                        }

                        // Presentational attributes
                        if (graphic && !chart.styledMode) {
                            graphic[verb](
                                series.pointAttribs(
                                    point,
                                    (point.selected && 'select') as any
                                )
                            );
                        }

                        if (graphic) {
                            graphic.addClass(point.getClassName(), true);
                        }

                    } else if (graphic) {
                        point.graphic = graphic.destroy(); // #1269
                    }
                }
            }

        },

        /**
         * Get non-presentational attributes for a point. Used internally for
         * both styled mode and classic. Can be overridden for different series
         * types.
         *
         * @see Series#pointAttribs
         *
         * @function Highcharts.Series#markerAttribs
         *
         * @param {Highcharts.Point} point
         *        The Point to inspect.
         *
         * @param {string} [state]
         *        The state, can be either `hover`, `select` or undefined.
         *
         * @return {Highcharts.SVGAttributes}
         *         A hash containing those attributes that are not settable from
         *         CSS.
         */
        markerAttribs: function (
            this: Highcharts.Series,
            point: Highcharts.Point,
            state?: string
        ): Highcharts.SVGAttributes {
            var seriesMarkerOptions = this.options.marker,
                seriesStateOptions: Highcharts.PointStatesHoverOptionsObject,
                pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol ||
                    (seriesMarkerOptions as any).symbol
                ),
                pointStateOptions: Highcharts.PointStatesHoverOptionsObject,
                radius = pick(
                    pointMarkerOptions.radius,
                    (seriesMarkerOptions as any).radius
                ),
                attribs: Highcharts.SVGAttributes;

            // Handle hover and select states
            if (state) {
                seriesStateOptions = (seriesMarkerOptions as any).states[state];
                pointStateOptions = pointMarkerOptions.states &&
                    (pointMarkerOptions.states as any)[state];

                radius = pick(
                    pointStateOptions && pointStateOptions.radius,
                    seriesStateOptions && seriesStateOptions.radius,
                    radius + (
                        seriesStateOptions && seriesStateOptions.radiusPlus ||
                        0
                    )
                );
            }

            point.hasImage = symbol && symbol.indexOf('url') === 0;

            if (point.hasImage) {
                radius = 0; // and subsequently width and height is not set
            }

            attribs = {
                // Math.floor for #1843:
                x: Math.floor(point.plotX as any) - radius,
                y: (point.plotY as any) - radius
            };

            if (radius) {
                attribs.width = attribs.height = 2 * radius;
            }

            return attribs;

        },

        /**
         * Internal function to get presentational attributes for each point.
         * Unlike {@link Series#markerAttribs}, this function should return
         * those attributes that can also be set in CSS. In styled mode,
         * `pointAttribs` won't be called.
         *
         * @private
         * @function Highcharts.Series#pointAttribs
         *
         * @param {Highcharts.Point} [point]
         *        The point instance to inspect.
         *
         * @param {string} [state]
         *        The point state, can be either `hover`, `select` or 'normal'.
         *        If undefined, normal state is assumed.
         *
         * @return {Highcharts.SVGAttributes}
         *         The presentational attributes to be set on the point.
         */
        pointAttribs: function (
            this: Highcharts.Series,
            point?: Highcharts.Point,
            state?: string
        ): Highcharts.SVGAttributes {
            var seriesMarkerOptions = this.options.marker,
                seriesStateOptions,
                pointOptions = point && point.options,
                pointMarkerOptions = (
                    (pointOptions && pointOptions.marker) || {}
                ),
                pointStateOptions,
                color: (
                    Highcharts.ColorString|
                    Highcharts.GradientColorObject|
                    Highcharts.PatternObject|
                    undefined
                ) = this.color,
                pointColorOption = pointOptions && pointOptions.color,
                pointColor = point && point.color,
                strokeWidth = pick(
                    pointMarkerOptions.lineWidth,
                    (seriesMarkerOptions as any).lineWidth
                ),
                zoneColor = point && point.zone && point.zone.color,
                fill,
                stroke,
                opacity = 1;

            color = (
                pointColorOption ||
                zoneColor ||
                pointColor ||
                color
            );

            fill = (
                pointMarkerOptions.fillColor ||
                (seriesMarkerOptions as any).fillColor ||
                color
            );
            stroke = (
                pointMarkerOptions.lineColor ||
                (seriesMarkerOptions as any).lineColor ||
                color
            );

            // Handle hover and select states
            state = state || 'normal';
            if (state) {
                seriesStateOptions = (seriesMarkerOptions as any).states[state];
                pointStateOptions = (
                    pointMarkerOptions.states &&
                    (pointMarkerOptions.states as any)[state]
                ) || {};
                strokeWidth = pick(
                    pointStateOptions.lineWidth,
                    seriesStateOptions.lineWidth,
                    strokeWidth + pick(
                        pointStateOptions.lineWidthPlus,
                        seriesStateOptions.lineWidthPlus,
                        0
                    )
                );
                fill = (
                    pointStateOptions.fillColor ||
                    seriesStateOptions.fillColor ||
                    fill
                );
                stroke = (
                    pointStateOptions.lineColor ||
                    seriesStateOptions.lineColor ||
                    stroke
                );

                opacity = pick(
                    pointStateOptions.opacity,
                    seriesStateOptions.opacity,
                    opacity
                );
            }

            return {
                'stroke': stroke,
                'stroke-width': strokeWidth,
                'fill': fill,
                'opacity': opacity
            };
        },

        /**
         * Clear DOM objects and free up memory.
         *
         * @private
         * @function Highcharts.Series#destroy
         * @param {boolean} [keepEvents]
         * @return {void}
         * @fires Highcharts.Series#event:destroy
         */
        destroy: function (
            this: Highcharts.Series,
            keepEvents?: boolean
        ): void {
            var series = this,
                chart = series.chart,
                issue134 = /AppleWebKit\/533/.test(win.navigator.userAgent),
                destroy,
                i,
                data = series.data || [],
                point,
                axis;

            // add event hook
            fireEvent(series, 'destroy');

            // remove all events
            if (!keepEvents) {
                removeEvent(series);
            }

            // erase from axes
            (series.axisTypes || []).forEach(function (AXIS: string): void {
                axis = (series as any)[AXIS];
                if (axis && axis.series) {
                    erase(axis.series, series);
                    axis.isDirty = axis.forceRedraw = true;
                }
            });

            // remove legend items
            if (series.legendItem) {
                series.chart.legend.destroyItem(series);
            }

            // destroy all points with their elements
            i = data.length;
            while (i--) {
                point = data[i];
                if (point && point.destroy) {
                    point.destroy();
                }
            }
            series.points = null as any;

            // Clear the animation timeout if we are destroying the series
            // during initial animation
            H.clearTimeout(series.animationTimeout as any);

            // Destroy all SVGElements associated to the series
            objectEach(series, function (val: any, prop: string): void {
                // Survive provides a hook for not destroying
                if (val instanceof SVGElement && !val.survive) {

                    // issue 134 workaround
                    destroy = issue134 && prop === 'group' ?
                        'hide' :
                        'destroy';

                    val[destroy]();
                }
            });

            // remove from hoverSeries
            if (chart.hoverSeries === series) {
                chart.hoverSeries = null as any;
            }
            erase(chart.series, series);
            chart.orderSeries();

            // clear all members
            objectEach(series, function (val: any, prop: string): void {
                if (!keepEvents || prop !== 'hcEvents') {
                    delete (series as any)[prop];
                }
            });
        },

        /**
         * Get the graph path.
         *
         * @private
         * @function Highcharts.Series#getGraphPath
         * @param {Array<Highcharts.Point>} points
         * @param {boolean} [nullsAsZeroes]
         * @param {boolean} [connectCliffs]
         * @return {Highcharts.SVGPathArray}
         */
        getGraphPath: function (
            this: Highcharts.Series,
            points: Array<Highcharts.Point>,
            nullsAsZeroes?: boolean,
            connectCliffs?: boolean
        ): Highcharts.SVGPathArray {
            var series = this,
                options = series.options,
                step = options.step as any,
                reversed,
                graphPath = [] as Highcharts.SVGPathArray,
                xMap = [] as Array<(number|null)>,
                gap: boolean;

            points = points || series.points;

            // Bottom of a stack is reversed
            reversed = (points as any).reversed;
            if (reversed) {
                points.reverse();
            }
            // Reverse the steps (#5004)
            step = ({
                right: 1,
                center: 2
            } as Highcharts.Dictionary<number>)[step as any] || (step && 3);
            if (step && reversed) {
                step = 4 - step;
            }

            // Remove invalid points, especially in spline (#5015)
            points = this.getValidPoints(
                points,
                false,
                !(options.connectNulls && !nullsAsZeroes && !connectCliffs)
            );

            // Build the line
            points.forEach(function (point, i: number): void {

                var plotX = point.plotX,
                    plotY = point.plotY,
                    lastPoint = points[i - 1],
                    // the path to this point from the previous
                    pathToPoint: Highcharts.SVGPathArray;

                if (
                    (point.leftCliff || (lastPoint && lastPoint.rightCliff)) &&
                    !connectCliffs
                ) {
                    gap = true; // ... and continue
                }

                // Line series, nullsAsZeroes is not handled
                if (point.isNull && !defined(nullsAsZeroes) && i > 0) {
                    gap = !options.connectNulls;

                // Area series, nullsAsZeroes is set
                } else if (point.isNull && !nullsAsZeroes) {
                    gap = true;

                } else {

                    if (i === 0 || gap) {
                        pathToPoint = [
                            'M',
                            point.plotX as any,
                            point.plotY as any
                        ];

                    // Generate the spline as defined in the SplineSeries object
                    } else if (
                        (series as Highcharts.SplineSeries).getPointSpline
                    ) {

                        pathToPoint = (
                            series as Highcharts.SplineSeries
                        ).getPointSpline(
                            points as Array<Highcharts.SplinePoint>,
                            point as Highcharts.SplinePoint,
                            i
                        );

                    } else if (step) {

                        if (step === 1) { // right
                            pathToPoint = [
                                'L',
                                lastPoint.plotX as any,
                                plotY as any
                            ];

                        } else if (step === 2) { // center
                            pathToPoint = [
                                'L',
                                ((lastPoint.plotX as any) + plotX) / 2,
                                lastPoint.plotY as any,
                                'L',
                                ((lastPoint.plotX as any) + plotX) / 2,
                                plotY as any
                            ];

                        } else {
                            pathToPoint = [
                                'L',
                                plotX as any,
                                lastPoint.plotY as any
                            ];
                        }
                        pathToPoint.push(
                            'L',
                            plotX as any,
                            plotY as any
                        );

                    } else {
                        // normal line to next point
                        pathToPoint = [
                            'L',
                            plotX as any,
                            plotY as any
                        ];
                    }

                    // Prepare for animation. When step is enabled, there are
                    // two path nodes for each x value.
                    xMap.push(point.x);
                    if (step) {
                        xMap.push(point.x);
                        if (step === 2) { // step = center (#8073)
                            xMap.push(point.x);
                        }
                    }

                    graphPath.push.apply(graphPath, pathToPoint);
                    gap = false;
                }
            });

            (graphPath as any).xMap = xMap;
            series.graphPath = graphPath;

            return graphPath;

        },

        /**
         * Draw the graph. Called internally when rendering line-like series
         * types. The first time it generates the `series.graph` item and
         * optionally other series-wide items like `series.area` for area
         * charts. On subsequent calls these items are updated with new
         * positions and attributes.
         *
         * @function Highcharts.Series#drawGraph
         *
         * @return {void}
         */
        drawGraph: function (this: Highcharts.Series): void {
            var series = this,
                options = this.options,
                graphPath = (this.gappedPath || this.getGraphPath).call(this),
                styledMode = this.chart.styledMode,
                props = [[
                    'graph',
                    'highcharts-graph'
                ]];

            // Presentational properties
            if (!styledMode) {
                props[0].push(
                    (
                        options.lineColor ||
                        this.color ||
                        '${palette.neutralColor20}' // when colorByPoint = true
                    ) as any,
                    options.dashStyle as any
                );
            }

            props = series.getZonesGraphs(props);

            // Draw the graph
            props.forEach(function (prop: Array<string>, i: number): void {
                var graphKey = prop[0],
                    graph = (series as any)[graphKey],
                    verb = graph ? 'animate' : 'attr',
                    attribs: Highcharts.SVGAttributes;

                if (graph) {
                    graph.endX = series.preventGraphAnimation ?
                        null :
                        graphPath.xMap;
                    graph.animate({ d: graphPath });

                } else if (graphPath.length) { // #1487

                    /**
                     * SVG element of area-based charts. Can be used for styling
                     * purposes. If zones are configured, this element will be
                     * hidden and replaced by multiple zone areas, accessible
                     * via `series['zone-area-x']` (where x is a number,
                     * starting with 0).
                     *
                     * @name Highcharts.Series#area
                     * @type {Highcharts.SVGElement|undefined}
                     */
                    /**
                     * SVG element of line-based charts. Can be used for styling
                     * purposes. If zones are configured, this element will be
                     * hidden and replaced by multiple zone lines, accessible
                     * via `series['zone-graph-x']` (where x is a number,
                     * starting with 0).
                     *
                     * @name Highcharts.Series#graph
                     * @type {Highcharts.SVGElement|undefined}
                     */
                    (series as any)[graphKey] = graph = series.chart.renderer
                        .path(graphPath)
                        .addClass(prop[1])
                        .attr({ zIndex: 1 }) // #1069
                        .add(series.group);
                }

                if (graph && !styledMode) {

                    attribs = {
                        'stroke': prop[2],
                        'stroke-width': options.lineWidth,
                        // Polygon series use filled graph
                        'fill': (series.fillGraph && series.color) || 'none'
                    };

                    if (prop[3]) {
                        attribs.dashstyle = prop[3];
                    } else if (options.linecap !== 'square') {
                        attribs['stroke-linecap'] =
                            attribs['stroke-linejoin'] = 'round';
                    }
                    graph[verb](attribs)
                        // Add shadow to normal series (0) or to first
                        // zone (1) #3932
                        .shadow((i < 2) && options.shadow);
                }

                // Helpers for animation
                if (graph) {
                    graph.startX = graphPath.xMap;
                    graph.isArea = graphPath.isArea; // For arearange animation
                }
            });
        },

        /**
         * Get zones properties for building graphs. Extendable by series with
         * multiple lines within one series.
         *
         * @private
         * @function Highcharts.Series#getZonesGraphs
         *
         * @param {Array<Array<string>>} props
         *
         * @return {Array<Array<string>>}
         */
        getZonesGraphs: function (
            this: Highcharts.Series,
            props: Array<Array<string>>
        ): Array<Array<string>> {
            // Add the zone properties if any
            this.zones.forEach(function (
                zone: Highcharts.SeriesZonesOptions,
                i: number
            ): void {
                var propset = [
                    'zone-graph-' + i,
                    'highcharts-graph highcharts-zone-graph-' + i + ' ' +
                        (zone.className || '')
                ];

                if (!this.chart.styledMode) {
                    propset.push(
                        (zone.color || this.color) as any,
                        (zone.dashStyle || this.options.dashStyle) as any
                    );
                }
                props.push(propset);
            }, this);

            return props;
        },

        /**
         * Clip the graphs into zones for colors and styling.
         *
         * @private
         * @function Highcharts.Series#applyZones
         * @return {void}
         */
        applyZones: function (this: Highcharts.Series): void {
            var series = this,
                chart = this.chart,
                renderer = chart.renderer,
                zones = this.zones,
                translatedFrom,
                translatedTo: (number|undefined),
                clips = (this.clips || []) as Array<Highcharts.SVGElement>,
                clipAttr: Highcharts.Dictionary<number>,
                graph = this.graph,
                area = this.area,
                chartSizeMax = Math.max(chart.chartWidth, chart.chartHeight),
                axis = (this as any)[
                    (this.zoneAxis || 'y') + 'Axis'
                ] as Highcharts.Axis,
                extremes: Highcharts.RangeObject,
                reversed: (boolean|undefined),
                inverted = chart.inverted,
                horiz: (boolean|undefined),
                pxRange: number,
                pxPosMin: number,
                pxPosMax: number,
                ignoreZones = false;

            if (
                zones.length &&
                (graph || area) &&
                axis &&
                typeof axis.min !== 'undefined'
            ) {
                reversed = axis.reversed;
                horiz = axis.horiz;
                // The use of the Color Threshold assumes there are no gaps
                // so it is safe to hide the original graph and area
                // unless it is not waterfall series, then use showLine property
                // to set lines between columns to be visible (#7862)
                if (graph && !this.showLine) {
                    graph.hide();
                }
                if (area) {
                    area.hide();
                }

                // Create the clips
                extremes = axis.getExtremes();
                zones.forEach(function (
                    threshold: Highcharts.SeriesZonesOptions,
                    i: number
                ): void {

                    translatedFrom = reversed ?
                        (horiz ? chart.plotWidth : 0) :
                        (horiz ? 0 : (axis.toPixels(extremes.min) || 0));

                    translatedFrom = clamp(
                        pick(translatedTo, translatedFrom),
                        0,
                        chartSizeMax
                    );
                    translatedTo = clamp(
                        Math.round(
                            axis.toPixels(
                                pick(threshold.value, extremes.max),
                                true
                            ) || 0
                        ),
                        0,
                        chartSizeMax
                    );

                    if (ignoreZones) {
                        translatedFrom = translatedTo =
                            axis.toPixels(extremes.max);
                    }

                    pxRange = Math.abs(translatedFrom - translatedTo);
                    pxPosMin = Math.min(translatedFrom, translatedTo);
                    pxPosMax = Math.max(translatedFrom, translatedTo);
                    if (axis.isXAxis) {
                        clipAttr = {
                            x: inverted ? pxPosMax : pxPosMin,
                            y: 0,
                            width: pxRange,
                            height: chartSizeMax
                        };
                        if (!horiz) {
                            clipAttr.x = chart.plotHeight - clipAttr.x;
                        }
                    } else {
                        clipAttr = {
                            x: 0,
                            y: inverted ? pxPosMax : pxPosMin,
                            width: chartSizeMax,
                            height: pxRange
                        };
                        if (horiz) {
                            clipAttr.y = chart.plotWidth - clipAttr.y;
                        }
                    }

                    // VML SUPPPORT
                    if (inverted && renderer.isVML) {
                        if (axis.isXAxis) {
                            clipAttr = {
                                x: 0,
                                y: reversed ? pxPosMin : pxPosMax,
                                height: clipAttr.width,
                                width: chart.chartWidth
                            };
                        } else {
                            clipAttr = {
                                x: (
                                    clipAttr.y -
                                    chart.plotLeft -
                                    chart.spacingBox.x
                                ),
                                y: 0,
                                width: clipAttr.height,
                                height: chart.chartHeight
                            };
                        }
                    }
                    // END OF VML SUPPORT

                    if (clips[i]) {
                        clips[i].animate(clipAttr);
                    } else {
                        clips[i] = (renderer.clipRect as any)(clipAttr);
                    }

                    // when no data, graph zone is not applied and after setData
                    // clip was ignored. As a result, it should be applied each
                    // time.
                    if (graph) {
                        (series as any)['zone-graph-' + i].clip(clips[i]);
                    }

                    if (area) {
                        (series as any)['zone-area-' + i].clip(clips[i]);
                    }

                    // if this zone extends out of the axis, ignore the others
                    ignoreZones = (threshold.value as any) > extremes.max;

                    // Clear translatedTo for indicators
                    if (series.resetZones && translatedTo === 0) {
                        translatedTo = void 0;
                    }
                });
                this.clips = clips;
            } else if (series.visible) {
                // If zones were removed, restore graph and area
                if (graph) {
                    graph.show(true);
                }
                if (area) {
                    area.show(true);
                }
            }
        },

        /**
         * Initialize and perform group inversion on series.group and
         * series.markerGroup.
         *
         * @private
         * @function Highcharts.Series#invertGroups
         * @param {boolean} [inverted]
         * @return {void}
         */
        invertGroups: function (
            this: Highcharts.Series,
            inverted?: boolean
        ): void {
            var series = this,
                chart = series.chart,
                remover;

            /**
             * @private
             */
            function setInvert(): void {
                ['group', 'markerGroup'].forEach(function (
                    groupName: string
                ): void {
                    if ((series as any)[groupName]) {

                        // VML/HTML needs explicit attributes for flipping
                        if (chart.renderer.isVML) {
                            (series as any)[groupName].attr({
                                width: series.yAxis.len,
                                height: series.xAxis.len
                            });
                        }

                        (series as any)[groupName].width = series.yAxis.len;
                        (series as any)[groupName].height = series.xAxis.len;
                        (series as any)[groupName].invert(inverted);
                    }
                });
            }

            // Pie, go away (#1736)
            if (!series.xAxis) {
                return;
            }

            // A fixed size is needed for inversion to work
            remover = addEvent(chart, 'resize', setInvert);
            addEvent(series, 'destroy', remover);

            // Do it now
            (setInvert as any)(inverted); // do it now

            // On subsequent render and redraw, just do setInvert without
            // setting up events again
            series.invertGroups = setInvert;
        },

        /**
         * General abstraction for creating plot groups like series.group,
         * series.dataLabelsGroup and series.markerGroup. On subsequent calls,
         * the group will only be adjusted to the updated plot size.
         *
         * @private
         * @function Highcharts.Series#plotGroup
         * @param {string} prop
         * @param {string} name
         * @param {string} visibility
         * @param {number} [zIndex]
         * @param {Highcharts.SVGElement} [parent]
         * @return {Highcharts.SVGElement}
         */
        plotGroup: function (
            this: Highcharts.Series,
            prop: string,
            name: string,
            visibility: string,
            zIndex?: number,
            parent?: Highcharts.SVGElement
        ): Highcharts.SVGElement {
            var group = (this as any)[prop],
                isNew = !group;

            // Generate it on first call
            if (isNew) {
                (this as any)[prop] = group = this.chart.renderer
                    .g()
                    .attr({
                        zIndex: zIndex || 0.1 // IE8 and pointer logic use this
                    })
                    .add(parent);

            }

            // Add the class names, and replace existing ones as response to
            // Series.update (#6660)
            group.addClass(
                (
                    'highcharts-' + name +
                    ' highcharts-series-' + this.index +
                    ' highcharts-' + this.type + '-series ' +
                    (
                        defined(this.colorIndex) ?
                            'highcharts-color-' + this.colorIndex + ' ' :
                            ''
                    ) +
                    (this.options.className || '') +
                    (
                        group.hasClass('highcharts-tracker') ?
                            ' highcharts-tracker' :
                            ''
                    )
                ),
                true
            );

            // Place it on first and subsequent (redraw) calls
            group.attr({ visibility: visibility })[isNew ? 'attr' : 'animate'](
                this.getPlotBox()
            );
            return group;
        },


        /**
         * Get the translation and scale for the plot area of this series.
         *
         * @function Highcharts.Series#getPlotBox
         *
         * @return {Highcharts.SeriesPlotBoxObject}
         */
        getPlotBox: function (
            this: Highcharts.Series
        ): Highcharts.SeriesPlotBoxObject {
            var chart = this.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis;

            // Swap axes for inverted (#2339)
            if (chart.inverted) {
                xAxis = yAxis;
                yAxis = this.xAxis;
            }
            return {
                translateX: xAxis ? xAxis.left : chart.plotLeft,
                translateY: yAxis ? yAxis.top : chart.plotTop,
                scaleX: 1, // #1623
                scaleY: 1
            };
        },

        /**
         * Render the graph and markers. Called internally when first rendering
         * and later when redrawing the chart. This function can be extended in
         * plugins, but normally shouldn't be called directly.
         *
         * @function Highcharts.Series#render
         *
         * @return {void}
         *
         * @fires Highcharts.Series#event:afterRender
         */
        render: function (this: Highcharts.Series): void {
            var series = this,
                chart = series.chart,
                group,
                options = series.options,
                // Animation doesn't work in IE8 quirks when the group div is
                // hidden, and looks bad in other oldIE
                animDuration = (
                    !!series.animate &&
                    chart.renderer.isSVG &&
                    animObject(options.animation).duration
                ),
                visibility = series.visible ? 'inherit' : 'hidden', // #2597
                zIndex = options.zIndex,
                hasRendered = series.hasRendered,
                chartSeriesGroup = chart.seriesGroup,
                inverted = chart.inverted;

            fireEvent(this, 'render');

            // the group
            group = series.plotGroup(
                'group',
                'series',
                visibility,
                zIndex as any,
                chartSeriesGroup as any
            );

            series.markerGroup = series.plotGroup(
                'markerGroup',
                'markers',
                visibility,
                zIndex as any,
                chartSeriesGroup as any
            );

            // initiate the animation
            if (animDuration) {
                (series.animate as any)(true);
            }

            // SVGRenderer needs to know this before drawing elements (#1089,
            // #1795)
            group.inverted = series.isCartesian || series.invertable ?
                inverted : false;

            // Draw the graph if any
            if (series.drawGraph) {
                series.drawGraph();
                series.applyZones();
            }

            // Draw the points
            if (series.visible) {
                series.drawPoints();
            }

            /* series.points.forEach(function (point) {
                if (point.redraw) {
                    point.redraw();
                }
            }); */

            // Draw the data labels
            if (series.drawDataLabels) {
                series.drawDataLabels();
            }

            // In pie charts, slices are added to the DOM, but actual rendering
            // is postponed until labels reserved their space
            if (series.redrawPoints) {
                series.redrawPoints();
            }

            // draw the mouse tracking area
            if (
                series.drawTracker &&
                series.options.enableMouseTracking !== false
            ) {
                series.drawTracker();
            }

            // Handle inverted series and tracker groups
            series.invertGroups(inverted);

            // Initial clipping, must be defined after inverting groups for VML.
            // Applies to columns etc. (#3839).
            if (
                options.clip !== false &&
                !series.sharedClipKey &&
                !hasRendered
            ) {
                group.clip(chart.clipRect);
            }

            // Run the animation
            if (animDuration) {
                series.animate();
            }

            // Call the afterAnimate function on animation complete (but don't
            // overwrite the animation.complete option which should be available
            // to the user).
            if (!hasRendered) {
                series.animationTimeout = syncTimeout(function (): void {
                    series.afterAnimate();
                }, animDuration || 0);
            }

            // Means data is in accordance with what you see
            series.isDirty = false;

            // (See #322) series.isDirty = series.isDirtyData = false; // means
            // data is in accordance with what you see
            series.hasRendered = true;

            fireEvent(series, 'afterRender');
        },

        /**
         * Redraw the series. This function is called internally from
         * `chart.redraw` and normally shouldn't be called directly.
         *
         * @private
         * @function Highcharts.Series#redraw
         * @return {void}
         */
        redraw: function (this: Highcharts.Series): void {
            var series = this,
                chart = series.chart,
                // cache it here as it is set to false in render, but used after
                wasDirty = series.isDirty || series.isDirtyData,
                group = series.group,
                xAxis = series.xAxis,
                yAxis = series.yAxis;

            // reposition on resize
            if (group) {
                if (chart.inverted) {
                    group.attr({
                        width: chart.plotWidth,
                        height: chart.plotHeight
                    });
                }

                group.animate({
                    translateX: pick(xAxis && xAxis.left, chart.plotLeft),
                    translateY: pick(yAxis && yAxis.top, chart.plotTop)
                });
            }

            series.translate();
            series.render();
            if (wasDirty) { // #3868, #3945
                delete this.kdTree;
            }
        },

        kdAxisArray: ['clientX', 'plotY'],

        /**
         * @private
         * @function Highcharts.Series#searchPoint
         * @param {Highcharts.PointerEventObject} e
         * @param {boolean} [compareX]
         * @return {Highcharts.Point}
         */
        searchPoint: function (
            this: Highcharts.Series,
            e: Highcharts.PointerEventObject,
            compareX?: boolean
        ): (Highcharts.Point|undefined) {
            var series = this,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                inverted = series.chart.inverted;

            return this.searchKDTree({
                clientX: inverted ?
                    xAxis.len - e.chartY + (xAxis.pos as any) :
                    e.chartX - (xAxis.pos as any),
                plotY: inverted ?
                    yAxis.len - e.chartX + (yAxis.pos as any) :
                    e.chartY - (yAxis.pos as any)
            }, compareX, e);
        },

        /**
         * Build the k-d-tree that is used by mouse and touch interaction to get
         * the closest point. Line-like series typically have a one-dimensional
         * tree where points are searched along the X axis, while scatter-like
         * series typically search in two dimensions, X and Y.
         *
         * @private
         * @function Highcharts.Series#buildKDTree
         * @param {Highcharts.PointerEventObject} [e]
         * @return {void}
         */
        buildKDTree: function (
            this: Highcharts.Series,
            e?: Highcharts.PointerEventObject
        ): void {

            // Prevent multiple k-d-trees from being built simultaneously
            // (#6235)
            this.buildingKdTree = true;

            var series = this,
                dimensions = (series.options.findNearestPointBy as any)
                    .indexOf('y') > -1 ? 2 : 1;

            /**
             * Internal function
             * @private
             */
            function _kdtree(
                points: Array<Highcharts.Point>,
                depth: number,
                dimensions: number
            ): (Highcharts.KDNode|undefined) {
                var axis: string,
                    median,
                    length = points && points.length;

                if (length) {

                    // alternate between the axis
                    axis = series.kdAxisArray[depth % dimensions];

                    // sort point array
                    points.sort(function (
                        a: Highcharts.Point,
                        b: Highcharts.Point
                    ): number {
                        return (a as any)[axis] - (b as any)[axis];
                    });

                    median = Math.floor(length / 2);

                    // build and return nod
                    return {
                        point: points[median],
                        left: _kdtree(
                            points.slice(0, median), depth + 1, dimensions
                        ),
                        right: _kdtree(
                            points.slice(median + 1), depth + 1, dimensions
                        )
                    };

                }
            }

            /**
             * Start the recursive build process with a clone of the points
             * array and null points filtered out. (#3873)
             * @private
             */
            function startRecursive(): void {
                series.kdTree = _kdtree(
                    series.getValidPoints(
                        null as any,
                        // For line-type series restrict to plot area, but
                        // column-type series not (#3916, #4511)
                        !series.directTouch
                    ),
                    dimensions,
                    dimensions
                );
                series.buildingKdTree = false;
            }
            delete series.kdTree;

            // For testing tooltips, don't build async. Also if touchstart, we
            // may be dealing with click events on mobile, so don't delay
            // (#6817).
            syncTimeout(
                startRecursive,
                series.options.kdNow || (e && e.type === 'touchstart') ? 0 : 1
            );
        },

        /**
         * @private
         * @function Highcharts.Series#searchKDTree
         * @param {Highcharts.KDPointSearchObject} point
         * @param {boolean} [compareX]
         * @param {Highcharts.PointerEventObject} [e]
         * @return {Highcharts.Point|undefined}
         */
        searchKDTree: function (
            this: Highcharts.Series,
            point: Highcharts.KDPointSearchObject,
            compareX?: boolean,
            e?: Highcharts.PointerEventObject
        ): (Highcharts.Point|undefined) {
            var series = this,
                kdX = this.kdAxisArray[0],
                kdY = this.kdAxisArray[1],
                kdComparer = compareX ? 'distX' : 'dist',
                kdDimensions = (series.options.findNearestPointBy as any)
                    .indexOf('y') > -1 ? 2 : 1;

            /**
             * Set the one and two dimensional distance on the point object.
             * @private
             */
            function setDistance(
                p1: Highcharts.KDPointSearchObject,
                p2: Highcharts.Point
            ): void {
                var x = (defined((p1 as any)[kdX]) &&
                        defined((p2 as any)[kdX])) ?
                        Math.pow((p1 as any)[kdX] - (p2 as any)[kdX], 2) :
                        null,
                    y = (defined((p1 as any)[kdY]) &&
                        defined((p2 as any)[kdY])) ?
                        Math.pow((p1 as any)[kdY] - (p2 as any)[kdY], 2) :
                        null,
                    r = (x || 0) + (y || 0);

                p2.dist = defined(r) ? Math.sqrt(r) : Number.MAX_VALUE;
                p2.distX = defined(x) ? Math.sqrt(x as any) : Number.MAX_VALUE;
            }

            /**
             * @private
             */
            function _search(
                search: Highcharts.KDPointSearchObject,
                tree: Highcharts.KDNode,
                depth: number,
                dimensions: number
            ): Highcharts.Point {
                var point = tree.point,
                    axis = series.kdAxisArray[depth % dimensions],
                    tdist,
                    sideA,
                    sideB,
                    ret = point,
                    nPoint1,
                    nPoint2;

                setDistance(search, point);

                // Pick side based on distance to splitting point
                tdist = (search as any)[axis] - (point as any)[axis];
                sideA = tdist < 0 ? 'left' : 'right';
                sideB = tdist < 0 ? 'right' : 'left';

                // End of tree
                if (tree[sideA]) {
                    nPoint1 = _search(
                        search, tree[sideA] as any, depth + 1, dimensions
                    );

                    ret = (
                        (nPoint1 as any)[kdComparer] <
                        (ret as any)[kdComparer] ?
                            nPoint1 :
                            point
                    );
                }
                if (tree[sideB]) {
                    // compare distance to current best to splitting point to
                    // decide wether to check side B or not
                    if (Math.sqrt(tdist * tdist) < (ret as any)[kdComparer]) {
                        nPoint2 = _search(
                            search,
                            tree[sideB] as any,
                            depth + 1,
                            dimensions
                        );
                        ret = (
                            (nPoint2 as any)[kdComparer] <
                            (ret as any)[kdComparer] ?
                                nPoint2 :
                                ret
                        );
                    }
                }

                return ret;
            }

            if (!this.kdTree && !this.buildingKdTree) {
                this.buildKDTree(e);
            }

            if (this.kdTree) {
                return _search(point, this.kdTree, kdDimensions, kdDimensions);
            }
        },

        /**
         * @private
         * @function Highcharts.Series#pointPlacementToXValue
         * @return {number}
         */
        pointPlacementToXValue: function (this: Highcharts.Series): number {

            var series = this,
                axis = series.xAxis,
                pointPlacement = series.options.pointPlacement;

            // Point placement is relative to each series pointRange (#5889)
            if (pointPlacement === 'between') {
                pointPlacement = axis.reversed ? -0.5 : 0.5; // #11955
            }
            if (isNumber(pointPlacement)) {
                (pointPlacement as any) *=
                    pick(series.options.pointRange || axis.pointRange);
            }

            return pointPlacement as any;
        }
    }
) as any; // end Series prototype

/**
 * A line series displays information as a series of data points connected by
 * straight line segments.
 *
 * @sample {highcharts} highcharts/demo/line-basic/
 *         Line chart
 * @sample {highstock} stock/demo/basic-line/
 *         Line chart
 *
 * @extends   plotOptions.series
 * @product   highcharts highstock
 * @apioption plotOptions.line
 */

/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
 * of a line graph. Round means that lines are rounded in the ends and
 * bends.
 *
 * @type       {Highcharts.SeriesLinecapValue}
 * @default    round
 * @since      3.0.7
 * @apioption  plotOptions.line.linecap
 */

/**
 * A `line` series. If the [type](#series.line.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.line
 * @excluding dataParser,dataURL
 * @product   highcharts highstock
 * @apioption series.line
 */

/**
 * An array of data points for the series. For the `line` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 1],
 *        [1, 2],
 *        [2, 8]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.line.turboThreshold),
 *    this option is not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * **Note:** In TypeScript you have to extend `PointOptionsObject` with an
 * additional declaration to allow custom data options:
 * ```ts
 * declare module `highcharts` {
 *   interface PointOptionsObject {
 *     customProperty: string;
 *   }
 * }
 * ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @declare   Highcharts.PointOptionsObject
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @apioption series.line.data
 */

/**
 * An additional, individual class name for the data point's graphic
 * representation.
 *
 * @type      {string}
 * @since     5.0.0
 * @product   highcharts gantt
 * @apioption series.line.data.className
 */

/**
 * Individual color for the point. By default the color is pulled from
 * the global `colors` array.
 *
 * In styled mode, the `color` option doesn't take effect. Instead, use
 * `colorIndex`.
 *
 * @sample {highcharts} highcharts/point/color/
 *         Mark the highest point
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highstock gantt
 * @apioption series.line.data.color
 */

/**
 * A specific color index to use for the point, so its graphic representations
 * are given the class name `highcharts-color-{n}`. In styled mode this will
 * change the color of the graphic. In non-styled mode, the color by is set by
 * the `fill` attribute, so the change in class name won't have a visual effect
 * by default.
 *
 * @type      {number}
 * @since     5.0.0
 * @product   highcharts gantt
 * @apioption series.line.data.colorIndex
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @sample highcharts/point/datalabels/
 *         Show a label for the last value
 *
 * @declare   Highcharts.DataLabelsOptionsObject
 * @extends   plotOptions.line.dataLabels
 * @product   highcharts highstock gantt
 * @apioption series.line.data.dataLabels
 */

/**
 * A description of the point to add to the screen reader information
 * about the point.
 *
 * @type      {string}
 * @since     5.0.0
 * @requires  modules/accessibility
 * @apioption series.line.data.description
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @sample {highcharts} highcharts/point/id/
 *         Remove an id'd point
 *
 * @type      {string}
 * @since     1.2.0
 * @product   highcharts highstock gantt
 * @apioption series.line.data.id
 */

/**
 * The rank for this point's data label in case of collision. If two
 * data labels are about to overlap, only the one with the highest `labelrank`
 * will be drawn.
 *
 * @type      {number}
 * @apioption series.line.data.labelrank
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabels, etc.
 *
 * @see [xAxis.uniqueNames](#xAxis.uniqueNames)
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Point names
 *
 * @type      {string}
 * @apioption series.line.data.name
 */

/**
 * Whether the data point is selected initially.
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts highstock gantt
 * @apioption series.line.data.selected
 */

/**
 * The x value of the point. For datetime axes, the X value is the timestamp
 * in milliseconds since 1970.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.line.data.x
 */

/**
 * The y value of the point.
 *
 * @type      {number|null}
 * @product   highcharts highstock
 * @apioption series.line.data.y
 */

/**
 * The individual point events.
 *
 * @extends   plotOptions.series.point.events
 * @product   highcharts highstock gantt
 * @apioption series.line.data.events
 */

/**
 * Options for the point markers of line-like series.
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker
 * @product   highcharts highstock
 * @apioption series.line.data.marker
 */

''; // include precedent doclets in transpilat
