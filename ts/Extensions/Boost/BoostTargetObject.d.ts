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

export interface BoostTargetAdditions {
    canvas?: HTMLCanvasElement;
    clipRect?: SVGElement;
    target?: (HTMLElement|SVGElement);
    targetCtx?: CanvasRenderingContext2D;
    targetFo?: SVGElement;
    wgl?: WGLRenderer;
    clear?(): void;
    copy?(): void;
    resize?(): void;
}

export interface BoostTargetObject {
    boost?: BoostTargetAdditions;
    /**
     * Needed to proper refresh boosted canvas during series replacements.
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

export default BoostTargetObject;
