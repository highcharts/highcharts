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
    PointStatesOptions
} from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        lat?: number;
        lon?: number;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        cluster?: MarkerClusterOptions;
    }
}

declare module '../../Core/TooltipOptions' {
    interface TooltipOptions {
        clusterFormat?: string;
    }
}

export type MarkerClusterAlgorithmValue = ('grid'|'kmeans'|'optimizedKmeans');

export interface MarkerClusterDrillCallbackFunction {
    (this: Point, event: PointClickEvent): void;
}

export interface MarkerClusterEventsOptions {
    drillToCluster: MarkerClusterDrillCallbackFunction;
}

export interface MarkerClusterLayoutAlgorithmOptions {
    distance: number;
    gridSize: number;
    iterations?: number;
    kmeansThreshold: number;
    processedDistance?: number;
    processedGridSize?: number;
    type?: (MarkerClusterAlgorithmValue | Function);
}

export interface MarkerClusterMarkerOptions extends PointMarkerOptions {
    lineWidth: number;
    radius: number;
}

export interface MarkerClusterOptions {
    allowOverlap?: boolean;
    animation?: (boolean|Partial<AnimationOptions>);
    dataLabels?: DataLabelOptions;
    drillToCluster?: boolean;
    enabled?: boolean;
    events?: MarkerClusterEventsOptions;
    layoutAlgorithm: MarkerClusterLayoutAlgorithmOptions;
    marker: MarkerClusterMarkerOptions;
    minimumClusterSize?: number;
    states?: PointStatesOptions<Point>;
    zones?: Array<MarkerClusterZonesOptions>;
}

export interface MarkerClusterZonesOptions {
    className?: string;
    from: number;
    marker: PointMarkerOptions;
    to: number;
    zoneIndex: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MarkerClusterOptions;
