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
