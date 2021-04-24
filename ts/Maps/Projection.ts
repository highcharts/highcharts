/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { GeoJSONGeometry, LonLatArray } from 'GeoJSON';
import type ProjectionOptions from 'ProjectionOptions';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
const {
    correctFloat,
    error,
    pick
} = U;


export default class Projection {

    public options: ProjectionOptions;
    public isNorthPositive: boolean = false;

    private antimeridian?: number;

    // Calculate the great circle between two given coordinates
    public static greatCircle(
        point1: LonLatArray,
        point2: LonLatArray
    ): LonLatArray[]|undefined {
        const deg2rad = Math.PI * 2 / 360;
        const { atan2, cos, sin, sqrt } = Math;
        const lat1 = point1[1] * deg2rad;
        const lon1 = point1[0] * deg2rad;
        const lat2 = point2[1] * deg2rad;
        const lon2 = point2[0] * deg2rad;

        const deltaLat = lat2 - lat1;
        const deltaLng = lon2 - lon1;

        const calcA = sin(deltaLat / 2) * sin(deltaLat / 2) +
            cos(lat1) * cos(lat2) * sin(deltaLng / 2) * sin(deltaLng / 2);
        const calcB = 2 * atan2(sqrt(calcA), sqrt(1 - calcA));

        const distance = calcB * 6371e3; // in meters
        const jumps = Math.round(distance / 500000); // 500 km each jump

        if (jumps > 1) {
            const step = 1 / jumps;

            const lineString: LonLatArray[] = [];

            for (
                let fraction = step;
                fraction < 0.999; // Account for float errors
                fraction += step
            ) {
                const A = sin((1 - fraction) * calcB) / sin(calcB);
                const B = sin(fraction * calcB) / sin(calcB);

                const x = A * cos(lat1) * cos(lon1) + B * cos(lat2) * cos(lon2);
                const y = A * cos(lat1) * sin(lon1) + B * cos(lat2) * sin(lon2);
                const z = A * sin(lat1) + B * sin(lat2);

                const lat3 = atan2(z, sqrt(x * x + y * y));
                const lon3 = atan2(y, x);
                lineString.push([lon3 / deg2rad, lat3 / deg2rad]);
            }

            return lineString;
        }
    }

    public static toString(
        options?: DeepPartial<ProjectionOptions>
    ): string|undefined {
        const {
            lat0 = 0,
            latTS,
            lon0 = 0,
            over,
            projString,
            projectionName,
            x0 = 0,
            y0 = 0
        } = options || {};

        if (projString) {
            return projString;
        }

        if (projectionName) {
            let projString = `+proj=${projectionName} +lon_0=${lon0} ` +
                `+lat_0=${lat0} +x_0=${x0} +y_0=${y0}`;
            if (over) {
                projString += ' +over';
            }
            if (latTS !== void 0) {
                projString += ` +lat_ts=${latTS}`;
            }
            return projString;
        }
    }

    public constructor(options?: ProjectionOptions) {
        this.options = options || {};
        const { d3, proj4 } = options || {};

        // @todo: Better filter for when to handle antimeridian
        if (this.options.lon0 && this.options.projectionName !== 'ortho') {
            this.antimeridian = (this.options.lon0 + 360) % 360 - 180;
        }

        // Set up proj4 based projection
        if (proj4) {
            const projString = Projection.toString(options);

            if (projString) {
                const projection = proj4(projString);

                this.forward = projection.forward;
                this.inverse = projection.inverse;

                if (this.options.projString === 'EPSG:3857') {
                    this.maxLatitude = 85.0511287798;
                } else if (this.options.projectionName === 'eqc') {
                    this.maxLatitude = 89.9999999999;
                }

                this.isNorthPositive = true;
            }

        // Set up d3-geo based projection
        } else if (d3) {
            const {
                lat0 = 0,
                lon0 = 0,
                projectionName,
                projString
            } = this.options;

            let projection = d3.geoEquirectangular();
            if (projectionName === 'mill') {
                projection = d3.geoMiller();
            } else if (projectionName === 'ortho') {
                projection = d3.geoOrthographic();
            } else if (projectionName === 'robin') {
                projection = d3.geoRobinson();
            } else if (
                projectionName === 'webmerc' ||
                projString === 'EPSG:3857'
            ) {
                projection = d3.geoMercator();
            } else {
                error('Projection unknown to d3 adapter, falling back to equirectangular', false);
            }
            projection.rotate([-lon0, -lat0]);

            this.isNorthPositive = false;

            // Overrides
            this.forward = (lonLat: LonLatArray): [number, number] =>
                projection(lonLat);
            this.inverse = (p: [number, number]): LonLatArray =>
                projection.invert(p);

            const geoPath = d3.geoPath(projection);
            this.path = (geometry: GeoJSONGeometry): SVGPath => {

                const path = geoPath({
                    type: 'Feature',
                    geometry
                });

                // @todo: Why can't I imp\ort splitPath directly from MapChart?
                return path ? (H as any).MapChart.splitPath(path) : [];
            };

        }
    }

