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
import Point from '../../Core/Series/Point';
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
    type?: (MarkerClusterAlgorithmValue | Function);
    gridSize: number;
    processedGridSize?: number;
    distance: number;
    processedDistance?: number;
    iterations?: number;
    kmeansThreshold: number;
}

export interface MarkerClusterMarkerOptions extends PointMarkerOptions {
    radius: number;
    lineWidth: number;
}

export interface MarkerClusterOptions {
    enabled?: boolean;
    allowOverlap?: boolean;
    minimumClusterSize?: number;
    drillToCluster?: boolean;
    animation?: (boolean|Partial<AnimationOptions>);
    layoutAlgorithm: MarkerClusterLayoutAlgorithmOptions;
    marker: MarkerClusterMarkerOptions;
    dataLabels?: DataLabelOptions;
    zones?: Array<MarkerClusterZonesOptions>;
    states?: PointStatesOptions<Point>;
    events?: MarkerClusterEventsOptions;
}

export interface MarkerClusterZonesOptions {
    from: number;
    to: number;
    marker: PointMarkerOptions;
    zoneIndex: number;
    className?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default MarkerClusterOptions;
