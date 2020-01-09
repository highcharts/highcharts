/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Author: Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type MarkerClusterAlgorithmValue = (
            'grid'|'kmeans'|'optimizedKmeans'
        );
        interface MarkerClusterLayoutAlgorithmOptions {
            type?: (MarkerClusterAlgorithmValue | Function);
            gridSize?: (number | string);
            processedGridSize?: number;
            distance?: (number | string);
            processedDistance?: number;
            iterations?: number;
            kmeansThreshold?: number;
        }
        interface MarkerClusterZonesOptions {
            from: number;
            to: number;
            marker: PointMarkerOptionsObject;
            zoneIndex: number;
            className?: string;
        }
        interface MarkerClusterDrillCallbackFunction {
            (this: Point, event: PointClickEventObject): void;
        }
        interface MarkerClusterEventsOptions {
            drillToCluster: MarkerClusterDrillCallbackFunction;
        }
        interface MarkerClusterOptions {
            enabled?: boolean;
            allowOverlap?: boolean;
            minimumClusterSize?: number;
            drillToCluster?: boolean;
            animation?: (boolean|AnimationOptionsObject);
            layoutAlgorithm: MarkerClusterLayoutAlgorithmOptions;
            marker?: PointMarkerOptionsObject;
            dataLabels?: DataLabelsOptionsObject;
            zones?: Array<MarkerClusterZonesOptions>;
            states?: PointStatesOptionsObject;
            events?: MarkerClusterEventsOptions;
        }
        interface PointOptionsObject {
            lat?: number;
            lon?: number;
        }
        interface MarkerClusterSplitDataObject {
            dataIndex: number;
            x: number;
            y: number;
            parentStateId?: string;
            options?: (string | number | PointOptionsObject |
            (string | number)[] | null);
        }
        interface MarkerClusterSplitDataArray
            extends Array<MarkerClusterSplitDataObject> {
            posX?: number;
            posY?: number;
        }
        interface KmeansClusterObject {
            posX: number;
            posY: number;
            oldX: number;
            oldY: number;
            startPointsLen: number;
            points: Array<MarkerClusterSplitDataObject>;
        }
        interface MarkerClusterAlgorithmFunction {
            (
                processedXData: Array<number>,
                processedYData: Array<number>,
                visibleDataIndexes: Array<number>,
                options: MarkerClusterLayoutAlgorithmOptions
            ): Dictionary<MarkerClusterSplitDataArray>;
        }
        interface MarkerClusterPreventCollisionObject {
            x: number;
            y: number;
            key: string;
            groupedData: Dictionary<MarkerClusterSplitDataArray>;
            gridSize: number;
            defaultRadius: number;
            clusterRadius: number;
        }
        interface ClusterAndNoiseObject {
            data: Array<MarkerClusterSplitDataObject>;
            id: string;
            index: number;
            stateId: string;
            x: number;
            y: number;
            point?: Point;
            clusterZone?: MarkerClusterZonesOptions;
            clusterZoneClassName?: string;
            pointsOutside?: Array<MarkerClusterSplitDataObject>;
            pointsInside?: Array<MarkerClusterSplitDataObject>;
        }
        interface GroupMapOptionsObject extends SeriesOptions {
            formatPrefix?: string;
            userOptions?: string | number |
            PointOptionsObject | (string | number)[] | null;
            x?: number;
            y?: number;
        }
        interface GroupMapObject {
            options?: GroupMapOptionsObject;
        }
        interface MarkerClusterPointsState {
            x: number;
            y: number;
            id: string;
            parentsId: Array<string>;
            point: (Point|undefined);
        }
        interface MarkerClusterPointsStateObject {
            oldState?: Dictionary<MarkerClusterPointsState>;
            newState: Dictionary<MarkerClusterPointsState>;
        }
        interface MarkerClusterInfoObject {
            clusters: Array<ClusterAndNoiseObject>;
            noise: Array<ClusterAndNoiseObject>;
            groupedXData: Array<number>;
            groupedYData: Array<number>;
            groupMap: Array<GroupMapObject>;
            initMinX?: number;
            initMaxX?: number;
            initMinY?: number;
            initMaxY?: number;
            pointsState?: MarkerClusterPointsStateObject;
        }
        interface BaseClustersObject {
            clusters: Array<ClusterAndNoiseObject>;
            noise: Array<ClusterAndNoiseObject>;
        }
        interface Point {
            isCluster?: boolean;
            clusteredData?: Array<MarkerClusterSplitDataObject>;
            clusterPointsAmount?: number;
        }
        interface SeriesOptions {
            cluster?: MarkerClusterOptions;
        }
        interface Series {
            markerClusterInfo?: MarkerClusterInfoObject;
            markerClusterAlgorithms?:
            Dictionary<MarkerClusterAlgorithmFunction>;
            markerClusterSeriesData?: (Array<Point|null>|null);
            gridValueSize?: number;
            baseClusters?: (BaseClustersObject | null);
            initMaxX?: number;
            initMinX?: number;
            initMaxY?: number;
            initMinY?: number;
            debugGridLines?: Array<SVGElement>;
            dataMaxX?: number;
            dataMinX?: number;
            dataMaxY?: number;
            dataMinY?: number;
            /** @requires modules/marker-clusters */
            getRealExtremes(): Dictionary<number>;
            /** @requires modules/marker-clusters */
            getGridOffset(): Dictionary<number>;
            /** @requires modules/marker-clusters */
            animateClusterPoint(
                clusterObj: ClusterAndNoiseObject
            ): void;
            /** @requires modules/marker-clusters */
            onDrillToCluster(
                event: PointClickEventObject
            ): void;
            /** @requires modules/marker-clusters */
            getClusterDistancesFromPoint(
                clusters: Array<Highcharts.KmeansClusterObject>,
                pointX: number,
                pointY: number
            ): Array<Dictionary<number>>;
            /** @requires modules/marker-clusters */
            getScaledGridSize(
                options: Highcharts.MarkerClusterLayoutAlgorithmOptions
            ): number;
            /** @requires modules/marker-clusters */
            getPointsState(
                clusteredData: MarkerClusterInfoObject,
                oldMarkerClusterInfo: (MarkerClusterInfoObject|undefined),
                dataLength: number
            ): Dictionary<MarkerClusterPointsState>;
            /** @requires modules/marker-clusters */
            preventClusterCollisions(
                props: MarkerClusterPreventCollisionObject
            ): PositionObject;
            /** @requires modules/marker-clusters */
            isValidGroupedDataObject(
                groupedData: Dictionary<MarkerClusterSplitDataArray>
            ): boolean;
            /** @requires modules/marker-clusters */
            getClusteredData(
                groupedData: Dictionary<MarkerClusterSplitDataArray>,
                options: MarkerClusterOptions
            ): (MarkerClusterInfoObject | boolean);
            /** @requires modules/marker-clusters */
            destroyClusteredData (): void;
            hideClusteredData (): void;
        }
    }
}

/**
 * Function callback when a cluster is clicked.
 *
 * @callback Highcharts.MarkerClusterDrillCallbackFunction
 *
 * @param {Highcharts.Point} this
 *          The point where the event occured.
 *
 * @param {Highcharts.PointClickEventObject} event
 *          Event arguments.
 */

/* eslint-disable no-invalid-this */

import '../parts/Series.js';
import '../parts/Axis.js';
import '../parts/SvgRenderer.js';

var Series = H.Series,
    Scatter = H.seriesTypes.scatter,
    Point = H.Point,
    SvgRenderer = H.SVGRenderer,
    addEvent = H.addEvent,
    merge = H.merge,
    defined = U.defined,
    isArray = U.isArray,
    isObject = U.isObject,
    isFunction = H.isFunction,
    isNumber = U.isNumber,
    relativeLength = H.relativeLength,
    error = H.error,
    objectEach = U.objectEach,
    syncTimeout = U.syncTimeout,
    animObject = H.animObject,
    baseGeneratePoints = Series.prototype.generatePoints,
    stateIdCounter = 0,
    // Points that ids are included in the oldPointsStateId array
    // are hidden before animation. Other ones are destroyed.
    oldPointsStateId: Array<string> = [];

/**
 * Options for marker clusters, the concept of sampling the data
 * values into larger blocks in order to ease readability and
 * increase performance of the JavaScript charts.
 *
 * Note: marker clusters module is not working with `boost`
 * and `draggable-points` modules.
 *
 * The marker clusters feature requires the marker-clusters.js
 * file to be loaded, found in the modules directory of the download
 * package, or online at [code.highcharts.com/modules/marker-clusters.js
 * ](code.highcharts.com/modules/marker-clusters.js).
 *
 * @sample maps/marker-clusters/europe
 *         Maps marker clusters
 * @sample highcharts/marker-clusters/basic
 *         Scatter marker clusters
 * @sample maps/marker-clusters/optimized-kmeans
 *         Marker clusters with colorAxis
 *
 * @product      highcharts highmaps
 * @since 8.0.0
 * @optionparent plotOptions.scatter.cluster
 *
 * @private
 */
