/* *
 *
 *  (c) 2021-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { DeepPartial } from '../Shared/Types';
import type {
    LonLatArray,
    MapViewOptions
} from './MapViewOptions';
import type MapPointOptions from '../Series/Map/MapPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BaseGeometry {
    arcs?: (number[]|number[][]|number[][][]);
    properties?: Record<string, string|number>;
}

/** @internal */
export interface GeoJSONGeometryPoint extends BaseGeometry {
    type: 'Point';
    coordinates: LonLatArray;
}

/**
 * A latitude/longitude object.
 *
 * @interface Highcharts.MapLonLatObject
 */
export interface MapLonLatObject {
    /**
     * The latitude.
     * @name Highcharts.MapLonLatObject#lat
     * @type {number}
     */
    lat: number;

    /**
     * The longitude.
     * @name Highcharts.MapLonLatObject#lon
     * @type {number}
     */
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

/** @internal */
export interface GeoJSONGeometryRegistry
    extends GeoJSONGeometryMultiPointRegistry {

    Point: GeoJSONGeometryPoint;
}

/** @internal */
export type GeoJSONGeometry =
    GeoJSONGeometryRegistry[keyof GeoJSONGeometryRegistry];

/**
 * Represents the loose structure of a geographic JSON file.
 *
 * @interface Highcharts.GeoJSON
 */
export interface GeoJSON {
    /** @internal */
    bbox: [number, number, number, number];

    /**
     * Full copyright note of the geographic data.
     *
     * @name Highcharts.GeoJSON#copyright
     * @type {string|undefined}
     */

    /** @internal */
    copyright?: string;

    /**
     * Short copyright note of the geographic data suitable for watermarks.
     *
     * @name Highcharts.GeoJSON#copyrightShort
     * @type {string|undefined}
     */
    copyrightShort?: string;

    /** @internal */
    copyrightUrl?: string;

    /**
     * Additional meta information based on the coordinate reference system.
     *
     * @name Highcharts.GeoJSON#crs
     * @type {Highcharts.Dictionary<any>|undefined}
     */
    crs?: AnyRecord;

    /**
     * Data sets of geographic features.
     *
     * @name Highcharts.GeoJSON#features
     * @type {Array<Highcharts.GeoJSONFeature>}
     */
    features: Array<GeoJSONFeature>;

    /**
     * Map projections and transformations to be used when calculating between
     * lat/lon and chart values. Required for lat/lon support on maps. Allows
     * resizing, rotating, and moving portions of a map within its projected
     * coordinate system while still retaining lat/lon support. If using lat/lon
     * on a portion of the map that does not match a `hitZone`, the definition
     * with the key `default` is used.
     *
     * @name Highcharts.GeoJSON#hc-transform
     * @type {Highcharts.Dictionary<Highcharts.GeoJSONTranslation>|undefined}
     */
    'hc-transform'?: Record<string, GeoJSONTransform>;

    /** @internal */
    'hc-recommended-mapview'?: DeepPartial<MapViewOptions>;

    /**
     * Title of the geographic data.
     *
     * @name Highcharts.GeoJSON#title
     * @type {string|undefined}
     */
    title?: string;

    /**
     * Type of the geographic data. Type of an optimized map collection is
     * `FeatureCollection`.
     *
     * @name Highcharts.GeoJSON#type
     * @type {string|undefined}
     */
    type: 'FeatureCollection';

    /**
     * Version of the geographic data.
     *
     * @name Highcharts.GeoJSON#version
     * @type {string|undefined}
     */
    version?: string;
}

// TODO: The public interface is incomplete.
/**
 * Data set of a geographic feature.
 *
 * @interface Highcharts.GeoJSONFeature
 * @extends Highcharts.Dictionary<*>
 */
export interface GeoJSONFeature {
    /** @internal */
    geometry: GeoJSONGeometryPoint|GeoJSONGeometryMultiPoint;

    /** @internal */
    properties?: Record<string, string|number>;

