/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    GeoJSON,
    GeoJSONFeature,
    TopoJSON
} from '../Maps/GeoJSON';
import type MapPointOptions from '../Series/Map/MapPointOptions';
import type MapPointPointOptions from '../Series/MapPoint/MapPointPointOptions';
import type Series from '../Core/Series/Series';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import Chart from '../Core/Chart/Chart.js';
import F from '../Core/FormatUtilities.js';
const { format } = F;
import H from '../Core/Globals.js';
const { win } = H;
import MU from '../Maps/MapUtilities.js';
const {
    pointInPolygon
} = MU;
import U from '../Core/Utilities.js';
const {
    error,
    extend,
    merge,
    wrap
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        /** @requires modules/maps */
        mapCredits?: string;
        /** @requires modules/maps */
        mapCreditsFull?: string;
        /** @requires modules/maps */
        mapTransforms?: any;
        /** @requires modules/maps */
        fromLatLonToPoint(latLon: Highcharts.MapLatLonObject): Highcharts.MapCoordinateObject;
        /** @requires modules/maps */
        fromPointToLatLon(
            point: Highcharts.MapCoordinateObject
        ): (Highcharts.MapLatLonObject|undefined);
        /** @requires modules/maps */
        transformFromLatLon(
            latLon: Highcharts.MapLatLonObject,
            transform: any
        ): Highcharts.MapCoordinateObject;
        /** @requires modules/maps */
        transformToLatLon(
            point: Highcharts.MapCoordinateObject,
            transform: any
        ): (Highcharts.MapLatLonObject|undefined);
    }
}

declare module '../Core/Chart/ChartOptions'{
    interface ChartOptions {
        /** @requires modules/map */
        proj4?: any;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface MapCoordinateObject {
            name?: string;
            properties?: object;
            x: number;
            y: (number|null);
        }
        interface MapPathObject {
            name?: string;
            path?: SVGPath;
            properties?: object;
        }
        interface MapLatLonObject {
            lat: number;
            lon: number;
        }

        /** @requires modules/maps */
        function geojson(
            geojson: GeoJSON,
            hType?: string,
            series?: Series
        ): Array<any>;
    }
    interface Window {
        d3: any;
        proj4: any;
    }
}

/**
 * Represents the loose structure of a geographic JSON file.
 *
 * @interface Highcharts.GeoJSON
 *//**
 * Full copyright note of the geographic data.
 * @name Highcharts.GeoJSON#copyright
 * @type {string|undefined}
 *//**
 * Short copyright note of the geographic data suitable for watermarks.
 * @name Highcharts.GeoJSON#copyrightShort
 * @type {string|undefined}
 *//**
 * Additional meta information based on the coordinate reference system.
 * @name Highcharts.GeoJSON#crs
 * @type {Highcharts.Dictionary<any>|undefined}
 *//**
 * Data sets of geographic features.
 * @name Highcharts.GeoJSON#features
 * @type {Array<Highcharts.GeoJSONFeature>}
 *//**
 * Map projections and transformations to be used when calculating between
 * lat/lon and chart values. Required for lat/lon support on maps. Allows
 * resizing, rotating, and moving portions of a map within its projected
 * coordinate system while still retaining lat/lon support. If using lat/lon
 * on a portion of the map that does not match a `hitZone`, the definition with
 * the key `default` is used.
 * @name Highcharts.GeoJSON#hc-transform
 * @type {Highcharts.Dictionary<Highcharts.GeoJSONTranslation>|undefined}
 *//**
 * Title of the geographic data.
 * @name Highcharts.GeoJSON#title
 * @type {string|undefined}
 *//**
 * Type of the geographic data. Type of an optimized map collection is
 * `FeatureCollection`.
 * @name Highcharts.GeoJSON#type
 * @type {string|undefined}
 *//**
 * Version of the geographic data.
 * @name Highcharts.GeoJSON#version
 * @type {string|undefined}
 */

/**
 * Data set of a geographic feature.
 * @interface Highcharts.GeoJSONFeature
 * @extends Highcharts.Dictionary<*>
 *//**
 * Data type of the geographic feature.
 * @name Highcharts.GeoJSONFeature#type
 * @type {string}
 */

