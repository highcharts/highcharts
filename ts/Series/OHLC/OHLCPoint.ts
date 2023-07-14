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

import type OHLCPointOptions from './OHLCPointOptions';
import type OHLCSeries from './OHLCSeries';
import type { SeriesZonesOptions } from './../../Core/Series/SeriesOptions';

import Point from './../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        hlc: HLCSeries
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class OHLCPoint extends HLCSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public open: number = void 0 as any;

    public options: OHLCPointOptions = void 0 as any;

    public plotOpen: number = void 0 as any;

    public series: OHLCSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getClassName
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
     * Save upColor as point color (#14826).
     * @private
     * @function Highcharts.seriesTypes.ohlc#resolveUpColor
     */
    public resolveUpColor(): void {
        if (
            this.open < this.close &&
            !this.options.color &&
            this.series.options.upColor
        ) {
            this.color = this.series.options.upColor;
        }
    }

    /**
     * Extend the parent method by saving upColor.
     * @private
     * @function Highcharts.seriesTypes.ohlc#resolveColor
     */
    public resolveColor(): void {
        super.resolveColor();
        this.resolveUpColor();
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
        this.resolveUpColor();

        return zone;
    }

    /**
     * Extend the parent method by resolving up/down colors (#15849)
     * @private
     **/
    public applyOptions(): Point {
        super.applyOptions.apply(this, arguments);
        if (this.resolveColor) {
            this.resolveColor();
        }
        return this;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace OHLCPoint {
    export type PointShortOptions = Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default OHLCPoint;
