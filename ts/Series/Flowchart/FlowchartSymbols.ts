/* *
 *
 *  Flowchart series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Tord Vikestad
 *
 *  The classic flowchart node symbols, plus the geometry the series needs to
 *  size a shape around its label and to find where the shape's outline is.
 *  All three are kept in one place because they have to agree: a shape's
 *  symbol (how it is drawn), `shapeSize` (how much bigger than its text box
 *  it has to be) and `shapeBoundaryDistance` (where its edge is) are derived
 *  from the same tunables.
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

import H from '../../Core/Globals.js';
import { pushUnique } from '../../Shared/Utilities.js';
const { composed } = H;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires modules/flowchart */
        cylinder: SymbolFunction;
        /** @requires modules/flowchart */
        document: SymbolFunction;
        /** @requires modules/flowchart */
        hexagon: SymbolFunction;
        /** @requires modules/flowchart */
        oval: SymbolFunction;
        /** @requires modules/flowchart */
        parallelogram: SymbolFunction;
        /** @requires modules/flowchart */
        subroutine: SymbolFunction;
    }
}

/**
 * A node shape in classic flowchart notation.
 * @internal
 */
export type FlowchartNodeShape = (
    'cylinder'|'diamond'|'document'|'hexagon'|'oval'|'parallelogram'|
    'rectangle'|'subroutine'
);

/**
 * The width and height a node's shape needs in order to contain its label.
 * @internal
 */
export interface FlowchartShapeSize {
    height: number;
    width: number;
}

/* *
 *
 *  Namespace
 *
 * */

/** @internal */
namespace FlowchartSymbols {

    /* *
     *
     *  Constants
     *
     * */

    // Geometry tunables shared by a shape's symbol, its `shapeSize` and its
    // `shapeBoundaryDistance`. Each is a fraction of the shape's own height
    // (the cylinder's, of its width), so a shape's slant/inset/cap/bar
    // scales with its label rather than being a fixed size.

    /** Parallelogram horizontal slant per side, x height. @internal */
    const parallelogramSlant = 0.4;

    /** Hexagon end-cap inset per side, x height. @internal */
    const hexagonInset = 0.25;

    /** Subroutine side-bar width, x height. @internal */
    const subroutineBar = 0.1;

    /** Subroutine gap beside each side-bar, x height. @internal */
    const subroutineGap = 0.05;

    /** Cylinder elliptical cap radius, x width. @internal */
    const cylinderCap = 0.12;

    /** Cylinder cap-to-body gap, x cap radius. @internal */
    const cylinderGap = 0.1;

    /** Document wavy-bottom reserve, x height. @internal */
    const documentWave = 0.13;

    /** Padding between a node's label and its shape, in pixels. @internal */
    const shapePadding = { x: 16, y: 10 };

    /** Smallest a node's shape is allowed to get, in pixels. @internal */
    const minShapeSize = { width: 60, height: 36 };

