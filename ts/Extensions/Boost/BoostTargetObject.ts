/* *
 *
 *  Imports
 *
 * */

import type HTMLElement from '../../Core/Renderer/HTML/HTMLElement.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import type WGLRenderer from './WGLRenderer.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface BoostTargetAdditions {
    canvas?: HTMLCanvasElement;
    clipRect?: SVGElement;
    target?: SVGElement;
    targetCtx?: CanvasRenderingContext2D;
    targetFo?: SVGElement;
    wgl?: WGLRenderer;
    clear?(): void;
    copy?(): void;
    resize?(): void;
}

/** @internal */
export interface BoostTargetObject {
    boost?: BoostTargetAdditions;
    /**
     * Needed to proper refresh boosted canvas during series replacements.
     *
     * @internal
     * @deprecated
     * @todo Fix dependency to use boost.target.
     */
    renderTarget?: (HTMLElement|SVGElement);
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BoostTargetObject;
