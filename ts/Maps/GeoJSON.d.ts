/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { LonLatArray } from './MapViewOptions';

interface GeoJSONGeometryPoint {
    type: 'Point';
    coordinates: LonLatArray;
}

interface GeoJSONGeometryLineString {
    type: 'LineString';
    coordinates: LonLatArray[];
}

interface GeoJSONGeometryPolygon {
    type: 'Polygon';
    coordinates: LonLatArray[][];
}

interface GeoJSONGeometryMultiLineString {
    type: 'MultiLineString';
    coordinates: LonLatArray[][];
}

interface GeoJSONGeometryMultiPolygon {
    type: 'MultiPolygon';
    coordinates: LonLatArray[][][];
}

export interface GeoJSONGeometryRegistry {
    GeoJSONGeometryPoint: GeoJSONGeometryPoint;
    GeoJSONGeometryLineString: GeoJSONGeometryLineString;
    GeoJSONGeometryPolygon: GeoJSONGeometryPolygon;
    GeoJSONGeometryMultiLineString: GeoJSONGeometryMultiLineString;
    GeoJSONGeometryMultiPolygon: GeoJSONGeometryMultiPolygon;
}

export type GeoJSONGeometry = GeoJSONGeometryRegistry[keyof GeoJSONGeometryRegistry];

export default GeoJSONGeometry;
