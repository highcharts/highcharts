/* *
 *
 *  Imports
 *
 * */

import type Annotation from './Annotation';
import type { AnnotationEventObject } from './EventEmitter';
import type Controllable from './Controllables/Controllable';
import type ControlPoint from './ControlPoint';
import type ControlTarget from './ControlTarget';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface ControlPointDragEventFunction {
    (
        this: Annotation,
        e: AnnotationEventObject,
        target: Controllable
    ): void;
}

export interface ControlPointPositionerFunction {
    (
        this: ControlPoint,
        target: ControlTarget
    ): PositionObject;
}

export interface ControlPointEventsOptionsObject {
    drag?: ControlPointDragEventFunction;
}

export interface ControlPointOptionsObject {
    draggable?: undefined;
    events: ControlPointEventsOptionsObject;
    height: number;
    index?: number;
    positioner: ControlPointPositionerFunction;
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

export default ControlPointOptionsObject;
