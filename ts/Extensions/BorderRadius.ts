/* *
 *
 *  Highcharts Border Radius module
 *
 *  Author: Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ColumnSeries from '../Series/Column/ColumnSeries';
import type SymbolOptions from '../Core/Renderer/SVG/SymbolOptions';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';


const {
    addEvent,
    isObject,
    merge,
    pick,
    relativeLength
} = U;

export interface BorderRadiusOptions {
    radius: number|string;
    scope: 'point'|'stack';
    where?: 'end'|'all';
}

/*
interface CurvePoints {
    start: [number, number];
    end: [number, number];
    cp1: [number, number];
    cp2: [number, number];
}
*/
/**
 * Internal types
 * @private
 */
declare module '../Core/Renderer/SVG/SVGAttributes' {
    interface SVGAttributes {
        borderRadius?: number|string;
    }
}

declare module '../Core/Renderer/SVG/SymbolOptions' {
    interface SymbolOptions {
        borderRadius?: number|string;
    }
}

const defaultOptions: BorderRadiusOptions = {
    radius: 0,
    scope: 'stack',
    where: void 0
};

const optionsToObject = (
    options?: number|string|Partial<BorderRadiusOptions>
): BorderRadiusOptions => {
    if (!isObject(options)) {
        options = { radius: options || 0 };
    }
    return merge(defaultOptions, options);
};

/*
 * @todo
 * - Automate lineIsOutsideCircle
 * - Refactor and reuse circle handling
 * - Proper typing of SVGPathElement
 */
const applyBorderRadius = (
    path: SVGPath,
    i: number,
    r: number,
    lineIsOutsideCircle?: boolean
): void => {
    const a = path[i];

    let b = path[i + 1];
    if (b[0] === 'Z') {
        b = path[0];
    }

    // Straight line to arc
    if ((a[0] === 'M' || a[0] === 'L') && b[0] === 'A' && b.params) {
        const bigR = b[1],
            { start, cx, cy } = b.params;

        // Use the previous ending point to determine if the incoming line is
        // inside or outside the arc
        let prev = path[i - 1];
        if (!prev && path[path.length - 1][0] === 'Z') {
            prev = path[path.length - 2];
        }
        if (prev[0] === 'L' || prev[0] === 'A') {
            lineIsOutsideCircle = Math.sqrt(
                (cx - (prev[prev.length - 2] as number)) ** 2 +
                (cy - (prev[prev.length - 1] as number)) ** 2
            ) > bigR;
        }


        const relativeR = lineIsOutsideCircle ? (bigR + r) : (bigR - r);

        const angleOfBorderRadius = Math.asin(r / relativeR);
        const distanceBigCenterToStartArc = (
            Math.cos(angleOfBorderRadius) *
            relativeR
        );

        // First move to the start position along the perimeter. But we want to
        // start one borderRadius closer to the center.
        a[1] = cx + distanceBigCenterToStartArc * Math.cos(start);
        a[2] = cy + distanceBigCenterToStartArc * Math.sin(start);

        // Now draw an arc towards the point where the small circle touches the
        // great circle.
        const startBigArc = start + (
            lineIsOutsideCircle ? -angleOfBorderRadius : angleOfBorderRadius
        );
        path.splice(i + 1, 0, [
            'A',
            r,
            r,
            0, // slanting,
            0, // long arc
            1, // clockwise
            cx + bigR * Math.cos(startBigArc),
            cy + bigR * Math.sin(startBigArc)
        ]);

    // Arc to straight line
    } else if (a[0] === 'A' && a.params && (b[0] === 'M' || b[0] === 'L')) {
        const bigR = a[1],
            { start, end, cx, cy } = a.params;

        const lineIsOutsideCircle = Math.sqrt(
            (cx - b[1]) ** 2 + (cy - b[2]) ** 2
        ) > bigR;

        const relativeR = lineIsOutsideCircle ? (bigR + r) : (bigR - r);

        const angleOfBorderRadius = Math.asin(r / relativeR);
        const distanceBigCenterToStartArc = (
            Math.cos(angleOfBorderRadius) *
            relativeR
        );
        const endBigArc = end - (
            lineIsOutsideCircle ? -angleOfBorderRadius : angleOfBorderRadius
        );

        // Long or short arc must be reconsidered
        // because we have modified the start and end points
        a[4] = end - start < Math.PI ? 0 : 1;

        // End the big arc a bit earlier
        a[6] = cx + bigR * Math.cos(endBigArc);
        a[7] = cy + bigR * Math.sin(endBigArc);

        // Draw a small arc towards a point on the end angle, but one
        // borderRadius closer to the center relative to the perimeter.
        path.splice(i + 1, 0, [
            'A',
            r,
            r,
            0,
            0,
            1,
            cx + distanceBigCenterToStartArc * Math.cos(end),
            cy + distanceBigCenterToStartArc * Math.sin(end)
        ]);

    }
};