var clusterDefaultOptions = {
    /**
     * Whether to enable the marker-clusters module.
     *
     * @sample maps/marker-clusters/basic
     *         Maps marker clusters
     * @sample highcharts/marker-clusters/basic
     *         Scatter marker clusters
     */
    enabled: false,
    /**
     * When set to `false` prevent cluster overlapping - this option
     * works only when `layoutAlgorithm.type = "grid"`.
     *
     * @sample highcharts/marker-clusters/grid
     *         Prevent overlapping
     */
    allowOverlap: true,
    /**
     * Options for the cluster marker animation.
     * @type    {boolean|Highcharts.AnimationOptionsObject}
     * @default { "duration": 500 }
     */
    animation: {
        /** @ignore-option */
        duration: 500
    },
    /**
     * Zoom the plot area to the cluster points range when a cluster is clicked.
     */
    drillToCluster: true,
    /**
     * The minimum amount of points to be combined into a cluster.
     * This value has to be greater or equal to 2.
     *
     * @sample highcharts/marker-clusters/basic
     *         At least three points in the cluster
     */
    minimumClusterSize: 2,
    /**
     * Options for layout algorithm. Inside there
     * are options to change the type of the algorithm, gridSize,
     * distance or iterations.
     */
    layoutAlgorithm: {
        /**
         * Type of the algorithm used to combine points into a cluster.
         * There are three available algorithms:
         *
         * 1) `grid` - grid-based clustering technique. Points are assigned
         * to squares of set size depending on their position on the plot
         * area. Points inside the grid square are combined into a cluster.
         * The grid size can be controlled by `gridSize` property
         * (grid size changes at certain zoom levels).
         *
         * 2) `kmeans` - based on K-Means clustering technique. In the
         * first step, points are divided using the grid method (distance
         * property is a grid size) to find the initial amount of clusters.
         * Next, each point is classified by computing the distance between
         * each cluster center and that point. When the closest cluster
         * distance is lower than distance property set by a user the point
         * is added to this cluster otherwise is classified as `noise`. The
         * algorithm is repeated until each cluster center not change its
         * previous position more than one pixel. This technique is more
         * accurate but also more time consuming than the `grid` algorithm,
         * especially for big datasets.
         *
         * 3) `optimizedKmeans` - based on K-Means clustering technique. This
         * algorithm uses k-means algorithm only on the chart initialization
         * or when chart extremes have greater range than on initialization.
         * When a chart is redrawn the algorithm checks only clustered points
         * distance from the cluster center and rebuild it when the point is
         * spaced enough to be outside the cluster. It provides performance
         * improvement and more stable clusters position yet can be used rather
         * on small and sparse datasets.
         *
         * By default, the algorithm depends on visible quantity of points
         * and `kmeansThreshold`. When there are more visible points than the
         * `kmeansThreshold` the `grid` algorithm is used, otherwise `kmeans`.
         *
         * The custom clustering algorithm can be added by assigning a callback
         * function as the type property. This function takes an array of
         * `processedXData`, `processedYData`, `processedXData` indexes and
         * `layoutAlgorithm` options as arguments and should return an object
         * with grouped data.
         *
         * The algorithm should return an object like that:
         * <pre>{
         *  clusterId1: [{
         *      x: 573,
         *      y: 285,
         *      index: 1 // point index in the data array
         *  }, {
         *      x: 521,
         *      y: 197,
         *      index: 2
         *  }],
         *  clusterId2: [{
         *      ...
         *  }]
         *  ...
         * }</pre>
         *
         * `clusterId` (example above - unique id of a cluster or noise)
         * is an array of points belonging to a cluster. If the
         * array has only one point or fewer points than set in
         * `cluster.minimumClusterSize` it won't be combined into a cluster.
         *
         * @sample maps/marker-clusters/optimized-kmeans
         *         Optimized K-Means algorithm
         * @sample highcharts/marker-clusters/kmeans
         *         K-Means algorithm
         * @sample highcharts/marker-clusters/grid
         *         Grid algorithm
         * @sample maps/marker-clusters/custom-alg
         *         Custom algorithm
         *
         * @type {string|Function}
         * @see [cluster.minimumClusterSize](#plotOptions.scatter.marker.cluster.minimumClusterSize)
         * @apioption plotOptions.scatter.cluster.layoutAlgorithm.type
         */
        /**
         * When `type` is set to the `grid`,
         * `gridSize` is a size of a grid square element either as a number
         * defining pixels, or a percentage defining a percentage
         * of the plot area width.
         *
         * @type    {number|string}
         */
        gridSize: 50,
        /**
         * When `type` is set to `kmeans`,
         * `iterations` are the number of iterations that this algorithm will be
         * repeated to find clusters positions.
         *
         * @type    {number}
         * @apioption plotOptions.scatter.cluster.layoutAlgorithm.iterations
         */
        /**
         * When `type` is set to `kmeans`,
         * `distance` is a maximum distance between point and cluster center
         * so that this point will be inside the cluster. The distance
         * is either a number defining pixels or a percentage
         * defining a percentage of the plot area width.
         *
         * @type    {number|string}
         */
        distance: 40,
        /**
         * When `type` is set to `undefined` and there are more visible points
         * than the kmeansThreshold the `grid` algorithm is used to find
         * clusters, otherwise `kmeans`. It ensures good performance on
         * large datasets and better clusters arrangement after the zoom.
         */
        kmeansThreshold: 100
    },
    /**
     * Options for the cluster marker.
     * @extends   plotOptions.series.marker
     * @excluding enabledThreshold, states
     * @type      {Highcharts.PointMarkerOptionsObject}
     */
    marker: {
        /** @internal */
        symbol: 'cluster',
        /** @internal */
        radius: 15,
        /** @internal */
        lineWidth: 0,
        /** @internal */
        lineColor: '${palette.backgroundColor}'
    },
    /**
     * Fires when the cluster point is clicked and `drillToCluster` is enabled.
     * One parameter, `event`, is passed to the function. The default action
     * is to zoom to the cluster points range. This can be prevented
     * by calling `event.preventDefault()`.
     *
     * @type      {Highcharts.MarkerClusterDrillCallbackFunction}
     * @product   highcharts highmaps
     * @see [cluster.drillToCluster](#plotOptions.scatter.marker.cluster.drillToCluster)
     * @apioption plotOptions.scatter.cluster.events.drillToCluster
     */

    /**
     * An array defining zones within marker clusters.
     *
     * In styled mode, the color zones are styled with the
     * `.highcharts-cluster-zone-{n}` class, or custom
     * classed from the `className`
     * option.
     *
     * @sample highcharts/marker-clusters/basic
     *         Marker clusters zones
     * @sample maps/marker-clusters/custom-alg
     *         Zones on maps
     *
     * @type      {Array<*>}
     * @product   highcharts highmaps
     * @apioption plotOptions.scatter.cluster.zones
     */

    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/
     *         Zones styled by class name
     *
     * @type      {string}
     * @apioption plotOptions.scatter.cluster.zones.className
     */

    /**
     * Settings for the cluster marker belonging to the zone.
     *
     * @see [cluster.marker](#plotOptions.scatter.cluster.marker)
     * @extends   plotOptions.scatter.cluster.marker
     * @product   highcharts highmaps
     * @apioption plotOptions.scatter.cluster.zones.marker
     */

    /**
     * The value where the zone starts.
     *
     * @type      {number}
     * @product   highcharts highmaps
     * @apioption plotOptions.scatter.cluster.zones.from
     */

    /**
     * The value where the zone ends.
     *
     * @type      {number}
     * @product   highcharts highmaps
     * @apioption plotOptions.scatter.cluster.zones.to
     */

    /**
     * The fill color of the cluster marker in hover state. When
     * `undefined`, the series' or point's fillColor for normal
     * state is used.
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.scatter.cluster.states.hover.fillColor
     */

    /**
     * Options for the cluster data labels.
     * @type    {Highcharts.DataLabelsOptionsObject}
     */
    dataLabels: {
        /** @internal */
        enabled: true,
        /** @internal */
        format: '{point.clusterPointsAmount}',
        /** @internal */
        verticalAlign: 'middle',
        /** @internal */
        align: 'center',
        /** @internal */
        style: {
            color: 'contrast'
        },
        /** @internal */
        inside: true
    }
};

