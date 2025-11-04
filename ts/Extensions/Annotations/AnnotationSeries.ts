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

export interface AnnotationPoint extends Point {
    series: AnnotationSeries;
}

export type AnnotationPointType = (MockPoint|AnnotationPoint);

export interface AnnotationSeries extends Series {
    chart: AnnotationChart;
    points: Array<AnnotationPoint>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationSeries;