/**
 * Describes the map projection and transformations applied to a portion of
 * a map.
 * @interface Highcharts.GeoJSONTranslation
 *//**
 * The coordinate reference system used to generate this portion of the map.
 * @name Highcharts.GeoJSONTranslation#crs
 * @type {string}
 *//**
 * Define the portion of the map that this defintion applies to. Defined as a
 * GeoJSON polygon feature object, with `type` and `coordinates` properties.
 * @name Highcharts.GeoJSONTranslation#hitZone
 * @type {Highcharts.Dictionary<*>|undefined}
 *//**
 * Property for internal use for maps generated by Highsoft.
 * @name Highcharts.GeoJSONTranslation#jsonmarginX
 * @type {number|undefined}
 *//**
 * Property for internal use for maps generated by Highsoft.
 * @name Highcharts.GeoJSONTranslation#jsonmarginY
 * @type {number|undefined}
 *//**
 * Property for internal use for maps generated by Highsoft.
 * @name Highcharts.GeoJSONTranslation#jsonres
 * @type {number|undefined}
 *//**
 * Specifies clockwise rotation of the coordinates after the projection, but
 * before scaling and panning. Defined in radians, relative to the coordinate
 * system origin.
 * @name Highcharts.GeoJSONTranslation#rotation
 * @type {number|undefined}
 *//**
 * The scaling factor applied to the projected coordinates.
 * @name Highcharts.GeoJSONTranslation#scale
 * @type {number|undefined}
 *//**
 * Property for internal use for maps generated by Highsoft.
 * @name Highcharts.GeoJSONTranslation#xoffset
 * @type {number|undefined}
 *//**
 * X offset of projected coordinates after scaling.
 * @name Highcharts.GeoJSONTranslation#xpan
 * @type {number|undefined}
 *//**
 * Property for internal use for maps generated by Highsoft.
 * @name Highcharts.GeoJSONTranslation#yoffset
 * @type {number|undefined}
 *//**
 * Y offset of projected coordinates after scaling.
 * @name Highcharts.GeoJSONTranslation#ypan
 * @type {number|undefined}
 */

/**
 * Result object of a map transformation.
 *
 * @interface Highcharts.MapCoordinateObject
 *//**
 * X coordinate on the map.
 * @name Highcharts.MapCoordinateObject#x
 * @type {number}
 *//**
 * Y coordinate on the map.
 * @name Highcharts.MapCoordinateObject#y
 * @type {number|null}
 */

/**
 * A latitude/longitude object.
 *
 * @interface Highcharts.MapLatLonObject
 *//**
 * The latitude.
 * @name Highcharts.MapLatLonObject#lat
 * @type {number}
 *//**
 * The longitude.
 * @name Highcharts.MapLatLonObject#lon
 * @type {number}
 */

/**
 * An array of longitude, latitude.
 *
 * @typedef {Array<number>} Highcharts.LonLatArray
 */

/**
 * A TopoJSON object, see description on the
 * [project's GitHub page](https://github.com/topojson/topojson).
 *
 * @typedef {Object} Highcharts.TopoJSON
 */
