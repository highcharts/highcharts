/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Author: Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 * Imports
 *
 * */

import type MarkerClusterOptions from './MarkerClusterOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

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
const cluster: MarkerClusterOptions = {

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
     * @type    {boolean|Partial<Highcharts.AnimationOptionsObject>}
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
         * @see [cluster.minimumClusterSize](#plotOptions.scatter.cluster.minimumClusterSize)
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
     * @type      {Highcharts.PointMarkerOptionsObject}
     * @extends   plotOptions.series.marker
     * @excluding enabledThreshold, states
     */
    marker: {
        /** @internal */
        symbol: 'cluster',
        /** @internal */
        radius: 15,
        /** @internal */
        lineWidth: 0,
        /** @internal */
        lineColor: Palette.backgroundColor
    },

    /**
     * Fires when the cluster point is clicked and `drillToCluster` is enabled.
     * One parameter, `event`, is passed to the function. The default action
     * is to zoom to the cluster points range. This can be prevented
     * by calling `event.preventDefault()`.
     *
     * @type      {Highcharts.MarkerClusterDrillCallbackFunction}
     * @product   highcharts highmaps
     * @see [cluster.drillToCluster](#plotOptions.scatter.cluster.drillToCluster)
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
     * @type    {Highcharts.DataLabelsOptions}
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

const tooltip: Partial<TooltipOptions> = {

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
     * @default   Clustered points: {point.clusterPointsAmount}
     * @apioption tooltip.clusterFormat
     */
    clusterFormat: '<span>Clustered points: ' +
        '{point.clusterPointsAmount}</span><br/>'

};

/* *
 *
 *  Default Export
 *
 * */

const MarkerClusterDefaults = {
    cluster,
    tooltip
};

export default MarkerClusterDefaults;
