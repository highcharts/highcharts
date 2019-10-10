/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  Author: Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './../parts/Globals.js';
import U from './../parts/Utilities.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type ClusterAlgorithms = (
            'grid'|'kmeans'|'optimizedKmeans'
        );
        interface LayoutAlgorithmOptions {
            type: (ClusterAlgorithms | Function);
            gridSize: (number | string);
            processedGridSize: number;
            distance: (number | string);
            processedDistance: number;
            iterations?: number;
            kmeansThreshold?: number;
        }
        interface StyleOptions {
            symbol: string;
            fillColor: ColorType;
            lineColor: ColorType;
            lineWidth: number;
            radius: number;
        }
        interface GridOffsetObject {
            plotLeft: number;
            plotTop: number;
        }
        interface SortedKmeansClusterObject {
            clusterIndex: number;
            distance: number;
        }
        interface RealExtremesObject {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        }
        interface ClusterZonesOptions {
            from: number;
            to: number;
            style: StyleOptions;
            zoneIndex: number;
            className?: string;
        }
        interface OnDrillToClusterCallbackFunction {
            (this: Point, event: PointClickEventObject): void;
        }
        interface ClusterEventsDictionary {
            onDrillToCluster: OnDrillToClusterCallbackFunction;
        }
        interface MarkerClusterOptions {
            enabled?: boolean;
            allowOverlap?: boolean;
            minimumClusterSize?: number;
            drillToCluster?: boolean;
            layoutAlgorithm: LayoutAlgorithmOptions;
            style?: StyleOptions;
            dataLabels?: DataLabelsOptionsObject;
            zones?: Array<ClusterZonesOptions>;
            states?: PointStatesOptionsObject;
            events?: ClusterEventsDictionary;
        }
        interface PointMarkerOptionsObject {
            cluster?: MarkerClusterOptions;
        }
        interface PointOptionsObject {
            lat?: number;
            lon?: number;
        }
        interface SplittedDataObject {
            index: number;
            x: number;
            y: number;
            options?: (string | number | PointOptionsObject |
            (string | number)[] | null);
        }
        interface SplittedDataArray extends Array<SplittedDataObject> {
            posX?: number;
            posY?: number;
        }
        interface SplittedData {
            [key: string]: SplittedDataArray;
        }
        interface PointPositionObject {
            x: number;
            y: number;
        }
        interface PointClusterDistanceObject {
            clusterIndex: number;
            distance: number;
        }
        interface KmeansClusterObject {
            posX: number;
            posY: number;
            oldX: number;
            oldY: number;
            startPointsLen: number;
            points: Array<SplittedDataObject>;
        }
        interface ClusterAlgorithmsDictionary
            extends Dictionary<Function>
        {
            grid(
                processedXData: Array<number>,
                processedYData: Array<number>,
                visibleDataIndexes: Array<number>,
                options: LayoutAlgorithmOptions
            ): SplittedData;
            kmeans(
                processedXData: Array<number>,
                processedYData: Array<number>,
                visibleDataIndexes: Array<number>,
                options: LayoutAlgorithmOptions
            ): SplittedData;
            optimizedKmeans(
                processedXData: Array<number>,
                processedYData: Array<number>,
                visibleDataIndexes: Array<number>,
                options: LayoutAlgorithmOptions
            ): SplittedData;
        }
        interface PreventClusterCollisionsProps {
            x: number;
            y: number;
            key: string;
            groupedData: SplittedData;
            gridSize: number;
            defaultRadius: number;
            clusterRadius: number;
        }
        interface ClusterAndNoiseObject {
            data: Array<SplittedDataObject>;
            id: string;
            index: number;
            x: number;
            y: number;
            point?: Point;
            clusterZone?: ClusterZonesOptions;
            clusterZoneClassName?: string;
            pointsOutside?: Array<SplittedDataObject>;
            pointsInside?: Array<SplittedDataObject>;
        }
        interface GroupMapOptionsObject extends SeriesOptionsType {
            formatPrefix?: string;
            userOptions?: string | number |
            PointOptionsObject | (string | number)[] | null;
            x?: number;
            y?: number;
        }
        interface GroupMapObject {
            options?: GroupMapOptionsObject;
        }
        interface ClusteredDataObject {
            clusterElements: Array<ClusterAndNoiseObject>;
            noiseElements: Array<ClusterAndNoiseObject>;
            groupedXData: Array<number>;
            groupedYData: Array<number>;
            groupMap: Array<GroupMapObject>;
            initMinX?: number;
            initMaxX?: number;
            initMinY?: number;
            initMaxY?: number;
        }
        interface BaseClustersObject {
            clusters: Array<ClusterAndNoiseObject>;
            noise: Array<ClusterAndNoiseObject>;
        }
        interface Point {
            isCluster?: boolean;
            clusteredData?: Array<SplittedDataObject>;
            clusterPointsAmount?: number;
        }
        interface Series {
            clusters?: ClusteredDataObject;
            clusterAlgorithms?: ClusterAlgorithmsDictionary;
            clusteredSeriesData?: (Array<Point|null>|null);
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
            getRealExtremes(): RealExtremesObject;
            getGridOffset(): GridOffsetObject;
            onDrillToCluster(
                event: PointClickEventObject
            ): void;
            getClusterDistancesFromPoint(
                clusters: Array<Highcharts.KmeansClusterObject>,
                pointX: number,
                pointY: number
            ): Array<SortedKmeansClusterObject>;
            getScaledGridSize(
                options: Highcharts.LayoutAlgorithmOptions
            ): number;
            preventClusterCollisions(
                props: PreventClusterCollisionsProps
            ): PointPositionObject;
            isValidGroupedDataObject(
                groupedData: SplittedData
            ): boolean;
            getClusteredData(
                groupedData: SplittedData,
                options: MarkerClusterOptions
            ): (ClusteredDataObject | boolean);
            destroyClusteredData (): void;
        }
    }
}