    // Project a lonlat coordinate position to xy. Dynamically overridden when
    // projection is set
    public forward(lonLat: [number, number]): [number, number] {
        return lonLat;
        // Flips y because the path option uses the SVG coordinate system with
        // origin in top left, while geo coordinates use origin in bottom left.
        // return [lonLat[0], -lonLat[1]];
    }

    // Project an xy chart coordinate position to lonlat. Dynamically overridden
    // when projection is set
    public inverse(xy: [number, number]): [number, number] {
        return xy;
        // Flips y because the path option uses the SVG coordinate system with
        // origin in top left, while geo coordinates use origin in bottom left.
        // return [xy[0], -xy[1]];
    }

    public maxLatitude = 90;

    private clipOnAntimeridian(
        poly: Highcharts.LonLatArray[],
        isPolygon: boolean
    ): Highcharts.LonLatArray[][] {
        const antimeridian = pick(this.antimeridian, 180);
        const intersections: {
            i: number;
            distance: number;
            previousLonLat: Highcharts.LonLatArray;
            lonLat: Highcharts.LonLatArray;
        }[] = [];
        const polygons: Highcharts.LonLatArray[][] = [poly];

        poly.forEach((lonLat, i): void => {
            let previousLonLat = poly[i - 1];
            if (!i) {
                if (!isPolygon) {
                    return;
                }
                // Else, wrap to beginning
                previousLonLat = poly[poly.length - 1];
            }
            const lon1 = previousLonLat[0];
            const lon2 = lonLat[0];

            // Subtract the antimeridian and restrain to -180 - 180
            const lon1Adjusted = (lon1 - antimeridian - 540) % 360 + 180;
            const lon2Adjusted = (lon2 - antimeridian - 540) % 360 + 180;

            if (
                // Both points, after rotating for antimeridian, are
                // in  the front facing hemisphere...
                lon1Adjusted > -90 && lon1Adjusted < 90 &&
                lon2Adjusted > -90 && lon2Adjusted < 90 &&
                // ... and on either side of 0
                (lon1Adjusted >= 0) !== (lon2Adjusted >= 0)
            ) {
                // Simplified measure of distance from the equator
                const distance = Math.abs(previousLonLat[1] + lonLat[1]) / 2;

                intersections.push({
                    i,
                    distance,
                    previousLonLat,
                    lonLat
                });
            }
        });

        if (intersections.length) {
            if (isPolygon) {

                // Simplified use of the even-odd rule, if there is an odd
                // amount of intersections between the polygon and the
                // antimeridian, the pole is inside the polygon. Applies
                // primarily to Antarctica.
                let closest;
                if (intersections.length % 2 === 1) {
                    closest = (
                        intersections[0].distance >
                        intersections[intersections.length - 1].distance
                    ) ?
                        intersections.shift() :
                        intersections.pop();

                    /*
                    poly.splice(
                        intersection.i,
                        0,
                        [intersection.previousLonLat[0], -this.maxLatitude],
                        [intersection.lonLat[0], -this.maxLatitude]
                    );
                    */

                }


                // Pull out slices of the polygon that is on the opposite side
                // of the antimeridian compared to the starting point
                let i = intersections.length - 2;
                while (i >= 0) {
                    const index = intersections[i].i;
                    polygons.push(
                        poly.splice(index, intersections[i + 1].i - index)
                    );

                    i -= 2;
                }

                // Insert dummy points close to the pole
                if (closest) {
                    i = poly.indexOf(closest.lonLat);

                    poly.splice(
                        i,
                        0,
                        [closest.previousLonLat[0], -this.maxLatitude],
                        [closest.lonLat[0], -this.maxLatitude]
                    );
                }
            } else {
                let i = intersections.length;
                while (i--) {
                    const index = intersections[i].i;
                    polygons.push(poly.splice(index, poly.length));
                }
            }
        }

        // Draw fake lines to the pole from the intersection closest to the pole
        /*
        if (intersections.length % 2 === 1) {
            intersections.sort((a, b): number => b.distance - a.distance);

            for (let i = 0; i < intersections.length; i++) {
                const intersection = intersections[i];
                // For the closest instersection, draw fake lines towards the
                // pole
                if (i === 0) {
                    poly.splice(
                        intersection.i,
                        0,
                        [intersection.previousLonLat[0], -this.maxLatitude],
                        [intersection.lonLat[0], -this.maxLatitude]
                    );

                // Insert gaps
                } else {
                    (intersection.lonLat as any).moveTo = true;
                }
            }

            return true;
        }
        return false;
        */
        // console.log(polygons)
        return polygons;
    }


