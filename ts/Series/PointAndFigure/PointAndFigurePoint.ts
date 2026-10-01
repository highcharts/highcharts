/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
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

import ScatterSeries from '../Scatter/ScatterSeries.js';
import PointAndFigureSeries from './PointAndFigureSeries.js';
const {
    prototype: {
        pointClass: ScatterPoint
    }
} = ScatterSeries;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 */
class PointAndFigurePoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public upTrend!: boolean;

    /** @internal */
    public series!: PointAndFigureSeries;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public resolveMarker(): void {
        const seriesOptions = this.series.options;
        this.marker = this.options.marker =
            this.upTrend ? seriesOptions.markerUp : seriesOptions.marker;

        this.color = this.options.marker.lineColor;
    }

    /** @internal */
    public resolveColor(): void {
        super.resolveColor();
        this.resolveMarker();
    }

    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.pointandfigure#getClassName
     */
    public getClassName(): string {
        return super.getClassName.call(this) +
        (
            this.upTrend ?
                ' highcharts-point-up' :
                ' highcharts-point-down'
        );
    }

}

/* *
 *
 *  Export Default
 *
 * */

export default PointAndFigurePoint;
