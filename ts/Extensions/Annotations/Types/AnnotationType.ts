/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
