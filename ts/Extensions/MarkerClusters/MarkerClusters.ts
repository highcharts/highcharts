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

'use strict';

/* *
 *
 * Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type {
    MarkerClusterLayoutAlgorithmOptions,
    MarkerClusterOptions,
    MarkerClusterZonesOptions
} from './MarkerClusterOptions';
import type Options from '../../Core/Options';
import type Point from '../../Core/Series/Point';
import type {
    PointClickEvent,
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type ScatterSeriesOptions from '../../Series/Scatter/ScatterSeriesOptions';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import H from '../../Core/Globals.js';
const { composed } = H;
import MarkerClusterDefaults from './MarkerClusterDefaults.js';
import MarkerClusterScatter from './MarkerClusterScatter.js';
import { addEvent, defined, isFunction, merge, pushUnique, syncTimeout } from '../../Shared/Utilities.js';
import { error } from '../../Core/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/PointBase' {
    interface PointBase {
        isCluster?: boolean;
        clusteredData?: Array<MarkerClusterSplitDataObject>;
        clusterPointsAmount?: number;
    }
}

/** @internal */
declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        markerClusterInfo?: MarkerClusterInfoObject;
        markerClusterAlgorithms?: Record<string, MarkerClusterAlgorithmFunction>;
        markerClusterSeriesData?: (Array<Point|null>|null);
        gridValueSize?: number;
        baseClusters?: (BaseClustersObject|null);
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
        getRealExtremes(): Record<string, number>;
        /** @requires modules/marker-clusters */
        getGridOffset(): Record<string, number>;
        /** @requires modules/marker-clusters */
        animateClusterPoint(
            clusterObj: ClusterAndNoiseObject
        ): void;
        /** @requires modules/marker-clusters */
        getClusterDistancesFromPoint(
            clusters: Array<KmeansClusterObject>,
            pointX: number,
            pointY: number
        ): Array<Record<string, number>>;
        /** @requires modules/marker-clusters */
        getScaledGridSize(
            options: MarkerClusterLayoutAlgorithmOptions
        ): number;
        /** @requires modules/marker-clusters */
        getPointsState(
            clusteredData: MarkerClusterInfoObject,
            oldMarkerClusterInfo: (
                MarkerClusterInfoObject|undefined
            ),
            dataLength: number
        ): Record<string, MarkerClusterPointsState>;
        /** @requires modules/marker-clusters */
        preventClusterCollisions(
            props: MarkerClusterPreventCollisionObject
        ): PositionObject;
        /** @requires modules/marker-clusters */
        isValidGroupedDataObject(
            groupedData: Record<string, MarkerClusterSplitDataArray>
        ): boolean;
        /** @requires modules/marker-clusters */
        getClusteredData(
            groupedData: Record<string, MarkerClusterSplitDataArray>,
            options: MarkerClusterOptions
        ): (MarkerClusterInfoObject|boolean);
        /** @requires modules/marker-clusters */
        destroyClusteredData(): void;
        hideClusteredData(): void;
    }
}

/** @internal */
interface BaseClustersObject {
    clusters: Array<ClusterAndNoiseObject>;
    noise: Array<ClusterAndNoiseObject>;
}

