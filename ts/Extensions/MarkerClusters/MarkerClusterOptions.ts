/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Wojciech Chmiel
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type {
    PointClickEvent,
    PointMarkerOptions,
    PointMarkerStateHoverOptions,
    PointMarkerStatesOptions
} from '../../Core/Series/PointOptions';
import type { StateGenericOptions } from '../../Core/Series/StatesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Series/Scatter/ScatterSeriesOptions' {
    interface ScatterSeriesOptions {
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
         * @requires     modules/marker-clusters
         */
        cluster?: MarkerClusterOptions;
    }
}

declare module '../../Core/TooltipOptions' {
    interface TooltipOptions {
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
         * @default   Clustered points: {point.clusterPointsAmount}
         * @requires  modules/marker-clusters
         */
        clusterFormat?: string;
    }
}

export type MarkerClusterAlgorithmValue = ('grid'|'kmeans'|'optimizedKmeans');

/**
 * Function callback when a cluster is clicked.
 *
 * @callback Highcharts.MarkerClusterDrillCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        The point where the event occurred.
 *
 * @param {Highcharts.PointClickEventObject} event
 *        Event arguments.
 */
export interface MarkerClusterDrillCallbackFunction {
    (this: Point, event: PointClickEvent): void;
}

export interface MarkerClusterEventsOptions {
    /**
     * Fires when the cluster point is clicked and `drillToCluster` is enabled.
     * One parameter, `event`, is passed to the function. The default action
     * is to zoom to the cluster points range. This can be prevented
     * by calling `event.preventDefault()`.
     *
     * @product   highcharts highmaps
     * @see [cluster.drillToCluster](#plotOptions.scatter.cluster.drillToCluster)
     * @requires  modules/marker-clusters
     */
    drillToCluster: MarkerClusterDrillCallbackFunction;
}

export interface MarkerClusterLayoutAlgorithmOptions {
    /**
     * When `type` is set to `kmeans`,
     * `distance` is a maximum distance between point and cluster center
     * so that this point will be inside the cluster. The distance
     * is either a number defining pixels or a percentage
     * defining a percentage of the plot area width.
     *
     * @default 40
     * @requires modules/marker-clusters
     */
    distance: number|string;

    /**
     * When `type` is set to the `grid`,
     * `gridSize` is a size of a grid square element either as a number
     * defining pixels, or a percentage defining a percentage
     * of the plot area width.
     *
     * @default 50
     * @requires modules/marker-clusters
     */
    gridSize: number|string;

    /**
     * When `type` is set to `kmeans`,
     * `iterations` are the number of iterations that this algorithm will be
     * repeated to find clusters positions.
     *
     * @requires modules/marker-clusters
     */
    iterations?: number;

    /**
     * When `type` is set to `undefined` and there are more visible points
     * than the kmeansThreshold the `grid` algorithm is used to find
     * clusters, otherwise `kmeans`. It ensures good performance on
     * large datasets and better clusters arrangement after the zoom.
     *
     * @default 100
     * @requires modules/marker-clusters
     */
    kmeansThreshold: number;

    /** @internal */
    processedDistance?: number;

    /** @internal */
    processedGridSize?: number;

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
     * @see [cluster.minimumClusterSize](#plotOptions.scatter.cluster.minimumClusterSize)
     * @requires modules/marker-clusters
     */
    type?: (MarkerClusterAlgorithmValue | Function);
}

export interface MarkerClusterMarkerOptions extends PointMarkerOptions {
    lineWidth: number;
    radius: number;
}

export interface MarkerClusterStateHoverOptions extends PointMarkerStateHoverOptions {
    /**
     * The fill color of the cluster marker in hover state. When
     * `undefined`, the series' or point's fillColor for normal
     * state is used.
     *
     * @requires modules/marker-clusters
     */
    fillColor?: PointMarkerStateHoverOptions['fillColor'];
}

export interface MarkerClusterStatesOptions
    extends PointMarkerStatesOptions<MarkerClusterOptions> {
    hover?: MarkerClusterStateHoverOptions &
        StateGenericOptions<MarkerClusterOptions>;
}

export interface MarkerClusterOptions {
    /**
     * When set to `false` prevent cluster overlapping - this option
     * works only when `layoutAlgorithm.type = "grid"`.
     *
     * @sample highcharts/marker-clusters/grid
     *         Prevent overlapping
     *
     * @default true
     * @requires modules/marker-clusters
     */
    allowOverlap?: boolean;