    /**
     * The renderer symbol each shape is drawn with. The two shapes that map
     * to a core symbol (`rectangle`, `diamond`) keep their flowchart name in
     * the API while reusing what the renderer already has.
     * @internal
     */
    export const symbolByShape: Record<FlowchartNodeShape, SymbolKey> = {
        cylinder: 'cylinder',
        diamond: 'diamond',
        document: 'document',
        hexagon: 'hexagon',
        oval: 'oval',
        parallelogram: 'parallelogram',
        rectangle: 'square',
        subroutine: 'subroutine'
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * A full ellipse, drawn as two 180 degree arcs since an SVG path has no
     * native ellipse primitive. Registering it as a symbol lets `oval` nodes
     * go through the same marker pipeline (states, halo, dragging) as the
     * built-in `circle`/`square`/`diamond` shapes. The shapes below join it
     * for the same reason.
     * @internal
     */
    function oval(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        return [
            ['M', x, y + h / 2],
            ['A', w / 2, h / 2, 0, 1, 0, x + w, y + h / 2],
            ['A', w / 2, h / 2, 0, 1, 0, x, y + h / 2],
            ['Z']
        ];
    }

    /**
     * Input/output: a right-leaning parallelogram with horizontal top and
     * bottom edges and sides slanted by `s`.
     * @internal
     */
    function parallelogram(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        const s = parallelogramSlant * h;

        return [
            ['M', x + s, y],
            ['L', x + w, y],
            ['L', x + w - s, y + h],
            ['L', x, y + h],
            ['Z']
        ];
    }

    /**
     * Preparation: a hexagon with pointed left/right ends, the top and
     * bottom edges inset by `c` from each side.
     * @internal
     */
    function hexagon(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        const c = hexagonInset * h;

        return [
            ['M', x, y + h / 2],
            ['L', x + c, y],
            ['L', x + w - c, y],
            ['L', x + w, y + h / 2],
            ['L', x + w - c, y + h],
            ['L', x + c, y + h],
            ['Z']
        ];
    }

    /**
     * Predefined process (subroutine): a main rectangle flanked by a thin
     * bar on each side, each separated from the body by a small gap. All
     * three are filled (the node has no stroke), so the background showing
     * through the gaps reads as the classic vertical divider lines - no
     * border needed. Three disjoint closed subpaths, each filling on its
     * own.
     * @internal
     */
    function subroutine(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        const b = subroutineBar * h,
            g = subroutineGap * h,
            rect = (x0: number, x1: number): SVGPath => [
                ['M', x0, y],
                ['L', x1, y],
                ['L', x1, y + h],
                ['L', x0, y + h],
                ['Z']
            ];

        return [
            ...rect(x, x + b), // Left bar
            ...rect(x + b + g, x + w - b - g), // Main body
            ...rect(x + w - b, x + w) // Right bar
        ];
    }

    /**
     * Data store: a vertical cylinder drawn as two disjoint closed subpaths
     * - a full elliptical cap on top, and the body below it. The body's top
     * edge is the same downward-bulging rim as the cap's underside, shifted
     * down by just `gap`, so the two curves run parallel and read as one
     * cylinder with a thin seam - not a lid that doesn't fit. Being disjoint
     * (the gap separates them), each subpath fills solid on its own with no
     * winding interaction between them.
     * @internal
     */
    function cylinder(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        const rx = w / 2,
            ry = Math.min(cylinderCap * w, h / 4),
            gap = cylinderGap * ry;

        return [
            // Cap: a full, closed ellipse across the top.
            ['M', x, y + ry],
            ['A', rx, ry, 0, 1, 0, x + w, y + ry],
            ['A', rx, ry, 0, 1, 0, x, y + ry],
            ['Z'],
            // Body: a front rim matching the cap's underside a `gap` lower,
            // then straight sides and a front-bulging bottom.
            ['M', x, y + ry + gap],
            ['A', rx, ry, 0, 0, 0, x + w, y + ry + gap],
            ['L', x + w, y + h - ry],
            ['A', rx, ry, 0, 0, 1, x, y + h - ry],
            ['Z']
        ];
    }

    /**
     * Document: straight top and sides, with a wavy bottom edge (one dip
     * then one rise) that swings +/-`a` around a baseline `a` above the box
     * bottom, so the lowest point of the wave just reaches the box bottom. A
     * single closed subpath - the wave is part of the outline, not an
     * internal detail line, so there's nothing to fill wrong.
     * @internal
     */
    function documentShape(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        const a = documentWave * h / 2,
            baseY = y + h - a;

        return [
            ['M', x, y],
            ['L', x + w, y],
            ['L', x + w, baseY],
            ['Q', x + w * 0.75, baseY + 2 * a, x + w * 0.5, baseY],
            ['Q', x + w * 0.25, baseY - 2 * a, x, baseY],
            ['Z']
        ];
    }

    /**
     * Register the flowchart node symbols on a renderer class.
     * @internal
     */
    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        if (pushUnique(composed, 'Series.FlowchartSymbols')) {
            const { symbols } = SVGRendererClass.prototype;

            symbols.cylinder = cylinder;
            symbols.document = documentShape;
            symbols.hexagon = hexagon;
            symbols.oval = oval;
            symbols.parallelogram = parallelogram;
            symbols.subroutine = subroutine;
        }
    }