/* eslint-disable no-invalid-this */

import './../parts/Series.js';
import './../parts/Axis.js';
import './../parts/SvgRenderer.js';

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
    isNumber = H.isNumber,
    pick = H.pick,
    relativeLength = H.relativeLength,
    error = H.error,
    objectEach = U.objectEach,
    baseGeneratePoints = Series.prototype.generatePoints,
    clusterDefaultOptions;

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
 * @since        next
 * @optionparent plotOptions.scatter.marker.cluster
 */
clusterDefaultOptions = {
    /**
     * Whether to enable the marker-clusters module.
     *
     * @sample maps/marker-clusters/basic
     *         Maps marker clusters
     * @sample highcharts/marker-clusters/basic
     *         Scatter marker clusters
     *
     * @type      {boolean}
     * @default   false
     */
    enabled: false,
    /**
     * When set to `false` prevent cluster overlapping - this option
     * works only when `layoutAlgorithm.type = "grid"`.
     *
     * @sample highcharts/marker-clusters/grid
     *         Prevent overlapping
     *
     * @type      {boolean}
     * @default   true
     */
    allowOverlap: true,
    /**
     * Zoom the plot area to the cluster points range when cluster is clicked.
     *
     * @type      {boolean}
     * @default   true
     */
    drillToCluster: true,
    /**
     * The minimum amount of points to be combined into a cluster.
     * This value has to be greater or equal to 2.
     *
     * @sample highcharts/marker-clusters/basic
     *         At least three points in the cluster
     *
     * @type      {number}
     * @default   2
     */
    minimumClusterSize: 2,
    /**
     * Options for layout algorithm. Inside there
     * are options to change the type of the algorithm, gridSize,
     * distance or iterations.
     */
    layoutAlgorithm: {
        /* eslint-disable max-len */
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
         * and kmeansThreshold. When there are more visible points than the
         * kmeansThreshold the `grid` algorithm is used, otherwise `kmeans`.
         *
         * The custom clustering algorithm can be added by assigning a callback
         * function as the type property. This function takes an array of
         * processedXData, processedYData, processedXData indexes and
         * layoutAlgorithm options as arguments and should return an object
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
         * @optionparent plotOptions.scatter.marker.cluster.layoutAlgorithm.type
         */
        /* eslint-enable max-len */
        /**
         * When `type` is set to the `grid`,
         * `gridSize` is a size of a grid square element either as a number
         * defining pixels, or a percentage defining a percentage
         * of the plot area width.
         *
         * @type    {number|string}
         */
        gridSize: 50,
        /* eslint-disable max-len */
        /**
         * When `type` is set to `kmeans`,
         * `iterations` are the number of iterations that this algorithm will be
         * repeated to find clusters positions.
         *
         * @type    {number}
         * @optionparent plotOptions.scatter.marker.cluster.layoutAlgorithm.iterations
         */
        /* eslint-enable max-len */
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
         *
         * @type    {number}
         */
        kmeansThreshold: 100
    },
    style: {
        /**
         * A predefined shape or symbol for the cluster marker. Other
         * possible values are "circle", "square", "diamond", "triangle"
         * and "triangle-down".
         *
         * Additionally, the URL to a graphic can be given on this form:
         * "url(graphic.png)". Note that for the image to be applied to
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
         */
        symbol: 'cluster',
        /**
         * The radius of the cluster marker.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-radius/
         *         Bigger markers
         *
         * @type      {number}
         */
        radius: 15,

        /**
         * The width of the cluster marker's outline.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         2px blue marker
         */
        lineWidth: 0,

        /**
         * The fill color of the cluster marker. When `undefined`, the series'
         * or point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         White fill
         *
         * @type      {Highcharts.ColorType}
         * @optionparent plotOptions.scatter.marker.cluster.style.fillColor
         */

        /**
         * The color of the cluster marker's outline. When `undefined`, the
         * series' or point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         Inherit from series color (undefined)
         *
         * @type {Highcharts.ColorType}
         */
        lineColor: '${palette.backgroundColor}'
    },
    /**
     * Fires when the cluster point is clicked and `drillToCluster` is enabled.
     * One parameter, `event`, is passed to the function. The default action
     * is to zoom to the cluster points range. This can be prevented
     * by calling `event.preventDefault()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-legenditemclick/
     *         Confirm hiding and showing
     *
     * @type      {Highcharts.OnDrillToClusterCallbackFunction}
     * @product   highcharts highmaps
     * @see [cluster.drillToCluster](#plotOptions.scatter.marker.cluster.drillToCluster)
     * @optionparent plotOptions.scatter.marker.cluster.events.onDrillToCluster
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
     * @type      {Array<ClusterZonesOptions>}
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones
     */

    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/
     *         Zones styled by class name
     *
     * @type      {string}
     * @optionparent plotOptions.scatter.marker.cluster.zones.className
     */

    /**
     * Styles for the cluster zone.
     *
     * @see [StyleOptions](#plotOptions.scatter.marker.cluster.style)
     * @extends   plotOptions.scatter.marker.cluster.style
     * @type      {StyleOptions}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.style
     */

    /**
     * The value where the zone starts.
     *
     * @type      {number}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.from
     */

    /**
     * The value where the zone ends.
     *
     * @type      {number}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.to
     */

    /**
     * The fill color of the cluster marker in hover state. When
     * `undefined`, the series' or point's fillColor for normal
     * state is used.
     *
     * @type      {Highcharts.ColorType}
     * @optionparent plotOptions.scatter.marker.cluster.states.hover.fillColor
     *
     */

    /**
     * Options for the cluster data labels.
     * @extends   plotOptions.series.dataLabels
     * @type    {Highcharts.DataLabelsOptionsObject}
     */
    dataLabels: {
        enabled: true,
        format: '{point.clusterPointsAmount}',
        verticalAlign: 'middle',
        align: 'center'
    }
};