(H.defaultOptions.plotOptions || {}).series = merge(
    (H.defaultOptions.plotOptions || {}).series,
    {
        cluster: clusterDefaultOptions,
        tooltip: {
            /**
             * The HTML of the cluster point's in the tooltip. Works only with
             * marker-clusters module and analogously to
             * [pointFormat](#tooltip.pointFormat).
             *
             * The cluster tooltip can be also formatted using
             * `tooltip.formatter` callback function and `point.isCluster` flag.
             *
             * @sample highcharts/marker-clusters/grid
             *         Format tooltip for cluster points.
             *
             * @sample maps/marker-clusters/europe/
             *         Format tooltip for clusters using tooltip.formatter
             *
             * @apioption tooltip.clusterFormat
             */
            clusterFormat: '<span>Clustered points: ' +
                '{point.clusterPointsAmount}</span><br/>'
        }
    }
);

// Utils.

/* eslint-disable require-jsdoc */
function getClusterPosition(
    points: Array<Highcharts.PositionObject>
): Highcharts.PositionObject {
    var pointsLen = points.length,
        sumX = 0,
        sumY = 0,
        i;

    for (i = 0; i < pointsLen; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
    }

    return {
        x: sumX / pointsLen,
        y: sumY / pointsLen
    };
}

// Prepare array with sorted data objects to be
// compared in getPointsState method.
function getDataState(
    clusteredData: Highcharts.MarkerClusterInfoObject,
    stateDataLen: number
): Array<Highcharts.MarkerClusterSplitDataObject|undefined> {
    var state: Array<Highcharts.MarkerClusterSplitDataObject|undefined> = [];
    state.length = stateDataLen;

    clusteredData.clusters.forEach(function (
        cluster: Highcharts.ClusterAndNoiseObject
    ): void {
        cluster.data.forEach(function (
            elem: Highcharts.MarkerClusterSplitDataObject
        ): void {
            state[elem.dataIndex] = elem;
        });
    });

    clusteredData.noise.forEach(function (
        noise: Highcharts.ClusterAndNoiseObject
    ): void {
        state[noise.data[0].dataIndex] = noise.data[0];
    });

    return state;
}

function fadeInElement(
    elem: Highcharts.SVGElement,
    opacity?: number,
    animation?: (boolean|Highcharts.AnimationOptionsObject)
): void {
    elem
        .attr({
            opacity: opacity
        })
        .animate({
            opacity: 1
        }, animation);
}

function fadeInStatePoint(
    stateObj: Highcharts.MarkerClusterPointsState,
    opacity?: number,
    animation?: (boolean|Highcharts.AnimationOptionsObject),
    fadeinGraphic?: boolean,
    fadeinDataLabel?: boolean
): void {
    if (stateObj.point) {
        if (fadeinGraphic && stateObj.point.graphic) {
            stateObj.point.graphic.show();
            fadeInElement(stateObj.point.graphic, opacity, animation);
        }

        if (fadeinDataLabel && stateObj.point.dataLabel) {
            stateObj.point.dataLabel.show();
            fadeInElement(stateObj.point.dataLabel, opacity, animation);
        }
    }
}

function hideStatePoint(
    stateObj: Highcharts.MarkerClusterPointsState,
    hideGraphic?: boolean,
    hideDataLabel?: boolean
): void {
    if (stateObj.point) {
        if (hideGraphic && stateObj.point.graphic) {
            stateObj.point.graphic.hide();
        }

        if (hideDataLabel && stateObj.point.dataLabel) {
            stateObj.point.dataLabel.hide();
        }
    }
}

function destroyOldPoints(
    oldState:
    (Highcharts.Dictionary<Highcharts.MarkerClusterPointsState>|undefined)
): void {
    if (oldState) {
        objectEach(oldState, function (state): void {
            if (state.point && state.point.destroy) {
                state.point.destroy();
            }
        });
    }
}

function fadeInNewPointAndDestoryOld(
    newPointObj: Highcharts.MarkerClusterPointsState,
    oldPoints: Array<Highcharts.MarkerClusterPointsState>,
    animation: (boolean|Highcharts.AnimationOptionsObject),
    opacity: number
): void {
    // Fade in new point.
    fadeInStatePoint(newPointObj, opacity, animation, true, true);

    // Destroy old animated points.
    oldPoints.forEach(function (p): void {
        if (p.point && p.point.destroy) {
            p.point.destroy();
        }
    });
}

// Generate unique stateId for a state element.
function getStateId(): string {
    return Math.random().toString(36).substring(2, 7) + '-' + stateIdCounter++;
}

// Useful for debugging.
// function drawGridLines(
//     series: Highcharts.Series,
//     options: Highcharts.MarkerClusterLayoutAlgorithmOptions
// ): void {
//     var chart = series.chart,
//         xAxis = series.xAxis,
//         yAxis = series.yAxis,
//         xAxisLen = series.xAxis.len,
//         yAxisLen = series.yAxis.len,
//         i, j, elem, text,
//         currentX = 0,
//         currentY = 0,
//         scaledGridSize = 50,
//         gridX = 0,
//         gridY = 0,
//         gridOffset = series.getGridOffset(),
//         mapXSize, mapYSize;

//     if (series.debugGridLines && series.debugGridLines.length) {
//         series.debugGridLines.forEach(function (gridItem): void {
//             if (gridItem && gridItem.destroy) {
//                 gridItem.destroy();
//             }
//         });
//     }


//     series.debugGridLines = [];
//     scaledGridSize = series.getScaledGridSize(options);

//     mapXSize = Math.abs(
//         xAxis.toPixels(xAxis.dataMax || 0) -
//         xAxis.toPixels(xAxis.dataMin || 0)
//     );

//     mapYSize = Math.abs(
//         yAxis.toPixels(yAxis.dataMax || 0) -
//         yAxis.toPixels(yAxis.dataMin || 0)
//     );

//     gridX = Math.ceil(mapXSize / scaledGridSize);
//     gridY = Math.ceil(mapYSize / scaledGridSize);

//     for (i = 0; i < gridX; i++) {
//         currentX = i * scaledGridSize;

//         if (
//             gridOffset.plotLeft + currentX >= 0 &&
//             gridOffset.plotLeft + currentX < xAxisLen
//         ) {

//             for (j = 0; j < gridY; j++) {
//                 currentY = j * scaledGridSize;

//                 if (
//                     gridOffset.plotTop + currentY >= 0 &&
//                     gridOffset.plotTop + currentY < yAxisLen
//                 ) {
//                     if (j % 2 === 0 && i % 2 === 0) {
//                         var rect = chart.renderer
//                             .rect(
//                                 gridOffset.plotLeft + currentX,
//                                 gridOffset.plotTop + currentY,
//                                 scaledGridSize * 2,
//                                 scaledGridSize * 2
//                             )
//                             .attr({
//                                 stroke: series.color,
//                                 'stroke-width': '2px'
//                             })
//                             .add()
//                             .toFront();

//                         series.debugGridLines.push(rect);
//                     }

//                     elem = chart.renderer
//                         .rect(
//                             gridOffset.plotLeft + currentX,
//                             gridOffset.plotTop + currentY,
//                             scaledGridSize,
//                             scaledGridSize
//                         )
//                         .attr({
//                             stroke: series.color,
//                             opacity: 0.3,
//                             'stroke-width': '1px'
//                         })
//                         .add()
//                         .toFront();

//                     text = chart.renderer
//                         .text(
//                             j + '-' + i,
//                             gridOffset.plotLeft + currentX + 2,
//                             gridOffset.plotTop + currentY + 7
//                         )
//                         .css({
//                             fill: 'rgba(0, 0, 0, 0.7)',
//                             fontSize: '7px'
//                         })
//                         .add()
//                         .toFront();

//                     series.debugGridLines.push(elem);
//                     series.debugGridLines.push(text);
//                 }
//             }
//         }
//     }
// }
/* eslint-enable require-jsdoc */


// Cluster symbol.
SvgRenderer.prototype.symbols.cluster = function (
    this: Highcharts.SVGRenderer,
    x: number,
    y: number,
    width: number,
    height: number
): Highcharts.SVGElement {
    var w = width / 2,
        h = height / 2,
        outerWidth = 1,
        space = 1,
        inner, outer1, outer2;

    inner = this.arc(x + w, y + h, w - space * 4, h - space * 4, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        open: false
    } as any);

    outer1 = this.arc(x + w, y + h, w - space * 3, h - space * 3, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        innerR: w - outerWidth * 2,
        open: false
    } as any);

    outer2 = this.arc(x + w, y + h, w - space, h - space, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        innerR: w,
        open: false
    } as any);

    return outer2.concat(outer1, inner);
};

