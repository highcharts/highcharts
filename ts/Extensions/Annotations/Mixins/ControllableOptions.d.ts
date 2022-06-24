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

export interface AnnotationControlPointOptionsObject {
    draggable?: undefined;
    events: AnnotationControlPointEventsOptionsObject;
    height: number;
    index?: number;
    positioner: AnnotationControlPointPositionerFunction;
    style: CSSObject;
    symbol: SymbolKey;
    visible: boolean;
    width: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationControllableOptionsObject;
