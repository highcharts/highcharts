/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */
import type G from '../../Core/Globals';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare global {
    interface Canvg {
        fromString(
            ctx: CanvasRenderingContext2D,
            svg: string
        ): Canvg;
        start(): void;
    }

    interface CanvgNamespace {
        Canvg: Canvg;
    }

    interface Window {
        canvg: CanvgNamespace;
    }
}
