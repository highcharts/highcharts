/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

export interface AnimationOptions {
    complete?: Function;
    curAnim?: Record<string, boolean>;
    defer: number;
    duration: number;
    easing?: (string|Function);
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
