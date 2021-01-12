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
const { extend } = U;

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

    public options: MapPointOptions = void 0 as any;

    public path: SVGPath = void 0 as any;

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
        const point: (MapPoint&MapPoint.CacheObject) = this,
            series = point.series;

        series.xAxis.setExtremes(
            point._minX,
            point._maxX,
            false
        );
        series.yAxis.setExtremes(
            point._minY,
            point._maxY,
            false
        );
        series.chart.redraw();
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface MapPoint extends ScatterPoint, Highcharts.ColorMapPoint {
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
        _foundBox?: boolean;
        _i?: number;
        _maxX?: number;
        _maxY?: number;
        _midX?: number;
        _midY?: number;
        _minX?: number;
        _minY?: number;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPoint;
