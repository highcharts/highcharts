/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import type Annotation from '../Annotations';

/* *
 *
 *  Declarations
 *
 * */
export type AnnotationType =
    AnnotationTypeRegistry[keyof AnnotationTypeRegistry]['prototype'];

/* *
 *
 *  Export
 *
 * */
export interface AnnotationTypeRegistry {
    [key: string]: typeof Annotation;
}

export default AnnotationType;
