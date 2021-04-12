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
            }

        // Set up d3-geo based projection
        } else if (d3) {
            const { lat0 = 0, lon0 = 0, projectionName } = this.options;

            let projection = d3.geoEquirectangular();
            if (projectionName === 'mill') {
                projection = d3.geoMiller();
            } else if (projectionName === 'ortho') {
                projection = d3.geoOrthographic().rotate([-lon0, -lat0]);
            } else if (projectionName === 'robin') {
                projection = d3.geoRobinson();
            } else if (projectionName === 'webmerc') {
                projection = d3.geoMercator();
            } else {
                error('Projection unknown to d3 adapter, falling back to equirectangular', false);
            }

            this.forward = (lonLat: LonLatArray): [number, number] => {
                const p = projection(lonLat);
                return [p[0], -p[1]];
            };
            this.inverse = projection.invert;

            this.d3Projection = d3.geoPath(projection);
            this.path = this.d3Path;

        }
    }

    // Project a lonlat coordinate position to xy. Dynamically overridden when
    // projection is set
    public forward(lonlat: [number, number]): [number, number] {
        return lonlat;
    }

    // Project an xy chart coordinate position to lonlat. Dynamically overridden
    // when projection is set
    public inverse(xy: [number, number]): [number, number] {
        return xy;
    }

    // Take a GeoJSON geometry and return a translated SVGPath
    public path(geometry: GeoJSONGeometry): SVGPath {

        const path: SVGPath = [];

        // @todo: Better check
        const isPreProjected = !this.options.projectionName;

        const addToPath = (polygon: LonLatArray[]): void => {

            const poly = polygon.slice();

            if (!isPreProjected) {
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
            poly.forEach((lonLat): void => {
                const point = this.forward(lonLat);
                if (!isNaN(point[0]) && !isNaN(point[1])) {
                    if (!movedTo) {
                        path.push(['M', point[0], -point[1]]);
                        movedTo = true;
                    } else {
                        path.push(['L', point[0], -point[1]]);
                    }
                }
            });
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
