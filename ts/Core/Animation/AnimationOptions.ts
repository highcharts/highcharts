/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type SVGElement from '../Renderer/SVG/SVGElement';

/* *
 *
 *  Declarations
 *
 * */

/**
 * An animation configuration. Animation configurations can also be defined as
 * booleans, where `false` turns off animation and `true` defaults to a duration
 * of 500ms and defer of 0ms.
 */
export interface AnimationOptions {
    /**
     * A callback function to execute when the animation finishes.
     * @name Highcharts.AnimationOptionsObject#complete
     * @type {Function|undefined}
     */
    complete?: Function;
    /** @internal */
    curAnim?: Record<string, boolean>;
    /**
     * The animation defer in milliseconds.
     * @name Highcharts.AnimationOptionsObject#defer
     * @type {number|undefined}
     */
    defer: number;
    /**
     * The animation duration in milliseconds.
     * @name Highcharts.AnimationOptionsObject#duration
     * @type {number|undefined}
     */
    duration: number;
    /**
     * The name of an easing function as defined on the `Math` object.
     * @name Highcharts.AnimationOptionsObject#easing
     * @type {string|Function|undefined}
     */
    easing?: (string|Function);
    /**
     * A callback function to execute on each step of each attribute or CSS
     * property that's being animated. The first argument contains information
     * about the animation and progress.
     */
    step?: AnimationStepCallbackFunction;
}

export interface AnimationStepCallbackFunction {
    (this: SVGElement, ...args: Array<any>): void;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnimationOptions;