    /**
     * Box dimensions that inscribe a `textWidth` x `textHeight` label for
     * the given shape. `boxW`/`boxH` below are that text box plus padding;
     * each shape grows it by just enough to keep the box inside:
     *
     * - rectangle: the padded text box itself.
     * - diamond: a rhombus with half-diagonals p, q inscribes a rectangle of
     *   half-extents (rw, rh) exactly at its tightest fit when
     *   rw/p + rh/q = 1; choosing p = 2*rw, q = 2*rh satisfies that (both
     *   terms become 1/2), so the diamond's full width/height are simply
     *   double the text box's.
     * - oval: an ellipse with semi-axes a, b inscribes a rectangle of
     *   half-extents (rw, rh) exactly at its tightest fit when
     *   (rw/a)^2 + (rh/b)^2 = 1; choosing a = rw*sqrt(2), b = rh*sqrt(2)
     *   satisfies that, so the oval's full width/height are the text box's
     *   times sqrt(2).
     * - parallelogram: the slanted sides eat `slant` off the box's width at
     *   the narrow corner on each side, so it widens by 2*slant.
     * - hexagon: the pointed ends inset the full-height edges by `inset` per
     *   side, so it likewise widens by 2*inset.
     * - subroutine: a main rectangle plus a thin bar and gap on each side,
     *   so the box widens by 2*(bar + gap)*height to keep the text in the
     *   main body.
     * - cylinder: the cap (height 2*ry) and the body's matching top rim (a
     *   `gap` lower, dipping ry into the body) sit above the label, the
     *   bottom bulge below; reserving 2*ry + gap top and bottom clears both.
     * - document: the wavy bottom swings up to 2*a into the box, so the box
     *   grows in height until the centered label clears that highest point.
     *
     * @internal
     */
    export function shapeSize(
        shape: FlowchartNodeShape,
        textWidth: number,
        textHeight: number
    ): FlowchartShapeSize {
        const boxW = textWidth + shapePadding.x * 2,
            boxH = textHeight + shapePadding.y * 2;

        let width: number,
            height: number;

        switch (shape) {
            case 'diamond':
                width = boxW * 2;
                height = boxH * 2;
                break;

            case 'oval':
                width = boxW * Math.SQRT2;
                height = boxH * Math.SQRT2;
                break;

            case 'parallelogram':
                height = Math.max(minShapeSize.height, boxH);
                width = boxW + 2 * parallelogramSlant * height;
                break;

            case 'hexagon':
                height = Math.max(minShapeSize.height, boxH);
                width = boxW + 2 * hexagonInset * height;
                break;

            case 'subroutine':
                height = Math.max(minShapeSize.height, boxH);
                width = boxW + 2 * (subroutineBar + subroutineGap) * height;
                break;

            case 'cylinder': {
                width = Math.max(minShapeSize.width, boxW);

                const ry = cylinderCap * width;

                // Reserve the cap (2*ry) + the gap on top, plus 2*ry more so
                // the centered label clears the cap/gap above and the bottom
                // bulge.
                height = boxH + 4 * ry + 2 * cylinderGap * ry;
                break;
            }

            case 'document':
                width = boxW;
                height = boxH / (1 - 2 * documentWave);
                break;

            default: // Rectangle
                width = boxW;
                height = boxH;
        }

        return {
            width: Math.max(minShapeSize.width, width),
            height: Math.max(minShapeSize.height, height)
        };
    }

    /**
     * Distance from the center (origin) to a convex polygon's boundary along
     * direction (dx, dy). `verts` are the corners relative to the center, in
     * order; the ray from the (inside) origin exits through exactly one
     * edge, found by solving ray-vs-segment for each edge and taking the one
     * whose hit lands within the segment at a non-negative distance. With
     * (dx, dy) a unit vector the returned parameter is that distance
     * directly.
     * @internal
     */
    function polygonBoundaryDistance(
        verts: Array<[number, number]>,
        dx: number,
        dy: number
    ): number {
        for (let i = 0; i < verts.length; i++) {
            const a = verts[i],
                b = verts[(i + 1) % verts.length],
                ex = b[0] - a[0],
                ey = b[1] - a[1],
                det = ex * dy - ey * dx;

            if (!det) {
                continue; // Ray parallel to this edge
            }

            const t = (ex * a[1] - ey * a[0]) / det,
                u = (dx * a[1] - dy * a[0]) / det;

            if (t >= 0 && u >= -1e-9 && u <= 1 + 1e-9) {
                return t;
            }
        }

        return 0;
    }

    /**
     * Distance from a shape's center to its boundary along a (unit)
     * direction (dx, dy) - used to pull a link's end and its arrow tip back
     * to the node's actual edge instead of its center, whichever shape the
     * node is. The closed-form shapes use the standard "ray from center to
     * boundary" formula; the polygonal ones (parallelogram, hexagon) hand
     * their centered corners to `polygonBoundaryDistance`. The subroutine
     * shares the rectangle's box exactly, and the cylinder and document are
     * close enough to a rectangle along the cardinal directions links
     * usually approach from (straight sides, near-flush top/bottom) to reuse
     * it.
     * @internal
     */
    export function shapeBoundaryDistance(
        shape: FlowchartNodeShape,
        halfWidth: number,
        halfHeight: number,
        dx: number,
        dy: number
    ): number {
        if (shape === 'diamond') {
            const denom = Math.abs(dx) / halfWidth + Math.abs(dy) / halfHeight;
            return denom ? 1 / denom : 0;
        }

        if (shape === 'oval') {
            const denom = Math.sqrt(
                (dx / halfWidth) ** 2 + (dy / halfHeight) ** 2
            );
            return denom ? 1 / denom : 0;
        }

        if (shape === 'parallelogram') {
            const s = parallelogramSlant * 2 * halfHeight;

            return polygonBoundaryDistance([
                [-halfWidth + s, -halfHeight],
                [halfWidth, -halfHeight],
                [halfWidth - s, halfHeight],
                [-halfWidth, halfHeight]
            ], dx, dy);
        }

        if (shape === 'hexagon') {
            const c = hexagonInset * 2 * halfHeight;

            return polygonBoundaryDistance([
                [-halfWidth, 0],
                [-halfWidth + c, -halfHeight],
                [halfWidth - c, -halfHeight],
                [halfWidth, 0],
                [halfWidth - c, halfHeight],
                [-halfWidth + c, halfHeight]
            ], dx, dy);
        }

        // Rectangle - and, by close approximation, subroutine/cylinder/
        // document.
        const denom = Math.max(
            Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight
        );

        return denom ? 1 / denom : 0;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartSymbols;
