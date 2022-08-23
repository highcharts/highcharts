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

import type LollipopPointOptions from './LollipopPointOptions';
import type LollipopSeries from './LollipopSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: {
                prototype: pointProto
            }
        }
    },
    seriesTypes: {
        area: {
            prototype: areaProto
        },
        dumbbell: {
            prototype: {
                pointClass: DumbbellPoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    isObject,
    extend,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class LollipopPoint extends DumbbellPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: LollipopPointOptions = void 0 as any;

    public series: LollipopSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        _series: LollipopSeries,
        options: LollipopPointOptions,
        _x?: number
    ): typeof pointProto {
        if (isObject(options) && 'low' in options) {
            options.y = options.low;
            delete options.low;
        }
        return pointProto.init.apply(this, arguments);
    }

    /**
     * Extend the series' setState method by setting fill color of markers.
     * @private
     *
     * @function Highcharts.Series#drawPoints
     *
     * @param {Highcharts.Series} this The series of points.
     *
     */
    public setState(): void {
        const point = this,
            series = point.series,
            chart = series.chart,
            seriesLowColor = series.options.lowColor,
            seriesMarker = series.options.marker,
            pointOptions = point.options,
            pointLowColor = pointOptions.lowColor,
            zoneColor = point.zone && point.zone.color,
            lowerGraphicColor = pick(
                pointLowColor,
                seriesLowColor,
                pointOptions.marker ? pointOptions.marker.fillColor : void 0,
                seriesMarker ? seriesMarker.fillColor : void 0,
                pointOptions.color,
                zoneColor,
                point.color,
                series.color
            );

        DumbbellPoint.prototype.setState.apply(point, arguments as any);

        if (!point.state && point.lowerGraphic && !chart.styledMode) {
            point.lowerGraphic.attr({
                fill: lowerGraphicColor
            });
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface LollipopPoint {
    pointSetState: typeof areaProto.pointClass.prototype.setState;
}

extend(LollipopPoint.prototype, {
    pointSetState: areaProto.pointClass.prototype.setState,
    // Does not work with the inherited `isvalid`
    isValid: pointProto.isValid
});

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPoint;
