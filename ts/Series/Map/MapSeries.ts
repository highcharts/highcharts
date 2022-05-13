/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    AnimationStepCallbackFunction
} from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type { GeoJSON, Polygon, TopoJSON } from '../../Maps/GeoJSON';
import type { LonLatArray, MapBounds } from '../../Maps/MapViewOptions';
import type MapPointOptions from './MapPointOptions';
import type MapSeriesOptions from './MapSeriesOptions';
import type PointerEvent from '../../Core/PointerEvent';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type ScatterPoint from '../Scatter/ScatterPoint';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import ColorMapMixin from '../ColorMapMixin.js';
import CU from '../CenteredUtilities.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import MapChart from '../../Core/Chart/MapChart.js';
const {
    splitPath
} = MapChart;
import MapPoint from './MapPoint.js';
import MapView from '../../Maps/MapView.js';
import { Palette } from '../../Core/Color/Palettes.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    // indirect dependency to keep product size low
    seriesTypes: {
        column: ColumnSeries,
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    find,
    fireEvent,
    getNestedProperty,
    isArray,
    isNumber,
    isObject,
    merge,
    objectEach,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */
type SVGTransformType = {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
};

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        clearBounds?(): void;
        getProjectedBounds?(): MapBounds|undefined;
        mapTitle?: string;
        transformGroups?: Array<SVGElement>|undefined;
        useMapGeometry?: boolean;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        /** @requires modules/map */
        mapData?: (Array<MapPointOptions>|GeoJSON|TopoJSON);
    }
    interface SeriesStateHoverOptions
    {
        brightness?: number;
        color?: ColorType;
    }
}

