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
import type ColorType from '../Core/Color/ColorType';
import type ProjectionOptions from './ProjectionOptions';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type { GeoJSONGeometryMultiPoint } from './GeoJSON';

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

export interface MapViewInsetsOptions extends MapViewInsetOptionsOptions {
    borderPath?: SVGPath;
    center: LonLatArray;
    field?: [number, number][];
    geoBounds?: GeoJSONGeometryMultiPoint;
    id?: string;
    projection?: ProjectionOptions;
}

export interface MapViewInsetOptionsOptions {
    borderColor: ColorType;
    borderWidth: number;
    padding: (number|string);
    units: ('percent'|'pixels');
}

export interface MapViewOptions {
    center: LonLatArray;
    insetOptions?: MapViewInsetOptionsOptions;
    insets?: Record<string, MapViewInsetsOptions>;
    maxZoom?: number;
    padding: (number|string);
    projection?: ProjectionOptions;
    zoom?: number;
}

export default MapViewOptions;
