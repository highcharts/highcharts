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
    clear?(boostTarget: BoostTargetObject): void;
    copy?(): void;
    resize?(): void;
}

export interface BoostTargetObject {
    boost?: BoostTargetAdditions;
}

/* *
 *
 *  Default Export
 *
 * */

export default BoostTargetObject;
