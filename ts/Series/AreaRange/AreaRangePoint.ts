/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AreaRangePointOptions from './AreaRangePointOptions';
import type AreaRangeSeries from './AreaRangeSeries';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGLabel from '../../Core/Renderer/SVG/SVGLabel';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    area: {
        prototype: {
            pointClass: AreaPoint,
            pointClass: {
                prototype: areaProto
            }
        }
    }
} = SeriesRegistry.seriesTypes;
import { defined, isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        /**
         * Range series only. The high or maximum value for each data point.
         */
        high?: number;

        /**
         * Range series only. The low or minimum value for each data point.
         */
        low?: number;

        /** @internal */
        plotHigh?: number;

        /** @internal */
        plotLow?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class AreaRangePoint extends AreaPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public _plotY?: number;

    /** @internal */
    public below?: boolean;

    /** @internal */
    public dataLabelUpper?: SVGElement|SVGLabel;

    /** @internal */
    public isInside?: boolean;

    /** @internal */
    public isTopInside?: boolean;

    /** @internal */
    public high!: number;

    /** @internal */
    public low!: number;

    public options!: AreaRangePointOptions;

    /** @internal */
    public origProps?: Partial<AreaRangePoint>;

    /** @internal */
    public plotHigh?: number;

    /** @internal */
    public plotLow?: number;

    /** @internal */
    public plotHighX?: number;

    /** @internal */
    public plotLowX?: number;

    /** @internal */
    public plotX!: number;

    /** @internal */
    public series!: AreaRangeSeries;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @internal
     */
    public setState(): void {
        const prevState = this.state,
            series = this.series,
            isPolar = series.chart.polar;


        if (!defined(this.plotHigh)) {
            // Boost doesn't calculate plotHigh
            this.plotHigh = series.yAxis.toPixels(this.high, true);
        }

        if (!defined(this.plotLow)) {
            // Boost doesn't calculate plotLow
            this.plotLow = this.plotY = series.yAxis.toPixels(this.low, true);
        }

        series.lowerStateMarkerGraphic = series.stateMarkerGraphic;
        series.stateMarkerGraphic = series.upperStateMarkerGraphic;

        // Change state also for the top marker
        this.graphic = this.graphics && this.graphics[1];
        this.plotY = this.plotHigh;

        if (isPolar && isNumber(this.plotHighX)) {
            this.plotX = this.plotHighX;
        }

        // Top state:
        areaProto.setState.apply(this, arguments as any);

        this.state = prevState;

        // Now restore defaults
        this.plotY = this.plotLow;
        this.graphic = this.graphics && this.graphics[0];

        if (isPolar && isNumber(this.plotLowX)) {
            this.plotX = this.plotLowX;
        }

        series.upperStateMarkerGraphic = series.stateMarkerGraphic;
        series.stateMarkerGraphic = series.lowerStateMarkerGraphic;
        // Lower marker is stored at stateMarkerGraphic
        // to avoid reference duplication (#7021)
        series.lowerStateMarkerGraphic = void 0;

        const originalSettings = series.modifyMarkerSettings();

        // Bottom state
        areaProto.setState.apply(this, arguments as any);

        // Restore previous state
        series.restoreMarkerSettings(originalSettings);
    }

    /** @internal */
    public haloPath(): SVGPath {
        const isPolar = this.series.chart.polar;

        let path: SVGPath = [];

        // Bottom halo
        this.plotY = this.plotLow;
        if (isPolar && isNumber(this.plotLowX)) {
            this.plotX = this.plotLowX;
        }

        if (this.isInside) {
            path = areaProto.haloPath.apply(this, arguments);
        }

        // Top halo
        this.plotY = this.plotHigh;
        if (isPolar && isNumber(this.plotHighX)) {
            this.plotX = this.plotHighX;
        }
        if (this.isTopInside) {
            path = path.concat(
                areaProto.haloPath.apply(this, arguments)
            );
        }

        return path;
    }

    /** @internal */
    public isValid(): boolean {
        return isNumber(this.low) && isNumber(this.high);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AreaRangePoint;

/* *
 *
 *  API Options
 *
 * */

/**
 * Range series only. The high or maximum value for each data point.
 *
 * @name Highcharts.Point#high
 * @type {number|undefined}
 */
/**
 * Range series only. The low or minimum value for each data point.
 *
 * @name Highcharts.Point#low
 * @type {number|undefined}
 */

''; // Keeps doclets above in JS file.
