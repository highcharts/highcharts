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

/** @internal */
export type AnnotationType = AnnotationTypeRegistry[
    keyof AnnotationTypeRegistry
]['prototype'];

/** @internal */
export interface AnnotationTypeRegistry {
    [key: string]: typeof Annotation;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AnnotationType;