(H.defaultOptions.plotOptions || {}).series = merge(
    (H.defaultOptions.plotOptions || {}).series,
    {
        marker: {
            cluster: clusterDefaultOptions
        },
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
             * @type      {string}
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
    points: Array<Highcharts.PointPositionObject>
): Highcharts.PointPositionObject {
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

// Useful for debugging.
// function drawGridLines(
//     series: Highcharts.Series,
//     options: Highcharts.LayoutAlgorithmOptions
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
//         series.debugGridLines.forEach(function (gridItem) {
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

Scatter.prototype.getGridOffset = function (
    this: Highcharts.Series
): Highcharts.GridOffsetObject {
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

    return {
        plotLeft: plotLeft,
        plotTop: plotTop
    };
};

Scatter.prototype.getScaledGridSize = function (
    this: Highcharts.Series,
    options: Highcharts.LayoutAlgorithmOptions
): number {
    var series = this,
        xAxis = series.xAxis,
        search = true,
        k = 1,
        divider = 1,
        gridSize,
        scale,
        level;

    if (!series.gridValueSize) {
        series.gridValueSize = Math.abs(
            xAxis.toValue(options.processedGridSize) - xAxis.toValue(0)
        );
    }

    gridSize = xAxis.toPixels(series.gridValueSize) - xAxis.toPixels(0);
    scale = options.processedGridSize / gridSize;

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

    return (options.processedGridSize / divider) / scale;
};

Scatter.prototype.getRealExtremes = function (
    this: Highcharts.Series
): Highcharts.RealExtremesObject {
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

    point.firePointEvent('onDrillToCluster', event, function (
        this: Highcharts.Point,
        e: Highcharts.PointClickEventObject
    ): void {
        var point = e.point || e.target,
            series = point.series,
            xAxis = point.series.xAxis,
            yAxis = point.series.yAxis,
            chart = point.series.chart,
            clusterOptions = ((series.options || {}).marker || {}).cluster,
            drillToCluster = (clusterOptions || {}).drillToCluster,
            offsetX, offsetY,
            sortedDataX, sortedDataY, minX, minY, maxX, maxY;

        if (drillToCluster && point.clusteredData) {
            sortedDataX = point.clusteredData.map(
                (data: Highcharts.SplittedDataObject): number => data.x
            ).sort((a: number, b: number): number => a - b);

            sortedDataY = point.clusteredData.map(
                (data: Highcharts.SplittedDataObject): number => data.y
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
): Array<Highcharts.SortedKmeansClusterObject> {
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

Scatter.prototype.clusterAlgorithms = {
    grid: function (
        this: Highcharts.Series,
        dataX: Array<number>,
        dataY: Array<number>,
        dataIndexes: Array<number>,
        options: Highcharts.LayoutAlgorithmOptions
    ): Highcharts.SplittedData {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            grid: Highcharts.SplittedData = {},
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
                index: dataIndexes[i],
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
        options: Highcharts.LayoutAlgorithmOptions
    ): Highcharts.SplittedData {
        var series = this,
            clusters: Array<Highcharts.KmeansClusterObject> = [],
            noise = [],
            group: Highcharts.SplittedData = {},
            pointMaxDistance = options.processedDistance,
            iterations = options.iterations,
            // Max pixel difference beetwen new and old cluster position.
            maxClusterShift = 1,
            currentIteration = 0,
            repeat = true,
            pointX = 0,
            pointY = 0,
            tempPos,
            pointClusterDistance:
            Array<Highcharts.PointClusterDistanceObject> = [],
            groupedData, key, i, j;

        options.processedGridSize = options.processedDistance;

        // Use grid method to get groupedData object.
        groupedData = series.clusterAlgorithms ?
            series.clusterAlgorithms.grid.call(
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
                        index: dataIndexes[i]
                    });
                } else {
                    noise.push({
                        x: pointX,
                        y: pointY,
                        index: dataIndexes[i]
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
        options: Highcharts.LayoutAlgorithmOptions
    ): Highcharts.SplittedData {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            pointMaxDistance = options.processedDistance,
            group: Highcharts.SplittedData = {},
            extremes = series.getRealExtremes(),
            clusterStyleOptions =
                ((series.options.marker || {}).cluster || {}).style,
            offset, distance, radius;

        if (!series.clusters || (
            series.initMaxX && series.initMaxX < extremes.maxX ||
            series.initMinX && series.initMinX > extremes.minX ||
            series.initMaxY && series.initMaxY < extremes.maxY ||
            series.initMinY && series.initMinY > extremes.minY
        )) {
            series.initMaxX = extremes.maxX;
            series.initMinX = extremes.minX;
            series.initMaxY = extremes.maxY;
            series.initMinY = extremes.minY;

            group = series.clusterAlgorithms ?
                series.clusterAlgorithms.kmeans.call(
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
                    clusters: series.clusters.clusterElements,
                    noise: series.clusters.noiseElements
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
                        cluster.clusterZone.style &&
                        cluster.clusterZone.style.radius
                    ) {
                        radius = cluster.clusterZone.style.radius;
                    } else if (clusterStyleOptions) {
                        radius = clusterStyleOptions.radius;
                    } else {
                        radius = 15;
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
    props: Highcharts.PreventClusterCollisionsProps
): Highcharts.PointPositionObject {
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
        clusterStyleOptions =
            ((series.options.marker || {}).cluster || {}).style,
        zoneOptions: (Array<Highcharts.ClusterZonesOptions> | undefined),
        gridOffset = series.getGridOffset(),
        nextXPixel,
        nextYPixel,
        signX,
        signY,
        cornerGridX,
        cornerGridY,
        i,
        itemX,
        itemY,
        nextClusterPos,
        maxDist,
        x,
        y;

    if (series.options.marker && series.options.marker.cluster) {
        zoneOptions = series.options.marker.cluster.zones;
    }

    // Distance to the grid start.
    xPixel -= gridOffset.plotLeft;
    yPixel -= gridOffset.plotTop;

    if (
        xPixel >= 0 &&
        xPixel <= xAxis.len &&
        yPixel >= 0 &&
        yPixel <= yAxis.len
    ) {
        for (i = 1; i < 5; i++) {
            signX = i % 2 ? -1 : 1;
            signY = i < 3 ? -1 : 1;

            cornerGridX = Math.floor(
                (xPixel + signX * clusterRadius) / gridSize
            );
            cornerGridY = Math.floor(
                (yPixel + signY * clusterRadius) / gridSize
            );

            if (cornerGridX !== gridX || cornerGridY !== gridY) {
                gridsToCheckCollision.push(cornerGridY + '-' + cornerGridX);
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
                            if (zoneOptions[i].style.radius) {
                                radius = zoneOptions[i].style.radius;
                            } else if (clusterStyleOptions) {
                                radius = clusterStyleOptions.radius;
                            } else {
                                radius = 15;
                            }
                        }
                    }
                }

                if (
                    groupedData[item].length > 1 &&
                    radius === 0 &&
                    clusterStyleOptions
                ) {
                    radius = clusterStyleOptions.radius;
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
    }

    return {
        x: pick(x, props.x),
        y: pick(y, props.y)
    };
};

// Check if user algorithm result is valid groupedDataObject.
Scatter.prototype.isValidGroupedDataObject = function (
    this: Highcharts.Series,
    groupedData: Highcharts.SplittedData
): boolean {
    var result = false,
        i;

    if (!isObject(groupedData)) {
        return false;
    }

    objectEach(groupedData, function (
        elem: Highcharts.SplittedDataArray
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
    groupedData: Highcharts.SplittedData,
    options: Highcharts.MarkerClusterOptions
): (Highcharts.ClusteredDataObject | boolean) {
    var series = this,
        groupedXData = [],
        groupedYData = [],
        clusters = [], // Container for clusters.
        noise = [], // Container for points not belonging to any cluster.
        groupMap = [],
        index = 0,

        // Prevent minimumClusterSize lower than 2.
        minimumClusterSize = Math.max(2, options.minimumClusterSize || 2),
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
                        zoneOptions = options.zones[i].style;
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
                    gridSize: options.layoutAlgorithm.processedGridSize,
                    defaultRadius: marker.radius || 3 + (marker.lineWidth || 0),
                    clusterRadius: (zoneOptions && zoneOptions.radius) ?
                        zoneOptions.radius :
                        (options.style || {}).radius || 15
                });
            } else {
                clusterPos = {
                    x: clusterTempPos.x,
                    y: clusterTempPos.y
                };
            }

            clusters.push({
                x: clusterPos.x,
                y: clusterPos.y,
                id: k,
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
                    marker: merge(options.style, {
                        states: options.states
                    }, zoneOptions || {})
                }
            });

            // Save cluster data points options.
            if (series.options.data && series.options.data.length) {
                for (i = 0; i < pointsLen; i++) {
                    if (isObject(series.options.data[points[i].index])) {
                        points[i].options =
                            series.options.data[points[i].index];
                    }
                }
            }

            index++;
            zoneOptions = null;
        } else {
            for (i = 0; i < groupedData[k].length; i++) {
                // Points not belonging to any cluster.
                point = groupedData[k][i];
                pointOptions = null;
                pointUserOptions =
                    ((series.options || {}).data || [])[point.index];
                groupedXData.push(point.x);
                groupedYData.push(point.y);

                noise.push({
                    x: point.x,
                    y: point.y,
                    id: k,
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
        clusterElements: clusters,
        noiseElements: noise,
        groupedXData: groupedXData,
        groupedYData: groupedYData,
        groupMap: groupMap
    };
};


// Destroy clustered data points.
Scatter.prototype.destroyClusteredData = function (
    this: Highcharts.Series
): void {
    var clusteredSeriesData = this.clusteredSeriesData;

    // Clear previous groups.
    (clusteredSeriesData || []).forEach(function (
        point: (Highcharts.Point | null)
    ): void {
        if (point && point.destroy) {
            point.destroy();
        }
    });

    this.clusteredSeriesData = null;
};

// Override the generatePoints method by adding a reference to grouped data.
Scatter.prototype.generatePoints = function (
    this: Highcharts.Series
): void {
    var series = this,
        chart = series.chart,
        marker = series.options.marker,
        realExtremes = series.getRealExtremes(),
        visibleXData = [],
        visibleYData = [],
        visibleDataIndexes = [],
        kmeansThreshold,
        seriesMinX,
        seriesMaxX,
        seriesMinY,
        seriesMaxY,
        type,
        algorithm,
        clusteredData,
        groupedData,
        options,
        point,
        i;

    if (
        marker &&
        marker.cluster &&
        marker.cluster.enabled &&
        series.xData &&
        series.yData &&
        !chart.polar
    ) {
        type = marker.cluster.layoutAlgorithm.type;

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

            if (
                series.xData[i] >= realExtremes.minX &&
                series.xData[i] <= realExtremes.maxX &&
                (series.yData[i] || realExtremes.minY) >= realExtremes.minY &&
                (series.yData[i] || realExtremes.maxY) <= realExtremes.maxY
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

        options = marker.cluster.layoutAlgorithm;

        // Get processed algorithm properties.
        options.processedGridSize = relativeLength(
            options.gridSize, chart.plotWidth
        );

        options.processedDistance = relativeLength(
            options.distance, chart.plotWidth
        );

        kmeansThreshold = options.kmeansThreshold || 100;

        if (isFunction(type)) {
            algorithm = type;
        } else if (series.clusterAlgorithms) {
            if (series.clusterAlgorithms[type]) {
                algorithm = series.clusterAlgorithms[type];
            } else {
                algorithm = visibleXData.length < kmeansThreshold ?
                    series.clusterAlgorithms.kmeans :
                    series.clusterAlgorithms.grid;
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
            options
        );

        clusteredData = groupedData ? series.getClusteredData(
            groupedData, marker.cluster
        ) : groupedData;

        if (clusteredData) {
            series.processedXData = clusteredData.groupedXData;
            series.processedYData = clusteredData.groupedYData;

            series.hasGroupedData = true;
            series.clusters = clusteredData;
            series.groupMap = clusteredData.groupMap;
        }

        baseGeneratePoints.apply(this);

        if (clusteredData && series.clusters) {
            // Mark cluster points. Safe point reference in the cluster object.
            series.clusters.clusterElements.forEach(function (
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
            series.clusters.noiseElements.forEach(function (
                noise: Highcharts.ClusterAndNoiseObject
            ): void {
                noise.point = series.points[noise.index];
            });

            // Record grouped data in order to let it be destroyed the next time
            // processData runs.
            this.destroyClusteredData();
            this.clusteredSeriesData = this.hasGroupedData ? this.points : null;
        }
    } else {
        baseGeneratePoints.apply(this);
    }
};

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
        clusterZoomEnabled = (((series.options || {}).marker || {})
            .cluster || {}).drillToCluster;

    if (series.clusters && series.clusters.clusterElements) {
        series.clusters.clusterElements.forEach(function (
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

addEvent(H.Point, 'onDrillToCluster', function (
    this: Highcharts.Point,
    event: Highcharts.PointClickEventObject
): void {
    var point = event.point || event.target,
        series = point.series,
        clusterOptions =
            ((series.options || {}).marker || {}).cluster,
        onDrillToCluster =
            ((clusterOptions || {}).events || {}).onDrillToCluster;

    if (isFunction(onDrillToCluster)) {
        onDrillToCluster.call(this, event);
    }
});

// Destroy the old tooltip after zoom.
addEvent(H.Axis, 'setExtremes', function (
    this: Highcharts.Axis,
): void {
    var chart = this.chart;

    if (chart.tooltip) {
        chart.tooltip.destroy();
    }
});
