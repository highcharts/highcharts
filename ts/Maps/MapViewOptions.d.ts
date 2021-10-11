/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import type ProjectionOptions from './ProjectionOptions';

/* *
 *
 *  Declarations
 *
 * */
declare module '../Core/Options' {
    interface Options {
        mapView?: MapViewOptions;
    }
}


export type LonLatArray = [number, number];

export interface ProjectedXY {
    x: number;
    y: number;
}

export interface MapBounds {
    midX?: number;
    midY?: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface MapViewOptions {
    center: LonLatArray;
    maxZoom?: number;
    padding: (number|string);
    projection?: ProjectionOptions;
    zoom: number;
}

export default MapViewOptions;
