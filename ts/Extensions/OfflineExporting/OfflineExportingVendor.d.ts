/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
        jspdf: jspdf;
        svg2pdf: Function;
    }

    interface jspdf {
        jsPDF: typeof jsPDF;
    }
    class jsPDF {
        constructor (a: string, b: string, c: Array<number>);
        output: Function;
        setFont(fontFamily: string): void;
        svg (
            svgElement: SVGElement,
            options: AnyRecord
        ): Promise<jsPDF>;
    }
}
