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

export interface GeoJSONGeometryPoint {
    type: 'Point';
    coordinates: LonLatArray;
}

interface LineString {
    type: 'LineString';
    coordinates: LonLatArray[];
}

interface Polygon {
    type: 'Polygon';
    coordinates: LonLatArray[][];
}

interface MultiLineString {
    type: 'MultiLineString';
    coordinates: LonLatArray[][];
}

interface MultiPolygon {
    type: 'MultiPolygon';
    coordinates: LonLatArray[][][];
}

export interface GeoJSONGeometryMultiPointRegistry {
    LineString: LineString;
    Polygon: Polygon;
    MultiLineString: MultiLineString;
    MultiPolygon: MultiPolygon;
}

export type GeoJSONGeometryMultiPoint = GeoJSONGeometryMultiPointRegistry[keyof GeoJSONGeometryMultiPointRegistry];

export default GeoJSONGeometryMultiPoint;
