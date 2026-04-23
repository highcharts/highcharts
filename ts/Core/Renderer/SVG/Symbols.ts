/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from './SVGPath';
import type SymbolOptions from './SymbolOptions';
import type { SymbolTypeRegistry } from './SymbolType';

import { defined, isNumber, pick } from '../../../Shared/Utilities.js';

/* *
 *
 *  Functions
 *
 * */

/* eslint-disable require-jsdoc, valid-jsdoc */

/**
 * Arc symbol path.
 *
 * @param {number} cx
 * Center X
 * @param {number} cy
 * Center Y
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @param {Highcharts.SymbolOptions} [options]
 * Options
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function arc(
    cx: number,
    cy: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const arc: SVGPath = [];

    if (options) {
        const rawStart = options.start || 0,
            rawEnd = options.end || 0,
            radianRange = Math.abs(rawEnd - rawStart),
            padding = options.padding || 0,
            radius = options.r || 0,
            innerRadius = options.innerR,
            minArcRange = 0.05,
            // Subtract a small number to prevent cos and sin of start and end
            // from becoming equal on 360 arcs (#1561). See "Arc proximity"
            // tests at samples/unit-tests/svgrenderer/symbol/demo.js
            proximity = 0.0001;

        let paddingInRadiansRaw = radius > 0 ? (padding / radius) : 0;

        if (!paddingInRadiansRaw && !radius && innerRadius && innerRadius > 0) {
            paddingInRadiansRaw = padding / innerRadius;
        }

        const paddingInRadians = Math.min(
            paddingInRadiansRaw,
            Math.abs(rawEnd - rawStart) - proximity
        );

        let start = rawStart ? rawStart + paddingInRadians : 0,
            end = rawEnd ? rawEnd - paddingInRadians : 0;

        // Check if padding can be applied to the arc, prevents small arcs
        // from disappearing
        if (paddingInRadians > 0 && end - start <= minArcRange) {
            const middleAngle = (start + end) / 2;
            start = middleAngle - minArcRange / 2;
            end = middleAngle + minArcRange / 2;
        }

        const rx = pick(options.r, w),
            ry = pick(options.r, h || w),
            fullCircle = (
                Math.abs(end - start - 2 * Math.PI) <
                proximity
            );

        if (fullCircle) {
            start = Math.PI / 2;
            end = Math.PI * 2.5 - proximity;
        }

        const open = pick(options.open, fullCircle),
            cosStart = fullCircle ? 0 : Math.cos(start),
            sinStart = fullCircle ? 1 : Math.sin(start),
            cosEnd = fullCircle ? 0 : Math.cos(end),
            sinEnd = fullCircle ? 1 : Math.sin(end),
            // Proximity takes care of rounding errors around PI (#6971)
            longArc = pick(
                options.longArc,
                end - start - Math.PI < proximity ? 0 : 1
            );

        let arcSegment: SVGPath.Arc = [
            'A', // ArcTo
            rx, // X radius
            ry, // Y radius
            0, // Slanting
            longArc, // Long or short arc
            pick(options.clockwise, 1), // Clockwise
            // Use a static pixel offset for full circle (#21701)
            cx + (fullCircle ? 0.001 : rx * cosEnd),
            cy + ry * sinEnd
        ];
        arcSegment.params = { start, end, cx, cy }; // Memo for border radius
        arc.push(
            [
                'M',
                cx + rx * cosStart,
                cy + ry * sinStart
            ],
            arcSegment
        );

        if (defined(innerRadius)) {
            // Check minimal inner radius value
            const minInnerRadius = (padding * 2) / radianRange;
            const minAcceptableInnerRadius =
                Math.max(innerRadius, radius * 0.5);
            const cInnerRadius = (
                paddingInRadians > 0 && minInnerRadius > innerRadius
            ) ?
                Math.min(minInnerRadius, minAcceptableInnerRadius) :
                innerRadius;
            let innerStart = rawStart;
            let innerEnd = rawEnd;

            if (paddingInRadians > 0) {
                const innerPaddingInRadians = Math.min(
                    padding / cInnerRadius,
                    Math.abs(rawEnd - rawStart) - proximity
                );

                innerStart = rawStart ? rawStart + innerPaddingInRadians : 0;
                innerEnd = rawEnd ? rawEnd - innerPaddingInRadians : 0;

                // Check if pading can be applied to the inner arc
                if (innerEnd < innerStart) {
                    const middleAngle = (innerStart + innerEnd) / 2;
                    innerStart = middleAngle;
                    innerEnd = middleAngle;
                }
            }
            const innerCosStart = fullCircle ? 0 : Math.cos(innerStart),
                innerSinStart = fullCircle ? 1 : Math.sin(innerStart),
                innerCosEnd = fullCircle ? 0 : Math.cos(innerEnd),
                innerSinEnd = fullCircle ? 1 : Math.sin(innerEnd);

            arcSegment = [
                'A', // ArcTo
                innerRadius, // X radius
                innerRadius, // Y radius
                0, // Slanting
                longArc, // Long or short arc
                // Clockwise - opposite to the outer arc clockwise
                defined(options.clockwise) ? 1 - options.clockwise : 0,
                cx + (fullCircle ? -0.001 : cInnerRadius * innerCosStart),
                cy + cInnerRadius * innerSinStart
            ];
            // Memo for border radius
            arcSegment.params = {
                start: rawEnd,
                end: rawStart,
                cx,
                cy,
                innerRadius: cInnerRadius
            };
            arc.push(
                open ?
                    [
                        'M',
                        cx + cInnerRadius * innerCosEnd,
                        cy + cInnerRadius * innerSinEnd
                    ] : [
                        'L',
                        cx + cInnerRadius * innerCosEnd,
                        cy + cInnerRadius * innerSinEnd
                    ],
                arcSegment
            );
        }
        if (!open) {
            arc.push(['Z']);
        }
    }

    return arc;
}

/**
 * Callout shape used for default tooltips.
 *
 * @param {number} x
 * Center X
 * @param {number} y
 * Center Y
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @param {Highcharts.SymbolOptions} [options]
 * Options
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function callout(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const arrowLength = 6,
        halfDistance = 6,
        r = Math.min((options?.r) || 0, w, h),
        safeDistance = r + halfDistance,
        anchorX = options?.anchorX,
        anchorY = options?.anchorY || 0;

    const path = roundedRect(x, y, w, h, { r });

    if (!isNumber(anchorX)) {
        return path;
    }

    // Do not render a connector, if anchor starts inside the label
    if (anchorX < w && anchorX > 0 && anchorY < h && anchorY > 0) {
        return path;
    }

    // Anchor on right side
    if (x + anchorX > w - safeDistance) {

        // Chevron
        if (
            anchorY > y + safeDistance &&
            anchorY < y + h - safeDistance
        ) {
            path.splice(
                3,
                1,
                ['L', x + w, anchorY - halfDistance],
                ['L', x + w + arrowLength, anchorY],
                ['L', x + w, anchorY + halfDistance],
                ['L', x + w, y + h - r]
            );

        // Simple connector
        } else {
            if (anchorX < w) { // Corner connector
                const isTopCorner = anchorY < y + safeDistance,
                    cornerY = isTopCorner ? y : y + h,
                    sliceStart = isTopCorner ? 2 : 5;

                path.splice(
                    sliceStart,
                    0,
                    ['L', anchorX, anchorY],
                    ['L', x + w - r, cornerY]
                );
            } else { // Side connector
                path.splice(
                    3,
                    1,
                    ['L', x + w, h / 2],
                    ['L', anchorX, anchorY],
                    ['L', x + w, h / 2],
                    ['L', x + w, y + h - r]
                );
            }
        }

    // Anchor on left side
    } else if (x + anchorX < safeDistance) {

        // Chevron
        if (
            anchorY > y + safeDistance &&
            anchorY < y + h - safeDistance
        ) {
            path.splice(
                7,
                1,
                ['L', x, anchorY + halfDistance],
                ['L', x - arrowLength, anchorY],
                ['L', x, anchorY - halfDistance],
                ['L', x, y + r]
            );

        // Simple connector
        } else {
            if (anchorX > 0) { // Corner connector
                const isTopCorner = anchorY < y + safeDistance,
                    cornerY = isTopCorner ? y : y + h,
                    sliceStart = isTopCorner ? 1 : 6;

                path.splice(
                    sliceStart,
                    0,
                    ['L', anchorX, anchorY],
                    ['L', x + r, cornerY]
                );
            } else { // Side connector
                path.splice(
                    7,
                    1,
                    ['L', x, h / 2],
                    ['L', anchorX, anchorY],
                    ['L', x, h / 2],
                    ['L', x, y + r]
                );
            }
        }

    } else if ( // Replace bottom
        anchorY > h &&
        anchorX < w - safeDistance
    ) {
        path.splice(
            5,
            1,
            ['L', anchorX + halfDistance, y + h],
            ['L', anchorX, y + h + arrowLength],
            ['L', anchorX - halfDistance, y + h],
            ['L', x + r, y + h]
        );

    } else if ( // Replace top
        anchorY < 0 &&
        anchorX > safeDistance
    ) {
        path.splice(
            1,
            1,
            ['L', anchorX - halfDistance, y],
            ['L', anchorX, y - arrowLength],
            ['L', anchorX + halfDistance, y],
            ['L', w - r, y]
        );
    }

    return path;
}


/**
 * Circle symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function circle(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    // Return a full arc
    return arc(x + w / 2, y + h / 2, w / 2, h / 2, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        open: false
    });
}

/**
 * Diamond symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function diamond(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x + w / 2, y],
        ['L', x + w, y + h / 2],
        ['L', x + w / 2, y + h],
        ['L', x, y + h / 2],
        ['Z']
    ];
}

// #15291

/**
 * Rect symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @param {Highcharts.SymbolOptions} [options]
 * Options
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function rect(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    if (options?.r) {
        return roundedRect(x, y, w, h, options);
    }
    return [
        ['M', x, y],
        ['L', x + w, y],
        ['L', x + w, y + h],
        ['L', x, y + h],
        ['Z']
    ];
}


/**
 * Rounded rectangle symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @param {Highcharts.SymbolOptions} [options]
 * Options
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const r = options?.r || 0;
    return [
        ['M', x + r, y],
        ['L', x + w - r, y], // Top side
        ['A', r, r, 0, 0, 1, x + w, y + r], // Top-right corner
        ['L', x + w, y + h - r], // Right side
        ['A', r, r, 0, 0, 1, x + w - r, y + h], // Bottom-right corner
        ['L', x + r, y + h], // Bottom side
        ['A', r, r, 0, 0, 1, x, y + h - r], // Bottom-left corner
        ['L', x, y + r], // Left side
        ['A', r, r, 0, 0, 1, x + r, y],
        ['Z'] // Top-left corner
    ];
}


/**
 * Triangle symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function triangle(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x + w / 2, y],
        ['L', x + w, y + h],
        ['L', x, y + h],
        ['Z']
    ];
}


/**
 * Inverted triangle symbol path.
 *
 * @param {number} x
 * X coordinate
 * @param {number} y
 * Y coordinate
 * @param {number} w
 * Width
 * @param {number} h
 * Height
 * @return {Highcharts.SVGPathArray}
 * Path
 */
