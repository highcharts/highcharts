/* *
 *
 *  Imports
 *
 * */

import type Annotation from './Annotation.js';
import type { AnnotationEventObject } from './EventEmitter.js';
import type Controllable from './Controllables/Controllable.js';
import type ControlPoint from './ControlPoint.js';
import type ControlTarget from './ControlTarget.js';
import type CSSObject from '../../Core/Renderer/CSSObject.js';
import type PositionObject from '../../Core/Renderer/PositionObject.js';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType.js';

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

/**
 * Callback to modify annotation's positioner controls.
 *
 * @callback Highcharts.AnnotationControlPointPositionerFunction
 * @param {Highcharts.AnnotationControlPoint} this
 * @param {Highcharts.AnnotationControllable} target
 * @return {Highcharts.PositionObject}
 */
export interface ControlPointPositionerFunction {
    (
        this: ControlPoint,
        target: ControlTarget,
        ctx: ControlPoint
    ): PositionObject;
}

export interface ControlPointEventsOptionsObject {
    drag?: ControlPointDragEventFunction;
}

export interface ControlPointOptionsObject {
    /** @internal */
    draggable?: undefined;

    /**
     * @type {Highcharts.Dictionary<Function>}
     */
    events: ControlPointEventsOptionsObject;

    height: number;

    /** @internal */
    index?: number;

    /**
     * @type      {Highcharts.AnnotationControlPointPositionerFunction}
     * @apioption annotations.controlPointOptions.positioner
     */
    positioner: ControlPointPositionerFunction;

    /**
     * @type {Highcharts.SVGAttributes}
     */
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