Scatter.prototype.animateClusterPoint = function (
    this: Highcharts.Series,
    clusterObj: Highcharts.ClusterAndNoiseObject
): void {
    var series = this,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        chart = series.chart,
        clusterOptions = series.options.cluster,
        animation = animObject((clusterOptions || {}).animation),
        animDuration = animation.duration || 500,
        pointsState = (series.markerClusterInfo || {}).pointsState,
        newState = (pointsState || {}).newState,
        oldState = (pointsState || {}).oldState,
        parentId,
        oldPointObj: Highcharts.MarkerClusterPointsState,
        newPointObj: Highcharts.MarkerClusterPointsState,
        oldPoints: Array<Highcharts.MarkerClusterPointsState> = [],
        newPointBBox,
        offset = 0,
        newX = 0,
        newY = 0,
        isOldPointGrahic = false,
        isCbHandled = false;

    if (oldState && newState) {
        newPointObj = newState[clusterObj.stateId];
        newX = xAxis.toPixels(newPointObj.x) - chart.plotLeft;
        newY = yAxis.toPixels(newPointObj.y) - chart.plotTop;

        // Point has one ancestor.
        if (newPointObj.parentsId.length === 1) {
            parentId = (newState || {})[clusterObj.stateId].parentsId[0];
            oldPointObj = oldState[parentId];

            // If old and new poistions are the same do not animate.
            if (
                newPointObj.point &&
                newPointObj.point.graphic &&
                oldPointObj &&
                oldPointObj.point &&
                oldPointObj.point.plotX &&
                oldPointObj.point.plotY &&
                oldPointObj.point.plotX !== newPointObj.point.plotX &&
                oldPointObj.point.plotY !== newPointObj.point.plotY
            ) {
                newPointBBox = newPointObj.point.graphic.getBBox();
                offset = newPointBBox.width / 2;

                newPointObj.point.graphic.attr({
                    x: oldPointObj.point.plotX - offset,
                    y: oldPointObj.point.plotY - offset
                });

                newPointObj.point.graphic.animate({
                    x: newX - newPointObj.point.graphic.radius,
                    y: newY - newPointObj.point.graphic.radius
                }, animation, function (): void {
                    isCbHandled = true;

                    // Destroy old point.
                    if (oldPointObj.point && oldPointObj.point.destroy) {
                        oldPointObj.point.destroy();
                    }
                });

                // Data label animation.
                if (
                    newPointObj.point.dataLabel &&
                    newPointObj.point.dataLabel.alignAttr &&
                    oldPointObj.point.dataLabel &&
                    oldPointObj.point.dataLabel.alignAttr
                ) {
                    newPointObj.point.dataLabel.attr({
                        x: oldPointObj.point.dataLabel.alignAttr.x,
                        y: oldPointObj.point.dataLabel.alignAttr.y
                    });

                    newPointObj.point.dataLabel.animate({
                        x: newPointObj.point.dataLabel.alignAttr.x,
                        y: newPointObj.point.dataLabel.alignAttr.y
                    }, animation);
                }
            }
        } else if (newPointObj.parentsId.length === 0) {
            // Point has no ancestors - new point.

            // Hide new point.
            hideStatePoint(newPointObj, true, true);

            syncTimeout(function (): void {
                // Fade in new point.
                fadeInStatePoint(newPointObj, 0.1, animation, true, true);
            }, animDuration / 2);
        } else {
            // Point has many ancestors.

            // Hide new point before animation.
            hideStatePoint(newPointObj, true, true);

            newPointObj.parentsId.forEach(function (elem): void {
                if (oldState && oldState[elem]) {
                    oldPointObj = oldState[elem];
                    oldPoints.push(oldPointObj);

                    if (
                        oldPointObj.point &&
                        oldPointObj.point.graphic
                    ) {
                        isOldPointGrahic = true;
                        oldPointObj.point.graphic.show();
                        oldPointObj.point.graphic.animate({
                            x: newX - oldPointObj.point.graphic.radius,
                            y: newY - oldPointObj.point.graphic.radius,
                            opacity: 0.4
                        }, animation, function (): void {
                            isCbHandled = true;
                            fadeInNewPointAndDestoryOld(
                                newPointObj, oldPoints, animation, 0.7
                            );
                        });

                        if (
                            oldPointObj.point.dataLabel &&
                            oldPointObj.point.dataLabel.y !== -9999 &&
                            newPointObj.point &&
                            newPointObj.point.dataLabel &&
                            newPointObj.point.dataLabel.alignAttr
                        ) {
                            oldPointObj.point.dataLabel.show();
                            oldPointObj.point.dataLabel.animate({
                                x: newPointObj.point.dataLabel.alignAttr.x,
                                y: newPointObj.point.dataLabel.alignAttr.y,
                                opacity: 0.4
                            }, animation);
                        }
                    }
                }
            });

            // Make sure point is faded in.
            syncTimeout(function (): void {
                if (!isCbHandled) {
                    fadeInNewPointAndDestoryOld(
                        newPointObj, oldPoints, animation, 0.85
                    );
                }
            }, animDuration);

            if (!isOldPointGrahic) {
                syncTimeout(function (): void {
                    fadeInNewPointAndDestoryOld(
                        newPointObj, oldPoints, animation, 0.1
                    );
                }, animDuration / 2);
            }
        }
    }
};

Scatter.prototype.getGridOffset = function (
    this: Highcharts.Series
): Highcharts.Dictionary<number> {
    var series = this,
        chart = series.chart,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        plotLeft = 0,
        plotTop = 0;

    if (series.dataMinX && series.dataMaxX) {
        plotLeft = xAxis.reversed ?
            xAxis.toPixels(series.dataMaxX) : xAxis.toPixels(series.dataMinX);
    } else {
        plotLeft = chart.plotLeft;
    }

    if (series.dataMinY && series.dataMaxY) {
        plotTop = yAxis.reversed ?
            yAxis.toPixels(series.dataMinY) : yAxis.toPixels(series.dataMaxY);
    } else {
        plotTop = chart.plotTop;
    }

    return { plotLeft, plotTop };
};

Scatter.prototype.getScaledGridSize = function (
    this: Highcharts.Series,
    options: Highcharts.MarkerClusterLayoutAlgorithmOptions
): number {
    var series = this,
        xAxis = series.xAxis,
        search = true,
        k = 1,
        divider = 1,
        processedGridSize = options.processedGridSize ||
            clusterDefaultOptions.layoutAlgorithm.gridSize,
        gridSize,
        scale,
        level;

    if (!series.gridValueSize) {
        series.gridValueSize = Math.abs(
            xAxis.toValue(processedGridSize) - xAxis.toValue(0)
        );
    }

    gridSize = xAxis.toPixels(series.gridValueSize) - xAxis.toPixels(0);
    scale = +(processedGridSize / gridSize).toFixed(14);

    // Find the level and its divider.
    while (search && scale !== 1) {
        level = Math.pow(2, k);

        if (scale > 0.75 && scale < 1.25) {
            search = false;
        } else if (scale >= (1 / level) && scale < 2 * (1 / level)) {
            search = false;
            divider = level;
        } else if (scale <= level && scale > level / 2) {
            search = false;
            divider = 1 / level;
        }

        k++;
    }

    return (processedGridSize / divider) / scale;
};

Scatter.prototype.getRealExtremes = function (
    this: Highcharts.Series
): Highcharts.Dictionary<number> {
    var series = this,
        chart = series.chart,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        realMinX = xAxis ? xAxis.toValue(chart.plotLeft) : 0,
        realMaxX = xAxis ?
            xAxis.toValue(chart.plotLeft + chart.plotWidth) : 0,
        realMinY = yAxis ? yAxis.toValue(chart.plotTop) : 0,
        realMaxY = yAxis ?
            yAxis.toValue(chart.plotTop + chart.plotHeight) : 0;

    if (realMinX > realMaxX) {
        [realMaxX, realMinX] = [realMinX, realMaxX];
    }

    if (realMinY > realMaxY) {
        [realMaxY, realMinY] = [realMinY, realMaxY];
    }

    return {
        minX: realMinX,
        maxX: realMaxX,
        minY: realMinY,
        maxY: realMaxY
    };
};

