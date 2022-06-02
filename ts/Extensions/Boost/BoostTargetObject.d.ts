/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type HTMLElement from '../../Core/Renderer/HTML/HTMLElement';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

/* *
 *
 *  Declarations
 *
 * */

export interface BoostTargetObject {
    boostClipRect?: SVGElement;
    canvas?: HTMLCanvasElement;
    ogl?: Highcharts.BoostGLRenderer;
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