    /**
     * Data type of the geographic feature.
     * @name Highcharts.GeoJSONFeature#type
     * @type {string}
     */
    type: 'Feature';
}

// TODO: When switching to native declarations only - refactor GeoJSONTransform
// into GeoJSONTranslation or introduce a breaking change with the new name.
/**
 * Describes the map projection and transformations applied to a portion of
 * a map.
 * @interface Highcharts.GeoJSONTranslation
 */
export interface GeoJSONTransform {
    /**
     * The coordinate reference system used to generate this portion of the map.
     *
     * @name Highcharts.GeoJSONTranslation#crs
     * @type {string}
     */
    crs?: string;

    /**
     * Define the portion of the map that this definition applies to. Defined as
     * a GeoJSON polygon feature object, with `type` and `coordinates`
     * properties.
     *
     * @name Highcharts.GeoJSONTranslation#hitZone
     * @type {Highcharts.Dictionary<*>|undefined}
     */
    hitZone?: AnyRecord;

    /**
     * Property for internal use for maps generated by Highsoft.
     *
     * @name Highcharts.GeoJSONTranslation#jsonmarginX
     * @type {number|undefined}
     */
    jsonmarginX?: number;

    /**
     * Property for internal use for maps generated by Highsoft.
     *
     * @name Highcharts.GeoJSONTranslation#jsonmarginY
     * @type {number|undefined}
     */
    jsonmarginY?: number;

    /**
     * Property for internal use for maps generated by Highsoft.
     *
     * @name Highcharts.GeoJSONTranslation#jsonres
     * @type {number|undefined}
     */
    jsonres?: number;

    /**
     * Specifies clockwise rotation of the coordinates after the projection, but
     * before scaling and panning. Defined in radians, relative to the
     * coordinate system origin.
     *
     * @name Highcharts.GeoJSONTranslation#rotation
     * @type {number|undefined}
     */
    rotation?: number;

    /**
     * The scaling factor applied to the projected coordinates.
     *
     * @name Highcharts.GeoJSONTranslation#scale
     * @type {number|undefined}
     */
    scale?: number;

    /**
     * Property for internal use for maps generated by Highsoft.
     *
     * @name Highcharts.GeoJSONTranslation#xoffset
     * @type {number|undefined}
     */
    xoffset?: number;

    /**
     * X offset of projected coordinates after scaling.
     *
     * @name Highcharts.GeoJSONTranslation#xpan
     * @type {number|undefined}
     */
    xpan?: number;

    /**
     * Property for internal use for maps generated by Highsoft.
     *
     * @name Highcharts.GeoJSONTranslation#yoffset
     * @type {number|undefined}
     */
    yoffset?: number;

    /**
     * Y offset of projected coordinates after scaling.
     *
     * @name Highcharts.GeoJSONTranslation#ypan
     * @type {number|undefined}
     */
    ypan?: number;
}

/**
 * A TopoJSON object, see description on the
 * [project's GitHub page](https://github.com/topojson/topojson).
 *
 * @typedef {Object} Highcharts.TopoJSON
 */
export interface TopoJSON {

    /** @internal */
    arcs: number[][][];

    /** @internal */
    bbox: [number, number, number, number];

    /** @internal */
    copyright?: string;

    /** @internal */
    copyrightShort?: string;

    /** @internal */
    copyrightUrl?: string;

    /** @internal */
    objects: TopoJSONObjects;

    /** @internal */
    title?: string;

    /** @internal */
    transform: TopoJSONTransform;

    /** @internal */
    type: 'Topology';
}

/** @internal */
export interface TopoJSONObjects {
    [key: string]: TopoJSONObject;
}

/** @internal */
export interface TopoJSONObject {
    geometries: GeoJSONGeometry[];
    'hc-decoded-geojson'?: GeoJSON;
    'hc-recommended-mapview'?: DeepPartial<MapViewOptions>;
}

/** @internal */
export interface TopoJSONTransform {
    scale: [number, number];
    translate: [number, number];
}

/**
 * An array of GeoJSON or TopoJSON objects or strings used as map data for
 * series.
 *
 * @typedef {Array<*>|Highcharts.GeoJSON|Highcharts.TopoJSON|string} Highcharts.MapDataType
 */
export type MapDataType = Array<MapPointOptions>|GeoJSON|TopoJSON|string;

/* *
 *
 *  Default Export
 *
 * */

export default GeoJSON;
