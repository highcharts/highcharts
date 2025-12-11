/* *
 *
 *  Imports
 *
 * */

import type AnnotationChart from './AnnotationChart';
import type MockPoint from './MockPoint';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface AnnotationPoint extends Point {
    series: AnnotationSeries;
}

/**
 * A point-like object, a mock point or a point used in series.
 * @internal
 * @typedef {
 *          Highcharts.AnnotationMockPoint|
 *          Highcharts.Point
 *     } Highcharts.AnnotationPointType
 * @requires modules/annotations
 */
export type AnnotationPointType = (MockPoint|AnnotationPoint);

/** @internal */
export interface AnnotationSeries extends Series {
    chart: AnnotationChart;
    points: Array<AnnotationPoint>;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AnnotationSeries;
