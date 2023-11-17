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
import type {
    GeoJSONGeometryMultiPoint,
    MultiLineString,
    Polygon
} from './GeoJSON';

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

export type MapViewPaddingType = (
    number|
    string|
    [number|string, number|string, number|string, number|string]
);

export type ProjectedXYArray = [number, number] & { outside?: boolean };

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

export interface MapViewInsetOptions {
    borderColor: ColorType;
    borderWidth: number;
    padding: MapViewPaddingType;
    relativeTo: ('mapBoundingBox'|'plotBox');
    units: ('percent'|'pixels');
}

export interface MapViewInsetsOptions extends MapViewInsetOptions {
    borderPath?: MultiLineString;
    center: LonLatArray;
    field?: Polygon;
    geoBounds?: Polygon;
    id?: string;
    projection?: ProjectionOptions;
}

export interface MapViewOptions {
    fitToGeometry?: GeoJSONGeometryMultiPoint;
    center: LonLatArray;
    insetOptions?: MapViewInsetOptions;
    insets?: MapViewInsetsOptions[];
    maxZoom?: number;
    padding: MapViewPaddingType;
    projection?: ProjectionOptions;
    recommendedMapView?: DeepPartial<MapViewOptions>;
    zoom?: number;
    minZoom?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapViewOptions;