Scatter.prototype.onDrillToCluster = function (
    this: Highcharts.Point,
    event: Highcharts.PointClickEventObject
): void {
    var point = event.point || event.target;

    point.firePointEvent('drillToCluster', event, function (
        this: Highcharts.Point,
        e: Highcharts.PointClickEventObject
    ): void {
        var point = e.point || e.target,
            series = point.series,
            xAxis = point.series.xAxis,
            yAxis = point.series.yAxis,
            chart = point.series.chart,
            clusterOptions = series.options.cluster,
            drillToCluster = (clusterOptions || {}).drillToCluster,
            offsetX, offsetY,
            sortedDataX, sortedDataY, minX, minY, maxX, maxY;

        if (drillToCluster && point.clusteredData) {
            sortedDataX = point.clusteredData.map(
                (data: Highcharts.MarkerClusterSplitDataObject): number =>
                    data.x
            ).sort((a: number, b: number): number => a - b);

            sortedDataY = point.clusteredData.map(
                (data: Highcharts.MarkerClusterSplitDataObject): number =>
                    data.y
            ).sort((a: number, b: number): number => a - b);

            minX = sortedDataX[0];
            maxX = sortedDataX[sortedDataX.length - 1];
            minY = sortedDataY[0];
            maxY = sortedDataY[sortedDataY.length - 1];

            offsetX = Math.abs((maxX - minX) * 0.1);
            offsetY = Math.abs((maxY - minY) * 0.1);

            chart.pointer.zoomX = true;
            chart.pointer.zoomY = true;

            // Swap when minus values.
            if (minX > maxX) {
                [minX, maxX] = [maxX, minX];
            }
            if (minY > maxY) {
                [minY, maxY] = [maxY, minY];
            }

            chart.zoom({
                originalEvent: e,
                xAxis: [{
                    axis: xAxis,
                    min: minX - offsetX,
                    max: maxX + offsetX
                }],
                yAxis: [{
                    axis: yAxis,
                    min: minY - offsetY,
                    max: maxY + offsetY
                }]
            });
        }
    });
};

Scatter.prototype.getClusterDistancesFromPoint = function (
    this: Highcharts.Series,
    clusters: Array<Highcharts.KmeansClusterObject>,
    pointX: number,
    pointY: number
): Array<Highcharts.Dictionary<number>> {
    var series = this,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        pointClusterDistance = [],
        j,
        distance;

    for (j = 0; j < clusters.length; j++) {
        distance = Math.sqrt(
            Math.pow(
                xAxis.toPixels(pointX) -
                xAxis.toPixels(clusters[j].posX),
                2
            ) +
            Math.pow(
                yAxis.toPixels(pointY) -
                yAxis.toPixels(clusters[j].posY),
                2
            )
        );

        pointClusterDistance.push({
            clusterIndex: j,
            distance: distance
        });
    }

    return pointClusterDistance.sort(
        (a, b): number => a.distance - b.distance
    );
};

// Point state used when animation is enabled to compare
// and bind old points with new ones.
Scatter.prototype.getPointsState = function (
    this: Highcharts.Series,
    clusteredData: Highcharts.MarkerClusterInfoObject,
    oldMarkerClusterInfo: (Highcharts.MarkerClusterInfoObject|undefined),
    dataLength: number
): Highcharts.Dictionary<Highcharts.MarkerClusterPointsState> {
    var oldDataStateArr = oldMarkerClusterInfo ?
            getDataState(oldMarkerClusterInfo, dataLength) : [],
        newDataStateArr = getDataState(clusteredData, dataLength),
        state: Highcharts.Dictionary<Highcharts.MarkerClusterPointsState> = {},
        newState,
        oldState,
        i;

    // Clear global array before populate with new ids.
    oldPointsStateId = [];

    // Build points state structure.
    clusteredData.clusters.forEach(function (
        cluster: Highcharts.ClusterAndNoiseObject
    ): void {
        state[cluster.stateId] = {
            x: cluster.x,
            y: cluster.y,
            id: cluster.stateId,
            point: cluster.point,
            parentsId: []
        };
    });

    clusteredData.noise.forEach(function (
        noise: Highcharts.ClusterAndNoiseObject
    ): void {
        state[noise.stateId] = {
            x: noise.x,
            y: noise.y,
            id: noise.stateId,
            point: noise.point,
            parentsId: []
        };
    });

    // Bind new and old state.
    for (i = 0; i < newDataStateArr.length; i++) {
        newState = newDataStateArr[i];
        oldState = oldDataStateArr[i];

        if (
            newState &&
            oldState &&
            newState.parentStateId &&
            oldState.parentStateId &&
            state[newState.parentStateId] &&
            state[newState.parentStateId].parentsId.indexOf(
                oldState.parentStateId) === -1
        ) {
            state[newState.parentStateId].parentsId.push(
                oldState.parentStateId
            );

            if (oldPointsStateId.indexOf(oldState.parentStateId) === -1) {
                oldPointsStateId.push(oldState.parentStateId);
            }
        }
    }

    return state;
};

Scatter.prototype.markerClusterAlgorithms = {
    grid: function (
        this: Highcharts.Series,
        dataX: Array<number>,
        dataY: Array<number>,
        dataIndexes: Array<number>,
        options: Highcharts.MarkerClusterLayoutAlgorithmOptions
    ): Highcharts.Dictionary<Highcharts.MarkerClusterSplitDataArray> {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            grid: Highcharts.Dictionary<
            Highcharts.MarkerClusterSplitDataArray> = {},
            gridOffset = series.getGridOffset(),
            scaledGridSize, x, y, gridX, gridY, key, i;

        // drawGridLines(series, options);

        scaledGridSize = series.getScaledGridSize(options);

        for (i = 0; i < dataX.length; i++) {
            x = xAxis.toPixels(dataX[i]) - gridOffset.plotLeft;
            y = yAxis.toPixels(dataY[i]) - gridOffset.plotTop;
            gridX = Math.floor(x / scaledGridSize);
            gridY = Math.floor(y / scaledGridSize);
            key = gridY + '-' + gridX;

            if (!grid[key]) {
                grid[key] = [];
            }

            grid[key].push({
                dataIndex: dataIndexes[i],
                x: dataX[i],
                y: dataY[i]
            });
        }

        return grid;
    },
    kmeans: function (
        this: Highcharts.Series,
        dataX: Array<number>,
        dataY: Array<number>,
        dataIndexes: Array<number>,
        options: Highcharts.MarkerClusterLayoutAlgorithmOptions
    ): Highcharts.Dictionary<Highcharts.MarkerClusterSplitDataArray> {
        var series = this,
            clusters: Array<Highcharts.KmeansClusterObject> = [],
            noise = [],
            group: Highcharts.Dictionary<
            Highcharts.MarkerClusterSplitDataArray> = {},
            pointMaxDistance = options.processedDistance ||
                clusterDefaultOptions.layoutAlgorithm.distance,
            iterations = options.iterations,
            // Max pixel difference beetwen new and old cluster position.
            maxClusterShift = 1,
            currentIteration = 0,
            repeat = true,
            pointX = 0,
            pointY = 0,
            tempPos,
            pointClusterDistance: Array<Highcharts.Dictionary<number>> = [],
            groupedData, key, i, j;

        options.processedGridSize = options.processedDistance;

        // Use grid method to get groupedData object.
        groupedData = series.markerClusterAlgorithms ?
            series.markerClusterAlgorithms.grid.call(
                series, dataX, dataY, dataIndexes, options
            ) : {};

        // Find clusters amount and its start positions
        // based on grid grouped data.
        for (key in groupedData) {
            if (groupedData[key].length > 1) {
                tempPos = getClusterPosition(groupedData[key]);

                clusters.push({
                    posX: tempPos.x,
                    posY: tempPos.y,
                    oldX: 0,
                    oldY: 0,
                    startPointsLen: groupedData[key].length,
                    points: []
                });
            }
        }

        // Start kmeans iteration process.
        while (repeat) {
            clusters.map((c): Highcharts.KmeansClusterObject => {
                c.points.length = 0;
                return c;
            });

            noise.length = 0;

            for (i = 0; i < dataX.length; i++) {
                pointX = dataX[i];
                pointY = dataY[i];

                pointClusterDistance = series.getClusterDistancesFromPoint(
                    clusters,
                    pointX,
                    pointY
                );

                if (
                    pointClusterDistance.length &&
                    pointClusterDistance[0].distance < pointMaxDistance
                ) {
                    clusters[pointClusterDistance[0].clusterIndex].points.push({
                        x: pointX,
                        y: pointY,
                        dataIndex: dataIndexes[i]
                    });
                } else {
                    noise.push({
                        x: pointX,
                        y: pointY,
                        dataIndex: dataIndexes[i]
                    });
                }
            }

            // When cluster points array has only one point the
            // point should be classified again.
            for (j = 0; j < clusters.length; j++) {
                if (clusters[j].points.length === 1) {
                    pointClusterDistance = series.getClusterDistancesFromPoint(
                        clusters,
                        clusters[j].points[0].x,
                        clusters[j].points[0].y
                    );

                    if (pointClusterDistance[1].distance < pointMaxDistance) {
                        // Add point to the next closest cluster.
                        clusters[pointClusterDistance[1].clusterIndex].points
                            .push(clusters[j].points[0]);

                        // Clear points array.
                        clusters[pointClusterDistance[0].clusterIndex]
                            .points.length = 0;
                    }
                }
            }

            // Compute a new clusters position and check if it
            // is different than the old one.
            repeat = false;

            for (j = 0; j < clusters.length; j++) {
                tempPos = getClusterPosition(clusters[j].points);

                clusters[j].oldX = clusters[j].posX;
                clusters[j].oldY = clusters[j].posY;
                clusters[j].posX = tempPos.x;
                clusters[j].posY = tempPos.y;

                // Repeat the algorithm if at least one cluster
                // is shifted more than maxClusterShift property.
                if (
                    clusters[j].posX > clusters[j].oldX + maxClusterShift ||
                    clusters[j].posX < clusters[j].oldX - maxClusterShift ||
                    clusters[j].posY > clusters[j].oldY + maxClusterShift ||
                    clusters[j].posY < clusters[j].oldY - maxClusterShift
                ) {
                    repeat = true;
                }
            }

            // If iterations property is set repeat the algorithm
            // specified amount of times.
            if (iterations) {
                repeat = currentIteration < iterations - 1;
            }

            currentIteration++;
        }

        clusters.forEach(function (cluster, i): void {
            group['cluster' + i] = cluster.points;
        });

        noise.forEach(function (noise, i): void {
            group['noise' + i] = [noise];
        });

        return group;
    },
    optimizedKmeans: function (
        this: Highcharts.Series,
        processedXData: Array<number>,
        processedYData: Array<number>,
        dataIndexes: Array<number>,
        options: Highcharts.MarkerClusterLayoutAlgorithmOptions
    ): Highcharts.Dictionary<Highcharts.MarkerClusterSplitDataArray> {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            pointMaxDistance = options.processedDistance ||
                clusterDefaultOptions.layoutAlgorithm.gridSize,
            group: Highcharts.Dictionary<
            Highcharts.MarkerClusterSplitDataArray> = {},
            extremes = series.getRealExtremes(),
            clusterMarkerOptions =
                (series.options.cluster || {}).marker,
            offset, distance, radius;

        if (!series.markerClusterInfo || (
            series.initMaxX && series.initMaxX < extremes.maxX ||
            series.initMinX && series.initMinX > extremes.minX ||
            series.initMaxY && series.initMaxY < extremes.maxY ||
            series.initMinY && series.initMinY > extremes.minY
        )) {
            series.initMaxX = extremes.maxX;
            series.initMinX = extremes.minX;
            series.initMaxY = extremes.maxY;
            series.initMinY = extremes.minY;

            group = series.markerClusterAlgorithms ?
                series.markerClusterAlgorithms.kmeans.call(
                    series,
                    processedXData,
                    processedYData,
                    dataIndexes,
                    options
                ) : {};

            series.baseClusters = null;
        } else {
            if (!series.baseClusters) {
                series.baseClusters = {
                    clusters: series.markerClusterInfo.clusters,
                    noise: series.markerClusterInfo.noise
                };
            }

            series.baseClusters.clusters.forEach(function (cluster): void {
                cluster.pointsOutside = [];
                cluster.pointsInside = [];

                cluster.data.forEach(function (dataPoint): void {

                    distance = Math.sqrt(
                        Math.pow(
                            xAxis.toPixels(dataPoint.x) -
                            xAxis.toPixels(cluster.x),
                            2
                        ) +
                        Math.pow(
                            yAxis.toPixels(dataPoint.y) -
                            yAxis.toPixels(cluster.y),
                            2
                        )
                    );

                    if (
                        cluster.clusterZone &&
                        cluster.clusterZone.marker &&
                        cluster.clusterZone.marker.radius
                    ) {
                        radius = cluster.clusterZone.marker.radius;
                    } else if (
                        clusterMarkerOptions &&
                        clusterMarkerOptions.radius
                    ) {
                        radius = clusterMarkerOptions.radius;
                    } else {
                        radius = clusterDefaultOptions.marker.radius;
                    }

                    offset = pointMaxDistance - radius >= 0 ?
                        pointMaxDistance - radius : radius;

                    if (
                        distance > radius + offset &&
                        defined(cluster.pointsOutside)
                    ) {
                        cluster.pointsOutside.push(dataPoint);
                    } else if (defined(cluster.pointsInside)) {
                        cluster.pointsInside.push(dataPoint);
                    }
                });

                if (cluster.pointsInside.length) {
                    group[cluster.id] = cluster.pointsInside;
                }

                cluster.pointsOutside.forEach(function (p, i): void {
                    group[cluster.id + '_noise' + i] = [p];
                });
            });

            series.baseClusters.noise.forEach(function (noise): void {
                group[noise.id] = noise.data;
            });
        }

        return group;
    }
};

