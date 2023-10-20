/* *
 *
 *  (c) 2021 Torstein Honsi
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

import type {
    LonLatArray,
    MapViewOptions
} from './MapViewOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BaseGeometry {
    arcs?: (number[]|number[][]|number[][][]);
    properties?: Record<string, string|number>;
}

export interface GeoJSONGeometryPoint extends BaseGeometry {
    type: 'Point';
    coordinates: LonLatArray;
}

export interface MapLonLatObject {
    lat: number;
    lon: number;
}

export interface MultiPoint extends BaseGeometry{
    type: 'MultiPoint';
    coordinates: LonLatArray[];
}

export interface LineString extends BaseGeometry{
    type: 'LineString';
    coordinates: LonLatArray[];
}

export interface Polygon extends BaseGeometry {
    type: 'Polygon';
    coordinates: LonLatArray[][];
}

export interface MultiLineString extends BaseGeometry {
    type: 'MultiLineString';
    coordinates: LonLatArray[][];
}

export interface MultiPolygon extends BaseGeometry {
    type: 'MultiPolygon';
    coordinates: LonLatArray[][][];
}

export interface GeoJSONGeometryMultiPointRegistry {
    LineString: LineString;
    MultiPoint: MultiPoint;
    Polygon: Polygon;
    MultiLineString: MultiLineString;
    MultiPolygon: MultiPolygon;
}

export type GeoJSONGeometryMultiPoint =
    GeoJSONGeometryMultiPointRegistry[keyof GeoJSONGeometryMultiPointRegistry];

export interface GeoJSONGeometryRegistry
    extends GeoJSONGeometryMultiPointRegistry {

    Point: GeoJSONGeometryPoint;
}

export type GeoJSONGeometry =
    GeoJSONGeometryRegistry[keyof GeoJSONGeometryRegistry];

export interface GeoJSON {
    bbox: [number, number, number, number];
    copyright?: string;
    copyrightShort?: string;
    copyrightUrl?: string;
    crs?: AnyRecord;
    features: Array<GeoJSONFeature>;
    'hc-transform'?: Record<string, GeoJSONTransform>;
    'hc-recommended-mapview'?: DeepPartial<MapViewOptions>;
    title?: string;
    type: 'FeatureCollection';
    version?: string;
}
export interface GeoJSONFeature {
    geometry: GeoJSONGeometryPoint|GeoJSONGeometryMultiPoint;
    properties?: Record<string, string|number>;
    type: 'Feature';
}

export interface GeoJSONTransform {
    crs?: string;
    hitZone?: AnyRecord;
    jsonmarginX?: number;
    jsonmarginY?: number;
    jsonres?: number;
    rotation?: number;
    scale?: number;
    xoffset?: number;
    xpan?: number;
    yoffset?: number;
    ypan?: number;
}

export interface TopoJSON {
    arcs: number[][][];
    bbox: [number, number, number, number];
    copyright?: string;
    copyrightShort?: string;
    copyrightUrl?: string;
    objects: TopoJSONObjects;
    title?: string;
    transform: TopoJSONTransform;
    type: 'Topology';
}

export interface TopoJSONObjects {
    [key: string]: TopoJSONObject;
}

export interface TopoJSONObject {
    geometries: GeoJSONGeometry[];
    'hc-decoded-geojson'?: GeoJSON;
    'hc-recommended-mapview'?: DeepPartial<MapViewOptions>;
}

export interface TopoJSONTransform {
    scale: [number, number];
    translate: [number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoJSON;
