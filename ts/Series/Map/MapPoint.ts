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

import type MapPointOptions from './MapPointOptions';
import type MapSeries from './MapSeries';
import type PointerEvent from '../../Core/PointerEvent';

import Projection from '../../Maps/Projection.js';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type ScatterPoint from '../Scatter/ScatterPoint';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import ColorMapMixin from '../../Mixins/ColorMapSeries.js';
const { colorMapPointMixin } = ColorMapMixin;
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
    isArray
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

    public labelrank?: number;

    public options: MapPointOptions = void 0 as any;

    public path: SVGPath = void 0 as any;

    public projectedPath: SVGPath|undefined;

    public properties?: object;

    public series: MapSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /* @todo: Doesn't need to be static, it is always used with instance. And
    consider not returning the path, and not calling it get* */
    public static getProjectedPath(
        point: MapPoint,
        projection?: Projection
    ): SVGPath {
        if (!point.projectedPath) {
            if (projection && isArray((point as any).coordinates)) {

                // (point as any).coordinates.name = point.name

                point.projectedPath = projection.path({
                    type: (point as any).type,
                    coordinates: (point as any).coordinates
                });

                /*
            // Experimental! d3 projections
            if (
                isArray((point as any).coordinates) &&
                (win as any).geoPath
            ) {
                const path = (win as any).geoPath({
                    type: 'Feature',
                    geometry: {
                        type: (point as any).type,
                        coordinates: (point as any).coordinates
                    }
                });

                if (path) {
                    point.projectedPath = splitPath(path);
                }

            } else if (isArray(point.path) && projection) {
                point.projectedPath = point.path.map((seg): SVGPath.Segment => {
                    if (seg[0] === 'M' || seg[0] === 'L') {
                        const p = projection.forward({ x: seg[1], y: seg[2] });
                        return [seg[0], p.x, p.y];
                    }
                    return seg;
                });
            */

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

        var series = this.series,
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
                // This applies only to bubbles
                if ((series as any).xyFromShape) {
                    point.x = mapPoint._midX;
                    point.y = mapPoint._midY;
                }
                extend(point, mapPoint); // copy over properties
            } else {
                point.value = point.value || null;
            }
        }

        return point;
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
            chart.mapView.fitToBounds(point.bounds, false);

            point.series.isDirty = true;
            chart.redraw();
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface MapPoint extends ScatterPoint, Highcharts.ColorMapPoint {
    bounds?: Highcharts.MapBounds;
    dataLabelOnNull: typeof colorMapPointMixin.dataLabelOnNull;
    isValid: typeof colorMapPointMixin.isValid;
    setState: typeof colorMapPointMixin.setState;
}
extend(MapPoint.prototype, {
    dataLabelOnNull: colorMapPointMixin.dataLabelOnNull,
    isValid: colorMapPointMixin.isValid,
    setState: colorMapPointMixin.setState
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace MapPoint {
    export interface CacheObject {
        bounds?: Highcharts.MapBounds;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPoint;
