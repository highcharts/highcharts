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

import type ColumnSeries from '../Series/Column/ColumnSeries.js';

import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import U from '../Core/Utilities.js';

const {
    isObject,
    merge,
    relativeLength,
    wrap
} = U;

export interface BorderRadiusOptions {
    radius: number|string;
    scope: 'point'|'stack';
    where: 'end'|'all';
}

const defaultOptions: BorderRadiusOptions = {
    radius: 0,
    scope: 'stack',
    where: 'end'
};

const optionsToObject = (
    options?: number|string|Partial<BorderRadiusOptions>
): BorderRadiusOptions => {
    if (!isObject(options)) {
        options = { radius: options || 0 };
    }
    return merge(defaultOptions, options);
};

wrap(seriesTypes.column.prototype, 'translate', function (
    this: ColumnSeries,
    proceed
): void {
    proceed.call(this);

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
        if (borderRadius.where === 'all') {
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
});
