/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
 *  Export
 *
 * */

export default AnimationOptions;
