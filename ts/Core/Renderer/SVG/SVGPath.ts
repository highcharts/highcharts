/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export interface SVGPath extends globalThis.Array<SVGPath.Segment> {
    isFlat?: boolean;
    xBounds?: Array<number>;
    yBounds?: Array<number>;
    xMap?: Array<number|null>;
}

/* *
 *
 *  Namespace
 *
 * */

export namespace SVGPath {

    /* *
     *
     *  Declarations
     *
     * */
    type ArcParams = {
        cx: number,
        cy: number,
        start: number,
        end: number
    };
    type ArcArray = [
        'A'|'a',
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export interface Arc extends ArcArray {
        params?: ArcParams
    }

    export type Close = ['Z'|'z'];
    export type CurveTo = [
        'C'|'c',
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type HorizontalLineTo = ['H'|'h', number];
    export type LineTo = ['L'|'l', number, number];
    export type MoveTo = ['M'|'m', number, number];
    export type QuadTo = ['Q'|'q', number, number, number, number];
    export type CurveSmoothTo = ['S'|'s', number, number, number, number];
    export type QuadSmoothTo = ['T'|'t', number, number];
    export type VerticalLineTo = ['V'|'v', number];

    export type Segment = SegmentRegistry[keyof SegmentRegistry];
    export interface SegmentRegistry {
        Arc: Arc;
        Close: Close;
        CurveTo: CurveTo;
        CurveSmoothTo: CurveSmoothTo;
        HorizontalLineTo: HorizontalLineTo;
        LineTo: LineTo;
        MoveTo: MoveTo;
        QuadSmoothTo: QuadSmoothTo;
        QuadTo: QuadTo;
        VerticalLineTo: VerticalLineTo;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SVGPath;