Scatter.prototype.preventClusterCollisions = function (
    this: Highcharts.Series,
    props: Highcharts.MarkerClusterPreventCollisionObject
): Highcharts.PositionObject {
    var series = this,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        [gridY, gridX] = props.key.split('-').map(parseFloat),
        gridSize = props.gridSize,
        groupedData = props.groupedData,
        defaultRadius = props.defaultRadius,
        clusterRadius = props.clusterRadius,
        gridXPx = gridX * gridSize,
        gridYPx = gridY * gridSize,
        xPixel = xAxis.toPixels(props.x),
        yPixel = yAxis.toPixels(props.y),
        gridsToCheckCollision = [],
        pointsLen = 0,
        radius = 0,
        clusterMarkerOptions =
            (series.options.cluster || {}).marker,
        zoneOptions = (series.options.cluster || {}).zones,
        gridOffset = series.getGridOffset(),
        nextXPixel,
        nextYPixel,
        signX,
        signY,
        cornerGridX,
        cornerGridY,
        i,
        j,
        itemX,
        itemY,
        nextClusterPos,
        maxDist,
        keys,
        x,
        y;

    // Distance to the grid start.
    xPixel -= gridOffset.plotLeft;
    yPixel -= gridOffset.plotTop;

    for (i = 1; i < 5; i++) {
        signX = i % 2 ? -1 : 1;
        signY = i < 3 ? -1 : 1;

        cornerGridX = Math.floor(
            (xPixel + signX * clusterRadius) / gridSize
        );
        cornerGridY = Math.floor(
            (yPixel + signY * clusterRadius) / gridSize
        );

        keys = [
            cornerGridY + '-' + cornerGridX,
            cornerGridY + '-' + gridX,
            gridY + '-' + cornerGridX
        ];

        for (j = 0; j < keys.length; j++) {
            if (
                gridsToCheckCollision.indexOf(keys[j]) === -1 &&
                keys[j] !== props.key
            ) {
                gridsToCheckCollision.push(keys[j]);
            }
        }
    }

    gridsToCheckCollision.forEach(function (
        item: string
    ): void {
        if (groupedData[item]) {
            // Cluster or noise position is already computed.
            if (!groupedData[item].posX) {
                nextClusterPos = getClusterPosition(
                    groupedData[item]
                );

                groupedData[item].posX = nextClusterPos.x;
                groupedData[item].posY = nextClusterPos.y;
            }

            nextXPixel = xAxis.toPixels(groupedData[item].posX || 0) -
                gridOffset.plotLeft;

            nextYPixel = yAxis.toPixels(groupedData[item].posY || 0) -
                gridOffset.plotTop;

            [itemY, itemX] = item.split('-').map(parseFloat);

            if (zoneOptions) {
                pointsLen = groupedData[item].length;

                for (i = 0; i < zoneOptions.length; i++) {
                    if (
                        pointsLen >= zoneOptions[i].from &&
                        pointsLen <= zoneOptions[i].to
                    ) {
                        if (defined((zoneOptions[i].marker || {}).radius)) {
                            radius = zoneOptions[i].marker.radius || 0;
                        } else if (
                            clusterMarkerOptions &&
                            clusterMarkerOptions.radius
                        ) {
                            radius = clusterMarkerOptions.radius;
                        } else {
                            radius = clusterDefaultOptions.marker.radius;
                        }
                    }
                }
            }

            if (
                groupedData[item].length > 1 &&
                radius === 0 &&
                clusterMarkerOptions &&
                clusterMarkerOptions.radius
            ) {
                radius = clusterMarkerOptions.radius;
            } else if (groupedData[item].length === 1) {
                radius = defaultRadius;
            }

            maxDist = clusterRadius + radius;
            radius = 0;

            if (
                itemX !== gridX &&
                Math.abs(xPixel - nextXPixel) < maxDist
            ) {
                xPixel = itemX - gridX < 0 ? gridXPx + clusterRadius :
                    gridXPx + gridSize - clusterRadius;
            }

            if (
                itemY !== gridY &&
                Math.abs(yPixel - nextYPixel) < maxDist
            ) {
                yPixel = itemY - gridY < 0 ? gridYPx + clusterRadius :
                    gridYPx + gridSize - clusterRadius;
            }
        }
    });

    x = xAxis.toValue(xPixel + gridOffset.plotLeft);
    y = yAxis.toValue(yPixel + gridOffset.plotTop);

    groupedData[props.key].posX = x;
    groupedData[props.key].posY = y;

    return { x, y };
};

