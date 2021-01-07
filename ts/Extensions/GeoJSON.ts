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

import type Series from '../Core/Series/Series';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
const {
    win
} = H;
import '../Core/Options.js';
import U from '../Core/Utilities.js';
const {
    error,
    extend,
    format,
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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface MapCoordinateObject {
            x: number;
            y: (number|null);
        }
        interface MapPathObject {
            path: SVGPath;
        }
        interface MapLatLonObject {
            lat: number;
            lon: number;
        }
        interface ChartOptions {
            /** @requires modules/map */
            proj4?: any;
        }
        interface GeoJSON {
            copyright?: string;
            copyrightShort?: string;
            crs?: Record<string, any>;
            features: Array<GeoJSONFeature>;
            'hc-transform'?: Record<string, GeoJSONTransform>;
            title?: string;
            type?: string;
            version?: string;
        }
        interface GeoJSONFeature extends Record<string, any> {
            type: string;
        }
        interface GeoJSONTransform {
            crs?: string;
            hitZone?: Record<string, any>;
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
        /** @requires modules/maps */
        function geojson(
            geojson: GeoJSON,
            hType?: string,
            series?: Series
        ): Array<any>;
    }
    interface Window {
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

''; // detach doclets above

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Test for point in polygon. Polygon defined as array of [x,y] points.
 * @private
 */
function pointInPolygon(
    point: Highcharts.MapCoordinateObject,
    polygon: Array<Array<number>>
): boolean {
    var i,
        j,
        rel1,
        rel2,
        c = false,
        x = point.x,
        y = point.y;

    for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        rel1 = polygon[i][1] > (y as any);
        rel2 = polygon[j][1] > (y as any);
        if (
            rel1 !== rel2 &&
            (
                x < (polygon[j][0] -
                    polygon[i][0]) * ((y as any) - polygon[i][1]) /
                    (polygon[j][1] - polygon[i][1]) +
                    polygon[i][0]
            )
        ) {
            c = !c;
        }
    }

    return c;
}

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
     * @type       {function}
     * @product    highmaps
     * @apioption  chart.proj4
     */

    const proj4 = (this.userOptions.chart?.proj4 || win.proj4);
    if (!proj4) {
        error(21, false, this);
        return {
            x: 0,
            y: null
        };
    }

    var projected = proj4(transform.crs, [latLon.lon, latLon.lat]),
        cosAngle = transform.cosAngle ||
            (transform.rotation && Math.cos(transform.rotation)),
        sinAngle = transform.sinAngle ||
            (transform.rotation && Math.sin(transform.rotation)),
        rotated = transform.rotation ? [
            projected[0] * cosAngle + projected[1] * sinAngle,
            -projected[0] * sinAngle + projected[1] * cosAngle
        ] : projected;

    return {
        x: (
            (rotated[0] - (transform.xoffset || 0)) * (transform.scale || 1) +
            (transform.xpan || 0)
        ) * (transform.jsonres || 1) +
        (transform.jsonmarginX || 0),
        y: (
            ((transform.yoffset || 0) - rotated[1]) * (transform.scale || 1) +
            (transform.ypan || 0)
        ) * (transform.jsonres || 1) -
        (transform.jsonmarginY || 0)
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
    if (typeof win.proj4 === 'undefined') {
        error(21, false, this);
        return;
    }

    var normalized = {
            x: (
                (
                    point.x -
                    (transform.jsonmarginX || 0)
                ) / (transform.jsonres || 1) -
                (transform.xpan || 0)
            ) / (transform.scale || 1) +
            (transform.xoffset || 0),
            y: (
                (
                    -(point.y as any) - (transform.jsonmarginY || 0)
                ) / (transform.jsonres || 1) +
                (transform.ypan || 0)
            ) / (transform.scale || 1) +
            (transform.yoffset || 0)
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
    var transforms = this.mapTransforms,
        transform;

    if (!transforms) {
        error(22, false, this);
        return;
    }

    for (transform in transforms) {
        if (
            Object.hasOwnProperty.call(transforms, transform) &&
            transforms[transform].hitZone &&
            pointInPolygon(
                { x: point.x, y: -(point.y as any) },
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
    var transforms = this.mapTransforms,
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
                { x: coords.x, y: -(coords.y as any) },
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

/**
 * Highmaps only. Restructure a GeoJSON object in preparation to be read
 * directly by the
 * {@link https://api.highcharts.com/highmaps/plotOptions.series.mapData|series.mapData}
 * option. The GeoJSON will be broken down to fit a specific Highcharts type,
 * either `map`, `mapline` or `mappoint`. Meta data in GeoJSON's properties
 * object will be copied directly over to {@link Point.properties} in Highmaps.
 *
 * @requires modules/map
 *
 * @sample maps/demo/geojson/
 *         Simple areas
 * @sample maps/demo/geojson-multiple-types/
 *         Multiple types
 *
 * @function Highcharts.geojson
 *
 * @param {Highcharts.GeoJSON} geojson
 *        The GeoJSON structure to parse, represented as a JavaScript object
 *        rather than a JSON string.
 *
 * @param {string} [hType=map]
 *        The Highmaps series type to prepare for. Setting "map" will return
 *        GeoJSON polygons and multipolygons. Setting "mapline" will return
 *        GeoJSON linestrings and multilinestrings. Setting "mappoint" will
 *        return GeoJSON points and multipoints.
 *
 * @return {Array<*>}
 *         An object ready for the `mapData` option.
 */
H.geojson = function (
    geojson: Highcharts.GeoJSON,
    hType?: string,
    series?: Series
): Array<any> {
    var mapData = [] as Array<any>,
        path = [] as SVGPath,
        polygonToPath = function (polygon: Array<Array<number>>): void {
            polygon.forEach((point, i): void => {
                if (i === 0) {
                    path.push(['M', point[0], -point[1]]);
                } else {
                    path.push(['L', point[0], -point[1]]);
                }
            });
        };

    hType = hType || 'map';

    geojson.features.forEach(function (feature: any): void {

        var geometry = feature.geometry,
            type = geometry.type,
            coordinates = geometry.coordinates,
            properties = feature.properties,
            point: (
                Highcharts.MapCoordinateObject|
                Highcharts.MapPathObject|
                undefined
            );

        path = [];

        if (hType === 'map' || hType === 'mapbubble') {
            if (type === 'Polygon') {
                coordinates.forEach(polygonToPath);
                path.push(['Z']);

            } else if (type === 'MultiPolygon') {
                coordinates.forEach(function (
                    items: Array<Array<Array<number>>>
                ): void {
                    items.forEach(polygonToPath);
                });
                path.push(['Z']);
            }

            if (path.length) {
                point = { path: path };
            }

        } else if (hType === 'mapline') {
            if (type === 'LineString') {
                polygonToPath(coordinates);
            } else if (type === 'MultiLineString') {
                coordinates.forEach(polygonToPath);
            }

            if (path.length) {
                point = { path: path };
            }

        } else if (hType === 'mappoint') {
            if (type === 'Point') {
                point = {
                    x: coordinates[0],
                    y: -coordinates[1]
                };
            }
        }
        if (point) {
            mapData.push(extend(point, {
                name: properties.name || properties.NAME,

                /**
                 * In Highmaps, when data is loaded from GeoJSON, the GeoJSON
                 * item's properies are copied over here.
                 *
                 * @requires modules/map
                 * @name Highcharts.Point#properties
                 * @type {*}
                 */
                properties: properties
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
    credits: Highcharts.CreditsOptions
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
