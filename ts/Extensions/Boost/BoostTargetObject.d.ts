/* *
 *
 *  Imports
 *
 * */

import type HTMLElement from '../../Core/Renderer/HTML/HTMLElement';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type WGLRenderer from './WGLRenderer';

/* *
 *
 *  Declarations
 *
 * */

export interface BoostTargetObject {
    boostClipRect?: SVGElement;
    canvas?: HTMLCanvasElement;
    ogl?: WGLRenderer;
    renderTarget?: (HTMLElement|SVGElement);
    renderTargetCtx?: CanvasRenderingContext2D;
    renderTargetFo?: SVGElement;
    /** @requires modules/boost */
    boostClear(): void;
    /** @requires modules/boost */
    boostCopy(): void;
    /** @requires modules/boost */
    boostResizeTarget(): void;
}

/* *
 *
 *  Default Export
 *
 * */

export default BoostTargetObject;
