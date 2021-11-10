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

/* *
 *
 *  Imports
 *
 * */

import type ColorMapComposition from '../ColorMapComposition';
import type MapPointOptions from './MapPointOptions';
import type MapSeries from './MapSeries';
import type { MapBounds } from '../../Maps/MapViewOptions';
import type PointerEvent from '../../Core/PointerEvent';

import Projection from '../../Maps/Projection.js';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import { GeoJSONGeometryMultiPoint } from '../../Maps/GeoJSON';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    // indirect dependency to keep product size low
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class MapPoint extends ScatterSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public colorInterval?: unknown;

    public geometry?: GeoJSONGeometryMultiPoint;

    public labelrank?: number;

    public options: MapPointOptions = void 0 as any;

    public path: SVGPath = void 0 as any;

    public projectedPath: SVGPath|undefined;

    public series: MapSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    // Get the projected path based on the geometry. May also be called on
    // mapData options (not point instances), hence static.
    public static getProjectedPath(
        point: MapPoint,
        projection?: Projection
    ): SVGPath {
        if (!point.projectedPath) {
            if (projection && point.geometry) {

                // Always true when given GeoJSON coordinates
                projection.hasCoordinates = true;

                point.projectedPath = projection.path(point.geometry);

            // SVG path given directly in point options
            } else {
                point.projectedPath = point.path;
            }
        }
        return point.projectedPath || [];
    }

    /**
     * Extend the Point object to split paths.
     * @private
     */
    public applyOptions(
        options: (MapPointOptions|PointShortOptions),
        x?: number
    ): MapPoint {

        let series = this.series,
            point: MapPoint = (
                super.applyOptions.call(this, options, x) as any
            ),
            joinBy = series.joinBy,
            mapPoint;

        if (series.mapData && series.mapMap) {
            const joinKey = joinBy[1];
            const mapKey = super.getNestedProperty.call(point, joinKey) as string;
            mapPoint = typeof mapKey !== 'undefined' &&
                series.mapMap[mapKey];
            if (mapPoint) {
                extend(point, mapPoint); // copy over properties
            } else {
                point.value = point.value || null;
            }
        }

        return point;
    }

    /*
     * Get the bounds in terms of projected units
     * @param projection
     * @return MapBounds|undefined The computed bounds
     */
    public getProjectedBounds(projection: Projection): MapBounds|undefined {
        const path = MapPoint.getProjectedPath(this, projection),
            properties = this.properties;

        let x2 = -Number.MAX_VALUE,
            x1 = Number.MAX_VALUE,
            y2 = -Number.MAX_VALUE,
            y1 = Number.MAX_VALUE,
            validBounds;

        path.forEach((seg): void => {
            const x = seg[seg.length - 2];
            const y = seg[seg.length - 1];
            if (
                typeof x === 'number' &&
                typeof y === 'number'
            ) {
                x1 = Math.min(x1, x);
                x2 = Math.max(x2, x);
                y1 = Math.min(y1, y);
                y2 = Math.max(y2, y);
                validBounds = true;
            }
        });

        if (validBounds) {

            // Cache point bounding box for use to position data labels, bubbles
            // etc
            const propMiddleX = properties && properties['hc-middle-x'],
                midX = (
                    x1 + (x2 - x1) * pick(
                        this.middleX,
                        isNumber(propMiddleX) ? propMiddleX : 0.5
                    )
                ),
                propMiddleY = properties && properties['hc-middle-y'];

            let middleYFraction = pick(
                this.middleY,
                isNumber(propMiddleY) ? propMiddleY : 0.5
            );
            // No geographic geometry, only path given => flip
            if (!this.geometry) {
                middleYFraction = 1 - middleYFraction;
            }

            const midY = y2 - (y2 - y1) * middleYFraction;

            return { midX, midY, x1, y1, x2, y2 };
        }
    }

    /**
     * Stop the fade-out
     * @private
     */
    public onMouseOver(e?: PointerEvent): void {
        U.clearTimeout(this.colorInterval as any);
        if (this.value !== null || this.series.options.nullInteraction) {
            super.onMouseOver.call(this, e);
        } else {
            // #3401 Tooltip doesn't hide when hovering over null points
            (this.series.onMouseOut as any)(e);
        }
    }

    /**
     * Highmaps only. Zoom in on the point using the global animation.
     *
     * @sample maps/members/point-zoomto/
     *         Zoom to points from butons
     *
     * @requires modules/map
     *
     * @function Highcharts.Point#zoomTo
     */
    public zoomTo(): void {
        const point = this as (MapPoint&MapPoint.CacheObject);
        const chart = point.series.chart;

        if (chart.mapView && point.bounds) {
            chart.mapView.fitToBounds(point.bounds, void 0, false);

            point.series.isDirty = true;
            chart.redraw();
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapPointProperties {
    [key: string]: number|string;
}

interface MapPoint extends ColorMapComposition.PointComposition {
    bounds?: MapBounds;
    dataLabelOnNull: ColorMapComposition.PointComposition['dataLabelOnNull'];
    isValid: ColorMapComposition.PointComposition['isValid'];
    middleX?: number;
    middleY?: number;
    properties?: MapPointProperties;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace MapPoint {
    export interface CacheObject {
        bounds?: MapBounds;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPoint;
