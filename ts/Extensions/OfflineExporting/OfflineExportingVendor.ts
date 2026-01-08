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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type G from '../../Core/Globals';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        jspdf: jspdf;
        svg2pdf: Function;
    }

    interface jspdf {
        jsPDF: typeof jsPDF;
    }

    interface JsPDFEventFunction {
        (
            this: jsPDF
        ): void
    }

    interface JsPDFEvent {
        0: string;
        1: JsPDFEventFunction;
    }

    interface JsPDFAPI {
        events: JsPDFEvent[];
    }

    class jsPDF {
        static API: JsPDFAPI;
        constructor (a: string, b: string, c: Array<number>);
        addFileToVFS(
            filename: string,
            data: string
        ): void;
        addFont(
            postScriptName: string,
            id: string,
            fontStyle: ('bold' | 'bolditalic' | 'italic' | 'normal'),
            fontWeight?: (number | string)
        ): void;
        output: Function;
        setFont(
            fontFamily: string
        ): void;
        getFontList(): {
            HighchartsFont: unknown
        };
        svg (
            svgElement: SVGElement,
            options: AnyRecord
        ): Promise<jsPDF>;
    }
}