declare global {
    namespace Highcharts {
        class MapPoint extends ScatterPoint {
            public colorInterval?: unknown;
            public dataLabelOnNull: ColorMapMixin.ColorMapPoint[
                'dataLabelOnNull'
            ];
            public isValid: ColorMapMixin.ColorMapPoint['isValid'];
            public middleX: number;
            public middleY: number;
            public options: MapPointOptions;
            public path: SVGPath;
            public properties?: object;
            public series: MapSeries;
            public value: ColorMapMixin.ColorMapPoint['value'];
            public applyOptions(
                options: (MapPointOptions|PointShortOptions),
                x?: number
            ): MapPoint;
            public onMouseOver(e?: PointerEvent): void;
            public zoomTo(): void;
        }
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.map
 *
 * @augments Highcharts.Series
 */
class MapSeries extends ScatterSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The map series is used for basic choropleth maps, where each map area has
     * a color based on its value.
     *
     * @sample maps/demo/all-maps/
     *         Choropleth map
     *
     * @extends      plotOptions.scatter
     * @excluding    marker, cluster
     * @product      highmaps
     * @optionparent plotOptions.map
     */
    public static defaultOptions: MapSeriesOptions = merge(ScatterSeries.defaultOptions, {

        /**
         * Whether the MapView takes this series into account when computing the
         * default zoom and center of the map.
         *
         * @sample maps/series/affectsmapview/
         *         US map with world map backdrop
         *
         * @since 10.0.0
         */
        affectsMapView: true,

        animation: false, // makes the complex shapes slow

        dataLabels: {
            crop: false,
            formatter: function (): string { // #2945
                const { numberFormatter } = this.series.chart;
                const { value } = this.point as MapPoint;

                return isNumber(value) ? numberFormatter(value, -1) : '';
            },
            inside: true, // for the color
            overflow: false as any,
            padding: 0,
            verticalAlign: 'middle'
        },

        /**
         * @ignore-option
         *
         * @private
         */
        marker: null as any,

        /**
         * The color to apply to null points.
         *
         * In styled mode, the null point fill is set in the
         * `.highcharts-null-point` class.
         *
         * @sample maps/demo/all-areas-as-null/
         *         Null color
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         *
         * @private
         */
        nullColor: Palette.neutralColor3,

        /**
         * Whether to allow pointer interaction like tooltips and mouse events
         * on null points.
         *
         * @type      {boolean}
         * @since     4.2.7
         * @apioption plotOptions.map.nullInteraction
         *
         * @private
         */

        stickyTracking: false,

        tooltip: {
            followPointer: true,
            pointFormat: '{point.name}: {point.value}<br/>'
        },

        /**
         * @ignore-option
         *
         * @private
         */
        turboThreshold: 0,

        /**
         * Whether all areas of the map defined in `mapData` should be rendered.
         * If `true`, areas which don't correspond to a data point, are rendered
         * as `null` points. If `false`, those areas are skipped.
         *
         * @sample maps/plotoptions/series-allareas-false/
         *         All areas set to false
         *
         * @type      {boolean}
         * @default   true
         * @product   highmaps
         * @apioption plotOptions.series.allAreas
         *
         * @private
         */
        allAreas: true,

        /**
         * The border color of the map areas.
         *
         * In styled mode, the border stroke is given in the `.highcharts-point`
         * class.
         *
         * @sample {highmaps} maps/plotoptions/series-border/
         *         Borders demo
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   #cccccc
         * @product   highmaps
         * @apioption plotOptions.series.borderColor
         *
         * @private
         */
        borderColor: Palette.neutralColor20,

        /**
         * The border width of each map area.
         *
         * In styled mode, the border stroke width is given in the
         * `.highcharts-point` class.
         *
         * @sample maps/plotoptions/series-border/
         *         Borders demo
         *
         * @type      {number}
         * @default   1
         * @product   highmaps
         * @apioption plotOptions.series.borderWidth
         *
         * @private
         */
        borderWidth: 1,

        /**
         * @type      {string}
         * @default   value
         * @apioption plotOptions.map.colorKey
         */

        /**
         * What property to join the `mapData` to the value data. For example,
         * if joinBy is "code", the mapData items with a specific code is merged
         * into the data with the same code. For maps loaded from GeoJSON, the
         * keys may be held in each point's `properties` object.
         *
         * The joinBy option can also be an array of two values, where the first
         * points to a key in the `mapData`, and the second points to another
         * key in the `data`.
         *
         * When joinBy is `null`, the map items are joined by their position in
         * the array, which performs much better in maps with many data points.
         * This is the recommended option if you are printing more than a
         * thousand data points and have a backend that can preprocess the data
         * into a parallel array of the mapData.
         *
         * @sample maps/plotoptions/series-border/
         *         Joined by "code"
         * @sample maps/demo/geojson/
         *         GeoJSON joined by an array
         * @sample maps/series/joinby-null/
         *         Simple data joined by null
         *
         * @type      {string|Array<string>}
         * @default   hc-key
         * @product   highmaps
         * @apioption plotOptions.series.joinBy
         *
         * @private
         */
        joinBy: 'hc-key',

        /**
         * Define the z index of the series.
         *
         * @type      {number}
         * @product   highmaps
         * @apioption plotOptions.series.zIndex
         */

        /**
         * @apioption plotOptions.series.states
         *
         * @private
         */
        states: {

            /**
             * @apioption plotOptions.series.states.hover
             */
            hover: {

                /** @ignore-option */
                halo: null as any,

                /**
                 * The color of the shape in this state.
                 *
                 * @sample maps/plotoptions/series-states-hover/
                 *         Hover options
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.color
                 */

                /**
                 * The border color of the point in this state.
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.borderColor
                 */

                /**
                 * The border width of the point in this state
                 *
                 * @type      {number}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.borderWidth
                 */

                /**
                 * The relative brightness of the point when hovered, relative
                 * to the normal point color.
                 *
                 * @type      {number}
                 * @product   highmaps
                 * @default   0.2
                 * @apioption plotOptions.series.states.hover.brightness
                 */
                brightness: 0.2
            },

            /**
             * @apioption plotOptions.series.states.normal
             */
            normal: {

                /**
                 * @productdesc {highmaps}
                 * The animation adds some latency in order to reduce the effect
                 * of flickering when hovering in and out of for example an
                 * uneven coastline.
                 *
                 * @sample {highmaps} maps/plotoptions/series-states-animation-false/
                 *         No animation of fill color
                 *
                 * @apioption plotOptions.series.states.normal.animation
                 */
                animation: true
            },

            /**
             * @apioption plotOptions.series.states.select
             */
            select: {

                /**
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @default   ${palette.neutralColor20}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.select.color
                 */
                color: Palette.neutralColor20
            },

            inactive: {
                opacity: 1
            }
        }
    } as MapSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    // public baseView?: { center: Highcharts.LonLatArray; zoom: number };

    public bounds?: MapBounds;

    public chart: MapChart = void 0 as any;

    public data: Array<MapPoint> = void 0 as any;

    public group: SVGElement = void 0 as any;

    public joinBy: Array<string> = void 0 as any;

    public mapData?: unknown;

    public mapMap?: AnyRecord;

    public mapTitle?: string;

    public options: MapSeriesOptions = void 0 as any;

    public pointAttrToOptions: unknown;

    public points: Array<MapPoint> = void 0 as any;

    public processedData: Array<(
        MapPointOptions|PointOptions|PointShortOptions
    )> = [];

    public transformGroups: Array<SVGElement>|undefined;

    public valueData?: Array<number>;

    public valueMax?: number;

    public valueMin?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * The initial animation for the map series. By default, animation is
     * disabled. Animation of map shapes is not at all supported in VML
     * browsers.
     * @private
     */
    public animate(init?: boolean): void {
        const { chart, group } = this,
            animation = animObject(this.options.animation);

        if (chart.renderer.isSVG) {

            // Initialize the animation
            if (init) {

                // Scale down the group and place it in the center
                group.attr({
                    translateX: chart.plotLeft + chart.plotWidth / 2,
                    translateY: chart.plotTop + chart.plotHeight / 2,
                    scaleX: 0.001, // #1499
                    scaleY: 0.001
                });

            // Run the animation
            } else {
                group.animate({
                    translateX: chart.plotLeft,
                    translateY: chart.plotTop,
                    scaleX: 1,
                    scaleY: 1
                }, animation);
            }
        }
    }

    /**
     * Animate in the new series. Depends on the drilldown.js module.
     * @private
     */
    public animateDrilldown(init?: boolean): void {
        const chart = this.chart,
            group = this.group;

        if (chart.renderer.isSVG) {

            // Initialize the animation
            if (init) {
                // Scale down the group and place it in the center. This is a
                // regression from <= v9.2, when it animated from the old point.
                group.attr({
                    translateX: chart.plotLeft + chart.plotWidth / 2,
                    translateY: chart.plotTop + chart.plotHeight / 2,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    opacity: 0.01
                });

            // Run the animation
            } else {
                group.animate({
                    translateX: chart.plotLeft,
                    translateY: chart.plotTop,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1
                }, (this.chart.options.drilldown as any).animation);

                if (chart.drilldown) {
                    chart.drilldown.fadeInGroup(this.dataLabelsGroup);
                }
            }
        }

    }

    /**
     * When drilling up, pull out the individual point graphics from the lower
     * series and animate them into the origin point in the upper series.
     * @private
     */
    public animateDrillupFrom(): void {
        const chart = this.chart;

        if (chart.renderer.isSVG) {
            this.group.animate({
                translateX: chart.plotLeft + chart.plotWidth / 2,
                translateY: chart.plotTop + chart.plotHeight / 2,
                scaleX: 0.1,
                scaleY: 0.1,
                opacity: 0.01
            });
        }
    }

    /**
     * When drilling up, keep the upper series invisible until the lower series
     * has moved into place.
     * @private
     */
    public animateDrillupTo(init?: boolean): void {
        ColumnSeries.prototype.animateDrillupTo.call(this, init);
    }

    public clearBounds(): void {
        this.points.forEach((point): void => {
            delete point.bounds;
            delete point.insetIndex;
            delete point.projectedPath;
        });
        delete this.bounds;
    }

    /**
     * Allow a quick redraw by just translating the area group. Used for zooming
     * and panning in capable browsers.
     * @private
     */
    public doFullTranslate(): boolean {
        return Boolean(
            this.isDirtyData ||
            this.chart.isResizing ||
            this.chart.renderer.isVML ||
            !this.hasRendered
        );
    }

    /**
     * Draw the data labels. Special for maps is the time that the data labels
     * are drawn (after points), and the clipping of the dataLabelsGroup.
     * @private
     */
    public drawMapDataLabels(): void {

        Series.prototype.drawDataLabels.call(this);
        if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
        }
    }

    /**
     * Use the drawPoints method of column, that is able to handle simple
     * shapeArgs. Extend it by assigning the tooltip position.
     * @private
     */
    public drawPoints(): void {
        const { chart, group, transformGroups = [] } = this;
        const { mapView, renderer } = chart;

        if (!mapView) {
            return;
        }

        // Set groups that handle transform during zooming and panning in order
        // to preserve clipping on series.group
        this.transformGroups = transformGroups;
        if (!transformGroups[0]) {
            transformGroups[0] = renderer.g().add(group);
        }
        mapView.insets.forEach((inset, i): void => {
            if (!transformGroups[i + 1]) {
                transformGroups.push(renderer.g().add(group));
            }
        });

        // Draw the shapes again
        if (this.doFullTranslate()) {

            // Individual point actions.
            this.points.forEach((point): void => {

                const { graphic, shapeArgs } = point;

                // Points should be added in the corresponding transform group
                point.group = transformGroups[
                    typeof point.insetIndex === 'number' ?
                        point.insetIndex + 1 :
                        0
                ];

                // When the point has been moved between insets after
                // MapView.update
                if (graphic && graphic.parentGroup !== point.group) {
                    graphic.add(point.group);
                }

                // Restore state color on update/redraw (#3529)
                if (shapeArgs && chart.hasRendered && !chart.styledMode) {
                    shapeArgs.fill = this.pointAttribs(
                        point,
                        point.state
                    ).fill;
                }
            });

            // Draw the points
            ColumnSeries.prototype.drawPoints.apply(this);

            // Add class names
            this.points.forEach((point): void => {
                if (point.graphic) {
                    let className = '';
                    if (point.name) {
                        className +=
                            'highcharts-name-' +
                            point.name.replace(/ /g, '-').toLowerCase();
                    }
                    if (point.properties && point.properties['hc-key']) {
                        className +=
                            ' highcharts-key-' +
                            point.properties['hc-key'].toString().toLowerCase();
                    }
                    if (className) {
                        point.graphic.addClass(className);
                    }

                    // In styled mode, apply point colors by CSS
                    if (chart.styledMode) {
                        point.graphic.css(
                            this.pointAttribs(
                                point,
                                point.selected && 'select' || void 0
                            ) as any
                        );
                    }
                }
            });
        }


        // Apply the SVG transform
        transformGroups.forEach((transformGroup, i): void => {
            const view = i === 0 ? mapView : mapView.insets[i - 1],
                svgTransform = view.getSVGTransform(),
                strokeWidth = pick(
                    (this.options as any)[(
                        this.pointAttrToOptions &&
                        (this.pointAttrToOptions as any)['stroke-width']
                    ) || 'borderWidth'],
                    1 // Styled mode
                );

            /*
            Animate or move to the new zoom level. In order to prevent
            flickering as the different transform components are set out of sync
            (#5991), we run a fake animator attribute and set scale and
            translation synchronously in the same step.

            A possible improvement to the API would be to handle this in the
            renderer or animation engine itself, to ensure that when we are
            animating multiple properties, we make sure that each step for each
            property is performed in the same step. Also, for symbols and for
            transform properties, it should induce a single updateTransform and
            symbolAttr call.
            */
            const scale = svgTransform.scaleX;
            const flipFactor = svgTransform.scaleY > 0 ? 1 : -1;
            if (renderer.globalAnimation && chart.hasRendered) {
                const startTranslateX = Number(
                    transformGroup.attr('translateX')
                );
                const startTranslateY = Number(
                    transformGroup.attr('translateY')
                );
                const startScale = Number(transformGroup.attr('scaleX'));

                const step: AnimationStepCallbackFunction = (
                    now,
                    fx
                ): void => {
                    const scaleStep = startScale +
                        (scale - startScale) * fx.pos;
                    transformGroup.attr({
                        translateX: (
                            startTranslateX + (
                                svgTransform.translateX - startTranslateX
                            ) * fx.pos
                        ),
                        translateY: (
                            startTranslateY + (
                                svgTransform.translateY - startTranslateY
                            ) * fx.pos
                        ),
                        scaleX: scaleStep,
                        scaleY: scaleStep * flipFactor
                    });

                    transformGroup.element.setAttribute(
                        'stroke-width',
                        strokeWidth / scaleStep
                    );
                };

                transformGroup
                    .attr({ animator: 0 })
                    .animate({ animator: 1 }, { step });

            // When dragging or first rendering, animation is off
            } else {
                transformGroup.attr(svgTransform);

                // Set the stroke-width directly on the group element so the
                // children inherit it. We need to use setAttribute directly,
                // because the stroke-widthSetter method expects a stroke color
                // also to be set.
                transformGroup.element.setAttribute(
                    'stroke-width',
                    strokeWidth / scale
                );
            }
        });

        this.drawMapDataLabels();

    }

    /**
     * Get the bounding box of all paths in the map combined.
     *
     */
    public getProjectedBounds(): MapBounds|undefined {
        if (!this.bounds && this.chart.mapView) {

            const { insets, projection } = this.chart.mapView,
                allBounds: MapBounds[] = [];

            // Find the bounding box of each point
            (this.points || []).forEach(function (point): void {

                if (point.path || point.geometry) {

                    // @todo Try to puth these two conversions in
                    // MapPoint.applyOptions
                    if (typeof point.path === 'string') {
                        point.path = splitPath(point.path);

                    // Legacy one-dimensional array
                    } else if (
                        isArray(point.path) &&
                        point.path[0] as any === 'M'
                    ) {
                        point.path = SVGRenderer.prototype.pathToSegments(
                            point.path as any
                        );
                    }

                    // The first time a map point is used, analyze its box
                    if (!point.bounds) {
                        let bounds = point.getProjectedBounds(projection);
                        if (bounds) {
                            point.labelrank = pick(
                                point.labelrank,
                                // Bigger shape, higher rank
                                (
                                    (bounds.x2 - bounds.x1) *
                                    (bounds.y2 - bounds.y1)
                                )
                            );

                            const { midX, midY } = bounds;
                            if (insets && isNumber(midX) && isNumber(midY)) {
                                const inset = find(insets, (
                                    inset
                                ): boolean|undefined => inset.isInside({
                                    x: midX, y: midY
                                }));
                                if (inset) {
                                    // Project again, but with the inset
                                    // projection
                                    delete point.projectedPath;
                                    bounds = point.getProjectedBounds(
                                        inset.projection
                                    );
                                    if (bounds) {
                                        inset.allBounds.push(bounds);
                                    }
                                    point.insetIndex = insets.indexOf(inset);
                                }
                            }
                            point.bounds = bounds;
                        }

                    }
                    if (point.bounds && point.insetIndex === void 0) {
                        allBounds.push(point.bounds);
                    }

                }
            });

            this.bounds = MapView.compositeBounds(allBounds);
        }

        return this.bounds;
    }

    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    public hasData(): boolean {
        return !!this.processedXData.length; // != 0
    }

    /**
     * Get presentational attributes. In the maps series this runs in both
     * styled and non-styled mode, because colors hold data when a colorAxis is
     * used.
     * @private
     */
    public pointAttribs(
        point: MapPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        const { mapView, styledMode } = point.series.chart;
        const attr = styledMode ?
            this.colorAttribs(point) :
            ColumnSeries.prototype.pointAttribs.call(
                this, point as any, state
            );

        // Individual stroke width
        let pointStrokeWidth = (point.options as any)[
            (
                this.pointAttrToOptions &&
                (this.pointAttrToOptions as any)['stroke-width']
            ) || 'borderWidth'
        ];
        if (pointStrokeWidth && mapView) {
            pointStrokeWidth /= mapView.getScale();
        }

        // In order for dash style to avoid being scaled, set the transformed
        // stroke width on the item
        if (attr.dashstyle && mapView && this.options.borderWidth) {
            pointStrokeWidth = this.options.borderWidth / mapView.getScale();
        }

        attr['stroke-width'] = pick(
            pointStrokeWidth,
            // By default set the stroke-width on the group element and let all
            // point graphics inherit. That way we don't have to iterate over
            // all points to update the stroke-width on zooming.
            'inherit'
        );

        return attr;
    }

    /**
     * @private
     */
    public updateData(): boolean {
        // #16782
        if (this.processedData) {
            return false;
        }

        return super.updateData.apply(this, arguments);
    }

    /**
     * Extend setData to call processData and generatePoints immediately.
     * @private
     */
    public setData(): void {

        super.setData.apply(this, arguments);

        this.processData();
        this.generatePoints();
    }

    /**
     * Extend processData to join in mapData. If the allAreas option is true,
     * all areas from the mapData are used, and those that don't correspond to a
     * data value are given null values. The results are stored in
     * `processedData` in order to avoid mutating `data`.
     * @private
     */
    public processData(): (boolean|undefined) {

        const options = this.options,
            data = options.data,
            chartOptions = this.chart.options.chart,
            joinBy = this.joinBy,
            pointArrayMap = options.keys || this.pointArrayMap,
            dataUsed: Array<MapPointOptions> = [],
            mapMap: AnyRecord = {};

        let mapView = this.chart.mapView,
            mapDataObject = mapView && (
                // Get map either from series or global
                isObject(options.mapData, true) ?
                    mapView.getGeoMap(options.mapData) : mapView.geoMap
            ),
            mapTransforms = this.chart.mapTransforms,
            mapPoint,
            props,
            i;

        // Pick up transform definitions for chart
        this.chart.mapTransforms = mapTransforms =
            chartOptions.mapTransforms ||
            mapDataObject && mapDataObject['hc-transform'] ||
            mapTransforms;

        // Cache cos/sin of transform rotation angle
        if (mapTransforms) {
            objectEach(mapTransforms, function (transform: any): void {
                if (transform.rotation) {
                    transform.cosAngle = Math.cos(transform.rotation);
                    transform.sinAngle = Math.sin(transform.rotation);
                }
            });
        }

        let mapData: MapPointOptions[]|undefined;
        if (isArray(options.mapData)) {
            mapData = options.mapData;
        } else if (
            mapDataObject && mapDataObject.type === 'FeatureCollection'
        ) {
            this.mapTitle = mapDataObject.title;
            mapData = H.geojson(mapDataObject, this.type, this);
        }

        // Reset processedData
        this.processedData = [];
        const processedData = this.processedData;

        // Pick up numeric values, add index. Convert Array point definitions to
        // objects using pointArrayMap.
        if (data) {
            data.forEach(function (val, i): void {
                let ix = 0;

                if (isNumber(val)) {
                    processedData[i] = {
                        value: val
                    };
                } else if (isArray(val)) {
                    processedData[i] = {};
                    // Automatically copy first item to hc-key if there is
                    // an extra leading string
                    if (
                        !options.keys &&
                        val.length > pointArrayMap.length &&
                        typeof val[0] === 'string'
                    ) {
                        (processedData[i] as any)['hc-key'] = val[0];
                        ++ix;
                    }
                    // Run through pointArrayMap and what's left of the
                    // point data array in parallel, copying over the values
                    for (let j = 0; j < pointArrayMap.length; ++j, ++ix) {
                        if (
                            pointArrayMap[j] &&
                            typeof val[ix] !== 'undefined'
                        ) {
                            if (pointArrayMap[j].indexOf('.') > 0) {
                                MapPoint.prototype.setNestedProperty(
                                    processedData[i], val[ix], pointArrayMap[j]
                                );
                            } else {
                                (processedData[i] as any)[pointArrayMap[j]] =
                                    val[ix];
                            }
                        }
                    }
                } else {
                    processedData[i] = data[i];
                }
                if (joinBy && joinBy[0] === '_i') {
                    (processedData[i] as any)._i = i;
                }
            });
        }

        if (mapData) {
            this.mapData = mapData;
            this.mapMap = {};

            for (i = 0; i < mapData.length; i++) {
                mapPoint = mapData[i];
                props = mapPoint.properties;

                (mapPoint as any)._i = i;
                // Copy the property over to root for faster access
                if (joinBy[0] && props && props[joinBy[0]]) {
                    (mapPoint as any)[joinBy[0]] = props[joinBy[0]];
                }
                mapMap[(mapPoint as any)[joinBy[0]]] = mapPoint;
            }
            this.mapMap = mapMap;

            // Registered the point codes that actually hold data
            if (joinBy[1]) {
                const joinKey = joinBy[1];
                processedData.forEach(function (
                    pointOptions: MapPointOptions
                ): void {
                    const mapKey = getNestedProperty(
                        joinKey,
                        pointOptions
                    ) as string;
                    if (mapMap[mapKey]) {
                        dataUsed.push(mapMap[mapKey]);
                    }
                } as any);
            }

            if (options.allAreas) {
                // Register the point codes that actually hold data
                if (joinBy[1]) {
                    const joinKey = joinBy[1];
                    processedData.forEach(function (
                        pointOptions: MapPointOptions
                    ): void {
                        dataUsed.push(getNestedProperty(
                            joinKey,
                            pointOptions
                        ) as MapPointOptions);
                    } as any);
                }

                // Add those map points that don't correspond to data, which
                // will be drawn as null points. Searching a string is faster
                // than Array.indexOf
                const dataUsedString = (
                    '|' +
                    dataUsed
                        .map(function (point): void {
                            return point && (point as any)[joinBy[0]];
                        })
                        .join('|') +
                    '|'
                );

                mapData.forEach(function (mapPoint: any): void {
                    if (
                        !joinBy[0] ||
                        dataUsedString.indexOf(
                            '|' + mapPoint[joinBy[0]] + '|'
                        ) === -1
                    ) {
                        processedData.push(merge(mapPoint, { value: null }));
                    }
                });
            }
        }
        // The processedXData array is used by general chart logic for checking
        // data length in various scanarios
        this.processedXData = new Array(processedData.length);

        return void 0;
    }

    /**
     * Extend setOptions by picking up the joinBy option and applying it to a
     * series property.
     * @private
     */
    public setOptions(itemOptions: MapSeriesOptions): MapSeriesOptions {
        let options = Series.prototype.setOptions.call(this, itemOptions),
            joinBy = options.joinBy,
            joinByNull = joinBy === null;

        if (joinByNull) {
            joinBy = '_i';
        }
        joinBy = this.joinBy = splat(joinBy);
        if (!joinBy[1]) {
            joinBy[1] = joinBy[0];
        }

        return options;
    }

    /**
     * Add the path option for data points. Find the max value for color
     * calculation.
     * @private
     */
    public translate(): void {
        const series = this,
            doFullTranslate = series.doFullTranslate(),
            mapView = this.chart.mapView,
            projection = mapView && mapView.projection;

        // Recalculate box on updated data
        if (this.chart.hasRendered && (this.isDirtyData || !this.hasRendered)) {
            this.processData();
            this.generatePoints();
            delete this.bounds;
            this.getProjectedBounds();
        }

        if (mapView) {
            const mainSvgTransform = mapView.getSVGTransform();

            series.points.forEach(function (
                point: (MapPoint&MapPoint.CacheObject)
            ): void {

                const svgTransform = (
                    isNumber(point.insetIndex) &&
                    mapView.insets[point.insetIndex].getSVGTransform()
                ) || mainSvgTransform;

                // Record the middle point (loosely based on centroid),
                // determined by the middleX and middleY options.
                if (
                    svgTransform &&
                    point.bounds &&
                    isNumber(point.bounds.midX) &&
                    isNumber(point.bounds.midY)
                ) {
                    point.plotX = point.bounds.midX * svgTransform.scaleX +
                        svgTransform.translateX;
                    point.plotY = point.bounds.midY * svgTransform.scaleY +
                        svgTransform.translateY;
                }

                if (doFullTranslate) {

                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: MapPoint.getProjectedPath(point, projection)
                    };
                }
            });
        }

        fireEvent(series, 'afterTranslate');
    }
    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapSeries {
    colorAttribs: ColorMapMixin.ColorMapSeries['colorAttribs'];
    drawLegendSymbol: typeof LegendSymbol.drawRectangle;
    getCenter: typeof CU['getCenter'];
    pointArrayMap: ColorMapMixin.ColorMapSeries['pointArrayMap'];
    pointClass: typeof MapPoint;
    preserveAspectRatio: boolean;
    trackerGroups: ColorMapMixin.ColorMapSeries['trackerGroups'];
    animate(init?: boolean): void;
    animateDrilldown(init?: boolean): void;
    animateDrillupTo(init?: boolean): void;
    doFullTranslate(): boolean;
    drawMapDataLabels(): void;
    drawPoints(): void;
    hasData(): boolean;
    pointAttribs(
        point?: MapPoint,
        state?: StatesOptionsKey
    ): SVGAttributes;
    render(): void;
}
extend(MapSeries.prototype, {
    type: 'map',

    axisTypes: ColorMapMixin.SeriesMixin.axisTypes,

    colorAttribs: ColorMapMixin.SeriesMixin.colorAttribs,

    colorKey: ColorMapMixin.SeriesMixin.colorKey,

    // When tooltip is not shared, this series (and derivatives) requires
    // direct touch/hover. KD-tree does not apply.
    directTouch: true,

    // We need the points' bounding boxes in order to draw the data labels,
    // so we skip it now and call it from drawPoints instead.
    drawDataLabels: noop,

    // No graph for the map series
    drawGraph: noop,

    drawLegendSymbol: LegendSymbol.drawRectangle,

    forceDL: true,

    getCenter: CU.getCenter,

    getExtremesFromAll: true,

    getSymbol: ColorMapMixin.SeriesMixin.getSymbol,

    isCartesian: false,

    parallelArrays: ColorMapMixin.SeriesMixin.parallelArrays,

    pointArrayMap: ColorMapMixin.SeriesMixin.pointArrayMap,

    pointClass: MapPoint,

    // X axis and Y axis must have same translation slope
    preserveAspectRatio: true,

    searchPoint: noop as any,

    trackerGroups: ColorMapMixin.SeriesMixin.trackerGroups,

    // Get axis extremes from paths, not values
    useMapGeometry: true

});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        map: typeof MapSeries;
    }
}
SeriesRegistry.registerSeriesType('map', MapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default MapSeries;


/* *
 *
 *  API Options
 *
 * */

/**
 * An array of objects containing a `geometry` or `path` definition and
 * optionally additional properties to join in the `data` as per the `joinBy`
 * option. GeoJSON and TopoJSON structures can also be passed directly into
 * `mapData`.
 *
 * @sample maps/demo/category-map/
 *         Map data and joinBy
 * @sample maps/series/mapdata-multiple/
 *         Multiple map sources
 *
 * @type      {Array<Highcharts.SeriesMapDataOptions>|Highcharts.GeoJSON|Highcharts.TopoJSON}
 * @product   highmaps
 * @apioption series.mapData
 */

/**
 * A `map` series. If the [type](#series.map.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.map
 * @excluding dataParser, dataURL, marker
 * @product   highmaps
 * @apioption series.map
 */

/**
 * An array of data points for the series. For the `map` series type, points can
 * be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `value` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `[hc-key, value]`. Example:
 *    ```js
 *        data: [
 *            ['us-ny', 0],
 *            ['us-mi', 5],
 *            ['us-tx', 3],
 *            ['us-ak', 5]
 *        ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.map.turboThreshold),
 *    this option is not available.
 *    ```js
 *        data: [{
 *            value: 6,
 *            name: "Point2",
 *            color: "#00FF00"
 *        }, {
 *            value: 6,
 *            name: "Point1",
 *            color: "#FF00FF"
 *        }]
 *    ```
 *
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @product   highmaps
 * @apioption series.map.data
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highmaps
 * @apioption series.map.data.color
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @sample maps/series/data-datalabels/
 *         Disable data labels for individual areas
 *
 * @type      {Highcharts.DataLabelsOptions}
 * @product   highmaps
 * @apioption series.map.data.dataLabels
 */

/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 *
 * @sample maps/demo/map-drilldown/
 *         Basic drilldown
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.drilldown
 */

/**
 * For map and mapline series types, the geometry of a point.
 *
 * To achieve a better separation between the structure and the data,
 * it is recommended to use `mapData` to define the geometry instead
 * of defining it on the data points themselves.
 *
 * The geometry object is compatible to that of a `feature` in geoJSON, so
 * features of geoJSON can be passed directly into the `data`, optionally
 * after first filtering and processing it.
 *
 * @sample maps/series/data-geometry/
 *         Geometry defined in data
 *
 * @type      {Object}
 * @since 9.3.0
 * @product   highmaps
 * @apioption series.map.data.geometry
 */

/**
 * The geometry type. Can be one of `LineString`, `Polygon`, `MultiLineString`
 * or `MultiPolygon`.
 *
 * @type      {string}
 * @since 9.3.0
 * @product   highmaps
 * @validvalue ["LineString", "Polygon", "MultiLineString", "MultiPolygon"]
 * @apioption series.map.data.geometry.type
 */

/**
 * The geometry coordinates in terms of arrays of `[longitude, latitude]`, or
 * a two dimensional array of the same. The dimensionality must comply with the
 * `type`.
 *
 * @type      {Array<LonLatArray>|Array<Array<LonLatArray>>}
 * @since 9.3.0
 * @product   highmaps
 * @apioption series.map.data.geometry.coordinates
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @sample maps/series/data-id/
 *         Highlight a point by id
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.id
 */

/**
 * When data labels are laid out on a map, Highmaps runs a simplified
 * algorithm to detect collision. When two labels collide, the one with
 * the lowest rank is hidden. By default the rank is computed from the
 * area.
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.map.data.labelrank
 */

/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleX can be defined
 * there.
 *
 * @type      {number}
 * @default   0.5
 * @product   highmaps
 * @apioption series.map.data.middleX
 */

/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleY can be defined
 * there.
 *
 * @type      {number}
 * @default   0.5
 * @product   highmaps
 * @apioption series.map.data.middleY
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 *
 * @sample maps/series/data-datalabels/
 *         Point names
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.name
 */

/**
 * For map and mapline series types, the SVG path for the shape. For
 * compatibily with old IE, not all SVG path definitions are supported,
 * but M, L and C operators are safe.
 *
 * To achieve a better separation between the structure and the data,
 * it is recommended to use `mapData` to define that paths instead
 * of defining them on the data points themselves.
 *
 * For providing true geographical shapes based on longitude and latitude, use
 * the `geometry` option instead.
 *
 * @sample maps/series/data-path/
 *         Paths defined in data
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.path
 */

/**
 * The numeric value of the data point.
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.map.data.value
 */


/**
 * Individual point events
 *
 * @extends   plotOptions.series.point.events
 * @product   highmaps
 * @apioption series.map.data.events
 */

''; // adds doclets above to the transpiled file
