/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type OHLCPointOptions from './OHLCPointOptions';
import type OHLCSeries from './OHLCSeries';
import type ColorString from '../../Core/Color/ColorString';
import type { SeriesZonesOptions } from './../../Core/Series/SeriesOptions';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = BaseSeries;

/* *
 *
 *  Class
 *
 * */

class OHLCPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public close: number = void 0 as any;

    public high: number = void 0 as any;

    public low: number = void 0 as any;

    public open: number = void 0 as any;

    public options: OHLCPointOptions = void 0 as any;

    public plotClose: number = void 0 as any;

    public plotHigh?: number;

    public plotLow?: number;

    public plotOpen: number = void 0 as any;

    public series: OHLCSeries = void 0 as any;

    public yBottom?: number;

    public upColor?: ColorString;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getClassName
     * @return {string}
     */
    public getClassName(): string {
        return super.getClassName.call(this) +
        (
            this.open < this.close ?
                ' highcharts-point-up' :
                ' highcharts-point-down'
        );
    }

    /**
     * Extend the parent method by saving upColor.
     * @private
     * @function Highcharts.seriesTypes.ohlc#resolveColor
     */
    public resolveColor(): void {
        super.resolveColor();

        // Save upColor as point color (#14826).
        if (this.open < this.close && !this.options.color) {
            this.color = this.series.options.upColor;
        }
    }

    /**
     * Extend the parent method by saving upColor.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getZone
     *
     * @return {Highcharts.SeriesZonesOptionsObject}
     *         The zone item.
     */
    public getZone(): SeriesZonesOptions {
        const zone = super.getZone();

        // Save upColor as point color (#14826).
        if (this.open < this.close && !this.options.color) {
            this.color = this.series.options.upColor;
        }

        return zone;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace OHLCPoint {
    export type PointShortOptions = [number, number, number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default OHLCPoint;
