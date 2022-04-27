/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type PictorialPointOptions from './PictorialPointOptions';
import type PictorialSeries from './PictorialSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import PictorialUtilities from './PictorialUtilities.js';

const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;

const {
    rescalePatternFill
} = PictorialUtilities;

/* *
 *
 *  Class
 *
 * */

class PictorialPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     * Properties
     *
     * */
    public options: PictorialPointOptions = void 0 as any;
    public series: PictorialSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public setState(): void {
        const point = this;

        super.setState.apply(point, arguments);
        if (point.graphic && point.shapeArgs) {
            rescalePatternFill(
                point.graphic,
                point.series.yAxis,
                point.shapeArgs.height || Infinity
            );
        }
    }

}

/* *
 *
 *  Export Default
 *
 * */
export default PictorialPoint;
