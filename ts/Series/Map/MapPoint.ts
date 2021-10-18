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

import GeoJSONGeometry from '../../Maps/GeoJSON';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    // indirect dependency to keep product size low
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend
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

    public geometry?: GeoJSONGeometry;

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

    /**
     * Extend the Point object to split paths.
     * @private
     */
    public applyOptions(
        options: (MapPointOptions|PointShortOptions),
        x?: number
    ): MapPoint {

        const series = this.series,
            point: MapPoint = (
                super.applyOptions.call(this, options, x) as any
            ),
            joinBy = series.joinBy;

        if (series.mapData && series.mapMap) {
            const joinKey = joinBy[1],
                mapKey = super.getNestedProperty.call(point, joinKey) as string,
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

    public getProjectedPath(projection?: Projection): SVGPath {
        if (!this.projectedPath) {
            if (projection && this.geometry) {

                // Always true when given GeoJSON coordinates
                projection.hasCoordinates = true;

                this.projectedPath = projection.path(this.geometry);

            // SVG path given directly in point options
            } else {
                this.projectedPath = this.path;
            }
        }
        return this.projectedPath || [];
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

interface MapPoint extends ColorMapComposition.PointComposition {
    bounds?: MapBounds;
    dataLabelOnNull: ColorMapComposition.PointComposition['dataLabelOnNull'];
    isValid: ColorMapComposition.PointComposition['isValid'];
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
