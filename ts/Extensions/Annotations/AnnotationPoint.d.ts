/* *
 *
 *  Imports
 *
 * */

import type { AnnotationSeries } from './Annotation';
import type MockPoint from './MockPoint';
import type Point from '../../Core/Series/Point';

/* *
 *
 *  Declarations
 *
 * */

export interface AnnotationPoint extends Point {
    series: AnnotationSeries;
}

export type AnnotationPointType = (MockPoint|AnnotationPoint);

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationPoint;
