/* *
 *
 *  Imports
 *
 * */

import type Annotation from './Annotation';
import type ControlPoint from './ControlPoint';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface AnnotationControlPointDragEventFunction {
    (
        this: Annotation,
        e: Highcharts.AnnotationEventObject,
        target: Highcharts.AnnotationControllable
    ): void;
}

export interface AnnotationControlPointPositionerFunction {
    (
        this: ControlPoint,
        target: Highcharts.AnnotationControllable
    ): PositionObject;
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

export default AnnotationControlPointOptionsObject;
