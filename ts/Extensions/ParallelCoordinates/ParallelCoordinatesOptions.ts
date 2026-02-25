/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Fus
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AxisOptions from '../../Core/Axis/AxisOptions';
import type { DeepPartial } from '../../Shared/Types';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartOptions' {
    interface ChartOptions extends ParallelCoordinatesOptions {
        // Nothing to add
    }
}

interface ParallelCoordinatesOptions {
    /**
     * Flag to render charts as a parallel coordinates plot. In a parallel
     * coordinates plot (||-coords) by default all required yAxes are generated
     * and the legend is disabled. This feature requires
     * `modules/parallel-coordinates.js`.
     *
     * @sample {highcharts} /highcharts/demo/parallel-coordinates/
     *         Parallel coordinates demo
     * @sample {highcharts} highcharts/parallel-coordinates/polar/
     *         Star plot, multivariate data in a polar chart
     *
     * @since    6.0.0
     * @product  highcharts
     * @requires modules/parallel-coordinates
     */
    parallelCoordinates?: boolean;

    /**
     * Common options for all yAxes rendered in a parallel coordinates plot.
     * This feature requires `modules/parallel-coordinates.js`.
     *
     * The default options are:
     * ```js
     * parallelAxes: {
     *    lineWidth: 1,       // classic mode only
     *    gridlinesWidth: 0,  // classic mode only
     *    title: {
     *        text: '',
     *        reserveSpace: false
     *    },
     *    labels: {
     *        x: 0,
     *        y: 0,
     *        align: 'center',
     *        reserveSpace: false
     *    },
     *    offset: 0
     * }
     * ```
     *
     * @sample {highcharts} highcharts/parallel-coordinates/parallelaxes/
     *         Set the same tickAmount for all yAxes
     *
     * @extends   yAxis
     * @since     6.0.0
     * @product   highcharts
     * @requires  modules/parallel-coordinates
     */
    parallelAxes?: ParallelAxesOptions;
}

interface ParallelAxesOptions extends DeepPartial<Omit<
    AxisOptions,
    | 'alternateGridColor'
    | 'breaks'
    | 'id'
    | 'gridLineColor'
    | 'gridLineDashStyle'
    | 'gridLineWidth'
    | 'minorGridLineColor'
    | 'minorGridLineDashStyle'
    | 'minorGridLineWidth'
    | 'plotBands'
    | 'plotLines'
    | 'angle'
    | 'gridLineInterpolation'
    | 'maxColor'
    | 'maxZoom'
    | 'minColor'
    | 'scrollbar'
    | 'stackLabels'
    | 'stops'
>> {
    /**
     * @default 1
     */
    lineWidth?: AxisOptions['lineWidth'];

    /**
     * Visually the parallel coordinates titles are done through
     * [xAxis.categories](#xAxis.categories). All options for `xAxis.labels`
     * applies to parallel coordinates titles. For example, to style categories,
     * use [xAxis.labels.style](#xAxis.labels.style).
     *
     * @default {"text":"", "reserveSpace": false}
     */
    title?: AxisOptions['title'];

    /**
     * @default {"x": 0, "y": 4, "align": "center", "reserveSpace": false}
     */
    labels?: DeepPartial<AxisOptions['labels']>;

    /**
     * @default 0
     */
    offset?: AxisOptions['offset'];
}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelCoordinatesOptions;
