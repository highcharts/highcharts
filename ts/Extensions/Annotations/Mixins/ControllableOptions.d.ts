/* *
 *
 *  Imports
 *
 * */

import type {
    AnnotationControlPointDragEventFunction,
    AnnotationControlPointPositionerFunction
} from '../ControlPointOptions';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    AnnotationControlPointOptionsObject
} from '../ControlPointOptions';
import type MockPointOptions from '../MockPointOptions';
import type { SymbolKey } from '../../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface AnnotationControllableOptionsObject {
    className?: string;
    controlPoints?: Array<AnnotationControlPointOptionsObject>;
    id?: (number|string);
    markerEnd?: string;
    markerStart?: string;
    point?: (string|MockPointOptions);
    points?: Array<(string|MockPointOptions)>;
    r?: number;
    rx?: number;
    ry?: number;
    x?: number;
    y?: number;
}

export interface AnnotationControlPointEventsOptionsObject {
    drag?: AnnotationControlPointDragEventFunction;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationControllableOptionsObject;
