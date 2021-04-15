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
    error
} = U;

export default class Projection {

    public options: ProjectionOptions;
    public isNorthPositive: boolean = false;

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

            for (let fraction = step; fraction < 1; fraction += step) {
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
            return projString;
        }
    }

    private d3Projection: any;

    // Override for this.path when d3 is enabled
    private d3Path(geometry: GeoJSONGeometry): SVGPath {

        const path = this.d3Projection({
            type: 'Feature',
            geometry
        });

        // @todo: Why can't I imp\ort splitPath directly from MapChart?
        return path ? (H as any).MapChart.splitPath(path) : [];
    }

    public constructor(options?: ProjectionOptions) {
        this.options = options || {};
        const { d3, proj4 } = options || {};

        // Set up proj4 based projection
        if (proj4) {
            const projString = Projection.toString(options);

            if (projString) {
                const projection = proj4(projString);

                this.forward = projection.forward;
                this.inverse = projection.inverse;

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
                projection = d3.geoOrthographic().rotate([-lon0, -lat0]);
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

            this.forward = (lonLat: LonLatArray): [number, number] =>
                projection(lonLat);
            this.inverse = (p: [number, number]): LonLatArray =>
                projection.invert(p);

            this.d3Projection = d3.geoPath(projection);
            this.path = this.d3Path;

            this.isNorthPositive = false;

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

    // Take a GeoJSON geometry and return a translated SVGPath
    public path(geometry: GeoJSONGeometry): SVGPath {

        const path: SVGPath = [];
        const isPolygon = geometry.type === 'Polygon' ||
            geometry.type === 'MultiPolygon';
        // @todo: It doesn't really have to do with whether north is
        // positive. It depends on whether the coordinates are
        // pre-projected.
        const isGeographicCoordinates = this.isNorthPositive;


        const addToPath = (polygon: LonLatArray[]): void => {

            const poly = polygon.slice();

            if (isGeographicCoordinates) {
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
            }

            let movedTo = false;
            let lastValidLonLat: LonLatArray|undefined;
            let firstValidLonLatAppended = false;
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
                if (!isNaN(point[0]) && !isNaN(point[1])) {

                    // In order to be able to interpolate if the first or last
                    // point is invalid (on the far side of the globe in an
                    // orthographic projection), we need to push the first valid
                    // point.
                    if (isPolygon && !firstValidLonLatAppended) {
                        poly.push(lonLat);
                        firstValidLonLatAppended = true;
                    }

                    // When entering the first valid point after a gap of
                    // invalid points, typically on the far side of the globe
                    // in an orthographic projection.
                    if (gap && lastValidLonLat) {

                        // For areas, in an orthographic projection, the great
                        // circle between two visible points will be close to
                        // the horizon. A possible exception may be when the two
                        // points are on opposite sides of the globe. It that
                        // poses a problem, we may have to rewrite this to use
                        // the small circle related to the current lon0 and
                        // lat0.
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
        };

        if (geometry.type === 'LineString') {
            addToPath(geometry.coordinates);

        } else if (geometry.type === 'MultiLineString') {
            geometry.coordinates.forEach(addToPath);

        } else if (geometry.type === 'Polygon') {
            geometry.coordinates.forEach(addToPath);
            if (path.length) {
                path.push(['Z']);
            }

        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach((polygons): void => {
                polygons.forEach(addToPath);
            });
            if (path.length) {
                path.push(['Z']);
            }

        }
        return path;
    }
}
