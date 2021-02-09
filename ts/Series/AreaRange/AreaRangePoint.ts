/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AreaRangePointOptions from './AreaRangePointOptions';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import AreaRangeSeries from './AreaRangeSeries.js';
import AreaSeries from '../Area/AreaSeries.js';
import Point from '../../Core/Series/Point.js';
const { prototype: pointProto } = Point;
import U from '../../Core/Utilities.js';
const {
    defined,
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        plotHigh?: AreaRangePoint['plotHigh'];
        plotLow?: AreaRangePoint['plotLow'];
    }
}

/* *
 *
 *  Class
 *
 * */

class AreaRangePoint extends AreaSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public _plotY?: number;
    public below?: boolean;
    public dataLabelUpper?: SVGElement;
    public isInside?: boolean;
    public isTopInside?: boolean;
    public high: number = void 0 as any;
    public low: number = void 0 as any;
    public lowerGraphic?: SVGElement;
    public options: AreaRangePointOptions = void 0 as any;
    public origProps?: object;
    public plotHigh: number = void 0 as any;
    public plotLow: number = void 0 as any;
    public plotHighX: number = void 0 as any;
    public plotLowX: number = void 0 as any;
    public plotX: number = void 0 as any;
    public series: AreaRangeSeries = void 0 as any;
    public upperGraphic?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public setState(): void {
        var prevState = this.state,
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

        if (series.stateMarkerGraphic) {
            series.lowerStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.upperStateMarkerGraphic;
        }

        // Change state also for the top marker
        this.graphic = this.upperGraphic;
        this.plotY = this.plotHigh;

        if (isPolar) {
            this.plotX = this.plotHighX;
        }

        // Top state:
        pointProto.setState.apply(this, arguments as any);

        this.state = prevState;

        // Now restore defaults
        this.plotY = this.plotLow;
        this.graphic = this.lowerGraphic;

        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (series.stateMarkerGraphic) {
            series.upperStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.lowerStateMarkerGraphic;
            // Lower marker is stored at stateMarkerGraphic
            // to avoid reference duplication (#7021)
            series.lowerStateMarkerGraphic = void 0;
        }

        pointProto.setState.apply(this, arguments as any);
    }

    public haloPath(): SVGPath {
        var isPolar = this.series.chart.polar,
            path: SVGPath = [];

        // Bottom halo
        this.plotY = this.plotLow;
        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (this.isInside) {
            path = pointProto.haloPath.apply(this, arguments as any);
        }

        // Top halo
        this.plotY = this.plotHigh;
        if (isPolar) {
            this.plotX = this.plotHighX;
        }
        if (this.isTopInside) {
            path = path.concat(
                pointProto.haloPath.apply(this, arguments as any)
            );
        }

        return path;
    }

    public isValid(): boolean {
        return isNumber(this.low) && isNumber(this.high);
    }
}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangePoint;
