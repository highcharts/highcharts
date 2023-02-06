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
declare module '../Core/Renderer/SVG/SymbolOptions' {
    interface SymbolOptions {
        borderRadius?: number;
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

// Extend arc with borderRadius
const arc = SVGRenderer.prototype.symbols.arc;
SVGRenderer.prototype.symbols.arc = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const path = arc(x, y, w, h, options),
        { innerR, r, start, end } = options || {};

    if (
        options &&
        typeof r === 'number' &&
        typeof start === 'number' &&
        typeof end === 'number'
    ) {
        const alpha = end - start,
            borderRadius = Math.min(
                options.borderRadius || 0,
                // Cap to half the sector radius
                (r - (options.innerR || 0)) / 2,
                // For smaller pie slices, cap to the largest small circle that
                // can be fitted within the sector
                (r * Math.sin(alpha / 2)) / (1 + Math.sin(alpha / 2))
            ),
            angleOfBorderRadius = Math.asin(borderRadius / (r - borderRadius)),
            distanceBigCenterToStartArc = (
                Math.cos(angleOfBorderRadius) *
                (r - borderRadius)
            );


        // First move to the start position along the perimeter. But we want to
        // start one borderRadius closer to the center.
        if (path[0] && path[0][0] === 'M') {
            path[0][1] = x + distanceBigCenterToStartArc * Math.cos(start);
            path[0][2] = y + distanceBigCenterToStartArc * Math.sin(start);
        }

        // Now draw an arc towards the point where the small circle touches the
        // great circle.
        path.splice(1, 0, [
            'A',
            borderRadius,
            borderRadius,
            0, // slanting,
            0, // long arc
            1, // clockwise
            x + r * Math.cos(start + angleOfBorderRadius),
            y + r * Math.sin(start + angleOfBorderRadius)
        ]);

        // The main outer arc should stop where the next small circle touches
        // the great circle.
        if (path[2] && path[2][0] === 'A') {
            path[2][6] = x + r * Math.cos(end - angleOfBorderRadius);
            path[2][7] = y + r * Math.sin(end - angleOfBorderRadius);
        }

        // Draw an arc towards a point on the end angle, but one borderRadius
        // closer to the center relative to the perimeter.
        path.splice(3, 0, [
            'A',
            borderRadius,
            borderRadius,
            0,
            0,
            1,
            x + distanceBigCenterToStartArc * Math.cos(end),
            y + distanceBigCenterToStartArc * Math.sin(end)
        ]);
    }

    return path;
};
SVGElement.symbolCustomAttribs.push('borderRadius');

addEvent(seriesTypes.pie, 'afterTranslate', function (): void {
    const borderRadius = optionsToObject(this.options.borderRadius);

    for (const point of this.points) {
        const shapeArgs = point.shapeArgs as SymbolOptions|undefined;
        if (shapeArgs) {
            shapeArgs.borderRadius = relativeLength(
                borderRadius.radius, shapeArgs.r || 0
            );
        }
    }
});

addEvent(Series as unknown as ColumnSeries, 'afterColumnTranslate', function (
): void {
    const yAxis = this.yAxis,
        borderRadius = optionsToObject(this.options.borderRadius),
        reversed = yAxis.options.reversed;

    for (const point of this.points) {
        const { width = 0, height = 0, x = 0, y = 0 } = point.shapeArgs || {};

        let stackY = y,
            stackHeight = height;

        if (borderRadius.scope === 'stack' && point.stackTotal) {
            const stackEnd = yAxis.translate(
                    point.stackTotal, false, true, false, true
                ),
                stackThreshold = yAxis.translate(
                    this.options.threshold || 0, false, true, false, true
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
            flip = (point.negative ? -1 : 1) * (reversed ? -1 : 1) === -1;

        // where = 'end'
        let rTop = flip ? 0 : r,
            rBtm = flip ? r : 0;

        // All corners
        const where = borderRadius.where || (
            this.pointArrayMap?.join(',') === 'low,high' ? 'all' : 'end'
        );
        if (where === 'all') {
            rTop = rBtm = r;
        }

        // Deep in stack, cancel rounding
        if (rTop && rTop < y - stackY) {
            rTop = 0;
        }
        if (rBtm && rBtm < (stackY + stackHeight) - (y + height)) {
            rBtm = 0;
        }

        // Radius exceeds the available height => decrease radius
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
            d: [number, number] = [x + width, y + height - rBtm],
            e: [number, number] = [x + width - rBtm, y + height],
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

        // Column is lower than the radius. Cut off bottom inside the top
        // radius.
        if (height < rTop - cutTop) {
            const base = applyPythagoras(rTop, rTop - cutTop - height);
            c[0] = d[0] = x + width - rTop + base;
            e[0] = Math.min(c[0], e[0]);
            f[0] = Math.max(d[0], f[0]);
            g[0] = h[0] = x + rTop - base;
            c[1] = h[1] = y + height;
        }

        // Inside stacks, cut off part of the bottom
        const cutBtm = rBtm && (stackY + stackHeight) - (y + height);
        if (cutBtm) {
            const base = applyPythagoras(rBtm, rBtm - cutBtm);
            e[0] += base;
            f[0] -= base;
            d[1] = g[1] = y + height - rBtm + cutBtm;
        }

        // Cut off top inside the bottom radius
        if (height < rBtm - cutBtm) {
            const base = applyPythagoras(rBtm, rBtm - cutBtm - height);
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

    }
}, { order: 9 });