    // Take a GeoJSON geometry and return a translated SVGPath
    public path(geometry: GeoJSONGeometry): SVGPath {

        const path: SVGPath = [];
        const isPolygon = geometry.type === 'Polygon' ||
            geometry.type === 'MultiPolygon';


        // @todo: It doesn't really have to do with whether north is
        // positive. It depends on whether the coordinates are
        // pre-projected.
        const isGeographicCoordinates = this.isNorthPositive;

        const addToPath = (
            polygon: LonLatArray[]
        ): void => {

            // @todo Roundoff error with the test dataset, or with proj4 that
            // doesn't correctly wrap. Causing problems with translation and
            // filling Antarctica
            const poly = polygon.map((lonLat): Highcharts.LonLatArray => {
                lonLat[0] = correctFloat(lonLat[0]);
                return lonLat;
            });

            let polygons = [poly];


            if (isGeographicCoordinates) {

                // Insert great circles into long straight lines
                let i = poly.length - 1;
                while (i--) {

                    // Distance in degrees, either in lon or lat. Avoid heavy
                    // calculation of true distance.
                    const roughDistance = Math.max(
                        Math.abs(poly[i][0] - poly[i + 1][0]),
                        Math.abs(poly[i][1] - poly[i + 1][1])
                    );
                    if (roughDistance > 10) {
                        const greatCircle = Projection.greatCircle(
                            poly[i],
                            poly[i + 1]
                        );
                        if (greatCircle) {
                            poly.splice(i + 1, 0, ...greatCircle);
                        }
                    }
                }

                // @todo better test for when to do this
                if (this.options.projectionName !== 'ortho') {
                    polygons = this.clipOnAntimeridian(poly, isPolygon);
                }
            }

            polygons.forEach((poly): void => {
                if (poly.length < 2) {
                    return;
                }

                let movedTo = false;
                let firstValidLonLat: LonLatArray|undefined;
                let lastValidLonLat: LonLatArray|undefined;
                let gap = false;
                const pushToPath = (point: [number, number]): void => {
                    if (!movedTo) {
                        path.push(['M', point[0], -point[1]]);
                        movedTo = true;
                    } else {
                        path.push(['L', point[0], -point[1]]);
                    }
                };

                for (let i = 0; i < poly.length; i++) {
                    const lonLat = poly[i];

                    const point = this.forward(lonLat);

                    const valid = (
                        !isNaN(point[0]) &&
                        !isNaN(point[1]) &&
                        (
                            !isGeographicCoordinates ||
                            // Limited projections like Web Mercator
                            (
                                lonLat[1] <= this.maxLatitude &&
                                lonLat[1] >= -this.maxLatitude
                            )
                        )
                    );

                    if (valid) {

                        // In order to be able to interpolate if the first or
                        // last point is invalid (on the far side of the globe
                        // in an orthographic projection), we need to push the
                        // first valid point to the end of the polygon.
                        if (isPolygon && !firstValidLonLat) {
                            firstValidLonLat = lonLat;
                            poly.push(lonLat);
                        }

                        // When entering the first valid point after a gap of
                        // invalid points, typically on the far side of the
                        // globe in an orthographic projection.
                        if (gap && lastValidLonLat) {

                            // For areas, in an orthographic projection, the
                            // great circle between two visible points will be
                            // close to the horizon. A possible exception may be
                            // when the two points are on opposite sides of the
                            // globe. It that poses a problem, we may have to
                            // rewrite this to use the small circle related to
                            // the current lon0 and lat0.
                            if (isPolygon && isGeographicCoordinates) {
                                const greatCircle = Projection.greatCircle(
                                    lastValidLonLat,
                                    lonLat
                                );
                                if (greatCircle) {
                                    greatCircle.forEach((lonLat): void =>
                                        pushToPath(this.forward(lonLat)));
                                }

                            // For lines, just jump over the gap
                            } else {
                                movedTo = false;
                            }
                        }

                        pushToPath(point);

                        lastValidLonLat = lonLat;
                        gap = false;
                    } else {
                        gap = true;
                    }
                }
            });
        };

        if (geometry.type === 'LineString') {
            addToPath(geometry.coordinates);

        } else if (geometry.type === 'MultiLineString') {
            geometry.coordinates.forEach((c): void => addToPath(c));

        } else if (geometry.type === 'Polygon') {
            geometry.coordinates.forEach((c): void => addToPath(c));
            if (path.length) {
                path.push(['Z']);
            }

        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach((polygons): void => {
                polygons.forEach((c): void => addToPath(c));
            });
            if (path.length) {
                path.push(['Z']);
            }

        }
        return path;
    }
}
