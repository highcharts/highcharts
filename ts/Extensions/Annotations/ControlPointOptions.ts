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
        target: ControlTarget
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