// Check if the module has already been imported
if (SVGElement.symbolCustomAttribs.indexOf('borderRadius') === -1) {

    SVGElement.symbolCustomAttribs.push('borderRadius');

    // Extend arc with borderRadius
    const arc = SVGRenderer.prototype.symbols.arc;
    SVGRenderer.prototype.symbols.arc = function (
        x: number,
        y: number,
        w: number,
        h: number,
        options: SymbolOptions = {}
    ): SVGPath {
        const path = arc(x, y, w, h, options),
            { innerR = 0, r = 0, start = 0, end = 0 } = options;

        if (options.open || !options.borderRadius) {
            return path;
        }

        const alpha = end - start,
            borderRadius = Math.max(Math.min(
                relativeLength(options.borderRadius || 0, r - innerR),
                // Cap to half the sector radius
                (r - innerR) / 2,
                // For smaller pie slices, cap to the largest small circle that
                // can be fitted within the sector
                (r * Math.sin(alpha / 2)) / (1 + Math.sin(alpha / 2))
            ), 0);

        // Apply turn-by-turn border radius. Start at the end since we're
        // splicing in arc segments.
        let i = path.length - 1;
        while (i--) {
            applyBorderRadius(path, i, borderRadius);
        }

        return path;
    };

    addEvent(seriesTypes.pie, 'afterTranslate', function (): void {
        const borderRadius = optionsToObject(this.options.borderRadius);

        for (const point of this.points) {
            const shapeArgs = point.shapeArgs;
            if (shapeArgs) {
                shapeArgs.borderRadius = relativeLength(
                    borderRadius.radius,
                    (shapeArgs.r || 0) - ((shapeArgs.innerR) || 0)
                );
            }
        }
    });

    addEvent(
        Series as unknown as ColumnSeries,
        'afterColumnTranslate',
        function (): void {
            if (
                this.options.borderRadius &&
                !this.is('xrange') &&
                !(this.chart.is3d && this.chart.is3d())
            ) {
                const yAxis = this.yAxis,
                    inverted = this.chart.inverted,
                    borderRadius = optionsToObject(this.options.borderRadius),
                    reversed = yAxis.options.reversed;

                for (const point of this.points) {
                    if (point.shapeType === 'rect') {
                        const {
                            width = 0,
                            height = 0,
                            x = 0,
                            y = 0
                        } = point.shapeArgs || {};

                        let stackY = y,
                            stackHeight = height;

                        if (
                            borderRadius.scope === 'stack' &&
                            point.stackTotal
                        ) {
                            const stackEnd = yAxis.translate(
                                    point.stackTotal, false, true, false, true
                                ),
                                stackThreshold = yAxis.translate(
                                    this.options.threshold || 0,
                                    false,
                                    true,
                                    false,
                                    true
                                ),
                                box = this.crispCol(
                                    0,
                                    Math.min(stackEnd, stackThreshold),
                                    0,
                                    Math.abs(stackEnd - stackThreshold)
                                );
                            stackY = box.y;
                            stackHeight = box.height;
                        }

                        // Get the radius
                        const r = Math.min(
                                relativeLength(borderRadius.radius, width),
                                width / 2
                            ) || 0,
                            flip = (point.negative ? -1 : 1) *
                                (reversed ? -1 : 1) === -1;

                        // where = 'end'
                        let rTop = flip ? 0 : r,
                            rBtm = flip ? r : 0;

                        // Handle the where option
                        let where = borderRadius.where;

                        // Columnrange
                        if (
                            !where && this.pointArrayMap?.join(',') ===
                            'low,high'
                        ) {
                            where = 'all';
                        }

                        // Waterfall, hanging columns should have rounding on
                        // all sides
                        if (
                            !where &&
                            this.is('waterfall') &&
                            Math.abs(
                                (point.yBottom || 0) -
                                (this.translatedThreshold || 0)
                            ) > this.borderWidth
                        ) {
                            where = 'all';
                        }

                        if (!where) {
                            where = 'end';
                        }

                        if (where === 'all') {
                            rTop = rBtm = r;
                        }

                        // Deep in stack, cancel rounding
                        if (rTop && rTop < y - stackY) {
                            rTop = 0;
                        }
                        if (
                            rBtm && rBtm < (stackY + stackHeight) - (y + height)
                        ) {
                            rBtm = 0;
                        }

                        // Radius exceeds the available height => decrease
                        // radius
                        if (rTop > 0 && rBtm > 0 && rTop + rBtm > stackHeight) {
                            rTop = rBtm = stackHeight / 2;
                        }


                        /*

                        The naming of control points:

                        / a -------- b \
                        /                \
                        h                  c
                        |                  |
                        |                  |
                        |                  |
                        g                  d
                        \                /
                        \ f -------- e /

                        */

                        const a: [number, number] = [x + rTop, y],
                            b: [number, number] = [x + width - rTop, y],
                            c: [number, number] = [x + width, y + rTop],
                            d: [number, number] = [
                                x + width, y + height - rBtm
                            ],
                            e: [number, number] = [
                                x + width - rBtm,
                                y + height
                            ],
                            f: [number, number] = [x + rBtm, y + height],
                            g: [number, number] = [x, y + height - rBtm],
                            h: [number, number] = [x, y + rTop];

                        const applyPythagoras = (
                            r: number,
                            altitude: number
                        ): number => Math.sqrt(
                            Math.pow(r, 2) - Math.pow(altitude, 2)
                        );

                        // Inside stacks, cut off part of the top
                        const cutTop = rTop && y - stackY;
                        if (cutTop) {
                            const base = applyPythagoras(rTop, rTop - cutTop);
                            a[0] -= base;
                            b[0] += base;
                            c[1] = h[1] = y + rTop - cutTop;
                        }

                        // Column is lower than the radius. Cut off bottom
                        // inside the top radius.
                        if (height < rTop - cutTop) {
                            const base = applyPythagoras(
                                rTop, rTop - cutTop - height
                            );
                            c[0] = d[0] = x + width - rTop + base;
                            e[0] = Math.min(c[0], e[0]);
                            f[0] = Math.max(d[0], f[0]);
                            g[0] = h[0] = x + rTop - base;
                            c[1] = h[1] = y + height;
                        }

                        // Inside stacks, cut off part of the bottom
                        const cutBtm = rBtm && (stackY + stackHeight) -
                            (y + height);
                        if (cutBtm) {
                            const base = applyPythagoras(rBtm, rBtm - cutBtm);
                            e[0] += base;
                            f[0] -= base;
                            d[1] = g[1] = y + height - rBtm + cutBtm;
                        }

                        // Cut off top inside the bottom radius
                        if (height < rBtm - cutBtm) {
                            const base = applyPythagoras(
                                rBtm, rBtm - cutBtm - height
                            );
                            c[0] = d[0] = x + width - rBtm + base;
                            b[0] = Math.min(c[0], b[0]);
                            a[0] = Math.max(d[0], a[0]);
                            g[0] = h[0] = x + rBtm - base;
                            d[1] = g[1] = y;
                        }

                        // Preserve the box for data labels
                        point.dlBox = { x, y, width, height };

                        point.shapeType = 'path';
                        point.shapeArgs = {
                            d: [
                                ['M', ...a],
                                // top side
                                ['L', ...b],
                                // top right corner
                                ['A', rTop, rTop, 0, 0, 1, ...c],
                                // right side
                                ['L', ...d],
                                // bottom right corner
                                ['A', rBtm, rBtm, 0, 0, 1, ...e],
                                // bottom side
                                ['L', ...f],
                                // bottom left corner
                                ['A', rBtm, rBtm, 0, 0, 1, ...g],
                                // left side
                                ['L', ...h],
                                // top left corner
                                ['A', rTop, rTop, 0, 0, 1, ...a],
                                ['Z']
                            ]
                        };

                    // Polar column and polar bar
                    } else if (point.shapeType === 'arc') {
                        const shapeArgs = point.shapeArgs;
                        if (shapeArgs) {
                            // The arc extension (above) takes over
                            shapeArgs.borderRadius = relativeLength(
                                borderRadius.radius,
                                (shapeArgs.r || 0) -
                                    ((inverted && shapeArgs.innerR) || 0)
                            );
                        }
                    }
                }
            }
        },
        {
            // After columnrange and polar column modifications
            order: 9
        }
    );
}

const BorderRadius = {
    optionsToObject
};

export default BorderRadius;
