/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
