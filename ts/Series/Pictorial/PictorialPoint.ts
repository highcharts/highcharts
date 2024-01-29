/* *
 *
 *  (c) 2010-2024 Torstein Honsi, Magdalena Gut
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

import type ColumnPointType from '../Column/ColumnPoint';
import type PictorialPointOptions from './PictorialPointOptions';
import type PictorialSeries from './PictorialSeries';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import PictorialUtilities from './PictorialUtilities.js';

const ColumnPoint: typeof ColumnPointType =
    SeriesRegistry.seriesTypes.column.prototype.pointClass;

const {
    rescalePatternFill,
    getStackMetrics
} = PictorialUtilities;

/* *
 *
 *  Class
 *
 * */

class PictorialPoint extends ColumnPoint {

    /* *
     *
     * Properties
     *
     * */

    public options!: PictorialPointOptions;
    public series!: PictorialSeries;
    public pathDef!: string | SVGPath | undefined;

    /* *
     *
     *  Functions
     *
     * */

    public setState(): void {
        const point = this;

        super.setState.apply(point, arguments);
        const series = point.series,
            paths = series.options.paths;

        if (point.graphic && point.shapeArgs && paths) {
            const shape = paths[point.index %
                paths.length];
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
