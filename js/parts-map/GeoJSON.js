/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Chart.js';
var Chart = H.Chart,
    each = H.each,
    extend = H.extend,
    format = H.format,
    merge = H.merge,
    win = H.win,
    wrap = H.wrap;
/**
 * Test for point in polygon. Polygon defined as array of [x,y] points.
 */
function pointInPolygon(point, polygon) {
    var i,
        j,
        rel1,
        rel2,
        c = false,
        x = point.x,
        y = point.y;

    for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        rel1 = polygon[i][1] > y;
        rel2 = polygon[j][1] > y;
        if (
            rel1 !== rel2 &&
            (
                x < (polygon[j][0] -
                    polygon[i][0]) * (y - polygon[i][1]) /
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
 * @function transformFromLatLon
 * @memberOf Chart.prototype
 *
 * @param  {Object} latLon
 *         A latitude/longitude object.
 * @param  {Number} latLon.lat
 *         The latitude.
 * @param  {Number} latLon.lon
 *         The longitude.
 * @param  {Object} transform
 *         The transform definition to use as explained in the {@link
 *         https://www.highcharts.com/docs/maps/latlon|documentation}.
 *
 * @return {Object}
 *         An object with `x` and `y` properties.
 *
 * @sample maps/series/latlon-transform/
 *         Use specific transformation for lat/lon
 */
Chart.prototype.transformFromLatLon = function (latLon, transform) {
    if (win.proj4 === undefined) {
        H.error(21);
        return {
            x: 0,
            y: null
        };
    }

    var projected = win.proj4(transform.crs, [latLon.lon, latLon.lat]),
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
 * @function transformToLatLon
 * @memberOf Chart.prototype
 *
 * @param  {Point|Object} point
 *         A `Point` instance, or or any object containing the properties `x`
 *         and `y` with numeric values.
 * @param  {Object} transform
 *         The transform definition to use as explained in the {@link
 *         https://www.highcharts.com/docs/maps/latlon|documentation}.
 *
 * @return {Object}
 *         An object with `lat` and `lon` properties.
 *
 * @sample maps/series/latlon-transform/
 *         Use specific transformation for lat/lon
 *
 */
Chart.prototype.transformToLatLon = function (point, transform) {
    if (win.proj4 === undefined) {
        H.error(21);
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
                    -point.y - (transform.jsonmarginY || 0)
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
 * @function fromPointToLatLon
 * @memberOf Chart.prototype
 *
 * @param  {Point|Object} point
 *         A `Point` instance or anything containing `x` and `y` properties
 *         with numeric values
 * @return {Object}
 *         An object with `lat` and `lon` properties.
 *
 * @sample maps/demo/latlon-advanced/
 *         Advanced lat/lon demo
 */
Chart.prototype.fromPointToLatLon = function (point) {
    var transforms = this.mapTransforms,
        transform;

    if (!transforms) {
        H.error(22);
        return;
    }

    for (transform in transforms) {
        if (
            transforms.hasOwnProperty(transform) &&
            transforms[transform].hitZone &&
            pointInPolygon(
                { x: point.x, y: -point.y },
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
 * @function fromLatLonToPoint
 * @memberOf Chart.prototype
 *
 * @param  {Object} latLon
 *         Coordinates.
 * @param  {Number} latLon.lat
 *         The latitude.
 * @param  {Number} latLon.lon
 *         The longitude.
 *
 * @sample maps/series/latlon-to-point/
 *         Find a point from lat/lon
 *
 * @return {Object}
 *         X and Y coordinates in terms of chart axis values.
 */
Chart.prototype.fromLatLonToPoint = function (latLon) {
    var transforms = this.mapTransforms,
        transform,
        coords;

    if (!transforms) {
        H.error(22);
        return {
            x: 0,
            y: null
        };
    }

    for (transform in transforms) {
        if (
            transforms.hasOwnProperty(transform) &&
            transforms[transform].hitZone
        ) {
            coords = this.transformFromLatLon(latLon, transforms[transform]);
            if (pointInPolygon(
                { x: coords.x, y: -coords.y },
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
 * directly by the {@link
 * https://api.highcharts.com/highmaps/plotOptions.series.mapData|
 * series.mapData} option. The GeoJSON will be broken down to fit a specific
 * Highcharts type, either `map`, `mapline` or `mappoint`. Meta data in
 * GeoJSON's properties object will be copied directly over to
 * {@link Point.properties} in Highmaps.
 *
 * @function #geojson
 * @memberOf Highcharts
 *
 * @param  {Object} geojson
 *         The GeoJSON structure to parse, represented as a JavaScript object
 *         rather than a JSON string.
 * @param  {String} [hType=map]
 *         The Highmaps series type to prepare for. Setting "map" will return
 *         GeoJSON polygons and multipolygons. Setting "mapline" will return
 *         GeoJSON linestrings and multilinestrings. Setting "mappoint" will
 *         return GeoJSON points and multipoints.
 *
 * @return {Object}
 *         An object ready for the `mapData` option.
 *
 * @sample maps/demo/geojson/
 *         Simple areas
 * @sample maps/demo/geojson-multiple-types/
 *         Multiple types
 *
 */
H.geojson = function (geojson, hType, series) {
    var mapData = [],
        path = [],
        polygonToPath = function (polygon) {
            var i,
                len = polygon.length;
            path.push('M');
            for (i = 0; i < len; i++) {
                if (i === 1) {
                    path.push('L');
                }
                path.push(polygon[i][0], -polygon[i][1]);
            }
        };

    hType = hType || 'map';

    each(geojson.features, function (feature) {

        var geometry = feature.geometry,
            type = geometry.type,
            coordinates = geometry.coordinates,
            properties = feature.properties,
            point;

        path = [];

        if (hType === 'map' || hType === 'mapbubble') {
            if (type === 'Polygon') {
                each(coordinates, polygonToPath);
                path.push('Z');

            } else if (type === 'MultiPolygon') {
                each(coordinates, function (items) {
                    each(items, polygonToPath);
                });
                path.push('Z');
            }

            if (path.length) {
                point = { path: path };
            }

        } else if (hType === 'mapline') {
            if (type === 'LineString') {
                polygonToPath(coordinates);
            } else if (type === 'MultiLineString') {
                each(coordinates, polygonToPath);
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
                 * @name #properties
                 * @memberOf Point
                 * @type {Object}
                 */
                properties: properties
            }));
        }

    });

    // Create a credits text that includes map source, to be picked up in
    // Chart.addCredits
    if (series && geojson.copyrightShort) {
        series.chart.mapCredits = format(
            series.chart.options.credits.mapText,
            { geojson: geojson }
        );
        series.chart.mapCreditsFull = format(
            series.chart.options.credits.mapTextFull,
            { geojson: geojson }
        );
    }

    return mapData;
};

/**
 * Override addCredits to include map source by default
 */
wrap(Chart.prototype, 'addCredits', function (proceed, credits) {

    credits = merge(true, this.options.credits, credits);

    // Disable credits link if map credits enabled. This to allow for in-text
    // anchors.
    if (this.mapCredits) {
        credits.href = null;
    }

    proceed.call(this, credits);

    // Add full map credits to hover
    if (this.credits && this.mapCreditsFull) {
        this.credits.attr({
            title: this.mapCreditsFull
        });
    }
});
