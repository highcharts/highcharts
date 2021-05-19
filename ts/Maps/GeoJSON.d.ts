/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

export type LonLatArray = [number, number];

type GeoJSONGeometryLineString = {
    type: 'LineString';
    coordinates: LonLatArray[];
}

type GeoJSONGeometryPolygon = {
    type: 'Polygon';
    coordinates: LonLatArray[][];
}

type GeoJSONGeometryMultiLineString = {
    type: 'MultiLineString';
    coordinates: LonLatArray[][];
}

type GeoJSONGeometryMultiPolygon = {
    type: 'MultiPolygon';
    coordinates: LonLatArray[][][];
}

export type GeoJSONGeometry = (
    GeoJSONGeometryLineString|
    GeoJSONGeometryPolygon|
    GeoJSONGeometryMultiLineString|
    GeoJSONGeometryMultiPolygon
);