// Check if user algorithm result is valid groupedDataObject.
Scatter.prototype.isValidGroupedDataObject = function (
    this: Highcharts.Series,
    groupedData: Highcharts.Dictionary<Highcharts.MarkerClusterSplitDataArray>
): boolean {
    var result = false,
        i;

    if (!isObject(groupedData)) {
        return false;
    }

    objectEach(groupedData, function (
        elem: Highcharts.MarkerClusterSplitDataArray
    ): void {
        result = true;

        if (!isArray(elem) || !elem.length) {
            result = false;
            return;
        }

        for (i = 0; i < elem.length; i++) {
            if (!isObject(elem[i]) || (!elem[i].x || !elem[i].y)) {
                result = false;
                return;
            }
        }
    });

    return result;
};

Scatter.prototype.getClusteredData = function (
    this: Highcharts.Series,
    groupedData: Highcharts.Dictionary<Highcharts.MarkerClusterSplitDataArray>,
    options: Highcharts.MarkerClusterOptions
): (Highcharts.MarkerClusterInfoObject | boolean) {
    var series = this,
        groupedXData = [],
        groupedYData = [],
        clusters = [], // Container for clusters.
        noise = [], // Container for points not belonging to any cluster.
        groupMap = [],
        index = 0,

        // Prevent minimumClusterSize lower than 2.
        minimumClusterSize = Math.max(2, options.minimumClusterSize || 2),
        stateId,
        point,
        points,
        pointUserOptions,
        pointsLen,
        marker,
        clusterPos,
        pointOptions,
        clusterTempPos,
        zoneOptions,
        clusterZone,
        clusterZoneClassName,
        i,
        k;

    // Check if groupedData is valid when user uses a custom algorithm.
    if (
        isFunction(options.layoutAlgorithm.type) &&
        !series.isValidGroupedDataObject(groupedData)
    ) {
        error(
            'Highcharts marker-clusters module: ' +
            'The custom algorithm result is not valid!',
            false,
            series.chart
        );

        return false;
    }

    for (k in groupedData) {
        if (groupedData[k].length >= minimumClusterSize) {

            points = groupedData[k];
            stateId = getStateId();
            pointsLen = points.length;

            // Get zone options for cluster.
            if (options.zones) {
                for (i = 0; i < options.zones.length; i++) {
                    if (
                        pointsLen >= options.zones[i].from &&
                        pointsLen <= options.zones[i].to
                    ) {
                        clusterZone = options.zones[i];
                        clusterZone.zoneIndex = i;
                        zoneOptions = options.zones[i].marker;
                        clusterZoneClassName = options.zones[i].className;
                    }
                }
            }

            clusterTempPos = getClusterPosition(points);

            if (
                options.layoutAlgorithm.type === 'grid' &&
                !options.allowOverlap
            ) {
                marker = series.options.marker || {};

                clusterPos = series.preventClusterCollisions({
                    x: clusterTempPos.x,
                    y: clusterTempPos.y,
                    key: k,
                    groupedData: groupedData,
                    gridSize: series.getScaledGridSize(
                        options.layoutAlgorithm
                    ),
                    defaultRadius: marker.radius || 3 + (marker.lineWidth || 0),
                    clusterRadius: (zoneOptions && zoneOptions.radius) ?
                        zoneOptions.radius :
                        (options.marker || {}).radius ||
                            clusterDefaultOptions.marker.radius
                });
            } else {
                clusterPos = {
                    x: clusterTempPos.x,
                    y: clusterTempPos.y
                };
            }

            for (i = 0; i < pointsLen; i++) {
                points[i].parentStateId = stateId;
            }

            clusters.push({
                x: clusterPos.x,
                y: clusterPos.y,
                id: k,
                stateId: stateId,
                index: index,
                data: points,
                clusterZone: clusterZone,
                clusterZoneClassName: clusterZoneClassName
            });

            groupedXData.push(clusterPos.x);
            groupedYData.push(clusterPos.y);

            groupMap.push({
                options: {
                    formatPrefix: 'cluster',
                    dataLabels: options.dataLabels,
                    marker: merge(options.marker, {
                        states: options.states
                    }, zoneOptions || {})
                }
            });

            // Save cluster data points options.
            if (series.options.data && series.options.data.length) {
                for (i = 0; i < pointsLen; i++) {
                    if (isObject(series.options.data[points[i].dataIndex])) {
                        points[i].options =
                            series.options.data[points[i].dataIndex];
                    }
                }
            }

            index++;
            zoneOptions = null;
        } else {
            for (i = 0; i < groupedData[k].length; i++) {
                // Points not belonging to any cluster.
                point = groupedData[k][i];
                stateId = getStateId();
                pointOptions = null;
                pointUserOptions =
                    ((series.options || {}).data || [])[point.dataIndex];
                groupedXData.push(point.x);
                groupedYData.push(point.y);

                point.parentStateId = stateId;

                noise.push({
                    x: point.x,
                    y: point.y,
                    id: k,
                    stateId: stateId,
                    index: index,
                    data: groupedData[k]
                });

                if (
                    pointUserOptions &&
                    typeof pointUserOptions === 'object' &&
                    !isArray(pointUserOptions)
                ) {
                    pointOptions = merge(
                        pointUserOptions,
                        { x: point.x, y: point.y }
                    );
                } else {
                    pointOptions = {
                        userOptions: pointUserOptions,
                        x: point.x,
                        y: point.y
                    };
                }

                groupMap.push({ options: pointOptions });
                index++;
            }
        }
    }

    return {
        clusters: clusters,
        noise: noise,
        groupedXData: groupedXData,
        groupedYData: groupedYData,
        groupMap: groupMap
    };
};


// Destroy clustered data points.
Scatter.prototype.destroyClusteredData = function (
    this: Highcharts.Series
): void {
    var clusteredSeriesData = this.markerClusterSeriesData;

    // Clear previous groups.
    (clusteredSeriesData || []).forEach(function (
        point: (Highcharts.Point | null)
    ): void {
        if (point && point.destroy) {
            point.destroy();
        }
    });

    this.markerClusterSeriesData = null;
};

// Hide clustered data points.
Scatter.prototype.hideClusteredData = function (
    this: Highcharts.Series
): void {
    var series = this,
        clusteredSeriesData = this.markerClusterSeriesData,
        oldState =
            ((series.markerClusterInfo || {}).pointsState || {}).oldState || {},
        oldPointsId = oldPointsStateId.map((elem): string =>
            (oldState[elem].point || {}).id || ''
        );

    (clusteredSeriesData || []).forEach(function (
        point: (Highcharts.Point | null)
    ): void {
        // If an old point is used in animation hide it, otherwise destroy.
        if (
            point &&
            oldPointsId.indexOf(point.id) !== -1
        ) {
            if (point.graphic) {
                point.graphic.hide();
            }

            if (point.dataLabel) {
                point.dataLabel.hide();
            }
        } else {
            if (point && point.destroy) {
                point.destroy();
            }
        }
    });
};

