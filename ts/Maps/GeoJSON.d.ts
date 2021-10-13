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

interface Point {
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

export interface GeoJSONGeometryRegistry {
    Point: Point;
    LineString: LineString;
    Polygon: Polygon;
    MultiLineString: MultiLineString;
    MultiPolygon: MultiPolygon;
}

export type GeoJSONGeometry = GeoJSONGeometryRegistry[keyof GeoJSONGeometryRegistry];

export default GeoJSONGeometry;
