/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musialowski
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
*
*  Imports
*
* */

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import PointAndFigureSeries from './PointAndFigureSeries.js';
const {
    seriesTypes: {
        scatter: {
            prototype: {
                pointClass: ScatterPoint
            }
        }
    }
} = SeriesRegistry;

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

    public upTrend!: boolean;

    public series!: PointAndFigureSeries;

    /* *
     *
     *  Functions
     *
     * */

    public resolveMarker(): void {
        const seriesOptions = this.series.options;
        this.marker = this.options.marker =
            this.upTrend ? seriesOptions.markerUp : seriesOptions.marker;

        this.color = this.options.marker.lineColor;
    }

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
