/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type Annotation from '../Annotation';

/* *
 *
 *  Declarations
 *
 * */

export type AnnotationType = AnnotationTypeRegistry[
    keyof AnnotationTypeRegistry
]['prototype'];

export interface AnnotationTypeRegistry {
    [key: string]: typeof Annotation;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationType;
