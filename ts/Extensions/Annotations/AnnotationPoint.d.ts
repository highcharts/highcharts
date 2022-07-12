/* *
 *
 *  Imports
 *
 * */

import type Point from '../../Core/Series/Point';

/* *
 *
 *  Declarations
 *
 * */

export interface AnnotationPoint extends Point {
    series: Highcharts.AnnotationSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationPoint;
