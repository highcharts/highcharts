/* *
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ControlPointOptions from './ControlPointOptions';
import type {
    AnnotationMockPointOptions
} from './AnnotationOptions';
import { AnnotationPointType } from './AnnotationSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface ControlTargetOptions {
    /** @internal */
    controlPointOptions?: ControlPointOptions;

    /** @internal */
    controlPoints?: Array<ControlPointOptions>;

    /** @internal */
    point?: AnnotationMockPointOptions | AnnotationPointType;

    /** @internal */
    points?: Array<AnnotationMockPointOptions | AnnotationPointType>;

    /** @internal */
    x?: number;

    /** @internal */
    y?: number;

    /** @internal */
    className?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ControlTargetOptions;