    /**
     * Options for the cluster marker animation.
     * @default { "duration": 500 }
     * @requires modules/marker-clusters
     */
    animation?: (boolean|Partial<AnimationOptions>);

    /**
     * Options for the cluster data labels.
     *
     * @default {"enabled": true, "format": "{point.clusterPointsAmount}", "verticalAlign": "middle", "align": "center", "style": { "color": "contrast" }, "inside": true}
     * @requires modules/marker-clusters
     */
    dataLabels?: DataLabelOptions;

    /**
     * Zoom the plot area to the cluster points range when a cluster is clicked.
     *
     * @default true
     * @requires modules/marker-clusters
     */
    drillToCluster?: boolean;

    /**
     * Whether to enable the marker-clusters module.
     *
     * @sample maps/marker-clusters/basic
     *         Maps marker clusters
     * @sample highcharts/marker-clusters/basic
     *         Scatter marker clusters
     *
     * @default false
     * @requires modules/marker-clusters
     */
    enabled?: boolean;

    /**
     * Event callbacks for marker clusters.
     *
     * @requires modules/marker-clusters
     */
    events?: MarkerClusterEventsOptions;

    /**
     * Options for layout algorithm. Inside there
     * are options to change the type of the algorithm, gridSize,
     * distance or iterations.
     *
     * @default {"gridSize": 50, "distance": 40, "kmeansThreshold": 100}
     * @requires modules/marker-clusters
     */
    layoutAlgorithm: MarkerClusterLayoutAlgorithmOptions;

    /**
     * Options for the cluster marker.
     * @extends   plotOptions.series.marker
     * @excluding enabledThreshold, states
     *
     * @default {"symbol": "cluster", "radius": 15, "lineWidth": 0, "lineColor": "${palette.backgroundColor}"}
     * @requires modules/marker-clusters
     */
    marker: MarkerClusterMarkerOptions;

    /**
     * The minimum amount of points to be combined into a cluster.
     * This value has to be greater or equal to 2.
     *
     * @sample highcharts/marker-clusters/basic
     *         At least three points in the cluster
     *
     * @default 2
     * @requires modules/marker-clusters
     */
    minimumClusterSize?: number;

    /**
     * Options for cluster states.
     *
     * @requires modules/marker-clusters
     */
    states?: MarkerClusterStatesOptions;

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
     * @product   highcharts highmaps
     * @requires  modules/marker-clusters
     */
    zones?: Array<MarkerClusterZonesOptions>;
}

export interface MarkerClusterZonesOptions {
    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/
     *         Zones styled by class name
     *
     * @requires  modules/marker-clusters
     */
    className?: string;

    /**
     * The value where the zone starts.
     *
     * @product   highcharts highmaps
     * @requires  modules/marker-clusters
     */
    from: number;

    /**
     * Settings for the cluster marker belonging to the zone.
     *
     * @see [cluster.marker](#plotOptions.scatter.cluster.marker)
     * @extends   plotOptions.scatter.cluster.marker
     * @product   highcharts highmaps
     * @requires  modules/marker-clusters
     */
    marker: PointMarkerOptions;

    /**
     * The value where the zone ends.
     *
     * @product   highcharts highmaps
     * @requires  modules/marker-clusters
     */
    to: number;

    /** @internal */
    zoneIndex: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MarkerClusterOptions;