// Override the generatePoints method by adding a reference to grouped data.
Scatter.prototype.generatePoints = function (
    this: Highcharts.Series
): void {
    var series = this,
        chart = series.chart,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        clusterOptions = series.options.cluster,
        realExtremes = series.getRealExtremes(),
        visibleXData = [],
        visibleYData = [],
        visibleDataIndexes = [],
        oldPointsState,
        oldDataLen,
        oldMarkerClusterInfo,
        kmeansThreshold,
        cropDataOffsetX,
        cropDataOffsetY,
        seriesMinX,
        seriesMaxX,
        seriesMinY,
        seriesMaxY,
        type,
        algorithm,
        clusteredData,
        groupedData,
        layoutAlgOptions,
        point,
        i;

    if (
        clusterOptions &&
        clusterOptions.enabled &&
        series.xData &&
        series.yData &&
        !chart.polar
    ) {
        type = clusterOptions.layoutAlgorithm.type;
        layoutAlgOptions = clusterOptions.layoutAlgorithm;

        // Get processed algorithm properties.
        layoutAlgOptions.processedGridSize = relativeLength(
            layoutAlgOptions.gridSize ||
                clusterDefaultOptions.layoutAlgorithm.gridSize,
            chart.plotWidth
        );

        layoutAlgOptions.processedDistance = relativeLength(
            layoutAlgOptions.distance ||
                clusterDefaultOptions.layoutAlgorithm.distance,
            chart.plotWidth
        );

        kmeansThreshold = layoutAlgOptions.kmeansThreshold ||
            clusterDefaultOptions.layoutAlgorithm.kmeansThreshold;

        // Offset to prevent cluster size changes.
        cropDataOffsetX = Math.abs(
            xAxis.toValue(layoutAlgOptions.processedGridSize / 2) -
            xAxis.toValue(0)
        );
        cropDataOffsetY = Math.abs(
            yAxis.toValue(layoutAlgOptions.processedGridSize / 2) -
            yAxis.toValue(0)
        );

        // Get only visible data.
        for (i = 0; i < series.xData.length; i++) {
            if (!series.dataMaxX) {
                if (
                    !defined(seriesMaxX) ||
                    !defined(seriesMinX) ||
                    !defined(seriesMaxY) ||
                    !defined(seriesMinY)
                ) {
                    seriesMaxX = seriesMinX = series.xData[i];
                    seriesMaxY = seriesMinY = series.yData[i];
                } else if (
                    isNumber(series.yData[i]) &&
                    isNumber(seriesMaxY) &&
                    isNumber(seriesMinY)
                ) {
                    seriesMaxX = Math.max(series.xData[i], seriesMaxX);
                    seriesMinX = Math.min(series.xData[i], seriesMinX);
                    seriesMaxY = Math.max(
                        (series.yData[i] as any) || seriesMaxY, seriesMaxY
                    );
                    seriesMinY = Math.min(
                        (series.yData[i] as any) || seriesMinY, seriesMinY
                    );
                }
            }

            // Crop data to visible ones with appropriate offset to prevent
            // cluster size changes on the edge of the plot area.
            if (
                series.xData[i] >= (realExtremes.minX - cropDataOffsetX) &&
                series.xData[i] <= (realExtremes.maxX + cropDataOffsetX) &&
                (series.yData[i] || realExtremes.minY) >=
                    (realExtremes.minY - cropDataOffsetY) &&
                (series.yData[i] || realExtremes.maxY) <=
                    (realExtremes.maxY + cropDataOffsetY)
            ) {
                visibleXData.push(series.xData[i]);
                visibleYData.push(series.yData[i]);
                visibleDataIndexes.push(i);
            }
        }

        // Save data max values.
        if (
            defined(seriesMaxX) && defined(seriesMinX) &&
            isNumber(seriesMaxY) && isNumber(seriesMinY)
        ) {
            series.dataMaxX = seriesMaxX;
            series.dataMinX = seriesMinX;
            series.dataMaxY = seriesMaxY;
            series.dataMinY = seriesMinY;
        }

        if (isFunction(type)) {
            algorithm = type;
        } else if (series.markerClusterAlgorithms) {
            if (type && series.markerClusterAlgorithms[type]) {
                algorithm = series.markerClusterAlgorithms[type];
            } else {
                algorithm = visibleXData.length < kmeansThreshold ?
                    series.markerClusterAlgorithms.kmeans :
                    series.markerClusterAlgorithms.grid;
            }
        } else {
            algorithm = function (): boolean {
                return false;
            };
        }

        groupedData = algorithm.call(
            this,
            visibleXData,
            visibleYData,
            visibleDataIndexes,
            layoutAlgOptions
        );

        clusteredData = groupedData ? series.getClusteredData(
            groupedData, clusterOptions
        ) : groupedData;

        // When animation is enabled get old points state.
        if (
            clusterOptions.animation &&
            series.markerClusterInfo &&
            series.markerClusterInfo.pointsState &&
            series.markerClusterInfo.pointsState.oldState
        ) {
            // Destroy old points.
            destroyOldPoints(series.markerClusterInfo.pointsState.oldState);

            oldPointsState = series.markerClusterInfo.pointsState.newState;
        } else {
            oldPointsState = {};
        }

        // Save points old state info.
        oldDataLen = series.xData.length;
        oldMarkerClusterInfo = series.markerClusterInfo;

        if (clusteredData) {
            series.processedXData = clusteredData.groupedXData;
            series.processedYData = clusteredData.groupedYData;

            series.hasGroupedData = true;
            series.markerClusterInfo = clusteredData;
            series.groupMap = clusteredData.groupMap;
        }

        baseGeneratePoints.apply(this);

        if (clusteredData && series.markerClusterInfo) {
            // Mark cluster points. Safe point reference in the cluster object.
            (series.markerClusterInfo.clusters || []).forEach(function (
                cluster: Highcharts.ClusterAndNoiseObject
            ): void {
                point = series.points[cluster.index];
                point.isCluster = true;
                point.clusteredData = cluster.data;
                point.clusterPointsAmount = cluster.data.length;
                cluster.point = point;

                // Add zoom to cluster range.
                addEvent(point, 'click', series.onDrillToCluster);
            });

            // Safe point reference in the noise object.
            (series.markerClusterInfo.noise || []).forEach(function (
                noise: Highcharts.ClusterAndNoiseObject
            ): void {
                noise.point = series.points[noise.index];
            });

            // When animation is enabled save points state.
            if (
                clusterOptions.animation &&
                series.markerClusterInfo
            ) {
                series.markerClusterInfo.pointsState = {
                    oldState: oldPointsState,
                    newState: series.getPointsState(
                        clusteredData, oldMarkerClusterInfo, oldDataLen
                    )
                };
            }

            // Record grouped data in order to let it be destroyed the next time
            // processData runs.
            if (!clusterOptions.animation) {
                this.destroyClusteredData();
            } else {
                this.hideClusteredData();
            }

            this.markerClusterSeriesData =
                this.hasGroupedData ? this.points : null;
        }
    } else {
        baseGeneratePoints.apply(this);
    }
};

// Handle animation.
addEvent(H.Chart, 'render', function (
    this: Highcharts.Chart
): void {
    var chart = this;

    (chart.series || []).forEach(function (
        series: Highcharts.Series
    ): void {
        if (series.markerClusterInfo) {
            var options = series.options.cluster,
                pointsState = (series.markerClusterInfo || {}).pointsState,
                oldState = (pointsState || {}).oldState;

            if (
                (options || {}).animation &&
                series.markerClusterInfo &&
                series.chart.pointer.pinchDown.length === 0 &&
                (series.xAxis.eventArgs || {}).trigger !== 'pan' &&
                oldState &&
                Object.keys(oldState).length
            ) {
                series.markerClusterInfo.clusters.forEach(
                    function (cluster): void {
                        series.animateClusterPoint(cluster);
                    }
                );

                series.markerClusterInfo.noise.forEach(function (noise): void {
                    series.animateClusterPoint(noise);
                });
            }
        }
    });
});

// Override point prototype to throw a warning when trying to update
// clustered point.
addEvent(Point, 'update', function (
    this: Highcharts.Point
): (boolean | void) {
    if (this.dataGroup) {
        error(
            'Highcharts marker-clusters module: ' +
            'Running `Point.update` when point belongs to clustered series' +
            ' is not supported.',
            false,
            this.series.chart
        );
        return false;
    }
});

// Destroy grouped data on series destroy.
addEvent(Series, 'destroy', Scatter.prototype.destroyClusteredData);

// Add classes, change mouse cursor.
addEvent(Series, 'afterRender', function (
    this: Highcharts.Series
): void {
    var series = this,
        clusterZoomEnabled = (series.options.cluster || {}).drillToCluster;

    if (series.markerClusterInfo && series.markerClusterInfo.clusters) {
        series.markerClusterInfo.clusters.forEach(function (
            cluster: Highcharts.ClusterAndNoiseObject
        ): void {
            if (cluster.point && cluster.point.graphic) {
                cluster.point.graphic.addClass('highcharts-cluster-point');

                // Change cursor to pointer when drillToCluster is enabled.
                if (clusterZoomEnabled && cluster.point) {
                    cluster.point.graphic.css({
                        cursor: 'pointer'
                    });

                    if (cluster.point.dataLabel) {
                        cluster.point.dataLabel.css({
                            cursor: 'pointer'
                        });
                    }
                }

                if (defined(cluster.clusterZone)) {
                    cluster.point.graphic.addClass(
                        cluster.clusterZoneClassName ||
                        'highcharts-cluster-zone-' +
                        cluster.clusterZone.zoneIndex
                    );
                }
            }
        });
    }
});

addEvent(H.Point, 'drillToCluster', function (
    this: Highcharts.Point,
    event: Highcharts.PointClickEventObject
): void {
    var point = event.point || event.target,
        series = point.series,
        clusterOptions = series.options.cluster,
        onDrillToCluster =
            ((clusterOptions || {}).events || {}).drillToCluster;

    if (isFunction(onDrillToCluster)) {
        onDrillToCluster.call(this, event);
    }
});

// Destroy the old tooltip after zoom.
addEvent(H.Axis, 'setExtremes', function (
    this: Highcharts.Axis
): void {
    var chart = this.chart,
        animationDuration = 0,
        animation;

    chart.series.forEach(function (series): void {
        if (series.markerClusterInfo) {
            animation = animObject((series.options.cluster || {}).animation);
            animationDuration = animation.duration || 0;
        }
    });

    syncTimeout(function (): void {
        if (chart.tooltip) {
            chart.tooltip.destroy();
        }
    }, animationDuration);
});
