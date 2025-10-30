/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
