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

    public constructor(options?: ProjectionOptions) {
        this.options = options || {};
        const { proj4 } = options || {};
        if (proj4) {
            const projString = Projection.toString(options);

            if (projString) {
                const projection = proj4(projString);

                this.forward = projection.forward;
                this.inverse = projection.inverse;
            }
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

    public d3Path(geometry: GeoJSONGeometry): SVGPath {
        const { d3, lat0 = 0, lon0 = 0, projectionName } = this.options;
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
        const path = d3.geoPath(projection)({
            type: 'Feature',
            geometry
        });

        // @todo: Why can't I imp\ort splitPath directly from MapChart?
        return path ? (H as any).MapChart.splitPath(path) : [];
    }

    // Take a GeoJSON geometry and return a translated SVGPath
    public path(geometry: GeoJSONGeometry): SVGPath {

        if (this.options.d3) {
            return this.d3Path(geometry);
        }

        const path: SVGPath = [];

        const addToPath = (polygon: LonLatArray[]): void => {
            let movedTo: boolean;
            polygon.forEach((lonLat, i): void => {
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
