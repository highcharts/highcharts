/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
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

import type PictorialPointOptions from './PictorialPointOptions';
import type PictorialSeries from './PictorialSeries';

import U from '../../Core/Utilities.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import PictorialUtilities from './PictorialUtilities.js';

const {
    defined
} = U;

const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;

const {
    rescalePatternFill,
    getStackMetrics
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
        const series = point.series;
        const shape = (series as any).options.paths[point.index %
            (series as any).options.paths.length];
        if (point.graphic && point.shapeArgs) {
            rescalePatternFill(
                point.graphic,
                getStackMetrics(series.yAxis, shape).height,
                point.shapeArgs.width || 0,
                point.shapeArgs.height || Infinity,
                point.series.options.borderWidth || 0
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