/** @internal */
export interface ClusterAndNoiseObject {
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

/** @internal */
export interface GroupMapObject {
    options?: GroupMapOptionsObject;
}

/** @internal */
interface GroupMapOptionsObject extends SeriesOptions {
    formatPrefix?: string;
    userOptions?: (PointOptions|PointShortOptions);
    x?: number;
    y?: number;
}

/** @internal */
export interface MarkerClusterAlgorithmFunction {
    (
        processedXData: Array<number>,
        processedYData: Array<number>,
        visibleDataIndexes: Array<number>,
        options: MarkerClusterLayoutAlgorithmOptions
    ): Record<string, MarkerClusterSplitDataArray>;
}

/** @internal */
export interface MarkerClusterInfoObject {
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

/** @internal */
export interface KmeansClusterObject {
    posX: number;
    posY: number;
    oldX: number;
    oldY: number;
    startPointsLen: number;
    points: Array<MarkerClusterSplitDataObject>;
}

/** @internal */
export interface MarkerClusterPointsState {
    x: number;
    y: number;
    id: string;
    parentsId: Array<string>;
    point: (Point|undefined);
}

/** @internal */
interface MarkerClusterPointsStateObject {
    oldState?: Record<string, MarkerClusterPointsState>;
    newState: Record<string, MarkerClusterPointsState>;
}

/** @internal */
export interface MarkerClusterPreventCollisionObject {
    x: number;
    y: number;
    key: string;
    groupedData: Record<string, MarkerClusterSplitDataArray>;
    gridSize: number;
    defaultRadius: number;
    clusterRadius: number;
}

/** @internal */
export interface MarkerClusterSplitDataArray
    extends Array<MarkerClusterSplitDataObject> {
    posX?: number;
    posY?: number;
}

/** @internal */
export interface MarkerClusterSplitDataObject {
    dataIndex: number;
    x: number;
    y: number;
    parentStateId?: string;
    options?: (PointOptions|PointShortOptions);
}

/* *
 *
 *  Constants
 *
 * */

(defaultOptions.plotOptions || {}).series = merge(
    (defaultOptions.plotOptions || {}).series,
    MarkerClusterDefaults
);

/* *
 *
 *  Functions
 *
 * */

/**
 * Compose marker cluster module hooks.
 * @internal
 */
function compose(
    AxisClass: typeof Axis,
    ChartClass: typeof Chart,
    highchartsDefaultOptions: Options,
    SeriesClass: typeof Series
): void {

    if (pushUnique(composed, 'MarkerClusters')) {
        const PointClass = SeriesClass.prototype.pointClass,
            { scatter: ScatterSeries } = SeriesClass.types;

        addEvent(AxisClass, 'setExtremes', onAxisSetExtremes);

        addEvent(ChartClass, 'render', onChartRender);

        addEvent(PointClass, 'drillToCluster', onPointDrillToCluster);
        addEvent(PointClass, 'update', onPointUpdate);

        addEvent(SeriesClass, 'afterRender', onSeriesAfterRender);

        if (ScatterSeries) {
            MarkerClusterScatter
                .compose(highchartsDefaultOptions, ScatterSeries);
        }
    }

}

/**
 * Destroy the old tooltip after zoom.
 * @internal
 */
function onAxisSetExtremes(
    this: Axis
): void {
    const chart = this.chart;

    let animationDuration = 0;

    for (const series of chart.series) {
        if (series.markerClusterInfo) {
            const clusterOptions =
                (series.options as ScatterSeriesOptions).cluster;
            animationDuration = (
                animObject((clusterOptions || {}).animation).duration ||
                0
            );
        }
    }

    syncTimeout((): void => {
        if (chart.tooltip) {
            chart.tooltip.destroy();
        }
    }, animationDuration);

}

/**
 * Handle animation.
 * @internal
 */
function onChartRender(
    this: Chart
): void {
    const chart = this;

    for (const series of (chart.series || [])) {
        if (series.markerClusterInfo) {
            const clusterOptions =
                (series.options as ScatterSeriesOptions).cluster,
                pointsState = (series.markerClusterInfo || {}).pointsState,
                oldState = (pointsState || {}).oldState;

            if (
                (clusterOptions || {}).animation &&
                series.markerClusterInfo &&
                (series.chart.pointer?.pinchDown || []).length === 0 &&
                ((series.xAxis || {}).eventArgs || {}).trigger !== 'pan' &&
                oldState &&
                Object.keys(oldState).length
            ) {
                for (const cluster of series.markerClusterInfo.clusters) {
                    series.animateClusterPoint(cluster);
                }
                for (const noise of series.markerClusterInfo.noise) {
                    series.animateClusterPoint(noise);
                }
            }
        }
    }

}

/**
 * Handle drill-to-cluster event.
 * @internal
 */
function onPointDrillToCluster(
    this: Point,
    event: PointClickEvent
): void {
    const point = event.point || event.target,
        series = point.series,
        clusterOptions = (series.options as ScatterSeriesOptions).cluster,
        onDrillToCluster = ((clusterOptions || {}).events || {}).drillToCluster;

    if (isFunction(onDrillToCluster)) {
        onDrillToCluster.call(this, event);
    }
}

/**
 * Override point prototype to throw a warning when trying to update
 * clustered point.
 * @internal
 */
function onPointUpdate(
    this: Point
): (boolean | void) {
    const point = this;

    if (point.dataGroup) {
        error(
            'Highcharts marker-clusters module: ' +
            'Running `Point.update` when point belongs to clustered series' +
            ' is not supported.',
            false,
            point.series.chart
        );
        return false;
    }

}

/**
 * Add classes, change mouse cursor.
 * @internal
 */
function onSeriesAfterRender(
    this: Series
): void {
    const series = this,
        clusterZoomEnabled =
            ((series.options as ScatterSeriesOptions).cluster || {})
                .drillToCluster;

    if (series.markerClusterInfo && series.markerClusterInfo.clusters) {
        for (const cluster of series.markerClusterInfo.clusters) {
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
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const MarkerClusters = {
    compose
};

/** @internal */
export default MarkerClusters;

/* *
 *
 *  API Options
 *
 * */

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

''; // Keeps doclets above in JS file