''; // detach doclets above

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Highmaps only. Get point from latitude and longitude using specified
 * transform definition.
 *
 * @requires modules/map
 *
 * @sample maps/series/latlon-transform/
 *         Use specific transformation for lat/lon
 *
 * @function Highcharts.Chart#transformFromLatLon
 *
 * @param {Highcharts.MapLatLonObject} latLon
 *        A latitude/longitude object.
 *
 * @param {*} transform
 *        The transform definition to use as explained in the
 *        {@link https://www.highcharts.com/docs/maps/latlon|documentation}.
 *
 * @return {Highcharts.MapCoordinateObject}
 *         An object with `x` and `y` properties.
 */
Chart.prototype.transformFromLatLon = function (
    latLon: Highcharts.MapLatLonObject,
    transform: any
): Highcharts.MapCoordinateObject {

    /**
     * Allows to manually load the proj4 library from Highcharts options
     * instead of the `window`.
     * In case of loading the library from a `script` tag,
     * this option is not needed, it will be loaded from there by default.
     *
     * @type      {Function}
     * @product   highmaps
     * @apioption chart.proj4
     */

    const proj4 = this.options.chart.proj4 || win.proj4;
    if (!proj4) {
        error(21, false, this);
        return {
            x: 0,
            y: null
        };
    }

    const {
        jsonmarginX = 0,
        jsonmarginY = 0,
        jsonres = 1,
        scale = 1,
        xoffset = 0,
        xpan = 0,
        yoffset = 0,
        ypan = 0
    } = transform;

    const projected = proj4(transform.crs, [latLon.lon, latLon.lat]),
        cosAngle = transform.cosAngle ||
            (transform.rotation && Math.cos(transform.rotation)),
        sinAngle = transform.sinAngle ||
            (transform.rotation && Math.sin(transform.rotation)),
        rotated = transform.rotation ? [
            projected[0] * cosAngle + projected[1] * sinAngle,
            -projected[0] * sinAngle + projected[1] * cosAngle
        ] : projected;

    return {
        x: ((rotated[0] - xoffset) * scale + xpan) * jsonres + jsonmarginX,
        y: -(((yoffset - rotated[1]) * scale + ypan) * jsonres - jsonmarginY)
    };
};

/**
 * Highmaps only. Get latLon from point using specified transform definition.
 * The method returns an object with the numeric properties `lat` and `lon`.
 *
 * @requires modules/map
 *
 * @sample maps/series/latlon-transform/
 *         Use specific transformation for lat/lon
 *
 * @function Highcharts.Chart#transformToLatLon
 *
 * @param {Highcharts.Point|Highcharts.MapCoordinateObject} point
 *        A `Point` instance, or any object containing the properties `x` and
 *        `y` with numeric values.
 *
 * @param {*} transform
 *        The transform definition to use as explained in the
 *        {@link https://www.highcharts.com/docs/maps/latlon|documentation}.
 *
 * @return {Highcharts.MapLatLonObject|undefined}
 *         An object with `lat` and `lon` properties.
 */
Chart.prototype.transformToLatLon = function (
    point: Highcharts.MapCoordinateObject,
    transform: any
): (Highcharts.MapLatLonObject|undefined) {

    const proj4 = this.options.chart.proj4 || win.proj4;
    if (!proj4) {
        error(21, false, this);
        return;
    }

    if (point.y === null) {
        return;
    }

    const {
        jsonmarginX = 0,
        jsonmarginY = 0,
        jsonres = 1,
        scale = 1,
        xoffset = 0,
        xpan = 0,
        yoffset = 0,
        ypan = 0
    } = transform;

    const normalized = {
            x: ((point.x - jsonmarginX) / jsonres - xpan) / scale + xoffset,
            y: ((point.y - jsonmarginY) / jsonres + ypan) / scale + yoffset
        },
        cosAngle = transform.cosAngle ||
            (transform.rotation && Math.cos(transform.rotation)),
        sinAngle = transform.sinAngle ||
            (transform.rotation && Math.sin(transform.rotation)),
        // Note: Inverted sinAngle to reverse rotation direction
        projected = win.proj4(transform.crs, 'WGS84', transform.rotation ? {
            x: normalized.x * cosAngle + normalized.y * -sinAngle,
            y: normalized.x * sinAngle + normalized.y * cosAngle
        } : normalized);

    return { lat: projected.y, lon: projected.x };
};

/**
 * Highmaps only. Calculate latitude/longitude values for a point. Returns an
 * object with the numeric properties `lat` and `lon`.
 *
 * @requires modules/map
 *
 * @sample maps/demo/latlon-advanced/
 *         Advanced lat/lon demo
 *
 * @function Highcharts.Chart#fromPointToLatLon
 *
 * @param {Highcharts.Point|Highcharts.MapCoordinateObject} point
 *        A `Point` instance or anything containing `x` and `y` properties with
 *        numeric values.
 *
 * @return {Highcharts.MapLatLonObject|undefined}
 *         An object with `lat` and `lon` properties.
 */
Chart.prototype.fromPointToLatLon = function (
    point: Highcharts.MapCoordinateObject
): (Highcharts.MapLatLonObject|undefined) {
    const transforms = this.mapTransforms;

    if (!transforms) {
        error(22, false, this);
        return;
    }

    for (const transform in transforms) {
        if (
            Object.hasOwnProperty.call(transforms, transform) &&
            transforms[transform].hitZone &&
            pointInPolygon(
                point,
                transforms[transform].hitZone.coordinates[0]
            )
        ) {
            return this.transformToLatLon(point, transforms[transform]);
        }
    }

    return this.transformToLatLon(
        point,
        transforms['default'] // eslint-disable-line dot-notation
    );
};

/**
 * Highmaps only. Get chart coordinates from latitude/longitude. Returns an
 * object with x and y values corresponding to the `xAxis` and `yAxis`.
 *
 * @requires modules/map
 *
 * @sample maps/series/latlon-to-point/
 *         Find a point from lat/lon
 *
 * @function Highcharts.Chart#fromLatLonToPoint
 *
 * @param {Highcharts.MapLatLonObject} latLon
 *        Coordinates.
 *
 * @return {Highcharts.MapCoordinateObject}
 *         X and Y coordinates in terms of chart axis values.
 */
Chart.prototype.fromLatLonToPoint = function (
    latLon: Highcharts.MapLatLonObject
): Highcharts.MapCoordinateObject {
    let transforms = this.mapTransforms,
        transform,
        coords;

    if (!transforms) {
        error(22, false, this);
        return {
            x: 0,
            y: null
        };
    }

    for (transform in transforms) {
        if (
            Object.hasOwnProperty.call(transforms, transform) &&
            transforms[transform].hitZone
        ) {
            coords = this.transformFromLatLon(latLon, transforms[transform]);
            if (pointInPolygon(
                coords,
                transforms[transform].hitZone.coordinates[0]
            )) {
                return coords;
            }
        }
    }

    return this.transformFromLatLon(
        latLon,
        transforms['default'] // eslint-disable-line dot-notation
    );
};

/*
 * Convert a TopoJSON topology to GeoJSON. By default the first object is
 * handled.
 * Based on https://github.com/topojson/topojson-specification
*/
const topo2geo = (topology: TopoJSON, objectName?: string): GeoJSON => {

    // Decode first object/feature as default
    if (!objectName) {
        objectName = Object.keys(topology.objects)[0];
    }
    const object = topology.objects[objectName];

    // Already decoded => return cache
    if (object['hc-decoded-geojson']) {
        return object['hc-decoded-geojson'];
    }

    // Do the initial transform
    let arcsArray = topology.arcs as any[];
    if (topology.transform) {
        const { scale, translate } = topology.transform;
        arcsArray = topology.arcs.map((arc): any => {
            let x = 0,
                y = 0;
            return arc.map((position): number[] => {
                position = position.slice();
                position[0] = (x += position[0]) * scale[0] + translate[0];
                position[1] = (y += position[1]) * scale[1] + translate[1];
                return position;
            });
        });
    }

    // Recurse down any depth of multi-dimentional arrays of arcs and insert
    // the coordinates
    const arcsToCoordinates = (
        arcs: any
    ): number[] => {
        if (typeof arcs[0] === 'number') {
            return arcs.reduce(
                (coordinates: number[], arc: number, i: number): number[] =>
                    coordinates.concat(
                        (arc < 0 ? arcsArray[~arc].reverse() : arcsArray[arc])
                            .slice(i === 0 ? 0 : 1)
                    ),
                []
            );
        }
        return arcs.map(arcsToCoordinates);
    };

    const features = object.geometries
        .map((geometry): GeoJSONFeature => ({
            type: 'Feature',
            properties: geometry.properties,
            geometry: {
                type: geometry.type,
                coordinates: geometry.coordinates ||
                    arcsToCoordinates(geometry.arcs)
            } as any
        }));

    const geojson: GeoJSON = {
        type: 'FeatureCollection',
        copyright: topology.copyright,
        copyrightShort: topology.copyrightShort,
        copyrightUrl: topology.copyrightUrl,
        features
    };

    object['hc-decoded-geojson'] = geojson;

    return geojson;
};

/**
 * Highcharts Maps only. Restructure a GeoJSON or TopoJSON object in preparation
 * to be read directly by the
 * {@link https://api.highcharts.com/highmaps/plotOptions.series.mapData|series.mapData}
 * option. The object will be broken down to fit a specific Highcharts type,
 * either `map`, `mapline` or `mappoint`. Meta data in GeoJSON's properties
 * object will be copied directly over to {@link Point.properties} in Highmaps.
 *
 * @requires modules/map
 *
 * @sample maps/demo/geojson/
 *         Simple areas
 * @sample maps/demo/geojson-multiple-types/
 *         Multiple types
 * @sample maps/series/mapdata-multiple/
 *         Multiple map sources
 *
 * @function Highcharts.geojson
 *
 * @param {Highcharts.GeoJSON|Highcharts.TopoJSON} json
 *        The GeoJSON or TopoJSON structure to parse, represented as a
 *        JavaScript object.
 *
 * @param {string} [hType=map]
 *        The Highmaps series type to prepare for. Setting "map" will return
 *        GeoJSON polygons and multipolygons. Setting "mapline" will return
 *        GeoJSON linestrings and multilinestrings. Setting "mappoint" will
 *        return GeoJSON points and multipoints.
 *
 *
 * @return {Array<*>}
 *         An object ready for the `mapData` option.
 */
H.geojson = function (
    json: GeoJSON|TopoJSON,
    hType: string = 'map',
    series?: Series
): Array<any> {
    const mapData = [] as Array<any>;

    const geojson = json.type === 'Topology' ? topo2geo(json) : json;

    geojson.features.forEach(function (feature): void {

        const geometry = feature.geometry || {},
            type = geometry.type as any,
            coordinates = geometry.coordinates as any,
            properties = feature.properties;

        let pointOptions: (MapPointOptions|MapPointPointOptions|undefined);

        if (
            (hType === 'map' || hType === 'mapbubble') &&
            (type === 'Polygon' || type === 'MultiPolygon')
        ) {
            if (coordinates.length) {
                pointOptions = { geometry: { coordinates, type } };
            }

        } else if (
            hType === 'mapline' &&
            (
                type === 'LineString' ||
                type === 'MultiLineString'
            )
        ) {
            if (coordinates.length) {
                pointOptions = { geometry: { coordinates, type } };
            }

        } else if (hType === 'mappoint' && type === 'Point') {
            if (coordinates.length) {
                pointOptions = { geometry: { coordinates, type } };
            }
        }
        if (pointOptions) {
            const name = properties && (properties.name || properties.NAME);
            mapData.push(extend(pointOptions, {
                name: typeof name === 'string' ? name : void 0,

                /**
                 * In Highmaps, when data is loaded from GeoJSON, the GeoJSON
                 * item's properies are copied over here.
                 *
                 * @requires modules/map
                 * @name Highcharts.Point#properties
                 * @type {*}
                 */
                properties
            }));
        }

    });

    // Create a credits text that includes map source, to be picked up in
    // Chart.addCredits
    if (series && geojson.copyrightShort) {
        series.chart.mapCredits = format(
            (series.chart.options.credits as any).mapText,
            { geojson: geojson }
        );
        series.chart.mapCreditsFull = format(
            (series.chart.options.credits as any).mapTextFull,
            { geojson: geojson }
        );
    }

    return mapData;
};

// Override addCredits to include map source by default
wrap(Chart.prototype, 'addCredits', function (
    this: Chart,
    proceed: Function,
    credits: Chart.CreditsOptions
): void {

    credits = merge(true, this.options.credits, credits);

    // Disable credits link if map credits enabled. This to allow for in-text
    // anchors.
    if (this.mapCredits) {
        credits.href = null as any;
    }

    proceed.call(this, credits);

    // Add full map credits to hover
    if (this.credits && this.mapCreditsFull) {
        this.credits.attr({
            title: this.mapCreditsFull
        });
    }
});