function triangleDown(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x, y],
        ['L', x + w, y],
        ['L', x + w / 2, y + h],
        ['Z']
    ];
}

/* *
 *
 *  Registry
 *
 * */

declare module './SymbolType' {
    interface SymbolTypeRegistry {
        arc: typeof arc;
        callout: typeof callout;
        circle: typeof circle;
        diamond: typeof diamond;
        rect: typeof rect;
        roundedRect: typeof roundedRect;
        square: typeof rect;
        triangle: typeof triangle;
        'triangle-down': typeof triangleDown;
    }
}

const Symbols: SymbolTypeRegistry = {

    /**
     * Arc symbol path.
     *
     * @param {number} cx
     * Center X
     * @param {number} cy
     * Center Y
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @param {Highcharts.SymbolOptions} [options]
     * Options
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    arc,

    /**
     * Callout shape used for default tooltips.
     *
     * @param {number} cx
     * Center X
     * @param {number} cy
     * Center Y
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @param {Highcharts.SymbolOptions} [options]
     * Options
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    callout,

    /**
     * Circle symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    circle,

    /**
     * Diamond symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    diamond,

    /**
     * Rect symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @param {Highcharts.SymbolOptions} [options]
     * Options
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    rect,

    /**
     * Rounded rectangle symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @param {Highcharts.SymbolOptions} [options]
     * Options
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    roundedRect,

    /**
     * Rect symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @param {Highcharts.SymbolOptions} [options]
     * Options
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    square: rect,

    /**
     * Triangle symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} y
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    triangle,

    /**
     * Inverted triangle symbol path.
     *
     * @param {number} x
     * X coordinate
     * @param {number} number
     * Y coordinate
     * @param {number} w
     * Width
     * @param {number} h
     * Height
     * @return {Highcharts.SVGPathArray}
     * Path
     */
    'triangle-down': triangleDown
} as SymbolTypeRegistry;

/* *
 *
 *  Default Export
 *
 * */

export default Symbols;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @interface Highcharts.SymbolOptions
 *//**
 * @name anchorX
 * @type {number|undefined}
 *//**
 * @name anchorY
 * @type {number|undefined}
 *//**
 * @name backgroundSize
 * @type {"contain"|"cover"|"within"}
 *//**
 * @name clockwise
 * @type {0|1|undefined}
 *//**
 * @name context
 * @type {string|undefined}
 *//**
 * @name end
 * @type {number|undefined}
 *//**
 * @name height
 * @type {number|undefined}
 *//**
 * @name innerR
 * @type {number|undefined}
 *//**
 * @name longArc
 * @type {0|1|undefined}
 *//**
 * @name open
 * @type {boolean|undefined}
 *//**
 * @name r
 * @type {number|undefined}
 *//**
 * @name start
 * @type {number|undefined}
 *//**
 * @name width
 * @type {number|undefined}
 *//**
 * @name x
 * @type {number|undefined}
 *//**
 * @name y
 * @type {number|undefined}
 */

''; // Keeps doclets above in file
